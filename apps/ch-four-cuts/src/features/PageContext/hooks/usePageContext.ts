import { useContext } from 'react';
import { Context } from '#/src/features/PageContext/context/PageConextProvider';

export function usePageContext() {
  const pageContext = useContext(Context);
  return pageContext;
}
