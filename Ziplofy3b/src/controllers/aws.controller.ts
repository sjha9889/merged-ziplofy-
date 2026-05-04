import { randomUUID } from 'crypto';
import path from 'path';
import { Request, Response } from 'express';
import { DeleteObjectsCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { asyncErrorHandler, CustomError } from '../utils/error.utils';
import { env } from '../utils/env.utils';

const s3Client = new S3Client({
  region: env.AWS_REGION,
  requestChecksumCalculation: 'WHEN_REQUIRED',
  responseChecksumValidation: 'WHEN_REQUIRED',
  ...(env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY
    ? {
        credentials: {
          accessKeyId: env.AWS_ACCESS_KEY_ID,
          secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
        },
      }
    : {}),
});

const ALLOWED_IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
]);

const sanitizeFilename = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

const extractS3KeyFromUrl = (imageUrl: string): string | null => {
  try {
    const parsed = new URL(imageUrl);
    const key = decodeURIComponent(parsed.pathname.replace(/^\/+/, ''));
    return key || null;
  } catch {
    return null;
  }
};

export const generateImageUploadSignedUrl = asyncErrorHandler(async (req: Request, res: Response) => {
  const awsRegion = env.AWS_REGION;
  const awsBucket = env.AWS_S3_BUCKET_NAME;

  const { fileName, fileType, folder = 'uploads/images', expiresInSeconds = 900 } = req.body as {
    fileName?: string;
    fileType?: string;
    folder?: string;
    expiresInSeconds?: number;
  };

  if (!fileName || typeof fileName !== 'string') {
    throw new CustomError('fileName is required', 400);
  }
  if (!fileType || typeof fileType !== 'string') {
    throw new CustomError('fileType is required', 400);
  }
  if (!ALLOWED_IMAGE_MIME_TYPES.has(fileType)) {
    throw new CustomError('Unsupported fileType. Only image MIME types are allowed.', 400);
  }

  const safeExpires = Math.min(Math.max(Number(expiresInSeconds) || 900, 60), 3600);
  const parsedFolder = typeof folder === 'string' && folder.trim() ? folder.trim() : 'uploads/images';
  const extension = path.extname(fileName) || '';
  const baseName = sanitizeFilename(path.basename(fileName, extension)) || 'image';
  const key = `${parsedFolder.replace(/^\/+|\/+$/g, '')}/${Date.now()}-${randomUUID()}-${baseName}${extension}`;

  const command = new PutObjectCommand({
    Bucket: awsBucket,
    Key: key,
    ContentType: fileType,
  });

  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: safeExpires });
  const objectUrl = `https://${awsBucket}.s3.${awsRegion}.amazonaws.com/${key}`;

  return res.status(200).json({
    success: true,
    message: 'Signed URL generated',
    data: {
      signedUrl,
      key,
      bucket: awsBucket,
      region: awsRegion,
      method: 'PUT',
      contentType: fileType,
      expiresInSeconds: safeExpires,
      objectUrl,
    },
  });
});

export const deleteImagesFromS3 = asyncErrorHandler(async (req: Request, res: Response) => {
  const awsBucket = env.AWS_S3_BUCKET_NAME;
  const { imageUrls, imageKeys } = req.body as { imageUrls?: string[]; imageKeys?: string[] };

  const normalizedImageKeys = Array.isArray(imageKeys)
    ? imageKeys
        .map((key) => (typeof key === 'string' ? key.trim() : ''))
        .filter(Boolean)
    : [];

  const normalizedImageUrls = Array.isArray(imageUrls)
    ? imageUrls
        .map((url) => (typeof url === 'string' ? url.trim() : ''))
        .filter(Boolean)
    : [];

  if (normalizedImageKeys.length === 0 && normalizedImageUrls.length === 0) {
    throw new CustomError('Provide a non-empty imageKeys or imageUrls array', 400);
  }

  const parsedKeysFromUrls = normalizedImageUrls
    .map((url) => extractS3KeyFromUrl(url))
    .filter((key): key is string => Boolean(key));
  const keys = Array.from(new Set([...normalizedImageKeys, ...parsedKeysFromUrls]));

  if (keys.length === 0) {
    throw new CustomError('No valid S3 image keys found from payload', 400);
  }

  const deleteCommand = new DeleteObjectsCommand({
    Bucket: awsBucket,
    Delete: {
      Objects: keys.map((key) => ({ Key: key })),
      Quiet: false,
    },
  });

  const deleteResult = await s3Client.send(deleteCommand);
  const deletedKeys = (deleteResult.Deleted || []).map((item) => item.Key).filter(Boolean);
  const failedDeletes = (deleteResult.Errors || []).map((err) => ({
    key: err.Key,
    code: err.Code,
    message: err.Message,
  }));

  if (failedDeletes.length > 0) {
    const details = failedDeletes
      .map((item) => `${item.key || 'unknown-key'} [${item.code || 'UNKNOWN'}: ${item.message || 'No message'}]`)
      .join(', ');
    throw new CustomError(
      `Failed to delete one or more images from S3: ${details}`,
      500
    );
  }

  return res.status(200).json({
    success: true,
    message: 'Images deleted from S3',
    data: {
      deletedKeys,
      deletedCount: deletedKeys.length,
    },
  });
});
