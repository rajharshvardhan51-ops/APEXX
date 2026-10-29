'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApexStore } from '@/store/useApexStore';
import { User, Edit3, Sparkles } from 'lucide-react';

interface PersonnelProfileCardProps {
  onEditClick?: () => void;
}

export default function PersonnelProfileCard({ onEditClick: _onEditClick }: PersonnelProfileCardProps) {
  const {
    username,
    fullName,
    dateOfBirth,
    avatarUrl,
    level,
    currentTitle,
    setAvatarUrl,
    setUsername,
  } = useApexStore();

  const [isEditing, setIsEditing] = useState(false);
  const [customAvatar, setCustomAvatar] = useState(avatarUrl || '');
  const [customName, setCustomName] = useState(username || 'OSHIMA, ALEX');

  // Format Name into LAST, FIRST format matching the image
  const formatPersonnelName = (rawName: string) => {
    if (!rawName) return 'OSHIMA, ALEX';
    if (rawName.includes(',')) return rawName.toUpperCase();
    const parts = rawName.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[parts.length - 1].toUpperCase()}, ${parts.slice(0, -1).join(' ').toUpperCase()}`;
    }
    return `${rawName.toUpperCase()}, OPERATIVE`;
  };

  const personnelName = formatPersonnelName(username || fullName || 'OSHIMA, ALEX');

  // Calculate age from Date of Birth
  const calculateAge = (dobString?: string) => {
    if (!dobString) return '30';
    try {
      const birth = new Date(dobString);
      const now = new Date();
      let age = now.getFullYear() - birth.getFullYear();
      const monthDiff = now.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
        age--;
      }
      return isNaN(age) || age <= 0 ? '30' : age.toString();
    } catch {
      return '30';
    }
  };

  const handleSaveProfile = () => {
    if (customAvatar.trim()) setAvatarUrl(customAvatar.trim());
    if (customName.trim()) setUsername(customName.trim());
    setIsEditing(false);
  };

  // Preset Sci-fi Avatars for instant switching
  const presetAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
  ];

  return (
    <div className="w-full max-w-5xl mx-auto font-mono text-white select-none overflow-hidden">
      {/* ------------------------------------------------------------- */}
      {/* TOP BRAND HEADER LOGO & HEXAGON INDICATORS */}
      {/* ------------------------------------------------------------- */}
      <div className="flex items-center justify-between px-1 sm:px-4 mb-2">
        {/* Left Stylized Logo & Title */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 font-extrabold text-xl sm:text-3xl tracking-[0.2em] sm:tracking-[0.25em] text-white">
            <svg className="w-6 h-6 sm:w-7 sm:h-7 fill-white shrink-0" viewBox="0 0 100 100">
              <polygon points="50,10 90,90 70,90 50,45 30,90 10,90" />
            </svg>
            <span>OSHIMA</span>
          </div>
          <div className="hidden md:block h-[2px] bg-white w-32 lg:w-64 rounded-full opacity-80" />
        </div>

        {/* Right Hexagon Status Indicators */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {[1, 2, 3].map((idx) => (
            <div
              key={idx}
              className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center border border-white/80"
              style={{
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              }}
            >
              <div
                className="w-2.5 h-2.5 bg-white/90"
                style={{
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MAIN PERSONNEL ID CARD FRAME */}
      {/* ------------------------------------------------------------- */}
      <div className="relative bg-[#000000] border-2 border-white p-3 sm:p-5 md:p-7 shadow-[0_0_40px_rgba(255,255,255,0.15)] rounded-2xl overflow-hidden">
        {/* Inner Border Line Overlay */}
        <div className="absolute inset-1 border border-white/30 pointer-events-none rounded-xl" />

        {/* Quick Action Button (Edit / Customize) */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1.5 px-3 py-1.5 min-h-[38px] text-[10px] font-extrabold uppercase bg-white text-black border border-white hover:bg-neutral-200 transition-all cursor-pointer shadow-sm active:scale-95 touch-manipulation rounded-lg"
          >
            <Edit3 className="w-3.5 h-3.5 text-black" />
            <span>{isEditing ? 'CLOSE' : 'EDIT ID'}</span>
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* EDIT PROFILE DRAWER */}
        {/* ------------------------------------------------------------- */}
        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-5 p-3.5 sm:p-4 bg-[#0a0a0a] border border-white/60 rounded-xl space-y-4 overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-white/30 pb-2">
                <span className="text-xs font-bold tracking-widest text-white flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-white" /> EDIT PERSONNEL IDENTITY
                </span>
                <span className="text-[10px] text-neutral-400">[CONFIG_V2]</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 mb-1">OPERATIVE NAME</label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g. OSHIMA, ALEX"
                    className="w-full bg-[#121212] border border-white/40 px-3 py-2 text-base sm:text-xs text-white font-mono focus:border-white focus:outline-none rounded-lg min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 mb-1">CUSTOM AVATAR IMAGE URL</label>
                  <input
                    type="text"
                    value={customAvatar}
                    onChange={(e) => setCustomAvatar(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-[#121212] border border-white/40 px-3 py-2 text-base sm:text-xs text-white font-mono focus:border-white focus:outline-none rounded-lg min-h-[44px]"
                  />
                </div>
              </div>

              {/* Preset Avatars */}
              <div>
                <span className="block text-[10px] font-bold text-neutral-400 mb-2">PRESET PORTRAITS</span>
                <div className="flex flex-wrap gap-2">
                  {presetAvatars.map((url, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setCustomAvatar(url);
                        setAvatarUrl(url);
                      }}
                      className="w-11 h-11 border border-white/40 hover:border-white overflow-hidden transition-all cursor-pointer rounded-lg active:scale-95"
                    >
                      <img src={url} alt="Preset" className="w-full h-full object-cover filter grayscale" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={handleSaveProfile}
                  className="px-4 py-2.5 min-h-[44px] bg-white text-black font-extrabold text-xs tracking-wider border border-white hover:bg-neutral-200 transition-colors rounded-lg active:scale-95 touch-manipulation"
                >
                  SAVE & APPLY
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ------------------------------------------------------------- */}
        {/* CARD GRID: LEFT PORTRAIT + RIGHT METADATA */}
        {/* ------------------------------------------------------------- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-stretch">
          {/* LEFT SECTION: PORTRAIT */}
          <div className="md:col-span-5 flex flex-col items-center justify-center relative">
            <div className="w-full aspect-[4/5] max-w-[280px] sm:max-w-[320px] bg-[#0d0d0d] border-2 border-white relative overflow-hidden flex items-center justify-center p-2 shadow-inner rounded-xl">
              <svg className="absolute inset-0 w-full h-full opacity-25 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="diamondGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 20 10 L 10 20 L 0 10 Z" fill="none" stroke="#FFFFFF" strokeWidth="0.8" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#diamondGrid)" />
              </svg>

              <div className="w-full h-full relative border border-white/60 overflow-hidden flex items-center justify-center bg-[#050505] rounded-lg">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={personnelName}
                    className="w-full h-full object-cover filter grayscale contrast-125 brightness-95 hover:grayscale-0 transition-all duration-500"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-4 text-neutral-400">
                    <User className="w-16 h-16 sm:w-20 sm:h-20 text-white opacity-80 mb-2 stroke-[1.5]" />
                    <span className="text-[9px] tracking-widest uppercase font-bold text-white">OPERATIVE PORTRAIT</span>
                    <span className="text-[8px] text-neutral-500">NO SIGNAL</span>
                  </div>
                )}

                <div className="absolute top-1 left-1 w-2 h-2 border-t-2 border-l-2 border-white pointer-events-none" />
                <div className="absolute top-1 right-1 w-2 h-2 border-t-2 border-r-2 border-white pointer-events-none" />
                <div className="absolute bottom-1 left-1 w-2 h-2 border-b-2 border-l-2 border-white pointer-events-none" />
                <div className="absolute bottom-1 right-1 w-2 h-2 border-b-2 border-r-2 border-white pointer-events-none" />
              </div>
            </div>
          </div>

          {/* RIGHT SECTION: PERSONNEL DATA & TELEMETRY */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-3 sm:space-y-4 min-w-0">
            {/* ROW 1: NAME, RANK BADGE, SERIAL */}
            <div className="border-b border-white/40 pb-2.5 pr-14 sm:pr-0">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg sm:text-2xl lg:text-3xl font-extrabold tracking-wide sm:tracking-wider text-white uppercase break-words">
                    {personnelName}
                  </h1>
                </div>

                <div className="bg-white text-black font-extrabold text-[11px] sm:text-sm px-2.5 py-0.5 tracking-wider uppercase border border-white shadow-sm shrink-0 rounded">
                  {currentTitle || 'COMMANDER'}
                </div>
              </div>

              <div className="text-[10px] sm:text-[11px] text-neutral-400 font-mono tracking-wider mt-1">
                CMDR.4T42 // ID:{level >= 40 ? 'S-MONARCH' : `OP-${level}09`}
              </div>
            </div>

            {/* ROW 2: TOUR METADATA GRID */}
            <div className="border border-white/80 p-2 sm:p-2.5 text-[10px] sm:text-[11px] font-mono leading-relaxed bg-[#050505] rounded-lg">
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 border-b border-white/30 pb-1.5 mb-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">TOUR START:</span>
                  <span className="font-bold text-white tracking-wider">29.09.2035</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">HA:</span>
                  <span className="font-bold text-white tracking-wider">E95381.NJ</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">TOUR END:</span>
                  <span className="font-bold text-white tracking-wider">EXTEND</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">HI:</span>
                  <span className="font-bold text-white tracking-wider">E95381</span>
                </div>
              </div>
            </div>

            {/* ROW 3: HONEYCOMB + BIG NUMBERS */}
            <div className="space-y-2 py-1">
              <div className="flex items-center justify-between gap-2 sm:gap-4 overflow-hidden">
                <div className="shrink-0 w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center">
                  <svg className="w-full h-full fill-neutral-600 stroke-white stroke-[1.5]" viewBox="0 0 100 100">
                    <polygon points="50,15 70,26.5 70,50 50,61.5 30,50 30,26.5" />
                    <polygon points="26,30 46,41.5 46,65 26,76.5 6,65 6,41.5" />
                    <polygon points="74,30 94,41.5 94,65 74,76.5 54,65 54,41.5" />
                    <polygon points="50,65 70,76.5 70,100 50,111.5 30,100 30,76.5" />
                  </svg>
                </div>

                {/* Big Segmented Key Metrics: 33 74 17 90 (Mobile responsive tracking) */}
                <div className="flex-1 flex items-center justify-end gap-2 sm:gap-5 text-lg xs:text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-[0.1em] sm:tracking-[0.25em] text-white">
                  <span>33</span>
                  <span>74</span>
                  <span>17</span>
                  <span>90</span>
                </div>
              </div>

              {/* Email / Handle line */}
              <div className="border-t border-white/60 pt-1.5 flex flex-col xs:flex-row xs:items-center justify-between gap-1 text-[10px] sm:text-xs text-neutral-300 font-mono">
                <span className="truncate">{`${username.toLowerCase().replace(/[^a-z0-9]/g, '') || 'aoshima'}@hardimanaerospace.com`}</span>
                <span className="text-[9px] text-neutral-400 font-mono shrink-0">[AUTHENTICATED]</span>
              </div>
            </div>

            {/* ROW 4: TERMINAL TELEMETRY SPECS */}
            <div className="grid grid-cols-2 gap-3 text-[10px] sm:text-[11px] font-mono leading-tight pt-1 border-t border-white/30">
              <div className="space-y-0.5 text-neutral-300">
                <div>&gt;{personnelName.split(',')[0] || 'OSH'}</div>
                <div>&gt;{personnelName.split(',')[1]?.trim() || 'ALE'}</div>
                <div>&gt;DOB {dateOfBirth || '04.10.07'}</div>
                <div>&gt;AGE {calculateAge(dateOfBirth)}</div>
              </div>

              <div className="space-y-0.5 text-neutral-300">
                <div>NV4RID: (TTT.22)</div>
                <div>&gt;CTZN.COO.CC01</div>
                <div>&gt;LOS ANGELES,</div>
                <div>&gt;CA, US</div>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* FOOTER BAR: BRAND SCALE */}
        {/* ------------------------------------------------------------- */}
        <div className="mt-5 pt-3 border-t border-white/40 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-[10px] font-mono tracking-wider">
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <span className="font-extrabold text-white text-xs tracking-widest">HARDIMAN</span>
            <span className="text-[8px] text-neutral-400 tracking-[0.2em]">AEROSPACE</span>
          </div>

          <div className="flex flex-col items-center gap-1 max-w-full overflow-hidden">
            <div className="flex items-center gap-1.5 text-white font-extrabold text-[10px] sm:text-[11px] tracking-wider">
              <span className="text-neutral-500">—</span>
              <span>HAN-IV PERSONNEL</span>
              <span className="text-neutral-500">—</span>
            </div>

            {/* Responsive Scale Hash Track */}
            <div className="flex flex-col items-center font-mono text-[8px] sm:text-[9px] text-neutral-400">
              <div className="tracking-[0.1em] sm:tracking-[0.15em] text-white/80 truncate max-w-xs">I...I...I...I...I...I...I...I</div>
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-end text-center sm:text-right">
            <span className="font-extrabold text-white text-xs tracking-widest">HARDIMAN</span>
            <span className="text-[8px] text-neutral-400 tracking-[0.2em]">CORPORATION</span>
          </div>
        </div>
      </div>
    </div>
  );
}
