import { AlphaStack, styled } from '@ch-four-cuts/bezier-design-system';

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 8px;
`;

export const Wrapper = styled(AlphaStack).attrs({ direction: 'vertical', spacing: 8 })`
  align-items: center;
`;

export const FrameContainer = styled(AlphaStack).attrs({ direction: 'horizontal', spacing: 8 })``;

export const FrameContent = styled.div`
  padding: 16px;
  text-align: center;
`;

export const Frame = styled.div`
  ${({ foundation }) => foundation?.rounding.round16}
  ${({ foundation }) => foundation?.elevation.ev2()}
  ${({ foundation }) => foundation?.transition.getTransitionsCSS(['box-shadow'])}
  border: none;
  padding: 8px;

  &:hover {
    ${({ foundation }) => foundation?.elevation.ev3()}
  }

  img {
    ${({ foundation }) => foundation?.rounding.round8}
    width: 400px;
  }
`;
