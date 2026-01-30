import dotenv from 'dotenv';

dotenv.config({});

export function validateEnv(): void {
  const requiredEnvVars = [
    'PORT',
    'MONGO_URI',
    'ACCESS_TOKEN_SECRET',
    'REFRESH_TOKEN_SECRET',
    'CLIENT_URL',
    'GOOGLE_CLIENT_ID'
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
