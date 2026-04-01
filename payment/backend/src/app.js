import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import { createPaymentsRouter } from "./routes/payments.js";
import { notFoundHandler } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function dbStatus() {
  const s = mongoose.connection.readyState;
  if (s === 1) return "connected";
  if (s === 2) return "connecting";
  if (s === 3) return "disconnecting";
  return "disconnected";
}

export async function createApp(config) {
  const app = express();

  app.disable("x-powered-by");
  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
  app.use(
    cors({
      origin(origin, cb) {
        if (!origin) return cb(null, true);
        if (config.corsOrigins.includes(origin)) return cb(null, true);
        cb(null, false);
      },
    })
  );
  app.use(morgan(config.nodeEnv === "production" ? "combined" : "dev"));
  app.use(express.json({ limit: "32kb" }));

  app.get("/api/health", (_req, res) => {
    res.json({
      ok: true,
      service: "payment-gateway-api",
      stack: "MERN",
      mongo: dbStatus(),
      time: new Date().toISOString(),
    });
  });

  app.use("/api/payments", createPaymentsRouter());

  if (config.serveFrontend) {
    const dist = path.join(config.projectRoot, "dist");
    try {
      await fs.access(dist);
      app.use(express.static(dist));
      app.get("*", (req, res, next) => {
        if (req.path.startsWith("/api")) return next();
        res.sendFile(path.join(dist, "index.html"), (err) => {
          if (err) next(err);
        });
      });
    } catch {
      console.warn(
        "[api] SERVE_FRONTEND is set but dist/ not found — run npm run build in project root"
      );
    }
  }

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
