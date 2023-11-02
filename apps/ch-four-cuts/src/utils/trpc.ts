import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '#/server/routes';

export const trpc = createTRPCReact<AppRouter>();
