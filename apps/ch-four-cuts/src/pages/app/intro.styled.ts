import { AlphaStack, styled, Text } from '@ch-four-cuts/bezier-design-system';

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

export const ButtonSelector = styled(AlphaStack).attrs({ direction: 'horizontal', spacing: 16 })`
  align-items: center;
  margin-bottom: 48px;
`;

export const ButtonText = styled(Text)`
  font-size: 4em;
  line-height: 1;
  width: 36px;
  text-align: center;
`;
