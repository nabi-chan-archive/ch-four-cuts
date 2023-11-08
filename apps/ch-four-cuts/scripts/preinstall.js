import { exec } from 'node:child_process';
const system = process.platform;

if (system == 'darwin') {
  console.log('installing dependencies for macOS');
  exec('pnpm install -g node-gyp@10.0.1', (_, stdout) => console.log(stdout));
  exec('brew install pkg-config cairo pango libpng jpeg giflib librsvg pixman', (_, stdout) => console.log(stdout));
} else if (system == 'linux') {
  exec('sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev');
} else {
  throw new Error('Unsupported OS found: ' + system + '. Please install dependencies manually.');
}
