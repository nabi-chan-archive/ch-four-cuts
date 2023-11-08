import SonyCamera from '@ch-four-cuts/sony-camera';
import { TRPCError } from '@trpc/server';
import { observable } from '@trpc/server/observable';
import EventEmitter from 'events';
import { z } from 'zod';
import { convertJpgToPng } from '#/features/Images/utils/convertJpgToPng';
import { publicProcedure, router } from '#/server/trpc';

const event = new EventEmitter();
const camera = new SonyCamera({ debug: true });

export const cameraRouter = router({
  connected: publicProcedure.query(() => camera.connected),
  connect: publicProcedure.mutation(async () => {
    try {
      if (camera.connected) {
        throw new Error('이미 연결되었습니다.');
      }
      if (camera.connecting) {
        throw new Error('연결중입니다.');
      }
      return await new Promise<{ success: true }>((resolve, reject) => {
        event.emit('connected');
        camera.connect((error) => {
          if (error) {
            reject(error);
          }

          resolve({ success: true });
        });
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message,
        });
      }

      console.error(error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: '카메라 연결에 실패했습니다',
      });
    }
  }),
  disconnect: publicProcedure.mutation(async () => {
    try {
      if (!camera.connected) {
        throw new Error('이미 연결 해제되었습니다.');
      }
      return await new Promise<{ success: true }>((resolve, reject) => {
        event.emit('disconnected');
        camera.disconnect((error) => {
          if (error) {
            reject(error);
          }

          resolve({ success: true });
        });
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message,
        });
      }

      console.error(error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: '카메라 연결 해제에 실패했습니다',
      });
    }
  }),
  enablePreview: publicProcedure.mutation(() => {
    camera.startViewfinder();
    return { success: true };
  }),
  disablePreview: publicProcedure.mutation(() => {
    camera.stopViewfinder();
    return { success: true };
  }),
  preview: publicProcedure.subscription(() => {
    return observable<string>((emit) => {
      const handlePreview = (preview: Buffer) => {
        emit.next('data:image/png;base64,' + preview.toString('base64'));
      };

      camera.on('liveviewJpeg', handlePreview);

      return () => {
        event.off('liveviewJpeg', handlePreview);
      };
    });
  }),
  capture: publicProcedure
    .input(
      z
        .object({
          outputUrl: z.string().optional(),
          sessionId: z.string().optional(),
        })
        .optional(),
    )
    .mutation(({ input }) => {
      return new Promise<{ bufferString: string; filePath: string }>((done, reject) => {
        camera.capture(false, (error, photoName, buffer) => {
          if (error) {
            return reject(error);
          }

          const savePath = input?.sessionId
            ? `public/images/input/${input.sessionId}/${photoName}`
            : input?.outputUrl
            ? `${input.outputUrl}/${photoName}`
            : `public/images/${photoName}`;

          convertJpgToPng(buffer, savePath);

          done({
            bufferString: buffer.toString('base64'),
            filePath: `${savePath.split('.JPG')[0]}.png`.replace('public/', ''),
          });
        });
      });
    }),
});
