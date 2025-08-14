import { ArcGalleryHero } from "../shared/arc-gallery-hero";

export function HeroWaitlist() {
  const images = [
    "1.png",
    "2.png",
    "3.png",
    "4.jpg",
    "5.jpg",
    "6.png",
    "7.jpg",
    "8.jpg",
    "9.jpg",
    "10.jpg",
    "11.jpg",
    "12.jpg",
    "13.jpg",
  ].sort(() => Math.random() - 0.4);
  return (
    <div className="flex flex-col gap-4 relative w-full h-max">
      <ArcGalleryHero
        images={images.map((image) => `/arc-gallery/${image}`)}
        startAngle={20}
        endAngle={160}
        radiusLg={480}
        radiusMd={360}
        radiusSm={260}
        cardSizeLg={160}
        cardSizeMd={120}
        cardSizeSm={90}
      />

      <h1 className="text-4xl font-bold">soon..</h1>
    </div>
  )
}