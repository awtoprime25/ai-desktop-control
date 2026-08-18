export function log(category: string, message: string, data?: unknown): void {
  const timestamp = new Date().toISOString();
  const extra = data !== undefined ? ` | ${JSON.stringify(data)}` : "";
  console.log(`[${timestamp}] [${category}] ${message}${extra}`);
}
