import mongoose from "mongoose";

/**
 * @param {string} uri MongoDB connection string (e.g. mongodb://127.0.0.1:27017/payment-gateway)
 */
export async function connectDB(uri) {
  if (!uri || typeof uri !== "string") {
    throw new Error(
      "MONGODB_URI is missing. Create backend/.env with MONGODB_URI=... (see .env.example)"
    );
  }
  await mongoose.connect(uri);
  console.log("MongoDB connected");
}
