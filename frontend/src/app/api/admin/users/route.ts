import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { verifyToken, hashPassword } from '@/lib/auth';
import { ObjectId } from 'mongodb';

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
    if (!user || (user.role !== 'admin' && user.role !== 'faculty')) {
      return NextResponse.json({ detail: "Forbidden" }, { status: 403 });
    }

    const db = await getDb();
    const query: any = {};
    if (user.role === 'faculty') {
      query.role = 'student';
    }

    const usersList = await db.collection('users').find(query).limit(1000).toArray();
    
    // Process students to add roll numbers
    const studentIds = usersList.filter(u => u.role === 'student').map(u => u._id.toString());
    const profiles = await db.collection('student_profiles').find({ user_id: { $in: studentIds } }).toArray();
    const profileMap = profiles.reduce((acc, p) => ({ ...acc, [p.user_id]: p.roll_number }), {});

    const processedUsers = usersList.map(u => ({
      ...u,
      id: u._id.toString(),
      _id: undefined,
      hashed_password: undefined,
      roll_number: profileMap[u._id.toString()] || (u.role === 'student' ? 'N/A' : undefined)
    }));

    return NextResponse.json(processedUsers);
  } catch (error: any) {
    return NextResponse.json({ detail: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getUser(req);
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ detail: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const db = await getDb();
    
    const existing = await db.collection('users').findOne({ email: body.email });
    if (existing) {
      return NextResponse.json({ detail: "Email already registered" }, { status: 400 });
    }

    const newUser = {
      email: body.email,
      hashed_password: hashPassword(body.password || 'admin123'),
      full_name: body.full_name,
      role: body.role,
      department: body.department,
      is_active: 1,
      created_at: new Date()
    };

    const res = await db.collection('users').insertOne(newUser);
    
    if (body.role === 'student') {
      await db.collection('student_profiles').insertOne({
        user_id: res.inserted_id.toString(),
        roll_number: `EP2024${body.department?.substring(0, 2).toUpperCase() || 'XX'}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        contact_number: "+91 98765 00000",
        address: "Academic Square, EduCity",
        registered_courses: [`B.Tech ${body.department}`],
        current_semester: 6
      });
    }

    return NextResponse.json({ message: "User created" });
  } catch (error: any) {
    return NextResponse.json({ detail: error.message }, { status: 500 });
  }
}
