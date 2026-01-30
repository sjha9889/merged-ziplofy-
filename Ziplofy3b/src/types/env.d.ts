declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Server Configuration
      PORT?: string;
      NODE_ENV?: 'development' | 'production' | 'test';
      
      // Database Configuration
      MONGODB_URI?: string;
      
      // JWT Configuration
      JWT_SECRET?: string;
      JWT_EXPIRE?: string;
      JWT_COOKIE_EXPIRE?: string;
      ACCESS_TOKEN_SECRET?: string;
      
      // Email Configuration
      EMAIL_PASSWORD?: string;
      EMAIL_ADDRESS?: string;
      
      // CORS Configuration
      CORS_ORIGIN?: string;
    }
  }
}

export {};
