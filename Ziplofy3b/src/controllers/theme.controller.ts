// @ts-nocheck
import { Request, Response } from "express";
import fs from "fs";
import mongoose, { Types } from "mongoose";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { InstalledThemes } from "../models/installed-themes.model";
import { Theme } from "../models/theme.model";
import { CustomTheme } from "../models/custom-theme.model";
import { Store } from "../models/store/store.model";
import { EditVerificationOtp } from "../models/edit-verification-otp.model";
import { Role } from "../models/role.model";
import { User } from "../models/user.model";
import { asyncErrorHandler, CustomError } from "../utils/error.utils";
import { logActivity } from "../utils/activity-log.utils";
import { canonicalStoreRef, storeAndUserScopeOr } from "../utils/installed-themes-query.util";
import {
  assertStagingFolderAndAuxiliaryKeys,
  assertStagingKeys,
  collectCatalogAssetKeysAsync,
  deleteS3Keys,
  downloadS3KeyToFile,
  promoteStagingAuxiliaryToCatalog,
  promoteStagingThemeAssetsToCatalog,
  promoteStagingThemeFolderToCatalog,
  stagingThemeFileKey,
} from "../utils/theme-s3-ingest";
import { downloadS3PrefixToLocalDir, downloadS3ZipAndExtractToDir } from "../utils/theme-zip-from-s3.util";
import { tmpdir } from "os";
import archiver from "archiver";

function makeThemePathSlug(themeName: string): string {
  const base =
    themeName
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "theme";
  return `${base}-${uuidv4().slice(0, 8)}`;
}

/** Cached catalog theme sources under OS temp (ZIP extract or S3 folder sync; not uploads/). */
async function ensureCatalogThemeCodeDir(theme: {
  _id: any;
  s3Assets?: {
    zip?: { key?: string };
    contentRoot?: { prefix?: string; fileCount?: number };
  };
}): Promise<string> {
  const id = String(theme._id);
  const zipKey = theme.s3Assets?.zip?.key;
  const folderPrefix = theme.s3Assets?.contentRoot?.prefix;
  if (!zipKey && !folderPrefix) throw new CustomError("Theme has no S3 package", 404);

  const cacheRoot = path.join(tmpdir(), "ziplofy-catalog-themes", id);
  const codeDir = path.join(cacheRoot, "code");
  const metaPath = path.join(cacheRoot, ".meta.json");

  const mode = zipKey ? "zip" : "folder";
  const ref = zipKey ?? folderPrefix ?? "";
  const folderFileCount = theme.s3Assets?.contentRoot?.fileCount;

  let skip = false;
  if (fs.existsSync(metaPath)) {
    try {
      const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
      if (
        meta.mode === mode &&
        meta.ref === ref &&
        (mode !== "folder" || meta.folderFileCount === folderFileCount) &&
        fs.existsSync(codeDir) &&
        fs.readdirSync(codeDir).length > 0
      ) {
        skip = true;
      }
    } catch {
      /* re-sync */
    }
  }
  if (!skip) {
    if (fs.existsSync(cacheRoot)) fs.rmSync(cacheRoot, { recursive: true, force: true });
    fs.mkdirSync(codeDir, { recursive: true });
    if (zipKey) {
      await downloadS3ZipAndExtractToDir(zipKey, codeDir);
    } else {
      await downloadS3PrefixToLocalDir(folderPrefix!, codeDir);
    }
    fs.writeFileSync(
      metaPath,
      JSON.stringify({
        mode,
        ref,
        folderFileCount: mode === "folder" ? folderFileCount : undefined,
        ts: Date.now(),
      })
    );
  }
  return codeDir;
}

function resolveThemeThumbnailUrl(_req: Request, theme: any) {
  return theme?.s3Assets?.thumbnail?.url || null;
}

function resolveThemeZipUrl(_req: Request, theme: any) {
  return theme?.s3Assets?.zip?.url || null;
}

/** Normalize a theme document for list/detail APIs (S3-first catalog shape). */
function formatThemeForClient(theme: any) {
  const obj = theme?.toObject ? theme.toObject() : { ...theme };
  const s3 = obj.s3Assets ?? {};
  const hasFolder = Boolean(s3.contentRoot?.prefix);
  const hasZip = Boolean(s3.zip?.key);
  return {
    _id: obj._id,
    name: obj.name,
    description: obj.description,
    category: obj.category,
    plan: obj.plan,
    price: obj.price,
    version: obj.version,
    tags: obj.tags,
    themePath: obj.themePath,
    isActive: obj.isActive,
    downloads: obj.downloads,
    installationCount: obj.installationCount,
    rating: obj.rating,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
    uploadBy: obj.uploadBy,
    s3Assets: s3,
    thumbnailUrl: s3.thumbnail?.url ?? null,
    zipUrl: s3.zip?.url ?? null,
    packageType: hasFolder ? ("folder" as const) : hasZip ? ("zip" as const) : null,
    contentFileCount: hasFolder ? s3.contentRoot?.fileCount ?? 0 : undefined,
    hasRemoteTheme: Boolean(s3.reactThemeJs?.key || s3.reactThemeCss?.key),
    previewUrl: s3.zip?.url ?? null,
  };
}

interface GetThemesQuery {
  search?: string;
  category?: string;
  plan?: string;
  page?: string;
  limit?: string;
  sort?: string;
  order?: string;
}

export const getThemes = asyncErrorHandler(async (req: Request, res: Response) => {
  const {
    search,
    category,
    plan,
    page = "1",
    limit = "10",
    sort = "createdAt",
    order = "desc",
  } = req.query as GetThemesQuery;

  // Build filter object
  const filter: any = { isActive: true };

  if (search) {
    filter.$text = { $search: search };
  }

  if (category && category !== "all") {
    filter.category = category;
  }

  if (plan && plan !== "all") {
    filter.plan = plan;
  }

  // Sort configuration
  const sortConfig: any = {};
  sortConfig[sort] = order === "desc" ? -1 : 1;

  const limitNum = parseInt(limit);
  const pageNum = parseInt(page);

  const themes = await Theme.find(filter)
    .populate("uploadBy", "name email")
    .limit(limitNum)
    .skip((pageNum - 1) * limitNum)
    .sort(sortConfig)
    .lean();

  const count = await Theme.countDocuments(filter);
  const data = themes.map((t) => formatThemeForClient(t));

  res.status(200).json({
    success: true,
    data,
    totalPages: Math.ceil(count / limitNum),
    currentPage: pageNum,
    total: count,
  });
});

// Public paginated list including thumbnailUrl and zipUrl
export const getAllThemesPublic = asyncErrorHandler(async (req: Request, res: Response) => {
  const {
    search,
    category,
    plan,
    page = "1",
    limit = "10",
    sort = "createdAt",
    order = "desc",
  } = req.query as GetThemesQuery;

  const filter: any = { isActive: true };
  if (search) filter.$text = { $search: search };
  if (category && category !== "all") filter.category = category;
  if (plan && plan !== "all") filter.plan = plan;

  const sortConfig: any = {};
  sortConfig[sort] = order === "desc" ? -1 : 1;

  const docs = await Theme.find(filter)
    .populate("uploadBy", "name email")
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit))
    .sort(sortConfig)
    .lean();

  const count = await Theme.countDocuments(filter);

  const mapped = docs.map((t: any) => formatThemeForClient(t));

  res.status(200).json({
    success: true,
    data: mapped,
    totalPages: Math.ceil(count / parseInt(limit)),
    currentPage: parseInt(page),
    total: count,
  });
});

