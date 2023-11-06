import { styled } from '@ch-four-cuts/bezier-design-system';

export const Wrapper = styled.div`
  max-height: 100%;
  overflow-y: auto;
  background-color: black;
`;

export const Container = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 16px;

  div,
  span {
    all: unset;
  }
`;
