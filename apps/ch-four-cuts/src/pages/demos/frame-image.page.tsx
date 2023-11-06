import { trpc } from '#/utils/trpc';
import * as Styled from './frame-image.styled';

export function Page() {
  const { data: frame1 } = trpc.satori.frame.useQuery({
    frameId: 1,
    imageUrl: 'https://placekitten.com/600/400',
    hasPadding: true,
  });
  const { data: frame4 } = trpc.satori.frame.useQuery({
    frameId: 4,
    imageUrl: [
      'https://placekitten.com/600/400',
      'https://placekitten.com/600/400',
      'https://placekitten.com/600/400',
      'https://placekitten.com/600/400',
    ],
    hasPadding: true,
  });

  return (
    <Styled.Wrapper>
      <Styled.Container>
        <div dangerouslySetInnerHTML={{ __html: frame1 ?? '' }}></div>
        <div dangerouslySetInnerHTML={{ __html: frame4 ?? '' }}></div>
      </Styled.Container>
    </Styled.Wrapper>
  );
}
