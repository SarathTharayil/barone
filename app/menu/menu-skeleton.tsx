import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function MenuSkeleton() {
  return (
    <div className="space-y-4">
      <div className="mb-6 flex w-full overflow-x-auto">
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="border-barone-darkteal/20">
            <CardHeader className="pb-3">
              <div className="flex justify-between">
                <Skeleton className="h-6 w-[120px]" />
                <Skeleton className="h-6 w-[50px]" />
              </div>
              <Skeleton className="mt-2 h-4 w-full" />
              <Skeleton className="mt-1 h-4 w-3/4" />
            </CardHeader>
            <CardContent className="pb-3">
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
