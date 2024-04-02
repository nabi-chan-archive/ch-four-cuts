import { Button, ButtonSize, Icon, IconSize, Text, Typography } from '@ch-four-cuts/bezier-design-system';
import { ChannelBtnFilledIcon } from '@ch-four-cuts/bezier-design-system/icons';
import * as Styled from './index.styled';

function Page() {
  return (
    <Styled.Container>
      <Styled.Wrapper>
        <Icon source={ChannelBtnFilledIcon} size={72 as IconSize} color="bgtxt-blue-normal" />
        <Text typo={Typography.Size36} bold marginTop={8}>
          채널 네컷 🎊
        </Text>
        <Text typo={Typography.Size18} marginBottom={24}>
          당신의 인생샷을 채널 네컷으로!
        </Text>
        <a href="/app/intro">
          <Button text="시작하기 ✨" size={ButtonSize.XL} />
        </a>
      </Styled.Wrapper>
    </Styled.Container>
  );
}

export { Page };
