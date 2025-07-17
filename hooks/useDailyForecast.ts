import { useEffect, useState } from "react";

// TypeScript interfaces for the WeatherKit daily forecast response
interface DailyForecastPeriod {
  forecastStart: string;
  forecastEnd: string;
  cloudCover: number;
  conditionCode: string;
  humidity: number;
  precipitationAmount: number;
  precipitationChance: number;
  precipitationType: string;
  snowfallAmount: number;
  temperatureMax: number;
  temperatureMin: number;
  windDirection: number;
  windGustSpeedMax: number;
  windSpeed: number;
  windSpeedMax: number;
}

interface DailyForecastData {
  forecastStart: string;
  forecastEnd: string;
  conditionCode: string;
  maxUvIndex: number;
  moonPhase: string;
  moonrise: string;
  moonset: string;
  precipitationAmount: number;
  precipitationChance: number;
  precipitationType: string;
  snowfallAmount: number;
  solarMidnight: string;
  solarNoon: string;
  sunrise: string;
  sunriseCivil: string;
  sunriseNautical: string;
  sunriseAstronomical: string;
  sunset: string;
  sunsetCivil: string;
  sunsetNautical: string;
  sunsetAstronomical: string;
  temperatureMax: number;
  temperatureMin: number;
  windGustSpeedMax: number;
  windSpeedAvg: number;
  windSpeedMax: number;
  daytimeForecast: DailyForecastPeriod;
  overnightForecast: DailyForecastPeriod;
  restOfDayForecast?: DailyForecastPeriod;
}

interface WeatherKitDailyResponse {
  forecastDaily: {
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
    days: DailyForecastData[];
  };
}

interface UseDailyForecastParams {
  lat: number;
  lon: number;
  lang: string;
}

interface UseDailyForecastReturn {
  data: WeatherKitDailyResponse | null;
  days: DailyForecastData[];
  loading: boolean;
  error: string | null;
}

export function useDailyForecast({
  lat,
  lon,
  lang,
}: UseDailyForecastParams): UseDailyForecastReturn {
  const [data, setData] = useState<WeatherKitDailyResponse | null>(null);
  const [days, setDays] = useState<DailyForecastData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetchDailyForecast = async () => {
      const token = process.env.EXPO_PUBLIC_WEATHERKIT_TOKEN;

      try {
        const url = `https://weatherkit.apple.com/api/v1/weather/${lang}/${lat}/${lon}?dataSets=forecastDaily`;
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const json = (await res.json()) as WeatherKitDailyResponse;
        setData(json);

        // Set the days array from the response (typically 10 days)
        setDays(json.forecastDaily.days);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyForecast();
  }, [lat, lon, lang]);

  return { data, days, loading, error };
}
