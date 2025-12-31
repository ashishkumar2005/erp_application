import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { createAccessToken, verifyPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let email = '';
    let password = '';

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await req.formData();
      email = formData.get('username') as string;
      password = formData.get('password') as string;
    } else {
      const body = await req.json();
      email = body.username || body.email;
      password = body.password;
    }

    const db = await getDb();
    const user = await db.collection('users').findOne({ email });

    if (!user || !verifyPassword(password, user.hashed_password)) {
      return NextResponse.json({ detail: "Incorrect email or password" }, { status: 401 });
    }

    const access_token = createAccessToken({ sub: user.email, role: user.role });
    
    // Log activity
    await db.collection('activity_logs').insertOne({
      user_id: user._id.toString(),
      action: "LOGIN",
      details: "User logged in via Next.js API",
      timestamp: new Date()
    });

    return NextResponse.json({
      access_token,
      token_type: "bearer"
    });
  } catch (error: any) {
    return NextResponse.json({ detail: error.message }, { status: 500 });
  }
}
