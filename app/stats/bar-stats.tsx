"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

interface SalesData {
  date: string
  amount: number
}

interface TopItem {
  id: number
  name: string
  category: string
  count: number
  trend: "up" | "down" | "stable"
}

interface StaffMember {
  id: number
  name: string
  position: string
  achievement: string
  value: number
  avatar?: string
}

// Mock data for demonstration
const mockDailySales: SalesData[] = [
  { date: "Mon", amount: 1200 },
  { date: "Tue", amount: 900 },
  { date: "Wed", amount: 1500 },
  { date: "Thu", amount: 1800 },
  { date: "Fri", amount: 2500 },
  { date: "Sat", amount: 3000 },
  { date: "Sun", amount: 2200 },
]

const mockWeeklySales: SalesData[] = [
  { date: "Week 1", amount: 8500 },
  { date: "Week 2", amount: 9200 },
  { date: "Week 3", amount: 10500 },
  { date: "Week 4", amount: 11800 },
]

const mockMonthlySales: SalesData[] = [
  { date: "Jan", amount: 35000 },
  { date: "Feb", amount: 32000 },
  { date: "Mar", amount: 38000 },
  { date: "Apr", amount: 40000 },
  { date: "May", amount: 42000 },
  { date: "Jun", amount: 45000 },
]

const mockTopItems: TopItem[] = [
  { id: 1, name: "Black and Gold Rum Punch", category: "Cocktails", count: 156, trend: "up" },
  { id: 2, name: "Amstel", category: "Drinks", count: 142, trend: "stable" },
  { id: 3, name: "Margherita Pizza", category: "Pizza", count: 128, trend: "up" },
  { id: 4, name: "Southern Fried Chicken Burger", category: "Burgers", count: 115, trend: "up" },
  { id: 5, name: "Tequila Rose", category: "Shots", count: 98, trend: "down" },
  { id: 6, name: "Loaded Fries", category: "Loaded Fries", count: 87, trend: "stable" },
  { id: 7, name: "Fanta-sy Island Punch", category: "Cocktails", count: 76, trend: "up" },
  { id: 8, name: "Cheese Nachos", category: "Sharers & Sides", count: 72, trend: "stable" },
]

