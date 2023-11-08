import { TRPCError } from '@trpc/server';
import { getPrinters } from 'printer';
import { z } from 'zod';
import { publicProcedure, router } from '#/server/trpc';
import prisma from '#/utils/prisma.server';

export const settingsRouter = router({
  // Initial Config
  printerList: publicProcedure.query(() => getPrinters()),
  applyConfig: publicProcedure
    .input(
      z.object({
        configuredAt: z.string().datetime(),
        printerType: z.union([z.literal('NETWORK'), z.literal('USB')]),
        printerName: z.string().nullable(),
        printerIp: z.string().nullable(),
        printerPort: z.number().nullable(),
      }),
    )
    .mutation(async ({ input: data }) => {
      try {
        await prisma.config.create({ data });
        return { success: true };
      } catch (e) {
        console.error(e);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to initialize config',
        });
      }
    }),
});
