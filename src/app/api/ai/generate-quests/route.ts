import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';

export interface GenerateQuestsInput {
  macroAim: string;
  collegeHours: string;
  currentPhase: string;
  fatigueLevel: number;
  recentCompletions?: string[];
}

export interface QuestOutput {
  title: string;
  domain: 'DEV' | 'FITNESS' | 'MIND' | 'ACADEMICS';
  targetDurationMins: number;
  xp: number;
  priority: 'CRITICAL' | 'OPTIONAL';
  tip: string;
}

export interface GenerateQuestsResponse {
  dailyDirective: string;
  quests: QuestOutput[];
}

// JSON Schema definition for Google Gen AI responseSchema
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    dailyDirective: {
      type: Type.STRING,
      description: 'Cold, tactical daily briefing and operational focus directive.',
    },
    quests: {
      type: Type.ARRAY,
      description: 'List of realistic tactical daily quests tailored to energy and schedule.',
      items: {
        type: Type.OBJECT,
        properties: {
          title: {
            type: Type.STRING,
            description: 'Clear, actionable title of the quest.',
          },
          domain: {
            type: Type.STRING,
            enum: ['DEV', 'FITNESS', 'MIND', 'ACADEMICS'],
            description: 'Domain category of the quest.',
          },
          targetDurationMins: {
            type: Type.INTEGER,
            description: 'Estimated target duration in minutes (15 to 90 mins).',
          },
          xp: {
            type: Type.INTEGER,
            description: 'Base XP reward calculated based on duration and difficulty.',
          },
          priority: {
            type: Type.STRING,
            enum: ['CRITICAL', 'OPTIONAL'],
            description: 'Operational priority tag.',
          },
          tip: {
            type: Type.STRING,
            description: 'Tactical execution tip or advice for maximum focus.',
          },
        },
        required: ['title', 'domain', 'targetDurationMins', 'xp', 'priority', 'tip'],
      },
    },
  },
  required: ['dailyDirective', 'quests'],
};

