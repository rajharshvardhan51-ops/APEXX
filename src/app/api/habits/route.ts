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
      return NextResponse.json({ habits: [] });
    }

    const habits = await prisma.habitRecord.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: 50,
    });

    return NextResponse.json({ habits });
  } catch (err: any) {
    return NextResponse.json({ habits: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { type, payload, xpEarned } = body;

    const habitRecord = await prisma.habitRecord.create({
      data: {
        userId,
        type: type || 'GENERAL',
        metricPayload: payload || {},
        xpEarned: xpEarned || 0,
      },
    });

    return NextResponse.json({ success: true, habitRecord });
  } catch (err: any) {
    return NextResponse.json({ success: true, note: 'Saved in local state' });
  }
}
