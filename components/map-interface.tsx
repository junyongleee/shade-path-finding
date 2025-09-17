"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sun, Shield, Clock, Thermometer } from "lucide-react"

interface RouteSegment {
  id: string
  coordinates: [number, number][]
  uvLevel: number
  shadeLevel: "high" | "medium" | "low" | "none"
  exposureTime: number // minutes
}

interface Route {
  id: string
  type: "shade" | "fast"
  segments: RouteSegment[]
  totalTime: number
  totalDistance: number
  totalExposure: number
  shadePercentage: number
}

export default function MapInterface() {
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null)
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null)

  // Mock route data
  const mockRoutes: Route[] = [
    {
      id: "shade-route",
      type: "shade",
      segments: [
        {
          id: "s1",
          coordinates: [
            [127.0, 37.5],
            [127.01, 37.51],
          ],
          uvLevel: 3,
          shadeLevel: "high",
          exposureTime: 2,
        },
        {
          id: "s2",
          coordinates: [
            [127.01, 37.51],
            [127.02, 37.52],
          ],
          uvLevel: 8,
          shadeLevel: "medium",
          exposureTime: 3,
        },
        {
          id: "s3",
          coordinates: [
            [127.02, 37.52],
            [127.03, 37.53],
          ],
          uvLevel: 5,
          shadeLevel: "high",
          exposureTime: 1,
        },
      ],
      totalTime: 18,
      totalDistance: 1.2,
      totalExposure: 6,
      shadePercentage: 72,
    },
    {
      id: "fast-route",
      type: "fast",
      segments: [
        {
          id: "f1",
          coordinates: [
            [127.0, 37.5],
            [127.015, 37.515],
          ],
          uvLevel: 9,
          shadeLevel: "none",
          exposureTime: 8,
        },
        {
          id: "f2",
          coordinates: [
            [127.015, 37.515],
            [127.03, 37.53],
          ],
          uvLevel: 8,
          shadeLevel: "low",
          exposureTime: 5,
        },
      ],
      totalTime: 15,
      totalDistance: 1.0,
      totalExposure: 13,
      shadePercentage: 25,
    },
  ]

  const getShadeColor = (level: string) => {
    switch (level) {
      case "high":
        return "bg-shade-high"
      case "medium":
        return "bg-shade-medium"
      case "low":
        return "bg-shade-low"
      case "none":
        return "bg-shade-none"
      default:
        return "bg-gray-400"
    }
  }

  const getUVColor = (uv: number) => {
    if (uv <= 2) return "bg-uv-low"
    if (uv <= 5) return "bg-uv-moderate"
    if (uv <= 7) return "bg-uv-high"
    if (uv <= 10) return "bg-uv-very-high"
    return "bg-uv-extreme"
  }

  return (
    <div className="space-y-4">
      {/* Map Container */}
      <Card>
        <CardContent className="p-0">
          <div className="relative h-80 bg-muted rounded-lg overflow-hidden">
            {/* Mock Map Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50">
              {/* Mock Buildings */}
              <div className="absolute top-8 left-8 w-12 h-16 bg-gray-300 rounded-sm shadow-sm"></div>
              <div className="absolute top-12 left-24 w-16 h-20 bg-gray-400 rounded-sm shadow-sm"></div>
              <div className="absolute top-16 right-16 w-14 h-18 bg-gray-300 rounded-sm shadow-sm"></div>
              <div className="absolute bottom-16 left-12 w-18 h-14 bg-gray-400 rounded-sm shadow-sm"></div>

              {/* Mock Route Lines */}
              {mockRoutes.map((route) => (
                <div key={route.id} className="absolute inset-0">
                  {route.segments.map((segment, index) => (
                    <div
                      key={segment.id}
                      className={`absolute w-1 h-16 rounded-full ${
                        route.type === "shade" ? "bg-primary" : "bg-secondary"
                      } opacity-80`}
                      style={{
                        left: `${20 + index * 60}px`,
                        top: `${40 + index * 40}px`,
                        transform: `rotate(${index * 15}deg)`,
                      }}
                      onMouseEnter={() => setHoveredSegment(segment.id)}
                      onMouseLeave={() => setHoveredSegment(null)}
                    />
                  ))}
                </div>
              ))}

              {/* Start/End Markers */}
              <div className="absolute top-6 left-6 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
              <div className="absolute bottom-6 right-6 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
            </div>

            {/* UV Overlay Toggle */}
            <div className="absolute top-4 right-4">
              <Button variant="secondary" size="sm" className="text-xs">
                <Sun className="h-3 w-3 mr-1" />
                UV 오버레이
              </Button>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 space-y-2">
              <div className="text-xs font-medium">범례</div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span>그늘길</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 bg-secondary rounded-full"></div>
                <span>빠른길</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Route Segments Info */}
      {hoveredSegment && (
        <Card>
          <CardContent className="p-4">
            <div className="text-sm">
              <div className="font-medium mb-2">구간 정보</div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <Sun className="h-3 w-3" />
                  <span>UV 지수: 8</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-3 w-3" />
                  <span>그늘: 중간</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  <span>노출: 3분</span>
                </div>
                <div className="flex items-center gap-2">
                  <Thermometer className="h-3 w-3" />
                  <span>체감온도: 32°C</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* UV Heat Map Legend */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="text-sm font-medium">자외선 위험도</div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-uv-low rounded"></div>
                <span>낮음 (0-2)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-uv-moderate rounded"></div>
                <span>보통 (3-5)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-uv-high rounded"></div>
                <span>높음 (6-7)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-uv-very-high rounded"></div>
                <span>매우높음 (8-10)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-uv-extreme rounded"></div>
                <span>위험 (11+)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shade Coverage Legend */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="text-sm font-medium">그늘 커버리지</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-shade-high rounded"></div>
                <span>높음 (80%+)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-shade-medium rounded"></div>
                <span>보통 (50-80%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-shade-low rounded"></div>
                <span>낮음 (20-50%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-shade-none rounded"></div>
                <span>없음 (0-20%)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
