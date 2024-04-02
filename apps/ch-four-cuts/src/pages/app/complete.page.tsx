import { Button, ButtonSize, Icon, IconSize, Text, Typography } from '@ch-four-cuts/bezier-design-system';
import { ChannelBtnFilledIcon } from '@ch-four-cuts/bezier-design-system/icons';
import { useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { selectedImageAtom, sessionAtom } from '#/features/AppState';
import * as Styled from './select.styled';

function Page() {
  const reset = useSetAtom(sessionAtom);
  const resetSelectedImage = useSetAtom(selectedImageAtom);

  useEffect(() => {
    reset('');
    resetSelectedImage([]);
  }, [reset, resetSelectedImage]);

  return (
    <Styled.Container>
      <Styled.Wrapper>
        <Icon source={ChannelBtnFilledIcon} size={72 as IconSize} color="bgtxt-blue-normal" />
        <Text typo={Typography.Size36} bold marginTop={8}>
          모두 인쇄 완료!
        </Text>
        <Text typo={Typography.Size24} marginBottom={24}>
          안녕히 가세요! 👋
          <br />
          채널코퍼레이션과 함께 좋은 시간 보내세요!
        </Text>

        <a href="/">
          <Button text="처음으로 돌아가기 🏡" size={ButtonSize.L} />
        </a>
      </Styled.Wrapper>
    </Styled.Container>
  );
}

export { Page };
