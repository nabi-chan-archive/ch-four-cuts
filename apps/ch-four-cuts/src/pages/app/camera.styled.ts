import { AlphaStack, css, styled, Text } from '@ch-four-cuts/bezier-design-system';

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

const tripleGridOnCameraWindow = css`
  &::after {
    content: '';
    position: absolute;
    z-index: 1;
    height: 100%;
    width: 100%;
    top: -4px;
    left: -3px;
    right: 0;
    bottom: 0;
    background-size: 33.333% 33.333%;
    background-image: ${({ foundation }) =>
      `linear-gradient(90deg, ${foundation?.theme['bg-black-dark']} 3px, transparent 1px), linear-gradient(180deg, ${foundation?.theme['bg-black-dark']} 3px, transparent 1px)`};
  }
`;

export const CameraView = styled.div<{ displayLine?: boolean }>`
  ${({ foundation }) => foundation?.rounding.round8}
  position: relative;

  img {
    transform: rotateY('180deg');
    min-width: 1000px;
    width: 100%;
  }

  ${({ displayLine }) => displayLine && tripleGridOnCameraWindow}
`;

export const CameraCounter = styled(Text).attrs({ bold: true })`
  position: absolute;
  font-size: 5em;
  line-height: 100px;
  z-index: 1;
  right: 30px;
  top: 30px;
  width: 100px;
  height: 100px;
  text-align: center;
  text-shadow: white 0px 0px 10px;
`;
