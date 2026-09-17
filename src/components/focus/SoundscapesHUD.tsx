'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Radio, Sliders } from 'lucide-react';

export type SoundscapeType = 'SILENCE' | 'CYBER_LOOPS' | 'RAIN' | 'SYNTHWAVE';

interface SoundscapeOption {
  id: SoundscapeType;
  label: string;
  desc: string;
}

const soundscapes: SoundscapeOption[] = [
  { id: 'SILENCE', label: '[Absolute Silence]', desc: 'Pure zero-noise concentration zone.' },
  { id: 'CYBER_LOOPS', label: '[Cyber Left Loops]', desc: 'Subtle low-frequency binaural theta pulses.' },
  { id: 'RAIN', label: '[Synthetic Rain]', desc: 'Procedural pink-noise white rain audio stream.' },
  { id: 'SYNTHWAVE', label: '[Synthwave Matrix]', desc: 'Atmospheric cyberpunk ambient synth drone.' },
];

export const SoundscapesHUD: React.FC = () => {
  const [activeSoundscape, setActiveSoundscape] = useState<SoundscapeType>('SILENCE');
  const [volume, setVolume] = useState<number>(50);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Web Audio API procedural synth generator
  const stopAudio = () => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      } catch (_e) {
        // ignore if already stopped
      }
      oscillatorRef.current = null;
    }
  };

  const startAudio = (type: SoundscapeType, vol: number) => {
    stopAudio();
    if (type === 'SILENCE') return;

    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const gain = ctx.createGain();
      gain.gain.value = (vol / 100) * 0.15;
      gain.connect(ctx.destination);
      gainNodeRef.current = gain;

      const osc = ctx.createOscillator();

      if (type === 'CYBER_LOOPS') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(108, ctx.currentTime); // 108Hz Theta pulse
      } else if (type === 'RAIN') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
      } else if (type === 'SYNTHWAVE') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(65, ctx.currentTime); // Low C synth drone
      }

      osc.connect(gain);
      osc.start();
      oscillatorRef.current = osc;
    } catch (err) {
      console.warn('Web Audio API initialized on user interaction:', err);
    }
  };

  const handleSelectSoundscape = (type: SoundscapeType) => {
    setActiveSoundscape(type);
    startAudio(type, volume);
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.value = (newVol / 100) * 0.15;
    }
  };

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.2 }}
      className="bg-[#0A0A0E] border border-[#1E1E26] rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.6)] space-y-4 font-mono select-none"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1E1E26] pb-3">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-[#FFFFFF]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#FFFFFF]">
            SOUNDSCAPES SELECTOR HUD
          </h3>
        </div>

        {/* Equalizer Spectrum Visualizer */}
        <div className="flex items-center gap-1">
          {activeSoundscape !== 'SILENCE' ? (
            <div className="flex items-end gap-1 h-4">
              <span className="w-1 h-3 bg-[#FFFFFF] animate-bounce rounded-full" />
              <span className="w-1 h-4 bg-[#8E8E93] animate-pulse rounded-full" />
              <span className="w-1 h-2 bg-[#FFFFFF] animate-bounce rounded-full" />
            </div>
          ) : (
            <span className="text-[10px] text-[#8E8E93]">AUDIO: INACTIVE</span>
          )}
        </div>
      </div>

      {/* Soundscape Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {soundscapes.map((s) => {
          const isActive = activeSoundscape === s.id;

          return (
            <button
              key={s.id}
              onClick={() => handleSelectSoundscape(s.id)}
              className={`p-3 rounded-lg border text-left flex flex-col justify-between transition-all duration-200 ${
                isActive
                  ? 'bg-[#18181F] border-[#FFFFFF] text-[#FFFFFF] shadow-[0_0_12px_rgba(255,255,255,0.2)]'
                  : 'bg-[#050507] border-[#1E1E26] text-[#FFFFFF] hover:border-[#383848]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs">{s.label}</span>
                {isActive ? <Volume2 className="w-4 h-4 text-[#FFFFFF]" /> : <VolumeX className="w-4 h-4 text-[#8E8E93]" />}
              </div>
              <span className="text-[10px] text-[#8E8E93] mt-1">{s.desc}</span>
            </button>
          );
        })}
      </div>

      {/* Volume Slider HUD Control */}
      {activeSoundscape !== 'SILENCE' && (
        <div className="pt-2 flex items-center gap-4 bg-[#050507] p-3 rounded-lg border border-[#1E1E26]">
          <Sliders className="w-4 h-4 text-[#FFFFFF]" />
          <span className="text-[10px] text-[#8E8E93] uppercase">VOLUME: {volume}%</span>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => handleVolumeChange(Number(e.target.value))}
            className="w-full accent-[#FFFFFF] bg-[#1E1E26] h-1.5 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      )}
    </motion.div>
  );
};

export default SoundscapesHUD;
