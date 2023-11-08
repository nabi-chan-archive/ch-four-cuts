import { Button, ButtonSize, Icon, IconSize, Text, Typography } from '@ch-four-cuts/bezier-design-system';
import { ChannelBtnSmileFilledIcon } from '@ch-four-cuts/bezier-design-system/icons';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { navigate } from 'vike/client/router';
import { printerCountAtom, selectedImageAtom, sessionAtom } from '#/features/AppState';
import { trpc } from '#/utils/trpc';
import * as Styled from './select.styled';

function Page() {
  const [printedCount, setPrintedCount] = useState(0);

  const sessionId = useAtomValue(sessionAtom);
  const selectedImages = useAtomValue(selectedImageAtom);
  const printCount = useAtomValue(printerCountAtom);

  const { mutate: print } = trpc.printer.frame.useMutation({
    onSuccess: () => setPrintedCount((prev) => prev + 1),
    retry: false,
  });

  useEffect(
    function printSelectedImages() {
      if (printedCount >= printCount) {
        return;
      }
      print({
        sessionId,
        selectedImages,
      });
    },
    [print, printCount, printedCount, selectedImages, sessionId],
  );

  useEffect(function gotoMainAfter15Seconds() {
    const timeout = setTimeout(() => {
      navigate('/');
    }, 15 * 1000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Styled.Container>
      <Styled.Wrapper>
        <Icon source={ChannelBtnSmileFilledIcon} size={72 as IconSize} color="bgtxt-blue-normal" />
        <Text typo={Typography.Size36} bold marginTop={8}>
          사진을 인쇄하고 있어요!
        </Text>
        <Text typo={Typography.Size24} marginBottom={24}>
          {printedCount} / {printCount} 장 프린트 하는 중...
        </Text>

        <Button
          disabled={printedCount < printCount}
          onClick={() => navigate('/app/complete')}
          text="인쇄 완료!"
          size={ButtonSize.XL}
        />
      </Styled.Wrapper>
    </Styled.Container>
  );
}

export { Page };
