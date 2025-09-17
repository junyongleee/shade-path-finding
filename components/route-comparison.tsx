"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Sun, Shield, Thermometer, Route } from "lucide-react"

interface RouteData {
  id: string
  type: "shade" | "fast"
  name: string
  totalTime: number
  totalDistance: number
  exposureTime: number
  shadePercentage: number
  avgUV: number
  estimatedTemp: number
  timeDifference?: number
}

interface RouteComparisonProps {
  routes: RouteData[]
  selectedRoute?: string
  onRouteSelect: (routeId: string) => void
}

export default function RouteComparison({ routes, selectedRoute, onRouteSelect }: RouteComparisonProps) {
  const shadeRoute = routes.find((r) => r.type === "shade")
  const fastRoute = routes.find((r) => r.type === "fast")

  const getUVBadgeColor = (uv: number) => {
    if (uv <= 2) return "bg-green-100 text-green-800"
    if (uv <= 5) return "bg-yellow-100 text-yellow-800"
    if (uv <= 7) return "bg-orange-100 text-orange-800"
    if (uv <= 10) return "bg-red-100 text-red-800"
    return "bg-purple-100 text-purple-800"
  }

  const getUVText = (uv: number) => {
    if (uv <= 2) return "낮음"
    if (uv <= 5) return "보통"
    if (uv <= 7) return "높음"
    if (uv <= 10) return "매우높음"
    return "위험"
  }

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}분`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}시간 ${mins}분`
  }

  return (
    <div className="space-y-4">
      {/* Comparison Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Route className="h-5 w-5" />
            경로 비교
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">그늘길과 빠른길을 비교하여 최적의 경로를 선택하세요</div>
        </CardContent>
      </Card>

      {/* Route Cards */}
      <div className="grid gap-4">
        {routes.map((route) => (
          <Card
            key={route.id}
            className={`cursor-pointer transition-all ${
              selectedRoute === route.id ? "ring-2 ring-primary border-primary" : "hover:shadow-md"
            }`}
            onClick={() => onRouteSelect(route.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${route.type === "shade" ? "bg-primary" : "bg-secondary"}`} />
                  <CardTitle className="text-base">{route.name}</CardTitle>
                </div>
                {route.type === "shade" && route.timeDifference && (
                  <Badge variant="outline" className="text-xs">
                    +{route.timeDifference}분
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Main Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">{formatTime(route.totalTime)}</div>
                    <div className="text-xs text-muted-foreground">소요시간</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">{route.totalDistance}km</div>
                    <div className="text-xs text-muted-foreground">거리</div>
                  </div>
                </div>
              </div>

              {/* UV and Shade Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{route.exposureTime}분</span>
                      <Badge className={`text-xs ${getUVBadgeColor(route.avgUV)}`}>{getUVText(route.avgUV)}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">직사광선 노출</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">{route.shadePercentage}%</div>
                    <div className="text-xs text-muted-foreground">그늘 비율</div>
                  </div>
                </div>
              </div>

              {/* Temperature */}
              <div className="flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">{route.estimatedTemp}°C</div>
                  <div className="text-xs text-muted-foreground">예상 체감온도</div>
                </div>
              </div>

              {/* Route Benefits */}
              {route.type === "shade" && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="text-xs font-medium text-green-800 mb-1">그늘길 장점</div>
                  <ul className="text-xs text-green-700 space-y-1">
                    <li>
                      • UV 노출{" "}
                      {fastRoute
                        ? Math.round(((fastRoute.exposureTime - route.exposureTime) / fastRoute.exposureTime) * 100)
                        : 0}
                      % 감소
                    </li>
                    <li>• 체감온도 {fastRoute ? fastRoute.estimatedTemp - route.estimatedTemp : 0}°C 낮음</li>
                    <li>• 열사병 위험 감소</li>
                  </ul>
                </div>
              )}

              {route.type === "fast" && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="text-xs font-medium text-blue-800 mb-1">빠른길 장점</div>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• 최단 시간 경로</li>
                    <li>• {shadeRoute ? shadeRoute.timeDifference : 0}분 단축</li>
                    <li>• 직선 거리 최적화</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recommendation */}
      {shadeRoute && fastRoute && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Sun className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-amber-800 mb-1">추천 경로</div>
                <div className="text-xs text-amber-700">
                  현재 자외선 지수가 높아 <strong>그늘길</strong>을 권장합니다.
                  {shadeRoute.timeDifference}분 더 걸리지만 UV 노출을 크게 줄일 수 있습니다.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
