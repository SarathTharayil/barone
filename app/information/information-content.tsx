"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Calendar, Info, Clock, Tag, Music, Ticket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"

interface Deal {
  id: string
  title: string
  description: string
  day: string
  is_active: boolean
}

interface Policy {
  title: string
  description: string
}

interface InventoryAlert {
  id: string
  item_name: string
  message: string
  start_date: string
  end_date: string | null
  is_active: boolean
}

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  type: string
  ticketed: boolean
  price?: string
}

interface BaseItem {
  id?: string
  title?: string
  description?: string
  item_name?: string
  message?: string
  day?: string
  type?: string
  time?: string
}

interface WeeklyEvent {
  day: string
  title: string
  time: string
  description: string
}

// Static policies since they're not in the database
const staticPolicies: Policy[] = [
  {
    title: "Student Discount",
    description: "Show your valid student ID to get special student prices on selected items.",
  },
  {
    title: "Darts Borrowing",
    description: "Students can borrow darts by temporarily leaving their ID at the bar.",
  },
  {
    title: "Last Orders",
    description: "Last orders are called 30 minutes before closing time.",
  },
  {
    title: "Dress Code",
    description: "Smart casual dress code applies after 8pm on Fridays and Saturdays.",
  },
  {
    title: "Large Groups",
    description: "For groups of 8 or more, please book in advance to ensure seating.",
  },
]

// Static weekly events
const weeklyEvents: WeeklyEvent[] = [
  {
    day: "Monday",
    title: "Bar One Big Quiz",
    time: "7:00PM - 9:00PM",
    description: "Test your knowledge with our weekly pub quiz. Prizes for the winners!",
  },
  {
    day: "Tuesday",
    title: "Soul Jam by Tuesday Club",
    time: "10:00PM - 1:00AM",
    description: "Join us for an evening of soulful music and great vibes with Tuesday Club's resident DJs.",
  },
  {
    day: "Wednesday",
    title: "Roar Pre-Bar",
    time: "10:00PM - 12:30AM",
    description: "Get ready for a night out with our pre-bar event featuring drink specials.",
  },
  {
    day: "Thursday",
    title: "Yo! Karaoke",
    time: "8:30PM - 1:00AM",
    description: "Show off your singing skills with our popular karaoke night.",
  },
  {
    day: "Friday",
    title: "Bar One Lates",
    time: "ALL DAY",
    description: "2 for 1 Cocktails all day long to kick off your weekend right.",
  },
  {
    day: "Saturday",
    title: "Pop Tarts Pre-Bar",
    time: "10:00PM - 1:00AM",
    description: "Dance to the best pop hits before heading out for the night.",
  },
]

// Static upcoming events
const upcomingEvents: Event[] = [
  {
    id: "1",
    title: "Sheff Uni Big Band @ Beer Fest",
    description: "Live performance by the Sheffield University Big Band as part of our Beer Festival.",
    date: "Fri 2nd",
    time: "6:00PM - 8:00PM",
    type: "Live Music",
    ticketed: false,
  },
  {
    id: "2",
    title: "DJs @ Beer Fest",
    description: "Various DJs spinning tunes all night long during our Beer Festival.",
    date: "Sat 3rd",
    time: "4:00PM - 1:00AM",
    type: "DJ",
    ticketed: false,
  },
  {
    id: "3",
    title: "Tuesday Club Reggae Takeover @ Beer Fest",
    description: "Special reggae edition of our Tuesday Club taking over the Beer Festival.",
    date: "Sun 4th",
    time: "2:00PM - LATE",
    type: "Live Music",
    ticketed: false,
  },
  {
    id: "4",
    title: "Offbeat Indie Night",
    description: "A night dedicated to the best indie tracks you don't hear everywhere else.",
    date: "Fri 9th",
    time: "9:00PM - 1:00AM",
    type: "DJ",
    ticketed: true,
    price: "£5",
  },
  {
    id: "5",
    title: "Sip & Paint",
    description: "Create your own masterpiece while enjoying your favorite drinks.",
    date: "Tue 13th",
    time: "7:00PM - 9:30PM",
    type: "Activity",
    ticketed: true,
    price: "£25",
  },
  {
    id: "6",
    title: "Bar One Live Lounge",
    description: "Intimate acoustic performances from local musicians.",
    date: "Tue 20th",
    time: "7:30PM - 10:00PM",
    type: "Live Music",
    ticketed: false,
  },
  {
    id: "7",
    title: "Bar One Boogie in the Gardens",
    description: "Outdoor dance party with Lionel Vinyl spinning classic disco and funk.",
    date: "Fri 23rd",
    time: "5:00PM - 9:00PM",
    type: "DJ",
    ticketed: false,
  },
  {
    id: "8",
    title: "Footprints in the Gardens",
    description: "Footprints Jazz Club presents a special outdoor jazz session in our beer garden.",
    date: "Sun 25th",
    time: "2:00PM - LATE",
    type: "Live Music",
    ticketed: false,
  },
]

