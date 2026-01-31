// @ts-nocheck
import archiver from "archiver";
import { Request, Response } from "express";
import extract from "extract-zip";
import fs from "fs";
import mongoose, { Types } from "mongoose";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { InstalledThemes } from "../models/installed-themes.model";
import { Theme } from "../models/theme.model";
import { CustomTheme } from "../models/custom-theme.model";
import { RecentInstallations } from "../models/recent-installations.model";
import { asyncErrorHandler, CustomError } from "../utils/error.utils";

// Helper function to create organized theme directory structure per requirements
const createThemeDirectory = (themeName: string) => {
  // Use exact provided name for folder, avoid collisions by appending short uid if exists
  const baseDir = path.join(process.cwd(), "uploads/themes/");
  const safeName = themeName; // keep exact name
  let themeDirName = safeName;
  let themeDirPath = path.join(baseDir, themeDirName);

  if (fs.existsSync(themeDirPath)) {
    const suffix = uuidv4().slice(0, 6);
    themeDirName = `${safeName}-${suffix}`;
    themeDirPath = path.join(baseDir, themeDirName);
  }

  // Create main theme directory
  if (!fs.existsSync(themeDirPath)) {
    fs.mkdirSync(themeDirPath, { recursive: true });
  }

  // Create subdirectories as specified
  const codeDirPath = path.join(themeDirPath, "unzippedTheme");
  const zippedDirPath = path.join(themeDirPath, "zipped");
  const thumbnailDirPath = path.join(themeDirPath, "thumbnail");

  [codeDirPath, zippedDirPath, thumbnailDirPath].forEach((p) => {
    if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
  });

  return {
    themeDir: themeDirPath,
    codeDir: codeDirPath,
    zippedDir: zippedDirPath,
    thumbnailDir: thumbnailDirPath,
    themeDirName,
  };
};

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

  // Execute query with pagination
  const themes = await Theme.find(filter)
    .populate("uploadBy", "name email")
    .select("-directories -zipFile.extractedPath -thumbnail.path")
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit))
    .sort(sortConfig);

  // Get total documents count
  const count = await Theme.countDocuments(filter);

  res.status(200).json({
    success: true,
    data: themes,
    totalPages: Math.ceil(count / parseInt(limit)),
    currentPage: parseInt(page),
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

  const mapped = docs.map((t: any) => {
    const thumbnailUrl = t.thumbnail?.filename
      ? `${req.protocol}://${req.get("host")}/uploads/themes/${t.themePath}/thumbnail/${t.thumbnail.filename}`
      : null;
    const zipUrl = t.zipFile?.originalName
      ? `${req.protocol}://${req.get("host")}/uploads/themes/${t.themePath}/zipped/${t.zipFile.originalName}`
      : null;
    return {
      _id: t._id,
      name: t.name,
      description: t.description,
      category: t.category,
      plan: t.plan,
      price: t.price,
      version: t.version,
      tags: t.tags,
      downloads: t.downloads,
      rating: t.rating,
      uploadBy: t.uploadBy,
      createdAt: t.createdAt,
      thumbnailUrl,
      zipUrl,
    };
  });

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

  const theme = await Theme.findById(id)
    .populate("uploadBy", "name email")
    .select("-directories -zipFile.extractedPath -thumbnail.path");

  if (!theme) {
    throw new CustomError("Theme not found", 404);
  }

  // Dynamically build preview URL
  const previewUrl = `${req.protocol}://${req.get("host")}/uploads/themes/${
    theme.themePath
  }/code/Theme2/index.html`;

  res.status(200).json({
    success: true,
    data: {
      ...theme.toObject(), // convert Mongoose doc to plain JS object
      previewUrl, // add computed preview URL
    },
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

interface MulterFiles {
  zipFile?: Express.Multer.File[];
  thumbnail?: Express.Multer.File[];
}

export const createTheme = asyncErrorHandler(async (req: Request, res: Response) => {
  const { name, description, category, plan, price, version, tags } = req.body as CreateThemeBody;

  // Check if files were uploaded
  if (!req.files) {
    throw new CustomError("Please upload both ZIP file and thumbnail", 400);
  }

  const files = req.files as MulterFiles;
  const zipFile = files.zipFile ? files.zipFile[0] : null;
  const thumbnail = files.thumbnail ? files.thumbnail[0] : null;

  if (!zipFile || !thumbnail) {
    throw new CustomError("Both ZIP file and thumbnail are required", 400);
  }

  // Create unique folder structure for the theme
  const themeDirs = createThemeDirectory(name);

  // Extract ZIP file to unzippedTheme directory and keep original zip in 'zipped'
  try {
    // Move original zip into zipped dir with original filename
    const zipDestPath = path.join(themeDirs.zippedDir, zipFile.originalname);
    fs.renameSync(zipFile.path, zipDestPath);

    await extract(zipDestPath, { dir: themeDirs.codeDir });
    console.log("ZIP extraction complete to:", themeDirs.codeDir);

    // Normalize extraction: if a single top-level folder exists, move its contents up
    const items = fs.readdirSync(themeDirs.codeDir);
    if (items.length === 1) {
      const onlyItemPath = path.join(themeDirs.codeDir, items[0]);
      const stat = fs.statSync(onlyItemPath);
      if (stat.isDirectory()) {
        const moveUp = (src: string, dest: string) => {
          const entries = fs.readdirSync(src);
          entries.forEach((entry) => {
            const srcPath = path.join(src, entry);
            const destPath = path.join(dest, entry);
            const s = fs.statSync(srcPath);
            if (s.isDirectory()) {
              if (!fs.existsSync(destPath)) fs.mkdirSync(destPath, { recursive: true });
              moveUp(srcPath, destPath);
            } else {
              fs.renameSync(srcPath, destPath);
            }
          });
        };
        moveUp(onlyItemPath, themeDirs.codeDir);
        fs.rmSync(onlyItemPath, { recursive: true, force: true });
        console.log("Normalized extracted structure by removing top-level wrapper folder");
      }
    }
  } catch (extractError: any) {
    // Clean up if extraction fails
    if (fs.existsSync(themeDirs.themeDir)) {
      fs.rmSync(themeDirs.themeDir, { recursive: true, force: true });
    }
    throw new CustomError(`ZIP extraction failed: ${extractError.message}`, 500);
  }

  // Move thumbnail to thumbnail directory
  const thumbnailExt = path.extname(thumbnail.originalname);
  const thumbnailFilename = `thumbnail${thumbnailExt}`;
  const thumbnailDestPath = path.join(themeDirs.thumbnailDir, thumbnailFilename);

  fs.renameSync(thumbnail.path, thumbnailDestPath);

  // Create theme in database
  const theme = await Theme.create({
    name,
    description,
    category,
    plan,
    price: price || 0,
    version: version || "1.0.0",
    tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
    themePath: themeDirs.themeDirName,
    directories: {
      theme: themeDirs.themeDir,
      code: themeDirs.codeDir,
      zipped: themeDirs.zippedDir,
      thumbnail: themeDirs.thumbnailDir,
    },
    zipFile: {
      originalName: zipFile.originalname,
      size: zipFile.size,
      extractedPath: themeDirs.codeDir,
    },
    thumbnail: {
      filename: thumbnailFilename,
      originalName: thumbnail.originalname,
      path: thumbnailDestPath,
      size: thumbnail.size,
    },
    uploadBy: req.user?.id ? new Types.ObjectId(req.user.id) : undefined,
  });

  const themeResponse = await Theme.findById(theme._id)
    .populate("uploadBy", "name email")
    .select("-directories -zipFile.extractedPath -thumbnail.path");

  res.status(201).json({
    success: true,
    data: themeResponse,
    message: "Theme uploaded and organized successfully",
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

interface UpdateThemeFiles {
  zipFile?: Express.Multer.File[];
  thumbnail?: Express.Multer.File[];
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

  // Handle file updates if provided
  if (req.files) {
    const theme = await Theme.findById(id);
    if (!theme) {
      throw new CustomError("Theme not found", 404);
    }

    const files = req.files as UpdateThemeFiles;

    if (files.zipFile) {
      // Delete old code directory
      if (theme.directories.code && fs.existsSync(theme.directories.code)) {
        fs.rmSync(theme.directories.code, { recursive: true, force: true });
      }

      const zipFile = files.zipFile[0];

      // Recreate code directory
      const codeDirPath = path.join(theme.directories.theme, "code");
      if (!fs.existsSync(codeDirPath)) {
        fs.mkdirSync(codeDirPath, { recursive: true });
      }

      // Extract new ZIP file
      await extract(zipFile.path, { dir: codeDirPath });
      fs.unlinkSync(zipFile.path);

      updateData.zipFile = {
        originalName: zipFile.originalname,
        size: zipFile.size,
        extractedPath: codeDirPath,
        uploadDate: new Date(),
      };
    }

    if (files.thumbnail) {
      // Delete old thumbnail directory
      if (
        theme.directories.thumbnail &&
        fs.existsSync(theme.directories.thumbnail)
      ) {
        fs.rmSync(theme.directories.thumbnail, {
          recursive: true,
          force: true,
        });
      }

      // Recreate thumbnail directory
      const thumbnailDirPath = path.join(theme.directories.theme, "thumbnail");
      if (!fs.existsSync(thumbnailDirPath)) {
        fs.mkdirSync(thumbnailDirPath, { recursive: true });
      }

      const thumbnail = files.thumbnail[0];
      const thumbnailExt = path.extname(thumbnail.originalname);
      const thumbnailFilename = `thumbnail${thumbnailExt}`;
      const thumbnailDestPath = path.join(thumbnailDirPath, thumbnailFilename);

      fs.renameSync(thumbnail.path, thumbnailDestPath);

      updateData.thumbnail = {
        filename: thumbnailFilename,
        originalName: thumbnail.originalname,
        path: thumbnailDestPath,
        size: thumbnail.size,
        uploadDate: new Date(),
      };

      updateData.directories = {
        ...theme.directories,
        thumbnail: thumbnailDirPath,
      };
    }
  }

  const theme = await Theme.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  })
    .populate("uploadBy", "name email")
    .select("-directories -zipFile.extractedPath -thumbnail.path");

  if (!theme) {
    throw new CustomError("Theme not found", 404);
  }

  res.status(200).json({
    success: true,
    data: theme,
  });
});

export const deleteTheme = asyncErrorHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
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

  console.log('✅ Theme found:', { 
    name: theme.name, 
    themePath: theme.themePath,
    directories: theme.directories 
  });

  // Delete all installed instances of this theme
  const deletedInstances = await InstalledThemes.deleteMany({ theme: id });
  console.log('🗑️ Deleted installed instances:', deletedInstances.deletedCount);

  // Delete entire theme directory
  if (theme.directories.theme && fs.existsSync(theme.directories.theme)) {
    console.log('🗂️ Deleting theme directory:', theme.directories.theme);
    fs.rmSync(theme.directories.theme, { recursive: true, force: true });
    console.log('✅ Theme directory deleted');
  } else {
    console.log('⚠️ Theme directory not found or already deleted:', theme.directories.theme);
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

  const extractPath = theme.zipFile?.extractedPath;

  if (!fs.existsSync(extractPath || "")) {
    throw new CustomError("Theme files not found", 404);
  }

  // Increment download count
  if(theme.downloads) {
    theme.downloads += 1;
  } else {
    theme.downloads = 1;
  }
  await theme.save();

  // Set response headers
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${theme.name}-${theme.version}.zip"`
  );
  res.setHeader("Content-Type", "application/zip");

  // Create ZIP archive from extracted files
  const archive = archiver("zip", {
    zlib: { level: 9 },
  });

  archive.on("error", (err:any) => {
    throw new CustomError("Error creating download package", 500);
  });

  // Pipe archive to response
  archive.pipe(res);

  // Add all files from extracted directory to archive
  archive.directory(extractPath || "", false);

  // Finalize the archive
  archive.finalize();
});

export const getThemeStructure = asyncErrorHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const theme = await Theme.findById(id);
  if (!theme) {
    throw new CustomError("Theme not found", 404);
  }

  const extractPath = theme.directories.code;

  if (!fs.existsSync(extractPath)) {
    throw new CustomError("Theme files not found", 404);
  }

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

  if (!theme.thumbnail?.path || !fs.existsSync(theme.thumbnail.path)) {
    throw new CustomError("Thumbnail not found", 404);
  }

  res.sendFile(path.resolve(theme.thumbnail.path));
});

export const getThemesStatic = asyncErrorHandler(async (req: Request, res: Response) => {
  const themes = await Theme.find();

  const updatedThemes = themes.map((theme) => {
    let thumbnailUrl = null;

    if (theme.thumbnail?.filename) {
      // ✅ build a URL relative to /uploads/themes
      thumbnailUrl = `${req.protocol}://${req.get("host")}/uploads/themes/${
        theme.themePath
      }/thumbnail/${theme.thumbnail.filename}`;
    }

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
  const { themeId, userId, storeId } = req.body as { themeId: string; userId: string; storeId?: string };

  if (!userId) {
    throw new CustomError("User ID is required", 400);
  }
  
  if (!themeId) {
    throw new CustomError("Theme ID is required", 400);
  }

  console.log('🔍 Installing theme:', { themeId, userId, storeId });

  // Convert string IDs to ObjectIds
  const themeObjectId = new Types.ObjectId(themeId);
  const userObjectId = new Types.ObjectId(userId);

  // Load theme to both validate and build response
  const theme = await Theme.findById(themeObjectId);
  if (!theme) {
    throw new CustomError("Theme not found", 404);
  }

  // Create store-specific theme directory
  const storeIdToUse = storeId || userId; // Use storeId if provided, otherwise use userId
  const storeThemeDir = path.join(process.cwd(), 'uploads', 'stores', storeIdToUse, 'themes', themeId);
  // Use the theme's code directory (which contains unzippedTheme) as source
  const sourceThemeDir = theme.directories?.code || path.join(process.cwd(), 'uploads', 'themes', theme.themePath, 'unzippedTheme');

  console.log('📁 Source theme directory:', sourceThemeDir);
  console.log('📁 Store theme directory:', storeThemeDir);

  try {
    // Create store theme directory if it doesn't exist
    if (!fs.existsSync(storeThemeDir)) {
      fs.mkdirSync(storeThemeDir, { recursive: true });
      console.log('✅ Created store theme directory');
    }

    // Copy theme files to store directory
    // IMPORTANT: Only copy if store directory doesn't exist or is empty
    // This preserves user customizations when re-installing after uninstall
    const unzippedThemeDir = path.join(storeThemeDir, 'unzippedTheme');
    
    // Check for existing customizations in BOTH possible locations:
    // 1. New format: storeThemeDir/unzippedTheme/ (where saves go)
    // 2. Old format: storeThemeDir/ (root level - legacy installations)
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
    
    if (fs.existsSync(sourceThemeDir) && !hasExistingFiles) {
      // Create unzippedTheme subdirectory
      if (!fs.existsSync(unzippedThemeDir)) {
        fs.mkdirSync(unzippedThemeDir, { recursive: true });
      }
      
      // Copy all files from source to store directory
      const copyRecursive = (src: string, dest: string) => {
        const stats = fs.statSync(src);
        if (stats.isDirectory()) {
          if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
          }
          const files = fs.readdirSync(src);
          files.forEach(file => {
            copyRecursive(path.join(src, file), path.join(dest, file));
          });
        } else {
          fs.copyFileSync(src, dest);
        }
      };

      copyRecursive(sourceThemeDir, unzippedThemeDir);
      console.log('✅ Theme files copied to store directory (unzippedTheme)');
    } else if (hasExistingFiles) {
      console.log('📁 Existing theme files/customizations found - preserving user edits (not overwriting)');
      console.log(`   - Files in unzippedTheme: ${hasFilesInUnzipped ? 'YES' : 'NO'}`);
      console.log(`   - Files in root: ${hasFilesInRoot ? 'YES' : 'NO'}`);
      
      // If files exist in root but not in unzippedTheme, migrate them
      if (hasFilesInRoot && !hasFilesInUnzipped) {
        console.log('📦 Migrating files from root to unzippedTheme directory...');
        if (!fs.existsSync(unzippedThemeDir)) {
          fs.mkdirSync(unzippedThemeDir, { recursive: true });
        }
        
        const migrateRecursive = (src: string, dest: string) => {
          const stats = fs.statSync(src);
          if (stats.isDirectory()) {
            const dirName = path.basename(src);
            // Skip unzippedTheme directory itself to avoid recursion
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
    } else {
      console.log('⚠️ Source theme directory not found, creating empty structure');
      // Create basic theme structure
      const basicFiles = [
        'index.html',
        'style.css',
        'script.js',
        'README.md'
      ];
      
      basicFiles.forEach(file => {
        const filePath = path.join(storeThemeDir, file);
        if (file === 'index.html') {
          // Read the default theme template
          const templatePath = path.join(process.cwd(), 'src', 'templates', 'default-theme.html');
          let templateContent = '';
          
          if (fs.existsSync(templatePath)) {
            templateContent = fs.readFileSync(templatePath, 'utf8');
          } else {
            // Fallback template
            templateContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{store.name}} - ${theme.name}</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Welcome to {{store.name}}</h1>
    <p>{{store.description}}</p>
    <div id="products-container">
        <!-- Products will be loaded here -->
    </div>
    <script src="script.js"></script>
</body>
</html>`;
          }
          
          fs.writeFileSync(filePath, templateContent);
        } else if (file === 'style.css') {
          fs.writeFileSync(filePath, `/* ${theme.name} Theme Styles */
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f5f5f5;
}

h1 {
    color: #333;
    text-align: center;
}

p {
    color: #666;
    text-align: center;
    max-width: 600px;
    margin: 0 auto;
}`);
        } else if (file === 'script.js') {
          fs.writeFileSync(filePath, `// ${theme.name} Theme Scripts
console.log('${theme.name} theme loaded successfully!');

// Add your custom JavaScript here
document.addEventListener('DOMContentLoaded', function() {
    console.log('Theme is ready!');
});`);
        } else if (file === 'README.md') {
          fs.writeFileSync(filePath, `# ${theme.name}

${theme.description}

## Installation
This theme has been installed to your store.

## Customization
You can now modify the theme files in this directory to customize your store's appearance.

## Files
- \`index.html\` - Main HTML template
- \`style.css\` - CSS styles
- \`script.js\` - JavaScript functionality
`);
        }
      });
    }

    // IMPORTANT: Deactivate all other active themes for this user/store before installing new one
    // This ensures only one theme is active at a time (either custom or regular theme)
    // Use storeIdToUse to match where themes are installed
    await InstalledThemes.updateMany(
      { user: storeIdToUse, isActive: true },
      { 
        isActive: false, 
        uninstalledAt: new Date() 
      }
    );
    console.log('✅ Deactivated all other active themes for this user/store');

    // Also remove any custom theme installations (delete installation directories)
    const storeThemesDir = path.join(process.cwd(), 'uploads', 'stores', storeIdToUse, 'themes');
    if (fs.existsSync(storeThemesDir)) {
      try {
        const themeDirs = fs.readdirSync(storeThemesDir, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .map(dirent => dirent.name);
        
        for (const themeDirName of themeDirs) {
          if (themeDirName.startsWith('custom-')) {
            const customThemeDir = path.join(storeThemesDir, themeDirName);
            fs.rmSync(customThemeDir, { recursive: true, force: true });
            console.log(`✅ Removed custom theme installation: ${themeDirName}`);
          }
        }
      } catch (err) {
        console.warn('Error removing custom theme installations:', err);
      }
    }

    // Check if there's already an installation for this user and theme
    // Use storeIdToUse to match where themes are installed
    let installedTheme = await InstalledThemes.findOne({ user: storeIdToUse, theme: themeObjectId });
    
    if (installedTheme) {
      // Update existing installation
      installedTheme.isActive = true;
      installedTheme.uninstalledAt = undefined;
      installedTheme.storePath = storeThemeDir;
      installedTheme.installedAt = new Date();
      await installedTheme.save();
    } else {
      // Create a new installation
      // Use storeIdToUse to match where themes are installed
      installedTheme = await InstalledThemes.create({
        user: storeIdToUse,
        theme: themeObjectId,
        isActive: true,
        storePath: storeThemeDir,
        installedAt: new Date(),
      });
    }

    console.log('✅ Theme installation completed');

    // Record in recent installations
    const thumbnailUrl = theme.thumbnail?.filename
      ? `${req.protocol}://${req.get("host")}/uploads/themes/${theme.themePath}/thumbnail/${theme.thumbnail.filename}`
      : null;

    try {
      // Remove any existing entry for this theme (to avoid duplicates)
      await RecentInstallations.deleteOne({ themeId: themeId });
      
      // Create new entry
      await RecentInstallations.create({
        themeId: themeId,
        themeName: theme.name,
        thumbnailUrl: thumbnailUrl,
        isCustomTheme: false,
        installedAt: new Date(),
      });

      // Keep only the last 3 installations
      const allRecent = await RecentInstallations.find().sort({ installedAt: -1 });
      if (allRecent.length > 3) {
        const toDelete = allRecent.slice(3);
        await RecentInstallations.deleteMany({ _id: { $in: toDelete.map(r => r._id) } });
      }
    } catch (recentError) {
      console.warn('Failed to record recent installation:', recentError);
      // Don't fail the installation if recent tracking fails
    }

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
      // For normal themes, fall back to original theme code directory
    const theme = await Theme.findById(themeId).lean();
    if (!theme) {
      throw new CustomError("File not found", 404);
    }
    const codeDir = path.resolve(theme.directories.code);
    // If incoming path was prefixed with 'unzippedTheme/', strip it for fallback
    const stripped = filePath.startsWith('unzippedTheme/') ? filePath.replace(/^unzippedTheme\//, '') : filePath;
    const fallbackPath = path.resolve(path.join(codeDir, stripped));
    if (!fallbackPath.startsWith(codeDir) || !fs.existsSync(fallbackPath) || fs.statSync(fallbackPath).isDirectory()) {
      throw new CustomError("File not found", 404);
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

  // Fetch installed themes (active by default, or all if includeInactive is true)
  // Use storeIdToUse for the filter to match where themes are installed
  const filter: any = { user: storeIdToUse };
  if (!includeInactive) {
    filter.isActive = true;
  }

  const rows = await InstalledThemes.find(filter)
    .select("theme _id isActive installedAt uninstalledAt")
    .sort({ installedAt: -1 }) // Most recent first
    .lean();

  const themeIds = rows.map((r) => r.theme).filter(Boolean);

  // Fetch regular themes
  const themes = themeIds.length > 0 ? await Theme.find({ _id: { $in: themeIds } }).lean() : [];

  const formatted = themes.map((theme) => {
    const thumbnailUrl = theme.thumbnail?.filename
      ? `${req.protocol}://${req.get("host")}/uploads/themes/${theme.themePath}/thumbnail/${theme.thumbnail.filename}`
      : null;
    
    // Find the corresponding installed theme record
    const installedTheme = rows.find(row => row.theme.toString() === theme._id.toString());
    
    return {
      _id: theme._id,
      name: theme.name,
      description: theme.description,
      category: theme.category,
      thumbnailUrl,
      installedThemeId: installedTheme?._id,
      isActive: installedTheme?.isActive ?? true,
      installedAt: installedTheme?.installedAt,
      uninstalledAt: installedTheme?.uninstalledAt,
      installationCount: theme.installationCount || 0,
      isCustomTheme: false, // Mark as regular theme
    };
  });

  // IMPORTANT: Only show custom themes if there are NO active regular themes
  // This ensures only one theme (regular OR custom) is shown at a time
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
  
  // Only check for custom themes if there are no active regular themes
  // This ensures only one theme type is shown at a time
  if (!hasActiveRegularThemes && fs.existsSync(storeThemesDir)) {
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
                    isActive: true,
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
    if (hasActiveRegularThemes) {
      console.log('⏭️ Skipping custom themes check - active regular themes exist');
    } else {
      console.warn(`Store themes directory does not exist: ${storeThemesDir}`);
    }
  }
  
  // Also check userId directory if it's different from storeId (fallback)
  // Only if there are no active regular themes
  if (!hasActiveRegularThemes && userThemesDir && fs.existsSync(userThemesDir)) {
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
                    isActive: true,
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

// Get recent installations (last 3 themes installed)
export const getRecentInstallations = asyncErrorHandler(async (req: Request, res: Response) => {
  try {
    const recent = await RecentInstallations.find()
      .sort({ installedAt: -1 })
      .limit(3)
      .lean();

    // Enrich with theme data
    const enriched = await Promise.all(
      recent.map(async (item) => {
        if (item.isCustomTheme) {
          // For custom themes, extract the actual custom theme ID
          const customThemeId = item.themeId.replace(/^custom-/, '');
          try {
            const customTheme = await CustomTheme.findById(customThemeId).lean();
            if (customTheme) {
              return {
                _id: item._id.toString(), // Use RecentInstallations _id for deletion
                recentId: item._id.toString(),
                themeId: item.themeId,
                name: item.themeName,
                thumbnailUrl: item.thumbnailUrl,
                isCustomTheme: true,
                customThemeId: customThemeId,
                installedAt: item.installedAt,
              };
            }
          } catch (err) {
            console.warn(`Error loading custom theme ${customThemeId}:`, err);
          }
        } else {
          // For regular themes
          try {
            const theme = await Theme.findById(item.themeId).lean();
            if (theme) {
              const thumbnailUrl = theme.thumbnail?.filename
                ? `${req.protocol}://${req.get("host")}/uploads/themes/${theme.themePath}/thumbnail/${theme.thumbnail.filename}`
                : item.thumbnailUrl;
              
              return {
                _id: item._id.toString(), // Use RecentInstallations _id for deletion
                recentId: item._id.toString(),
                themeId: item.themeId,
                name: item.themeName || theme.name,
                description: theme.description,
                category: theme.category,
                thumbnailUrl: thumbnailUrl,
                isCustomTheme: false,
                installedAt: item.installedAt,
              };
            }
          } catch (err) {
            console.warn(`Error loading theme ${item.themeId}:`, err);
          }
        }
        // Fallback if theme not found
        return {
          _id: item._id.toString(), // Use RecentInstallations _id for deletion
          recentId: item._id.toString(),
          themeId: item.themeId,
          name: item.themeName,
          thumbnailUrl: item.thumbnailUrl,
          isCustomTheme: item.isCustomTheme,
          installedAt: item.installedAt,
        };
      })
    );

    res.status(200).json(enriched);
  } catch (error: any) {
    console.error('Error fetching recent installations:', error);
    res.status(200).json([]); // Return empty array on error
  }
});

// Delete recent installations
export const deleteRecentInstallations = asyncErrorHandler(async (req: Request, res: Response) => {
  const { themeIds } = req.body as { themeIds: string[] };

  if (!themeIds || !Array.isArray(themeIds) || themeIds.length === 0) {
    throw new CustomError("Theme IDs are required", 400);
  }

  try {
    // Convert string IDs to ObjectIds
    const objectIds = themeIds.map(id => {
      try {
        return new Types.ObjectId(id);
      } catch {
        return null;
      }
    }).filter(Boolean) as Types.ObjectId[];

    if (objectIds.length === 0) {
      throw new CustomError("Invalid theme IDs provided", 400);
    }

    const result = await RecentInstallations.deleteMany({ _id: { $in: objectIds } });
    
    res.status(200).json({
      success: true,
      message: `Deleted ${result.deletedCount} theme(s) from history`,
      deletedCount: result.deletedCount,
    });
  } catch (error: any) {
    console.error('Error deleting recent installations:', error);
    throw new CustomError(`Failed to delete recent installations: ${error?.message || 'Unknown error'}`, 500);
  }
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
  const userId = installedTheme.user;

  // IMPORTANT: Set isActive to false instead of deleting to preserve history
  // This allows tracking previously installed themes
  installedTheme.isActive = false;
  installedTheme.uninstalledAt = new Date();
  await installedTheme.save();

  // NOTE: We do NOT delete the theme files from uploads/stores/{userId}/themes/{themeId}/
  // This preserves any customizations the user made to the theme
  // The files will remain available for future re-installation with customizations intact

  console.log(`✅ Theme uninstalled (marked inactive): ${themeId} for user: ${userId}`);
  console.log(`📁 Theme files preserved at: uploads/stores/${userId}/themes/${themeId}/`);

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
  const themeIndexPath = path.join(theme.directories.code, 'index.html');
  
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
  
  // Priority 3: Fallback to original uploaded theme code dir
  const fallback = theme.directories?.code || path.join(process.cwd(), 'uploads', 'themes', theme.themePath, 'unzippedTheme');
  return fallback;
}

// List all theme files for editor
export const listThemeFiles = asyncErrorHandler(async (req: Request, res: Response) => {
  const themeId = req.params.themeId;
  const theme = await Theme.findById(themeId).lean();
  if (!theme) throw new CustomError('Theme not found', 404);
  const userId = (req.user as any)?.id;
  const storeId = req.query.storeId as string | undefined;
  const installedBaseDir = resolveThemeBasePathForUser(theme, userId, storeId);
  const themeBaseDir = theme.directories?.code;

  const fileSet = new Set<string>();
  if (installedBaseDir && fs.existsSync(installedBaseDir)) {
    listFilesRecursive(installedBaseDir).forEach((p) => fileSet.add(p));
  }
  if (themeBaseDir && fs.existsSync(themeBaseDir)) {
    listFilesRecursive(themeBaseDir).forEach((p) => fileSet.add(p));
  }
  if (fileSet.size === 0) throw new CustomError('Theme source not found', 404);

  const files = Array.from(fileSet);
  res.json({ success: true, count: files.length, files });
});

// Read a specific theme file content
export const readThemeFile = asyncErrorHandler(async (req: Request, res: Response) => {
  const themeId = req.params.themeId;
  const relPath = String((req.query.path || '') as string);
  if (!relPath) throw new CustomError('path is required', 400);
  const theme = await Theme.findById(themeId).lean();
  if (!theme) throw new CustomError('Theme not found', 404);
  const userId = (req.user as any)?.id;
  const storeId = req.query.storeId as string | undefined;
  const baseDir = resolveThemeBasePathForUser(theme, userId, storeId);
  let abs = path.resolve(path.join(baseDir, relPath));
  const baseResolved = path.resolve(baseDir);
  if (!abs.startsWith(baseResolved)) throw new CustomError('Access denied', 403);

  if (!fs.existsSync(abs) || fs.statSync(abs).isDirectory()) {
    // Fallback to original theme code dir
    const themeCode = path.resolve(theme.directories.code);
    const fallbackAbs = path.resolve(path.join(themeCode, relPath));
    if (!fallbackAbs.startsWith(themeCode) || !fs.existsSync(fallbackAbs) || fs.statSync(fallbackAbs).isDirectory()) {
      throw new CustomError('File not found', 404);
    }
    abs = fallbackAbs;
  }

  const content = fs.readFileSync(abs, 'utf8');
  res.type('text/plain').send(content);
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

  // Check if theme is active
  if (!theme.isActive) {
    throw new CustomError("Theme is not available for preview", 403);
  }

  // Construct the full file path
  const fullFilePath = path.join(theme.directories.code, filePath);
  
  // Security check: ensure the file is within the theme directory
  const themeDir = path.resolve(theme.directories.code);
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
