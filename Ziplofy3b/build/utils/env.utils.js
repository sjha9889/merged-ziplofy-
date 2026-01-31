"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadedEnvFile = void 0;
exports.validateEnv = validateEnv;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const envFile = process.env.DOTENV_CONFIG_PATH
    ?? `.env.${process.env.NODE_ENV || 'development'}`;
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), envFile) });
exports.loadedEnvFile = envFile;
function validateEnv() {
    const requiredEnvVars = [
        'PORT',
        'MONGODB_URI',
        'JWT_SECRET',
        'JWT_EXPIRE',
        'JWT_COOKIE_EXPIRE',
        'ACCESS_TOKEN_SECRET',
        'EMAIL_PASSWORD',
        'EMAIL_ADDRESS'
    ];
    const missingVars = [];
    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            missingVars.push(envVar);
        }
    }
    if (missingVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingVars.join(', ')}\n` +
            'Please check your .env file and ensure all required variables are set.');
    }
    console.log('✅ All required environment variables are set');
}