// Beer & Cider Festival special event
const beerFestival = {
  title: "BEER & CIDER FESTIVAL",
  dates: "FRI 2ND - SUN 5TH MAY",
  description: "Over 100 Beers & Ciders, Street Food, Live Music, DJs, Cocktails",
}

export default function InformationContent() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [policies, setPolicies] = useState<Policy[]>(staticPolicies)
  const [alerts, setAlerts] = useState<InventoryAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<BaseItem | null>(null)
  const [itemType, setItemType] = useState<"deal" | "policy" | "alert" | "event" | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("deals")

  useEffect(() => {
    const fetchInformation = async () => {
      setLoading(true)
      try {
        // Fetch daily deals
        const { data: dealsData, error: dealsError } = await supabase
          .from("daily_deals")
          .select("*")
          .eq("is_active", true)
          .order("day")

        if (dealsError) {
          console.error("Error fetching deals:", dealsError)
        } else if (dealsData) {
          setDeals(dealsData.map(deal => ({
            id: deal.id as string,
            title: deal.title as string,
            description: deal.description as string,
            day: deal.day as string,
            is_active: deal.is_active as boolean
          })))
        }

        // Fetch inventory alerts
        const { data: alertsData, error: alertsError } = await supabase
          .from("inventory_alerts")
          .select("*")
          .eq("is_active", true)
          .order("start_date", { ascending: false })

        if (alertsError) {
          console.error("Error fetching inventory alerts:", alertsError)
        } else if (alertsData) {
          setAlerts(alertsData.map(alert => ({
            id: alert.id as string,
            item_name: alert.item_name as string,
            message: alert.message as string,
            start_date: alert.start_date as string,
            end_date: alert.end_date as string | null,
            is_active: alert.is_active as boolean
          })))
        }
      } catch (error) {
        console.error("Error fetching information:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchInformation()
  }, [])

  const handleDealClick = (deal: Deal) => {
    setSelectedItem(deal)
    setItemType("deal")
    setIsDialogOpen(true)
  }

  const handlePolicyClick = (policy: Policy) => {
    setSelectedItem(policy)
    setItemType("policy")
    setIsDialogOpen(true)
  }

  const handleAlertClick = (alert: InventoryAlert) => {
    setSelectedItem(alert)
    setItemType("alert")
    setIsDialogOpen(true)
  }

  const handleEventClick = (event: Event) => {
    setSelectedItem(event)
    setItemType("event")
    setIsDialogOpen(true)
  }

  const getDayIcon = (day: string) => {
    return <Calendar className="h-5 w-5 text-barone-darkteal" />
  }

  const getDayColor = (day: string) => {
    const colors: Record<string, string> = {
      monday: "bg-blue-100 text-blue-800",
      tuesday: "bg-purple-100 text-purple-800",
      wednesday: "bg-green-100 text-green-800",
      thursday: "bg-yellow-100 text-yellow-800",
      friday: "bg-pink-100 text-pink-800",
      saturday: "bg-red-100 text-red-800",
      sunday: "bg-orange-100 text-orange-800",
      "all days": "bg-barone-darkteal/20 text-barone-darkteal",
    }

    return colors[day.toLowerCase()] || "bg-gray-100 text-gray-800"
  }

  const getEventTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "live music":
        return <Music className="h-5 w-5 text-barone-coral" />
      case "dj":
        return <Music className="h-5 w-5 text-barone-teal" />
      case "activity":
        return <Calendar className="h-5 w-5 text-barone-darkteal" />
      default:
        return <Calendar className="h-5 w-5 text-barone-darkteal" />
    }
  }

  const getEventTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "live music":
        return "bg-barone-coral/10 text-barone-coral"
      case "dj":
        return "bg-barone-teal/10 text-barone-teal"
      case "activity":
        return "bg-barone-darkteal/10 text-barone-darkteal"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Determine column count based on number of items
  const getGridClass = (itemCount: number) => {
    if (itemCount === 1) return "grid-cols-1"
    if (itemCount === 2) return "grid-cols-1 md:grid-cols-2"
    return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
  }

  const getItemIcon = (item: BaseItem) => {
    if (item.day) {
      return <Calendar className="h-5 w-5 text-barone-darkteal" />
    }
    if (item.type) {
      return getEventTypeIcon(item.type)
    }
    if (item.item_name) {
      return <AlertCircle className="h-5 w-5 text-barone-coral" />
    }
    return <Info className="h-5 w-5 text-barone-darkteal" />
  }

  const getItemsByTab = () => {
    switch (activeTab) {
      case 'deals':
        return deals
      case 'events':
        return {
          weekly: weeklyEvents,
          special: upcomingEvents
        } as const
      case 'policies':
        return policies
      case 'alerts':
        return alerts
      default:
        return deals
    }
  }

  const handleItemClick = (item: BaseItem) => {
    setSelectedItem(item)
    setItemType(
      item.day ? 'deal' :
      item.type ? 'event' :
      item.item_name ? 'alert' :
      'policy'
    )
    setIsDialogOpen(true)
  }

  const renderEvents = () => {
    const events = getItemsByTab() as { weekly: WeeklyEvent[]; special: Event[] }
    return (
      <div className="space-y-8">
        <div>
          <h2 className="mb-4 text-xl font-semibold text-barone-darkteal">Weekly Events</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.weekly.map((item) => (
              <Card
                key={item.day + item.title}
                className="overflow-hidden border-barone-darkteal/20 cursor-pointer transition-all hover:shadow-md"
                onClick={() => handleItemClick(item)}
              >
                <CardHeader className="flex flex-row items-start justify-between gap-4 bg-barone-darkteal/5 p-4">
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-semibold leading-tight text-barone-darkteal">
                      {item.title}
                    </CardTitle>
                  </div>
                  {getItemIcon(item)}
                </CardHeader>
                <CardContent className="p-4 pt-3">
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{item.time}</span>
                    </div>
                    <div
                      className={`inline-block rounded-md px-2 py-1 text-xs font-medium ${getDayColor(item.day)}`}
                    >
                      {item.day}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-xl font-semibold text-barone-darkteal">Special Events</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.special.map((item) => (
              <Card
                key={item.id}
                className="overflow-hidden border-barone-darkteal/20 cursor-pointer transition-all hover:shadow-md"
                onClick={() => handleItemClick(item)}
              >
                <CardHeader className="flex flex-row items-start justify-between gap-4 bg-barone-darkteal/5 p-4">
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-semibold leading-tight text-barone-darkteal">
                      {item.title}
                    </CardTitle>
                  </div>
                  {getItemIcon(item)}
                </CardHeader>
                <CardContent className="p-4 pt-3">
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{item.time}</span>
                    </div>
                    {item.type && (
                      <div
                        className={`inline-block rounded-md px-2 py-1 text-xs font-medium ${getEventTypeColor(item.type)}`}
                      >
                        {item.type}
                      </div>
                    )}
                  </div>
                  {item.ticketed && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-barone-coral">
                      <Ticket className="h-3.5 w-3.5" />
                      <span>Ticketed Event</span>
                      {item.price && (
                        <span className="ml-1 font-medium">{item.price}</span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="deals" value={activeTab} onValueChange={setActiveTab}>
        <div className="relative">
          <div className="overflow-x-auto scrollbar-hide">
            <TabsList className="mb-6 flex w-full min-w-max bg-barone-darkteal/10 p-1">
              <TabsTrigger
                value="deals"
                className="flex-1 whitespace-nowrap px-4 py-2 text-center data-[state=active]:bg-barone-darkteal data-[state=active]:text-white"
              >
                Deals & Promotions
              </TabsTrigger>
              <TabsTrigger
                value="events"
                className="flex-1 whitespace-nowrap px-4 py-2 text-center data-[state=active]:bg-barone-darkteal data-[state=active]:text-white"
              >
                Events
              </TabsTrigger>
              <TabsTrigger
                value="policies"
                className="flex-1 whitespace-nowrap px-4 py-2 text-center data-[state=active]:bg-barone-darkteal data-[state=active]:text-white"
              >
                Policies
              </TabsTrigger>
              <TabsTrigger
                value="alerts"
                className="flex-1 whitespace-nowrap px-4 py-2 text-center data-[state=active]:bg-barone-darkteal data-[state=active]:text-white"
              >
                Inventory Alerts
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value={activeTab} className="mt-0">
          {activeTab === 'events' ? (
            renderEvents()
          ) : (
            <div className={`grid gap-6 ${getGridClass((getItemsByTab() as any[]).length)}`}>
              {(getItemsByTab() as any[]).map((item) => (
                <Card
                  key={('id' in item ? item.id : undefined) || Math.random()}
                  className="overflow-hidden border-barone-darkteal/20 cursor-pointer transition-all hover:shadow-md"
                  onClick={() => handleItemClick(item)}
                >
                  <CardHeader className="flex flex-row items-start justify-between gap-4 bg-barone-darkteal/5 p-4">
                    <div className="space-y-1">
                      <CardTitle className="text-lg font-semibold leading-tight text-barone-darkteal">
                        {('title' in item ? item.title : item.item_name) || '' as string}
                      </CardTitle>
                    </div>
                    {getItemIcon(item)}
                  </CardHeader>
                  <CardContent className="p-4 pt-3">
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {('description' in item ? item.description : item.message) || '' as string}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{item.time as string}</span>
                      </div>
                      {('day' in item && item.day) && (
                        <div
                          className={`inline-block rounded-md px-2 py-1 text-xs font-medium ${getDayColor(item.day as string)}`}
                        >
                          {item.day as string}
                        </div>
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
                <DialogTitle className="text-2xl font-bold text-barone-darkteal">
                  {itemType === 'alert' ? selectedItem?.item_name : selectedItem?.title}
                </DialogTitle>
              </div>
            </DialogHeader>
          </div>

          <div className="space-y-4 p-4">
            <div className="rounded-lg bg-muted/50 p-3">
              <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
                {itemType === 'alert' ? selectedItem?.message : selectedItem?.description}
              </DialogDescription>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {selectedItem?.time && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{selectedItem.time}</span>
                </div>
              )}
              {selectedItem?.day && (
                <div
                  className={`inline-block rounded-md px-2 py-1 text-xs font-medium ${getDayColor(selectedItem.day as string)}`}
                >
                  {selectedItem.day as string}
                </div>
              )}
              {itemType === 'alert' && selectedItem && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>From: {(selectedItem as InventoryAlert).start_date}</span>
                  {(selectedItem as InventoryAlert).end_date && (
                    <span>To: {(selectedItem as InventoryAlert).end_date}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
