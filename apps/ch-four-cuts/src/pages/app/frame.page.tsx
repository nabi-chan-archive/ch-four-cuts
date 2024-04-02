import { Icon, IconSize, Text, Typography } from '@ch-four-cuts/bezier-design-system';
import { ChannelBtnFilledIcon } from '@ch-four-cuts/bezier-design-system/icons';
import { useSetAtom } from 'jotai';
import { navigate } from 'vike/client/router';
import frame1 from '#/assets/frame/IMG_0285.png';
import frame4 from '#/assets/frame/IMG_0286.png';
import { printerFrameAtom, sessionAtom } from '#/features/AppState';
import { trpc } from '#/utils/trpc';
import * as Styled from './frame.styled';
import type { FrameId } from '#/features/Frame';

function Page() {
  const setFrame = useSetAtom(printerFrameAtom);
  const setSessionId = useSetAtom(sessionAtom);
  const { mutateAsync } = trpc.session.createSession.useMutation();

  const handleClickFrame = (frameId: FrameId) => async () => {
    setFrame(frameId);
    const { sessionId } = await mutateAsync({ frameType: frameId });
    setSessionId(sessionId);
    navigate(`/app/camera`);
  };

  return (
    <Styled.Container>
      <Styled.Wrapper>
        <Icon source={ChannelBtnFilledIcon} size={72 as IconSize} color="bgtxt-blue-normal" />
        <Text typo={Typography.Size36} bold marginTop={8}>
          🖼️ 어떤 프레임으로 찍을까요?
        </Text>
        <Text typo={Typography.Size18} marginBottom={24}>
          원하시는 프레임을 선택해주세요!
        </Text>
        <Styled.FrameContainer>
          <Styled.Frame as="button" onClick={handleClickFrame(1)}>
            <img src={frame1} alt="" style={{ height: 400 }} />
            <Styled.FrameContent>
              <Text typo={Typography.Size24} bold>
                한컷 찍기 📸
              </Text>
            </Styled.FrameContent>
          </Styled.Frame>
          <Styled.Frame as="button" onClick={handleClickFrame(4)}>
            <img src={frame4} alt="" style={{ height: 400 }} />
            <Styled.FrameContent>
              <Text typo={Typography.Size24} bold>
                네컷 찍기 📸
              </Text>
            </Styled.FrameContent>
          </Styled.Frame>
        </Styled.FrameContainer>
      </Styled.Wrapper>
    </Styled.Container>
  );
}

export { Page };
