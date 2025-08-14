import { HeroWaitlist } from "./sections/hero-waitlist";

export function Homepage() {
  return (
    <div className="grid place-items-center h-dvh gap-4 relative">
      <div className="w-full max-w-6xl relative">
        <HeroWaitlist />
      </div>
    </div>
  )
}