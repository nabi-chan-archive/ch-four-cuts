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
  TextField,
  Typography,
} from '@ch-four-cuts/bezier-design-system';
import { ChannelBtnSmileFilledIcon } from '@ch-four-cuts/bezier-design-system/icons';
import _ from 'lodash';
import { useState } from 'react';
import { useAppSettingsQuery } from '#/features/Settings/queries/useAppSettingsQuery';
import * as Styled from './index.styled';
import type { Config } from '@prisma/client';

interface InitialFormState extends Omit<Config, 'configuredAt' | 'printerType'> {
  configuredAt: string;
  printerType: 'USB' | 'NETWORK' | '';
}

interface FormStateFilled extends InitialFormState {
  printerType: Exclude<InitialFormState['printerType'], ''>;
}

export function Page() {
  const { printerList, applyConfig } = useAppSettingsQuery();
  const [formState, setFormState] = useState<InitialFormState>({
    configuredAt: new Date().toISOString(),
    printerType: '',
    printerName: null,
    printerIp: null,
    printerPort: null,
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        applyConfig.mutate(formState as FormStateFilled);
      }}
    >
      <AlphaStack direction="vertical" style={{ padding: 16 }} spacing={16}>
        <Styled.Header>
          <Icon source={ChannelBtnSmileFilledIcon} size={72 as IconSize} color="bgtxt-blue-normal" />
          <AlphaStack direction="vertical">
            <Text typo={Typography.Size36} bold>
              채널 네컷 초기 설정 화면
            </Text>
            <Text typo={Typography.Size18}>당신의 인생샷을 채널 네컷으로!</Text>
          </AlphaStack>
        </Styled.Header>
        <Styled.Section>
          <Text typo={Typography.Size24} bold>
            프린터 설정
          </Text>
          <FormControl labelPosition="left">
            <FormLabel>
              <Text typo={Typography.Size14} bold>
                프린터 연결 방식
              </Text>
            </FormLabel>
            <Select
              required
              placeholder="선택해주세요"
              text={
                formState.printerType === ''
                  ? undefined
                  : formState.printerType === 'USB'
                  ? 'USB로 연결'
                  : '인터넷으로 연결'
              }
              dropdownInterpolation={Styled.DropdownInterpolation}
            >
              <ListItem
                content="인터넷으로 연결"
                onClick={() => setFormState((prev) => ({ ...prev, printerType: 'NETWORK' }))}
              />
              <ListItem
                content="USB로 연결"
                onClick={() => setFormState((prev) => ({ ...prev, printerType: 'USB' }))}
              />
            </Select>
          </FormControl>
          {formState.printerType === 'NETWORK' && (
            <>
              <FormControl labelPosition="left">
                <FormLabel>
                  <Text typo={Typography.Size14} bold>
                    프린터 IP
                  </Text>
                </FormLabel>
                <TextField
                  required
                  placeholder="0.0.0.0"
                  onChange={(e) => setFormState((prev) => ({ ...prev, printerIp: e.target.value }))}
                />
              </FormControl>
              <FormControl labelPosition="left">
                <FormLabel>
                  <Text typo={Typography.Size14} bold>
                    프린터 포트
                  </Text>
                </FormLabel>
                <TextField
                  required
                  placeholder="9100"
                  onChange={(e) => setFormState((prev) => ({ ...prev, printerPort: _.toNumber(e.target.value) }))}
                />
              </FormControl>
            </>
          )}
          {formState.printerType === 'USB' && (
            <>
              <FormControl labelPosition="left">
                <FormLabel>
                  <Text typo={Typography.Size14} bold>
                    연결할 프린터
                  </Text>
                </FormLabel>
                <Select
                  required
                  placeholder="선택해주세요"
                  text={formState.printerName ?? undefined}
                  dropdownInterpolation={Styled.DropdownInterpolation}
                >
                  {!printerList.data?.length && <ListItem disabled content="연결 가능한 프린터가 없습니다." />}
                  {printerList.data?.map((printer) => (
                    <ListItem
                      key={printer.name}
                      content={printer.name}
                      onClick={() => setFormState((prev) => ({ ...prev, printerName: printer.name }))}
                    />
                  ))}
                </Select>
              </FormControl>
            </>
          )}
        </Styled.Section>
        <div>
          <Button type="submit" text="저장하기" />
        </div>
      </AlphaStack>
    </form>
  );
}
