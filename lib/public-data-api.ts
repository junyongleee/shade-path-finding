// Korean Public Data Portal API integration
// 한국 공공데이터포털 API 연동 - Server-side only

export interface UVIndexData {
  location: string
  uvIndex: number
  grade: string
  date: string
  time: string
  source: "KMA" // Korea Meteorological Administration
}

export interface BuildingData {
  buildingName: string
  address: string
  floors: number
  height: number
  coordinates: [number, number]
  buildingType: string
}

export interface WeatherData {
  location: string
  temperature: number
  humidity: number
  windSpeed: number
  cloudCover: number
  uvIndex: number
  timestamp: string
}

export class PublicDataAPI {
  private static readonly KMA_UV_API_KEY = process.env.KMA_API_KEY || "demo-key"
  private static readonly BUILDING_API_KEY = process.env.BUILDING_API_KEY || "demo-key"

  /**
   * 기상청 생활기상지수 조회 서비스 - UV 지수
   * KMA Life Weather Index Service - UV Index
   * SERVER-SIDE ONLY
   */
  static async getUVIndex(location: string): Promise<UVIndexData> {
    try {
      // In production, this would call:
      // https://apis.data.go.kr/1360000/LivingWthrIdxServiceV4/getUVIdxV4

      // Mock implementation
      const mockData: UVIndexData = {
        location,
        uvIndex: Math.floor(Math.random() * 11) + 1,
        grade: this.getUVGrade(Math.floor(Math.random() * 11) + 1),
        date: new Date().toISOString().split("T")[0],
        time: new Date().toTimeString().split(" ")[0],
        source: "KMA",
      }

      return mockData
    } catch (error) {
      console.error("Error fetching UV data:", error)
      throw new Error("UV 데이터를 가져오는데 실패했습니다")
    }
  }

  /**
   * 기상청 단기예보 조회 서비스
   * KMA Short-term Weather Forecast Service
   * SERVER-SIDE ONLY
   */
  static async getWeatherForecast(lat: number, lon: number): Promise<WeatherData[]> {
    try {
      // In production, this would call:
      // https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst

      // Mock implementation
      const hours = Array.from({ length: 8 }, (_, i) => {
        const hour = new Date().getHours() + i
        return {
          location: "광진구",
          temperature: 25 + Math.random() * 10,
          humidity: 40 + Math.random() * 40,
          windSpeed: Math.random() * 5,
          cloudCover: Math.random() * 100,
          uvIndex: Math.max(0, 11 - Math.abs(hour - 13) * 1.5 + Math.random() * 2),
          timestamp: new Date(Date.now() + i * 3600000).toISOString(),
        }
      })

      return hours
    } catch (error) {
      console.error("Error fetching weather forecast:", error)
      throw new Error("날씨 예보 데이터를 가져오는데 실패했습니다")
    }
  }

  /**
   * 국토교통부 건축물대장정보 서비스
   * Ministry of Land Building Registry Information Service
   * SERVER-SIDE ONLY
   */
  static async getBuildingData(address: string): Promise<BuildingData[]> {
    try {
      // In production, this would call:
      // https://apis.data.go.kr/1613000/BldRgstService_v2/getBrRecapTitleInfo

      // Mock implementation
      const mockBuildings: BuildingData[] = [
        {
          buildingName: "광진구청",
          address: "서울특별시 광진구 자양동",
          floors: 8,
          height: 32,
          coordinates: [127.0845, 37.5384],
          buildingType: "공공시설",
        },
        {
          buildingName: "건국대학교 새천년관",
          address: "서울특별시 광진구 화양동",
          floors: 15,
          height: 60,
          coordinates: [127.0736, 37.5419],
          buildingType: "교육시설",
        },
        {
          buildingName: "롯데캐슬 자이언트",
          address: "서울특별시 광진구 자양동",
          floors: 35,
          height: 140,
          coordinates: [127.0892, 37.5341],
          buildingType: "공동주택",
        },
      ]

      return mockBuildings
    } catch (error) {
      console.error("Error fetching building data:", error)
      throw new Error("건물 데이터를 가져오는데 실패했습니다")
    }
  }

