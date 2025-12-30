import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getUser, errorResponse } from '@/lib/api/helper';

export async function GET(req: NextRequest) {
  try {
    const user = await getUser(req);
    if (!user) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });

    const db = await getDb();
    let query: any = {};
    
    if (user.role === 'admin') {
      query = {};
    } else if (user.role === 'faculty') {
      const subjects = await db.collection('subjects').find({ instructor: user.full_name }).toArray();
      const codes = subjects.map(s => s.code);
      query = { subject_code: { $in: codes } };
    } else {
      query = { user_id: user._id.toString() };
    }

    const records = await db.collection('attendance').find(query).toArray();
    
    // Add roll numbers if needed
    const userIds = Array.from(new Set(records.map(r => r.user_id)));
    const profiles = await db.collection('student_profiles').find({ user_id: { $in: userIds } }).toArray();
    const profileMap = profiles.reduce((acc, p) => ({ ...acc, [p.user_id]: p.roll_number }), {});

    const processed = records.map(r => ({
      ...r,
      id: r._id.toString(),
      _id: undefined,
      roll_number: profileMap[r.user_id]
    }));

    return NextResponse.json(processed);
  } catch (error: any) {
    return errorResponse(error);
  }
}