interface GetThemeParams {
  id: string;
}

export const getTheme = asyncErrorHandler(async (req: Request, res: Response) => {
  const { id } = req.params as unknown as GetThemeParams;

  const theme = await Theme.findById(id).populate("uploadBy", "name email");

  if (!theme) {
    throw new CustomError("Theme not found", 404);
  }

  res.status(200).json({
    success: true,
    data: formatThemeForClient(theme),
  });
});

interface CreateThemeBody {
  name: string;
  description?: string;
  category: string;
  plan: string;
  price?: number;
  version?: string;
  tags?: string;
}

export const createTheme = asyncErrorHandler(async (_req: Request, res: Response) => {
  res.status(410).json({
    success: false,
    message:
      "Multipart theme upload is no longer supported. Upload assets with presigned PUT to S3, then POST /api/themes/from-s3 with s3 keys.",
  });
});

interface CreateThemeFromS3Body extends CreateThemeBody {
  s3SessionId: string;
  s3: {
    zipKey?: string;
    files?: { key: string; relativePath: string }[];
    thumbnailKey?: string;
    reactJsKey?: string;
    reactCssKey?: string;
  };
}

/** Create catalog theme: copy browser-staged S3 objects into themes/catalog/{id}/… (no local uploads/). */
export const createThemeFromS3 = asyncErrorHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id as string | undefined;
  if (!userId) {
    throw new CustomError("Unauthorized", 401);
  }

  const {
    name,
    description,
    category,
    plan,
    price,
    version,
    tags,
    s3SessionId,
    s3,
  } = req.body as CreateThemeFromS3Body;

  if (!name || !category || !plan) {
    throw new CustomError("name, category, and plan are required", 400);
  }
  if (!s3SessionId || typeof s3SessionId !== "string") {
    throw new CustomError("s3SessionId is required (same value used when requesting signed URLs)", 400);
  }
  if (!s3 || typeof s3 !== "object") {
    throw new CustomError("s3 payload is required", 400);
  }

  const hasZip = typeof s3.zipKey === "string" && s3.zipKey.length > 0;
  const hasFiles = Array.isArray(s3.files) && s3.files.length > 0;
  if (hasZip === hasFiles) {
    throw new CustomError("Provide exactly one of: s3.zipKey (legacy ZIP) or s3.files (folder upload)", 400);
  }

  const newId = new Types.ObjectId();
  const themePath = makeThemePathSlug(name);

  let stagingKeys: string[];
  let s3Assets: any;

  try {
    if (hasZip) {
      stagingKeys = assertStagingKeys(
        {
          zipKey: s3.zipKey as string,
          thumbnailKey: s3.thumbnailKey,
          reactJsKey: s3.reactJsKey,
          reactCssKey: s3.reactCssKey,
        },
        userId,
        s3SessionId
      );
      s3Assets = await promoteStagingThemeAssetsToCatalog(newId.toString(), {
        zipKey: s3.zipKey as string,
        thumbnailKey: s3.thumbnailKey,
        reactJsKey: s3.reactJsKey,
        reactCssKey: s3.reactCssKey,
      });
    } else {
      const files = s3.files as { key: string; relativePath: string }[];
      for (const f of files) {
        if (!f.key || typeof f.key !== "string" || !f.relativePath || typeof f.relativePath !== "string") {
          throw new CustomError("Each s3.files entry requires key and relativePath", 400);
        }
        const expected = stagingThemeFileKey(userId, s3SessionId, f.relativePath);
        if (f.key !== expected) {
          throw new CustomError("s3.files key does not match relativePath for this session", 400);
        }
      }
      stagingKeys = assertStagingFolderAndAuxiliaryKeys(
        files,
        {
          thumbnailKey: s3.thumbnailKey,
          reactJsKey: s3.reactJsKey,
          reactCssKey: s3.reactCssKey,
        },
        userId,
        s3SessionId
      );
      const folderPart = await promoteStagingThemeFolderToCatalog(
        newId.toString(),
        files.map((f) => ({ key: f.key, relativePath: f.relativePath }))
      );
      const aux = await promoteStagingAuxiliaryToCatalog(newId.toString(), {
        thumbnailKey: s3.thumbnailKey,
        reactJsKey: s3.reactJsKey,
        reactCssKey: s3.reactCssKey,
      });
      s3Assets = { ...folderPart, ...aux };
    }
  } catch (promoteErr: any) {
    console.error("[createThemeFromS3] promote staging → catalog failed:", promoteErr);
    if (promoteErr instanceof CustomError) throw promoteErr;
    throw new CustomError(
      `Could not finalize theme files in S3: ${promoteErr?.message || "unknown error"}`,
      500
    );
  }

  const theme = await Theme.create({
    _id: newId,
    name,
    description,
    category,
    plan,
    price: price || 0,
    version: version || "1.0.0",
    tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
    themePath,
    s3Assets,
    uploadBy: req.user?.id ? new Types.ObjectId(req.user.id) : undefined,
  });

  try {
    await deleteS3Keys(stagingKeys);
  } catch (delErr) {
    console.warn("[createThemeFromS3] Failed to delete staging S3 keys:", delErr);
  }

  const themeResponse = await Theme.findById(theme._id).populate("uploadBy", "name email");

  logActivity(req, {
    action: "theme_upload",
    entityType: "theme",
    entityId: theme._id.toString(),
    entityName: name,
    summary: `Uploaded theme "${name}" (${category}, ${plan}) via S3`,
    details: { themeId: theme._id.toString(), name, category, plan, version: version || "1.0.0", source: "s3" },
  }).catch(() => {});

  res.status(201).json({
    success: true,
    data: themeResponse ? formatThemeForClient(themeResponse) : null,
    message: "Theme created from S3 successfully",
  });
});

interface UpdateThemeParams {
  id: string;
}

interface UpdateThemeBody {
  name?: string;
  description?: string;
  category?: string;
  plan?: string;
  price?: number;
  version?: string;
  tags?: string;
  isActive?: boolean;
}

export const updateTheme = asyncErrorHandler(async (req: Request, res: Response) => {
  const { id } = req.params as unknown as UpdateThemeParams;
  const {
    name,
    description,
    category,
    plan,
    price,
    version,
    tags,
    isActive,
  } = req.body as UpdateThemeBody;

  const updateData: any = {
    name,
    description,
    category,
    plan,
    price,
    version,
    tags: tags ? tags.split(",").map((tag) => tag.trim()) : undefined,
    isActive,
    updatedAt: new Date(),
  };

  const theme = await Theme.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).populate("uploadBy", "name email");

  if (!theme) {
    throw new CustomError("Theme not found", 404);
  }

  logActivity(req, {
    action: "theme_update",
    entityType: "theme",
    entityId: id,
    entityName: theme.name,
    summary: `Updated theme "${theme.name}"`,
    details: { themeId: id, updates: { name, description, category, plan, price, version, tags, isActive } },
  }).catch(() => {});

  res.status(200).json({
    success: true,
    data: theme,
  });
});

