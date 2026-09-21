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
        className="relative overflow-hidden rounded-xl bg-[#08080A] border border-[#1E1E26] p-6 shadow-[0_4px_25px_rgba(0,0,0,0.95)]"
      >
        {/* Background Subtle Cyber Grid & Scanline */}
        <div className="absolute inset-0 bg-cyber-grid opacity-30 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left Side: Telemetry Tag & Greeting & Terminal Box */}
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 font-mono text-xs text-[#FFFFFF] font-bold tracking-widest uppercase">
              <span className="hud-tag flex items-center gap-1.5 border-[#383848] text-[#FFFFFF] text-glow-sm">
                <Sparkles className="w-3 h-3 text-[#FFFFFF] animate-pulse" />
                [ NODE: ONLINE ]
              </span>
              <span className="hud-tag text-[#8E8E93]">[ SECTOR: COMMAND_CORE ]</span>
            </div>

            <div className="flex items-center gap-4">
              {/* User Profile Picture Avatar */}
              <div className="relative w-14 h-14 rounded-xl border-2 border-[#FFFFFF] bg-[#18181F] overflow-hidden shrink-0 shadow-[0_0_20px_rgba(255,255,255,0.4)] flex items-center justify-center">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={greetingDisplayName} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-[#FFFFFF]" />
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FFFFFF] tracking-tight font-mono uppercase text-glow">
                WELCOME BACK, <span className="text-[#FFFFFF] underline decoration-[#383848] text-glow">{greetingDisplayName}</span>
              </h1>
            </div>

            {/* Dynamic Technical Terminal Box */}
            <div className="flex items-center gap-2.5 bg-[#000000] px-3.5 py-2.5 rounded-lg border border-[#1E1E26] text-xs font-mono text-[#8E8E93]">
              <Terminal className="w-4 h-4 text-[#FFFFFF] shrink-0" />
              <motion.span
                key={quoteIndex}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 5 }}
                transition={{ duration: 0.25 }}
                className="truncate text-[#E4E4E7] font-medium"
              >
                {terminalQuotes[quoteIndex]}
              </motion.span>
              <span className="w-1.5 h-4 bg-[#FFFFFF] animate-pulse shrink-0 ml-auto" />
            </div>
          </div>

          {/* Right Side: Environmental Telemetry Status Readouts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3 font-mono text-xs">
            {/* Location (Interactive Button) */}
            <button
              onClick={() => setIsWeatherModalOpen(true)}
              title="Click to view live weather forecast & geolocation details"
              className="flex flex-col p-2.5 rounded-lg bg-[#000000] border border-[#1E1E26] hover:border-[#FFFFFF] hover:shadow-glow-white text-left transition-all duration-200 cursor-pointer group"
            >
              <span className="text-[9px] text-[#8E8E93] group-hover:text-[#FFFFFF] flex items-center gap-1 uppercase tracking-wider font-bold transition-colors">
                <MapPin className="w-3 h-3 text-[#FFFFFF] group-hover:animate-bounce" /> [ LOC ]
              </span>
              <span className="font-mono text-xs font-extrabold text-[#FFFFFF] text-glow-sm mt-1.5 truncate">
                {loading ? 'LOCATING...' : locationCode}
              </span>
            </button>

            {/* Temp & Humidity (Interactive Button) */}
            <button
              onClick={() => setIsWeatherModalOpen(true)}
              title="Click to view live weather forecast & environment details"
              className="flex flex-col p-2.5 rounded-lg bg-[#000000] border border-[#1E1E26] hover:border-[#FFFFFF] hover:shadow-glow-white text-left transition-all duration-200 cursor-pointer group"
            >
              <span className="text-[9px] text-[#8E8E93] group-hover:text-[#FFFFFF] flex items-center gap-1 uppercase tracking-wider font-bold transition-colors">
                <Thermometer className="w-3 h-3 text-[#FFFFFF]" /> [ ENV ]
              </span>
              <span className="font-mono text-xs font-extrabold text-[#FFFFFF] text-glow-sm mt-1.5">
                {loading ? '--°C / --%' : `${temperature}°C / ${humidity}%`}
              </span>
            </button>

            {/* Consistency Rate */}
            <div className="flex flex-col p-2.5 rounded-lg bg-[#000000] border border-[#1E1E26]">
              <span className="text-[9px] text-[#8E8E93] flex items-center gap-1 uppercase tracking-wider font-bold">
                <Activity className="w-3 h-3 text-[#FFFFFF]" /> [ SYNC ]
              </span>
              <span className="font-mono text-xs font-extrabold text-[#FFFFFF] text-glow-sm mt-1.5">{syncPercentage}</span>
            </div>

            {/* Growth Index */}
            <div className="flex flex-col p-2.5 rounded-lg bg-[#000000] border border-[#1E1E26]">
              <span className="text-[9px] text-[#8E8E93] flex items-center gap-1 uppercase tracking-wider font-bold">
                <TrendingUp className="w-3 h-3 text-[#FFFFFF]" /> [ GROWTH ]
              </span>
              <span className="font-mono text-xs font-extrabold text-[#FFFFFF] text-glow-sm mt-1.5">
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


