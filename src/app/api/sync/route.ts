import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const items = body?.items || [];

    // Log received sync items on the server node
    console.log(`[API /api/sync] Successfully processed ${items.length} telemetry write operations.`);

    return NextResponse.json({
      success: true,
      syncedCount: items.length,
      timestamp: new Date().toISOString(),
      nodeStatus: 'ACTIVE',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process sync payload',
      },
      { status: 500 }
    );
  }
}
