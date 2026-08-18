import { describe, it, expect } from "vitest";
import { createServer } from "../src/server.js";

const config = {
  port: 0,
  host: "127.0.0.1",
  apiKey: "test-key-123",
};

const app = createServer(config);

// Helper to make requests to the Express app
async function request(
  method: string,
  path: string,
  body?: unknown,
  headers?: Record<string, string>
) {
  const http = await import("http");
  return new Promise<{ status: number; body: any }>((resolve) => {
    const server = app.listen(0, () => {
      const addr = server.address() as any;
      const reqHeaders: Record<string, string> = {
        "Content-Type": "application/json",
        ...headers,
      };

      const options = {
        hostname: "127.0.0.1",
        port: addr.port,
        path,
        method,
        headers: reqHeaders,
      };

      const req = http.request(options, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          server.close();
          try {
            resolve({ status: res.statusCode!, body: JSON.parse(data) });
          } catch {
            resolve({ status: res.statusCode!, body: data });
          }
        });
      });

      if (body) {
        req.write(JSON.stringify(body));
      }
      req.end();
    });
  });
}

describe("Server", () => {
  it("health endpoint returns ok without auth", async () => {
    const res = await request("GET", "/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(typeof res.body.uptime).toBe("number");
  });

  it("protected routes reject without API key", async () => {
    const res = await request("GET", "/mouse/position");
    expect(res.status).toBe(401);
    expect(res.body.error).toContain("Unauthorized");
  });

  it("protected routes reject with wrong API key", async () => {
    const res = await request("GET", "/mouse/position", undefined, {
      "x-api-key": "wrong-key",
    });
    expect(res.status).toBe(401);
  });

  it("keyboard keys endpoint works with auth", async () => {
    const res = await request("GET", "/keyboard/keys", undefined, {
      "x-api-key": "test-key-123",
    });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.keys)).toBe(true);
    expect(res.body.keys).toContain("enter");
  });

  it("mouse move rejects non-numeric input", async () => {
    const res = await request(
      "POST",
      "/mouse/move",
      { x: "not-a-number", y: 100 },
      { "x-api-key": "test-key-123" }
    );
    expect(res.status).toBe(400);
    expect(res.body.error).toContain("must be numbers");
  });

  it("keyboard type rejects non-string input", async () => {
    const res = await request(
      "POST",
      "/keyboard/type",
      { text: 12345 },
      { "x-api-key": "test-key-123" }
    );
    expect(res.status).toBe(400);
    expect(res.body.error).toContain("must be a string");
  });
});
