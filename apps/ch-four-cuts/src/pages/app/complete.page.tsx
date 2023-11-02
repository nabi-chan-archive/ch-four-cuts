import { Button, ButtonSize, Icon, IconSize, Text, Typography } from '@ch-four-cuts/bezier-design-system';
import { ChannelBtnSmileFilledIcon } from '@ch-four-cuts/bezier-design-system/icons';
import * as Styled from './select.styled';

function Page() {
  return (
    <Styled.Container>
      <Styled.Wrapper>
        <Icon source={ChannelBtnSmileFilledIcon} size={72 as IconSize} color="bgtxt-blue-normal" />
        <Text typo={Typography.Size36} bold marginTop={8}>
          모두 인쇄 완료!
        </Text>
        <Text typo={Typography.Size24} marginBottom={24}>
          안녕히 가세요! 👋
          <br />
          해커톤에서 좋은 결과가 있기를 바라요!
        </Text>

        <a href="/">
          <Button text="처음으로 돌아가기 🏡" size={ButtonSize.L} />
        </a>
      </Styled.Wrapper>
    </Styled.Container>
  );
}

export { Page };
