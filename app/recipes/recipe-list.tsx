"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase"
import RecipeSkeleton from "./recipe-skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface Recipe {
  id: string
  menu_item_id: string
  ingredients: string[]
  instructions: string[]
  glass_type: string | null
  garnish: string | null
  menu_item: {
    id: string
    name: string
    description: string
    category_id: number
    tags: string[]
    menu_categories: {
      name: string
    }
  }
}

// Define fixed categories for recipes
const recipeCategories = [
  { id: "all", name: "All" },
  { id: "cocktails", name: "Cocktails" },
  { id: "mocktails", name: "Mocktails" },
  { id: "hot_drinks", name: "Hot Drinks" },
]

export default function RecipeList() {
  const searchParams = useSearchParams()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [error, setError] = useState<string | null>(null)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const searchQuery = searchParams.get("q") || ""

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true)
      setError(null)

      try {
        // Fetch recipes with their menu item details
        const { data, error } = await supabase.from("recipesbo").select(`
          *,
          menu_item:menu_item_id (
            id, name, description, category_id, tags,
            menu_categories:category_id (name)
          )
        `)

        if (error) {
          console.error("Error fetching recipes:", error)
          setError(`Error fetching recipes: ${error.message}`)
          return
        }

        if (!data) {
          setRecipes([])
          return
        }

        // Filter by search query if provided
        let filteredRecipes = data

        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          filteredRecipes = filteredRecipes.filter(
            (recipe) =>
              recipe.menu_item.name.toLowerCase().includes(query) ||
              recipe.menu_item.description.toLowerCase().includes(query) ||
              recipe.ingredients.some((ing) => ing.toLowerCase().includes(query)),
          )
        }

        setRecipes(filteredRecipes)
      } catch (err) {
        console.error("Exception in recipe fetching:", err)
        setError(`An unexpected error occurred: ${err}`)
      } finally {
        setLoading(false)
      }
    }

    fetchRecipes()
  }, [searchQuery])

  const filteredRecipes =
    activeTab === "all"
      ? recipes
      : recipes.filter((recipe) => {
          // Map activeTab to appropriate menu_categories.name values
          let categoryName = ""
          switch (activeTab) {
            case "cocktails":
              categoryName = "Cocktails"
              break
            case "mocktails":
              categoryName = "Mocktails"
              break
            case "hot_drinks":
              categoryName = "Coffee" // Assuming "Coffee" is the category name for hot drinks
              break
          }

          return recipe.menu_item.menu_categories?.name === categoryName
        })

  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe)
    setIsDialogOpen(true)
  }

  if (loading) {
    return <RecipeSkeleton />
  }

  // Determine column count based on number of items
  const getGridClass = (itemCount: number) => {
    if (itemCount === 1) return "grid-cols-1"
    if (itemCount === 2) return "grid-cols-1 sm:grid-cols-2"
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
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

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="relative overflow-hidden">
          <div className="overflow-x-auto scrollbar-hide">
            <TabsList className="mb-6 flex w-full bg-barone-darkteal/10 p-1">
              {recipeCategories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex-1 whitespace-nowrap px-4 py-2 data-[state=active]:bg-barone-darkteal data-[state=active]:text-white"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        <TabsContent value={activeTab} className="mt-0">
          {filteredRecipes.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <p className="text-muted-foreground">No recipes found matching your criteria.</p>
            </div>
          ) : (
            <div className={`grid gap-6 ${getGridClass(filteredRecipes.length)}`}>
              {filteredRecipes.map((recipe) => (
                <Card
                  key={recipe.id}
                  className="overflow-hidden border-barone-darkteal/20 cursor-pointer transition-all hover:shadow-md"
                  onClick={() => handleRecipeClick(recipe)}
                >
                  <CardHeader className="flex flex-row items-start justify-between gap-4 bg-barone-darkteal/5 p-4">
                    <div className="space-y-1">
                      <CardTitle className="text-lg font-semibold leading-tight text-barone-darkteal">
                        {recipe.menu_item.name}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">{recipe.menu_item.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-3">
                    <div className="flex flex-wrap gap-2">
                      {recipe.menu_item.tags &&
                        recipe.menu_item.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="bg-barone-teal/5 text-xs text-barone-teal">
                            {tag}
                          </Badge>
                        ))}
                      <Badge variant="outline" className="bg-barone-coral/5 text-xs text-barone-coral">
                        {recipe.ingredients.length} ingredients
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Recipe Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[90%] rounded-xl p-0 sm:max-w-md">
          <div className="rounded-t-xl bg-barone-darkteal/5 p-4">
            <DialogHeader className="mt-12 space-y-4 text-center">
              <div className="flex flex-col items-center gap-1.5">
                <DialogTitle className="text-2xl font-bold text-barone-darkteal">{selectedRecipe?.menu_item.name}</DialogTitle>
              </div>
            </DialogHeader>
          </div>

          <div className="space-y-4 p-4">
            <div className="rounded-lg bg-muted/50 p-3">
              <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
                {selectedRecipe?.menu_item.description}
              </DialogDescription>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border border-barone-darkteal/20">
                <div className="flex items-center justify-between p-3">
                  <h3 className="font-medium text-barone-darkteal">Ingredients</h3>
                  <span className="text-sm text-muted-foreground">{selectedRecipe?.ingredients.length} items</span>
                </div>
                <div className="border-t border-barone-darkteal/20 p-3">
                  <ul className="space-y-1 list-disc pl-5">
                    {selectedRecipe?.ingredients.map((ingredient, index) => (
                      <li key={index} className="text-sm">
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="rounded-lg border border-barone-darkteal/20">
                <div className="flex items-center justify-between p-3">
                  <h3 className="font-medium text-barone-darkteal">Preparation</h3>
                  <span className="text-sm text-muted-foreground">{selectedRecipe?.instructions.length} steps</span>
                </div>
                <div className="border-t border-barone-darkteal/20 p-3">
                  <ol className="space-y-2 list-decimal pl-5">
                    {selectedRecipe?.instructions.map((step, index) => (
                      <li key={index} className="text-sm">
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {(selectedRecipe?.glass_type || selectedRecipe?.garnish) && (
                <div className="rounded-lg border border-barone-darkteal/20">
                  <div className="flex items-center justify-between p-3">
                    <h3 className="font-medium text-barone-darkteal">Details</h3>
                  </div>
                  <div className="border-t border-barone-darkteal/20 p-3">
                    {selectedRecipe.glass_type && (
                      <p className="text-sm">
                        <span className="font-medium">Glass:</span> {selectedRecipe.glass_type}
                      </p>
                    )}
                    {selectedRecipe.garnish && (
                      <p className="text-sm">
                        <span className="font-medium">Garnish:</span> {selectedRecipe.garnish}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {selectedRecipe?.menu_item.tags && selectedRecipe.menu_item.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {selectedRecipe.menu_item.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="bg-barone-teal/5 text-xs text-barone-teal">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
