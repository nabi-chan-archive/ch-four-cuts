import { Frame1, Frame4 } from '#/features/Frame';
import * as Styled from './frame.styled';

function Page() {
  return (
    <Styled.Wrapper>
      <Styled.Container>
        <div id="frameWrapper">
          <Frame1 imageSrc={'https://placekitten.com/600/400'} qrCodeLink={'https://naver.com'} />
        </div>
        <div id="frameWrapper">
          <Frame4
            imageSrc={[
              'https://placekitten.com/600/400',
              'https://placekitten.com/600/400',
              'https://placekitten.com/600/400',
              'https://placekitten.com/600/400',
            ]}
            qrCodeLink={'https://naver.com'}
          />
        </div>
      </Styled.Container>
    </Styled.Wrapper>
  );
}

export { Page };
