import { AlphaStack, css, styled } from '@ch-four-cuts/bezier-design-system';

export const Header = styled(AlphaStack).attrs({ direction: 'horizontal', spacing: 8 })`
  align-items: center;
  margin-bottom: 8px;
`;

export const Section = styled(AlphaStack).attrs({ direction: 'vertical', spacing: 8 })`
  ${({ foundation }) => foundation?.rounding.round8}
  ${({ foundation }) => foundation?.elevation.ev3()}
  overflow: visible;
  padding: 16px;
`;

export const DropdownInterpolation = css`
  padding: 8px;
  width: 100%;
  max-height: 150px;
  overflow-y: auto;
`;