export const deleteTheme = asyncErrorHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { editOtp } = (req.body as { editOtp?: string }) || {};

  // OTP required for all users (including super-admin) - sent to super-admin email
  const otp = editOtp || req.headers["x-edit-otp"];
  if (!otp || typeof otp !== "string") {
    throw new CustomError("Edit verification OTP is required. Request OTP to be sent to super-admin email.", 403);
  }

  const superAdminRole = await Role.findOne({ name: "super-admin" });
  if (!superAdminRole) throw new CustomError("Super-admin role not found", 500);
  const superAdminUser = await User.findOne({ role: superAdminRole._id });
  if (!superAdminUser) throw new CustomError("No super-admin found", 500);
  const superAdminEmail = superAdminUser.email;

  const otpRecord = await EditVerificationOtp.findOne({ email: superAdminEmail });
  if (!otpRecord) throw new CustomError("OTP expired or not found. Please request a new code.", 400);
  if (otpRecord.expiresAt < new Date()) {
    await EditVerificationOtp.deleteMany({ email: superAdminEmail });
    throw new CustomError("OTP expired. Please request a new code.", 400);
  }
  if (otpRecord.code !== otp.trim()) {
    otpRecord.attempts += 1;
    await otpRecord.save();
    throw new CustomError("Invalid verification code", 400);
  }

  await EditVerificationOtp.deleteMany({ email: superAdminEmail });

  console.log('🗑️ Delete theme request received:', { 
    themeId: id, 
    user: req.user?.name, 
    userRole: req.user?.role 
  });

  const theme = await Theme.findById(id);
  if (!theme) {
    console.log('❌ Theme not found:', id);
    throw new CustomError("Theme not found", 404);
  }

  logActivity(req, {
    action: "theme_delete",
    entityType: "theme",
    entityId: id,
    entityName: theme.name,
    summary: `Deleted theme "${theme.name}"`,
    details: { themeId: id, themePath: theme.themePath, category: theme.category },
  }).catch(() => {});

  console.log('✅ Theme found:', { 
    name: theme.name, 
    themePath: theme.themePath,
  });

  // Delete all installed instances of this theme
  const deletedInstances = await InstalledThemes.deleteMany({ theme: id });
  console.log('🗑️ Deleted installed instances:', deletedInstances.deletedCount);

  try {
    const keys = await collectCatalogAssetKeysAsync(theme.s3Assets as any);
    await deleteS3Keys(keys);
  } catch (s3Err) {
    console.warn("[deleteTheme] Failed to delete some catalog S3 objects:", s3Err);
  }

  // Delete the theme from database
  const deletedTheme = await Theme.findByIdAndDelete(id);
  console.log('✅ Theme deleted from database:', deletedTheme ? 'Success' : 'Failed');

  console.log('🎉 Theme deletion completed successfully');
  res.status(200).json({
    success: true,
    data: {},
    message: "Theme and all associated files deleted successfully",
  });
});

