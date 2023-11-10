import { styled } from '@ch-four-cuts/bezier-design-system';

export const Container = styled.div`
  height: 100dvh;
`;

export const Header = styled.header`
  padding: 16px;
  height: 75px;

  img {
    height: 100%;
  }
`;

export const Content = styled.main`
  height: calc(100dvh - 75px - 82px);
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

export const Footer = styled.footer`
  height: 82px;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;

  a {
    flex: 1;
  }

  button {
    white-space: pre-line;
    width: 100%;
  }
`;
