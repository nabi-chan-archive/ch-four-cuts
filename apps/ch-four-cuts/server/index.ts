import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { getCertificate } from '@vitejs/plugin-basic-ssl';
import compression from 'compression';
import express from 'express';
import { createServer } from 'https';
import { join } from 'path';
import { renderPage } from 'vike/server';
import { WebSocketServer } from 'ws';
import { root } from '#/server/root';
import { appRouter } from '#/server/routes';
import { createContext } from '#/server/trpc';

const isProduction = process.env.NODE_ENV === 'production';

startServer();

async function startServer() {
  const app = express();
  const certificate = await getCertificate('node_modules/.vite');
  const server = createServer({ key: certificate, cert: certificate }, app);
  const wss = new WebSocketServer({ server });

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

  applyWSSHandler({
    wss,
    router: appRouter,
    createContext,
  });

  app.use(
    '/trpc',
    createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  );

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

  server.listen(port, () => {
    console.log(`Server running at https://127.0.0.1:${port}`);
  });
}
