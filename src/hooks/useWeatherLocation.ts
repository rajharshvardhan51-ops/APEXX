'use client';

import { useState, useEffect, useCallback } from 'react';

export interface HourlyForecastItem {
  time: string;
  temp: number;
  code: number;
}

export interface DailyForecastItem {
  day: string;
  date: string;
  tempMax: number;
  tempMin: number;
  code: number;
}

export interface WeatherLocationData {
  latitude: number;
  longitude: number;
  locationCode: string;
  cityName: string;
  country: string;
  temperature: number;
  humidity: number;
  apparentTemperature: number;
  windSpeed: number;
  weatherCode: number;
  conditionText: string;
  isGpsActive: boolean;
  hourlyForecast: HourlyForecastItem[];
  dailyForecast: DailyForecastItem[];
  loading: boolean;
  error: string | null;
  refetchLocation: () => void;
}

export function getWeatherConditionText(code: number): string {
  if (code === 0) return 'CLEAR_SKY';
  if (code >= 1 && code <= 3) return 'PARTLY_CLOUDY';
  if (code >= 45 && code <= 48) return 'FOG_HAZE';
  if (code >= 51 && code <= 67) return 'PRECIPITATION';
  if (code >= 71 && code <= 77) return 'SNOW_PRECIP';
  if (code >= 80 && code <= 82) return 'RAIN_SHOWERS';
  if (code >= 95 && code <= 99) return 'THUNDERSTORM';
  return 'OPTIMAL';
}

const DEFAULT_LAT = 35.6762;
const DEFAULT_LON = 139.6503;
const DEFAULT_CITY = 'TOKYO';
const DEFAULT_CODE = 'TOKYO_07';

export function useWeatherLocation(): WeatherLocationData {
  const [latitude, setLatitude] = useState<number>(DEFAULT_LAT);
  const [longitude, setLongitude] = useState<number>(DEFAULT_LON);
  const [locationCode, setLocationCode] = useState<string>(DEFAULT_CODE);
  const [cityName, setCityName] = useState<string>(DEFAULT_CITY);
  const [country, setCountry] = useState<string>('JAPAN');
  const [temperature, setTemperature] = useState<number>(24);
  const [humidity, setHumidity] = useState<number>(48);
  const [apparentTemperature, setApparentTemperature] = useState<number>(24);
  const [windSpeed, setWindSpeed] = useState<number>(12);
  const [weatherCode, setWeatherCode] = useState<number>(0);
  const [conditionText, setConditionText] = useState<string>('CLEAR_SKY');
  const [isGpsActive, setIsGpsActive] = useState<boolean>(false);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecastItem[]>([]);
  const [dailyForecast, setDailyForecast] = useState<DailyForecastItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherAndGeocode = useCallback(async (lat: number, lon: number, isGps: boolean) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch live weather & forecast from Open-Meteo
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
      const weatherRes = await fetch(weatherUrl);
      
      if (weatherRes.ok) {
        const data = await weatherRes.json();
        if (data.current) {
          setTemperature(Math.round(data.current.temperature_2m ?? 24));
          setHumidity(Math.round(data.current.relative_humidity_2m ?? 48));
          setApparentTemperature(Math.round(data.current.apparent_temperature ?? data.current.temperature_2m ?? 24));
          setWindSpeed(Math.round(data.current.wind_speed_10m ?? 12));
          const code = data.current.weather_code ?? 0;
          setWeatherCode(code);
          setConditionText(getWeatherConditionText(code));
        }

        // Parse hourly forecast (next 24 hours)
        if (data.hourly && data.hourly.time) {
          const nowIndex = Math.max(0, data.hourly.time.findIndex((t: string) => new Date(t) >= new Date()) - 1);
          const slicedTimes = data.hourly.time.slice(nowIndex, nowIndex + 24);
          const slicedTemps = data.hourly.temperature_2m.slice(nowIndex, nowIndex + 24);
          const slicedCodes = data.hourly.weather_code.slice(nowIndex, nowIndex + 24);

          const hourly: HourlyForecastItem[] = slicedTimes.map((t: string, idx: number) => ({
            time: new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
            temp: Math.round(slicedTemps[idx] ?? 24),
            code: slicedCodes[idx] ?? 0,
          }));
          setHourlyForecast(hourly);
        }

        // Parse daily forecast (next 5 days)
        if (data.daily && data.daily.time) {
          const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
          const daily: DailyForecastItem[] = data.daily.time.slice(0, 5).map((d: string, idx: number) => {
            const dateObj = new Date(d);
            const dayName = idx === 0 ? 'TODAY' : daysOfWeek[dateObj.getDay()];
            return {
              day: dayName,
              date: d,
              tempMax: Math.round(data.daily.temperature_2m_max[idx] ?? 25),
              tempMin: Math.round(data.daily.temperature_2m_min[idx] ?? 18),
              code: data.daily.weather_code[idx] ?? 0,
            };
          });
          setDailyForecast(daily);
        }
      }

      // 2. Reverse geocode to retrieve city/country name
      try {
        const geoUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
        const geoRes = await fetch(geoUrl);
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          const city = (geoData.city || geoData.locality || geoData.principalSubdivision || 'DEVICE_NODE').toUpperCase();
          const ctry = (geoData.countryName || 'EARTH').toUpperCase();
          const sectorNum = Math.abs(Math.floor(lat % 100)).toString().padStart(2, '0');
          const sanitizedCity = city.replace(/[^A-Z0-9]/g, '_');

          setCityName(city);
          setCountry(ctry);
          setLocationCode(`${sanitizedCity}_${sectorNum}`);
        }
      } catch (geoErr) {
        console.warn('[Weather] Reverse geocoding failed, using coordinates tag:', geoErr);
        setLocationCode(`SECTOR_${Math.abs(Math.round(lat))}`);
      }

      setLatitude(lat);
      setLongitude(lon);
      setIsGpsActive(isGps);
    } catch (err: any) {
      console.error('[Weather] Failed to fetch weather telemetry:', err);
      setError('TELEMETRY_OFFLINE');
    } finally {
      setLoading(false);
    }
  }, []);

  const requestLocation = useCallback(() => {
    setLoading(true);
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude: lat, longitude: lon } = pos.coords;
          fetchWeatherAndGeocode(lat, lon, true);
        },
        async (err) => {
          console.warn('[Weather] Browser Geolocation denied or unavailable:', err.message);
          // IP-based fallback
          try {
            const ipRes = await fetch('https://ipapi.co/json/');
            if (ipRes.ok) {
              const ipData = await ipRes.json();
              if (ipData.latitude && ipData.longitude) {
                fetchWeatherAndGeocode(ipData.latitude, ipData.longitude, false);
                return;
              }
            }
          } catch (ipErr) {
            console.warn('[Weather] IP location lookup failed:', ipErr);
          }
          // Default fallback (Tokyo)
          fetchWeatherAndGeocode(DEFAULT_LAT, DEFAULT_LON, false);
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 300000 }
      );
    } else {
      fetchWeatherAndGeocode(DEFAULT_LAT, DEFAULT_LON, false);
    }
  }, [fetchWeatherAndGeocode]);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return {
    latitude,
    longitude,
    locationCode,
    cityName,
    country,
    temperature,
    humidity,
    apparentTemperature,
    windSpeed,
    weatherCode,
    conditionText,
    isGpsActive,
    hourlyForecast,
    dailyForecast,
    loading,
    error,
    refetchLocation: requestLocation,
  };
}
