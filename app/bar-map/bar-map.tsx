"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ZoomIn, ZoomOut, Move } from "lucide-react"

interface Table {
  id: string
  name: string
  capacity: number
  is_available: boolean
  location: "indoor" | "outdoor"
  x: number
  y: number
  width: number
  height: number
  shape: "rect" | "circle"
}

// Generate indoor tables with better spacing
const generateIndoorTables = (): Table[] => {
  const tables: Table[] = []

  // Tables based on image layout

  // T4 tables (capacity 4)
  tables.push({ id: `t4_1`, name: `T4`, capacity: 4, is_available: Math.random() > 0.5, location: "indoor", x: 70, y: 350, width: 60, height: 60, shape: "circle" });
  tables.push({ id: `t4_2`, name: `T4`, capacity: 4, is_available: Math.random() > 0.5, location: "indoor", x: 150, y: 350, width: 60, height: 60, shape: "circle" });
  tables.push({ id: `t4_3`, name: `T4`, capacity: 4, is_available: Math.random() > 0.5, location: "indoor", x: 70, y: 430, width: 60, height: 60, shape: "circle" });
  tables.push({ id: `t4_4`, name: `T4`, capacity: 4, is_available: Math.random() > 0.5, location: "indoor", x: 300, y: 550, width: 80, height: 80, shape: "rect" });
  tables.push({ id: `t4_5`, name: `T4`, capacity: 4, is_available: Math.random() > 0.5, location: "indoor", x: 600, y: 550, width: 80, height: 80, shape: "rect" });
  tables.push({ id: `t4_6`, name: `T4`, capacity: 4, is_available: Math.random() > 0.5, location: "indoor", x: 800, y: 550, width: 80, height: 80, shape: "rect" });
  tables.push({ id: `t4_7`, name: `T4`, capacity: 4, is_available: Math.random() > 0.5, location: "indoor", x: 950, y: 550, width: 80, height: 80, shape: "rect" });
  tables.push({ id: `t4_8`, name: `T4`, capacity: 4, is_available: Math.random() > 0.5, location: "indoor", x: 1000, y: 700, width: 60, height: 60, shape: "circle" });
  tables.push({ id: `t4_9`, name: `T4`, capacity: 4, is_available: Math.random() > 0.5, location: "indoor", x: 900, y: 800, width: 60, height: 60, shape: "circle" });
  tables.push({ id: `t4_10`, name: `T4`, capacity: 4, is_available: Math.random() > 0.5, location: "indoor", x: 800, y: 800, width: 60, height: 60, shape: "circle" });

  // T6 table (capacity 6)
  tables.push({ id: `t6_1`, name: `T6`, capacity: 6, is_available: Math.random() > 0.4, location: "indoor", x: 150, y: 500, width: 100, height: 70, shape: "rect" });

  // T8 tables (capacity 8)
  tables.push({ id: `t8_1`, name: `T8`, capacity: 8, is_available: Math.random() > 0.6, location: "indoor", x: 600, y: 350, width: 120, height: 80, shape: "rect" });
  tables.push({ id: `t8_2`, name: `T8`, capacity: 8, is_available: Math.random() > 0.6, location: "indoor", x: 950, y: 350, width: 80, height: 80, shape: "circle" });
  tables.push({ id: `t8_3`, name: `T8`, capacity: 8, is_available: Math.random() > 0.6, location: "indoor", x: 800, y: 700, width: 80, height: 80, shape: "circle" });
  tables.push({ id: `t8_4`, name: `T8`, capacity: 8, is_available: Math.random() > 0.6, location: "indoor", x: 1000, y: 800, width: 80, height: 80, shape: "circle" });

  // T2 table (capacity 2)
  tables.push({ id: `t2_1`, name: `T2`, capacity: 2, is_available: Math.random() > 0.3, location: "indoor", x: 950, y: 150, width: 50, height: 50, shape: "circle" });

  // T7 tables (capacity 7)
  tables.push({ id: `t7_1`, name: `T7`, capacity: 7, is_available: Math.random() > 0.7, location: "indoor", x: 900, y: 50, width: 100, height: 70, shape: "rect" });
  tables.push({ id: `t7_2`, name: `T7`, capacity: 7, is_available: Math.random() > 0.7, location: "indoor", x: 1050, y: 50, width: 100, height: 70, shape: "rect" });

  // T10 table (capacity 10)
  tables.push({ id: `t10_1`, name: `T10`, capacity: 10, is_available: Math.random() > 0.8, location: "indoor", x: 850, y: 880, width: 130, height: 90, shape: "rect" });

  return tables
}