export const downloadTheme = asyncErrorHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const theme = await Theme.findById(id);
  if (!theme) {
    throw new CustomError("Theme not found", 404);
  }

  if (!theme.isActive) {
    throw new CustomError("Theme is not available for download", 400);
  }

  // Check user permissions based on plan
  if (theme.plan === "premium" && req.user?.role !== "super-admin") {
    throw new CustomError("Premium theme requires appropriate subscription", 403);
  }

  const zipUrl = theme.s3Assets?.zip?.url;
  const folderPrefix = theme.s3Assets?.contentRoot?.prefix;
  if (!zipUrl && !folderPrefix) {
    throw new CustomError("Theme download is not available", 404);
  }

  if (theme.downloads) {
    theme.downloads += 1;
  } else {
    theme.downloads = 1;
  }
  await theme.save();

  if (zipUrl) {
    res.redirect(302, zipUrl);
    return;
  }

  const tmpBase = path.join(tmpdir(), `ziplofy-theme-dl-${id}-${Date.now()}`);
  fs.mkdirSync(tmpBase, { recursive: true });
  const folderDir = path.join(tmpBase, "files");
  try {
    await downloadS3PrefixToLocalDir(folderPrefix!, folderDir);
    const safeName = `${theme.themePath || theme.name || "theme"}.zip`.replace(/[^\w.\-]+/g, "_");
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename="${safeName}"`);
    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.on("error", (err) => {
      console.error("[downloadTheme] archiver:", err);
    });
    archive.on("end", () => {
      try {
        fs.rmSync(tmpBase, { recursive: true, force: true });
      } catch {
        /* ignore */
      }
    });
    archive.pipe(res);
    archive.directory(folderDir, false);
    await archive.finalize();
  } catch (e) {
    try {
      fs.rmSync(tmpBase, { recursive: true, force: true });
    } catch {
      /* ignore */
    }
    throw e;
  }
});

export const getThemeStructure = asyncErrorHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const theme = await Theme.findById(id);
  if (!theme) {
    throw new CustomError("Theme not found", 404);
  }

  const extractPath = await ensureCatalogThemeCodeDir(theme);

  // Recursive function to get directory structure
  const getStructure = (dirPath: string, relativePath = ""): any[] => {
    const items = fs.readdirSync(dirPath);
    const structure: any[] = [];

    items.forEach((item) => {
      const fullPath = path.join(dirPath, item);
      const relPath = path.join(relativePath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        structure.push({
          name: item,
          type: "directory",
          path: relPath,
          children: getStructure(fullPath, relPath),
        });
      } else {
        structure.push({
          name: item,
          type: "file",
          path: relPath,
          size: stat.size,
          modified: stat.mtime,
        });
      }
    });

    return structure;
  };

  const fileStructure = getStructure(extractPath);

  res.status(200).json({
    success: true,
    data: {
      theme: theme.name,
      structure: fileStructure,
    },
  });
});

export const getThumbnail = asyncErrorHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const theme = await Theme.findById(id);
  if (!theme) {
    throw new CustomError("Theme not found", 404);
  }

  const url = theme.s3Assets?.thumbnail?.url;
  if (!url) {
    throw new CustomError("Thumbnail not found", 404);
  }

  res.redirect(302, url);
});

export const getThemesStatic = asyncErrorHandler(async (req: Request, res: Response) => {
  const themes = await Theme.find();

  const updatedThemes = themes.map((theme) => {
    const thumbnailUrl = resolveThemeThumbnailUrl(req, theme);

    return {
      _id: theme._id,
      name: theme.name,
      description: theme.description,
      category: theme.category,
      thumbnailUrl,
    };
  });

  res.status(200).json({
    success: true,
    data: updatedThemes,
  });
});

export const installTheme = asyncErrorHandler(async (req: Request, res: Response) => {
  const { themeId, storeId } = req.body as { themeId: string; storeId?: string };
  
  if (!themeId) {
    throw new CustomError("Theme ID is required", 400);
  }

  if (!storeId) {
    throw new CustomError("Store ID is required", 400);
  }

  const storeIdToUse = storeId;
  console.log('🔍 Installing theme:', { themeId, storeId });

  // Convert string IDs to ObjectIds
  const themeObjectId = new Types.ObjectId(themeId);

  // Load theme to both validate and build response
  const theme = await Theme.findById(themeObjectId);
  if (!theme) {
    throw new CustomError("Theme not found", 404);
  }

  // Create store-specific theme directory
  const storeThemeDir = path.join(process.cwd(), 'uploads', 'stores', storeIdToUse, 'themes', themeId);
  const zipKey = theme.s3Assets?.zip?.key;
  const contentPrefix = theme.s3Assets?.contentRoot?.prefix;
  if (!zipKey && !contentPrefix) {
    throw new CustomError("Theme has no S3 package to install", 404);
  }

  console.log('📁 Store theme directory:', storeThemeDir);

  try {
    // Create store theme directory if it doesn't exist
    if (!fs.existsSync(storeThemeDir)) {
      fs.mkdirSync(storeThemeDir, { recursive: true });
      console.log('✅ Created store theme directory');
    }

    const unzippedThemeDir = path.join(storeThemeDir, 'unzippedTheme');

    const hasFilesInUnzipped = fs.existsSync(unzippedThemeDir) &&
                               fs.readdirSync(unzippedThemeDir).filter(f => f !== '.DS_Store').length > 0;
    const hasFilesInRoot = fs.existsSync(storeThemeDir) &&
                          fs.readdirSync(storeThemeDir).filter(f => {
                            const fullPath = path.join(storeThemeDir, f);
                            return fs.existsSync(fullPath) &&
                                   fs.statSync(fullPath).isFile() &&
                                   f !== '.DS_Store';
                          }).length > 0;
    const hasExistingFiles = hasFilesInUnzipped || hasFilesInRoot;

    console.log('🔍 Checking for existing customizations:', {
      storeThemeDir,
      unzippedThemeDir,
      hasFilesInUnzipped,
      hasFilesInRoot,
      hasExistingFiles
    });

    if (!hasExistingFiles) {
      if (!fs.existsSync(unzippedThemeDir)) {
        fs.mkdirSync(unzippedThemeDir, { recursive: true });
      }
      if (zipKey) {
        await downloadS3ZipAndExtractToDir(zipKey, unzippedThemeDir);
      } else {
        await downloadS3PrefixToLocalDir(contentPrefix!, unzippedThemeDir);
      }
      console.log('✅ Theme Liquid files extracted from S3 to store (unzippedTheme)');
    } else if (hasExistingFiles) {
      console.log('📁 Existing theme files/customizations found - preserving user edits (not overwriting)');
      console.log(`   - Files in unzippedTheme: ${hasFilesInUnzipped ? 'YES' : 'NO'}`);
      console.log(`   - Files in root: ${hasFilesInRoot ? 'YES' : 'NO'}`);

      if (hasFilesInRoot && !hasFilesInUnzipped) {
        console.log('📦 Migrating files from root to unzippedTheme directory...');
        if (!fs.existsSync(unzippedThemeDir)) {
          fs.mkdirSync(unzippedThemeDir, { recursive: true });
        }

        const migrateRecursive = (src: string, dest: string) => {
          const stats = fs.statSync(src);
          if (stats.isDirectory()) {
            const dirName = path.basename(src);
            if (dirName === 'unzippedTheme') return;

            if (!fs.existsSync(dest)) {
              fs.mkdirSync(dest, { recursive: true });
            }
            const files = fs.readdirSync(src);
            files.forEach(file => {
              migrateRecursive(path.join(src, file), path.join(dest, file));
            });
          } else {
            fs.copyFileSync(src, dest);
          }
        };

        const files = fs.readdirSync(storeThemeDir);
        files.forEach(file => {
          const srcPath = path.join(storeThemeDir, file);
          if (fs.existsSync(srcPath) && fs.statSync(srcPath).isFile() && file !== '.DS_Store') {
            const destPath = path.join(unzippedThemeDir, file);
            migrateRecursive(srcPath, destPath);
          }
        });
        console.log('✅ Files migrated to unzippedTheme directory');
      }
    }

    const destRemoteDir = path.join(storeThemeDir, "remoteThemeDist");
    const jsKey = theme.s3Assets?.reactThemeJs?.key;
    const cssKey = theme.s3Assets?.reactThemeCss?.key;
    if (jsKey || cssKey) {
      if (fs.existsSync(destRemoteDir)) {
        fs.rmSync(destRemoteDir, { recursive: true, force: true });
      }
      fs.mkdirSync(destRemoteDir, { recursive: true });
      if (jsKey) await downloadS3KeyToFile(jsKey, path.join(destRemoteDir, "theme.js"));
      if (cssKey) await downloadS3KeyToFile(cssKey, path.join(destRemoteDir, "theme.css"));
      console.log("✅ React remote theme dist downloaded from S3 to store (remoteThemeDist)");
    }

    // Check if there's already an installation for this store and theme (any legacy store/user shape)
    let installedTheme = await InstalledThemes.findOne({
      $and: [{ $or: storeAndUserScopeOr(storeIdToUse) }, { theme: themeObjectId }],
    });

    const storeRef = canonicalStoreRef(storeIdToUse);

    if (installedTheme) {
      // Update existing installation
      installedTheme.uninstalledAt = undefined;
      installedTheme.store = storeRef as any;
      installedTheme.storePath = storeThemeDir;
      installedTheme.installedAt = new Date();
      await installedTheme.save();
    } else {
      installedTheme = await InstalledThemes.create({
        store: storeRef,
        theme: themeObjectId,
        storePath: storeThemeDir,
        installedAt: new Date(),
      });
    }

    console.log('✅ Theme installation completed');

    const thumbnailUrl = resolveThemeThumbnailUrl(req, theme);

    logActivity(req, {
      action: "theme_install",
      entityType: "theme",
      entityId: themeId,
      entityName: theme.name,
      summary: `Installed theme "${theme.name}" for store`,
      details: { themeId, storeId: storeIdToUse, themeName: theme.name, category: theme.category },
    }).catch(() => {});

    res.status(200).json({
      success: true,
      message: 'Theme installed successfully',
      data: {
        _id: theme._id,
        name: theme.name,
        description: theme.description,
        category: theme.category,
        thumbnailUrl,
        storePath: storeThemeDir,
        installedThemeId: installedTheme._id,
      },
    });
  } catch (error: any) {
    console.error('❌ Error installing theme:', error);
    throw new CustomError(`Failed to install theme: ${error?.message || 'Unknown error'}`, 500);
  }
});

export const applyThemeToStore = asyncErrorHandler(async (req: Request, res: Response) => {
  const { storeId, themeId } = req.body as { storeId?: string; themeId?: string };

  if (!storeId) {
    throw new CustomError("Store ID is required", 400);
  }
  if (!themeId) {
    throw new CustomError("Theme ID is required", 400);
  }
  if (!Types.ObjectId.isValid(themeId)) {
    throw new CustomError("Invalid theme ID format", 400);
  }

  const store = await Store.findById(storeId).select("_id").lean();
  if (!store) {
    throw new CustomError("Store not found", 404);
  }

  const themeObjectId = new Types.ObjectId(themeId);

  const installedRecord = await InstalledThemes.findOne({
    $and: [
      { $or: storeAndUserScopeOr(String(storeId)) },
      { theme: themeObjectId },
      { uninstalledAt: null },
    ],
  })
    .select("_id")
    .lean();

  const customThemeDir = path.join(process.cwd(), "uploads", "stores", storeId, "themes", `custom-${themeId}`);
  const customThemeInstalled = fs.existsSync(customThemeDir);

  if (!installedRecord && !customThemeInstalled) {
    throw new CustomError("Theme is not installed for this store", 404);
  }

  await Store.findByIdAndUpdate(storeId, { $set: { appliedTheme: themeObjectId } });

  res.status(200).json({
    success: true,
    message: "Theme applied successfully",
    data: { storeId, appliedTheme: themeId },
  });
});

export const serveInstalledThemeFiles = asyncErrorHandler(async (req: Request, res: Response) => {
  const { storeId, themeId } = req.params;
  const filePath = req.params[0]; // The wildcard parameter

  console.log('🔍 Serving theme file:', { storeId, themeId, filePath });

  // Check if this is a custom theme (themeId starts with "custom-")
  const isCustomTheme = themeId.startsWith('custom-');
  let actualThemeId = themeId;
  
  if (isCustomTheme) {
    // Extract the actual custom theme ID
    actualThemeId = themeId.replace(/^custom-/, '');
    console.log('📦 Detected custom theme, actual ID:', actualThemeId);
  }

  // Construct the full path to the installed theme file
  const storeThemeDir = path.join(process.cwd(), 'uploads', 'stores', storeId, 'themes', themeId);
  
  // Check unzippedTheme directory first, then fallback to root
  const unzippedDir = path.join(storeThemeDir, 'unzippedTheme');
  let fullFilePath = path.join(unzippedDir, filePath);
  
  // If file doesn't exist in unzippedTheme, try root directory
  if (!fs.existsSync(fullFilePath)) {
    fullFilePath = path.join(storeThemeDir, filePath);
  }

  // Security check: ensure the file is within the store theme directory (including unzippedTheme)
  const normalizedPath = path.normalize(fullFilePath);
  const normalizedStoreDir = path.normalize(storeThemeDir);
  const normalizedUnzippedDir = path.normalize(unzippedDir);
  
  // Allow access if file is in storeThemeDir or unzippedTheme subdirectory
  if (!normalizedPath.startsWith(normalizedStoreDir) && !normalizedPath.startsWith(normalizedUnzippedDir)) {
    throw new CustomError("Access denied", 403);
  }

  // If file doesn't exist in installed directory, try falling back
  if (!fs.existsSync(fullFilePath)) {
    if (isCustomTheme) {
      // For custom themes, try falling back to original custom theme directory
      const { CustomTheme } = await import('../models/custom-theme.model');
      const customTheme = await CustomTheme.findById(actualThemeId).lean();
      if (!customTheme) {
        throw new CustomError("Custom theme not found", 404);
      }
      const fallbackPath = path.join(customTheme.directories.unzippedTheme, filePath);
      if (fs.existsSync(fallbackPath) && !fs.statSync(fallbackPath).isDirectory()) {
        fullFilePath = fallbackPath;
      } else {
        throw new CustomError("File not found", 404);
      }
    } else {
      const theme = await Theme.findById(themeId);
      if (!theme) {
        throw new CustomError("File not found", 404);
      }
      const codeDir = path.resolve(await ensureCatalogThemeCodeDir(theme));
      const stripped = filePath.startsWith("unzippedTheme/") ? filePath.replace(/^unzippedTheme\//, "") : filePath;
      let fallbackPath = path.resolve(path.join(codeDir, stripped));
      if (
        !fallbackPath.startsWith(codeDir) ||
        !fs.existsSync(fallbackPath) ||
        fs.statSync(fallbackPath).isDirectory()
      ) {
        let resolvedFromRemote: string | null = null;
        let rel = stripped;
        if (rel.startsWith("remoteThemeDist/")) {
          rel = rel.replace(/^remoteThemeDist\//, "");
        }
        if (rel === "theme.js" && theme.s3Assets?.reactThemeJs?.key) {
          const tmp = path.join(tmpdir(), `ziplofy-fb-${themeId}-theme.js`);
          await downloadS3KeyToFile(theme.s3Assets.reactThemeJs.key, tmp);
          resolvedFromRemote = tmp;
        } else if (rel === "theme.css" && theme.s3Assets?.reactThemeCss?.key) {
          const tmp = path.join(tmpdir(), `ziplofy-fb-${themeId}-theme.css`);
          await downloadS3KeyToFile(theme.s3Assets.reactThemeCss.key, tmp);
          resolvedFromRemote = tmp;
        }
        if (resolvedFromRemote && fs.existsSync(resolvedFromRemote)) {
          fallbackPath = resolvedFromRemote;
        } else {
          throw new CustomError("File not found", 404);
        }
      }
    // Serve fallback file
    const extFallback = path.extname(fallbackPath).toLowerCase();
    const contentTypes: { [key: string]: string } = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon',
      '.woff': 'font/woff',
      '.woff2': 'font/woff2',
      '.ttf': 'font/ttf',
      '.eot': 'application/vnd.ms-fontobject'
    };
    res.setHeader('Content-Type', contentTypes[extFallback] || 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-cache');
    return res.sendFile(fallbackPath);
    }
  }

  // Check if it's a file (not a directory)
  const stats = fs.statSync(fullFilePath);
  if (!stats.isFile()) {
    throw new CustomError("Not a file", 400);
  }

  // Set appropriate content type based on file extension
  const ext = path.extname(fullFilePath).toLowerCase();
  let contentType = 'text/plain';
  
  switch (ext) {
    case '.html':
      contentType = 'text/html';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.js':
      contentType = 'application/javascript';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
    case '.jpeg':
      contentType = 'image/jpeg';
      break;
    case '.gif':
      contentType = 'image/gif';
      break;
    case '.svg':
      contentType = 'image/svg+xml';
      break;
  }

  res.setHeader('Content-Type', contentType);
  res.setHeader('Cache-Control', 'no-cache');
  
  // Stream the file
  const fileStream = fs.createReadStream(fullFilePath);
  fileStream.pipe(res);
  
  fileStream.on('error', (error) => {
    console.error('❌ Error streaming file:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Error reading file' });
    }
  });
});

interface GetInstalledThemesParams {
  userId?: string;
}

interface GetInstalledThemesQuery {
  userId?: string;
}

export const getInstalledThemes = asyncErrorHandler(async (req: Request, res: Response) => {
  // Get userId from params, query, or authenticated user
  const userId = req.params.userId || req.user?.id || (req.query as GetInstalledThemesQuery).userId;
  // Also check for storeId in query (frontend passes storeId as userId parameter)
  const storeIdFromQuery = (req.query as any).storeId || (req.query as any).userId;
  const includeInactiveRaw = (req.query as any).includeInactive;
  const includeInactiveVal = Array.isArray(includeInactiveRaw) ? includeInactiveRaw[0] : includeInactiveRaw;
  const includeInactive = String(includeInactiveVal ?? '').toLowerCase() === 'true' || String(includeInactiveVal ?? '') === '1';
  
  // Use storeId if provided, otherwise use userId
  // This matches the logic in installCustomTheme which uses storeId || userId
  const storeIdToUse = storeIdFromQuery || userId;
  
  if (!userId && !storeIdFromQuery) {
    throw new CustomError("Unauthorized", 401);
  }

  // Fetch installed themes for this store.
  // By default return currently installed rows (uninstalledAt is null).
  const filter: any = { $or: storeAndUserScopeOr(String(storeIdToUse)) };
  if (!includeInactive) {
    filter.uninstalledAt = null;
  }

  const rows = await InstalledThemes.find(filter)
    .select("theme _id installedAt uninstalledAt")
    .sort({ installedAt: -1 }) // Most recent first
    .lean();

  const themeIdStrings = [
    ...new Set(rows.map((r) => r.theme?.toString()).filter(Boolean) as string[]),
  ];
  const themeObjectIds = themeIdStrings.map((id) => new Types.ObjectId(id));
  const themes =
    themeObjectIds.length > 0 ? await Theme.find({ _id: { $in: themeObjectIds } }).lean() : [];
  const themeById = new Map(themes.map((t) => [t._id.toString(), t]));

  // One list entry per installation row (not per Theme doc), so multiple installs stay visible.
  const formatted: any[] = [];
  for (const row of rows) {
    const tid = row.theme?.toString();
    if (!tid) continue;
    const theme = themeById.get(tid);
    if (!theme) continue;
    const thumbnailUrl = resolveThemeThumbnailUrl(req, theme);
    formatted.push({
      _id: theme._id,
      name: theme.name,
      description: theme.description,
      category: theme.category,
      thumbnailUrl,
      installedThemeId: row._id,
      installedAt: row.installedAt,
      uninstalledAt: row.uninstalledAt,
      installationCount: theme.installationCount || 0,
      isCustomTheme: false,
    });
  }

  const hasActiveRegularThemes = formatted.length > 0;
  
  // Also check for installed custom themes in the file system
  // Check both storeId directory (where custom themes are installed) and userId directory (fallback)
  const storeThemesDir = path.join(process.cwd(), 'uploads', 'stores', storeIdToUse, 'themes');
  const userThemesDir = (storeIdToUse !== userId && userId) ? path.join(process.cwd(), 'uploads', 'stores', userId, 'themes') : null;
  const customThemesList: any[] = [];
  
  console.log('🔍 Checking for custom themes:', {
    storeIdToUse,
    userId,
    storeThemesDir,
    userThemesDir,
    storeDirExists: fs.existsSync(storeThemesDir),
    userDirExists: userThemesDir ? fs.existsSync(userThemesDir) : false,
    hasActiveRegularThemes,
  });
  
  // List custom theme installs on disk alongside regular InstalledThemes rows.
  if (fs.existsSync(storeThemesDir)) {
    try {
      const themeDirs = fs.readdirSync(storeThemesDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
      
      console.log('📁 Found theme directories:', themeDirs);
      
      for (const themeDirName of themeDirs) {
        // Check if it's a custom theme (format: "custom-{customThemeId}")
        if (themeDirName.startsWith('custom-')) {
          const customThemeId = themeDirName.replace(/^custom-/, '');
          
          console.log('🔍 Checking custom theme directory:', { themeDirName, customThemeId });
          
          // Validate ObjectId format
          if (/^[0-9a-fA-F]{24}$/.test(customThemeId)) {
            try {
              const customTheme = await CustomTheme.findById(customThemeId).lean();
              if (customTheme) {
                // Check if unzippedTheme directory exists
                const unzippedThemePath = path.join(storeThemesDir, themeDirName, 'unzippedTheme');
                const unzippedExists = fs.existsSync(unzippedThemePath);
                console.log('📦 Custom theme found:', {
                  customThemeId,
                  name: customTheme.name,
                  unzippedPath: unzippedThemePath,
                  unzippedExists,
                });
                
                if (unzippedExists) {
                  // Get directory stats for installedAt
                  const stats = fs.statSync(unzippedThemePath);
                  
                  // Get thumbnail URL if exists
                  let thumbnailUrl = null;
                  if (customTheme.thumbnail?.filename) {
                    thumbnailUrl = `${req.protocol}://${req.get("host")}/uploads/custom themes/${customTheme.themePath}/thumbnail/${customTheme.thumbnail.filename}`;
                  }
                  
                  customThemesList.push({
                    _id: `custom-${customThemeId}`, // Use special format for ID
                    name: customTheme.name,
                    description: `Custom theme: ${customTheme.name}`,
                    category: 'Custom',
                    thumbnailUrl: thumbnailUrl,
                    installedThemeId: null, // Not in InstalledThemes collection
                    installedAt: stats.birthtime || stats.mtime,
                    uninstalledAt: null,
                    installationCount: 0,
                    isCustomTheme: true, // Mark as custom theme
                    customThemeId: customThemeId, // Store actual custom theme ID
                  });
                }
              } else {
                console.warn(`Custom theme not found in database: ${customThemeId}`);
              }
            } catch (err) {
              console.warn(`Error loading custom theme ${customThemeId}:`, err);
            }
          } else {
            console.warn(`Invalid custom theme ID format: ${customThemeId}`);
          }
        }
      }
    } catch (err) {
      console.warn('Error checking for custom themes:', err);
    }
  } else {
    console.warn(`Store themes directory does not exist: ${storeThemesDir}`);
  }
  
  // Also check userId directory if it's different from storeId (fallback)
  if (userThemesDir && fs.existsSync(userThemesDir)) {
    try {
      const themeDirs = fs.readdirSync(userThemesDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
      
      for (const themeDirName of themeDirs) {
        // Check if it's a custom theme (format: "custom-{customThemeId}")
        if (themeDirName.startsWith('custom-')) {
          const customThemeId = themeDirName.replace(/^custom-/, '');
          
          // Validate ObjectId format
          if (/^[0-9a-fA-F]{24}$/.test(customThemeId)) {
            // Skip if we already found this theme in storeId directory
            if (customThemesList.some(ct => ct.customThemeId === customThemeId)) {
              continue;
            }
            
            try {
              const customTheme = await CustomTheme.findById(customThemeId).lean();
              if (customTheme) {
                // Check if unzippedTheme directory exists
                const unzippedThemePath = path.join(userThemesDir, themeDirName, 'unzippedTheme');
                if (fs.existsSync(unzippedThemePath)) {
                  // Get directory stats for installedAt
                  const stats = fs.statSync(unzippedThemePath);
                  
                  customThemesList.push({
                    _id: `custom-${customThemeId}`, // Use special format for ID
                    name: customTheme.name,
                    description: `Custom theme: ${customTheme.name}`,
                    category: 'Custom',
                    thumbnailUrl: null, // Custom themes don't have thumbnails yet
                    installedThemeId: null, // Not in InstalledThemes collection
                    installedAt: stats.birthtime || stats.mtime,
                    uninstalledAt: null,
                    installationCount: 0,
                    isCustomTheme: true, // Mark as custom theme
                    customThemeId: customThemeId, // Store actual custom theme ID
                  });
                }
              }
            } catch (err) {
              console.warn(`Error loading custom theme ${customThemeId} from user directory:`, err);
            }
          }
        }
      }
    } catch (err) {
      console.warn('Error checking for custom themes in user directory:', err);
    }
  }

  // Combine regular themes and custom themes, sort by installedAt (most recent first)
  const allThemes = [...formatted, ...customThemesList].sort((a, b) => {
    const aDate = a.installedAt ? new Date(a.installedAt).getTime() : 0;
    const bDate = b.installedAt ? new Date(b.installedAt).getTime() : 0;
    return bDate - aDate; // Most recent first
  });

  console.log('✅ Returning installed themes:', {
    regularThemes: formatted.length,
    customThemes: customThemesList.length,
    total: allThemes.length,
    customThemeNames: customThemesList.map(ct => ct.name),
  });

  // Add cache-control headers to prevent stale data
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  res.status(200).json(allThemes);
});

