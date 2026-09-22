'use client';

import React from 'react';
import { Bot, Trash2, Key, Sparkles, ShieldAlert, Heart, Activity, Check } from 'lucide-react';

export type PersonaId = 'jarvis' | 'stern' | 'supportive' | 'logical';

export interface PersonaConfig {
  id: PersonaId;
  name: string;
  tagline: string;
  description: string;
  icon: typeof Bot;
  color: string;
}

export const personas: PersonaConfig[] = [
  {
    id: 'jarvis',
    name: 'Jarvis',
    tagline: 'Analytical, smooth, ultra-polite',
    description: 'High-precision telemetry analysis delivered with impeccably polite military efficiency.',
    icon: Bot,
    color: '#FFFFFF',
  },
  {
    id: 'stern',
    name: 'Stern Master',
    tagline: 'Direct, tough love, high discipline',
    description: 'Zero excuses. Unforgiving accountability designed to push past fatigue thresholds.',
    icon: ShieldAlert,
    color: '#E4E4E7',
  },
  {
    id: 'supportive',
    name: 'Supportive Mentor',
    tagline: 'Empathetic, positive, kind',
    description: 'Constructive encouragement prioritizing mental resilience and sustainable pace.',
    icon: Heart,
    color: '#D4D4D8',
  },
  {
    id: 'logical',
    name: 'Logical Strategist',
    tagline: 'Mathematical, optimizes patterns',
    description: 'Cold algorithmic optimization focusing on mathematical yield and efficiency vectors.',
    icon: Activity,
    color: '#A1A1AA',
  },
];

interface PersonaSidebarProps {
  activePersonaId: PersonaId;
  onSelectPersona: (id: PersonaId) => void;
  onClearLogs: () => void;
}

export const PersonaSidebar: React.FC<PersonaSidebarProps> = ({
  activePersonaId,
  onSelectPersona,
  onClearLogs,
}) => {
  return (
    <div className="bg-[#0A0A0E] border border-[#1E1E26] rounded-xl p-4 sm:p-5 shadow-[0_4px_25px_rgba(0,0,0,0.8)] space-y-5 font-mono select-none flex flex-col justify-between h-auto lg:h-[640px]">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2 border-b border-[#1E1E26] pb-3">
          <Sparkles className="w-4 h-4 text-[#FFFFFF]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#FFFFFF]">
            COACH CONFIGURATION & PERSONAS
          </h3>
        </div>

        {/* Persona Cards List */}
        <div className="space-y-2.5">
          {personas.map((p) => {
            const Icon = p.icon;
            const isActive = activePersonaId === p.id;

            return (
              <button
                key={p.id}
                onClick={() => onSelectPersona(p.id)}
                className={`w-full p-3 rounded-xl border text-left flex flex-col space-y-1 transition-all duration-200 ${
                  isActive
                    ? 'bg-[#18181F] border-[#FFFFFF] shadow-[0_0_12px_rgba(255,255,255,0.15)]'
                    : 'bg-[#050507] border-[#1E1E26] hover:border-[#383848]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5 text-[#FFFFFF]" />
                    <span className={`text-xs font-bold ${isActive ? 'text-[#FFFFFF]' : 'text-[#8E8E93]'}`}>
                      {p.name}
                    </span>
                  </div>

                  {isActive && <Check className="w-3.5 h-3.5 text-[#FFFFFF]" />}
                </div>

                <span className="text-[9px] text-[#8E8E93] uppercase tracking-wider font-semibold">
                  {p.tagline}
                </span>
                <p className="text-[10px] text-[#8E8E93] leading-snug line-clamp-2">
                  {p.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Action Controls & Offline Fallback Pill */}
      <div className="space-y-3 pt-3 border-t border-[#1E1E26]">
        {/* Clear Logs Button */}
        <button
          onClick={onClearLogs}
          className="w-full py-2 rounded-lg bg-[#050507] hover:bg-[#18181F] border border-[#1E1E26] hover:border-[#383848] text-[#FFFFFF] font-mono text-xs font-bold uppercase flex items-center justify-center gap-2 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5 text-[#8E8E93]" /> CLEAR TERMINAL LOGS
        </button>

        {/* Offline Fallback Notification Pill */}
        <div className="p-3 rounded-lg bg-[#050507] border border-[#1E1E26] text-[10px] text-[#8E8E93] flex items-start gap-2">
          <Key className="w-3.5 h-3.5 text-[#FFFFFF] shrink-0 mt-0.5" />
          <span>
            <strong className="text-[#FFFFFF]">Offline fallback active:</strong> Configure your Gemini API key in System Settings for live AI responses.
          </span>
        </div>
      </div>
    </div>
  );
};

export default PersonaSidebar;
