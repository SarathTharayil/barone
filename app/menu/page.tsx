import MenuItems from "./menu-items-simple"

export default function MenuPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-barone-darkteal">Menu</h1>
      <p className="mb-6 text-muted-foreground">
        Browse our selection of drinks and food. Use the search bar to find specific items or filter by category.
      </p>
      <MenuItems />
    </div>
  )
}
