import { BezierProvider, LightFoundation } from '@ch-four-cuts/bezier-design-system';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = document.getElementById('root');
if (!root) {
  throw new Error('root element not found');
}
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <BezierProvider initialFoundation={LightFoundation}>
      <App />
    </BezierProvider>
  </React.StrictMode>,
);
