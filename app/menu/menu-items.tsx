"use client"

import { useEffect, useState, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase"
import MenuSkeleton from "./menu-skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  student_price: number | null
  category_id: number
  tags: string[]
  is_available: boolean
  image_url?: string
}

interface Category {
  id: number
  name: string
  display_order: number
}

export default function MenuItems() {
  const searchParams = useSearchParams()
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [error, setError] = useState<string | null>(null)

  // Extract search parameters once to avoid re-renders
  const searchQuery = searchParams.get("q") || ""
  const categoryFilter = searchParams.get("category") || ""
  const tagFilters = searchParams.get("tags")?.split(",").filter(Boolean) || []
  const minPrice = Number(searchParams.get("minPrice") || 0)
  const maxPrice = Number(searchParams.get("maxPrice") || 100)

  // Use a stable reference for the search parameters
  const searchParamsString = `${searchQuery}-${categoryFilter}-${tagFilters.join(",")}-${minPrice}-${maxPrice}`

  // Function to fetch menu data with useCallback to maintain reference stability
  const fetchMenuData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      console.log("Fetching menu data...")

      // Step 1: Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("menu_categories")
        .select("*")
        .order("display_order") as { data: Category[] | null, error: any }

      if (categoriesError) {
        throw new Error(`Error fetching categories: ${categoriesError.message}`)
      }

      setCategories(categoriesData || [])

      // Step 2: Fetch menu items
      const { data: menuData, error: menuError } = await supabase
        .from("menu_items")
        .select("*") as { data: MenuItem[] | null, error: any }

      if (menuError) {
        throw new Error(`Error fetching menu items: ${menuError.message}`)
      }

      // Apply filters client-side
      let filteredItems = (menuData || []) as MenuItem[]

      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        filteredItems = filteredItems.filter(
          (item) =>
            item.name.toLowerCase().includes(query) ||
            (item.description && item.description.toLowerCase().includes(query)),
        )
      }

      // Apply category filter
      if (categoryFilter && categoryFilter !== "all") {
        filteredItems = filteredItems.filter((item) => item.category_id.toString() === categoryFilter)
      }

      // Apply price filters
      if (minPrice > 0) {
        filteredItems = filteredItems.filter((item) => item.price >= minPrice)
      }

      if (maxPrice < 100) {
        filteredItems = filteredItems.filter((item) => item.price <= maxPrice)
      }

      // Apply tag filtering
      if (tagFilters.length > 0) {
        filteredItems = filteredItems.filter((item) => {
          if (!item.tags) return false
          return tagFilters.some((tag) => item.tags.includes(tag))
        })
      }

      setMenuItems(filteredItems)
    } catch (err) {
      console.error("Error in fetchMenuData:", err)
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }, [searchQuery, categoryFilter, tagFilters, minPrice, maxPrice])

  // Fetch data on component mount and when search parameters change
  useEffect(() => {
    fetchMenuData()
    // Use the string representation of search parameters to avoid reference issues
  }, [searchParamsString, fetchMenuData])

  // Create tabs from categories
  const categoryTabs = [
    { id: "all", name: "All" },
    ...categories.map((cat) => ({ id: cat.id.toString(), name: cat.name })),
  ]

  // Filter items based on active tab
  const filteredItems =
    activeTab === "all" ? menuItems : menuItems.filter((item) => item.category_id.toString() === activeTab)

  if (loading) {
    return <MenuSkeleton />
  }

  return (
    <div>
      {error && (
        <Alert variant="destructive" className="mb-6">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {menuItems.length === 0 && !error && (
        <Alert className="mb-6 border-barone-coral/50 bg-barone-coral/10 text-barone-coral">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>No Menu Items Found</AlertTitle>
          <AlertDescription>
            No menu items were found in the database. Please check your Supabase connection and ensure the menu_items
            table has data.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 flex w-full flex-wrap justify-start bg-barone-darkteal/10">
          {categoryTabs.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="flex-grow data-[state=active]:bg-barone-darkteal data-[state=active]:text-white sm:flex-grow-0"
            >
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="mt-0">
          {filteredItems.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <p className="text-muted-foreground">No items found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => (
                <Card key={item.id} className="overflow-hidden border-barone-darkteal/20">
                  <CardHeader className="bg-barone-darkteal/5 pb-3">
                    <div className="flex justify-between">
                      <CardTitle className="text-barone-darkteal">{item.name}</CardTitle>
                      <div className="text-right">
                        <div className="font-bold text-barone-coral">£{item.price.toFixed(2)}</div>
                        {item.student_price && (
                          <div className="text-sm text-muted-foreground">Student: £{item.student_price.toFixed(2)}</div>
                        )}
                      </div>
                    </div>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3 pt-3">
                    <div className="flex flex-wrap gap-2">
                      {item.tags &&
                        item.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="bg-barone-teal/10 text-barone-teal">
                            {tag}
                          </Badge>
                        ))}
                      {!item.is_available && <Badge variant="destructive">Out of Stock</Badge>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id.toString()} className="mt-0">
            {filteredItems.length === 0 ? (
              <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <p className="text-muted-foreground">No items found in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden border-barone-darkteal/20">
                    <CardHeader className="bg-barone-darkteal/5 pb-3">
                      <div className="flex justify-between">
                        <CardTitle className="text-barone-darkteal">{item.name}</CardTitle>
                        <div className="text-right">
                          <div className="font-bold text-barone-coral">£{item.price.toFixed(2)}</div>
                          {item.student_price && (
                            <div className="text-sm text-muted-foreground">
                              Student: £{item.student_price.toFixed(2)}
                            </div>
                          )}
                        </div>
                      </div>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3 pt-3">
                      <div className="flex flex-wrap gap-2">
                        {item.tags &&
                          item.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="bg-barone-teal/10 text-barone-teal">
                              {tag}
                            </Badge>
                          ))}
                        {!item.is_available && <Badge variant="destructive">Out of Stock</Badge>}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