// Generate outdoor tables with better spacing
const generateOutdoorTables = (): Table[] => {
  const tables: Table[] = []

  // Small garden tables (2 people) - grid layout with proper spacing
  for (let i = 1; i <= 16; i++) {
    const row = Math.floor((i - 1) / 4)
    const col = (i - 1) % 4
    tables.push({
      id: `gs${i}`,
      name: `G${i}`,
      capacity: 2,
      is_available: Math.random() > 0.3,
      location: "outdoor",
      x: 50 + col * 150,
      y: 50 + row * 150,
      width: 60,
      height: 60,
      shape: "circle",
    })
  }

  // Medium garden tables (4 people) - grid layout with proper spacing
  for (let i = 1; i <= 16; i++) {
    const row = Math.floor((i - 1) / 4)
    const col = (i - 1) % 4
    tables.push({
      id: `gm${i}`,
      name: `G${i + 20}`,
      capacity: 4,
      is_available: Math.random() > 0.5,
      location: "outdoor",
      x: 50 + col * 180,
      y: 450 + row * 180,
      width: 80,
      height: 80,
      shape: "circle",
    })
  }

  // Large garden tables (6-8 people) - grid layout with proper spacing
  for (let i = 1; i <= 8; i++) {
    const row = Math.floor((i - 1) / 4)
    const col = (i - 1) % 4
    tables.push({
      id: `gl${i}`,
      name: `G${i + 40}`,
      capacity: i % 2 === 0 ? 6 : 8,
      is_available: Math.random() > 0.7,
      location: "outdoor",
      x: 650 + col * 200,
      y: 150 + row * 200,
      width: 100,
      height: 80,
      shape: "rect",
    })
  }

  return tables
}

const mockTables: Table[] = [...generateIndoorTables(), ...generateOutdoorTables()]

