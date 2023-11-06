import { readFile } from 'fs/promises';
import { resolve } from 'path';
import satori from 'satori';
import { Frame1, Frame4, type FrameId } from '#/features/Frame';

interface GenerateImageArgs {
  frameId: FrameId;
  imageUrl: string | [string, string, string, string];
  qrcodeUrl: string;
  hasPadding: boolean;
}

export async function generateImage({ frameId, imageUrl, qrcodeUrl, hasPadding }: GenerateImageArgs) {
  if (frameId === 1) {
    return await satori(<Frame1 imageSrc={imageUrl as string} qrCodeLink={qrcodeUrl} hasPadding={hasPadding} />, {
      width: 599,
      height: 490,
      fonts: [
        {
          name: 'Pretendard',
          data: await readFile(resolve('src/assets/pretendard/Pretendard-Medium.ttf')),
        },
      ],
    });
  }

  if (frameId === 4) {
    return await satori(
      <Frame4 imageSrc={imageUrl as [string, string, string, string]} qrCodeLink={qrcodeUrl} hasPadding={hasPadding} />,
      {
        width: 599,
        height: 1672,
        fonts: [
          {
            name: 'Pretendard',
            data: await readFile(resolve('src/assets/pretendard/Pretendard-Medium.ttf')),
          },
        ],
      },
    );
  }

  throw new Error(`invalid frameId: ${frameId}`);
}
