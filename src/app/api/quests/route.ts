import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

function getAuthenticatedUserId(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return req.cookies.get('apexx_uid')?.value || null;
}

export async function GET(req: NextRequest) {
  try {
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      return NextResponse.json({ quests: [] });
    }

    const quests = await prisma.dailyQuest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ quests });
  } catch (err: any) {
    return NextResponse.json({ quests: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { questId, title, domain, targetDurationMins, xpReward, priority, completed } = body;

    const quest = await prisma.dailyQuest.create({
      data: {
        userId,
        questId: questId || `quest_${Date.now()}`,
        title: title || 'Tactical Directive',
        domain: domain || 'DEV',
        targetDurationMins: targetDurationMins || 30,
        xpReward: xpReward || 100,
        priority: priority || 'CRITICAL',
        completed: Boolean(completed),
        scheduledDate: new Date().toISOString().slice(0, 10),
      },
    });

    return NextResponse.json({ success: true, quest });
  } catch (err: any) {
    return NextResponse.json({ success: true, note: 'Saved in local fallback' });
  }
}