export default function BarMap() {
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("indoor")
  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const handleTableClick = (table: Table) => {
    setSelectedTable(table)
    setIsDialogOpen(true)
  }

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.2, 2))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.2, 0.5))
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setDragStart({
      x: e.touches[0].clientX - position.x,
      y: e.touches[0].clientY - position.y,
    })
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      })
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  const resetView = () => {
    setZoom(1)
    setPosition({ x: 0, y: 0 })
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="indoor" value={activeTab} onValueChange={setActiveTab}>
        <div className="relative overflow-hidden">
          <div className="overflow-x-auto scrollbar-hide">
            <TabsList className="mb-6 flex w-full bg-barone-darkteal/10 p-1">
              <TabsTrigger
                value="indoor"
                className="flex-1 px-4 py-2 data-[state=active]:bg-barone-darkteal data-[state=active]:text-white"
              >
                Indoor Seating
              </TabsTrigger>
              <TabsTrigger
                value="outdoor"
                className="flex-1 px-4 py-2 data-[state=active]:bg-barone-darkteal data-[state=active]:text-white"
              >
                Beer Garden
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0 sm:space-x-2 pb-4">
          <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-muted-foreground">Available</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-muted-foreground">Occupied</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleZoomOut} className="h-8 w-8" aria-label="Zoom out">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleZoomIn} className="h-8 w-8" aria-label="Zoom in">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={resetView} className="h-8 px-3" aria-label="Reset view">
              <Move className="mr-1 h-4 w-4" />
              Reset View
            </Button>
          </div>
        </div>

        <div className="relative h-[500px] w-full overflow-hidden rounded-lg border bg-muted/30">
          <TabsContent value="indoor" className="absolute inset-0 mt-0">
            <div
              className="h-full w-full cursor-move overflow-hidden"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="relative h-[1000px] w-[1300px] transform-gpu transition-transform duration-100"
                style={{
                  transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
                  transformOrigin: "0 0",
                }}
              >
                {/* Entrance */}
                <div className="absolute left-[80px] top-[700px] text-xs font-medium">Entrance</div>
                <div className="absolute left-[90px] top-[730px] h-[30px] w-[60px] rounded-md border-2 border-dashed border-primary/50"></div>

                {/* Beer Garden Door */}
                <div className="absolute left-[400px] top-[830px] text-xs font-medium">Beer Garden Door</div>
                <div className="absolute left-[410px] top-[860px] h-[30px] w-[60px] rounded-md border-2 border-dashed border-primary/50"></div>

                {/* Pool Tables */}
                <div className="absolute right-[150px] top-[150px] rotate-90 text-xs font-medium">Pool Table 1</div>
                <div className="absolute right-[150px] top-[250px] rotate-90 text-xs font-medium">Pool Table 2</div>
                <div className="absolute right-[150px] top-[350px] rotate-90 text-xs font-medium">Pool Table 3</div>
                <div className="absolute right-[130px] top-[160px] h-[300px] w-[100px] rounded-md bg-gray-300/50"></div>

                {/* Air Hockey Table */}
                 <div className="absolute right-[150px] top-[480px] rotate-90 text-xs font-medium">Air Hockey Table</div>
                 <div className="absolute right-[130px] top-[490px] h-[100px] w-[80px] rounded-md bg-gray-300/50"></div>

                {/* Darts Area */}
                <div className="absolute right-[50px] top-[40px] text-xs font-medium">Darts</div>
                <div className="absolute right-[40px] top-[60px] h-[80px] w-[80px] rounded-md bg-gray-300/50"></div>

                {/* Render indoor tables */}
                {mockTables
                  .filter((table) => table.location === "indoor")
                  .map((table) => (
                    <div
                      key={table.id}
                      onClick={() => handleTableClick(table)}
                      style={{
                        position: "absolute",
                        left: `${table.x}px`,
                        top: `${table.y}px`,
                        width: `${table.width}px`,
                        height: `${table.height}px`,
                        backgroundColor: table.is_available ? "rgba(74, 222, 128, 0.5)" : "rgba(248, 113, 113, 0.5)",
                        border: "2px solid",
                        borderColor: table.is_available ? "rgb(74, 222, 128)" : "rgb(248, 113, 113)",
                        borderRadius: table.shape === "circle" ? "50%" : "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "transform 0.2s, box-shadow 0.2s",
                        overflow: "hidden",
                      }}
                      className="hover:shadow-md hover:shadow-primary/20 hover:brightness-110"
                    >
                      <span className="text-center text-xs font-medium">{table.name}</span>
                    </div>
                  ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="outdoor" className="absolute inset-0 mt-0">
            <div
              className="h-full w-full cursor-move overflow-hidden"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="relative h-[900px] w-[1200px] transform-gpu transition-transform duration-100"
                style={{
                  transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
                  transformOrigin: "0 0",
                }}
              >
                {/* Garden features */}
                <div className="absolute left-[40px] top-[40px] h-[30px] w-[450px] rounded-md bg-green-800/20 text-center text-xs font-medium leading-[30px]">
                  Plants & Greenery
                </div>

                <div className="absolute left-[40px] top-[850px] h-[30px] w-[450px] rounded-md bg-green-800/20 text-center text-xs font-medium leading-[30px]">
                  Plants & Greenery
                </div>

                {/* Entrance to garden */}
                <div className="absolute left-[250px] top-[350px] text-xs font-medium">Garden Entrance</div>
                <div className="absolute left-[250px] top-[380px] h-[30px] w-[60px] rounded-md border-2 border-dashed border-primary/50"></div>

                {/* Render outdoor tables */}
                {mockTables
                  .filter((table) => table.location === "outdoor")
                  .map((table) => (
                    <div
                      key={table.id}
                      onClick={() => handleTableClick(table)}
                      style={{
                        position: "absolute",
                        left: `${table.x}px`,
                        top: `${table.y}px`,
                        width: `${table.width}px`,
                        height: `${table.height}px`,
                        backgroundColor: table.is_available ? "rgba(74, 222, 128, 0.5)" : "rgba(248, 113, 113, 0.5)",
                        border: "2px solid",
                        borderColor: table.is_available ? "rgb(74, 222, 128)" : "rgb(248, 113, 113)",
                        borderRadius: table.shape === "circle" ? "50%" : "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "transform 0.2s, box-shadow 0.2s",
                        overflow: "hidden",
                      }}
                      className="hover:shadow-md hover:shadow-primary/20 hover:brightness-110"
                    >
                      <span className="text-center text-xs font-medium">{table.name}</span>
                    </div>
                  ))}
              </div>
            </div>
          </TabsContent>
        </div>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>Tip: Use the zoom controls or drag to navigate the map. Click on a table to see details.</p>
        </div>
      </Tabs>

      {/* Table details dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedTable?.name}</DialogTitle>
            <DialogDescription>
              {selectedTable?.is_available ? "This table is currently available" : "This table is currently occupied"}
            </DialogDescription>
          </DialogHeader>

          {selectedTable && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status:</span>
                <Badge variant={selectedTable.is_available ? "success" : "destructive"}>
                  {selectedTable.is_available ? "Available" : "Occupied"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Capacity:</span>
                <span>
                  {selectedTable.capacity} {selectedTable.capacity === 1 ? "person" : "people"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Location:</span>
                <span className="capitalize">{selectedTable.location}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Table Type:</span>
                <span className="capitalize">{selectedTable.shape === "circle" ? "Round" : "Rectangular"}</span>
              </div>
            </div>
          )}

          <DialogFooter>
            {selectedTable?.is_available && (
              <Button className="bg-barone-darkteal hover:bg-barone-darkteal/90" onClick={() => setIsDialogOpen(false)}>
                Reserve Table
              </Button>
            )}
            {!selectedTable?.is_available && (
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