// Fallback quest generator when AI service is unconfigured or unavailable
function generateFallbackQuests(input: GenerateQuestsInput): GenerateQuestsResponse {
  const isHighFatigue = input.fatigueLevel > 7;

  const directive = isHighFatigue
    ? `TACTICAL REDIRECTION: ELEVATED FATIGUE DETECTED (${input.fatigueLevel}/10). SHIFTING OPERATIONS TO ACTIVE RECALL, LIGHT CODE REVIEWS, AND MOBILITY PROTOCOLS. MANDATORY COLLEGE BLOCK [${input.collegeHours}] RESPECTED.`
    : `OPTIMAL OPERATIONAL STATUS DETECTED (${input.fatigueLevel}/10 FATIGUE). EXECUTE HIGH-INTENSITY FOCUS ON ${input.macroAim.toUpperCase()}. RESPECTING COLLEGE HOURS [${input.collegeHours}].`;

  const quests: QuestOutput[] = isHighFatigue
    ? [
        {
          title: `Review Core Concepts for ${input.macroAim} (Active Recall Flashcards)`,
          domain: 'DEV',
          targetDurationMins: 30,
          xp: 150,
          priority: 'CRITICAL',
          tip: 'Use lightweight active recall instead of heavy coding to prevent burnout.',
        },
        {
          title: '30-Min Active Recovery, Hydration & Joint Mobility Session',
          domain: 'FITNESS',
          targetDurationMins: 30,
          xp: 120,
          priority: 'CRITICAL',
          tip: 'Focus on full-body mobility and deep breathing to drop fatigue index.',
        },
        {
          title: 'Organize Semester Notes & High-Yield Summary Review',
          domain: 'ACADEMICS',
          targetDurationMins: 25,
          xp: 100,
          priority: 'OPTIONAL',
          tip: 'Batch process lecture items into quick flashcards.',
        },
        {
          title: '15-Min Evening System Audit & Mindful Journaling',
          domain: 'MIND',
          targetDurationMins: 15,
          xp: 80,
          priority: 'OPTIONAL',
          tip: 'Reflect on wins and log energy telemetry before shutdown.',
        },
      ]
    : [
        {
          title: `Execute 60-Min Deep Work Coding Sprint for ${input.macroAim}`,
          domain: 'DEV',
          targetDurationMins: 60,
          xp: 350,
          priority: 'CRITICAL',
          tip: 'Block all distractions. Focus on single-threaded execution.',
        },
        {
          title: '45-Min High-Intensity Physical Workout Protocol',
          domain: 'FITNESS',
          targetDurationMins: 45,
          xp: 250,
          priority: 'CRITICAL',
          tip: 'Push progressive overload while maintaining strict form.',
        },
        {
          title: `Focus Study on ${input.currentPhase || 'Core Subjects'}`,
          domain: 'ACADEMICS',
          targetDurationMins: 45,
          xp: 200,
          priority: 'CRITICAL',
          tip: 'Apply the Feynman technique to key weak concepts.',
        },
        {
          title: '15-Min System Metric Audit & Daily Ledger Submission',
          domain: 'MIND',
          targetDurationMins: 15,
          xp: 100,
          priority: 'OPTIONAL',
          tip: 'Review consistency trend and update habit logs.',
        },
      ];

  return {
    dailyDirective: directive,
    quests,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body: GenerateQuestsInput = await req.json();

    const {
      macroAim = 'Java Full-Stack Developer',
      collegeHours = '8:00 AM - 4:00 PM',
      currentPhase = 'Core Computer Science & Fitness',
      fatigueLevel = 4,
      recentCompletions = [],
    } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    // Use fallback if API Key is not set
    if (!apiKey) {
      const fallbackData = generateFallbackQuests({
        macroAim,
        collegeHours,
        currentPhase,
        fatigueLevel,
        recentCompletions,
      });
      return NextResponse.json(fallbackData, { status: 200 });
    }

    // Initialize Google Gen AI SDK
    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `You are APEX AI CORE - Cold, tactical, high-efficiency personal life mentor.
Your task is to generate a tactical daily directive and a set of realistic quests for an ambitious operative.

STRICT CONSTRAINTS:
1. MANDATORY SCHEDULE: Respect college hours [${collegeHours}]. Do NOT generate impossible workloads during these hours.
2. FATIGUE ADAPTATION: Current Fatigue Level is [${fatigueLevel}/10].
   - If Fatigue > 7: Do NOT assign heavy building/hard coding or heavy lifting. Shift tasks to active recall/review, light refactoring, mobility/stretching, or low-friction reflection.
   - If Fatigue <= 7: Push for high-yield deep work sprints and progressive physical conditioning.
3. DOMAINS: Assign quests matching categories: DEV, FITNESS, MIND, ACADEMICS.
4. RECENT COMPLETIONS: Take into account recent progress: ${JSON.stringify(recentCompletions)}.
5. OUTPUT: Output MUST strictly be valid JSON matching the schema. Do not include markdown code blocks or conversational fluff.`;

    const userPrompt = `Generate today's tactical quest payload for:
- 4-Year Summit Aim: ${macroAim}
- Current Phase: ${currentPhase}
- College Hours: ${collegeHours}
- Fatigue Index: ${fatigueLevel}/10
- Recent Completions: ${recentCompletions.join(', ') || 'None'}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema,
        temperature: 0.3,
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Empty response received from GenAI SDK');
    }

    const parsedData: GenerateQuestsResponse = JSON.parse(responseText);
    return NextResponse.json(parsedData, { status: 200 });
  } catch (error: unknown) {
    console.error('Error generating AI quests:', error);

    // Fallback response on error
    const fallbackResponse = generateFallbackQuests({
      macroAim: 'Java Full-Stack Developer',
      collegeHours: '8:00 AM - 4:00 PM',
      currentPhase: 'Core Software Engineering',
      fatigueLevel: 5,
    });

    return NextResponse.json(fallbackResponse, { status: 200 });
  }
}
