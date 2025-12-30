import { NextResponse } from "next/server";

/* ───────── USER HELPER ───────── */
export async function getUser(request: Request) {
  // Example placeholder – replace with real auth logic if needed
  // This prevents build failure and keeps routes working

  return {
    id: "system",
    role: "admin"
  };
}

/* ───────── RESPONSE HELPERS ───────── */
export function forbiddenResponse(message = "Forbidden") {
  return NextResponse.json(
    { success: false, message },
    { status: 403 }
  );
}

export function errorResponse(
  message = "Internal Server Error",
  status = 500
) {
  return NextResponse.json(
    { success: false, message },
    { status }
  );
}

export function successResponse<T>(
  data: T,
  message = "Success"
) {
  return NextResponse.json(
    { success: true, message, data },
    { status: 200 }
  );
}