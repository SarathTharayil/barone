import { Suspense } from "react"
import InformationContent from "./information-content"
import InformationSkeleton from "./information-skeleton"

export default function InformationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Information</h1>
      <Suspense fallback={<InformationSkeleton />}>
        <InformationContent />
      </Suspense>
    </div>
  )
}
