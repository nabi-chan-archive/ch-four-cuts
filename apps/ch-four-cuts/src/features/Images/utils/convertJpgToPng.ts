import jimp from 'jimp';

export function convertJpgToPng(imageBuffer: Buffer, path: string) {
  jimp.read(imageBuffer).then((result) => {
    result.write(`${path.split('.JPG')[0]}.png`);
  });
}
