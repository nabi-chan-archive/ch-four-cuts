import { Icon, IconSize, Text, Typography } from '@ch-four-cuts/bezier-design-system';
import { ChannelBtnSmileFilledIcon } from '@ch-four-cuts/bezier-design-system/icons';
import { navigate } from 'vike/client/router';
import * as Styled from './frame.styled';

function Page() {
  const handleClickFrame = (frameId: 1 | 4) => () => {
    navigate(`/app/camera?frameId=${frameId}`);
  };

  return (
    <Styled.Container>
      <Styled.Wrapper>
        <Icon source={ChannelBtnSmileFilledIcon} size={72 as IconSize} color="bgtxt-blue-normal" />
        <Text typo={Typography.Size36} bold marginTop={8}>
          🖼️ 어떤 프레임으로 찍을까요?
        </Text>
        <Text typo={Typography.Size18} marginBottom={24}>
          원하시는 프레임을 선택해주세요!
        </Text>
        <Styled.FrameContainer>
          <Styled.Frame as="button" onClick={handleClickFrame(1)}>
            <img src="https://placekitten.com/1200/900" alt="" />
            <Styled.FrameContent>
              <Text typo={Typography.Size24} bold>
                한컷 찍기 📸
              </Text>
            </Styled.FrameContent>
          </Styled.Frame>
          <Styled.Frame as="button" onClick={handleClickFrame(4)}>
            <img src="https://placekitten.com/1200/900" alt="" />
            <Styled.FrameContent>
              <Text typo={Typography.Size24} bold>
                네컷 찍기 📸
              </Text>
            </Styled.FrameContent>
          </Styled.Frame>
        </Styled.FrameContainer>
      </Styled.Wrapper>
    </Styled.Container>
  );
}

export { Page };
