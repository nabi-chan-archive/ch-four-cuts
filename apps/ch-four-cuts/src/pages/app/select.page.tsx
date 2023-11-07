import { Button, ButtonSize, Icon, IconSize, Text, Typography } from '@ch-four-cuts/bezier-design-system';
import { ChannelBtnSmileFilledIcon } from '@ch-four-cuts/bezier-design-system/icons';
import { useAtom, useAtomValue } from 'jotai';
import { navigate } from 'vike/client/router';
import { selectedImageAtom, sessionAtom } from '#/features/AppState';
import { trpc } from '#/utils/trpc';
import * as Styled from './select.styled';

function Page() {
  const sessionId = useAtomValue(sessionAtom);
  const [selectedImage, setSelectedImage] = useAtom(selectedImageAtom);
  const { data: imageList } = trpc.session.images.useQuery({ sessionId });

  return (
    <Styled.Container>
      <Styled.Wrapper>
        <Icon source={ChannelBtnSmileFilledIcon} size={72 as IconSize} color="bgtxt-blue-normal" />
        <Text typo={Typography.Size36} bold marginTop={8} marginBottom={12}>
          🖼️ 사진을 선택해주세요!
        </Text>

        <Styled.PhotoGrid>
          {imageList?.map((image) => (
            <Styled.Photo
              src={`/public/images/input/${sessionId}/${image}`}
              key={image}
              selected={selectedImage.includes(image)}
              onClick={() =>
                setSelectedImage((prev) =>
                  prev.includes(image) ? prev.filter((i) => i !== image) : prev.length >= 4 ? prev : [...prev, image],
                )
              }
            />
          ))}
        </Styled.PhotoGrid>

        <Button
          disabled={selectedImage.length < 4}
          text={selectedImage.length < 4 ? `${selectedImage.length} / 4 장 선택됨` : '인쇄하기 '}
          onClick={() => navigate('/app/printing')}
          size={ButtonSize.XL}
        />
      </Styled.Wrapper>
    </Styled.Container>
  );
}

export { Page };
