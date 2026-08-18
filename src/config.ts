import dotenv from "dotenv";

dotenv.config();

export interface Config {
  port: number;
  host: string;
  apiKey: string;
}

export function loadConfig(): Config {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable is required");
  }
  return {
    port: parseInt(process.env.PORT || "7331", 10),
    host: process.env.HOST || "127.0.0.1",
    apiKey,
  };
}
