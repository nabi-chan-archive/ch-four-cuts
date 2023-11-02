import { Button, ButtonSize, Icon, IconSize, Text, Typography } from '@ch-four-cuts/bezier-design-system';
import { ChannelBtnSmileFilledIcon } from '@ch-four-cuts/bezier-design-system/icons';
import * as Styled from './select.styled';

function Page() {
  return (
    <Styled.Container>
      <Styled.Wrapper>
        <Icon source={ChannelBtnSmileFilledIcon} size={72 as IconSize} color="bgtxt-blue-normal" />
        <Text typo={Typography.Size36} bold marginTop={8}>
          사진을 인쇄하고 있어요!
        </Text>
        <Text typo={Typography.Size24} marginBottom={24}>
          1 / 4 장 프린트 하는 중...
        </Text>

        <Button disabled text="인쇄 완료!" size={ButtonSize.XL} />
      </Styled.Wrapper>
    </Styled.Container>
  );
}

export { Page };
