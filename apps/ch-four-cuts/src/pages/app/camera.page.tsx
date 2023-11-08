import { Button, ButtonSize, Icon, IconSize, Text, Typography } from '@ch-four-cuts/bezier-design-system';
import { ChannelBtnSmileFilledIcon } from '@ch-four-cuts/bezier-design-system/icons';
import { useAtomValue } from 'jotai';
import { useCallback, useEffect, useState } from 'react';
import { printerFrameAtom, sessionAtom } from '#/features/AppState';
import { usePageContext } from '#/features/PageContext';
import { trpc } from '#/utils/trpc';
import * as Styled from './camera.styled';

function Page() {
  const {
    urlParsed: { search },
  } = usePageContext();
  const trpcUtils = trpc.useUtils();

  const session = useAtomValue(sessionAtom);
  const frameId = useAtomValue(printerFrameAtom);
  const [counter, setCounter] = useState(10);
  const [previewDataUrl, setPreviewDataUrl] = useState('');
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const { data: connected } = trpc.camera.connected.useQuery();

  const { mutate: connect, isLoading } = trpc.camera.connect.useMutation({
    onSuccess: () => {
      trpcUtils.camera.connected.invalidate();
    },
  });
  const { mutate: enablePreview } = trpc.camera.enablePreview.useMutation();
  const { mutate: disablePreview } = trpc.camera.disablePreview.useMutation();
  const { mutate: capture } = trpc.camera.capture.useMutation({
    onSuccess(data) {
      setCapturedImages((prev) => [...prev, data.filePath]);
    },
  });
  trpc.camera.preview.useSubscription(undefined, {
    enabled: connected,
    onData: setPreviewDataUrl,
  });

  const MAX = frameId === 1 ? 3 : 6;

  useEffect(() => {
    enablePreview();
    return () => disablePreview();
  }, [disablePreview, enablePreview]);

  const spawnInterval = useCallback(() => {
    const interval = setInterval(
      () =>
        setCounter((prev) => {
          if (prev === 1) {
            capture({
              sessionId: session ?? '',
            });
          }
          if (prev === 0) {
            clearInterval(interval);
          }

          return prev === 0 ? 5 : prev - 1;
        }),
      1000,
    );

    return interval;
  }, [capture, session]);

  useEffect(() => {
    if (capturedImages.length >= MAX || !connected) {
      return;
    }
    const interval = spawnInterval();
    return () => {
      clearInterval(interval);
    };
  }, [spawnInterval, capturedImages.length, connected, MAX]);

  if (!connected) {
    return (
      <Styled.Container>
        <Styled.Wrapper>
          <Icon source={ChannelBtnSmileFilledIcon} size={72 as IconSize} color="bgtxt-blue-normal" />
          <Text typo={Typography.Size36} bold marginTop={8}>
            오류가 발생했어요!
          </Text>
          <Text typo={Typography.Size22}>카메라가 연결되어있지 않아요.</Text>
          <Button onClick={() => connect()} text="재연결" loading={isLoading} size={ButtonSize.XL} />
        </Styled.Wrapper>
      </Styled.Container>
    );
  }

  if (capturedImages.length >= MAX) {
    return (
      <Styled.Container>
        <Styled.Wrapper>
          <Icon source={ChannelBtnSmileFilledIcon} size={72 as IconSize} color="bgtxt-blue-normal" />
          <Text typo={Typography.Size36} bold marginTop={8}>
            사진 촬영 완료!
          </Text>
          <Text typo={Typography.Size22} marginBottom={24}>
            다음 버튼을 눌러 인쇄할 이미지를 선택해주세요!
          </Text>

          <a href="/app/select">
            <Button text="다음" size={ButtonSize.XL} />
          </a>
        </Styled.Wrapper>
      </Styled.Container>
    );
  }

  return (
    <Styled.Container>
      <Styled.Wrapper>
        <Icon source={ChannelBtnSmileFilledIcon} size={72 as IconSize} color="bgtxt-blue-normal" />
        <Text typo={Typography.Size36} bold marginTop={8}>
          📸 {capturedImages.length + 1} / {MAX} 번째 사진 찍는 중...
        </Text>
        <Styled.CameraView displayLine={search.displayLine === 'true'}>
          <img src={`data:image/jpg;base64,${previewDataUrl}`} style={{ transform: 'rotateY(180deg)' }} alt="" />
          <Styled.CameraCounter>{counter}</Styled.CameraCounter>
        </Styled.CameraView>
      </Styled.Wrapper>
    </Styled.Container>
  );
}

export { Page };
