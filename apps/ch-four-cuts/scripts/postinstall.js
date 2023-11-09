import { exec } from 'node:child_process';
const arch = process.arch;

console.log('create prisma client');
exec('pnpm prisma generate', (_, stdout) => console.log(stdout));

if (arch === 'arm64') {
  console.log('rebuild printer package for arm64');
  exec('cd node_modules/printer && node-gyp rebuild --arch=arm64', (_, stdout) => console.log(stdout));
}
