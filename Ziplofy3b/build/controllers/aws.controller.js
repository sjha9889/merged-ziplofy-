"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImagesFromS3 = exports.generateImageUploadSignedUrl = void 0;
const crypto_1 = require("crypto");
const path_1 = __importDefault(require("path"));
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const error_utils_1 = require("../utils/error.utils");
const env_utils_1 = require("../utils/env.utils");
const s3Client = new client_s3_1.S3Client({
    region: env_utils_1.env.AWS_REGION,
    requestChecksumCalculation: 'WHEN_REQUIRED',
    responseChecksumValidation: 'WHEN_REQUIRED',
    ...(env_utils_1.env.AWS_ACCESS_KEY_ID && env_utils_1.env.AWS_SECRET_ACCESS_KEY
        ? {
            credentials: {
                accessKeyId: env_utils_1.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: env_utils_1.env.AWS_SECRET_ACCESS_KEY,
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
const sanitizeFilename = (value) => value
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
const extractS3KeyFromUrl = (imageUrl) => {
    try {
        const parsed = new URL(imageUrl);
        const key = decodeURIComponent(parsed.pathname.replace(/^\/+/, ''));
        return key || null;
    }
    catch {
        return null;
    }
};
exports.generateImageUploadSignedUrl = (0, error_utils_1.asyncErrorHandler)(async (req, res) => {
    const awsRegion = env_utils_1.env.AWS_REGION;
    const awsBucket = env_utils_1.env.AWS_S3_BUCKET_NAME;
    const { fileName, fileType, folder = 'uploads/images', expiresInSeconds = 900 } = req.body;
    if (!fileName || typeof fileName !== 'string') {
        throw new error_utils_1.CustomError('fileName is required', 400);
    }
    if (!fileType || typeof fileType !== 'string') {
        throw new error_utils_1.CustomError('fileType is required', 400);
    }
    if (!ALLOWED_IMAGE_MIME_TYPES.has(fileType)) {
        throw new error_utils_1.CustomError('Unsupported fileType. Only image MIME types are allowed.', 400);
    }
    const safeExpires = Math.min(Math.max(Number(expiresInSeconds) || 900, 60), 3600);
    const parsedFolder = typeof folder === 'string' && folder.trim() ? folder.trim() : 'uploads/images';
    const extension = path_1.default.extname(fileName) || '';
    const baseName = sanitizeFilename(path_1.default.basename(fileName, extension)) || 'image';
    const key = `${parsedFolder.replace(/^\/+|\/+$/g, '')}/${Date.now()}-${(0, crypto_1.randomUUID)()}-${baseName}${extension}`;
    const command = new client_s3_1.PutObjectCommand({
        Bucket: awsBucket,
        Key: key,
        ContentType: fileType,
    });
    const signedUrl = await (0, s3_request_presigner_1.getSignedUrl)(s3Client, command, { expiresIn: safeExpires });
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
exports.deleteImagesFromS3 = (0, error_utils_1.asyncErrorHandler)(async (req, res) => {
    const awsBucket = env_utils_1.env.AWS_S3_BUCKET_NAME;
    const { imageUrls, imageKeys } = req.body;
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
        throw new error_utils_1.CustomError('Provide a non-empty imageKeys or imageUrls array', 400);
    }
    const parsedKeysFromUrls = normalizedImageUrls
        .map((url) => extractS3KeyFromUrl(url))
        .filter((key) => Boolean(key));
    const keys = Array.from(new Set([...normalizedImageKeys, ...parsedKeysFromUrls]));
    if (keys.length === 0) {
        throw new error_utils_1.CustomError('No valid S3 image keys found from payload', 400);
    }
    const deleteCommand = new client_s3_1.DeleteObjectsCommand({
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
        throw new error_utils_1.CustomError(`Failed to delete one or more images from S3: ${details}`, 500);
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
