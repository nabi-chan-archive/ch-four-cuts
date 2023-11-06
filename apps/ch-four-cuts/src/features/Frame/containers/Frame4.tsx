import * as Frame from '#/features/Frame/components/FrameDesign';

interface Frame4Props {
  hasPadding?: boolean;
  imageSrc: [string, string, string, string];
  qrCodeLink: string;
}

export function Frame4({ imageSrc, qrCodeLink, hasPadding = true }: Frame4Props) {
  return (
    <Frame.Cover hasPadding={hasPadding}>
      {imageSrc.map((src) => (
        <Frame.Image src={src} />
      ))}
      <Frame.Footer qrCodeLink={qrCodeLink} />
    </Frame.Cover>
  );
}
