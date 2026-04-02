import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer, loadEnv } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

const mode = process.env.NODE_ENV || 'development';
const env = loadEnv(mode, process.cwd(), '');
process.env = { ...process.env, ...env };

const port = process.env.PORT || 4173;
const isProduction = process.argv.includes('production') || process.env.NODE_ENV === 'production';
const azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
const azureDeployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;
const azureApiVersion = process.env.AZURE_OPENAI_API_VERSION || '2024-10-01';
const azureApiKey = process.env.AZURE_OPENAI_API_KEY || process.env.AZURE_OPENAI_KEY;
const openaiApiKey = process.env.OPENAI_API_KEY;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));

app.post(['/api/azure-openai/*', '/api/openai/*'], async (req, res) => {
  const isAzureRequest = req.path.startsWith('/api/azure-openai');
  const targetUrl = isAzureRequest
    ? `${azureEndpoint.replace(/\/+$/g, '')}${req.path.replace(/^\/api\/azure-openai/, `/openai/deployments/${azureDeployment}`)}${req.url.includes('?') ? '&' : '?'}api-version=${encodeURIComponent(azureApiVersion)}`
    : `https://api.openai.com${req.path.replace(/^\/api\/openai(?:\/v1)?/, '/v1')}${req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : ''}`;

  if (isAzureRequest) {
    if (!azureEndpoint || !azureDeployment || !azureApiKey) {
      return res.status(500).json({ error: 'Missing Azure OpenAI environment variables. Set AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_DEPLOYMENT_NAME, and AZURE_OPENAI_API_KEY.' });
    }
  } else if (!openaiApiKey) {
    return res.status(500).json({ error: 'Missing OPENAI_API_KEY environment variable.' });
  }

  const authHeader = isAzureRequest ? `Bearer ${azureApiKey}` : `Bearer ${openaiApiKey}`;

  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify(req.body),
    });

    response.headers.forEach((value, name) => {
      if (name.toLowerCase() === 'content-encoding') return;
      res.setHeader(name, value);
    });

    res.status(response.status);
    const body = await response.arrayBuffer();
    res.send(Buffer.from(body));
  } catch (error) {
    res.status(502).json({ error: `Proxy request failed: ${error.message}` });
  }
});

async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: 'ssr' },
      appType: 'custom',
    });

    app.use(vite.middlewares);

    app.use('*', async (req, res) => {
      try {
        const url = req.originalUrl;
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e);
        res.status(500).end(e.message);
      }
    });
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`Mode: ${isProduction ? 'production' : 'development'}`);
    console.log(`Azure OpenAI proxy ${azureEndpoint && azureDeployment && azureApiKey ? 'enabled' : 'disabled'}`);
  });
}

startServer();