  /**
   * 서울시 가로수 현황 데이터
   * Seoul Street Tree Status Data
   * SERVER-SIDE ONLY
   */
  static async getStreetTreeData(district: string): Promise<any[]> {
    try {
      // In production, this would call Seoul Open Data API
      // Mock implementation for street trees that provide shade
      const mockTrees = [
        {
          species: "플라타너스",
          location: "광진구 아차산로",
          coordinates: [127.0845, 37.5384],
          canopyRadius: 8,
          height: 15,
          shadeEffectiveness: 0.8,
        },
        {
          species: "은행나무",
          location: "광진구 능동로",
          coordinates: [127.0736, 37.5419],
          canopyRadius: 6,
          height: 12,
          shadeEffectiveness: 0.7,
        },
      ]

      return mockTrees
    } catch (error) {
      console.error("Error fetching street tree data:", error)
      throw new Error("가로수 데이터를 가져오는데 실패했습니다")
    }
  }

  private static getUVGrade(uvIndex: number): string {
    if (uvIndex <= 2) return "낮음"
    if (uvIndex <= 5) return "보통"
    if (uvIndex <= 7) return "높음"
    if (uvIndex <= 10) return "매우높음"
    return "위험"
  }

  /**
   * Calculate shade coverage based on building and tree data
   * 건물과 나무 데이터를 기반으로 그늘 커버리지 계산
   * SERVER-SIDE ONLY
   */
  static calculateShadeScore(buildings: BuildingData[], trees: any[], sunAngle: number, timeOfDay: number): number {
    // Simplified shade calculation algorithm
    let shadeScore = 0

    // Building shadows
    buildings.forEach((building) => {
      const shadowLength = building.height * Math.tan(Math.PI / 2 - sunAngle)
      const shadowArea = shadowLength * building.height * 0.1 // simplified
      shadeScore += shadowArea * 0.001
    })

    // Tree canopy shade
    trees.forEach((tree) => {
      const canopyArea = Math.PI * Math.pow(tree.canopyRadius, 2)
      shadeScore += canopyArea * tree.shadeEffectiveness * 0.01
    })

    // Time-based adjustment (more shade needed during peak hours)
    if (timeOfDay >= 11 && timeOfDay <= 15) {
      shadeScore *= 1.5
    }

    return Math.min(100, Math.max(0, shadeScore))
  }
}

export class ClientAPI {
  /**
   * Client-side function to fetch UV data via API route
   */
  static async getUVIndex(location: string): Promise<UVIndexData> {
    const response = await fetch(`/api/public-data?type=uv&location=${encodeURIComponent(location)}`)
    const result = await response.json()

    if (!result.success) {
      throw new Error(result.error || "UV 데이터를 가져오는데 실패했습니다")
    }

    return result.data
  }

  /**
   * Client-side function to fetch building data via API route
   */
  static async getBuildingData(address: string): Promise<BuildingData[]> {
    const response = await fetch(`/api/public-data?type=buildings&location=${encodeURIComponent(address)}`)
    const result = await response.json()

    if (!result.success) {
      throw new Error(result.error || "건물 데이터를 가져오는데 실패했습니다")
    }

    return result.data
  }

  /**
   * Client-side function to fetch tree data via API route
   */
  static async getStreetTreeData(district: string): Promise<any[]> {
    const response = await fetch(`/api/public-data?type=trees&location=${encodeURIComponent(district)}`)
    const result = await response.json()

    if (!result.success) {
      throw new Error(result.error || "가로수 데이터를 가져오는데 실패했습니다")
    }

    return result.data
  }

  /**
   * Client-side function to fetch weather forecast via API route
   */
  static async getWeatherForecast(lat: number, lon: number): Promise<WeatherData[]> {
    const response = await fetch(`/api/public-data?type=weather&lat=${lat}&lon=${lon}`)
    const result = await response.json()

    if (!result.success) {
      throw new Error(result.error || "날씨 예보 데이터를 가져오는데 실패했습니다")
    }

    return result.data
  }
}

// Utility functions for data processing
export const formatKoreanAddress = (address: string): string => {
  return address.replace(/\s+/g, " ").trim()
}

export const isWithinSeoul = (coordinates: [number, number]): boolean => {
  const [lon, lat] = coordinates
  // Seoul approximate bounds
  return lon >= 126.7 && lon <= 127.3 && lat >= 37.4 && lat <= 37.7
}

export const getDistrictFromCoordinates = (coordinates: [number, number]): string => {
  // Simplified district detection - in production would use proper geocoding
  const [lon, lat] = coordinates

  if (lon >= 127.05 && lon <= 127.15 && lat >= 37.52 && lat <= 37.57) {
    return "광진구"
  }

  return "서울시"
}
