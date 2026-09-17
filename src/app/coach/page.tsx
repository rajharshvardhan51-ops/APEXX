'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CoachChatLog, { ChatMessage } from '@/components/coach/CoachChatLog';
import PersonaSidebar, { PersonaId, personas } from '@/components/coach/PersonaSidebar';
import { Bot, Sparkles } from 'lucide-react';

import { useApexStore } from '@/store/useApexStore';

const initialMessages: ChatMessage[] = [
  {
    id: 'msg-0',
    sender: 'system',
    content: 'Database reset initialized. Zero-state telemetry active for new operative signup.',
    timestamp: '00:00:01',
  },
  {
    id: 'msg-1',
    sender: 'coach',
    personaName: 'Jarvis',
    content: 'Greetings, Operative. APEX AI Core online. All 4-year aim vectors, college schedules, and daily quest parameters are initialized. How may I optimize your trajectory today?',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  },
];

export default function CoachPage() {
  const [activePersonaId, setActivePersonaId] = useState<PersonaId>('jarvis');
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  const activePersona = personas.find((p) => p.id === activePersonaId) || personas[0];

  const generatePersonaResponse = (query: string, personaId: PersonaId): string => {
    const qLower = query.toLowerCase();
    const { level, currentXp, streak, username } = useApexStore.getState();

    if (personaId === 'jarvis') {
      if (qLower.includes('schedule') || qLower.includes('routine')) {
        return `Splendid initiative, ${username}. I have synthesized your college mandatory block (8:00 AM - 4:00 PM) with a 90-minute Deep Work Coding sprint at 5:30 PM, followed by a 45-minute hypertrophy workout. Directives queued in your Command Center.`;
      }
      if (qLower.includes('analyze') || qLower.includes('progress')) {
        return `Analyzing telemetry vectors... You are currently at Level ${level} with ${currentXp} XP and a ${streak}-day active matrix streak. Ready to push higher performance.`;
      }
      return `Understood, ${username}. I have cataloged "${query}". Recommendation: Execute a focused 25-minute sprint to maintain optimal momentum.`;
    }

    if (personaId === 'stern') {
      if (qLower.includes('schedule') || qLower.includes('routine')) {
        return 'Listen up. No delays. Your college hours are fixed. You get home at 4:30 PM, rest for 30 minutes, and hit your desk by 5:00 PM sharp. 2 hours of heavy Java coding, then gym. Move now.';
      }
      if (qLower.includes('analyze') || qLower.includes('progress')) {
        return `You logged ${streak} days streak at Level ${level}. Keep grinding and do not slip. Wipe out weakness today by locking in a 2-hour coding block.`;
      }
      return `Cut the idle talk. You asked: "${query}". Channel that energy directly into your daily quests before zero-day strikes.`;
    }

    if (personaId === 'supportive') {
      if (qLower.includes('schedule') || qLower.includes('routine')) {
        return 'You are doing amazing! Balancing college and deep work takes great discipline. Make sure to schedule short 5-minute break blocks and stay hydrated. You\'ve got this!';
      }
      if (qLower.includes('analyze') || qLower.includes('progress')) {
        return `Look at how far you've come! Level ${level} with ${currentXp} XP and ${streak} days of unbroken habit defense. Be proud of your hard work today!`;
      }
      return `I hear you! Regarding "${query}", remember to pace yourself with care. Consistent micro-habits build lifelong mastery!`;
    }

    // Logical Strategist
    if (qLower.includes('schedule') || qLower.includes('routine')) {
      return 'Mathematical optimization applied: Daily quota = 2x Coding Sprints (100 XP), 1x Workout Set (60 XP), 1x Reading Matrix (40 XP). Net daily return = 200 XP. Time efficiency index = 98.2%.';
    }
    if (qLower.includes('analyze') || qLower.includes('progress')) {
      return 'Telemetry Audit: Velocity = +1,220 XP/day. Linear trend projection indicates level-up event in 48.2 hours. Recommendation: Increase algorithmic problem density by +15%.';
    }
    return `Query processed: "${query}". Yield potential: High. Recommended action: Execute immediate Pomodoro sprint.`;
  };

  const handleSendMessage = (userQuery: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-u`,
      sender: 'user',
      content: userQuery,
      timestamp,
    };

    const coachResponseContent = generatePersonaResponse(userQuery, activePersonaId);

    const coachMsg: ChatMessage = {
      id: `msg-${Date.now()}-c`,
      sender: 'coach',
      personaName: activePersona.name,
      content: coachResponseContent,
      timestamp,
    };

    setMessages((prev) => [...prev, userMsg, coachMsg]);
  };

  const handleClearLogs = () => {
    setMessages([
      {
        id: `msg-${Date.now()}-s`,
        sender: 'system',
        content: 'Terminal log reset completed. System re-initialized.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-8 font-mono select-none">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0A0A0E] border border-[#1E1E26] rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.6)]"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-mono text-xs text-[#FFFFFF] font-bold tracking-widest uppercase">
            <Bot className="w-4 h-4 text-[#FFFFFF]" /> AI MENTOR TERMINAL & INTELLIGENCE CORE
          </div>
          <h1 className="text-2xl font-extrabold text-[#FFFFFF] font-sans">
            AI COACH TERMINAL <span className="text-[#8E8E93]">.OS</span>
          </h1>
        </div>

        <div className="flex items-center gap-2 bg-[#050507] px-3.5 py-2 rounded-lg border border-[#383848] text-xs text-[#FFFFFF] font-bold">
          <Sparkles className="w-4 h-4 text-[#FFFFFF]" /> ACTIVE MENTOR: [{activePersona.name.toUpperCase()}]
        </div>
      </motion.div>

      {/* Main Grid: Left 70% Terminal Chat Log & Right 30% Persona Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (70%): Terminal Chat Log */}
        <div className="lg:col-span-2">
          <CoachChatLog
            messages={messages}
            activePersonaName={activePersona.name}
            activePersonaId={activePersonaId}
            onSendMessage={handleSendMessage}
          />
        </div>

        {/* Right Column (30%): Persona Configuration Sidebar */}
        <div>
          <PersonaSidebar
            activePersonaId={activePersonaId}
            onSelectPersona={setActivePersonaId}
            onClearLogs={handleClearLogs}
          />
        </div>
      </div>
    </div>
  );
}
