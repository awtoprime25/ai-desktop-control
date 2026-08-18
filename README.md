# 🖥️ AI Desktop Control

A local HTTP server that lets an AI agent (Buffy/Freebuff) control your mouse, keyboard, and screen.

## Quick Start

```bash
npm install
cp .env.example .env    # Edit with your own API_KEY
npm run dev
```

## API Endpoints

All endpoints except `/health` require the header `x-api-key`.

### Health
- `GET /health` — Server status

### Mouse
- `POST /mouse/move` — `{ x: number, y: number }`
- `POST /mouse/click` — `{ button?: "left"|"right"|"middle", clicks?: number, x?: number, y?: number }`
- `POST /mouse/scroll` — `{ deltaX: number, deltaY: number }`
- `GET /mouse/position` — Returns `{ x, y }`

### Keyboard
- `POST /keyboard/type` — `{ text: string, delay?: number }`
- `POST /keyboard/press` — `{ keys: string[] }` (e.g. `["ctrl", "c"]`)
- `GET /keyboard/keys` — List valid key names

### Screen
- `GET /screen/screenshot` — Returns PNG image
- `GET /screen/screenshot/base64` — Returns `{ base64, format, bytes }`

## Security

- Binds to `127.0.0.1` only (no external access)
- API key required for all action endpoints
- All actions logged to console

## Examples

```bash
# Move mouse to center of screen
curl -X POST http://127.0.0.1:7331/mouse/move \
  -H "x-api-key: freebuff-local-2026" \
  -H "Content-Type: application/json" \
  -d '{"x": 960, "y": 540}'

# Take a screenshot
curl http://127.0.0.1:7331/screen/screenshot \
  -H "x-api-key: freebuff-local-2026" \
  -o screenshot.png

# Type text
curl -X POST http://127.0.0.1:7331/keyboard/type \
  -H "x-api-key: freebuff-local-2026" \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello from Buffy!"}'

# Press Ctrl+C
curl -X POST http://127.0.0.1:7331/keyboard/press \
  -H "x-api-key: freebuff-local-2026" \
  -H "Content-Type: application/json" \
  -d '{"keys": ["ctrl", "c"]}'
```
