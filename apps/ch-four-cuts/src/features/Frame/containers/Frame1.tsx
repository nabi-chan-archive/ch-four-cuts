import * as Frame from '#/features/Frame/components/FrameDesign';

interface Frame1Props {
  imageSrc: string;
  qrCodeLink: string;
  hasPadding?: boolean;
}

export function Frame1({ imageSrc, qrCodeLink, hasPadding = true }: Frame1Props) {
  return (
    <Frame.Cover hasPadding={hasPadding}>
      <Frame.Image src={imageSrc} />
      <Frame.Footer qrCodeLink={qrCodeLink} />
    </Frame.Cover>
  );
}
