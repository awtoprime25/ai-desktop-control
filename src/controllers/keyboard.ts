import { Router, Request, Response } from "express";
import { keyboard, Key } from "@nut-tree-fork/nut-js";
import { log } from "../utils/logger.js";

export const keyboardRouter = Router();

// Key name to Key enum mapping
function resolveKey(name: string): Key | null {
  const keyMap: Record<string, Key> = {
    enter: Key.Enter,
    tab: Key.Tab,
    space: Key.Space,
    backspace: Key.Backspace,
    delete: Key.Delete,
    escape: Key.Escape,
    up: Key.Up,
    down: Key.Down,
    left: Key.Left,
    right: Key.Right,
    home: Key.Home,
    end: Key.End,
    pageup: Key.PageUp,
    pagedown: Key.PageDown,
    f1: Key.F1, f2: Key.F2, f3: Key.F3, f4: Key.F4,
    f5: Key.F5, f6: Key.F6, f7: Key.F7, f8: Key.F8,
    f9: Key.F9, f10: Key.F10, f11: Key.F11, f12: Key.F12,
    control: Key.LeftControl,
    ctrl: Key.LeftControl,
    shift: Key.LeftShift,
    alt: Key.LeftAlt,
    win: Key.LeftSuper,
    meta: Key.LeftSuper,
    capslock: Key.CapsLock,
    numlock: Key.NumLock,
    printscreen: Key.Print,
    insert: Key.Insert,
  };
  return keyMap[name.toLowerCase()] ?? null;
}

// Type text string
keyboardRouter.post("/type", async (req: Request, res: Response) => {
  try {
    const { text, delay = 50 } = req.body;
    if (typeof text !== "string") {
      res.status(400).json({ error: "text must be a string" });
      return;
    }
    await keyboard.type(text, delay);
    log("KEYBOARD", `Typed ${text.length} chars`, { length: text.length });
    res.json({ ok: true, length: text.length });
  } catch (err) {
    log("KEYBOARD", `Type error: ${err}`);
    res.status(500).json({ error: String(err) });
  }
});

// Press key combo (e.g. Ctrl+C)
keyboardRouter.post("/press", async (req: Request, res: Response) => {
  try {
    const { keys } = req.body;
    if (!Array.isArray(keys) || keys.length === 0) {
      res.status(400).json({ error: "keys must be a non-empty array of key names" });
      return;
    }
    const resolved = keys.map((k: string) => {
      const r = resolveKey(k);
      if (r === null) throw new Error(`Unknown key: "${k}"`);
      return r;
    });
    // Press all keys down in order
    for (const k of resolved) {
      await keyboard.pressKey(k);
    }
    // Release in reverse order
    for (const k of [...resolved].reverse()) {
      await keyboard.releaseKey(k);
    }
    log("KEYBOARD", `Pressed combo`, { keys });
    res.json({ ok: true, keys });
  } catch (err) {
    log("KEYBOARD", `Press error: ${err}`);
    res.status(500).json({ error: String(err) });
  }
});

// Get valid key names
keyboardRouter.get("/keys", (_req: Request, res: Response) => {
  res.json({
    keys: [
      "enter", "tab", "space", "backspace", "delete", "escape",
      "up", "down", "left", "right", "home", "end", "pageup", "pagedown",
      "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10", "f11", "f12",
      "control", "ctrl", "shift", "alt", "win", "meta",
      "capslock", "numlock", "printscreen", "insert",
      "a-z", "0-9",
    ],
  });
});
