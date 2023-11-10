import { Resvg } from '@resvg/resvg-js';
import { TRPCError } from '@trpc/server';
import { mkdir, readdir } from 'fs/promises';
import _ from 'lodash';
import { PrinterTypes, ThermalPrinter } from 'node-thermal-printer';
import { resolve } from 'path';
import { z } from 'zod';
import { generateFooter } from '#/features/Frame/server/generateFooter';
import { transformImage } from '#/features/Images/utils/transformImage';
import { publicProcedure, router } from '#/server/trpc';
import prisma from '#/utils/prisma.server';

let printer: ThermalPrinter;

export const printerRouter = router({
  connected: publicProcedure.query(() => {
    try {
      return printer.isPrinterConnected();
    } catch {
      return false;
    }
  }),
  connect: publicProcedure.mutation(async () => {
    try {
      const config = await prisma.config.findFirst();
      if (!config) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: '프린터 설정이 필요합니다.',
        });
      }
      if (config?.printerType === 'USB') {
        printer = new ThermalPrinter({
          type: PrinterTypes.EPSON,
          interface: `printer:${config.printerName}`,
          driver: require('printer'),
        });
        return { success: true };
      }
      if (config?.printerType === 'NETWORK') {
        printer = new ThermalPrinter({
          type: PrinterTypes.EPSON,
          interface: `tcp://${config.printerIp}:${config.printerPort}`,
        });
        return { success: true };
      }
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      console.log(error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: '프린터 연결에 실패했습니다.',
        cause: error,
      });
    }
  }),
  frame: publicProcedure
    .input(z.object({ sessionId: z.string(), selectedImages: z.array(z.string()) }))
    .mutation(async ({ input }) => {
      try {
        const listFiles = await readdir(resolve('public/images/input/' + input.sessionId));
        const footerSvg = await generateFooter({ qrcodeUrl: import.meta.env.APP_URL + input.sessionId });
        await prisma.session.update({
          where: { sessionId: input.sessionId },
          data: { printedCount: { increment: 1 } },
        });
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
              printer.printImageBuffer(buffer);
              printer.println('');
            }),
        );

        const footerImage = new Resvg(footerSvg, { dpi: 180 }).render().asPng();
        printer.printImageBuffer(footerImage);

        printer.cut();
        await printer.execute();
        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.log(error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '프린터 인쇄에 실패했습니다.',
          cause: error,
        });
      } finally {
        printer.clear();
      }
    }),
});
