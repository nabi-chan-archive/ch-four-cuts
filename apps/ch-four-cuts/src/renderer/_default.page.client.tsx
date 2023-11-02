export { render };

import { hydrateRoot } from 'react-dom/client';
import { PageShell } from '#/features/PageShell';
import type { PageContextClient } from '#/types/vike';

async function render(pageContext: PageContextClient) {
  const { Page, pageProps } = pageContext;
  if (!Page) throw new Error('Client-side render() hook expects pageContext.Page to be defined');

  const root = document.getElementById('root');
  if (!root) throw new Error('DOM element #root not found');

  hydrateRoot(
    root,
    <PageShell pageContext={pageContext}>
      <Page {...pageProps} />
    </PageShell>,
  );
}
