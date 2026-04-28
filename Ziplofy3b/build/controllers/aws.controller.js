"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateImageUploadSignedUrl = void 0;
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
