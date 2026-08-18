import { loadConfig } from "./config.js";
import { createServer } from "./server.js";
import { log } from "./utils/logger.js";

function main() {
  const config = loadConfig();
  const app = createServer(config);

  app.listen(config.port, config.host, () => {
    log("SERVER", `🤖 AI Desktop Control running at http://${config.host}:${config.port}`);
    log("SERVER", `API Key: ${config.apiKey}`);
    log("SERVER", `Endpoints: /health, /mouse/*, /keyboard/*, /screen/*`);
  });
}

main();
