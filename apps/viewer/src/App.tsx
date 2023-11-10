import { Button, ButtonSize, Icon, IconSize, Text, Typography } from '@ch-four-cuts/bezier-design-system';
import { GhostIcon } from '@ch-four-cuts/bezier-design-system/icons';
import { useMemo } from 'react';
import * as Styled from './App.styled';

function App() {
  const sessionId = useMemo(() => window.location.search.split('=')[1], []);

  if (!sessionId) {
    return (
      <Styled.Container>
        <Styled.Header>
          <img src="/logo.svg" alt="" />
        </Styled.Header>
        <Styled.Content>
          <Icon source={GhostIcon} size={64 as IconSize} />
          <Text typo={Typography.Size36} bold>
            올바르지 않은 접근입니다.
          </Text>
        </Styled.Content>
        <Styled.Footer>
          <a href="https://channel.io/ko/team">
            <Button size={ButtonSize.XL} text={`채널톡이 궁금하다면?`} />
          </a>
        </Styled.Footer>
      </Styled.Container>
    );
  }

  return (
    <Styled.Container>
      <Styled.Header>
        <img src="/logo.svg" alt="" />
      </Styled.Header>
      <Styled.Content>
        <Styled.Image src={`/frame/${sessionId}/original.png`} alt="" />
      </Styled.Content>
      <Styled.Footer>
        <a href={`/frame/${sessionId}/original.png`} download>
          <Button size={ButtonSize.XL} text="다운로드" />
        </a>
        <a href="https://channel.io/ko/team">
          <Button size={ButtonSize.XL} text={`채널톡이\n 궁금하다면?`} />
        </a>
      </Styled.Footer>
    </Styled.Container>
  );
}

export default App;
