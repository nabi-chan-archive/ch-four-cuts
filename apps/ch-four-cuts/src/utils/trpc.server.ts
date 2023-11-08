import { createServerSideHelpers } from '@trpc/react-query/server';
import { appRouter } from '#/server/routes';
import { createContext } from '#/server/trpc';

export const helpers = createServerSideHelpers({
  router: appRouter,
  ctx: createContext(),
});
