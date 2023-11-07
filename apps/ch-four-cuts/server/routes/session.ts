import { TRPCError } from '@trpc/server';
import { readdir } from 'fs/promises';
import { resolve } from 'path';
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';

export const sessionRouter = router({
  images: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      try {
        return await readdir(resolve(`public/images/input/${input.sessionId}`));
      } catch (error) {
        throw new TRPCError({
          message: 'invalid sessionId',
          code: 'NOT_FOUND',
        });
      }
    }),
});
