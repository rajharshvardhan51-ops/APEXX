'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, X, RefreshCw, Radio, Sparkles, Cpu, ShieldAlert } from 'lucide-react';
import { VoiceJarvisState } from '@/hooks/useVoiceJarvis';
import { useApexStore } from '@/store/useApexStore';

interface JarvisVoiceHudProps {
  voiceJarvis: VoiceJarvisState;
}

export const JarvisVoiceHud: React.FC<JarvisVoiceHudProps> = ({ voiceJarvis }) => {
  const {
    isListening,
    isSpeaking,
    isOverlayOpen,
    transcript,
    jarvisResponse,
    toggleListening,
    triggerVoiceBriefing,
    closeOverlay,
  } = voiceJarvis;

  const { honorific, username } = useApexStore();
  const titlePrefix = honorific && honorific !== 'NONE' ? honorific : 'SIR';

  if (!isOverlayOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000000]/85 backdrop-blur-md select-none font-mono">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-[#08080A] border border-[#383848] p-6 shadow-[0_0_60px_rgba(255,255,255,0.15)] text-[#FFFFFF] space-y-6"
        >
          {/* Cyber Dot Grid Background */}
          <div className="absolute inset-0 bg-cyber-grid opacity-25 pointer-events-none" />

          {/* Header Bar */}
          <div className="relative z-10 flex items-center justify-between border-b border-[#1E1E26] pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-[#000000] border border-[#383848] text-[#FFFFFF] shadow-glow-white">
                <Cpu className="w-5 h-5 text-[#FFFFFF] animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-[10px] text-[#8E8E93] uppercase font-bold tracking-widest">
                  <span>[ J.A.R.V.I.S. VOICE INTERFACE ]</span>
                  <span className="flex items-center gap-1 text-[#FFFFFF] bg-[#18181F] px-1.5 py-0.5 rounded border border-[#27272A]">
                    <Radio className="w-2.5 h-2.5 text-[#FFFFFF] animate-ping" /> ONLINE
                  </span>
                </div>
                <h2 className="text-lg font-extrabold text-[#FFFFFF] text-glow tracking-wider">
                  AI SYSTEM PROTOCOL // {titlePrefix}
                </h2>
              </div>
            </div>

            <button
              onClick={closeOverlay}
              className="p-2 rounded-lg bg-[#000000] border border-[#27272A] hover:border-[#FFFFFF] text-[#8E8E93] hover:text-[#FFFFFF] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Holographic Arc Reactor Audio Visualizer Ring */}
          <div className="relative z-10 flex flex-col items-center justify-center my-4 space-y-3">
            <div className="relative w-28 h-28 flex items-center justify-center">
              {/* Outer Pulsing Wave 1 */}
              <motion.div
                animate={{
                  scale: isSpeaking ? [1, 1.35, 1] : isListening ? [1, 1.2, 1] : 1,
                  opacity: isSpeaking ? [0.4, 0.9, 0.4] : 0.2,
                }}
                transition={{ repeat: Infinity, duration: isSpeaking ? 1.2 : 2.5, ease: 'easeInOut' }}
                className="absolute inset-0 rounded-full border-2 border-[#FFFFFF]/40 shadow-[0_0_30px_rgba(255,255,255,0.3)]"
              />

              {/* Outer Pulsing Wave 2 */}
              <motion.div
                animate={{
                  scale: isSpeaking ? [1.1, 1.5, 1.1] : 1.05,
                  opacity: isSpeaking ? [0.2, 0.6, 0.2] : 0.1,
                }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut', delay: 0.2 }}
                className="absolute inset-0 rounded-full border border-[#FFFFFF]/20"
              />

              {/* Inner Arc Core */}
              <div className="w-20 h-20 rounded-full bg-[#000000] border-2 border-[#FFFFFF] flex items-center justify-center shadow-[0_0_25px_rgba(255,255,255,0.5)]">
                {isSpeaking ? (
                  <Volume2 className="w-9 h-9 text-[#FFFFFF] animate-pulse text-glow-lg" />
                ) : isListening ? (
                  <Mic className="w-9 h-9 text-[#FFFFFF] animate-bounce text-glow-lg" />
                ) : (
                  <Sparkles className="w-9 h-9 text-[#FFFFFF] text-glow-lg" />
                )}
              </div>
            </div>

            {/* Status Readout Pill */}
            <div className="flex items-center gap-2 font-mono text-xs px-3 py-1 rounded-full bg-[#000000] border border-[#383848] shadow-sm">
              <span className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-[#FFFFFF] animate-ping' : isListening ? 'bg-[#FFFFFF] animate-pulse' : 'bg-[#8E8E93]'}`} />
              <span className="text-[#FFFFFF] font-bold text-glow-sm">
                {isSpeaking ? 'J.A.R.V.I.S. TRANSMITTING AUDIO...' : isListening ? 'LISTENING FOR "HEY APEX"...' : 'IDLE PROTOCOL'}
              </span>
            </div>
          </div>

          {/* Live Transcript & J.A.R.V.I.S. Response Output */}
          <div className="relative z-10 space-y-3">
            {/* User Speech Transcript Box */}
            {transcript && (
              <div className="p-3 rounded-xl bg-[#000000] border border-[#1E1E26] font-mono text-xs text-[#8E8E93] space-y-1">
                <span className="text-[10px] text-[#FFFFFF] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Mic className="w-3 h-3 text-[#FFFFFF]" /> [ USER SPEECH INPUT ]
                </span>
                <p className="text-[#FFFFFF] italic font-mono">&quot;{transcript}&quot;</p>
              </div>
            )}

            {/* J.A.R.V.I.S. AI Briefing Output Box */}
            <div className="p-4 rounded-xl bg-[#000000] border border-[#383848] shadow-[0_0_20px_rgba(255,255,255,0.05)] space-y-2">
              <div className="flex items-center justify-between border-b border-[#1E1E26] pb-2 text-[10px] text-[#8E8E93] uppercase font-bold tracking-wider">
                <span className="flex items-center gap-1 text-[#FFFFFF]">
                  <Sparkles className="w-3 h-3 text-[#FFFFFF] animate-pulse" /> [ J.A.R.V.I.S. BRIEFING ]
                </span>
                <span>SYSTEM VOICE v2.4</span>
              </div>
              <p className="text-sm font-medium text-[#FFFFFF] text-glow leading-relaxed font-mono">
                {jarvisResponse || 'All APEXX core systems active. Speak "Hey APEX" or tap below for your complete daily protocol update.'}
              </p>
            </div>
          </div>

          {/* Voice Command Hints Pill */}
          <div className="relative z-10 flex items-center justify-between text-[10px] text-[#8E8E93] bg-[#000000] px-3 py-1.5 rounded-lg border border-[#1E1E26]">
            <span>VOICE CONTROLS:</span>
            <span className="text-[#FFFFFF] font-bold text-glow-sm">
              &quot;SHUT UP&quot; / &quot;STOP&quot; to silence | &quot;CONTINUE&quot; to resume | &quot;HEY APEX&quot; to query
            </span>
          </div>

          {/* Action Buttons Footer */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#1E1E26] font-mono text-xs">
            {isSpeaking ? (
              <button
                onClick={() => {
                  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                  }
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#000000] hover:bg-[#FF3B30] text-[#FFFFFF] border border-[#FF3B30] font-bold uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <X className="w-3.5 h-3.5 text-[#FFFFFF]" /> STOP SPEAKING (&quot;SHUT UP&quot;)
              </button>
            ) : (
              <button
                onClick={triggerVoiceBriefing}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#18181F] hover:bg-[#FFFFFF] text-[#FFFFFF] hover:text-[#000000] border border-[#383848] font-bold uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" /> BRIEFING (&quot;CONTINUE&quot;)
              </button>
            )}

            <button
              onClick={toggleListening}
              className={`px-4 py-2.5 rounded-xl border font-bold uppercase flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isListening
                  ? 'bg-[#000000] border-[#FFFFFF] text-[#FFFFFF] shadow-glow-white'
                  : 'bg-[#18181F] border-[#27272A] text-[#8E8E93] hover:text-[#FFFFFF]'
              }`}
            >
              {isListening ? <Mic className="w-3.5 h-3.5 text-[#FFFFFF] animate-pulse" /> : <MicOff className="w-3.5 h-3.5" />}
              {isListening ? 'MIC ACTIVE' : 'ENABLE MIC'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default JarvisVoiceHud;