interface UninstallThemeBody {
  installedThemeId: string;
}

export const uninstallTheme = asyncErrorHandler(async (req: Request, res: Response) => {
  const { installedThemeId } = req.body as UninstallThemeBody;
  
  if (!installedThemeId) {
    throw new CustomError("installedThemeId is required", 400);
  }

  // Convert to ObjectId
  const installedThemeObjectId = new Types.ObjectId(installedThemeId);

  // Find the installed theme record BEFORE updating to get themeId and userId
  const installedTheme = await InstalledThemes.findById(installedThemeObjectId);
  if (!installedTheme) {
    throw new CustomError("Installation not found", 404);
  }

  const themeId = installedTheme.theme;
  const storeId = (installedTheme as any).store || (installedTheme as any).user;

  // Mark as uninstalled; keep row for historical reference.
  installedTheme.uninstalledAt = new Date();
  await installedTheme.save();

  // NOTE: We do NOT delete the theme files from uploads/stores/{userId}/themes/{themeId}/
  // This preserves any customizations the user made to the theme
  // The files will remain available for future re-installation with customizations intact

  console.log(`✅ Theme uninstalled (marked inactive): ${themeId} for store: ${storeId}`);
  console.log(`📁 Theme files preserved at: uploads/stores/${storeId}/themes/${themeId}/`);

  res.status(200).json({ success: true, installedThemeId, message: "Theme uninstalled successfully. Your customizations are preserved." });
});

