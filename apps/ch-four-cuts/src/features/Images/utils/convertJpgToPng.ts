import jimp from 'jimp';

export function convertJpgToPng(imageBuffer: Buffer, path: string) {
  jimp.read(imageBuffer).then((result) => {
    result.resize(600, 400).write(`${path.split('.JPG')[0]}.png`);
  });
}
