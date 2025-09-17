"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Sun, AlertTriangle, Shield, X, Clock } from "lucide-react"

interface UVWarning {
  id: string
  level: "moderate" | "high" | "very-high" | "extreme"
  uvIndex: number
  location: string
  message: string
  recommendations: string[]
  timestamp: Date
  isActive: boolean
}

interface UVWarningSystemProps {
  currentUV: number
  location: string
  onAlternativeRoute?: () => void
}

export default function UVWarningSystem({ currentUV, location, onAlternativeRoute }: UVWarningSystemProps) {
  const [warnings, setWarnings] = useState<UVWarning[]>([])
  const [dismissedWarnings, setDismissedWarnings] = useState<Set<string>>(new Set())

  const getUVLevel = (uv: number): UVWarning["level"] => {
    if (uv <= 5) return "moderate"
    if (uv <= 7) return "high"
    if (uv <= 10) return "very-high"
    return "extreme"
  }

  const getUVLevelInfo = (level: UVWarning["level"]) => {
    switch (level) {
      case "moderate":
        return {
          text: "보통",
          color: "bg-yellow-100 border-yellow-300 text-yellow-800",
          icon: Sun,
          priority: 1,
        }
      case "high":
        return {
          text: "높음",
          color: "bg-orange-100 border-orange-300 text-orange-800",
          icon: Sun,
          priority: 2,
        }
      case "very-high":
        return {
          text: "매우높음",
          color: "bg-red-100 border-red-300 text-red-800",
          icon: AlertTriangle,
          priority: 3,
        }
      case "extreme":
        return {
          text: "위험",
          color: "bg-purple-100 border-purple-300 text-purple-800",
          icon: AlertTriangle,
          priority: 4,
        }
    }
  }

  const generateWarning = (uvIndex: number, location: string): UVWarning | null => {
    if (uvIndex < 6) return null

    const level = getUVLevel(uvIndex)
    const levelInfo = getUVLevelInfo(level)

    let message = ""
    let recommendations: string[] = []

    switch (level) {
      case "high":
        message = `${location}에서 자외선 지수가 높습니다 (${uvIndex})`
        recommendations = ["그늘길 이용을 권장합니다", "선크림을 발라주세요", "모자나 양산을 착용하세요"]
        break
      case "very-high":
        message = `${location}에서 자외선 지수가 매우 높습니다 (${uvIndex})`
        recommendations = [
          "그늘길을 반드시 이용하세요",
          "장시간 야외활동을 피하세요",
          "자외선 차단용품을 착용하세요",
          "수분을 충분히 섭취하세요",
        ]
        break
      case "extreme":
        message = `${location}에서 자외선 지수가 위험 수준입니다 (${uvIndex})`
        recommendations = [
          "야외활동을 자제하세요",
          "불가피한 경우 그늘길만 이용하세요",
          "완전한 자외선 차단복을 착용하세요",
          "10-15분마다 그늘에서 휴식하세요",
        ]
        break
      default:
        message = `${location}에서 자외선 주의가 필요합니다 (${uvIndex})`
        recommendations = ["그늘길 이용을 고려해보세요"]
    }

    return {
      id: `uv-warning-${Date.now()}`,
      level,
      uvIndex,
      location,
      message,
      recommendations,
      timestamp: new Date(),
      isActive: true,
    }
  }

  useEffect(() => {
    const warning = generateWarning(currentUV, location)
    if (warning && !dismissedWarnings.has(warning.id)) {
      setWarnings((prev) => {
        // Remove old warnings for the same location
        const filtered = prev.filter((w) => w.location !== location)
        return [...filtered, warning]
      })
    }
  }, [currentUV, location, dismissedWarnings])

  const dismissWarning = (warningId: string) => {
    setDismissedWarnings((prev) => new Set([...prev, warningId]))
    setWarnings((prev) => prev.filter((w) => w.id !== warningId))
  }

  const activeWarnings = warnings.filter((w) => w.isActive && !dismissedWarnings.has(w.id))

  if (activeWarnings.length === 0) return null

  return (
    <div className="space-y-3">
      {activeWarnings.map((warning) => {
        const levelInfo = getUVLevelInfo(warning.level)
        const IconComponent = levelInfo.icon

        return (
          <Alert key={warning.id} className={`${levelInfo.color} border-l-4`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <IconComponent className="h-5 w-5 mt-0.5" />
                <div className="flex-1">
                  <AlertDescription className="space-y-3">
                    <div>
                      <div className="font-medium text-sm mb-1">{warning.message}</div>
                      <div className="flex items-center gap-2 text-xs opacity-75">
                        <Clock className="h-3 w-3" />
                        <span>
                          {warning.timestamp.toLocaleTimeString("ko-KR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          업데이트
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs font-medium">권장사항:</div>
                      <ul className="text-xs space-y-1">
                        {warning.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-1">
                            <span className="text-xs">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {warning.level === "very-high" || warning.level === "extreme" ? (
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs h-7 bg-transparent"
                          onClick={onAlternativeRoute}
                        >
                          <Shield className="h-3 w-3 mr-1" />
                          대안 경로 찾기
                        </Button>
                      </div>
                    ) : null}
                  </AlertDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-50 hover:opacity-100"
                onClick={() => dismissWarning(warning.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </Alert>
        )
      })}
    </div>
  )
}
