import { AlphaStack, css, styled } from '@ch-four-cuts/bezier-design-system';

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

export const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
  margin-bottom: 24px;
`;

const SelectedPhotoCss = css`
  ${({ foundation }) => foundation?.border.getBorder(4, foundation.theme['bgtxt-purple-normal'])}
  ${({ foundation }) => foundation?.elevation.ev3()}
  opacity: 1;
`;

export const Photo = styled.img<{ selected?: boolean }>`
  ${({ foundation }) => foundation?.transition.getTransitionsCSS(['opacity', 'border', 'box-shadow'])}
  ${({ foundation }) => foundation?.rounding.round8}
  border: solid 4px transparent;
  width: 100%;
  opacity: 0.5;

  ${({ selected }) => selected && SelectedPhotoCss}
`;
