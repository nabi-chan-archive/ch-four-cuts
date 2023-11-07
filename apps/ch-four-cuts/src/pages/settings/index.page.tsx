import {
  AlphaStack,
  Button,
  FormControl,
  FormLabel,
  Icon,
  IconSize,
  ListItem,
  Select,
  Text,
  Typography,
} from '@ch-four-cuts/bezier-design-system';
import { ChannelBtnSmileFilledIcon } from '@ch-four-cuts/bezier-design-system/icons';
import _ from 'lodash';
import { useState } from 'react';
import { trpc } from '#/utils/trpc';
import * as Styled from './index.styled';

function Page() {
  const utils = trpc.useUtils();
  const [previewDataUrl, setPreviewDataUrl] = useState('');
  const [capturedImages, setCapturedImages] = useState<string[]>([]);

  const { data: connected } = trpc.camera.connected.useQuery();
  const { data: params } = trpc.camera.params.useQuery();
  const { mutate: connect, isLoading: isConnecting } = trpc.camera.connect.useMutation({
    onSuccess: () => {
      utils.camera.connected.invalidate();
      utils.camera.params.invalidate();
    },
  });
  const { mutate: disconnect, isLoading: isDisconnecting } = trpc.camera.disconnect.useMutation();
  const { mutate: enablePreview } = trpc.camera.enablePreview.useMutation();
  const { mutate: disablePreview } = trpc.camera.disablePreview.useMutation();
  const { mutate: capture } = trpc.camera.capture.useMutation({
    onSuccess(data) {
      setCapturedImages((prev) => [...prev, data]);
    },
  });
  trpc.camera.info.useSubscription(undefined, {
    enabled: connected,
    onData: (data) => {
      if (_.get(data as { connected: boolean }, 'connected') === true) {
        utils.camera.connected.invalidate();
        utils.camera.params.invalidate();
      }
      utils.camera.params.invalidate();
    },
  });
  trpc.camera.preview.useSubscription(undefined, {
    enabled: connected,
    onData: setPreviewDataUrl,
  });

  return (
    <Styled.Container>
      <Styled.Header>
        <Icon source={ChannelBtnSmileFilledIcon} size={72 as IconSize} color="bgtxt-blue-normal" />
        <AlphaStack direction="vertical">
          <Text typo={Typography.Size36} bold>
            채널 네컷 관리자 화면
          </Text>
          <Text typo={Typography.Size18}>당신의 인생샷을 채널 네컷으로!</Text>
        </AlphaStack>
      </Styled.Header>
      <AlphaStack direction="vertical" spacing={16}>
        <Styled.Section>
          <Text typo={Typography.Size24} bold>
            카메라
          </Text>
          <FormControl labelPosition="left">
            <FormLabel>
              <Text typo={Typography.Size14} bold>
                연결 상태
              </Text>
            </FormLabel>
            <Text typo={Typography.Size14} color={connected ? 'bgtxt-green-normal' : 'bgtxt-yellow-normal'}>
              {connected ? '연결되어있음' : '연결되어있지않음'}
            </Text>
          </FormControl>
          <FormControl labelPosition="left">
            <FormLabel>
              <Text typo={Typography.Size14} bold>
                남은 카메라 장수
              </Text>
            </FormLabel>
            <Text typo={Typography.Size14}>{params?.photosRemaining ?? 0}</Text>
          </FormControl>
          <FormControl labelPosition="left">
            <FormLabel>
              <Text typo={Typography.Size14} bold>
                미리보기
              </Text>
            </FormLabel>
            <AlphaStack direction="vertical" spacing={16}>
              <Styled.Preview src={`data:image/png;base64,${previewDataUrl}`} alt="연결이 되어있지 않습니다." />
              <AlphaStack direction="horizontal" spacing={16} style={{ overflowX: 'auto' }}>
                {capturedImages.map((image) => (
                  <img style={{ width: 200, borderRadius: 16 }} src={`data:image/png;base64,${image}`} key={image} />
                ))}
              </AlphaStack>
            </AlphaStack>
          </FormControl>
          <Styled.Buttons>
            <Button text="연결" onClick={() => connect()} loading={isConnecting} disabled={connected} />
            <Button text="연결 해제" onClick={() => disconnect()} loading={isDisconnecting} disabled={!connected} />
            <Button text="미리보기 시작" onClick={() => enablePreview()} disabled={!connected} />
            <Button text="미리보기 중지" onClick={() => disablePreview()} disabled={!connected} />
            <Button text="사진 찍기" onClick={() => capture()} disabled={!connected} />
          </Styled.Buttons>
        </Styled.Section>
        <Styled.Section>
          <Text typo={Typography.Size24} bold>
            프린터
          </Text>
          <FormControl labelPosition="left">
            <FormLabel>
              <Text typo={Typography.Size14} bold>
                연결 상태
              </Text>
            </FormLabel>
            <Text typo={Typography.Size14}>연결 되어있음</Text>
          </FormControl>

          <Styled.Buttons>
            <Button text="용지 자르기" />
          </Styled.Buttons>
        </Styled.Section>
        <Styled.Section>
          <Text typo={Typography.Size24} bold>
            결과물
          </Text>
          <FormControl labelPosition="left">
            <FormLabel>
              <Text typo={Typography.Size14} bold>
                지금까지 찍은 사진
              </Text>
            </FormLabel>
            <Text typo={Typography.Size14}>300건</Text>
          </FormControl>
          <FormControl labelPosition="left">
            <FormLabel>
              <Text typo={Typography.Size14} bold>
                지금까지 인쇄한 종이
              </Text>
            </FormLabel>
            <Text typo={Typography.Size14}>1200장</Text>
          </FormControl>
          <FormControl labelPosition="left">
            <FormLabel>
              <Text typo={Typography.Size14} bold>
                마지막으로 인쇄된 시간
              </Text>
            </FormLabel>
            <Text typo={Typography.Size14}>2023-11-11 23:12:30</Text>
          </FormControl>
          <FormControl labelPosition="left">
            <FormLabel>
              <Text typo={Typography.Size14} bold>
                인쇄할 사진 ID
              </Text>
            </FormLabel>
            <Text typo={Typography.Size14}>
              <Select
                dropdownInterpolation={Styled.DropdownInterpolation}
                placeholder="강제 인쇄할 사진의 ID를 선택해주세요"
              >
                <ListItem content="11-10 22:32 / 4컷" />
                <ListItem content="11-10 22:31 / 4컷" />
              </Select>
            </Text>
          </FormControl>

          <Styled.Buttons>
            <Button text="선택한 사진 1장 인쇄하기" />
          </Styled.Buttons>
        </Styled.Section>
      </AlphaStack>
    </Styled.Container>
  );
}

export { Page };
