import { readdir } from 'fs/promises';
import { resolve } from 'path';
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';

export const settingsRouter = router({
  sessionList: publicProcedure.query(async () => {
    const files = await readdir(resolve('public/images/input/'), { withFileTypes: true });
    const sessionList = files.filter((item) => item.isDirectory());
    return sessionList.map((item) => item.name);
  }),
  sessionDetail: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const files = await readdir(resolve('public/images/input/' + input.sessionId), { withFileTypes: true });
      const sessionList = files.filter((item) => item.isFile());
      return sessionList.map((item) => item.name);
    }),
  sessionLength: publicProcedure.query(async () => {
    const files = await readdir(resolve('public/images/input/'), { withFileTypes: true });
    const sessionList = files.filter((item) => item.isDirectory());
    return sessionList.length;
  }),
});
