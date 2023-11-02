import { trpc } from '#/utils/trpc';

export { Page };

function Page() {
  const { data } = trpc.greet.useQuery('world');

  return <>{data?.greeting}</>;
}
