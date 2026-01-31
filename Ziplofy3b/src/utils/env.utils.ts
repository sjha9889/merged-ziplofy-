import dotenv from 'dotenv';
import path from 'path';

const envFile = process.env.DOTENV_CONFIG_PATH
  ?? `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

export const loadedEnvFile = envFile;

export function validateEnv(): void {
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

  const missingVars: string[] = [];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missingVars.push(envVar);
    }
  }

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Please check your .env file and ensure all required variables are set.'
    );
  }

  console.log('✅ All required environment variables are set');
}