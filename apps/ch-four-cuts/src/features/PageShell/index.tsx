import { BezierProvider } from '@ch-four-cuts/bezier-design-system';
import { StrictMode } from 'react';
import { PageContextProvider } from '../PageContext/context/PageConextProvider';
import type { PageContext } from '../../types/vike';

export { PageShell };

function PageShell({ children, pageContext }: { children: React.ReactNode; pageContext: PageContext }) {
  return (
    <StrictMode>
      <PageContextProvider pageContext={pageContext}>
        <BezierProvider>{children}</BezierProvider>
      </PageContextProvider>
    </StrictMode>
  );
}