// Theme preview functionality
export const getThemePreview = asyncErrorHandler(async (req: Request, res: Response) => {
  const { themeId } = req.params;
  
  if (!themeId) {
    throw new CustomError("Theme ID is required", 400);
  }

  const theme = await Theme.findById(themeId);
  if (!theme) {
    throw new CustomError("Theme not found", 404);
  }

  // Check if theme is active
  if (!theme.isActive) {
    throw new CustomError("Theme is not available for preview", 403);
  }

  // Get the main HTML file (index.html) from the theme's unzipped directory
  const codeDir = await ensureCatalogThemeCodeDir(theme);
  const themeIndexPath = path.join(codeDir, "index.html");

  if (!fs.existsSync(themeIndexPath)) {
    throw new CustomError("Theme preview not available - index.html not found", 404);
  }

  // Read the HTML content
  let htmlContent = fs.readFileSync(themeIndexPath, 'utf8');
  
  // Update relative paths to work with our preview endpoint
  const baseUrl = `${req.protocol}://${req.get('host')}/api/themes/preview/${themeId}`;
  htmlContent = htmlContent.replace(/src="(?!http)([^"]+)"/g, `src="${baseUrl}/$1"`);
  htmlContent = htmlContent.replace(/href="(?!http)([^"]+)"/g, `href="${baseUrl}/$1"`);
  
  // Set appropriate headers for HTML content
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Frame-Options', 'ALLOWALL');
  res.setHeader('Content-Security-Policy', "frame-ancestors *");
  res.send(htmlContent);
});

