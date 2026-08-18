import { Router, Request, Response } from "express";
import { mouse, Point, Button } from "@nut-tree-fork/nut-js";
import { log } from "../utils/logger.js";

export const mouseRouter = Router();

// Move mouse to absolute position
mouseRouter.post("/move", async (req: Request, res: Response) => {
  try {
    const { x, y } = req.body;
    if (typeof x !== "number" || typeof y !== "number") {
      res.status(400).json({ error: "x and y must be numbers" });
      return;
    }
    await mouse.setPosition(new Point(x, y));
    log("MOUSE", `Moved to`, { x, y });
    res.json({ ok: true, x, y });
  } catch (err) {
    log("MOUSE", `Move error: ${err}`);
    res.status(500).json({ error: String(err) });
  }
});

// Click at current position (or move first if x,y provided)
mouseRouter.post("/click", async (req: Request, res: Response) => {
  try {
    const { button = "left", clicks = 1, x, y } = req.body;
    const buttonMap: Record<string, Button> = {
      left: Button.LEFT,
      right: Button.RIGHT,
      middle: Button.MIDDLE,
    };
    if (!(button in buttonMap)) {
      res.status(400).json({ error: "button must be left, right, or middle" });
      return;
    }
    if (typeof x === "number" && typeof y === "number") {
      await mouse.setPosition(new Point(x, y));
    }
    for (let i = 0; i < clicks; i++) {
      await mouse.click(buttonMap[button]);
    }
    log("MOUSE", `Clicked`, { button, clicks, x, y });
    res.json({ ok: true, button, clicks });
  } catch (err) {
    log("MOUSE", `Click error: ${err}`);
    res.status(500).json({ error: String(err) });
  }
});

// Scroll
mouseRouter.post("/scroll", async (req: Request, res: Response) => {
  try {
    const { deltaX = 0, deltaY = 0 } = req.body;
    await mouse.scrollDown(Math.abs(deltaY));
    if (deltaX !== 0) {
      await mouse.scrollRight(Math.abs(deltaX));
    }
    log("MOUSE", `Scrolled`, { deltaX, deltaY });
    res.json({ ok: true, deltaX, deltaY });
  } catch (err) {
    log("MOUSE", `Scroll error: ${err}`);
    res.status(500).json({ error: String(err) });
  }
});

// Get current position
mouseRouter.get("/position", async (_req: Request, res: Response) => {
  try {
    const pos = await mouse.getPosition();
    log("MOUSE", `Position queried`, { x: pos.x, y: pos.y });
    res.json({ x: pos.x, y: pos.y });
  } catch (err) {
    log("MOUSE", `Position error: ${err}`);
    res.status(500).json({ error: String(err) });
  }
});
