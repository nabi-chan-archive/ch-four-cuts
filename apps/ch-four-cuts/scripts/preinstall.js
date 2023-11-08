import { exec } from 'node:child_process';
const system = process.platform;

if (system == 'darwin') {
  exec('brew install pkg-config cairo pango libpng jpeg giflib librsvg pixman');
} else if (system == 'linux') {
  exec('sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev');
} else {
  throw new Error('Unsupported OS found: ' + system + '. Please install dependencies manually.');
}
