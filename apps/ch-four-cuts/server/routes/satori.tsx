import { readFile } from 'fs/promises';
import { resolve } from 'path';
import satori from 'satori';
import { publicProcedure, router } from '../trpc.js';

export const satoriRouter = router({
  generate: publicProcedure.query(async () => {
    return await satori(
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
          fontSize: 32,
          fontWeight: 600,
        }}
      >
        <svg width="75" viewBox="0 0 75 65" fill="#000" style={{ margin: '0 75px' }}>
          <path d="M37.59.25l36.95 64H.64l36.95-64z"></path>
        </svg>
        <div style={{ marginTop: 40 }}>Hello, World</div>
      </div>,
      {
        width: 800,
        height: 400,
        fonts: [
          {
            name: 'Pretendard',
            data: await readFile(resolve('src/assets/pretendard/Pretendard-Medium.ttf')),
          },
        ],
      },
    );
  }),
});
