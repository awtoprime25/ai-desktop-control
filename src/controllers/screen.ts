import { Router, Request, Response } from "express";
import { Monitor } from "node-screenshots";
import { log } from "../utils/logger.js";

export const screenRouter = Router();

// Get screenshot as PNG
screenRouter.get("/screenshot", async (_req: Request, res: Response) => {
  try {
    const monitors = Monitor.all();
    if (monitors.length === 0) {
      res.status(500).json({ error: "No monitors found" });
      return;
    }
    const primary = monitors.find((m) => m.isPrimary()) ?? monitors[0];
    const image = await primary.captureImage();
    const buffer = await image.toPng();
    log("SCREEN", `Captured screenshot`, { bytes: buffer.length, monitor: primary.id() });
    res.set("Content-Type", "image/png");
    res.send(buffer);
  } catch (err) {
    log("SCREEN", `Screenshot error: ${err}`);
    res.status(500).json({ error: String(err) });
  }
});

// Get screenshot as base64
screenRouter.get("/screenshot/base64", async (_req: Request, res: Response) => {
  try {
    const monitors = Monitor.all();
    if (monitors.length === 0) {
      res.status(500).json({ error: "No monitors found" });
      return;
    }
    const primary = monitors.find((m) => m.isPrimary()) ?? monitors[0];
    const image = await primary.captureImage();
    const buffer = await image.toPng();
    const base64 = buffer.toString("base64");
    log("SCREEN", `Captured screenshot (base64)`, { bytes: buffer.length, monitor: primary.id() });
    res.json({ base64, format: "png", bytes: buffer.length });
  } catch (err) {
    log("SCREEN", `Screenshot error: ${err}`);
    res.status(500).json({ error: String(err) });
  }
});
