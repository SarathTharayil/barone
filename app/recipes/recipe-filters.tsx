"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export default function RecipeFilters() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams)

    if (searchQuery) {
      params.set("q", searchQuery)
    } else {
      params.delete("q")
    }

    router.push(`${pathname}?${params.toString()}`)
  }

  const handleReset = () => {
    setSearchQuery("")
    router.push(pathname)
  }

  return (
    <div className="mb-6 flex items-center gap-2">
      <div className="relative flex flex-1 items-center">
        <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search recipes..."
          className="w-full border-barone-teal/20 pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
      </div>

      <Button
        variant="outline"
        onClick={handleSearch}
        size="sm"
        className="border-barone-teal/20 text-barone-teal hover:bg-barone-teal hover:text-white"
      >
        Search
      </Button>

      {searchParams.size > 0 && (
        <Button variant="ghost" onClick={handleReset} size="sm" className="text-barone-teal hover:bg-barone-teal/10">
          <X className="mr-2 h-4 w-4" />
          Clear
        </Button>
      )}
    </div>
  )
}
