import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { Buffer } from 'buffer'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  process.env = { ...process.env, ...env };
  console.log('[Vite] OPENAI_API_KEY loaded:', Boolean(process.env.OPENAI_API_KEY));
  console.log('[Vite] AZURE OpenAI loaded:', Boolean(process.env.AZURE_OPENAI_ENDPOINT && process.env.AZURE_OPENAI_DEPLOYMENT_NAME && process.env.AZURE_OPENAI_API_KEY));

  return {
    plugins: [
      react(),
      {
        name: 'openai-proxy-middleware',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
              const isAzureRequest = req.url?.startsWith('/api/azure-openai');
            if (req.method !== 'POST' || !(req.url?.startsWith('/api/openai') || isAzureRequest)) {
              return next();
            }

            let body = '';
            for await (const chunk of req) {
              body += chunk;
            }

            const azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
            const azureDeployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;
            const azureApiVersion = process.env.AZURE_OPENAI_API_VERSION || '2024-10-01';
            const azureApiKey = process.env.AZURE_OPENAI_API_KEY || process.env.AZURE_OPENAI_KEY;
            const apiKey = process.env.OPENAI_API_KEY;

            if (isAzureRequest) {
              if (!azureEndpoint || !azureDeployment || !azureApiKey) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Missing Azure OpenAI environment variables. Set AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_DEPLOYMENT_NAME, and AZURE_OPENAI_API_KEY.' }));
                return;
              }
            } else if (!apiKey) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Missing OPENAI_API_KEY environment variable.' }));
              return;
            }

            const targetUrl = isAzureRequest
              ? `${azureEndpoint.replace(/\/+$|\s+$/g, '').replace(/\/$/, '')}${req.url.replace(/^\/api\/azure-openai/, `/openai/deployments/${azureDeployment}`)}${req.url.includes('?') ? '&' : '?'}api-version=${encodeURIComponent(azureApiVersion)}`
              : `https://api.openai.com${req.url.replace(/^\/api\/openai(?:\/v1)?/, '/v1')}`;
            const authHeader = isAzureRequest ? `Bearer ${azureApiKey}` : `Bearer ${apiKey}`;
            console.log(`[OpenAI proxy] ${req.method} ${req.url} -> ${targetUrl} key=${Boolean(authHeader)}`);

            try {
              const response = await fetch(targetUrl, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': authHeader,
                },
                body,
              });

              res.statusCode = response.status;
              response.headers.forEach((value, name) => {
                if (name.toLowerCase() === 'content-encoding') return;
                res.setHeader(name, value);
              });

              const responseBody = await response.arrayBuffer();
              res.end(Buffer.from(responseBody));
            } catch (error) {
              res.statusCode = 502;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Proxy request failed: ' + error.message }));
            }
          });
        },
      },
    ],
    server: {
      port: 5173,
    },
  };
});
