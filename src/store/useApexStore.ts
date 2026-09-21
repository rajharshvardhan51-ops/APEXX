import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { indexedDBStorageAdapter, enqueueSyncItem } from '@/lib/storageAdapter';

export type HeatmapStatusCode = 'UNLOGGED' | 'SLIP' | 'PARTIAL' | 'MASTERED';

export interface GrowthLedgerEntry {
  date: string; // YYYY-MM-DD
  completedQuestsCount: number;
  totalQuestsCount: number;
  consistencyScore: number; // 0 to 100
  statusCode: HeatmapStatusCode;
  xpEarned: number;
}

export interface XpEvent {
  amount: number;
  category?: string;
  isLevelUp: boolean;
  newLevel?: number;
  timestamp: number;
}

export interface HabitLogEntry {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  xpEarned: number;
  createdAt: string;
}

export interface ApexStoreState {
  // Profile State
  username: string;
  fullName: string;
  nickname: string;
  dateOfBirth: string;
  gender: string;
  honorific: string;
  avatarUrl: string;
  level: number;
  currentXp: number;
  xpToNextLevel: number;
  streak: number;
  currentTitle: string;
  equippedFrame: string;
  categoryXp: Record<string, number>;
  completedQuestIds: string[];
  habitLogs: HabitLogEntry[];
  lastXpEvent: XpEvent | null;

  // 4-Year Summit Horizon & Graduation State
  completionIndex: number;
  graduationCompletedMilestones: string[];

  // Day Rollover & Growth Ledger Lifecycle State
  lastActiveDate: string;
  dayCount: number;
  streakShields: number;
  growthLedgerHistory: GrowthLedgerEntry[];
  heatmapMatrix: Record<string, HeatmapStatusCode>;
  rolloverNotification: string | null;

  // Sound Engine Preferences
  soundEnabled: boolean;
  masterVolume: number;

  // Actions
  setUsername: (name: string) => void;
  setHonorific: (honorific: string) => void;
  setAvatarUrl: (url: string) => void;
  addXp: (amount: number, category?: string) => void;
  completeQuest: (questId: string, xpReward: number, domain?: string) => void;
  logHabit: (type: string, payload: Record<string, unknown>, xpReward: number) => void;
  equipTitle: (titleName: string) => void;
  setEquippedFrame: (frameSeed: string) => void;
  setStreak: (days: number) => void;
  clearXpEvent: () => void;
  setCompletionIndex: (index: number) => void;
  toggleGraduationMilestone: (milestoneId: string, xpReward: number) => void;
  updateDayRolloverState: (rolloverData: Partial<ApexStoreState>) => void;
  clearRolloverNotification: () => void;
  toggleSoundEnabled: () => void;
  setMasterVolume: (volume: number) => void;
  resetAllDataToZero: () => void;
}

