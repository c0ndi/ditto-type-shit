import { ThreeDGallery } from "../shared/3d-gallery";
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
  ].sort(() => Math.random() - 0.3).slice(0, 10);
  return (
    <div className="gap-4 relative w-full h-full py-12 md:py-32 px-4 md:px-12 flex">
      <div className="text-2xl font-mono">
        join the party
      </div>
      <ThreeDGallery images={images} />
      <div className="text-2xl font-mono mt-auto ml-auto">
        show what matters
      </div>
    </div>
  )
}