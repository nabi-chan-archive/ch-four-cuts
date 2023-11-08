import { Resvg } from '@resvg/resvg-js';
import { TRPCError } from '@trpc/server';
import { mkdir, readdir } from 'fs/promises';
import _ from 'lodash';
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

let busy = false;

export const printerRouter = router({
  connected: publicProcedure.query(() => tp.isPrinterConnected()),
  cut: publicProcedure.mutation(async () => {
    tp.cut();
    await tp.execute();
    return 'success';
  }),
  test: publicProcedure.mutation(async () => {
    tp.println('Hello World!');
    tp.cut();
    tp.execute();
    return 'success';
  }),
  frame: publicProcedure
    .input(z.object({ sessionId: z.string(), selectedImages: z.array(z.string()) }))
    .mutation(async ({ input }) => {
      if (busy) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Printer is busy',
        });
      }
      busy = true;

      try {
        const listFiles = await readdir(resolve('public/images/input/' + input.sessionId));
        const footerSvg = await generateFooter({ qrcodeUrl: input.sessionId });
        await readdir(resolve('public/images/output/' + input.sessionId)).catch(() => {
          mkdir(resolve('public/images/output/' + input.sessionId)).catch(_.noop);
        });

        await Promise.all(
          listFiles
            .filter((item) => input.selectedImages.includes(item))
            .map(async (filename) => {
              const buffer = await transformImage(
                filename,
                `public/images/input/${input.sessionId}`,
                `public/images/output/${input.sessionId}`,
                {
                  width: 600,
                  height: 400,
                },
              );
              tp.printImageBuffer(buffer);
              tp.println('');
            }),
        );

        const footerImage = new Resvg(footerSvg, { dpi: 180 }).render().asPng();
        tp.printImageBuffer(footerImage);

        tp.cut();
        await tp.execute();
        busy = false;
        return 'success';
      } catch (error) {
        console.log(error);
        throw error;
      } finally {
        tp.clear();
      }
    }),
});
