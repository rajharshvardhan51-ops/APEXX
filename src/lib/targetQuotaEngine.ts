import { GrowthLedgerEntry, HabitLogEntry } from '@/store/useApexStore';

export interface DailyMicroQuota {
  goalTitle: string;
  targetHorizonYears: number;
  dailyRequiredMins: number;
  dailyRequiredXp: number;
  tasks: {
    id: string;
    title: string;
    durationMins: number;
    xpReward: number;
    domain: 'DEV' | 'FITNESS' | 'MIND' | 'ACADEMICS';
  }[];
}

export interface WeeklyPerformanceDelta {
  targetWeeklyXp: number;
  actualWeeklyXp: number;
  targetWeeklyHours: number;
  actualWeeklyHours: number;
  deltaXp: number;
  deltaPercentage: number;
  isSurplus: boolean; // True if MORE work done than target, False if LESS
  formattedStatus: string;
  dailyBreakdown: {
    dayName: string;
    dateStr: string;
    targetXp: number;
    actualXp: number;
    isSurplus: boolean;
  }[];
}

/**
 * Generates specific daily micro-tasks & quotas tailored to the user's multi-year goal.
 */
export function generateDailyQuotaForGoal(
  macroAim: string = 'Software Backend Engineer',
  level: number = 1
): DailyMicroQuota {
  const goalLower = macroAim.toLowerCase();

  if (goalLower.includes('backend') || goalLower.includes('software') || goalLower.includes('developer') || goalLower.includes('engineer')) {
    return {
      goalTitle: macroAim || 'Software Backend Engineer',
      targetHorizonYears: 3,
      dailyRequiredMins: 135, // 2.25 hours daily
      dailyRequiredXp: 300,
      tasks: [
        {
          id: 'task-be-1',
          title: 'Core Backend Engineering (Node.js/PostgreSQL/Go API Microservices)',
          durationMins: 60,
          xpReward: 140,
          domain: 'DEV',
        },
        {
          id: 'task-be-2',
          title: 'Database Schema Design & Query Indexing Optimization',
          durationMins: 45,
          xpReward: 90,
          domain: 'DEV',
        },
        {
          id: 'task-be-3',
          title: 'DSA & System Architecture Problem Solving (1 LeetCode Medium)',
          durationMins: 30,
          xpReward: 70,
          domain: 'ACADEMICS',
        },
      ],
    };
  }

  if (goalLower.includes('ai') || goalLower.includes('data') || goalLower.includes('machine learning')) {
    return {
      goalTitle: macroAim || 'AI & Machine Learning Engineer',
      targetHorizonYears: 4,
      dailyRequiredMins: 150,
      dailyRequiredXp: 320,
      tasks: [
        {
          id: 'task-ai-1',
          title: 'Python Neural Networks & LLM Integration Architecture',
          durationMins: 60,
          xpReward: 140,
          domain: 'DEV',
        },
        {
          id: 'task-ai-2',
          title: 'Vector Embeddings & Database Retrieval Practice',
          durationMins: 45,
          xpReward: 100,
          domain: 'DEV',
        },
        {
          id: 'task-ai-3',
          title: 'Linear Algebra & Calculus Foundations for ML',
          durationMins: 45,
          xpReward: 80,
          domain: 'ACADEMICS',
        },
      ],
    };
  }

  // General default fallback
  return {
    goalTitle: macroAim || 'Software Engineer & Founder',
    targetHorizonYears: 3,
    dailyRequiredMins: 120,
    dailyRequiredXp: 250,
    tasks: [
      {
        id: 'task-gen-1',
        title: `Deep Work Focus Sprint for ${macroAim}`,
        durationMins: 60,
        xpReward: 130,
        domain: 'DEV',
      },
      {
        id: 'task-gen-2',
        title: 'Core Domain Learning & Technical Reading',
        durationMins: 30,
        xpReward: 70,
        domain: 'ACADEMICS',
      },
      {
        id: 'task-gen-3',
        title: 'Physical Conditioning & System Health Protocol',
        durationMins: 30,
        xpReward: 50,
        domain: 'FITNESS',
      },
    ],
  };
}

/**
 * Calculates weekly work done vs target quota and computes the delta percentage (More vs Less work done).
 */
export function calculateWeeklyWorkDelta(
  history: GrowthLedgerEntry[] = [],
  habitLogs: HabitLogEntry[] = [],
  targetDailyXp: number = 250
): WeeklyPerformanceDelta {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();

  const dailyBreakdown = [];
  let totalActualXp = 0;
  const targetWeeklyXp = targetDailyXp * 7;

  // Build 7-day past window (from 6 days ago to today)
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const dayName = daysOfWeek[d.getDay()];

    // Find record matching date
    const record = history.find((r) => r.date === dateStr);
    const actualXp = record ? record.xpEarned : 0;
    totalActualXp += actualXp;

    dailyBreakdown.push({
      dayName,
      dateStr,
      targetXp: targetDailyXp,
      actualXp,
      isSurplus: actualXp >= targetDailyXp,
    });
  }

  const deltaXp = totalActualXp - targetWeeklyXp;
  const deltaPercentage =
    targetWeeklyXp > 0 ? Math.round((Math.abs(deltaXp) / targetWeeklyXp) * 1000) / 10 : 0;
  const isSurplus = deltaXp >= 0;

  const actualWeeklyHours = Math.round((totalActualXp / 100) * 10) / 10;
  const targetWeeklyHours = Math.round((targetWeeklyXp / 100) * 10) / 10;

  let formattedStatus = '';
  if (isSurplus) {
    formattedStatus = `+${deltaPercentage}% MORE WORK DONE (+${actualWeeklyHours - targetWeeklyHours} HRS SURPLUS)`;
  } else {
    formattedStatus = `-${deltaPercentage}% LESS WORK DONE (-${targetWeeklyHours - actualWeeklyHours} HRS DEFICIT)`;
  }

  return {
    targetWeeklyXp,
    actualWeeklyXp: totalActualXp,
    targetWeeklyHours,
    actualWeeklyHours,
    deltaXp,
    deltaPercentage,
    isSurplus,
    formattedStatus,
    dailyBreakdown,
  };
}
