"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sun, TrendingUp, TrendingDown } from "lucide-react"

interface UVForecastData {
  time: string
  uvIndex: number
  temperature: number
  recommendation: "safe" | "caution" | "danger"
}

interface UVForecastProps {
  location: string
  forecast: UVForecastData[]
}

export default function UVForecast({ location, forecast }: UVForecastProps) {
  const getUVColor = (uv: number) => {
    if (uv <= 2) return "bg-green-500"
    if (uv <= 5) return "bg-yellow-500"
    if (uv <= 7) return "bg-orange-500"
    if (uv <= 10) return "bg-red-500"
    return "bg-purple-500"
  }

  const getUVText = (uv: number) => {
    if (uv <= 2) return "낮음"
    if (uv <= 5) return "보통"
    if (uv <= 7) return "높음"
    if (uv <= 10) return "매우높음"
    return "위험"
  }

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case "safe":
        return "bg-green-100 text-green-800"
      case "caution":
        return "bg-yellow-100 text-yellow-800"
      case "danger":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRecommendationText = (rec: string) => {
    switch (rec) {
      case "safe":
        return "안전"
      case "caution":
        return "주의"
      case "danger":
        return "위험"
      default:
        return "보통"
    }
  }

  const currentHour = new Date().getHours()
  const peakUVTime = forecast.reduce((max, item) => (item.uvIndex > max.uvIndex ? item : max))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Sun className="h-5 w-5" />
          자외선 예보
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          {location} • 오늘 최고 UV {peakUVTime.uvIndex} ({peakUVTime.time})
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Hourly Forecast */}
        <div className="space-y-3">
          {forecast.map((item, index) => {
            const isCurrentHour = Number.parseInt(item.time.split(":")[0]) === currentHour
            const prevUV = index > 0 ? forecast[index - 1].uvIndex : item.uvIndex
            const trend = item.uvIndex > prevUV ? "up" : item.uvIndex < prevUV ? "down" : "same"

            return (
              <div
                key={item.time}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  isCurrentHour ? "bg-primary/5 border-primary/20" : "bg-muted/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-sm font-medium min-w-[3rem]">
                    {item.time}
                    {isCurrentHour && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        현재
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getUVColor(item.uvIndex)}`} />
                    <span className="text-sm font-medium">{item.uvIndex}</span>
                    <span className="text-xs text-muted-foreground">{getUVText(item.uvIndex)}</span>
                    {trend !== "same" && (
                      <div className="ml-1">
                        {trend === "up" ? (
                          <TrendingUp className="h-3 w-3 text-red-500" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-green-500" />
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-sm text-muted-foreground">{item.temperature}°C</div>
                  <Badge className={`text-xs ${getRecommendationColor(item.recommendation)}`}>
                    {getRecommendationText(item.recommendation)}
                  </Badge>
                </div>
              </div>
            )
          })}
        </div>

        {/* Daily Summary */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="text-xs font-medium text-amber-800 mb-2">오늘의 UV 요약</div>
          <div className="text-xs text-amber-700 space-y-1">
            <div>
              • 피크 시간: {peakUVTime.time} (UV {peakUVTime.uvIndex})
            </div>
            <div>• 그늘길 권장 시간: 11:00 - 16:00</div>
            <div>• 안전한 야외활동: 18:00 이후</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
