import { useContext } from 'react';
import { Context } from '#/features/PageContext/context/PageConextProvider';

export function usePageContext() {
  const pageContext = useContext(Context);
  return pageContext;
}
