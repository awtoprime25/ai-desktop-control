import express from "express";
import { Config } from "./config.js";
import { authenticate } from "./middleware/auth.js";
import { mouseRouter } from "./controllers/mouse.js";
import { keyboardRouter } from "./controllers/keyboard.js";
import { screenRouter } from "./controllers/screen.js";
import { log } from "./utils/logger.js";

export function createServer(config: Config) {
  const app = express();
  app.use(express.json());

  // Health check (no auth)
  app.get("/health", (_req, res) => {
    res.json({ status: "ok", uptime: process.uptime() });
  });

  // Protected routes
  app.use("/mouse", authenticate(config.apiKey), mouseRouter);
  app.use("/keyboard", authenticate(config.apiKey), keyboardRouter);
  app.use("/screen", authenticate(config.apiKey), screenRouter);

  log("SERVER", "Routes registered");
  return app;
}
