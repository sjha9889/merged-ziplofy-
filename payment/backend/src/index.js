import "dotenv/config";
import mongoose from "mongoose";
import { createApp } from "./app.js";
import { config } from "./config.js";
import { connectDB } from "./db/connect.js";

try {
  await connectDB(config.mongoUri);
} catch (e) {
  console.error(e.message || e);
  process.exit(1);
}

const app = await createApp(config);

app.listen(config.port, () => {
  console.log(`Payment API (MERN) http://localhost:${config.port}`);
  console.log(`  POST /api/payments/confirm`);
  console.log(`  GET  /api/health`);
  if (config.serveFrontend) {
    console.log(`  Static + SPA from dist/ (SERVE_FRONTEND=1)`);
  }
});

function shutdown(signal) {
  return async () => {
    console.log(`\n${signal} — closing…`);
    await mongoose.connection.close().catch(() => {});
    process.exit(0);
  };
}

process.on("SIGINT", shutdown("SIGINT"));
process.on("SIGTERM", shutdown("SIGTERM"));
