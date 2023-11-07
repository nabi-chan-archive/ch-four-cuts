import { createCanvas, loadImage } from 'canvas';
import transformer from 'floyd-steinberg';
import { writeFile } from 'fs/promises';
import { resolve } from 'path';
import { PNG } from 'pngjs';

export async function transformImage(
  filename: string,
  input = '/public/images/input',
  output = '/public/images/output',
  { width = 600, height = 400 },
) {
  const inputPath = resolve(input, filename);
  const outputPath = resolve(output, filename);

  const canvas = createCanvas(width, height);
  const context = canvas.getContext('2d');

  const image = await loadImage(inputPath);
  context.drawImage(image, 0, 0);

  const transformed = transformer({
    data: context.getImageData(0, 0, width, height).data,
    width,
    height,
  });

  const result = new PNG({ width, height });
  result.data = Buffer.from(transformed.data);
  const resultBuffer = PNG.sync.write(result);

  await writeFile(outputPath, resultBuffer);

  return resultBuffer;
}
