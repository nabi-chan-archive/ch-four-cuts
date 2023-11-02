import { Icon, IconSize, Text, Typography } from '@ch-four-cuts/bezier-design-system';
import { ChannelBtnSmileFilledIcon } from '@ch-four-cuts/bezier-design-system/icons';
import { usePageContext } from '#/features/PageContext';
import * as Styled from './camera.styled';

function Page() {
  const {
    urlParsed: { search },
  } = usePageContext();

  return (
    <Styled.Container>
      <Styled.Wrapper>
        <Icon source={ChannelBtnSmileFilledIcon} size={72 as IconSize} color="bgtxt-blue-normal" />
        <Text typo={Typography.Size36} bold marginTop={8}>
          📸 1 / 6 번째 사진 찍는 중...
        </Text>
        <Styled.CameraView displayLine={search.displayLine === 'true'}>
          <img src="https://placekitten.com/1920/1080" alt="" />
          <Styled.CameraCounter>{20}</Styled.CameraCounter>
        </Styled.CameraView>
      </Styled.Wrapper>
    </Styled.Container>
  );
}

export { Page };
