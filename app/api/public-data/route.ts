import { type NextRequest, NextResponse } from "next/server"
import { PublicDataAPI } from "@/lib/public-data-api"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const location = searchParams.get("location") || "광진구"
  const dataType = searchParams.get("type") || "uv"

  try {
    let data

    switch (dataType) {
      case "uv":
        data = await PublicDataAPI.getUVIndex(location)
        break
      case "buildings":
        data = await PublicDataAPI.getBuildingData(location)
        break
      case "trees":
        data = await PublicDataAPI.getStreetTreeData(location)
        break
      case "weather":
        const lat = Number.parseFloat(searchParams.get("lat") || "37.5384")
        const lon = Number.parseFloat(searchParams.get("lon") || "127.0845")
        data = await PublicDataAPI.getWeatherForecast(lat, lon)
        break
      default:
        return NextResponse.json({ error: "Invalid data type" }, { status: 400 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Public data API error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch public data" }, { status: 500 })
  }
}
