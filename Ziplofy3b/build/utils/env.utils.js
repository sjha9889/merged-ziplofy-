"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnv = validateEnv;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({});
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