export const useApexStore = create<ApexStoreState>()(
  persist(
    (set, get) => ({
      username: 'NEW OPERATIVE',
      fullName: '',
      nickname: '',
      dateOfBirth: '',
      gender: '',
      honorific: 'SIR',
      avatarUrl: '',
      level: 1,
      currentXp: 0,
      xpToNextLevel: 500, // Level 1 target: 500 XP
      streak: 0,
      currentTitle: 'INITIATE',
      equippedFrame: 'TITAN',
      categoryXp: {
        DEV: 0,
        FITNESS: 0,
        ACADEMICS: 0,
        HEALTH: 0,
        FINANCE: 0,
        MIND: 0,
        SOCIAL: 0,
        ARTS: 0,
        CULTURE: 0,
      },
      completedQuestIds: [],
      habitLogs: [],
      lastXpEvent: null,

      completionIndex: 0,
      graduationCompletedMilestones: [],

      lastActiveDate: new Date().toISOString().slice(0, 10),
      dayCount: 0,
      streakShields: 0,
      growthLedgerHistory: [],
      heatmapMatrix: {},
      rolloverNotification: null,

      soundEnabled: true,
      masterVolume: 0.5,

      setUsername: (name: string) => set({ username: name }),
      setHonorific: (honorific: string) => set({ honorific: honorific }),
      setAvatarUrl: (url: string) => set({ avatarUrl: url }),

      resetAllDataToZero: () => {
        set({
          username: 'NEW OPERATIVE',
          avatarUrl: '',
          level: 1,
          currentXp: 0,
          xpToNextLevel: 500,
          streak: 0,
          currentTitle: 'INITIATE',
          equippedFrame: 'TITAN',
          categoryXp: {
            DEV: 0,
            FITNESS: 0,
            ACADEMICS: 0,
            HEALTH: 0,
            FINANCE: 0,
            MIND: 0,
            SOCIAL: 0,
            ARTS: 0,
            CULTURE: 0,
          },
          completedQuestIds: [],
          habitLogs: [],
          lastXpEvent: null,
          completionIndex: 0,
          graduationCompletedMilestones: [],
          dayCount: 0,
          streakShields: 0,
          growthLedgerHistory: [],
          heatmapMatrix: {},
          rolloverNotification: null,
        });
      },

      addXp: (amount: number, category?: string) => {
        const state = get();
        let newXp = state.currentXp + amount;
        let newLevel = state.level;
        let currentTarget = newLevel * 500;
        let isLevelUp = false;

        if (newXp >= currentTarget) {
          newXp -= currentTarget;
          newLevel += 1;
          currentTarget = newLevel * 500;
          isLevelUp = true;
        }

        const updatedCategoryXp = { ...state.categoryXp };
        if (category) {
          updatedCategoryXp[category] = (updatedCategoryXp[category] || 0) + amount;
        }

        set({
          currentXp: newXp,
          level: newLevel,
          xpToNextLevel: currentTarget,
          categoryXp: updatedCategoryXp,
          lastXpEvent: {
            amount,
            category,
            isLevelUp,
            newLevel: isLevelUp ? newLevel : undefined,
            timestamp: Date.now(),
          },
        });

        // Enqueue offline write operation
        enqueueSyncItem('addXp', { amount, category, newLevel: isLevelUp ? newLevel : state.level });
      },

      completeQuest: (questId: string, xpReward: number, domain?: string) => {
        const state = get();
        if (state.completedQuestIds.includes(questId)) return;

        set({
          completedQuestIds: [...state.completedQuestIds, questId],
        });

        get().addXp(xpReward, domain);
        enqueueSyncItem('toggleQuest', { questId, xpReward, domain });
      },

      logHabit: (type: string, payload: Record<string, unknown>, xpReward: number) => {
        const newEntry: HabitLogEntry = {
          id: `habit-${Date.now()}`,
          type,
          payload,
          xpEarned: xpReward,
          createdAt: new Date().toISOString(),
        };

        set((s) => ({
          habitLogs: [newEntry, ...s.habitLogs],
        }));

        get().addXp(xpReward, type);
        enqueueSyncItem('logHabit', { type, payload, xpReward });
      },

      equipTitle: (titleName: string) => {
        set({ currentTitle: titleName });
      },

      setEquippedFrame: (frameSeed: string) => {
        set({ equippedFrame: frameSeed });
      },

      setStreak: (days: number) => {
        set({ streak: days });
      },

      clearXpEvent: () => {
        set({ lastXpEvent: null });
      },

      setCompletionIndex: (index: number) => {
        const val = Math.min(100, Math.max(0, index));
        set({ completionIndex: val });
        enqueueSyncItem('stateUpdate', { completionIndex: val });
      },

      toggleGraduationMilestone: (milestoneId: string, xpReward: number) => {
        const state = get();
        const existing = state.graduationCompletedMilestones || [];
        const isCompleted = existing.includes(milestoneId);

        let updatedMilestones: string[];
        if (isCompleted) {
          updatedMilestones = existing.filter((id) => id !== milestoneId);
        } else {
          updatedMilestones = [...existing, milestoneId];
          get().addXp(xpReward, 'DEV');
        }

        const totalMilestones = 32;
        const newCompletionIndex = Math.min(
          100,
          Number(((updatedMilestones.length / totalMilestones) * 100).toFixed(1))
        );

        set({
          graduationCompletedMilestones: updatedMilestones,
          completionIndex: newCompletionIndex,
        });

        enqueueSyncItem('toggleGraduationMilestone', { milestoneId, xpReward, isCompleted: !isCompleted });
      },

      updateDayRolloverState: (rolloverData: Partial<ApexStoreState>) => {
        set(rolloverData);
        enqueueSyncItem('dayRollover', rolloverData as Record<string, unknown>);
      },

      clearRolloverNotification: () => {
        set({ rolloverNotification: null });
      },

      toggleSoundEnabled: () => {
        set((s) => ({ soundEnabled: !s.soundEnabled }));
      },

      setMasterVolume: (volume: number) => {
        set({ masterVolume: Math.min(1, Math.max(0, volume)) });
      },
    }),
    {
      name: 'apexx_user_state',
      version: 2,
      storage: createJSONStorage(() => indexedDBStorageAdapter),
      migrate: (persistedState: any, version: number) => {
        // If coming from version 0 or 1 with old mock values (Level 42, 14200 DEV XP), reset everything to 0
        if (version < 2 || persistedState?.level === 42 || persistedState?.categoryXp?.DEV === 14200) {
          return {
            username: 'NEW OPERATIVE',
            level: 1,
            currentXp: 0,
            xpToNextLevel: 500,
            streak: 0,
            currentTitle: 'INITIATE',
            equippedFrame: 'TITAN',
            categoryXp: {
              DEV: 0,
              FITNESS: 0,
              ACADEMICS: 0,
              HEALTH: 0,
              FINANCE: 0,
              MIND: 0,
              SOCIAL: 0,
              ARTS: 0,
              CULTURE: 0,
            },
            completedQuestIds: [],
            habitLogs: [],
            lastXpEvent: null,
            completionIndex: 0,
            graduationCompletedMilestones: [],
            lastActiveDate: new Date().toISOString().slice(0, 10),
            dayCount: 0,
            streakShields: 0,
            growthLedgerHistory: [],
            heatmapMatrix: {},
            rolloverNotification: null,
            soundEnabled: true,
            masterVolume: 0.5,
          };
        }
        return persistedState;
      },
    }
  )
);

// Immediate safeguard check on store load: if legacy mock state detected, reset to 0 immediately
if (typeof window !== 'undefined') {
  setTimeout(() => {
    const currentState = useApexStore.getState();
    if (
      currentState.level === 42 ||
      currentState.categoryXp?.DEV === 14200 ||
      currentState.categoryXp?.FITNESS === 12400 ||
      currentState.streak === 18
    ) {
      console.log('[APEX Store] Legacy mock telemetry detected. Resetting all user data to 0.');
      currentState.resetAllDataToZero();
    }
  }, 100);
}




