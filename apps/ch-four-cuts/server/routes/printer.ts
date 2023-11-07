import { Resvg } from '@resvg/resvg-js';
import { mkdir, readdir } from 'fs/promises';
import { PrinterTypes, ThermalPrinter } from 'node-thermal-printer';
import { resolve } from 'path';
import { z } from 'zod';
import { generateFooter } from '#/features/Frame/server/generateFooter';
import { transformImage } from '#/features/Images/utils/transformImage';
import { publicProcedure, router } from '../trpc.js';

const tp = new ThermalPrinter({
  type: PrinterTypes.EPSON,
  interface: 'printer:BIXOLON_SRP_330II',
  driver: require('printer'),
});

export const printerRouter = router({
  test: publicProcedure.mutation(async () => {
    tp.println('Hello World!');
    tp.cut();
    tp.execute();
    return 'success';
  }),
  frame: publicProcedure.input(z.object({ sessionId: z.string().uuid() })).mutation(async ({ input }) => {
    try {
      const listFiles = await readdir(resolve('public/images/input/' + input.sessionId));
      await readdir(resolve('public/images/output/' + input.sessionId)).catch(() => {
        mkdir(resolve('public/images/output/' + input.sessionId));
      });

      const buffers = await Promise.all(
        listFiles.map((filename) =>
          transformImage(filename, `public/images/input/${input.sessionId}`, `public/images/output/${input.sessionId}`),
        ),
      );

      for (const buffer of buffers) {
        tp.printImageBuffer(buffer);
        tp.println('');
      }

      const footerImage = new Resvg(await generateFooter({ qrcodeUrl: input.sessionId }), { dpi: 180 })
        .render()
        .asPng();
      tp.printImageBuffer(footerImage);

      tp.cut();
      await tp.execute();

      return 'success';
    } catch (error) {
      console.log(error);
      throw error;
    }
  }),
});
