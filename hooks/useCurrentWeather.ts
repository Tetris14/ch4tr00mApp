import { useEffect, useState } from "react";

// TypeScript interface for the WeatherKit API response
interface WeatherKitResponse {
  currentWeather: {
    name: string;
    metadata: {
      attributionURL: string;
      expireTime: string;
      latitude: number;
      longitude: number;
      readTime: string;
      reportedTime: string;
      units: string;
      version: number;
      sourceType: string;
    };
    asOf: string;
    cloudCover: number;
    cloudCoverLowAltPct: number;
    cloudCoverMidAltPct: number;
    cloudCoverHighAltPct: number;
    conditionCode: string;
    daylight: boolean;
    humidity: number;
    precipitationIntensity: number;
    pressure: number;
    pressureTrend: string;
    temperature: number;
    temperatureApparent: number;
    temperatureDewPoint: number;
    uvIndex: number;
    visibility: number;
    windDirection: number;
    windGust: number;
    windSpeed: number;
  };
}

interface UseCurrentWeatherParams {
  lat: number;
  lon: number;
  lang: string;
}

interface UseCurrentWeatherReturn {
  data: WeatherKitResponse | null;
  loading: boolean;
  error: string | null;
}

export function useCurrentWeather({
  lat,
  lon,
  lang,
}: UseCurrentWeatherParams): UseCurrentWeatherReturn {
  const [data, setData] = useState<WeatherKitResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetchWeather = async () => {
      const token = process.env.EXPO_PUBLIC_WEATHERKIT_TOKEN;

      try {
        const url = `https://weatherkit.apple.com/api/v1/weather/${lang}/${lat}/${lon}?dataSets=currentWeather`;
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const json = (await res.json()) as WeatherKitResponse;
        setData(json);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [lat, lon, lang]);

  return { data, loading, error };
}
