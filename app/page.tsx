"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  CoffeeIcon as Cocktail,
  Calendar,
  Clock,
  ChevronRight,
  MapPin,
  Utensils,
  Info,
  ChevronLeft,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRef, useState, useEffect } from "react"

// Mock data for scrollable cards
const featureCards = [
  {
    id: 1,
    title: "Today's Special",
    description: "2 for 1 Cocktails All Night!",
    icon: <Cocktail className="h-5 w-5 text-barone-coral" />,
    badge: "Limited Time",
    link: "/information",
    linkText: "View All Deals",
    color: "bg-barone-darkteal/5",
  },
  {
    id: 2,
    title: "Live Jazz Night",
    description: "June 5, 2025 • 8:00 PM - 11:00 PM",
    icon: <Calendar className="h-5 w-5 text-barone-coral" />,
    badge: "Upcoming Event",
    link: "/information",
    linkText: "All Events",
    color: "bg-barone-coral/5",
  },
  {
    id: 3,
    title: "Find a Table",
    description: "Check availability and reserve your spot",
    icon: <MapPin className="h-5 w-5 text-barone-coral" />,
    badge: "Bar Map",
    link: "/bar-map",
    linkText: "View Map",
    color: "bg-barone-teal/5",
  },
  {
    id: 4,
    title: "Full Menu",
    description: "Explore our drinks and food offerings",
    icon: <Utensils className="h-5 w-5 text-barone-coral" />,
    badge: "Menu",
    link: "/menu",
    linkText: "Browse Menu",
    color: "bg-barone-darkteal/5",
  },
  {
    id: 5,
    title: "Opening Hours",
    description: "Mon-Thu: 4pm-12am • Fri-Sat: 12pm-2am • Sun: 12pm-10pm",
    icon: <Clock className="h-5 w-5 text-barone-coral" />,
    badge: "Information",
    link: "/information",
    linkText: "More Info",
    color: "bg-barone-coral/5",
  },
  {
    id: 6,
    title: "About Us",
    description: "Learn about Bar One's story and mission",
    icon: <Info className="h-5 w-5 text-barone-coral" />,
    badge: "About",
    link: "/about",
    linkText: "Read More",
    color: "bg-barone-teal/5",
  },
]

export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  // Check if we need to show arrows based on scroll position
  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
    setShowLeftArrow(scrollLeft > 0)
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10) // 10px buffer
  }

  // Initialize scroll position check
  useEffect(() => {
    checkScrollPosition()
    window.addEventListener("resize", checkScrollPosition)
    return () => window.removeEventListener("resize", checkScrollPosition)
  }, [])

  // Scroll left/right
  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return

    const scrollAmount = 300 // px to scroll
    const currentScroll = scrollContainerRef.current.scrollLeft

    scrollContainerRef.current.scrollTo({
      left: direction === "left" ? currentScroll - scrollAmount : currentScroll + scrollAmount,
      behavior: "smooth",
    })
  }

  return (
    <div className="flex-1 flex flex-col bg-barone-darkteal text-white">
      {/* Hero Section - Revamped UI and vertically centered content */}
      <section className="relative w-full max-w-4xl mx-auto px-4 text-center flex items-center flex-1">
        <div className="relative z-10 w-full">
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            Welcome to <span className="text-barone-coral">Bar One</span>
          </h1>
          <p className="mb-10 text-lg text-white/90 sm:text-xl lg:text-2xl">
            Your favorite neighborhood bar with the best drinks, food, and atmosphere. Join us for an unforgettable
            experience.
          </p>
          <div className="flex flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-barone-teal hover:bg-barone-teal/90">
              <Link href="/menu">Explore Menu</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-barone-coral hover:bg-barone-coral/90 text-white"
            >
              <Link href="/information">Information</Link>
            </Button>
          </div>
        </div>
      </section>
      {/* Note: The minimal footer is handled in components/footer.tsx */}
    </div>
  )
}