// Recursively list files in directory (relative to baseDir)
function listFilesRecursive(baseDir: string, relative: string = ""): string[] {
  const dir = path.join(baseDir, relative);
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const ent of entries) {
    const relPath = path.join(relative, ent.name);
    if (ent.isDirectory()) {
      files.push(...listFilesRecursive(baseDir, relPath));
    } else {
      files.push(relPath.replace(/\\/g, '/'));
    }
  }
  return files;
}

// Determine installed theme base path for a user if exists, else fallback to uploads/themes unzippedTheme
function resolveThemeBasePathForUser(theme: any, userId?: string, storeId?: string): string {
  // Priority 1: Check store-specific directory if storeId is provided
  // ALWAYS prioritize store-specific directory when storeId is provided, regardless of userId
  if (storeId) {
    const storeThemeDir = path.join(process.cwd(), 'uploads', 'stores', storeId, 'themes', String(theme._id));
    const installedCodeDir = path.join(storeThemeDir, 'unzippedTheme');
    
    // Check unzippedTheme first, then root directory
    if (fs.existsSync(installedCodeDir)) {
      console.log(`📂 Using store-specific unzippedTheme: ${installedCodeDir}`);
      return installedCodeDir;
    }
    if (fs.existsSync(storeThemeDir)) {
      console.log(`📂 Using store-specific directory: ${storeThemeDir}`);
      return storeThemeDir;
    }
    // Even if directory doesn't exist yet, return it so files can be saved there
    console.log(`📂 Store directory doesn't exist yet, will use: ${installedCodeDir}`);
    return installedCodeDir; // Return unzippedTheme path for new saves
  }
  
  // Priority 2: Check user-specific directory (only when no storeId provided)
  if (userId) {
    const userThemeDir = path.join(process.cwd(), 'uploads', 'stores', userId, 'themes', String(theme._id));
    if (fs.existsSync(userThemeDir)) {
      const installedCodeDir = path.join(userThemeDir, 'unzippedTheme');
      if (fs.existsSync(installedCodeDir)) return installedCodeDir;
      if (fs.existsSync(userThemeDir)) return userThemeDir;
    }
  }
  
  return "";
}

// List all theme files for editor
export const listThemeFiles = asyncErrorHandler(async (req: Request, res: Response) => {
  const themeId = req.params.themeId;
  const theme = await Theme.findById(themeId).lean();
  if (!theme) throw new CustomError("Theme not found", 404);
  const userId = (req.user as any)?.id;
  const storeId = req.query.storeId as string | undefined;
  const installedBaseDir = resolveThemeBasePathForUser(theme, userId, storeId);

  const fileSet = new Set<string>();
  if (installedBaseDir && fs.existsSync(installedBaseDir)) {
    listFilesRecursive(installedBaseDir).forEach((p) => fileSet.add(p));
  }
  if (fileSet.size === 0 && (theme.s3Assets?.zip?.key || theme.s3Assets?.contentRoot?.prefix)) {
    const catDir = await ensureCatalogThemeCodeDir(theme);
    listFilesRecursive(catDir).forEach((p) => fileSet.add(p));
  }
  if (fileSet.size === 0) throw new CustomError("Theme source not found", 404);

  const files = Array.from(fileSet);
  res.json({ success: true, count: files.length, files });
});

