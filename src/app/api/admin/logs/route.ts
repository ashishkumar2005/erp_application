import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getUser, errorResponse, forbiddenResponse } from '@/lib/api/helper';

export async function GET(req: NextRequest) {
  try {
    const user = await getUser(req);
    if (!user || user.role !== 'admin') return forbiddenResponse();
    const db = await getDb();
    const logs = await db.collection('activity_logs').find().sort({ timestamp: -1 }).limit(100).toArray();
    return NextResponse.json(logs.map(l => ({ ...l, id: l._id.toString(), _id: undefined })));
  } catch (error: any) { return errorResponse(error); }
}
