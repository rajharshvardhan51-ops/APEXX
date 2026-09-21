'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useApexStore } from '@/store/useApexStore';
import { playJarvisActivate } from '@/lib/audioEngine';

export interface VoiceJarvisState {
  isSupported: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  isOverlayOpen: boolean;
  transcript: string;
  jarvisResponse: string;
  toggleListening: () => void;
  triggerVoiceBriefing: () => void;
  closeOverlay: () => void;
  speakText: (text: string) => void;
}

export function useVoiceJarvis(): VoiceJarvisState {
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [jarvisResponse, setJarvisResponse] = useState('');

  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef<boolean>(false);
  const restartTimeoutRef = useRef<any>(null);

  // Sync ref with state
  const setListeningState = (active: boolean) => {
    isListeningRef.current = active;
    setIsListening(active);
  };

  // Function to synthesize speech output (J.A.R.V.I.S. voice)
  const speakText = useCallback((text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // Stop any active speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 0.95; // Slightly deeper, crisp analytical voice tone
    utterance.volume = 1.0;

    // Try to select a natural English male/UK/US voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) =>
        (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Daniel') || v.name.includes('George') || v.name.includes('en-GB') || v.name.includes('en-US')) &&
        v.lang.startsWith('en')
    ) || voices.find((v) => v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setJarvisResponse(text);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }, []);

  // Generate J.A.R.V.I.S. System Briefing
  const triggerVoiceBriefing = useCallback(() => {
    const { level, currentXp, xpToNextLevel, streak, completedQuestIds, honorific } = useApexStore.getState();

    const titlePrefix = honorific && honorific !== 'NONE' ? honorific : 'Sir';
    const totalDailyMissions = 5;
    const completedCount = Math.min(totalDailyMissions, completedQuestIds.length);
    const pendingCount = Math.max(0, totalDailyMissions - completedCount);
    const syncPercentage = streak > 0 ? '94.8 percent' : '0 percent';

    let speech = `Good day, ${titlePrefix}. All APEXX core systems are online and operational. `;
    speech += `You are currently at Level ${level} with ${currentXp} out of ${xpToNextLevel} XP. `;
    
    if (completedCount === totalDailyMissions) {
      speech += `Outstanding work, ${titlePrefix}. All ${totalDailyMissions} daily protocols are fully executed and completed. `;
    } else {
      speech += `You have completed ${completedCount} of ${totalDailyMissions} daily protocols today. `;
      speech += `${pendingCount} mission${pendingCount === 1 ? '' : 's'} remain pending for completion. `;
    }

    speech += `Your active neural sync rate stands at ${syncPercentage}. I am monitoring all metrics continuously.`;

    playJarvisActivate();
    setIsOverlayOpen(true);
    speakText(speech);
  }, [speakText]);

  // Speech Recognition listener setup - run once on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);

    try {
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }

        const lower = currentTranscript.trim().toLowerCase();
        if (!lower) return;
        setTranscript(currentTranscript);

        // 1. Human-to-Human Interrupt / Stop commands ("shut up", "stop", "quiet", "silence")
        if (
          lower.includes('shut up') ||
          lower.includes('be quiet') ||
          lower.includes('stop talking') ||
          lower.includes('quiet') ||
          lower.includes('silence') ||
          lower.includes('stop') ||
          lower.includes('pause') ||
          lower.includes('hold on') ||
          lower.includes('cancel')
        ) {
          if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
          }
          setIsSpeaking(false);
          const { honorific } = useApexStore.getState();
          const titlePrefix = honorific && honorific !== 'NONE' ? honorific : 'Sir';
          setJarvisResponse(`Understood, ${titlePrefix}. Standing by...`);
          return;
        }

        // 2. Resume / Continue commands ("continue", "resume", "go on", "keep going")
        if (
          lower.includes('continue') ||
          lower.includes('resume') ||
          lower.includes('go on') ||
          lower.includes('keep going') ||
          lower.includes('proceed') ||
          lower.includes('tell me more')
        ) {
          triggerVoiceBriefing();
          return;
        }

        // 3. Wake words & query triggers ("hey apex", "apex", "status report", "tasks left")
        if (
          lower.includes('hey apex') ||
          lower.includes('hey jarvis') ||
          lower.includes('apex') ||
          lower.includes('jarvis') ||
          lower.includes('status report') ||
          lower.includes('how many tasks') ||
          lower.includes('what is my status') ||
          lower.includes('update me')
        ) {
          triggerVoiceBriefing();
        }
      };

      recognition.onerror = (e: any) => {
        console.warn('[VoiceJarvis] Speech recognition event error:', e.error);
        if (e.error === 'no-speech' || e.error === 'audio-capture' || e.error === 'network') {
          // Keep listening active despite temporary network/silence glitches
          if (isListeningRef.current) {
            clearTimeout(restartTimeoutRef.current);
            restartTimeoutRef.current = setTimeout(() => {
              if (isListeningRef.current && recognitionRef.current) {
                try {
                  recognitionRef.current.start();
                } catch (err) {}
              }
            }, 300);
          }
        } else if (e.error === 'not-allowed') {
          setListeningState(false);
          alert('Microphone permission denied. Please allow microphone access in your browser settings.');
        }
      };

      recognition.onend = () => {
        // Continuous listening auto-restart if state is active
        if (isListeningRef.current) {
          clearTimeout(restartTimeoutRef.current);
          restartTimeoutRef.current = setTimeout(() => {
            if (isListeningRef.current && recognitionRef.current) {
              try {
                recognitionRef.current.start();
              } catch (err) {}
            }
          }, 250);
        }
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.warn('[VoiceJarvis] Failed to initialize SpeechRecognition:', err);
    }

    return () => {
      clearTimeout(restartTimeoutRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, [triggerVoiceBriefing]);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) {
      alert('Speech Recognition is not supported by your browser. Please use Google Chrome, Edge, or Brave.');
      return;
    }

    if (isListeningRef.current) {
      setListeningState(false);
      clearTimeout(restartTimeoutRef.current);
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    } else {
      setListeningState(true);
      try {
        recognitionRef.current.start();
        playJarvisActivate();
        setIsOverlayOpen(true);
        setJarvisResponse('J.A.R.V.I.S. Voice Engine active and listening. Say "Hey APEX" or "Status Report" anytime.');
      } catch (e) {
        // If already started or restarting
        console.warn('[VoiceJarvis] Start attempt:', e);
      }
    }
  }, []);

  const closeOverlay = useCallback(() => {
    setIsOverlayOpen(false);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  return {
    isSupported,
    isListening,
    isSpeaking,
    isOverlayOpen,
    transcript,
    jarvisResponse,
    toggleListening,
    triggerVoiceBriefing,
    closeOverlay,
    speakText,
  };
}

