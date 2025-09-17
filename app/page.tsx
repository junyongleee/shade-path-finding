"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MapPin, Sun, Shield, Clock, Navigation, Settings } from "lucide-react"
import MapInterface from "@/components/map-interface"
import RouteComparison from "@/components/route-comparison"
import UVWarningSystem from "@/components/uv-warning-system"
import UVForecast from "@/components/uv-forecast"
import PublicDataStatus from "@/components/public-data-status"

export default function HomePage() {
  const [routeMode, setRouteMode] = useState<"shade" | "fast" | "compare">("shade")
  const [departure, setDeparture] = useState("")
  const [destination, setDestination] = useState("")
  const [departureTime, setDepartureTime] = useState("now")
  const [showMap, setShowMap] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState<string>("shade-route")
  const [showForecast, setShowForecast] = useState(false)
  const [showDataStatus, setShowDataStatus] = useState(false)
  const [publicData, setPublicData] = useState<any>(null)

  // Mock UV index data
  const currentUV = 8
  const currentLocation = "광진구"

  const getUVLevel = (uv: number) => {
    if (uv <= 2) return { level: "low", text: "낮음", class: "uv-low" }
    if (uv <= 5) return { level: "moderate", text: "보통", class: "uv-moderate" }
    if (uv <= 7) return { level: "high", text: "높음", class: "uv-high" }
    if (uv <= 10) return { level: "very-high", text: "매우높음", class: "uv-very-high" }
    return { level: "extreme", text: "위험", class: "uv-extreme" }
  }

  const uvInfo = getUVLevel(currentUV)

  // Mock UV forecast data
  const uvForecast = [
    { time: "12:00", uvIndex: 7, temperature: 30, recommendation: "caution" as const },
    { time: "13:00", uvIndex: 8, temperature: 32, recommendation: "danger" as const },
    { time: "14:00", uvIndex: 9, temperature: 33, recommendation: "danger" as const },
    { time: "15:00", uvIndex: 8, temperature: 32, recommendation: "danger" as const },
    { time: "16:00", uvIndex: 6, temperature: 30, recommendation: "caution" as const },
    { time: "17:00", uvIndex: 4, temperature: 28, recommendation: "safe" as const },
    { time: "18:00", uvIndex: 2, temperature: 26, recommendation: "safe" as const },
  ]

  // Mock route data for comparison
  const mockRoutes = [
    {
      id: "shade-route",
      type: "shade" as const,
      name: "그늘길",
      totalTime: 18,
      totalDistance: 1.2,
      exposureTime: 6,
      shadePercentage: 72,
      avgUV: 5.2,
      estimatedTemp: 28,
      timeDifference: 3,
    },
    {
      id: "fast-route",
      type: "fast" as const,
      name: "빠른길",
      totalTime: 15,
      totalDistance: 1.0,
      exposureTime: 13,
      shadePercentage: 25,
      avgUV: 8.1,
      estimatedTemp: 33,
    },
  ]

  const handleSearch = () => {
    if (departure && destination) {
      setShowMap(true)
    }
  }

  const handleRouteSelect = (routeId: string) => {
    setSelectedRoute(routeId)
  }

  const handleAlternativeRoute = () => {
    setRouteMode("shade")
    if (departure && destination) {
      setShowMap(true)
    }
  }

  const handlePublicDataUpdate = (data: any) => {
    setPublicData(data)
    console.log("[v0] Public data updated in main component:", data)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">그늘길</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowDataStatus(!showDataStatus)} className="text-xs">
              <Settings className="h-4 w-4 mr-1" />
              데이터
            </Button>
            <Badge variant="outline" className="text-xs">
              광진구 파일럿
            </Badge>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">그늘에 들어서면 바람도 서늘하다</p>
      </header>

      <div className="p-4 space-y-4">
        {showDataStatus && <PublicDataStatus location={currentLocation} onDataUpdate={handlePublicDataUpdate} />}

        {/* UV Warning System */}
        <UVWarningSystem currentUV={currentUV} location={currentLocation} onAlternativeRoute={handleAlternativeRoute} />

        {/* Route Input */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              경로 검색
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">출발지</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="현재 위치"
                  value={departure}
                  onChange={(e) => setDeparture(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">도착지</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="목적지를 입력하세요"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">출발 시간</label>
              <div className="flex gap-2">
                <Button
                  variant={departureTime === "now" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDepartureTime("now")}
                  className="flex-1"
                >
                  <Clock className="h-4 w-4 mr-1" />
                  지금
                </Button>
                <Button
                  variant={departureTime === "custom" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDepartureTime("custom")}
                  className="flex-1"
                >
                  시간 선택
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Route Mode Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">경로 모드</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={routeMode === "shade" ? "default" : "outline"}
                size="sm"
                onClick={() => setRouteMode("shade")}
                className="text-xs"
              >
                그늘길
              </Button>
              <Button
                variant={routeMode === "fast" ? "default" : "outline"}
                size="sm"
                onClick={() => setRouteMode("fast")}
                className="text-xs"
              >
                빠른길
              </Button>
              <Button
                variant={routeMode === "compare" ? "default" : "outline"}
                size="sm"
                onClick={() => setRouteMode("compare")}
                className="text-xs"
              >
                비교보기
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Current UV Status */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sun className="h-5 w-5" />
                현재 자외선 정보
                {publicData?.uv && (
                  <Badge variant="outline" className="text-xs ml-2">
                    실시간
                  </Badge>
                )}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowForecast(!showForecast)} className="text-xs">
                {showForecast ? "간단히" : "예보보기"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{publicData?.uv?.uvIndex || currentUV}</div>
                <div className={`text-sm font-medium ${uvInfo.class}`}>{publicData?.uv?.grade || uvInfo.text}</div>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <div>{publicData?.uv?.location || currentLocation} 기준</div>
                <div>{publicData?.uv?.time || "오후 2:30"} 업데이트</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* UV Forecast */}
        {showForecast && <UVForecast location={currentLocation} forecast={uvForecast} />}

        {showMap && routeMode === "compare" ? (
          <RouteComparison routes={mockRoutes} selectedRoute={selectedRoute} onRouteSelect={handleRouteSelect} />
        ) : showMap ? (
          <MapInterface />
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MapPin className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">지도 영역</p>
                  <p className="text-xs">경로 검색 후 표시됩니다</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search Button */}
        <Button className="w-full" size="lg" onClick={handleSearch}>
          그늘길 찾기
        </Button>

        {/* Info Badge */}
        <div className="text-center">
          <Badge variant="secondary" className="text-xs">
            야외 경로 전용 • 실내/지하 경로 제외
          </Badge>
        </div>
      </div>
    </div>
  )
}
