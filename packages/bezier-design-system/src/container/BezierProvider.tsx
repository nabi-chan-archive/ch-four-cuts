import {
  BezierProvider as BaseBezierProvider,
  DarkFoundation,
  type Foundation,
  LightFoundation,
  ToastProvider,
} from '@channel.io/bezier-react';
import { type ReactNode, useEffect, useState } from 'react';
import GlobalStyles from '../styles/GlobalStyles';

interface BezierProviderProps {
  initialFoundation?: Foundation;
  children: ReactNode;
}

function BezierProvider({ initialFoundation, children }: BezierProviderProps) {
  const [foundation, setFoundation] = useState<Foundation>(initialFoundation ?? LightFoundation);

  useEffect(() => {
    if (initialFoundation) return;
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return setFoundation(DarkFoundation);
    }
    return setFoundation(LightFoundation);
  }, [initialFoundation]);

  return (
    <BaseBezierProvider foundation={foundation}>
      <ToastProvider>
        <GlobalStyles foundation={foundation} />
        {children}
      </ToastProvider>
    </BaseBezierProvider>
  );
}

export default BezierProvider;
