import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { fromIni } from '@aws-sdk/credential-providers';
import { Resvg } from '@resvg/resvg-js';
import { TRPCError } from '@trpc/server';
import { mkdir, readFile, writeFile } from 'fs/promises';
import _ from 'lodash';
import { resolve } from 'path';
import { z } from 'zod';
import { generateImage } from '#/features/Frame/server/generateImage';
import { publicProcedure, router } from '#/server/trpc';
import prisma from '#/utils/prisma.server';
import type { FrameId } from '#/features/Frame';

const BUCKET_URL = import.meta.env?.AWS_BUCKET;
const client = new S3Client({
  credentials: fromIni({ profile: import.meta.env?.AWS_PROFILE }),
});

export const frameRouter = router({
  createFrameImage: publicProcedure
    .input(
      z.object({
        sessionId: z.string().uuid(),
        imageUrl: z.array(z.string()),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const session = await prisma.session.findFirst({
          where: {
            sessionId: input.sessionId,
          },
          select: {
            sessionId: true,
            frameType: true,
          },
        });
        if (!session) {
          throw new TRPCError({
            code: 'NOT_FOUND',
          });
        }

        const frameId = _.toNumber(session.frameType) as FrameId;
        const inputImageBuffer =
          frameId === 1
            ? 'data:image/png;base64,' +
              (await readFile(resolve('public/images/input/' + session.sessionId + '/' + input.imageUrl[0]))).toString(
                'base64',
              )
            : (
                await Promise.all(
                  input.imageUrl.map((imageUrl) =>
                    readFile(resolve('public/images/input/' + session.sessionId + '/' + imageUrl)),
                  ),
                )
              ).map((buffer) => 'data:image/png;base64,' + buffer.toString('base64'));
        const outputImageBuffer =
          frameId === 1
            ? 'data:image/png;base64,' +
              (await readFile(resolve('public/images/output/' + session.sessionId + '/' + input.imageUrl[0]))).toString(
                'base64',
              )
            : (
                await Promise.all(
                  input.imageUrl.map((imageUrl) =>
                    readFile(resolve('public/images/output/' + session.sessionId + '/' + imageUrl)),
                  ),
                )
              ).map((buffer) => 'data:image/png;base64,' + buffer.toString('base64'));
        const originalFrame = await generateImage({
          frameId,
          imageUrl: inputImageBuffer,
          qrcodeUrl: import.meta.env.APP_URL + session.sessionId,
          hasPadding: true,
        });
        const transformedFrame = await generateImage({
          frameId,
          imageUrl: outputImageBuffer,
          qrcodeUrl: import.meta.env.APP_URL + session.sessionId,
          hasPadding: true,
        });

        const originalFrameBuffer = new Resvg(originalFrame).render().asPng();
        const transformedFrameBuffer = new Resvg(transformedFrame).render().asPng();

        await mkdir(resolve(`public/images/frame/${session.sessionId}/`)).catch(_.noop);
        await writeFile(resolve(`public/images/frame/${session.sessionId}/original.png`), originalFrameBuffer);
        await writeFile(resolve(`public/images/frame/${session.sessionId}/transformed.png`), transformedFrameBuffer);

        const putOriginalObjectCommand = new PutObjectCommand({
          Bucket: BUCKET_URL,
          Key: `/frame/${session.sessionId}/original.png`,
          Body: originalFrameBuffer,
        });
        const putTransformedObjectCommand = new PutObjectCommand({
          Bucket: BUCKET_URL,
          Key: `/frame/${session.sessionId}/transformed.png`,
          Body: transformedFrameBuffer,
        });

        await client.send(putOriginalObjectCommand);
        await client.send(putTransformedObjectCommand);

        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        console.log(error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '프레임을 만드는데 실패했습니다',
          cause: error,
        });
      }
    }),
});
