'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, MapPin, Thermometer, Activity, TrendingUp, Sparkles, User } from 'lucide-react';

import { useApexStore } from '@/store/useApexStore';
import { useWeatherLocation } from '@/hooks/useWeatherLocation';
import { WeatherForecastModal } from '@/components/dashboard/WeatherForecastModal';

const terminalQuotes = [
  'SYSTEM PROTOCOL: UNLOCK MAXIMUM PERFORMANCE VIA CONTINUOUS ITERATION',
  'NEURAL SYNC ESTABLISHED: DISCIPLINE SURPASSES MOTIVATION',
  'SUMMIT HORIZON: 4-YEAR DECOMPOSITION IN PROGRESS',
  'OPTIMIZING DEEP WORK FREQUENCY: NOISE LEVEL MINIMIZED',
];

export const HeroBanner: React.FC = () => {
  const { username, honorific, avatarUrl, streak } = useApexStore();
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isWeatherModalOpen, setIsWeatherModalOpen] = useState(false);

  // Live browser device geolocation & real-time weather telemetry
  const weatherData = useWeatherLocation();
  const { locationCode, temperature, humidity, loading } = weatherData;

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % terminalQuotes.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const syncPercentage = streak > 0 ? '94.8%' : '__%';
  const growthPercentage = streak > 0 ? '+18.4%' : '+0.0%';

  // Dynamic Honorific & Callsign greeting calculation
  const cleanUsername = username && username !== 'NEW OPERATIVE' ? username.trim() : '';
  const currentHonorific = honorific ? honorific.trim() : 'SIR';

  let greetingDisplayName = 'OPERATIVE';
  if (currentHonorific && currentHonorific !== 'NONE') {
    if (cleanUsername) {
      greetingDisplayName = `${currentHonorific} ${cleanUsername}`;
    } else {
      greetingDisplayName = currentHonorific;
    }
  } else if (cleanUsername) {
    greetingDisplayName = cleanUsername;
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative overflow-hidden rounded-2xl bg-[#0B0C12] border border-[#1C1E2A] p-5 sm:p-7 shadow-[0_4px_25px_rgba(0,0,0,0.6)]"
      >
        {/* Background Subtle Grid Texture */}
        <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left Side: Telemetry Tag & Greeting & Terminal Box */}
          <div className="space-y-3.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 font-sans text-xs text-[#FFFFFF] font-medium">
              <span className="hud-tag flex items-center gap-1.5 border-[#2E3144] text-[#FFFFFF] rounded-lg px-3 py-1">
                <Sparkles className="w-3.5 h-3.5 text-[#FFFFFF] animate-pulse" />
                System Active
              </span>
              <span className="hud-tag text-[#94949E] border-[#232634] rounded-lg px-3 py-1">Command Core</span>
            </div>

            <div className="flex items-center gap-4">
              {/* User Profile Picture Avatar */}
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 border-[#FFFFFF]/80 bg-[#161824] overflow-hidden shrink-0 shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={greetingDisplayName} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-7 h-7 sm:w-8 sm:h-8 text-[#FFFFFF]" />
                )}
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#FFFFFF] tracking-tight font-sans leading-snug break-words">
                Welcome back, <span className="text-[#FFFFFF] underline decoration-[#383C52]">{greetingDisplayName}</span>
              </h1>
            </div>

            {/* Dynamic Technical Terminal Box */}
            <div className="flex items-center gap-3 bg-[#06070B] px-3.5 py-3 rounded-xl border border-[#1C1E2A] text-xs font-mono text-[#94949E]">
              <Terminal className="w-4 h-4 text-[#FFFFFF] shrink-0" />
              <motion.span
                key={quoteIndex}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 5 }}
                transition={{ duration: 0.25 }}
                className="truncate text-[#E4E4E7] font-medium text-xs"
              >
                {terminalQuotes[quoteIndex]}
              </motion.span>
              <span className="w-1.5 h-4 bg-[#FFFFFF] animate-pulse shrink-0 ml-auto" />
            </div>
          </div>

          {/* Right Side: Environmental Status Readouts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3 font-sans text-xs">
            {/* Location (Interactive Button) */}
            <button
              onClick={() => setIsWeatherModalOpen(true)}
              title="Click to view live weather forecast & geolocation details"
              className="flex flex-col p-3 rounded-xl bg-[#06070B] border border-[#1C1E2A] hover:border-[#FFFFFF] text-left transition-all duration-200 cursor-pointer group min-h-[50px] active:scale-95"
            >
              <span className="text-[10px] text-[#94949E] group-hover:text-[#FFFFFF] flex items-center gap-1 uppercase tracking-wider font-semibold transition-colors">
                <MapPin className="w-3.5 h-3.5 text-[#FFFFFF] group-hover:animate-bounce" /> Location
              </span>
              <span className="font-mono text-xs font-bold text-[#FFFFFF] mt-1 truncate">
                {loading ? 'Locating...' : locationCode}
              </span>
            </button>

            {/* Temp & Humidity (Interactive Button) */}
            <button
              onClick={() => setIsWeatherModalOpen(true)}
              title="Click to view live weather forecast & environment details"
              className="flex flex-col p-3 rounded-xl bg-[#06070B] border border-[#1C1E2A] hover:border-[#FFFFFF] text-left transition-all duration-200 cursor-pointer group min-h-[50px] active:scale-95"
            >
              <span className="text-[10px] text-[#94949E] group-hover:text-[#FFFFFF] flex items-center gap-1 uppercase tracking-wider font-semibold transition-colors">
                <Thermometer className="w-3.5 h-3.5 text-[#FFFFFF]" /> Weather
              </span>
              <span className="font-mono text-xs font-bold text-[#FFFFFF] mt-1 truncate">
                {loading ? '--°C / --%' : `${temperature}°C / ${humidity}%`}
              </span>
            </button>

            {/* Consistency Rate */}
            <div className="flex flex-col p-3 rounded-xl bg-[#06070B] border border-[#1C1E2A] min-h-[50px]">
              <span className="text-[10px] text-[#94949E] flex items-center gap-1 uppercase tracking-wider font-semibold">
                <Activity className="w-3.5 h-3.5 text-[#FFFFFF]" /> Sync Rate
              </span>
              <span className="font-mono text-xs font-bold text-[#FFFFFF] mt-1">{syncPercentage}</span>
            </div>

            {/* Growth Index */}
            <div className="flex flex-col p-3 rounded-xl bg-[#06070B] border border-[#1C1E2A] min-h-[50px]">
              <span className="text-[10px] text-[#94949E] flex items-center gap-1 uppercase tracking-wider font-semibold">
                <TrendingUp className="w-3.5 h-3.5 text-[#FFFFFF]" /> Growth
              </span>
              <span className="font-mono text-xs font-bold text-[#FFFFFF] mt-1">
                {growthPercentage}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Cyberpunk Weather Forecast Modal */}
      <WeatherForecastModal
        isOpen={isWeatherModalOpen}
        onClose={() => setIsWeatherModalOpen(false)}
        weatherData={weatherData}
      />
    </>
  );
};

export default HeroBanner;


