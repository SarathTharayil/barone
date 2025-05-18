import { Suspense } from "react"
import RecipeList from "./recipe-list"
import RecipeSkeleton from "./recipe-skeleton"
import RecipeFilters from "./recipe-filters"

export default function RecipesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Recipes</h1>
      <Suspense fallback={<div className="h-10 w-full animate-pulse rounded-md bg-muted" />}>
        <RecipeFilters />
      </Suspense>
      <Suspense fallback={<RecipeSkeleton />}>
        <RecipeList />
      </Suspense>
    </div>
  )
}