// Read a specific theme file content
export const readThemeFile = asyncErrorHandler(async (req: Request, res: Response) => {
  const themeId = req.params.themeId;
  const relPath = String((req.query.path || "") as string);
  if (!relPath) throw new CustomError("path is required", 400);
  const theme = await Theme.findById(themeId).lean();
  if (!theme) throw new CustomError("Theme not found", 404);
  const userId = (req.user as any)?.id;
  const storeId = req.query.storeId as string | undefined;
  let baseDir = resolveThemeBasePathForUser(theme, userId, storeId);
  if (!baseDir || !fs.existsSync(baseDir)) {
    if (theme.s3Assets?.zip?.key || theme.s3Assets?.contentRoot?.prefix) {
      baseDir = await ensureCatalogThemeCodeDir(theme);
    }
  }
  let abs = path.resolve(path.join(baseDir, relPath));
  const baseResolved = path.resolve(baseDir);
  if (!abs.startsWith(baseResolved)) throw new CustomError("Access denied", 403);

  if (!fs.existsSync(abs) || fs.statSync(abs).isDirectory()) {
    if (!theme.s3Assets?.zip?.key && !theme.s3Assets?.contentRoot?.prefix) throw new CustomError("File not found", 404);
    const themeCode = path.resolve(await ensureCatalogThemeCodeDir(theme));
    const fallbackAbs = path.resolve(path.join(themeCode, relPath));
    if (
      !fallbackAbs.startsWith(themeCode) ||
      !fs.existsSync(fallbackAbs) ||
      fs.statSync(fallbackAbs).isDirectory()
    ) {
      throw new CustomError("File not found", 404);
    }
    abs = fallbackAbs;
  }

  const content = fs.readFileSync(abs, "utf8");
  res.type("text/plain").send(content);
});

// Serve theme preview static files (CSS, JS, images, etc.)
export const serveThemePreviewFiles = asyncErrorHandler(async (req: Request, res: Response) => {
  const { themeId } = req.params;
  const filePath = req.params[0]; // Get the wildcard parameter

  if (!themeId) {
    throw new CustomError("Theme ID is required", 400);
  }

  if (!filePath) {
    throw new CustomError("File path is required", 400);
  }

  const theme = await Theme.findById(themeId);
  if (!theme) {
    throw new CustomError("Theme not found", 404);
  }

  if (!theme.isActive) {
    throw new CustomError("Theme is not available for preview", 403);
  }

  const codeDir = await ensureCatalogThemeCodeDir(theme);
  const fullFilePath = path.join(codeDir, filePath);

  const themeDir = path.resolve(codeDir);
  const requestedFile = path.resolve(fullFilePath);
  
  if (!requestedFile.startsWith(themeDir)) {
    throw new CustomError("Access denied", 403);
  }

  // Check if file exists
  if (!fs.existsSync(fullFilePath)) {
    throw new CustomError("File not found", 404);
  }

  // Check if it's a directory
  if (fs.statSync(fullFilePath).isDirectory()) {
    throw new CustomError("Directory access not allowed", 403);
  }

  // Set appropriate content type based on file extension
  const ext = path.extname(fullFilePath).toLowerCase();
  const contentTypes: { [key: string]: string } = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject'
  };

  const contentType = contentTypes[ext] || 'application/octet-stream';
  res.setHeader('Content-Type', contentType);

  // Set cache headers for better performance
  res.setHeader('Cache-Control', 'public, max-age=3600');
  
  // Allow iframe embedding for theme preview
  res.setHeader('X-Frame-Options', 'ALLOWALL');
  res.setHeader('Content-Security-Policy', "frame-ancestors *");

  // Send the file
  res.sendFile(fullFilePath);
});

// Save an edited file for the authenticated user under their installed theme directory
export const saveUserFileEdit = asyncErrorHandler(async (req: Request, res: Response) => {
  const { themeId } = req.params as { themeId: string };
  const { path: relPath, content, storeId } = req.body as { path: string; content: string; storeId?: string };

  const userId = (req.user as any)?.id;
  if (!userId) throw new CustomError('Unauthorized', 401);
  if (!themeId) throw new CustomError('themeId is required', 400);
  if (!relPath) throw new CustomError('path is required', 400);

  console.log('💾 Save request received:', { 
    userId, 
    themeId, 
    path: relPath, 
    storeId, 
    contentLength: content?.length || 0 
  });

  const theme = await Theme.findById(themeId).lean();
  if (!theme) throw new CustomError('Theme not found', 404);

  // Helper function to save a file to a specific directory
  const saveToDirectory = (baseDir: string): string => {
    // Prefer saving edits inside unzippedTheme to mirror base code structure
    const targetBaseDir = fs.existsSync(path.join(baseDir, 'unzippedTheme'))
      ? path.join(baseDir, 'unzippedTheme')
      : baseDir;

    // Ensure directory exists
    if (!fs.existsSync(targetBaseDir)) {
      fs.mkdirSync(targetBaseDir, { recursive: true });
      console.log(`📁 Created directory: ${targetBaseDir}`);
    }

    const abs = path.resolve(path.join(targetBaseDir, relPath));
    const base = path.resolve(targetBaseDir);
    if (!abs.startsWith(base)) throw new CustomError('Access denied', 403);

    // Ensure subdirectories exist
    const dirToEnsure = path.dirname(abs);
    if (!fs.existsSync(dirToEnsure)) {
      fs.mkdirSync(dirToEnsure, { recursive: true });
      console.log(`📁 Created subdirectory: ${dirToEnsure}`);
    }

    // Write content as utf8
    const contentToWrite = typeof content === 'string' ? content : String(content);
    fs.writeFileSync(abs, contentToWrite, 'utf8');
    console.log(`✅ File written successfully: ${abs} (${contentToWrite.length} bytes)`);
    
    // Verify file was written correctly
    if (fs.existsSync(abs)) {
      const writtenContent = fs.readFileSync(abs, 'utf8');
      if (writtenContent !== contentToWrite) {
        console.error(`⚠️ Warning: Written content doesn't match original content`);
      } else {
        console.log(`✓ Verified: File content matches`);
      }
    }
    
    return abs;
  };

  let savedPath: string;
  
  // CRITICAL: Save ONLY to store-specific directory if storeId is provided
  // This ensures complete isolation between stores - no cross-contamination
  // ALWAYS use store directory when storeId is provided, regardless of userId
  if (storeId) {
    // Store-specific save: completely isolated from other stores
    const storeThemeDir = path.join(process.cwd(), 'uploads', 'stores', String(storeId), 'themes', String(theme._id));
    savedPath = saveToDirectory(storeThemeDir);
    console.log(`✅ Saved to store-specific directory (storeId: ${storeId}): ${savedPath}`);
  } else {
    // User-specific save: only when no store is selected
    const userThemeDir = path.join(process.cwd(), 'uploads', 'stores', String(userId), 'themes', String(theme._id));
    savedPath = saveToDirectory(userThemeDir);
    console.log(`✅ Saved to user-specific directory (userId: ${userId}): ${savedPath}`);
  }

  res.status(200).json({ 
    success: true, 
    message: 'File saved successfully',
    path: savedPath 
  });
});

export const getThemeStats = asyncErrorHandler(async (req: Request, res: Response) => {
  const stats = await Theme.aggregate([
    {
      $group: {
        _id: null,
        totalThemes: { $sum: 1 },
        totalDownloads: { $sum: "$downloads" },
        averageRating: { $avg: "$rating.average" },
      },
    },
    {
      $project: {
        _id: 0,
        totalThemes: 1,
        totalDownloads: 1,
        averageRating: { $round: ["$averageRating", 2] },
      },
    },
  ]);

  const categoryStats = await Theme.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
  ]);

  const planStats = await Theme.aggregate([
    {
      $group: {
        _id: "$plan",
        count: { $sum: 1 },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: {
      overall: stats[0] || {
        totalThemes: 0,
        totalDownloads: 0,
        averageRating: 0,
      },
      byCategory: categoryStats,
      byPlan: planStats,
    },
  });
});
