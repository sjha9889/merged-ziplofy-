import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.join(__dirname, "..");

function parseOrigins(raw) {
  const list = (raw || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (list.length) return list;
  return [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
  ];
}

export const config = {
  port: Number(process.env.PORT) || 3001,
  nodeEnv: process.env.NODE_ENV || "development",
  /** MongoDB connection URI (required) */
  mongoUri: process.env.MONGODB_URI || "",
  corsOrigins: parseOrigins(process.env.CORS_ORIGINS),
  serveFrontend: process.env.SERVE_FRONTEND === "1" || process.env.SERVE_FRONTEND === "true",
  /** Project root (parent of backend/) — used when SERVE_FRONTEND is on */
  projectRoot: path.join(backendRoot, ".."),
};
