export { render };
export const passToClient = ['pageProps', 'urlPathname', 'dehydratedState'];

import { ServerStyleSheet } from '@ch-four-cuts/bezier-design-system';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink, loggerLink } from '@trpc/react-query';
import ReactDOMServer from 'react-dom/server';
import { dangerouslySkipEscape, escapeInject } from 'vike/server';
import favicon from '#/assets/favicon.ico';
import { trpc } from '#/utils/trpc';
import { PageShell } from '../features/PageShell';
import type { PageContextServer } from '../types/vike';

async function render(pageContext: PageContextServer) {
  const { Page, pageProps } = pageContext;

  if (!Page) throw new Error('My render() hook expects pageContext.Page to be defined');
  const sheet = new ServerStyleSheet();
  const queryClient = new QueryClient();
  const trpcClient = trpc.createClient({
    links: [loggerLink(), httpBatchLink({ url: '/trpc' })],
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
    pageContext: {},
  };
}
