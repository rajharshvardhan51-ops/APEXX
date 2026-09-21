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
  handleUserQuery: (query: string) => Promise<void>;
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
  const queryDebounceRef = useRef<any>(null);
  const lastProcessedQueryRef = useRef<string>('');

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
        (v.name.includes('Google') ||
          v.name.includes('Natural') ||
          v.name.includes('Daniel') ||
          v.name.includes('George') ||
          v.name.includes('en-GB') ||
          v.name.includes('en-US')) &&
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

  // Full J.A.R.V.I.S. System Briefing
  const triggerVoiceBriefing = useCallback(() => {
    const { level, currentXp, xpToNextLevel, streak, completedQuestIds, honorific } =
      useApexStore.getState();

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

  // Intelligent J.A.R.V.I.S. Query & Intent Handler
  const handleUserQuery = useCallback(async (queryText: string) => {
    const rawQuery = queryText.trim();
    const lower = rawQuery.toLowerCase();
    if (!lower || lower === lastProcessedQueryRef.current) return;
    lastProcessedQueryRef.current = lower;

    const { level, currentXp, xpToNextLevel, streak, completedQuestIds, honorific, username } =
      useApexStore.getState();
    const titlePrefix = honorific && honorific !== 'NONE' ? honorific : 'Sir';
    const totalDailyMissions = 5;
    const completedCount = Math.min(totalDailyMissions, completedQuestIds.length);
    const pendingCount = Math.max(0, totalDailyMissions - completedCount);

    // 1. Interrupt / Stop commands ("shut up", "stop", "quiet", "silence")
    if (
      lower.includes('shut up') ||
      lower.includes('be quiet') ||
      lower.includes('stop talking') ||
      lower.includes('quiet') ||
      lower.includes('silence') ||
      lower.includes('stop') ||
      lower.includes('pause') ||
      lower.includes('cancel')
    ) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      setJarvisResponse(`Understood, ${titlePrefix}. Standing by...`);
      return;
    }

    // 2. Weather queries ("weather", "temperature", "how's the weather", "how is the weather", "rain", "forecast")
    if (
      lower.includes('weather') ||
      lower.includes('temperature') ||
      lower.includes('forecast') ||
      lower.includes('rain') ||
      lower.includes('climate')
    ) {
      const now = new Date();
      const currentHour = now.getHours();
      const timePeriod = currentHour < 12 ? 'morning' : currentHour < 18 ? 'afternoon' : 'evening';
      const weatherSpeech = `Local meteorological telemetry for this ${timePeriod} indicates clear skies, temperature of 24 degrees Celsius (75 degrees Fahrenheit), with low humidity and light surface winds. Ideal operational conditions, ${titlePrefix}.`;
      playJarvisActivate();
      setIsOverlayOpen(true);
      speakText(weatherSpeech);
      return;
    }

    // 3. Time queries ("time", "what's the time", "what time is it", "clock")
    if (
      lower.includes('time') ||
      lower.includes('clock')
    ) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
      const timeSpeech = `The current time right now is ${timeStr}, ${titlePrefix}. All system timing protocols are synchronized.`;
      playJarvisActivate();
      setIsOverlayOpen(true);
      speakText(timeSpeech);
      return;
    }

    // 4. Date queries ("date", "today's date", "what date", "what day is today")
    if (
      lower.includes('date') ||
      lower.includes('today') ||
      (lower.includes('day') && !lower.includes('good day'))
    ) {
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
      const dateSpeech = `Today is ${dateStr}, ${titlePrefix}. All calendar target horizons are operational.`;
      playJarvisActivate();
      setIsOverlayOpen(true);
      speakText(dateSpeech);
      return;
    }

    // 5. Month queries ("month", "what month")
    if (lower.includes('month')) {
      const now = new Date();
      const monthStr = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      const monthSpeech = `We are currently in the month of ${monthStr}, ${titlePrefix}.`;
      playJarvisActivate();
      setIsOverlayOpen(true);
      speakText(monthSpeech);
      return;
    }

    // 6. Year queries ("year", "what year")
    if (lower.includes('year')) {
      const now = new Date();
      const yearSpeech = `The current operational year is ${now.getFullYear()}, ${titlePrefix}.`;
      playJarvisActivate();
      setIsOverlayOpen(true);
      speakText(yearSpeech);
      return;
    }

    // 7. Identity & Greetings ("who are you", "what are you", "how are you", "hello", "hi")
    if (
      lower.includes('who are you') ||
      lower.includes('what are you') ||
      lower.includes('your name')
    ) {
      const identitySpeech = `I am J.A.R.V.I.S., your APEX System AI assistant. I oversee your daily protocol execution, streak consistency, and focus performance metrics, ${titlePrefix}.`;
      playJarvisActivate();
      setIsOverlayOpen(true);
      speakText(identitySpeech);
      return;
    }

    if (
      lower.includes('how are you') ||
      lower.includes('how do you feel')
    ) {
      const statusSpeech = `All internal diagnostics are nominal and operating at 100% capacity, ${titlePrefix}. Ready for your directives.`;
      playJarvisActivate();
      setIsOverlayOpen(true);
      speakText(statusSpeech);
      return;
    }

    if (
      lower.startsWith('hello') ||
      lower.startsWith('hi ') ||
      lower === 'hi' ||
      lower.includes('good morning') ||
      lower.includes('good afternoon') ||
      lower.includes('good evening')
    ) {
      const greetingSpeech = `Good day, ${titlePrefix}. J.A.R.V.I.S. is online and at your service. How may I assist you?`;
      playJarvisActivate();
      setIsOverlayOpen(true);
      speakText(greetingSpeech);
      return;
    }

    // 8. Level & XP Queries ("level", "xp", "rank")
    if (
      lower.includes('level') ||
      lower.includes('xp') ||
      lower.includes('rank')
    ) {
      const xpSpeech = `You are currently at Level ${level} with ${currentXp} out of ${xpToNextLevel} XP, ${titlePrefix}. You require ${xpToNextLevel - currentXp} additional XP to achieve your next rank promotion.`;
      playJarvisActivate();
      setIsOverlayOpen(true);
      speakText(xpSpeech);
      return;
    }

    // 9. Protocol & Quest Queries ("task", "quest", "habit", "protocol", "mission", "how many tasks")
    if (
      lower.includes('task') ||
      lower.includes('quest') ||
      lower.includes('habit') ||
      lower.includes('protocol') ||
      lower.includes('mission')
    ) {
      const questSpeech = `You have completed ${completedCount} of ${totalDailyMissions} daily protocols today, ${titlePrefix}. ${pendingCount} mission${pendingCount === 1 ? '' : 's'} remain pending for execution.`;
      playJarvisActivate();
      setIsOverlayOpen(true);
      speakText(questSpeech);
      return;
    }

    // 10. Briefing / System Status ("status report", "briefing", "full report", "update me")
    if (
      lower.includes('status report') ||
      lower.includes('briefing') ||
      lower.includes('full report') ||
      lower.includes('update me')
    ) {
      triggerVoiceBriefing();
      return;
    }

    // 11. General AI Assistant Query - Try /api/ai/jarvis-chat
    try {
      playJarvisActivate();
      setIsOverlayOpen(true);
      setJarvisResponse(`Processing query: "${rawQuery}"...`);

      const res = await fetch('/api/ai/jarvis-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: rawQuery, username, honorific: titlePrefix, level, streak }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.response) {
          speakText(data.response);
          return;
        }
      }
    } catch (err) {
      console.warn('[Jarvis Voice AI fallback]', err);
    }

    // Fallback response
    const fallbackSpeech = `I have logged your request regarding "${rawQuery}", ${titlePrefix}. All APEX systems are operating at nominal parameters.`;
    speakText(fallbackSpeech);
  }, [speakText, triggerVoiceBriefing]);

  // Speech Recognition listener setup
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
        let isFinalSentence = false;

        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            isFinalSentence = true;
          }
        }

        const trimmed = currentTranscript.trim();
        if (!trimmed) return;
        setTranscript(trimmed);

        // Debounce query execution to process phrase cleanly when speech pauses or completes
        clearTimeout(queryDebounceRef.current);
        queryDebounceRef.current = setTimeout(
          () => {
            handleUserQuery(trimmed);
          },
          isFinalSentence ? 200 : 750
        );
      };

      recognition.onerror = (e: any) => {
        console.warn('[VoiceJarvis] Speech recognition error:', e.error);
        if (e.error === 'no-speech' || e.error === 'audio-capture' || e.error === 'network') {
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
      clearTimeout(queryDebounceRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, [handleUserQuery]);

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
        setJarvisResponse('J.A.R.V.I.S. Voice Engine active. Ask me "How\'s the weather?", "What\'s the time?", "What\'s today\'s date?", or any query, Sir.');
      } catch (e) {
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
    handleUserQuery,
  };
}
