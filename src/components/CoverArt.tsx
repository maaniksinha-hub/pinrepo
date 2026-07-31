type CoverArtProps = {
  src: string;
  alt: string;
};

export function CoverArt({ src, alt }: CoverArtProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="cover-art" src={src} alt={alt} loading="lazy" decoding="async" />
  );
}
