import { Request, Response, NextFunction } from "express";

export function authenticate(apiKey: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const provided =
      (req.headers["x-api-key"] as string | undefined) ||
      (req.query.key as string | undefined);

    if (!provided || provided !== apiKey) {
      res.status(401).json({ error: "Unauthorized — invalid or missing API key" });
      return;
    }
    next();
  };
}
