export { render };

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink, loggerLink } from '@trpc/react-query';
import { hydrateRoot, type Root } from 'react-dom/client';
import { PageShell } from '#/features/PageShell';
import { trpc } from '#/utils/trpc';
import type { PageContextClient } from '#/types/vike';

let root: Root;

const queryClient = new QueryClient();
const trpcClient = trpc.createClient({
  links: [loggerLink(), httpBatchLink({ url: 'https://localhost:3000/trpc' })],
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
