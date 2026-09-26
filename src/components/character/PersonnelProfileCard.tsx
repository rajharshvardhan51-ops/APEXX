'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApexStore } from '@/store/useApexStore';
import { User, Edit3, Sparkles } from 'lucide-react';

interface PersonnelProfileCardProps {
  onEditClick?: () => void;
}

export default function PersonnelProfileCard({ onEditClick }: PersonnelProfileCardProps) {
  const {
    username,
    fullName,
    dateOfBirth,
    avatarUrl,
    level,
    currentXp,
    xpToNextLevel,
    streak,
    currentTitle,
    completedQuestIds,
    completionIndex,
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
    <div className="w-full max-w-5xl mx-auto font-mono text-white select-none">
      {/* ------------------------------------------------------------- */}
      {/* TOP BRAND HEADER LOGO & HEXAGON INDICATORS */}
      {/* ------------------------------------------------------------- */}
      <div className="flex items-center justify-between px-2 sm:px-4 mb-2">
        {/* Left Stylized Logo & Title matching OSHIMA layout */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-extrabold text-2xl sm:text-3xl tracking-[0.25em] text-white">
            {/* Triangular Vector Logo matching the reference image */}
            <svg className="w-7 h-7 fill-white" viewBox="0 0 100 100">
              <polygon points="50,10 90,90 70,90 50,45 30,90 10,90" />
            </svg>
            <span>OSHIMA</span>
          </div>
          {/* Top Divider extension line */}
          <div className="hidden md:block h-[2px] bg-white w-32 lg:w-64 rounded-full opacity-80" />
        </div>

        {/* Right Hexagon Status Indicators */}
        <div className="flex items-center gap-2.5">
          {[1, 2, 3].map((idx) => (
            <div
              key={idx}
              className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center border border-white/80 hover:border-white transition-colors duration-200"
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
      <div className="relative bg-[#000000] border-2 border-white p-3 sm:p-5 md:p-7 shadow-[0_0_40px_rgba(255,255,255,0.15)] rounded-sm">
        {/* Inner Border Line Overlay for classic retro-futuristic detail */}
        <div className="absolute inset-1 border border-white/30 pointer-events-none" />

        {/* Quick Action Buttons (Edit / Customize) */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-extrabold uppercase bg-white text-black border border-white hover:bg-neutral-200 transition-all cursor-pointer shadow-sm"
          >
            <Edit3 className="w-3 h-3 text-black" />
            <span>{isEditing ? 'CLOSE EDIT' : 'EDIT ID CARD'}</span>
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* EDIT PROFILE DRAWER (MODAL PREVIEW) */}
        {/* ------------------------------------------------------------- */}
        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6 p-4 bg-[#0a0a0a] border border-white/60 space-y-4 overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-white/30 pb-2">
                <span className="text-xs font-bold tracking-widest text-white flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-white" /> EDIT PERSONNEL IDENTITY PROTOCOL
                </span>
                <span className="text-[10px] text-neutral-400">[SYSTEM_CONFIG_V2]</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 mb-1">OPERATIVE NAME (LAST, FIRST)</label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g. OSHIMA, ALEX"
                    className="w-full bg-[#121212] border border-white/40 px-3 py-1.5 text-white font-mono focus:border-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 mb-1">CUSTOM AVATAR IMAGE URL</label>
                  <input
                    type="text"
                    value={customAvatar}
                    onChange={(e) => setCustomAvatar(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-[#121212] border border-white/40 px-3 py-1.5 text-white font-mono focus:border-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Preset Avatars */}
              <div>
                <span className="block text-[10px] font-bold text-neutral-400 mb-2">PRESET PERSONNEL PORTRAITS</span>
                <div className="flex flex-wrap gap-2">
                  {presetAvatars.map((url, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setCustomAvatar(url);
                        setAvatarUrl(url);
                      }}
                      className="w-12 h-12 border border-white/40 hover:border-white overflow-hidden transition-all cursor-pointer"
                    >
                      <img src={url} alt="Preset" className="w-full h-full object-cover filter grayscale" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={handleSaveProfile}
                  className="px-4 py-1.5 bg-white text-black font-extrabold text-xs tracking-wider border border-white hover:bg-neutral-200 transition-colors"
                >
                  SAVE & APPLY PROTOCOL
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ------------------------------------------------------------- */}
        {/* CARD GRID: LEFT PORTRAIT + RIGHT METADATA */}
        {/* ------------------------------------------------------------- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-stretch">
          {/* ============================================================ */}
          {/* LEFT SECTION: PORTRAIT PHOTO WITH DIAMOND GRID TEXTURE */}
          {/* ============================================================ */}
          <div className="md:col-span-5 flex flex-col items-center justify-center relative">
            <div className="w-full aspect-[4/5] max-w-[320px] bg-[#0d0d0d] border-2 border-white relative overflow-hidden flex items-center justify-center p-2 shadow-inner">
              {/* Background Diamond Mesh / Raster Grid Pattern */}
              <svg className="absolute inset-0 w-full h-full opacity-25 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="diamondGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 20 10 L 10 20 L 0 10 Z" fill="none" stroke="#FFFFFF" strokeWidth="0.8" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#diamondGrid)" />
              </svg>

              {/* Portrait Image with High Contrast B&W Grayscale Filter */}
              <div className="w-full h-full relative border border-white/60 overflow-hidden flex items-center justify-center bg-[#050505]">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={personnelName}
                    className="w-full h-full object-cover filter grayscale contrast-125 brightness-95 hover:grayscale-0 transition-all duration-500"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-4 text-neutral-400">
                    <User className="w-20 h-20 text-white opacity-80 mb-2 stroke-[1.5]" />
                    <span className="text-[9px] tracking-widest uppercase font-bold text-white">OPERATIVE PORTRAIT</span>
                    <span className="text-[8px] text-neutral-500">NO AVATAR SIGNAL</span>
                  </div>
                )}

                {/* Corner Frame Accents */}
                <div className="absolute top-1 left-1 w-2 h-2 border-t-2 border-l-2 border-white pointer-events-none" />
                <div className="absolute top-1 right-1 w-2 h-2 border-t-2 border-r-2 border-white pointer-events-none" />
                <div className="absolute bottom-1 left-1 w-2 h-2 border-b-2 border-l-2 border-white pointer-events-none" />
                <div className="absolute bottom-1 right-1 w-2 h-2 border-b-2 border-r-2 border-white pointer-events-none" />
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* RIGHT SECTION: PERSONNEL DATA & TELEMETRY */}
          {/* ============================================================ */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-4">
            {/* ROW 1: NAME, RANK BADGE, SERIAL */}
            <div className="border-b border-white/40 pb-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-wider text-white uppercase">
                    {personnelName}
                  </h1>
                </div>

                {/* Solid White Role/Title Badge */}
                <div className="bg-white text-black font-extrabold text-xs sm:text-sm px-3 py-0.5 tracking-widest uppercase border border-white shadow-sm">
                  {currentTitle || 'COMMANDER'}
                </div>
              </div>

              {/* Serial / ID Code line */}
              <div className="text-[11px] text-neutral-400 font-mono tracking-widest mt-1">
                CMDR.4T42 // ID:{level >= 40 ? 'S-MONARCH' : `OP-${level}09`}
              </div>
            </div>

            {/* ROW 2: TOUR METADATA GRID TABLE */}
            <div className="border border-white/80 p-2 sm:p-2.5 text-[10px] sm:text-[11px] font-mono leading-relaxed bg-[#050505]">
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 border-b border-white/30 pb-1.5 mb-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">TOUR START:</span>
                  <span className="font-bold text-white tracking-wider">29.09.2035</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">HA:</span>
                  <span className="font-bold text-white tracking-wider">E95381.NJ814</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
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

            {/* ROW 3: HONEYCOMB GRAPHIC + BIG NUMBERS & EMAIL LINE */}
            <div className="space-y-2 py-1">
              <div className="flex items-center justify-between gap-4">
                {/* Honeycomb Hexagon Cluster Icon */}
                <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center">
                  <svg className="w-full h-full fill-neutral-600 stroke-white stroke-[1.5]" viewBox="0 0 100 100">
                    <polygon points="50,15 70,26.5 70,50 50,61.5 30,50 30,26.5" />
                    <polygon points="26,30 46,41.5 46,65 26,76.5 6,65 6,41.5" />
                    <polygon points="74,30 94,41.5 94,65 74,76.5 54,65 54,41.5" />
                    <polygon points="50,65 70,76.5 70,100 50,111.5 30,100 30,76.5" />
                  </svg>
                </div>

                {/* Big Segmented Key Metrics: 33 74 17 90 matching the image */}
                <div className="flex-1 flex items-center justify-end gap-3 sm:gap-6 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-[0.25em] text-white">
                  <span>33</span>
                  <span>74</span>
                  <span>17</span>
                  <span>90</span>
                </div>
              </div>

              {/* Email / Handle line below horizontal rule */}
              <div className="border-t border-white/60 pt-1.5 flex items-center justify-between text-[11px] sm:text-xs text-neutral-300 font-mono tracking-wider">
                <span>{`${username.toLowerCase().replace(/[^a-z0-9]/g, '') || 'aoshima'}@hardimanaerospace.com`}</span>
                <span className="text-[9px] text-neutral-400 font-mono">[AUTHENTICATED]</span>
              </div>
            </div>

            {/* ROW 4: TERMINAL TELEMETRY SPECS LIST */}
            <div className="grid grid-cols-2 gap-4 text-[10px] sm:text-[11px] font-mono leading-tight pt-1 border-t border-white/30">
              {/* Column 1 */}
              <div className="space-y-0.5 text-neutral-300">
                <div>&gt;{personnelName.split(',')[0] || 'OSH'}</div>
                <div>&gt;{personnelName.split(',')[1]?.trim() || 'ALE'}</div>
                <div>&gt;DOB {dateOfBirth || '04.10.07'}</div>
                <div>&gt;AGE {calculateAge(dateOfBirth)}</div>
                <div>&gt;H165.10CM</div>
                <div>&gt;W54.4311KG</div>
              </div>

              {/* Column 2 */}
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
        {/* FOOTER BAR: HAN-IV PERSONNEL CROSSOVER LINE & BRAND SCALE */}
        {/* ------------------------------------------------------------- */}
        <div className="mt-6 pt-3 border-t border-white/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] font-mono tracking-wider">
          {/* Left Brand Title */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <span className="font-extrabold text-white text-xs tracking-widest">HARDIMAN</span>
            <span className="text-[8px] text-neutral-400 tracking-[0.2em]">AEROSPACE</span>
          </div>

          {/* Center Crossover Tag & Ruler Hash Track */}
          <div className="flex flex-col items-center gap-1">
            {/* Curved / Cross-over label line */}
            <div className="flex items-center gap-2 text-white font-extrabold text-[11px] tracking-widest">
              <span className="text-neutral-500">—</span>
              <span>HAN-IV PERSONNEL</span>
              <span className="text-neutral-500">—</span>
            </div>

            {/* Scale Hash Track: I . . . I . . . I */}
            <div className="flex flex-col items-center font-mono text-[9px] text-neutral-400">
              <div className="tracking-[0.15em] text-white/80">I....I....I....I....I....I....I....I</div>
              <div className="flex justify-between w-full text-[8px] text-neutral-500 px-0.5">
                <span>0</span>
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
                <span>6</span>
                <span>7</span>
                <span>8</span>
              </div>
            </div>
          </div>

          {/* Right Brand Title */}
          <div className="flex flex-col items-center sm:items-end text-center sm:text-right">
            <span className="font-extrabold text-white text-xs tracking-widest">HARDIMAN</span>
            <span className="text-[8px] text-neutral-400 tracking-[0.2em]">CORPORATION</span>
          </div>
        </div>
      </div>
    </div>
  );
}
