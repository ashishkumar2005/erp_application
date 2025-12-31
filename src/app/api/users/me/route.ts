import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const payload: any = verifyToken(token);
    
    if (!payload || !payload.sub) {
      return NextResponse.json({ detail: "Invalid token" }, { status: 401 });
    }

    const db = await getDb();
    const user = await db.collection('users').findOne({ email: payload.sub });

    if (!user) {
      return NextResponse.json({ detail: "User not found" }, { status: 404 });
    }

    const userData = {
      ...user,
      id: user._id.toString(),
      _id: undefined,
      hashed_password: undefined
    };

    return NextResponse.json(userData);
  } catch (error: any) {
    return NextResponse.json({ detail: error.message }, { status: 500 });
  }
}
