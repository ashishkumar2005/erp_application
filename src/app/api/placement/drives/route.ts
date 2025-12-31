import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getUser, errorResponse } from '@/lib/api/helper';

export async function GET(req: NextRequest) {
  try {
    const user = await getUser(req);
    if (!user) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });

    const db = await getDb();
    const drives = await db.collection('placement_drives').find().toArray();
    
    return NextResponse.json(drives.map(d => ({ ...d, id: d._id.toString(), _id: undefined })));
  } catch (error: any) {
    return errorResponse(error);
  }
}
