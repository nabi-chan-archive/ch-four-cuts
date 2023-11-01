import {
  BezierProvider as BaseBezierProvider,
  DarkFoundation,
  type Foundation,
  LightFoundation,
} from '@channel.io/bezier-react';
import { type ReactNode, useEffect, useState } from 'react';
import GlobalStyles from '../styles/GlobalStyles';

interface BezierProviderProps {
  children: ReactNode;
}

function BezierProvider({ children }: BezierProviderProps) {
  const [foundation, setFoundation] = useState<Foundation>(LightFoundation);

  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return setFoundation(DarkFoundation);
    }
    return setFoundation(LightFoundation);
  }, []);

  return (
    <BaseBezierProvider foundation={foundation}>
      <GlobalStyles foundation={foundation} />
      {children}
    </BaseBezierProvider>
  );
}

export default BezierProvider;
