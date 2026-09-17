import { useApexStore, HeatmapStatusCode, GrowthLedgerEntry } from '@/store/useApexStore';

/**
 * Returns the current local date formatted as YYYY-MM-DD
 */
export function getTodayLocalDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Evaluates heat-map status code based on daily consistency percentage
 */
export function getHeatmapStatusCode(consistencyScore: number): HeatmapStatusCode {
  if (consistencyScore === 0) return 'UNLOGGED';
  if (consistencyScore < 50) return 'SLIP';
  if (consistencyScore < 80) return 'PARTIAL';
  return 'MASTERED';
}

/**
 * Executes the Day Rollover logic when local midnight (00:00:00) is passed
 */
export function checkAndExecuteDayRollover(): boolean {
  if (typeof window === 'undefined') return false;

  const state = useApexStore.getState();
  const todayStr = getTodayLocalDateString();
  const lastDate = state.lastActiveDate;

  // If already initialized for today, skip
  if (lastDate === todayStr) {
    return false;
  }

  const completedQuestCount = state.completedQuestIds?.length || 0;
  const totalDailyQuests = 5; // Default 5 daily directive slots
  const consistencyScore = Math.min(
    100,
    Math.round((completedQuestCount / totalDailyQuests) * 100)
  );

  const statusCode = getHeatmapStatusCode(consistencyScore);
  const snapshotDate = lastDate || todayStr;

  // 1. Snapshot Creation for GrowthLedger & Heatmap Matrix
  const newLedgerEntry: GrowthLedgerEntry = {
    date: snapshotDate,
    completedQuestsCount: completedQuestCount,
    totalQuestsCount: totalDailyQuests,
    consistencyScore,
    statusCode,
    xpEarned: state.currentXp,
  };

  const updatedHistory = [newLedgerEntry, ...(state.growthLedgerHistory || [])];
  const updatedHeatmap = {
    ...(state.heatmapMatrix || {}),
    [snapshotDate]: statusCode,
  };

  // 2. Streak Maintenance Logic
  let newStreak = state.streak || 0;
  let newShields = state.streakShields ?? 1;
  let streakMessage = '';

  if (consistencyScore >= 80) {
    newStreak += 1;
    streakMessage = `STREAK EXTENDED: ${newStreak} DAYS`;
  } else if (completedQuestCount === 0) {
    if (newShields > 0) {
      newShields -= 1;
      streakMessage = `STREAK SHIELD ACTIVATED. STREAK FROZEN AT ${newStreak} DAYS.`;
    } else {
      newStreak = 0;
      streakMessage = `STREAK DECAY DETECTED. STREAK RESET TO 0.`;
    }
  } else {
    // Partial completion (1% - 79%) keeps streak intact
    streakMessage = `PARTIAL COMPLETION (${consistencyScore}%). STREAK MAINTAINED AT ${newStreak} DAYS.`;
  }

  const nextDayCount = (state.dayCount || 18) + 1;
  const notificationText = `SYSTEM CYCLE ROLLED. DAY ${nextDayCount} INITIALIZED. TELEMETRY CACHED. [${streakMessage}]`;

  // 3. Update Store State with Resetted Daily Missions & Rollover Snapshot
  state.updateDayRolloverState({
    lastActiveDate: todayStr,
    dayCount: nextDayCount,
    streak: newStreak,
    streakShields: newShields,
    completedQuestIds: [], // Clear daily mission completion checks
    growthLedgerHistory: updatedHistory,
    heatmapMatrix: updatedHeatmap,
    rolloverNotification: notificationText,
  });

  console.log(`[DayRolloverEngine] Rollover executed for ${todayStr}. Day ${nextDayCount} initialized.`);
  return true;
}

/**
 * Initializes listeners for midnight boundary detection, tab visibility, and window focus
 */
export function initDayRolloverEngine(): () => void {
  if (typeof window === 'undefined') return () => {};

  // Initial check on startup
  checkAndExecuteDayRollover();

  // Periodic interval check (every 60 seconds)
  const intervalId = setInterval(() => {
    checkAndExecuteDayRollover();
  }, 60000);

  // Tab reactivation / visibility change check
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      checkAndExecuteDayRollover();
    }
  };

  const handleWindowFocus = () => {
    checkAndExecuteDayRollover();
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('focus', handleWindowFocus);

  return () => {
    clearInterval(intervalId);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('focus', handleWindowFocus);
  };
}
