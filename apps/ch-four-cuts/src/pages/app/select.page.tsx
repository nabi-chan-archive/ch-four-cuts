import { Button, ButtonSize, Icon, IconSize, Text, Typography } from '@ch-four-cuts/bezier-design-system';
import { ChannelBtnSmileFilledIcon } from '@ch-four-cuts/bezier-design-system/icons';
import { useAtom, useAtomValue } from 'jotai';
import { navigate } from 'vike/client/router';
import { printerFrameAtom, selectedImageAtom, sessionAtom } from '#/features/AppState';
import { trpc } from '#/utils/trpc';
import * as Styled from './select.styled';

function Page() {
  const sessionId = useAtomValue(sessionAtom);
  const frameId = useAtomValue(printerFrameAtom);
  const [selectedImage, setSelectedImage] = useAtom(selectedImageAtom);
  const { data } = trpc.session.sessionDetail.useQuery({ sessionId });

  return (
    <Styled.Container>
      <Styled.Wrapper>
        <Icon source={ChannelBtnSmileFilledIcon} size={72 as IconSize} color="bgtxt-blue-normal" />
        <Text typo={Typography.Size36} bold marginTop={8} marginBottom={12}>
          🖼️ 사진을 선택해주세요!
        </Text>

        <Styled.PhotoGrid>
          {data?.filenames
            ?.slice(0, 6)
            .map((image) => (
              <Styled.Photo
                src={`/public/images/input/${sessionId}/${image}`}
                key={image}
                selected={selectedImage.includes(image)}
                onClick={() =>
                  setSelectedImage((prev) =>
                    prev.includes(image)
                      ? prev.filter((i) => i !== image)
                      : prev.length >= frameId
                      ? prev
                      : [...prev, image],
                  )
                }
              />
            ))}
        </Styled.PhotoGrid>

        <Button
          disabled={selectedImage.length < frameId}
          text={selectedImage.length < frameId ? `${selectedImage.length} / ${frameId} 장 선택됨` : '인쇄하기 '}
          onClick={() => navigate('/app/printing')}
          size={ButtonSize.XL}
        />
      </Styled.Wrapper>
    </Styled.Container>
  );
}

export { Page };
