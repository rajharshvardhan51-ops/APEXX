'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Send, Bot, User, Cpu } from 'lucide-react';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'coach' | 'system';
  personaName?: string;
  content: string;
  timestamp: string;
}

interface CoachChatLogProps {
  messages: ChatMessage[];
  activePersonaName: string;
  activePersonaId?: string;
  onSendMessage: (query: string) => void;
}

export const CoachChatLog: React.FC<CoachChatLogProps> = ({
  messages,
  activePersonaName,
  activePersonaId: _activePersonaId,
  onSendMessage,
}) => {
  const [activeTab, setActiveTab] = useState<'CHAT' | 'PREDICTIVE'>('CHAT');
  const [inputQuery, setInputQuery] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;
    onSendMessage(inputQuery.trim());
    setInputQuery('');
  };

  return (
    <div className="bg-[#0A0A0E] border border-[#1E1E26] rounded-xl p-5 shadow-[0_4px_25px_rgba(0,0,0,0.8)] space-y-4 font-mono flex flex-col h-[640px]">
      {/* Terminal Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E1E26] pb-3 shrink-0">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#FFFFFF]" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#FFFFFF]">
            AI COACH TERMINAL // ACTIVE SYNC STATUS
          </h2>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setActiveTab('CHAT')}
            className={`px-3 py-1 rounded font-bold transition-all ${
              activeTab === 'CHAT'
                ? 'bg-[#18181F] text-[#FFFFFF] border border-[#383848] shadow-[0_0_8px_rgba(255,255,255,0.15)]'
                : 'bg-[#050507] text-[#8E8E93] border border-[#1E1E26] hover:text-[#FFFFFF]'
            }`}
          >
            [INTERACTIVE CHAT]
          </button>

          <button
            onClick={() => setActiveTab('PREDICTIVE')}
            className={`px-3 py-1 rounded font-bold transition-all ${
              activeTab === 'PREDICTIVE'
                ? 'bg-[#18181F] text-[#FFFFFF] border border-[#383848] shadow-[0_0_8px_rgba(255,255,255,0.15)]'
                : 'bg-[#050507] text-[#8E8E93] border border-[#1E1E26] hover:text-[#FFFFFF]'
            }`}
          >
            [PREDICTIVE MODELS]
          </button>
        </div>
      </div>

      {/* Main Terminal Window Body */}
      {activeTab === 'CHAT' ? (
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 bg-[#050507] p-4 rounded-lg border border-[#1E1E26] custom-scrollbar">
          {messages.map((msg) => {
            if (msg.sender === 'system') {
              return (
                <div
                  key={msg.id}
                  className="p-2.5 rounded bg-[#1E1E26]/40 border border-[#1E1E26] text-[11px] text-[#8E8E93] flex items-center justify-between"
                >
                  <span>&gt; {msg.content}</span>
                  <span className="text-[9px] text-[#8E8E93]">{msg.timestamp}</span>
                </div>
              );
            }

            if (msg.sender === 'user') {
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-col items-end space-y-1"
                >
                  <div className="flex items-center gap-1.5 text-[10px] text-[#E4E4E7] font-bold">
                    <span>USER // SYSTEM INPUT</span>
                    <User className="w-3 h-3 text-[#FFFFFF]" />
                  </div>
                  <div className="bg-[#18181F] border border-[#383848] text-[#FFFFFF] p-3 rounded-xl rounded-tr-none max-w-lg text-xs leading-relaxed shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                    {msg.content}
                  </div>
                  <span className="text-[9px] text-[#8E8E93]">{msg.timestamp}</span>
                </motion.div>
              );
            }

            // Coach AI Response Bubble
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col items-start space-y-1"
              >
                <div className="flex items-center gap-1.5 text-[10px] text-[#FFFFFF] font-bold">
                  <Bot className="w-3 h-3 text-[#FFFFFF]" />
                  <span>[{msg.personaName?.toUpperCase() || 'JARVIS'} TELEMETRY LOG]</span>
                </div>
                <div className="bg-[#0A0A0E] border border-[#383848] text-[#FFFFFF] p-3.5 rounded-xl rounded-tl-none max-w-xl text-xs leading-relaxed shadow-[0_0_12px_rgba(255,255,255,0.1)] space-y-2">
                  <div className="text-[10px] text-[#E4E4E7] font-bold uppercase tracking-wider border-b border-[#1E1E26] pb-1 flex items-center justify-between">
                    <span>STATUS: DIRECTIVE GENERATED</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFFFFF] animate-pulse" />
                  </div>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
                <span className="text-[9px] text-[#8E8E93]">{msg.timestamp}</span>
              </motion.div>
            );
          })}
          <div ref={chatEndRef} />
        </div>
      ) : (
        /* Predictive Models Tab Panel */
        <div className="flex-1 bg-[#050507] p-5 rounded-lg border border-[#1E1E26] space-y-4 overflow-y-auto">
          <div className="flex items-center gap-2 text-xs font-bold text-[#FFFFFF] border-b border-[#1E1E26] pb-3">
            <Cpu className="w-4 h-4 text-[#FFFFFF]" /> PREDICTIVE FATIGUE & RECURSIVE GOAL SIMULATOR
          </div>
          <p className="text-xs text-[#8E8E93]">
            AI Core predictive models analyze weekly energy vectors to forecast optimal sprint blocks for the upcoming 7 days.
          </p>

          <div className="p-4 rounded-lg bg-[#0A0A0E] border border-[#1E1E26] space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-[#FFFFFF]">ESTIMATED 4-WEEK SUMMIT PROGRESSION</span>
              <span className="text-[#FFFFFF]">+18.4% LEVEL BOOST</span>
            </div>
            <div className="h-2 w-full bg-[#050507] rounded-full border border-[#1E1E26] overflow-hidden">
              <div className="h-full bg-[#FFFFFF] w-3/4 shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
            </div>
          </div>
        </div>
      )}

      {/* Terminal Input Line Bar */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 shrink-0 pt-1">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FFFFFF] font-bold text-xs">
            &gt;
          </span>
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={`Query ${activePersonaName}... (e.g. "Create my weekly schedule" or "Analyze my progress")`}
            className="w-full bg-[#050507] border border-[#1E1E26] focus:border-[#FFFFFF] rounded-lg pl-7 pr-4 py-2.5 text-xs text-[#FFFFFF] placeholder-[#8E8E93] focus:outline-none transition-colors shadow-inner"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2.5 rounded-lg bg-[#FFFFFF] hover:bg-[#E4E4E7] text-[#000000] font-bold text-xs uppercase flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)]"
        >
          <Send className="w-3.5 h-3.5 fill-current" /> SEND
        </button>
      </form>
    </div>
  );
};

export default CoachChatLog;
