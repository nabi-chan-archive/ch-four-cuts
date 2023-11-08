export { render };

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createWSClient, httpBatchLink, loggerLink, splitLink, wsLink } from '@trpc/react-query';
import { hydrateRoot, type Root } from 'react-dom/client';
import { PageShell } from '#/features/PageShell';
import { trpc } from '#/utils/trpc';
import type { PageContextClient } from '#/types/vike';

let root: Root;

const queryClient = new QueryClient();
const wsClient = createWSClient({
  url: 'wss://172.20.10.4:3000',
});
const trpcClient = trpc.createClient({
  links: [
    loggerLink(),
    splitLink({
      condition: (op) => op.type === 'subscription',
      true: wsLink({ client: wsClient }),
      false: httpBatchLink({ url: 'https://172.20.10.4:3000/trpc' }),
    }),
  ],
});

async function render(pageContext: PageContextClient) {
  const { Page, pageProps } = pageContext;
  if (!Page) throw new Error('Client-side render() hook expects pageContext.Page to be defined');

  const container = document.getElementById('root');
  if (!container) throw new Error('DOM element #root not found');

  const page = (
    <trpc.Provider queryClient={queryClient} client={trpcClient}>
      <QueryClientProvider client={queryClient}>
        <PageShell pageContext={pageContext}>
          <Page {...pageProps} />
        </PageShell>
      </QueryClientProvider>
    </trpc.Provider>
  );

  if (container && pageContext.isHydration) {
    root = hydrateRoot(container, page);
  } else {
    root.render(page);
  }
}

export const clientRouting = true;

export const hydrationCanBeAborted = true;
