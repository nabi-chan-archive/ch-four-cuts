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
import { format } from 'date-fns';
import _ from 'lodash';
import { useSettingsQuery } from '#/features/Settings/queries/useSettingsQuery';
import * as Styled from './index.styled';

function Page() {
  const {
    previewDataUrl,

    sessionId,
    handleSetSessionId,

    cameraConnected,
    cameraConnect,
    cameraDisconnect,
    cameraEnablePreview,
    cameraDisablePreview,

    sessionList,
    sessionDetail,

    printerConnect,
    printerConnected,
    printerCount,

    selectedImages,
    handleClickThumbnail,
    handleForcePrint,
  } = useSettingsQuery();

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
            <Text typo={Typography.Size14} color={cameraConnected.data ? 'bgtxt-green-normal' : 'bgtxt-yellow-normal'}>
              {cameraConnected.data ? '연결되어있음' : '연결되어있지않음'}
            </Text>
          </FormControl>
          <FormControl labelPosition="left">
            <FormLabel>
              <Text typo={Typography.Size14} bold>
                미리보기
              </Text>
            </FormLabel>
            <AlphaStack direction="vertical" spacing={16}>
              {previewDataUrl ? (
                <Styled.Preview src={`${previewDataUrl}`} alt="" />
              ) : (
                '카메라가 연결되지 않았거나, 미리보기가 없습니다.'
              )}
            </AlphaStack>
          </FormControl>
          <Styled.Buttons>
            <Button
              text="연결"
              onClick={() => cameraConnect.mutate()}
              loading={cameraConnect.isLoading}
              disabled={cameraConnected.data}
            />
            <Button
              text="연결 해제"
              onClick={() => cameraDisconnect.mutate()}
              loading={cameraDisconnect.isLoading}
              disabled={!cameraConnected.data}
            />
            <Button
              text="미리보기 시작"
              onClick={() => cameraEnablePreview.mutate()}
              loading={cameraEnablePreview.isLoading}
              disabled={!cameraConnected.data}
            />
            <Button
              text="미리보기 중지"
              onClick={() => cameraDisablePreview.mutate()}
              loading={cameraDisablePreview.isLoading}
              disabled={!cameraConnected.data}
            />
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
            <Text typo={Typography.Size14} color={printerConnected.data ? 'bgtxt-green-normal' : 'bgtxt-yellow-normal'}>
              {printerConnected.data ? '연결되어있음' : '연결되어있지않음'}
            </Text>
          </FormControl>
          <Styled.Buttons>
            <Button
              text="연결"
              onClick={() => printerConnect.mutate()}
              loading={printerConnect.isLoading}
              disabled={printerConnected.data}
            />
          </Styled.Buttons>
        </Styled.Section>
        <Styled.Section>
          <Text typo={Typography.Size24} bold>
            통계
          </Text>
          <FormControl labelPosition="left">
            <FormLabel>
              <Text typo={Typography.Size14} bold>
                세션 수
              </Text>
            </FormLabel>
            <Text typo={Typography.Size14}>{sessionList.data?.length ?? 0}</Text>
          </FormControl>
          <FormControl labelPosition="left">
            <FormLabel>
              <Text typo={Typography.Size14} bold>
                지금까지 인쇄한 종이
              </Text>
            </FormLabel>
            <Text typo={Typography.Size14}>{_.toString(printerCount.data?._sum.printedCount ?? 0)}</Text>
          </FormControl>
          <FormControl labelPosition="left">
            <FormLabel>
              <Text typo={Typography.Size14} bold>
                인쇄할 세션 ID
              </Text>
            </FormLabel>
            <AlphaStack direction="vertical" spacing={8}>
              <Select
                dropdownInterpolation={Styled.DropdownInterpolation}
                text={sessionId}
                placeholder="인쇄할 세션을 선택해주세요"
              >
                {!sessionList.data?.length && <ListItem content="세션이 없습니다." disabled />}
                {sessionList.data?.map((session) => (
                  <ListItem
                    leftIcon={ChannelBtnSmileFilledIcon}
                    content={session.sessionId}
                    rightContent={
                      format(new Date(session.createdAt), 'yyyy-MM-dd HH:mm:ss') + `, ${session.frameType}컷`
                    }
                    key={session.sessionId}
                    onClick={() => handleSetSessionId(session.sessionId)}
                  />
                ))}
              </Select>
              <AlphaStack direction="horizontal" spacing={8} style={{ flexWrap: 'wrap' }}>
                {sessionDetail.data?.filenames.map((filename) => (
                  <img
                    style={{
                      width: 200,
                      borderRadius: 16,
                      border: selectedImages.includes(filename)
                        ? '4px solid var(--bgtxt-purple-normal)'
                        : '4px solid transparent',
                    }}
                    src={`images/input/${sessionId}/${filename}`}
                    key={filename}
                    onClick={() => handleClickThumbnail(filename)}
                  />
                ))}
              </AlphaStack>
            </AlphaStack>
          </FormControl>

          <Styled.Buttons>
            <Button
              disabled={!selectedImages.length || !printerConnected.data}
              text="인쇄하기"
              onClick={handleForcePrint}
            />
          </Styled.Buttons>
        </Styled.Section>
      </AlphaStack>
    </Styled.Container>
  );
}

export { Page };
