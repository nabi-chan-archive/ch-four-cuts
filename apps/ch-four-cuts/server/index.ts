import { getCertificate } from '@vitejs/plugin-basic-ssl';
import compression from 'compression';
import express from 'express';
import { createServer } from 'https';
import { join } from 'path';
import { renderPage } from 'vike/server';
import { root } from './root.js';

const isProduction = process.env.NODE_ENV === 'production';

startServer();

async function startServer() {
  const app = express();
  const certificate = await getCertificate('node_modules/.vite');

  app.use(compression());

  if (isProduction) {
    const sirv = (await import('sirv')).default;
    app.use(sirv(`${root}/dist/client`));
  } else {
    const vite = await import('vite');
    const viteDevMiddleware = (
      await vite.createServer({
        root,
        server: {
          middlewareMode: true,
          https: {
            key: certificate,
            cert: certificate,
          },
        },
        resolve: {
          alias: {
            '#': join(root, 'src'),
          },
        },
      })
    ).middlewares;
    app.use(viteDevMiddleware);
  }

  app.get('*', async (req, res, next) => {
    const pageContextInit = {
      urlOriginal: req.originalUrl,
    };
    const pageContext = await renderPage(pageContextInit);
    const { httpResponse } = pageContext;
    if (!httpResponse) {
      return next();
    }
    const { body, statusCode, headers, earlyHints } = httpResponse;
    if (res.writeEarlyHints) res.writeEarlyHints({ link: earlyHints.map((e) => e.earlyHintLink) });
    headers.forEach(([name, value]) => res.setHeader(name, value));
    res.status(statusCode);
    res.send(body);
  });

  const port = process.env.PORT || 3000;

  const server = createServer({ key: certificate, cert: certificate }, app);
  server.listen(port, () => {
    console.log(`Server running at https://127.0.0.1:${port}`);
  });
}
