import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { InstalledThemes } from '../models/installed-themes.model';
import { Theme } from '../models/theme.model';
import { asyncErrorHandler, CustomError } from '../utils/error.utils';

// Install (activate) a theme for a store
export const installThemeForStore = asyncErrorHandler(async (req: Request, res: Response) => {
  const { storeId, themeId } = req.body as { storeId: string; themeId: string };
  if (!storeId || !themeId) throw new CustomError('storeId and themeId are required', 400);

  const validTheme = await Theme.findById(themeId);
  if (!validTheme) throw new CustomError('Theme not found', 404);

  const doc = await InstalledThemes.findOneAndUpdate(
    { storeId: new mongoose.Types.ObjectId(storeId), themeId: new mongoose.Types.ObjectId(themeId) },
    { $set: { isActive: true } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).populate('themeId').lean();

  if (doc && (doc as any).themeId) {
    const t: any = (doc as any).themeId;
    const thumbnailUrl = t?.thumbnail?.filename
      ? `${req.protocol}://${req.get('host')}/uploads/themes/${t.themePath}/thumbnail/${t.thumbnail.filename}`
      : null;
    (doc as any).themeId.thumbnailUrl = thumbnailUrl;
    delete (doc as any).themeId.thumbnail;
    delete (doc as any).themeId.zipFile;
    delete (doc as any).themeId.themePath;
    delete (doc as any).themeId.directories;
  }

  return res.status(200).json({ success: true, data: doc });
});

// Get installed (active) themes by store id
export const getInstalledThemesByStore = asyncErrorHandler(async (req: Request, res: Response) => {
  const { storeId } = req.params as { storeId: string };
  if (!storeId) throw new CustomError('storeId is required', 400);

  const records = await InstalledThemes.find({ storeId: new mongoose.Types.ObjectId(storeId), isActive: true })
    .populate('themeId')
    .lean();

  // For each record, replace themeId.thumbnail with thumbnailUrl only
  const shaped = records.map((r: any) => {
    if (r?.themeId) {
      const t = r.themeId as any;
      const thumbnailUrl = t?.thumbnail?.filename
        ? `${req.protocol}://${req.get('host')}/uploads/themes/${t.themePath}/thumbnail/${t.thumbnail.filename}`
        : null;
      t.thumbnailUrl = thumbnailUrl;
      delete t.thumbnail;
      delete t.zipFile;
      delete t.themePath;
      delete t.directories;
    }
    return r;
  });

  return res.status(200).json({ success: true, data: shaped });
});

// Uninstall (deactivate) theme for a store
export const uninstallThemeForStore = asyncErrorHandler(async (req: Request, res: Response) => {
  const installedThemeId = req.params.installedThemeId;
  if (!installedThemeId) throw new CustomError('installedThemeId is required', 400);

  const deleted = await InstalledThemes.findByIdAndDelete(new mongoose.Types.ObjectId(installedThemeId));
  if (!deleted) throw new CustomError('Installed theme not found', 404);

  return res.status(200).json({ success: true, message: 'Theme uninstalled for store', data: deleted });    
});
