import { createContext } from 'react';
import type { PageContext } from '#/src/types/vike';

export const Context = createContext<PageContext>(undefined as unknown as PageContext);

export function PageContextProvider({
  pageContext,
  children,
}: {
  pageContext: PageContext;
  children: React.ReactNode;
}) {
  return <Context.Provider value={pageContext}>{children}</Context.Provider>;
}
