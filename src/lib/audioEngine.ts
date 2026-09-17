import { useApexStore } from '@/store/useApexStore';

let audioCtx: AudioContext | null = null;

/**
 * Lazy-loads or resumes the global Web Audio API AudioContext instance
 */
function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;

  if (!audioCtx) {
    const AudioCtxClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

    if (AudioCtxClass) {
      audioCtx = new AudioCtxClass();
    }
  }

  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }

  return audioCtx;
}

/**
 * Calculates current gain output based on sound settings in useApexStore
 */
function getEffectiveMasterVolume(): number {
  const { soundEnabled, masterVolume } = useApexStore.getState();
  if (!soundEnabled) return 0;
  return Math.min(1, Math.max(0, masterVolume ?? 0.5));
}

/**
 * 1. playTerminalClick()
 * Short high-frequency burst (800Hz to 1200Hz, 15ms duration, subtle bandpass filter).
 * Used for checkbox ticks, tab switches, and button presses.
 */
export function playTerminalClick(): void {
  const volume = getEffectiveMasterVolume();
  if (volume <= 0) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.015);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1000, now);
    filter.Q.setValueAtTime(3, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.15 * volume, now + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.018);
  } catch (e) {
    // Audio Context policy swallow
  }
}

/**
 * 2. playQuestComplete()
 * Dual-tone ascending synth beep (520Hz -> 1040Hz over 80ms with exponential decay).
 * Used when checking off a daily mission or logging an exercise set.
 */
export function playQuestComplete(): void {
  const volume = getEffectiveMasterVolume();
  if (volume <= 0) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    // Tone 1: 520Hz
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(520, now);
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.12 * volume, now + 0.005);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.045);

    // Tone 2: 1040Hz (staggered by 40ms)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1040, now + 0.04);
    gain2.gain.setValueAtTime(0, now + 0.04);
    gain2.gain.linearRampToValueAtTime(0.18 * volume, now + 0.045);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.04);
    osc2.stop(now + 0.085);
  } catch (e) {
    // Audio Context policy swallow
  }
}

/**
 * 3. playLevelUp()
 * Resonant harmonic chord (cybernetic triad: 440Hz, 554.37Hz, 659.25Hz with 600ms reverb tail).
 * Used on rank elevations and title unlocks.
 */
export function playLevelUp(): void {
  const volume = getEffectiveMasterVolume();
  if (volume <= 0) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const frequencies = [440.0, 554.37, 659.25, 880.0];

    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0, now + idx * 0.06);
      gain.gain.linearRampToValueAtTime(0.1 * volume, now + idx * 0.06 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.65);
    });
  } catch (e) {
    // Audio Context policy swallow
  }
}

/**
 * 4. playTimerChime()
 * Gentle, non-jarring bell tone for deep-work focus interval completion.
 */
export function playTimerChime(): void {
  const volume = getEffectiveMasterVolume();
  if (volume <= 0) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(659.25, now); // E5 warm bell tone
    osc.frequency.exponentialRampToValueAtTime(523.25, now + 0.8);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.2 * volume, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 1.25);
  } catch (e) {
    // Audio Context policy swallow
  }
}
