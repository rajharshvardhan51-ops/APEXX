'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  MapPin,
  Thermometer,
  Wind,
  Droplets,
  Cloud,
  Sun,
  CloudRain,
  CloudLightning,
  CloudSnow,
  RefreshCw,
  Navigation,
  Sparkles,
  Compass,
  Radio,
} from 'lucide-react';
import { WeatherLocationData } from '@/hooks/useWeatherLocation';

interface WeatherForecastModalProps {
  isOpen: boolean;
  onClose: () => void;
  weatherData: WeatherLocationData;
}

export const WeatherForecastModal: React.FC<WeatherForecastModalProps> = ({
  isOpen,
  onClose,
  weatherData,
}) => {
  if (!isOpen) return null;

  const {
    locationCode,
    cityName,
    country,
    latitude,
    longitude,
    temperature,
    humidity,
    apparentTemperature,
    windSpeed,
    conditionText,
    isGpsActive,
    hourlyForecast,
    dailyForecast,
    loading,
    refetchLocation,
  } = weatherData;

  const getWeatherIcon = (code: number, className = 'w-5 h-5') => {
    if (code === 0) return <Sun className={`${className} text-[#FFFFFF] animate-pulse`} />;
    if (code >= 1 && code <= 3) return <Cloud className={`${className} text-[#FFFFFF]`} />;
    if (code >= 51 && code <= 67) return <CloudRain className={`${className} text-[#FFFFFF]`} />;
    if (code >= 80 && code <= 82) return <CloudRain className={`${className} text-[#FFFFFF]`} />;
    if (code >= 95 && code <= 99) return <CloudLightning className={`${className} text-[#FFFFFF] animate-bounce`} />;
    if (code >= 71 && code <= 77) return <CloudSnow className={`${className} text-[#FFFFFF]`} />;
    return <Sun className={`${className} text-[#FFFFFF]`} />;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#000000]/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-2xl max-h-[88dvh] overflow-y-auto rounded-2xl bg-[#08080A] border border-[#383848] shadow-[0_0_50px_rgba(255,255,255,0.15)] text-[#FFFFFF] p-4 sm:p-6 space-y-4 sm:space-y-6 my-auto"
        >
          {/* Cyber Background Grid */}
          <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none" />

          {/* Header Bar */}
          <div className="relative z-10 flex items-center justify-between border-b border-[#1E1E26] pb-3 sm:pb-4">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-2 rounded-xl bg-[#000000] border border-[#383848] text-[#FFFFFF] shadow-glow-white shrink-0">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFFFFF]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 font-mono text-[9px] sm:text-[10px] text-[#8E8E93] uppercase font-bold tracking-widest">
                  <span className="truncate">[ SATELLITE TELEMETRY ]</span>
                  <span className="flex items-center gap-1 text-[#FFFFFF] bg-[#18181F] px-1.5 py-0.5 rounded border border-[#27272A] shrink-0">
                    {isGpsActive ? (
                      <>
                        <Navigation className="w-2.5 h-2.5 text-[#FFFFFF] animate-pulse" /> GPS
                      </>
                    ) : (
                      <>
                        <Radio className="w-2.5 h-2.5 text-[#8E8E93]" /> IP
                      </>
                    )}
                  </span>
                </div>
                <h2 className="text-base sm:text-xl font-extrabold font-mono tracking-wider text-[#FFFFFF] text-glow flex items-center gap-1.5 truncate">
                  <span>{locationCode}</span>
                  <span className="text-[10px] sm:text-xs text-[#8E8E93] font-normal truncate">
                    ({cityName}, {country})
                  </span>
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={refetchLocation}
                disabled={loading}
                title="Rescan Device Geolocation"
                className="w-9 h-9 rounded-lg bg-[#000000] border border-[#27272A] hover:border-[#FFFFFF] text-[#8E8E93] hover:text-[#FFFFFF] transition-colors cursor-pointer flex items-center justify-center active:scale-95"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#FFFFFF]' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-lg bg-[#000000] border border-[#27272A] hover:border-[#FFFFFF] text-[#8E8E93] hover:text-[#FFFFFF] transition-colors cursor-pointer flex items-center justify-center active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Coordinates & Sensor Status Readout */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 p-2.5 sm:p-3 rounded-xl bg-[#000000] border border-[#1E1E26] font-mono text-xs">
            <div className="flex items-center gap-1.5 text-[#E4E4E7] text-[11px] sm:text-xs">
              <Compass className="w-3.5 h-3.5 text-[#FFFFFF] shrink-0" />
              <span>LAT: {latitude.toFixed(2)}° | LON: {longitude.toFixed(2)}°</span>
            </div>
            <div className="flex items-center gap-1 text-[#8E8E93] text-[10px] sm:text-[11px]">
              <Sparkles className="w-3 h-3 text-[#FFFFFF]" /> STATUS: <span className="text-[#FFFFFF] font-bold text-glow-sm">{conditionText}</span>
            </div>
          </div>

          {/* Main Weather Metrics Grid */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 font-mono">
            {/* Main Temperature Card */}
            <div className="sm:col-span-1 p-3.5 sm:p-4 rounded-xl bg-[#000000] border border-[#383848] flex flex-col justify-between shadow-[0_0_20px_rgba(255,255,255,0.05)]">
              <span className="text-[10px] text-[#8E8E93] font-bold tracking-widest uppercase flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-[#FFFFFF]" /> TEMPERATURE
              </span>
              <div className="my-1.5 sm:my-2 flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-[#FFFFFF] text-glow-lg">{temperature}°C</span>
                <span className="text-xs text-[#8E8E93]">/ {apparentTemperature}°C FEELS</span>
              </div>
              <div className="text-[10px] text-[#8E8E93] flex items-center gap-1 uppercase">
                {getWeatherIcon(weatherData.weatherCode, 'w-3.5 h-3.5')}
                <span className="text-[#FFFFFF] font-bold">{conditionText}</span>
              </div>
            </div>

            {/* Humidity Card */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-[#000000] border border-[#1E1E26] flex flex-col justify-between">
              <span className="text-[10px] text-[#8E8E93] font-bold tracking-widest uppercase flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-[#FFFFFF]" /> RELATIVE HUMIDITY
              </span>
              <div className="my-1.5 sm:my-2 text-2xl sm:text-3xl font-extrabold text-[#FFFFFF] text-glow">
                {humidity}%
              </div>
              <span className="text-[9px] sm:text-[10px] text-[#8E8E93]">OPTIMAL DENSITY</span>
            </div>

            {/* Wind Speed Card */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-[#000000] border border-[#1E1E26] flex flex-col justify-between">
              <span className="text-[10px] text-[#8E8E93] font-bold tracking-widest uppercase flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-[#FFFFFF]" /> WIND VELOCITY
              </span>
              <div className="my-1.5 sm:my-2 text-2xl sm:text-3xl font-extrabold text-[#FFFFFF] text-glow">
                {windSpeed} <span className="text-xs font-normal text-[#8E8E93]">KM/H</span>
              </div>
              <span className="text-[9px] sm:text-[10px] text-[#8E8E93]">SURFACE FLOW</span>
            </div>
          </div>

          {/* 24-Hour Hourly Weather Forecast Timeline */}
          {hourlyForecast.length > 0 && (
            <div className="relative z-10 space-y-2">
              <h3 className="font-mono text-xs font-bold text-[#FFFFFF] text-glow-sm uppercase tracking-wider flex items-center gap-1.5">
                <span>[ 24-HOUR HOURLY FORECAST ]</span>
              </h3>
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
                {hourlyForecast.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-between p-2.5 rounded-xl bg-[#000000] border border-[#1E1E26] hover:border-[#FFFFFF]/60 min-w-[64px] shrink-0 font-mono transition-colors"
                  >
                    <span className="text-[10px] text-[#8E8E93]">{item.time}</span>
                    <div className="my-1">{getWeatherIcon(item.code, 'w-4 h-4')}</div>
                    <span className="text-xs font-bold text-[#FFFFFF]">{item.temp}°C</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5-Day Daily Weather Forecast */}
          {dailyForecast.length > 0 && (
            <div className="relative z-10 space-y-2">
              <h3 className="font-mono text-xs font-bold text-[#FFFFFF] text-glow-sm uppercase tracking-wider">
                [ 5-DAY ASCENT OUTLOOK ]
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono">
                {dailyForecast.map((dayItem, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 sm:p-3 rounded-xl border flex flex-col items-center space-y-1 text-center ${
                      idx === 0
                        ? 'bg-[#18181F] border-[#383848] shadow-glow-white col-span-2 sm:col-span-1'
                        : 'bg-[#000000] border-[#1E1E26]'
                    }`}
                  >
                    <span className="text-[10px] font-bold text-[#FFFFFF] uppercase tracking-wider">
                      {dayItem.day}
                    </span>
                    <div className="my-1">{getWeatherIcon(dayItem.code, 'w-4 h-4')}</div>
                    <div className="text-xs font-bold text-[#FFFFFF] flex items-center gap-1">
                      <span>{dayItem.tempMax}°</span>
                      <span className="text-[10px] text-[#8E8E93]">/ {dayItem.tempMin}°</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="relative z-10 flex items-center justify-between pt-2 border-t border-[#1E1E26] font-mono text-[10px] text-[#8E8E93]">
            <span className="truncate mr-2">SOURCE: OPEN-METEO</span>
            <button
              onClick={onClose}
              className="px-4 py-2 min-h-[40px] rounded-xl bg-[#FFFFFF] hover:bg-[#E4E4E7] text-[#000000] font-bold uppercase transition-colors cursor-pointer shrink-0 active:scale-95"
            >
              CLOSE
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default WeatherForecastModal;
