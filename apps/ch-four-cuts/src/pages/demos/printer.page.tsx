import { Button } from '@ch-four-cuts/bezier-design-system';
import { trpc } from '#/utils/trpc';

export function Page() {
  const { mutate: trigger } = trpc.printer.test.useMutation();

  return (
    <div>
      <Button onClick={() => trigger()} text="테스트하기" />
    </div>
  );
}
