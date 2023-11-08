export { render };
export const passToClient = ['pageProps', 'trpcState'];

import { ServerStyleSheet } from '@ch-four-cuts/bezier-design-system';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createWSClient, httpBatchLink, loggerLink, splitLink, wsLink } from '@trpc/client';
import ReactDOMServer from 'react-dom/server';
import { dangerouslySkipEscape, escapeInject } from 'vike/server';
import ws from 'ws';
import favicon from '#/assets/favicon.ico';
import { trpc } from '#/utils/trpc';
import { helpers } from '#/utils/trpc.server';
import { PageShell } from '../features/PageShell';
import type { PageContextServer } from '../types/vike';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
globalThis.WebSocket = ws as any;

async function render(pageContext: PageContextServer) {
  const { Page, pageProps } = pageContext;

  if (!Page) throw new Error('My render() hook expects pageContext.Page to be defined');
  const sheet = new ServerStyleSheet();
  const queryClient = new QueryClient();
  const wsClient = createWSClient({
    url: `wss://${import.meta.env.VITE_WSS_HOST}`,
  });
  const trpcClient = trpc.createClient({
    links: [
      loggerLink(),
      splitLink({
        condition: (op) => op.type === 'subscription',
        true: wsLink({ client: wsClient }),
        false: httpBatchLink({ url: `https://${import.meta.env.VITE_TRPC_HOST}:3000/trpc` }),
      }),
    ],
  });

  const pageHtml = ReactDOMServer.renderToString(
    sheet.collectStyles(
      <trpc.Provider queryClient={queryClient} client={trpcClient}>
        <QueryClientProvider client={queryClient}>
          <PageShell pageContext={pageContext}>
            <Page {...pageProps} />
          </PageShell>
        </QueryClientProvider>
      </trpc.Provider>,
    ),
  );

  const { documentProps } = pageContext.exports;
  const title = (documentProps && documentProps.title) || '채널 네컷';
  const desc = (documentProps && documentProps.description) || '인셍샷을 위한 채널 네컷';

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="${favicon}" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${desc}" />
        <title>${title}</title>
        ${dangerouslySkipEscape(sheet.getStyleTags())}
      </head>
      <body>
        <div id="root">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`;

  sheet.seal();

  return {
    documentHtml,
    pageContext: {
      trpcState: helpers.dehydrate(),
    },
  };
}
