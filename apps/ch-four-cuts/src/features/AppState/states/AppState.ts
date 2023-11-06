import { atom } from 'jotai';
import type { FrameId } from '#/features/Frame';

export const sessionAtom = atom<string | null>(null);

export const printerCountAtom = atom<number>(1);
export const printerFrameAtom = atom<FrameId>(1);
