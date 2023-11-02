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
