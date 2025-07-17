import { useEffect, useState } from "react";

// TypeScript interface for the WeatherKit hourly forecast response
interface HourlyForecastData {
  forecastStart: string;
  cloudCover: number;
  conditionCode: string;
  daylight: boolean;
  humidity: number;
  precipitationAmount: number;
  precipitationIntensity: number;
  precipitationChance: number;
  precipitationType: string;
  pressure: number;
  pressureTrend: string;
  snowfallIntensity: number;
  snowfallAmount: number;
  temperature: number;
  temperatureApparent: number;
  temperatureDewPoint: number;
  uvIndex: number;
  visibility: number;
  windDirection: number;
  windGust: number;
  windSpeed: number;
}

interface WeatherKitHourlyResponse {
  forecastHourly: {
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
    hours: HourlyForecastData[];
  };
}

interface UseHourlyForecastParams {
  lat: number;
  lon: number;
  lang: string;
}

interface UseHourlyForecastReturn {
  data: WeatherKitHourlyResponse | null;
  filteredHours: HourlyForecastData[];
  loading: boolean;
  error: string | null;
}

export function useHourlyForecast({
  lat,
  lon,
  lang,
}: UseHourlyForecastParams): UseHourlyForecastReturn {
  const [data, setData] = useState<WeatherKitHourlyResponse | null>(null);
  const [filteredHours, setFilteredHours] = useState<HourlyForecastData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetchHourlyForecast = async () => {
      const token = process.env.EXPO_PUBLIC_WEATHERKIT_TOKEN;

      try {
        const url = `https://weatherkit.apple.com/api/v1/weather/${lang}/${lat}/${lon}?dataSets=forecastHourly`;
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const json = (await res.json()) as WeatherKitHourlyResponse;
        setData(json);

        // Filter hours to show only next 24 hours starting from current hour
        const currentTime = new Date();
        const currentHour = new Date(
          currentTime.getFullYear(),
          currentTime.getMonth(),
          currentTime.getDate(),
          currentTime.getHours()
        );
        const endTime = new Date(currentHour.getTime() + 24 * 60 * 60 * 1000); // 24 hours later

        const filtered = json.forecastHourly.hours.filter((hour) => {
          const forecastTime = new Date(hour.forecastStart);
          return forecastTime >= currentHour && forecastTime < endTime;
        });

        setFilteredHours(filtered);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchHourlyForecast();
  }, [lat, lon, lang]);

  return { data, filteredHours, loading, error };
}
