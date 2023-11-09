import { TRPCError } from '@trpc/server';
import { readdir } from 'fs/promises';
import _ from 'lodash';
import { resolve } from 'path';
import { z } from 'zod';
import { publicProcedure, router } from '#/server/trpc';
import prisma from '#/utils/prisma.server';

export const sessionRouter = router({
  sessionList: publicProcedure.query(async () => {
    try {
      return await prisma.session.findMany({ select: { sessionId: true, createdAt: true, frameType: true } });
    } catch (error) {
      console.error(error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: '세션 목록을 가져오는데 실패했습니다.',
        cause: error,
      });
    }
  }),
  sessionDetail: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      try {
        const response = await prisma.session.findUnique({
          where: { sessionId: input.sessionId },
          select: { sessionId: true, createdAt: true, frameType: true },
        });
        if (!response) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: '선택된 세션이 없습니다',
          });
        }
        const filenames = await readdir(resolve('public/images/input/' + input.sessionId));
        return { ...response, filenames };
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        console.error(error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '세션 상세 정보를 가져오는데 실패했습니다.',
          cause: error,
        });
      }
    }),
  printCount: publicProcedure.query(async () => {
    try {
      return await prisma.session.aggregate({ _sum: { printedCount: true } });
    } catch (error) {
      console.error(error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: '인쇄 정보를 가져오는데 실패했습니다.',
        cause: error,
      });
    }
  }),
  createSession: publicProcedure.input(z.object({ frameType: z.number() })).mutation(async ({ input }) => {
    try {
      return await prisma.session.create({
        data: { frameType: _.toString(input.frameType) },
        select: {
          sessionId: true,
        },
      });
    } catch (error) {
      console.error(error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: '인쇄 정보를 가져오는데 실패했습니다.',
        cause: error,
      });
    }
  }),
});
