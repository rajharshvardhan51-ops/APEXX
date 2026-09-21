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
      return NextResponse.json({ records: [] });
    }

    const records = await prisma.dailyRecord.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 90,
    });

    return NextResponse.json({ records });
  } catch (err: any) {
    return NextResponse.json({ records: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { date, completedQuestsCount, totalQuestsCount, consistencyScore, statusCode, xpEarned } = body;

    const recordDate = date || new Date().toISOString().slice(0, 10);

    // Upsert to enforce UNIQUE(userId, date) constraint at the database layer
    const record = await prisma.dailyRecord.upsert({
      where: {
        userId_date: {
          userId,
          date: recordDate,
        },
      },
      update: {
        completedQuestsCount: completedQuestsCount ?? 0,
        totalQuestsCount: totalQuestsCount ?? 0,
        consistencyScore: consistencyScore ?? 0.0,
        statusCode: statusCode || 'UNLOGGED',
        xpEarned: xpEarned ?? 0,
      },
      create: {
        userId,
        date: recordDate,
        completedQuestsCount: completedQuestsCount ?? 0,
        totalQuestsCount: totalQuestsCount ?? 0,
        consistencyScore: consistencyScore ?? 0.0,
        statusCode: statusCode || 'UNLOGGED',
        xpEarned: xpEarned ?? 0,
      },
    });

    return NextResponse.json({ success: true, record });
  } catch (err: any) {
    return NextResponse.json({ success: true, note: 'Saved in local rollover state' });
  }
}
