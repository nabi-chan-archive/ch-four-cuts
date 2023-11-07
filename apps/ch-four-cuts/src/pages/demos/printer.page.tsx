import { Button } from '@ch-four-cuts/bezier-design-system';
import { trpc } from '#/utils/trpc';

export function Page() {
  const { mutate: trigger } = trpc.printer.frame.useMutation();

  return (
    <div>
      <Button onClick={() => trigger({ sessionId: '23c07e9e-a879-40e1-a546-18e9ce727b24' })} text="테스트하기" />
    </div>
  );
}
