"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { InfoIcon, Search, SlidersHorizontal, X } from "lucide-react"
import { supabase } from "@/lib/supabase"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
  SheetPortal,
  SheetOverlay,
} from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  student_price: number | null
  category_id: number
  tags: string[]
  is_available: boolean
}

interface Category {
  id: number
  name: string
  display_order: number
}

export default function MenuItems() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState<number[]>([0, 20])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Simple fetch function with no dependencies
  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)

      try {
        console.log("Fetching menu data")

        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from("menu_categories")
          .select("*")
          .order("display_order") as { data: Category[] | null, error: any }

        if (categoriesError) {
          throw new Error(`Error fetching categories: ${categoriesError.message}`)
        }

        // Filter out "Food" and "Special Offers" categories
        const filteredCategories = (categoriesData || []).filter(
          (cat) => cat.name !== "Food" && cat.name !== "Special Offers",
        )
        setCategories(filteredCategories)

        // Fetch menu items
        const { data: menuData, error: menuError } = await supabase
          .from("menu_items")
          .select("*") as { data: MenuItem[] | null, error: any }

        if (menuError) {
          throw new Error(`Error fetching menu items: ${menuError.message}`)
        }

        setMenuItems(menuData || [])

        // Extract all unique tags
        const allTags = menuData?.flatMap((item) => item.tags || []) || []
        const uniqueTags = [...new Set(allTags)].sort()
        setAvailableTags(uniqueTags)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err instanceof Error ? err.message : String(err))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    // Empty dependency array to ensure it only runs once on mount
  }, [])

  // Create tabs from categories
  const categoryTabs = [
    { id: "all", name: "All Items" },
    ...categories.map((cat) => ({ id: cat.id.toString(), name: cat.name })),
  ]

  // Filter items based on active tab, search query, price range, and tags
  const filteredItems = menuItems.filter((item) => {
    // Filter by category
    if (activeTab !== "all" && item.category_id.toString() !== activeTab) {
      return false
    }

    // Filter by search query
    if (
      searchQuery &&
      !item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // Filter by price range
    if (item.price < priceRange[0] || item.price > priceRange[1]) {
      return false
    }

    // Filter by tags
    if (selectedTags.length > 0 && (!item.tags || !selectedTags.some((tag) => item.tags.includes(tag)))) {
      return false
    }

    return true
  })

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const resetFilters = () => {
    setSearchQuery("")
    setPriceRange([0, 20])
    setSelectedTags([])
    setIsFilterOpen(false)
  }

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item)
    setIsDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="mb-6 flex w-full overflow-x-auto">
          <div className="h-10 w-full animate-pulse rounded bg-gray-200"></div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="border-barone-darkteal/20">
              <CardHeader>
                <div className="h-6 w-24 animate-pulse rounded bg-gray-200"></div>
                <div className="mt-2 h-4 w-full animate-pulse rounded bg-gray-200"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (menuItems.length === 0) {
    return (
      <Alert className="mb-6 border-barone-coral/50 bg-barone-coral/10 text-barone-coral">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>No Menu Items Found</AlertTitle>
        <AlertDescription>
          No menu items were found in the database. Please check your Supabase connection and ensure the menu_items
          table has data.
        </AlertDescription>
      </Alert>
    )
  }

  // Determine column count based on number of items
  const getGridClass = (itemCount: number) => {
    if (itemCount === 1) return "grid-cols-1"
    if (itemCount === 2) return "grid-cols-1 sm:grid-cols-2"
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
  }

  return (
    <div className="space-y-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex flex-1 items-center">
          <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search menu..."
            className="w-full border-barone-darkteal/20 pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
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
            <div className="sr-only">Filter Menu</div>
            <SheetHeader>
              <SheetTitle className="text-barone-darkteal">Filter Menu</SheetTitle>
              <SheetDescription>Refine your menu options with these filters.</SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-barone-darkteal">Price Range</h3>
                  <span className="text-xs text-muted-foreground">
                    £{priceRange[0]} - £{priceRange[1]}
                  </span>
                </div>
                <div className="px-2">
                  <Slider
                    defaultValue={[0, 20]}
                    max={20}
                    step={1}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="py-4"
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>£0</span>
                  <span>£5</span>
                  <span>£10</span>
                  <span>£15</span>
                  <span>£20</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-barone-darkteal">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className={`cursor-pointer ${
                        selectedTags.includes(tag)
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
                  onClick={resetFilters}
                  className="border-barone-coral text-barone-coral hover:bg-barone-coral hover:text-white"
                >
                  Reset
                </Button>
              </SheetClose>
              <Button
                onClick={() => setIsFilterOpen(false)}
                className="bg-barone-darkteal text-white hover:bg-barone-darkteal/90"
              >
                Apply Filters
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="relative">
          <div className="overflow-x-auto scrollbar-hide">
            <TabsList className="mb-6 flex w-full min-w-max bg-barone-darkteal/10 p-1">
              {categoryTabs.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex-1 whitespace-nowrap px-4 py-2 text-center data-[state=active]:bg-barone-darkteal data-[state=active]:text-white"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        <TabsContent value={activeTab} className="mt-0">
          {filteredItems.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <p className="text-muted-foreground">No items found matching your criteria.</p>
            </div>
          ) : (
            <div className={`grid gap-6 ${getGridClass(filteredItems.length)}`}>
              {filteredItems.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden border-barone-darkteal/20 cursor-pointer transition-all hover:shadow-md"
                  onClick={() => handleItemClick(item)}
                >
                  <CardHeader className="flex flex-row items-start justify-between gap-4 bg-barone-darkteal/5 p-4">
                    <div className="space-y-1">
                      <CardTitle className="text-lg font-semibold leading-tight text-barone-darkteal">
                        {item.name}
                      </CardTitle>
                      <p className="line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <div className="w-[90px] rounded-md bg-barone-coral/10 px-2 py-1 text-center text-sm font-bold text-barone-coral">
                        £{item.price.toFixed(2)}
                      </div>
                      {item.student_price && (
                        <div className="w-[90px] rounded-md bg-barone-teal/10 px-2 py-1 text-center text-xs font-medium text-barone-teal">
                          Student: £{item.student_price.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-3">
                    <div className="flex flex-wrap gap-2">
                      {item.tags &&
                        item.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="bg-barone-teal/5 text-xs text-barone-teal">
                            {tag}
                          </Badge>
                        ))}
                      {!item.is_available && (
                        <Badge variant="destructive" className="text-xs">
                          Out of Stock
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Item Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[90%] rounded-xl p-0 sm:max-w-md">
          <div className="rounded-t-xl bg-barone-darkteal/5 p-4">
            <DialogHeader className="mt-12 space-y-4 text-center">
              <div className="flex flex-col items-center gap-1.5">
                <DialogTitle className="text-2xl font-bold text-barone-darkteal">{selectedItem?.name}</DialogTitle>
                {!selectedItem?.is_available && (
                  <Badge variant="destructive" className="shrink-0">Out of Stock</Badge>
                )}
              </div>
              <div className="grid w-full grid-cols-2 gap-2">
                <div className="flex h-10 items-center justify-center rounded-lg border border-barone-coral/20 bg-barone-coral/5 text-center">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground">Regular</span>
                    <span className="font-bold text-barone-coral">£{selectedItem?.price.toFixed(2)}</span>
                  </div>
                </div>
                {selectedItem?.student_price && (
                  <div className="flex h-10 items-center justify-center rounded-lg border border-barone-teal/20 bg-barone-teal/5 text-center">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-muted-foreground">Student</span>
                      <span className="font-bold text-barone-teal">£{selectedItem?.student_price.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
            </DialogHeader>
          </div>

          <div className="space-y-4 p-4">
            <div className="rounded-lg bg-muted/50 p-3">
              <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
                {selectedItem?.description}
              </DialogDescription>
            </div>

            {selectedItem?.tags && selectedItem.tags.length > 0 && (
              <div className="space-y-2">
                <div className="flex flex-nowrap gap-2 overflow-x-auto pb-1">
                  {selectedItem.tags.map((tag) => (
                    <div 
                      key={tag}
                      className="flex h-10 w-[calc(33.333%-0.5rem)] shrink-0 items-center justify-center rounded-lg border border-barone-darkteal/20 bg-barone-darkteal/5 text-center text-sm text-barone-darkteal"
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
