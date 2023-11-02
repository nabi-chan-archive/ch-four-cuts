import {
  Button,
  ButtonSize,
  ButtonStyleVariant,
  Icon,
  IconSize,
  Text,
  Typography,
} from '@ch-four-cuts/bezier-design-system';
import { ChannelBtnSmileFilledIcon, MinusIcon, PlusIcon } from '@ch-four-cuts/bezier-design-system/icons';
import * as Styled from './intro.styled';

function Page() {
  return (
    <Styled.Container>
      <Styled.Wrapper>
        <Icon source={ChannelBtnSmileFilledIcon} size={72 as IconSize} color="bgtxt-blue-normal" />
        <Text typo={Typography.Size36} bold marginTop={8} marginBottom={24}>
          얼마나 많이 인쇄할까요?
        </Text>
        <Styled.ButtonSelector>
          <Button styleVariant={ButtonStyleVariant.Secondary} leftContent={MinusIcon} size={ButtonSize.XL} />
          <Styled.ButtonText bold>{1}</Styled.ButtonText>
          <Button styleVariant={ButtonStyleVariant.Secondary} leftContent={PlusIcon} size={ButtonSize.XL} />
        </Styled.ButtonSelector>
        <a href="/app/frame">
          <Button text="다음으로" size={ButtonSize.XL} />
        </a>
      </Styled.Wrapper>
    </Styled.Container>
  );
}

export { Page };
