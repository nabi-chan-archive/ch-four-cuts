import { Button, ButtonSize, Icon, IconSize, Text, Typography } from '@ch-four-cuts/bezier-design-system';
import { ChannelBtnSmileFilledIcon } from '@ch-four-cuts/bezier-design-system/icons';
import * as Styled from './select.styled';

function Page() {
  return (
    <Styled.Container>
      <Styled.Wrapper>
        <Icon source={ChannelBtnSmileFilledIcon} size={72 as IconSize} color="bgtxt-blue-normal" />
        <Text typo={Typography.Size36} bold marginTop={8} marginBottom={12}>
          🖼️ 사진을 선택해주세요!
        </Text>

        <Styled.PhotoGrid>
          <Styled.Photo src="https://placekitten.com/600/400" selected />
          <Styled.Photo src="https://placekitten.com/600/400" />
          <Styled.Photo src="https://placekitten.com/600/400" selected />
          <Styled.Photo src="https://placekitten.com/600/400" selected />
          <Styled.Photo src="https://placekitten.com/600/400" />
          <Styled.Photo src="https://placekitten.com/600/400" />
        </Styled.PhotoGrid>

        <Button disabled text="3 / 4 장 선택됨" size={ButtonSize.XL} />
      </Styled.Wrapper>
    </Styled.Container>
  );
}

export { Page };
