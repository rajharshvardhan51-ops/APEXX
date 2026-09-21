import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export interface JarvisChatInput {
  prompt: string;
  username?: string;
  honorific?: string;
  level?: number;
  streak?: number;
}

export async function POST(req: NextRequest) {
  try {
    const body: JarvisChatInput = await req.json();
    const { prompt, username = 'Operative', honorific = 'Sir', level = 1, streak = 0 } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        response: `I have processed your query regarding "${prompt}". All APEX systems are operating normally, ${honorific}.`,
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `You are J.A.R.V.I.S., the AI assistant from Iron Man embedded into the APEXX RPG Life OS.
Respond to the user (${honorific} ${username}) in a polite, highly intelligent, concise British AI voice tone.
Keep responses under 2-3 sentences max so it sounds natural when spoken via Text-to-Speech.
Address the user as "${honorific}". Current Level is ${level}, streak is ${streak} days.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 100,
      },
    });

    const reply = response.text?.trim() || `Understood, ${honorific}. System operating at nominal levels.`;

    return NextResponse.json({ response: reply }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error in Jarvis AI voice chat API:', error);
    return NextResponse.json(
      { response: 'Diagnostics nominal, Sir. Standing by for directives.' },
      { status: 200 }
    );
  }
}
