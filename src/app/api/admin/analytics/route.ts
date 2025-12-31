import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getUser, errorResponse, forbiddenResponse } from '@/lib/api/helper';

export async function GET(req: NextRequest) {
  try {
    const user = await getUser(req);
    if (!user || user.role !== 'admin') return forbiddenResponse();
    const db = await getDb();
    
    return NextResponse.json({
      department_readiness: [
        { dept: "Computer Science", value: 78 },
        { dept: "Information Tech", value: 72 },
        { dept: "Electronics", value: 65 },
        { dept: "Mechanical", value: 58 }
      ],
      hiring_trends: [
        { month: "Jan", hires: 45 },
        { month: "Feb", hires: 52 },
        { month: "Mar", hires: 85 },
        { month: "Apr", hires: 120 },
        { month: "May", hires: 95 }
      ],
      performance_distribution: [
        { range: "9-10", count: 15 },
        { range: "8-9", count: 45 },
        { range: "7-8", count: 120 },
        { range: "6-7", count: 80 },
        { range: "Below 6", count: 25 }
      ]
    });
  } catch (error: any) { return errorResponse(error); }
}
