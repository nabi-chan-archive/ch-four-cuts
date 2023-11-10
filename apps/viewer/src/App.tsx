import { Button, ButtonSize } from '@ch-four-cuts/bezier-design-system';
import { useMemo } from 'react';
import * as Styled from './App.styled';

function App() {
  const sessionId = useMemo(() => window.location.search.split('=')[1], []);

  return (
    <Styled.Container>
      <Styled.Header>
        <img src="/logo.svg" alt="" />
      </Styled.Header>
      <Styled.Content>
        <Styled.Image src={`/frame/${sessionId}/original.png`} alt="" />
      </Styled.Content>
      <Styled.Footer>
        <Button size={ButtonSize.XL} text="다운로드" />
        <Button size={ButtonSize.XL} text={`채널톡이\n 궁금하다면?`} />
      </Styled.Footer>
    </Styled.Container>
  );
}

export default App;
