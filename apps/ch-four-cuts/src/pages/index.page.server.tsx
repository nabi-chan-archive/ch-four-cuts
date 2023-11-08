import { redirect } from 'vike/abort';
import prisma from '#/utils/prisma.server';

export async function onBeforeRender() {
  const configCount = await prisma.config.count();

  if (configCount <= 0) {
    throw redirect('/app-settings');
  }
}
