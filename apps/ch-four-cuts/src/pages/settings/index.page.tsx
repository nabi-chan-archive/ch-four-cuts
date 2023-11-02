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
import * as Styled from './index.styled';

function Page() {
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
            <Text typo={Typography.Size14}>연결 되어있음</Text>
          </FormControl>
          <FormControl labelPosition="left">
            <FormLabel>
              <Text typo={Typography.Size14} bold>
                남은 카메라 장수
              </Text>
            </FormLabel>
            <Text typo={Typography.Size14}>4096장</Text>
          </FormControl>
          <FormControl labelPosition="left">
            <FormLabel>
              <Text typo={Typography.Size14} bold>
                미리보기
              </Text>
            </FormLabel>
            <Styled.Preview src="https://placekitten.com/1920/1080" alt="" />
          </FormControl>
          <FormControl labelPosition="left">
            <FormLabel>
              <Text typo={Typography.Size14} bold>
                useFlash
              </Text>
            </FormLabel>
            <Select dropdownInterpolation={Styled.DropdownInterpolation} text="on">
              <ListItem content="어쩌구 저쩌구" />
            </Select>
          </FormControl>
          <Styled.Buttons>
            <Button text="연결" />
            <Button text="연결 해제" />
            <Button text="사진 찍기" />
            <Button text="설정 적용" />
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
