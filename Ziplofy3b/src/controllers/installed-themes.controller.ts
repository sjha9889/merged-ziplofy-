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
    { store: new mongoose.Types.ObjectId(storeId), theme: new mongoose.Types.ObjectId(themeId) },
    { $set: { uninstalledAt: null } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).populate('theme').lean();

  if (doc && (doc as any).theme) {
    const t: any = (doc as any).theme;
    const thumbnailUrl = t?.s3Assets?.thumbnail?.url || null;
    (doc as any).theme.thumbnailUrl = thumbnailUrl;
    delete (doc as any).theme.s3Assets;
  }

  return res.status(200).json({ success: true, data: doc });
});

// Get installed themes by store id
export const getInstalledThemesByStore = asyncErrorHandler(async (req: Request, res: Response) => {
  const { storeId } = req.params as { storeId: string };
  if (!storeId) throw new CustomError('storeId is required', 400);

  const records = await InstalledThemes.find({ store: new mongoose.Types.ObjectId(storeId), uninstalledAt: null })
    .populate('theme')
    .lean();

  // For each record, replace themeId.thumbnail with thumbnailUrl only
  const shaped = records.map((r: any) => {
    if (r?.theme) {
      const t = r.theme as any;
      const thumbnailUrl = t?.s3Assets?.thumbnail?.url || null;
      t.thumbnailUrl = thumbnailUrl;
      delete t.s3Assets;
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
