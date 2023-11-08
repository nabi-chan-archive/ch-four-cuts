import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import vike from 'vike/plugin';
import type { UserConfig } from 'vite';

const config: UserConfig = {
  plugins: [react(), vike()],
  resolve: {
    alias: {
      '#/server': resolve('./server'),
      '#': resolve('./src'),
    },
  },
};

export default config;
