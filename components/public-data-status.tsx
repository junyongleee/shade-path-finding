"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Database, Wifi, WifiOff, RefreshCw, Building, TreePine } from "lucide-react"
import { ClientAPI, type UVIndexData, type BuildingData } from "@/lib/public-data-api"

interface PublicDataStatusProps {
  location: string
  onDataUpdate?: (data: any) => void
}

export default function PublicDataStatus({ location, onDataUpdate }: PublicDataStatusProps) {
  const [uvData, setUvData] = useState<UVIndexData | null>(null)
  const [buildingData, setBuildingData] = useState<BuildingData[]>([])
  const [treeData, setTreeData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "loading">("disconnected")

  const fetchPublicData = async () => {
    setIsLoading(true)
    setConnectionStatus("loading")

    try {
      console.log("[v0] Starting public data fetch for:", location)

      // Fetch UV data from KMA via API route
      const uvResult = await ClientAPI.getUVIndex(location)
      setUvData(uvResult)
      console.log("[v0] UV data updated:", uvResult)

      // Fetch building data via API route
      const buildingResult = await ClientAPI.getBuildingData(location)
      setBuildingData(buildingResult)
      console.log("[v0] Building data updated:", buildingResult.length, "buildings")

      // Fetch street tree data via API route
      const treeResult = await ClientAPI.getStreetTreeData(location)
      setTreeData(treeResult)
      console.log("[v0] Tree data updated:", treeResult.length, "trees")

      setConnectionStatus("connected")
      setLastUpdate(new Date())

      // Notify parent component of data update
      if (onDataUpdate) {
        onDataUpdate({
          uv: uvResult,
          buildings: buildingResult,
          trees: treeResult,
        })
      }
    } catch (error) {
      console.error("[v0] Error fetching public data:", error)
      setConnectionStatus("disconnected")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPublicData()
  }, [location])

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "bg-green-100 text-green-800"
      case "loading":
        return "bg-yellow-100 text-yellow-800"
      case "disconnected":
        return "bg-red-100 text-red-800"
    }
  }

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case "connected":
        return "연결됨"
      case "loading":
        return "연결중"
      case "disconnected":
        return "연결안됨"
    }
  }

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case "connected":
        return <Wifi className="h-4 w-4" />
      case "loading":
        return <RefreshCw className="h-4 w-4 animate-spin" />
      case "disconnected":
        return <WifiOff className="h-4 w-4" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Database className="h-5 w-5" />
            공공데이터 연동 상태
          </CardTitle>
          <Badge className={getConnectionStatusColor()}>
            {getConnectionIcon()}
            <span className="ml-1">{getConnectionStatusText()}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Data Sources */}
        <div className="grid grid-cols-1 gap-3">
          {/* UV Data Status */}
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <div className="text-sm font-medium">기상청 UV 지수</div>
                <div className="text-xs text-muted-foreground">
                  {uvData ? `UV ${uvData.uvIndex} (${uvData.grade})` : "데이터 없음"}
                </div>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              실시간
            </Badge>
          </div>

          {/* Building Data Status */}
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <div className="text-sm font-medium flex items-center gap-1">
                  <Building className="h-3 w-3" />
                  건축물대장 정보
                </div>
                <div className="text-xs text-muted-foreground">{buildingData.length}개 건물 데이터</div>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              국토부
            </Badge>
          </div>

          {/* Tree Data Status */}
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <div>
                <div className="text-sm font-medium flex items-center gap-1">
                  <TreePine className="h-3 w-3" />
                  가로수 현황
                </div>
                <div className="text-xs text-muted-foreground">{treeData.length}개 가로수 데이터</div>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              서울시
            </Badge>
          </div>
        </div>

        {/* Last Update */}
        {lastUpdate && (
          <div className="text-xs text-muted-foreground text-center">
            마지막 업데이트: {lastUpdate.toLocaleTimeString("ko-KR")}
          </div>
        )}

        {/* Refresh Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={fetchPublicData}
          disabled={isLoading}
          className="w-full bg-transparent"
        >
          {isLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
          데이터 새로고침
        </Button>

        {/* Data Quality Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="text-xs font-medium text-blue-800 mb-1">데이터 출처</div>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• 기상청: 생활기상지수 조회서비스 (UV 지수)</li>
            <li>• 국토교통부: 건축물대장정보 서비스</li>
            <li>• 서울시: 가로수 현황 데이터</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
