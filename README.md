# React + Vite

Minimal React + Vite app with an Express-based production server and OpenAI/Azure OpenAI proxy support.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Fill in the environment variables in `.env`:
   - For OpenAI: set `OPENAI_API_KEY`
   - For Azure OpenAI: set `AZURE_OPENAI_ENDPOINT`, `AZURE_OPENAI_DEPLOYMENT_NAME`, and `AZURE_OPENAI_API_KEY`
   - Optionally set `AZURE_OPENAI_API_VERSION`
   - Optionally set `VITE_AZURE_OPENAI_DEPLOYMENT_NAME` for Azure client routing
   - Optionally set `VITE_OPENAI_API_BASE_URL` to override the OpenAI request URL
4. Start development:
   ```bash
   npm run dev
   ```

## Production Deployment

1. Build the frontend assets:
   ```bash
   npm run build
   ```
2. Start the production server:
   ```bash
   npm run start
   ```

Alternatively, to serve the built app with the same production server:

```bash
npm run serve
```

## Environment Variables

- `.env` is ignored by git and should never be committed.
- Use your hosting environment's secret management for production values.
- The production server reads the same env keys as the local dev setup.

## Notes

- `npm run dev` uses the Express server plus Vite middleware for local development.
- `npm run build` generates the `dist/` folder used by the production server.
- `npm run start` runs `server.js production`, which serves `dist/` and the API proxy endpoints.
