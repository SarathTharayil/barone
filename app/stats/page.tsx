import { Suspense } from "react"
import BarStats from "./bar-stats"
import StatsSkeleton from "./stats-skeleton"

export default function StatsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Bar Stats</h1>
      <p className="mb-8 text-muted-foreground">
        Check out our performance metrics and see what's trending at Bar One.
      </p>
      <Suspense fallback={<StatsSkeleton />}>
        <BarStats />
      </Suspense>
    </div>
  )
}
