/**
 * APEXX Cyberpunk RPG Life OS & Telemetry Engine
 * Type Definitions & API Schemas
 */

export type DomainCategory = 'ENGINEERING' | 'FITNESS' | 'MIND' | 'ACADEMICS';

export type HabitType = 'GYM' | 'CODING' | 'READING' | 'DEEP_WORK';

export type RankTier =
  | 'Bronze Rookie'
  | 'Silver Operative'
  | 'Gold Specialist'
  | 'Platinum Sentinel'
  | 'Diamond Vanguard'
  | 'Sovereign Monarch';

// ------------------------------------------------------
// METRIC PAYLOAD DISCRIMINATED UNIONS
// ------------------------------------------------------

export interface GymMetricsPayload {
  weight?: number; // in kg
  reps?: number;
  sets?: number;
  exercise?: string;
  duration_mins?: number;
}

export interface CodingMetricsPayload {
  leetcode_id?: number;
  problem_slug?: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  lines_written?: number;
  duration_mins?: number;
  repo_pushed?: string;
}

export interface ReadingMetricsPayload {
  book_title?: string;
  pages_read?: number;
  key_learnings?: string[];
  duration_mins?: number;
}

export interface DeepWorkMetricsPayload {
  task_name?: string;
  focus_score?: number; // 0-100
  duration_mins?: number;
  interruptions_count?: number;
}

export type HabitMetricPayload =
  | GymMetricsPayload
  | CodingMetricsPayload
  | ReadingMetricsPayload
  | DeepWorkMetricsPayload
  | Record<string, unknown>;

export interface TargetMetricSpec {
  metric_name: string;
  target_value: number;
  unit: string;
  current_value?: number;
}

// ------------------------------------------------------
// ENTITY MODELS
// ------------------------------------------------------

export interface User {
  id: string;
  username: string;
  title: string;
  rank: RankTier | string;
  level: number;
  total_xp: number;
  current_streak: number;
  created_at: Date | string;
  updated_at: Date | string;

  // Optional relations
  macro_goals?: MacroGoal[];
  skill_nodes?: SkillNode[];
  daily_quests?: DailyQuest[];
  habit_logs?: HabitLog[];
  growth_metrics?: GrowthMetric[];
}

export interface MacroGoal {
  id: string;
  user_id: string;
  target_name: string;
  horizon_date: Date | string;
  target_metrics: TargetMetricSpec[] | Record<string, unknown>;
  created_at: Date | string;
  updated_at: Date | string;

  // Optional relations
  user?: User;
  skill_nodes?: SkillNode[];
}

export interface SkillNode {
  id: string;
  user_id: string;
  macro_goal_id: string;
  domain: DomainCategory;
  current_category_level: number;
  category_xp: number;
  created_at: Date | string;
  updated_at: Date | string;

  // Optional relations
  user?: User;
  macro_goal?: MacroGoal;
  daily_quests?: DailyQuest[];
}

export interface DailyQuest {
  id: string;
  user_id: string;
  skill_node_id: string;
  title: string;
  description?: string | null;
  domain_tag: DomainCategory;
  base_xp_reward: number;
  completion_status: boolean;
  scheduled_date: Date | string;
  created_at: Date | string;
  updated_at: Date | string;

  // Optional relations
  user?: User;
  skill_node?: SkillNode;
}

export interface HabitLog {
  id: string;
  user_id: string;
  type: HabitType;
  metric_payload: HabitMetricPayload;
  xp_gained: number;
  timestamp: Date | string;

  // Optional relations
  user?: User;
}

export interface GrowthMetric {
  id: string;
  user_id: string;
  date: Date | string;
  productivity_score: number; // 0 - 10
  mood_score: number; // 0 - 10
  total_focus_mins: number;
  consistency_percentage: number;
  created_at: Date | string;
  updated_at: Date | string;

  // Optional relations
  user?: User;
}

// ------------------------------------------------------
// API PAYLOADS & TELEMETRY DTOs
// ------------------------------------------------------

export interface SyncNodeReportPayload {
  user_id: string;
  report_date: string;
  quests_completed: string[]; // quest IDs
  habit_logs: Omit<HabitLog, 'id' | 'created_at' | 'updated_at'>[];
  productivity_score: number;
  mood_score: number;
  total_focus_mins: number;
}

export interface LevelUpEvent {
  user_id: string;
  old_level: number;
  new_level: number;
  old_rank: string;
  new_rank: string;
  unlocked_title?: string;
  total_xp: number;
  timestamp: string;
}

export interface DailyQuestCompletionPayload {
  quest_id: string;
  user_id: string;
  completed_at: string;
  xp_awarded: number;
}

export interface TelemetrySummary {
  user_id: string;
  current_level: number;
  current_xp: number;
  next_level_xp: number;
  xp_percentage: number;
  current_streak: number;
  title: string;
  rank: string;
  completed_quests_today: number;
  total_quests_today: number;
}
