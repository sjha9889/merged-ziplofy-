import { Request, Response } from 'express';
import { asyncErrorHandler } from '../utils/error.utils';
import { Subdomain } from '../models/subdomain.model';
import mongoose from 'mongoose';
import { Store } from '../models/store/store.model';

export const getSubdomainByStoreId = asyncErrorHandler(async (req: Request, res: Response) => {
  const { storeId } = req.params as { storeId: string };
  if (!storeId) {
    return res.status(400).json({ success: false, message: 'storeId is required' });
  }

  const doc = await Subdomain.findOne({ storeId: new mongoose.Types.ObjectId(storeId) });
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Subdomain not found for store' });
  }

  // Compose environment-aware preview URL (do not store in DB)
  const isProd = process.env.NODE_ENV === 'production';
  const protocol = isProd ? 'https' : 'http';
  const devPort = isProd ? 3000  : 5173;
  const baseHost = isProd
    ? (process.env.ROOT_DOMAIN || 'example.com')
    : `localhost:${devPort}`;
  const host = `${doc.subdomain}.${baseHost}`;
  const url = `${protocol}://${host}`;

  return res.status(200).json({ success: true, data: { ...doc.toObject(), url } });
});

// Public: check if a subdomain is valid and return store basic info
export const checkSubdomain = asyncErrorHandler(async (req: Request, res: Response) => {
  const subdomain = (req.query.subdomain as string || '').trim().toLowerCase();
  if (!subdomain) {
    return res.status(400).json({ success: false, message: 'subdomain is required' });
  }

  const mapping = await Subdomain.findOne({ subdomain });
  if (!mapping) {
    return res.status(404).json({ success: false, message: 'Subdomain not found' });
  }

  const store = await Store.findById(mapping.storeId);
  if (!store) {
    return res.status(404).json({ success: false, message: 'Store not found for subdomain' });
  }

  return res.status(200).json({
    success: true,
    data: {
      storeId: store._id,
      name: store.storeName,
      description: store.storeDescription,
    }
  });
});


