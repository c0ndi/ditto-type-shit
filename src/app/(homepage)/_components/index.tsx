import { HeroWaitlist } from "./sections/hero-waitlist";

export function Homepage() {
  return (
    <div className="grid place-items-center h-dvh gap-4 relative">
      <div className="w-full max-w-6xl relative h-full grid place-items-center">
        <HeroWaitlist />
      </div>
    </div>
  )
}

// TODO
// ROZPISAC ARCHI I WYSLAC PETEROWI
// ZMIENIC TEN KOMPONENT NA TEN DRUGI