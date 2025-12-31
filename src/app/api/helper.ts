import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';

export async function getUser(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  const payload: any = verifyToken(token);
  if (!payload || !payload.sub) return null;
  const db = await getDb();
  return await db.collection('users').findOne({ email: payload.sub });
}

export function errorResponse(error: any) {
  return NextResponse.json({ detail: error.message || "Internal Server Error" }, { status: 500 });
}

export function forbiddenResponse() {
  return NextResponse.json({ detail: "Forbidden" }, { status: 403 });
}

export function unauthorizedResponse() {
  return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
}
