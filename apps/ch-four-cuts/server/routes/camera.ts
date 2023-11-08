import SonyCamera from '@ch-four-cuts/sony-camera';
import { observable } from '@trpc/server/observable';
import EventEmitter from 'events';
import { z } from 'zod';
import { convertJpgToPng } from '#/features/Images/utils/convertJpgToPng';
import { publicProcedure, router } from '#/server/trpc';

const event = new EventEmitter();
const camera = new SonyCamera({ debug: true });

export const cameraRouter = router({
  connected: publicProcedure.query(() => camera.connected),
  connect: publicProcedure.mutation(() => {
    if (camera.connected) {
      throw new Error('Already connected');
    }
    if (camera.connecting) {
      throw new Error('Already connecting');
    }
    return new Promise<string>((resolve, reject) => {
      event.emit('connected');
      camera.connect((error) => {
        if (error) {
          reject(error);
        }

        resolve('success');
      });
    });
  }),
  disconnect: publicProcedure.mutation(() => {
    if (!camera.connected) {
      throw new Error('Already disconnected');
    }
    return new Promise<string>((resolve, reject) => {
      event.emit('disconnected');
      camera.disconnect((error) => {
        if (error) {
          reject(error);
        }

        resolve('success');
      });
    });
  }),
  params: publicProcedure.query(() => ({
    connected: camera.connected,
    status: camera.status,
    photosRemaining: camera.photosRemaining,
    params: camera.params,
  })),
  info: publicProcedure.subscription(() => {
    return observable<{ connected: boolean } | unknown[]>((emit) => {
      const handleParams = (...args: unknown[]) => {
        emit.next(args);
      };
      const handleConnected = () => {
        emit.next({ connected: true });
      };
      const handleDisconnected = () => {
        emit.next({ connected: false });
      };

      event.on('connected', handleConnected);
      event.on('disconnected', handleDisconnected);
      camera.on('params', handleParams);

      return () => {
        camera.off('params', handleParams);
        event.off('connected', handleConnected);
        event.off('disconnected', handleDisconnected);
      };
    });
  }),
  enablePreview: publicProcedure.mutation(() => {
    camera.startViewfinder();
    return 'success';
  }),
  disablePreview: publicProcedure.mutation(() => {
    camera.stopViewfinder();
    return 'success';
  }),
  preview: publicProcedure.subscription(() => {
    return observable<string>((emit) => {
      const handlePreview = (preview: Buffer) => {
        emit.next(preview.toString('base64'));
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
            filePath: `${savePath.split('.JPG')[0]}.png`,
          });
        });
      });
    }),
});
