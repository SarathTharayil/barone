"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Search, SlidersHorizontal, X } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"

interface Category {
  id: number
  name: string
  display_order: number
}

export default function MenuFilters() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [category, setCategory] = useState(searchParams.get("category") || "all")
  const [priceRange, setPriceRange] = useState<number[]>([
    Number(searchParams.get("minPrice") || 0),
    Number(searchParams.get("maxPrice") || 20),
  ])
  const [tags, setTags] = useState<string[]>(searchParams.get("tags")?.split(",").filter(Boolean) || [])
  const [categories, setCategories] = useState<Category[]>([])
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  // Function to fetch filter data with useCallback to maintain reference stability
  const fetchFilterData = useCallback(async () => {
    setLoading(true)
    try {
      console.log("Fetching filter data...")

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("menu_categories")
        .select("*")
        .order("display_order")

      if (!categoriesError) {
        setCategories(categoriesData || [])
      }

      // Fetch all menu items to extract tags
      const { data: menuData, error: menuError } = await supabase.from("menu_items").select("tags")

      if (!menuError && menuData) {
        // Extract all tags and remove duplicates
        const allTags = menuData.flatMap((item) => item.tags || [])
        const uniqueTags = [...new Set(allTags)].sort()
        setAvailableTags(uniqueTags)
      }
    } catch (err) {
      console.error("Error fetching filter data:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch filter data on component mount only
  useEffect(() => {
    fetchFilterData()
  }, [fetchFilterData])

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())

    if (searchQuery) {
      params.set("q", searchQuery)
    } else {
      params.delete("q")
    }

    if (category && category !== "all") {
      params.set("category", category)
    } else {
      params.delete("category")
    }

    if (tags.length > 0) {
      params.set("tags", tags.join(","))
    } else {
      params.delete("tags")
    }

    if (priceRange[0] > 0 || priceRange[1] < 20) {
      params.set("minPrice", priceRange[0].toString())
      params.set("maxPrice", priceRange[1].toString())
    } else {
      params.delete("minPrice")
      params.delete("maxPrice")
    }

    router.push(`${pathname}?${params.toString()}`)
    setIsOpen(false)
  }, [searchQuery, category, tags, priceRange, searchParams, router, pathname])

  const handleReset = useCallback(() => {
    setSearchQuery("")
    setCategory("all")
    setPriceRange([0, 20])
    setTags([])
    router.push(pathname)
    setIsOpen(false)
  }, [router, pathname])

  const toggleTag = useCallback((tag: string) => {
    setTags((prevTags) => (prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]))
  }, [])

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex w-full max-w-sm items-center">
        <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search menu..."
          className="w-full border-barone-darkteal/20 pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
      </div>

      <div className="flex items-center gap-2">
        {searchParams.size > 0 && (
          <Button
            variant="outline"
            onClick={handleReset}
            size="sm"
            className="border-barone-coral text-barone-coral hover:bg-barone-coral hover:text-white"
          >
            <X className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        )}

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="border-barone-darkteal text-barone-darkteal hover:bg-barone-darkteal hover:text-white"
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[300px] border-barone-darkteal/20 sm:w-[400px]">
            <SheetHeader>
              <SheetTitle className="text-barone-darkteal">Filter Menu</SheetTitle>
              <SheetDescription>Refine your menu options with these filters.</SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-barone-darkteal">Category</h3>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="border-barone-darkteal/20">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-barone-darkteal">Price Range</h3>
                  <span className="text-xs text-muted-foreground">
                    £{priceRange[0]} - £{priceRange[1]}
                  </span>
                </div>
                <Slider
                  defaultValue={[0, 20]}
                  max={20}
                  step={1}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="[&>span:first-child]:bg-barone-darkteal [&>span:last-child]:bg-barone-darkteal"
                />
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-barone-darkteal">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={tags.includes(tag) ? "default" : "outline"}
                      className={`cursor-pointer ${
                        tags.includes(tag)
                          ? "bg-barone-teal text-white hover:bg-barone-teal/80"
                          : "border-barone-teal/20 text-barone-teal hover:bg-barone-teal/10"
                      }`}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <SheetFooter className="mt-6 flex-row gap-2">
              <SheetClose asChild>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="border-barone-coral text-barone-coral hover:bg-barone-coral hover:text-white"
                >
                  Reset
                </Button>
              </SheetClose>
              <Button onClick={handleSearch} className="bg-barone-darkteal text-white hover:bg-barone-darkteal/90">
                Apply Filters
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