const mockStaffLeaderboard: StaffMember[] = [
  {
    id: 1,
    name: "Alex Johnson",
    position: "Bartender",
    achievement: "Most Cocktails Made",
    value: 342,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Sam Taylor",
    position: "Bartender",
    achievement: "Fastest Service",
    value: 1.5,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Jamie Smith",
    position: "Server",
    achievement: "Most Orders Taken",
    value: 456,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "Casey Wilson",
    position: "Bartender",
    achievement: "Best Customer Ratings",
    value: 4.9,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    name: "Riley Brown",
    position: "Server",
    achievement: "Most Upsells",
    value: 78,
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

// Additional mock data for new charts
const mockCategoryData = [
  { name: "Cocktails", value: 35 },
  { name: "Beers", value: 28 },
  { name: "Spirits", value: 20 },
  { name: "Food", value: 12 },
  { name: "Coffee", value: 5 },
]

const mockHourlyData = [
  { hour: "12pm", customers: 15 },
  { hour: "1pm", customers: 20 },
  { hour: "2pm", customers: 25 },
  { hour: "3pm", customers: 30 },
  { hour: "4pm", customers: 40 },
  { hour: "5pm", customers: 55 },
  { hour: "6pm", customers: 70 },
  { hour: "7pm", customers: 85 },
  { hour: "8pm", customers: 95 },
  { hour: "9pm", customers: 100 },
  { hour: "10pm", customers: 90 },
  { hour: "11pm", customers: 75 },
  { hour: "12am", customers: 60 },
  { hour: "1am", customers: 40 },
  { hour: "2am", customers: 20 },
]

const mockDrinkTypeData = [
  { name: "Draught Beer", value: 40 },
  { name: "Bottled Beer", value: 15 },
  { name: "Cocktails", value: 25 },
  { name: "Spirits", value: 10 },
  { name: "Wine", value: 5 },
  { name: "Soft Drinks", value: 5 },
]

const mockWeekdayData = [
  { day: "Monday", sales: 2500, customers: 120 },
  { day: "Tuesday", sales: 3000, customers: 150 },
  { day: "Wednesday", sales: 3500, customers: 180 },
  { day: "Thursday", sales: 4500, customers: 220 },
  { day: "Friday", sales: 6500, customers: 350 },
  { day: "Saturday", sales: 7500, customers: 400 },
  { day: "Sunday", sales: 5000, customers: 250 },
]

const mockAgeGroupData = [
  { age: "18-24", percentage: 35 },
  { age: "25-34", percentage: 40 },
  { age: "35-44", percentage: 15 },
  { age: "45-54", percentage: 7 },
  { age: "55+", percentage: 3 },
]

const mockRevenueByHourData = [
  { hour: "12pm", revenue: 300 },
  { hour: "1pm", revenue: 400 },
  { hour: "2pm", revenue: 500 },
  { hour: "3pm", revenue: 600 },
  { hour: "4pm", revenue: 800 },
  { hour: "5pm", revenue: 1100 },
  { hour: "6pm", revenue: 1400 },
  { hour: "7pm", revenue: 1700 },
  { hour: "8pm", revenue: 1900 },
  { hour: "9pm", revenue: 2000 },
  { hour: "10pm", revenue: 1800 },
  { hour: "11pm", revenue: 1500 },
  { hour: "12am", revenue: 1200 },
  { hour: "1am", revenue: 800 },
  { hour: "2am", revenue: 400 },
]

const mockFoodVsDrinkData = [
  { month: "Jan", food: 12000, drinks: 23000 },
  { month: "Feb", food: 11000, drinks: 21000 },
  { month: "Mar", food: 13000, drinks: 25000 },
  { month: "Apr", food: 14000, drinks: 26000 },
  { month: "May", food: 15000, drinks: 27000 },
  { month: "Jun", food: 16000, drinks: 29000 },
]

const mockPromotionImpactData = [
  { promotion: "2-for-1 Cocktails", before: 100, during: 250, after: 150 },
  { promotion: "Happy Hour", before: 120, during: 300, after: 180 },
  { promotion: "Student Night", before: 80, during: 220, after: 120 },
  { promotion: "Live Music", before: 150, during: 350, after: 200 },
]

const COLORS = ["#1AB5AD", "#0A4A47", "#E85642", "#F4A261", "#2A9D8F", "#264653"]

export default function BarStats() {
  const [salesPeriod, setSalesPeriod] = useState("daily")
  const [salesData, setSalesData] = useState<SalesData[]>([])
  const [topItems, setTopItems] = useState<TopItem[]>([])
  const [staffLeaderboard, setStaffLeaderboard] = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMockData = () => {
      setLoading(true)
      try {
        // Use mock data based on selected period
        switch (salesPeriod) {
          case "daily":
            setSalesData(mockDailySales)
            break
          case "weekly":
            setSalesData(mockWeeklySales)
            break
          case "monthly":
            setSalesData(mockMonthlySales)
            break
          default:
            setSalesData(mockDailySales)
        }

        setTopItems(mockTopItems)
        setStaffLeaderboard(mockStaffLeaderboard)
      } finally {
        setLoading(false)
      }
    }

    loadMockData()
  }, [salesPeriod])

  const getTrendBadge = (trend: TopItem["trend"]) => {
    switch (trend) {
      case "up":
        return <Badge className="ml-2 bg-green-500">↑</Badge>
      case "down":
        return <Badge className="ml-2 bg-red-500">↓</Badge>
      case "stable":
      default:
        return <Badge className="ml-2 bg-yellow-500">→</Badge>
    }
  }

  const formatValue = (value: number, achievement: string) => {
    if (achievement.includes("Fastest")) {
      return `${value} min`
    } else if (achievement.includes("Ratings")) {
      return `${value}/5`
    } else {
      return value
    }
  }

  return (
    <div className="space-y-8">
      <Alert className="border-barone-coral/50 bg-barone-coral/10 text-barone-coral">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Demo Data</AlertTitle>
        <AlertDescription>
          This page displays demonstration data for visualization purposes. Connect to a real database for actual
          statistics.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-barone-darkteal/20">
          <CardHeader>
            <CardTitle className="text-barone-darkteal">Total Sales</CardTitle>
            <CardDescription>
              <Tabs defaultValue="daily" value={salesPeriod} onValueChange={setSalesPeriod}>
                <TabsList className="grid w-full grid-cols-3 bg-barone-darkteal/10">
                  <TabsTrigger
                    value="daily"
                    className="data-[state=active]:bg-barone-darkteal data-[state=active]:text-white"
                  >
                    Daily
                  </TabsTrigger>
                  <TabsTrigger
                    value="weekly"
                    className="data-[state=active]:bg-barone-darkteal data-[state=active]:text-white"
                  >
                    Weekly
                  </TabsTrigger>
                  <TabsTrigger
                    value="monthly"
                    className="data-[state=active]:bg-barone-darkteal data-[state=active]:text-white"
                  >
                    Monthly
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#1AB5AD" strokeWidth={2} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-barone-darkteal/20">
          <CardHeader>
            <CardTitle className="text-barone-darkteal">Top Selling Items</CardTitle>
            <CardDescription>Most popular items this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topItems.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-muted-foreground capitalize">{item.category}</div>
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold">{item.count}</span>
                    {getTrendBadge(item.trend)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-barone-darkteal/20">
          <CardHeader>
            <CardTitle className="text-barone-darkteal">Category Breakdown</CardTitle>
            <CardDescription>Sales by category</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <Pie
                  data={mockCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {mockCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-barone-darkteal/20">
          <CardHeader>
            <CardTitle className="text-barone-darkteal">Hourly Customer Traffic</CardTitle>
            <CardDescription>Average number of customers by hour</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockHourlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="customers" stroke="#1AB5AD" fill="#1AB5AD" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-barone-darkteal/20">
          <CardHeader>
            <CardTitle className="text-barone-darkteal">Drink Type Distribution</CardTitle>
            <CardDescription>Percentage of sales by drink type</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <Pie data={mockDrinkTypeData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label>
                  {mockDrinkTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-barone-darkteal/20">
          <CardHeader>
            <CardTitle className="text-barone-darkteal">Weekly Performance</CardTitle>
            <CardDescription>Sales and customer count by day of week</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockWeekdayData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="day" />
                <YAxis yAxisId="left" orientation="left" stroke="#1AB5AD" />
                <YAxis yAxisId="right" orientation="right" stroke="#E85642" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="sales" fill="#1AB5AD" name="Sales (£)" />
                <Bar yAxisId="right" dataKey="customers" fill="#E85642" name="Customers" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-barone-darkteal/20">
          <CardHeader>
            <CardTitle className="text-barone-darkteal">Customer Age Distribution</CardTitle>
            <CardDescription>Percentage of customers by age group</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockAgeGroupData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis type="number" />
                <YAxis dataKey="age" type="category" />
                <Tooltip />
                <Bar dataKey="percentage" fill="#0A4A47" name="Percentage (%)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-barone-darkteal/20">
          <CardHeader>
            <CardTitle className="text-barone-darkteal">Revenue by Hour</CardTitle>
            <CardDescription>Average revenue generated by hour</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockRevenueByHourData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#E85642" fill="#E85642" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-barone-darkteal/20">
          <CardHeader>
            <CardTitle className="text-barone-darkteal">Food vs Drinks Revenue</CardTitle>
            <CardDescription>Monthly comparison of food and drink sales</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockFoodVsDrinkData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="food" fill="#1AB5AD" name="Food (£)" />
                <Bar dataKey="drinks" fill="#E85642" name="Drinks (£)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-barone-darkteal/20">
        <CardHeader>
          <CardTitle className="text-barone-darkteal">Promotion Impact Analysis</CardTitle>
          <CardDescription>Average daily sales before, during, and after promotions</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] overflow-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockPromotionImpactData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="promotion" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="before" fill="#0A4A47" name="Before" />
              <Bar dataKey="during" fill="#E85642" name="During" />
              <Bar dataKey="after" fill="#1AB5AD" name="After" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-barone-darkteal/20">
        <CardHeader>
          <CardTitle className="text-barone-darkteal">Staff Leaderboard</CardTitle>
          <CardDescription>Top performers this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {staffLeaderboard.map((staff) => (
              <div
                key={staff.id}
                className="flex items-center space-x-4 rounded-lg border border-barone-darkteal/20 p-4"
              >
                <Avatar>
                  <AvatarImage src={staff.avatar || "/placeholder.svg"} alt={staff.name} />
                  <AvatarFallback className="bg-barone-teal text-white">
                    {staff.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="font-medium leading-none">{staff.name}</p>
                  <p className="text-sm text-muted-foreground">{staff.position}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs">{staff.achievement}</span>
                    <Badge variant="outline" className="bg-barone-teal/10 text-barone-teal">
                      {formatValue(staff.value, staff.achievement)}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
