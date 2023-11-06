import * as Frame from '#/features/Frame/components/FrameDesign';

interface Frame4Props {
  hasPadding?: boolean;
  imageSrc: [string, string, string, string];
  qrCodeLink: string;
}

export function Frame4({ imageSrc, qrCodeLink, hasPadding = true }: Frame4Props) {
  return (
    <Frame.Cover hasPadding={hasPadding}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Frame.Image src={imageSrc[0]} />
        <Frame.Image src={imageSrc[0]} />
        <Frame.Image src={imageSrc[0]} />
        <Frame.Image src={imageSrc[0]} />
        <Frame.Footer qrCodeLink={qrCodeLink} />
      </div>
    </Frame.Cover>
  );
}
