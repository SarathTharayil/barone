"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState, useEffect } from "react"

const leftRoutes = [
  { name: "Home", path: "/" },
  { name: "Menu", path: "/menu" },
  { name: "Recipes", path: "/recipes" },
]

const rightRoutes = [
  { name: "Bar Map", path: "/bar-map" },
  { name: "Information", path: "/information" },
  { name: "About", path: "/about" },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "bg-barone-darkteal/95 shadow-md backdrop-blur-sm" : "bg-barone-darkteal"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left side navigation - desktop */}
          <nav className="hidden md:block">
            <ul className="flex gap-6">
              {leftRoutes.map((route) => (
                <li key={route.path}>
                  <Link
                    href={route.path}
                    className={`text-sm font-medium transition-colors hover:text-white/80 ${
                      pathname === route.path ? "text-white" : "text-white/70"
                    }`}
                  >
                    {route.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logo - centered */}
          <Link href="/" className="flex items-center justify-center space-x-2">
            <span className="text-xl font-bold text-white">Bar One</span>
          </Link>

          {/* Right side navigation - desktop */}
          <nav className="hidden md:block">
            <ul className="flex gap-6">
              {rightRoutes.map((route) => (
                <li key={route.path}>
                  <Link
                    href={route.path}
                    className={`text-sm font-medium transition-colors hover:text-white/80 ${
                      pathname === route.path ? "text-white" : "text-white/70"
                    }`}
                  >
                    {route.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button
                  variant="outline"
                  size="icon"
                  className="border-white/20 bg-transparent text-white hover:bg-white/10"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="bg-barone-darkteal text-white border-none">
                <div className="container mx-auto px-4 py-6">
                  <div className="flex items-center justify-between mb-8">
                    <Link href="/" className="flex items-center space-x-2" onClick={() => setOpen(false)}>
                      <span className="text-xl font-bold">Bar One</span>
                    </Link>
                  </div>
                  <nav className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider">Main</h3>
                      {leftRoutes.map((route) => (
                        <Link
                          key={route.path}
                          href={route.path}
                          className={`block text-base font-medium transition-colors hover:text-white/80 ${
                            pathname === route.path ? "text-white" : "text-white/70"
                          }`}
                          onClick={() => setOpen(false)}
                        >
                          {route.name}
                        </Link>
                      ))}
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider">More</h3>
                      {rightRoutes.map((route) => (
                        <Link
                          key={route.path}
                          href={route.path}
                          className={`block text-base font-medium transition-colors hover:text-white/80 ${
                            pathname === route.path ? "text-white" : "text-white/70"
                          }`}
                          onClick={() => setOpen(false)}
                        >
                          {route.name}
                        </Link>
                      ))}
                    </div>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
