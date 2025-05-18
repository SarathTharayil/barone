import BarMap from "./bar-map"

export default function BarMapPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Bar Map</h1>
      <p className="mb-8 text-muted-foreground">
        Explore our bar layout and find the perfect spot for your visit. Click on a table to check availability.
      </p>
      <BarMap />
    </div>
  )
}
