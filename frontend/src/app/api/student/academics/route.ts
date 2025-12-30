import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';

async function getUser(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  const payload: any = verifyToken(token);
  if (!payload || !payload.sub) return null;
  const db = await getDb();
  return await db.collection('users').findOne({ email: payload.sub });
}

export async function GET(req: NextRequest) {
  try {
    const user = await getUser(req);
    if (!user) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });

    const db = await getDb();
    const profile = await db.collection('student_profiles').findOne({ user_id: user._id.toString() });
    const semester = profile?.current_semester || 6;
    
    const query: any = { semester };
    if (user.role === 'student' && user.department) {
      query.department = user.department;
    }

    const subjects = await db.collection('subjects').find(query).toArray();
    
    return NextResponse.json(subjects.map(s => ({ ...s, id: s._id.toString(), _id: undefined })));
  } catch (error: any) {
    return NextResponse.json({ detail: error.message }, { status: 500 });
  }
}
