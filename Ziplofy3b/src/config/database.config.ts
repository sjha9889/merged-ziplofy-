import mongoose from 'mongoose';

/**
 * Connects to the MongoDB database using Mongoose.
 * Includes retry logic and better error handling for network issues.
 */
export const connectDB = async (): Promise<void> => {
  const maxRetries = 5;
  const retryDelay = 5000; // 5 seconds
  let retries = 0;

  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.error('❌ MONGODB_URI environment variable is not set!');
    console.error('Please check your .env file and ensure MONGODB_URI is configured.');
    process.exit(1);
  }

  const connectWithRetry = async (): Promise<void> => {
    try {
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 10000, // 10 seconds timeout
        socketTimeoutMS: 45000, // 45 seconds socket timeout
        connectTimeoutMS: 10000, // 10 seconds connection timeout
        retryWrites: true,
        w: 'majority',
      });
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      console.log(`📊 Database: ${conn.connection.name}`);
    } catch (error: any) {
      retries++;
      
      // Provide more specific error messages
      if (error.name === 'MongoServerSelectionError') {
        if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
          console.error(`❌ MongoDB Connection Error (Attempt ${retries}/${maxRetries}):`);
          console.error('   DNS Resolution Failed - Cannot resolve MongoDB hostname');
          console.error(`   Host: ${error.message.match(/[a-zA-Z0-9.-]+\.mongodb\.net/)?.[0] || 'Unknown'}`);
          console.error('');
          console.error('🔍 Possible causes:');
          console.error('   1. Network connectivity issue - Check your internet connection');
          console.error('   2. MongoDB Atlas cluster might be paused - Check MongoDB Atlas dashboard');
          console.error('   3. DNS resolution problem - Try using a different DNS server');
          console.error('   4. Firewall blocking connection - Check firewall settings');
          console.error('   5. Incorrect connection string - Verify MONGODB_URI in .env file');
          console.error('');
        } else {
          console.error(`❌ MongoDB Connection Error (Attempt ${retries}/${maxRetries}):`);
          console.error(`   ${error.message}`);
        }
      } else {
        console.error(`❌ Database connection error (Attempt ${retries}/${maxRetries}):`);
        console.error(`   ${error.message}`);
      }

      if (retries < maxRetries) {
        console.log(`⏳ Retrying connection in ${retryDelay / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return connectWithRetry();
      } else {
        console.error('');
        console.error('❌ Failed to connect to MongoDB after', maxRetries, 'attempts');
        console.error('   Please check:');
        console.error('   1. Your internet connection');
        console.error('   2. MongoDB Atlas cluster status');
        console.error('   3. MONGODB_URI in your .env file');
        console.error('   4. Network/firewall settings');
        process.exit(1);
      }
    }
  };

  await connectWithRetry();
};
