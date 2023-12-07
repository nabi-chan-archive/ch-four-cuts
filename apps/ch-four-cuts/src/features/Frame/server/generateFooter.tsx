import { readFile } from 'fs/promises';
import { resolve } from 'path';
import qrcode from 'qrcode';
import satori from 'satori';
import { Footer } from '#/features/Frame';

interface GenerateFooterArgs {
  qrcodeUrl: string;
}

export async function generateFooter({ qrcodeUrl }: GenerateFooterArgs) {
  const qrCodeLink = await qrcode.toDataURL(qrcodeUrl);

  return await satori(
    <div style={{ display: 'flex', flexDirection: 'column', width: 520 }}>
      <Footer qrCodeLink={qrCodeLink} qrCodeUrl={qrcodeUrl} />
    </div>,
    {
      width: 520,
      height: 130,
      fonts: [
        {
          name: 'Pretendard',
          data: await readFile(resolve('src/assets/pretendard/Pretendard-Medium.ttf')),
        },
      ],
    },
  );
}
