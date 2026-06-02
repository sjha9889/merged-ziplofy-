import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { StoreCustomTheme } from '../models/store-custom-theme/store-custom-theme.model';
import { asyncErrorHandler, CustomError } from '../utils/error.utils';

function parseThemeConfig(raw: unknown): Record<string, unknown> {
  if (raw === null || raw === undefined) {
    throw new CustomError('themeConfig is required', 400);
  }
  if (typeof raw !== 'object' || Array.isArray(raw)) {
    throw new CustomError('themeConfig must be a JSON object', 400);
  }
  return raw as Record<string, unknown>;
}

export const createStoreCustomTheme = asyncErrorHandler(async (req: Request, res: Response) => {
  const { storeId, themeConfig, themeName } = req.body as {
    storeId?: string;
    themeConfig?: unknown;
    themeName?: string;
  };

  if (!storeId || !mongoose.isValidObjectId(storeId)) {
    throw new CustomError('Valid storeId is required', 400);
  }

  const config = parseThemeConfig(themeConfig);
  const name =
    typeof themeName === 'string' && themeName.trim() ? themeName.trim() : 'Untitled theme';

  const created = await StoreCustomTheme.create({
    storeId,
    themeName: name,
    themeConfig: config,
  });

  res.status(201).json({
    success: true,
    message: 'Store custom theme created',
    data: created,
  });
});

export const getStoreCustomThemesByStoreId = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { storeId } = req.params as { storeId?: string };

    if (!storeId || !mongoose.isValidObjectId(storeId)) {
      throw new CustomError('Valid storeId is required', 400);
    }

    const items = await StoreCustomTheme.find({ storeId }).sort({ updatedAt: -1 }).lean();

    res.status(200).json({
      success: true,
      message: 'Store custom themes retrieved',
      data: items,
      count: items.length,
    });
  }
);

export const updateStoreCustomTheme = asyncErrorHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id?: string };
  const { themeConfig, themeName } = req.body as {
    themeConfig?: unknown;
    themeName?: string;
  };

  if (!id || !mongoose.isValidObjectId(id)) {
    throw new CustomError('Valid id is required', 400);
  }

  const update: Record<string, unknown> = {};

  if (themeConfig !== undefined) {
    update.themeConfig = parseThemeConfig(themeConfig);
  }
  if (themeName !== undefined) {
    const name = String(themeName).trim();
    if (!name) throw new CustomError('themeName cannot be empty', 400);
    update.themeName = name;
  }

  if (Object.keys(update).length === 0) {
    throw new CustomError('Provide themeConfig and/or themeName to update', 400);
  }

  const updated = await StoreCustomTheme.findByIdAndUpdate(id, { $set: update }, {
    new: true,
    runValidators: true,
  });

  if (!updated) {
    throw new CustomError('Store custom theme not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Store custom theme updated',
    data: updated,
  });
});

export const deleteStoreCustomTheme = asyncErrorHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id?: string };

  if (!id || !mongoose.isValidObjectId(id)) {
    throw new CustomError('Valid id is required', 400);
  }

  const deleted = await StoreCustomTheme.findByIdAndDelete(id);

  if (!deleted) {
    throw new CustomError('Store custom theme not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Store custom theme deleted',
    data: { deletedId: id },
  });
});
