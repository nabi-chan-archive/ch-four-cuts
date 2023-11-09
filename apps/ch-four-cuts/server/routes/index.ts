import { publicProcedure, router } from '#/server/trpc';
import { cameraRouter } from './camera';
import { frameRouter } from './frame';
import { printerRouter } from './printer';
import { sessionRouter } from './session';
import { settingsRouter } from './settings';

export const appRouter = router({
  printer: printerRouter,
  camera: cameraRouter,
  session: sessionRouter,
  settings: settingsRouter,
  frame: frameRouter,
  greet: publicProcedure
    .input((val: unknown) => {
      if (typeof val === 'string') return val;
      throw new Error(`Invalid input: ${typeof val}`);
    })
    .query(({ input }) => ({ greeting: `hello, ${input}!` })),
});

export type AppRouter = typeof appRouter;
