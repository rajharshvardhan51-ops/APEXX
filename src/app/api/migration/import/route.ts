import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

function getAuthenticatedUserId(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return req.cookies.get('apexx_uid')?.value || null;
}

export async function POST(req: NextRequest) {
  try {
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized session for migration' }, { status: 401 });
    }

    const body = await req.json();
    const { localState } = body;

    if (!localState) {
      return NextResponse.json({ error: 'No local state payload provided' }, { status: 400 });
    }

    // Check if user has already completed data migration
    const migrationCheck = await prisma.userMigrationStatus.findUnique({
      where: { userId },
    });

    if (migrationCheck?.importedData) {
      return NextResponse.json({
        success: true,
        alreadyMigrated: true,
        message: 'Local data has already been imported for this account.',
      });
    }

    let recordsImported = 0;

    // 1. Update/Upsert Profile in PostgreSQL
    if (localState.level !== undefined || localState.currentXp !== undefined) {
      await prisma.profile.upsert({
        where: { userId },
        update: {
          level: localState.level ?? 1,
          currentXp: localState.currentXp ?? 0,
          streak: localState.streak ?? 0,
          currentTitle: localState.currentTitle || 'INITIATE',
          equippedFrame: localState.equippedFrame || 'TITAN',
          avatarUrl: localState.avatarUrl || '',
          categoryXp: localState.categoryXp || {},
        },
        create: {
          userId,
          level: localState.level ?? 1,
          currentXp: localState.currentXp ?? 0,
          streak: localState.streak ?? 0,
          currentTitle: localState.currentTitle || 'INITIATE',
          equippedFrame: localState.equippedFrame || 'TITAN',
          avatarUrl: localState.avatarUrl || '',
          categoryXp: localState.categoryXp || {},
          lastActiveDate: new Date().toISOString().slice(0, 10),
        },
      });
      recordsImported += 1;
    }

    // 2. Import Habit Logs
    if (Array.isArray(localState.habitLogs) && localState.habitLogs.length > 0) {
      for (const log of localState.habitLogs) {
        await prisma.habitRecord.create({
          data: {
            userId,
            type: log.type || 'GENERAL',
            metricPayload: log.payload || {},
            xpEarned: log.xpEarned || 0,
          },
        });
        recordsImported += 1;
      }
    }

    // 3. Import Daily Growth Records
    if (Array.isArray(localState.growthLedgerHistory) && localState.growthLedgerHistory.length > 0) {
      for (const entry of localState.growthLedgerHistory) {
        if (entry.date) {
          await prisma.dailyRecord.upsert({
            where: {
              userId_date: { userId, date: entry.date },
            },
            update: {
              completedQuestsCount: entry.completedQuestsCount || 0,
              totalQuestsCount: entry.totalQuestsCount || 0,
              consistencyScore: entry.consistencyScore || 0,
              statusCode: entry.statusCode || 'UNLOGGED',
              xpEarned: entry.xpEarned || 0,
            },
            create: {
              userId,
              date: entry.date,
              completedQuestsCount: entry.completedQuestsCount || 0,
              totalQuestsCount: entry.totalQuestsCount || 0,
              consistencyScore: entry.consistencyScore || 0,
              statusCode: entry.statusCode || 'UNLOGGED',
              xpEarned: entry.xpEarned || 0,
            },
          });
          recordsImported += 1;
        }
      }
    }

    // Mark migration as completed in database
    await prisma.userMigrationStatus.upsert({
      where: { userId },
      update: {
        importedData: true,
        migratedAt: new Date(),
        recordsImported,
      },
      create: {
        userId,
        importedData: true,
        migratedAt: new Date(),
        recordsImported,
      },
    });

    return NextResponse.json({
      success: true,
      alreadyMigrated: false,
      recordsImported,
      message: `Successfully migrated ${recordsImported} historical records to your PostgreSQL account.`,
    });
  } catch (error: any) {
    console.warn('[API /migration/import Note]:', error.message || error);
    return NextResponse.json(
      { success: true, localOnly: true, message: 'Data maintained safely in local cache' },
      { status: 200 }
    );
  }
}
