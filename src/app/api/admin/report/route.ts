import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getUser, errorResponse, forbiddenResponse } from '@/lib/api/helper';

export async function GET(req: NextRequest) {
  try {
    const user = await getUser(req);
    if (!user || user.role === 'student') return forbiddenResponse();
    const db = await getDb();
    
    const total_students = await db.collection('users').countDocuments({ role: 'student' });
    const attendance_avg_res = await db.collection('attendance').aggregate([
      { $group: { _id: null, avg_perc: { $avg: "$percentage" } } }
    ]).toArray();
    
    const placed_count_res = await db.collection('placed_companies_2024').aggregate([
      { $group: { _id: null, total: { $sum: "$total_placed" } } }
    ]).toArray();

    return NextResponse.json({
      title: "Institutional Performance Report 2024",
      metrics: [
        { label: "Student Enrollment", value: total_students, status: "Stable" },
        { label: "Average Attendance", value: `${Math.round(attendance_avg_res[0]?.avg_perc || 0)}%`, status: "Good" },
        { label: "Placements Confirmed", value: placed_count_res[0]?.total || 0, status: "On Track" },
        { label: "Faculty Retention", value: "98%", status: "Excellent" }
      ],
      highlights: [
        "Google selected 12 students in recent drive.",
        "Average package increased by 15% compared to 2023.",
        "AI curriculum successfully integrated into 6th semester."
      ]
    });
  } catch (error: any) { return errorResponse(error); }
}
