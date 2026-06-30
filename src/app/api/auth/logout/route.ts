import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();

    const hasSession = cookieStore.has("tmdb_session_id");

    if (!hasSession) {
      return NextResponse.json(
        { success: true, message: "No active session found to terminate." },
        { status: 200 },
      );
    }

    cookieStore.delete("tmdb_session_id");

    return NextResponse.json(
      { success: true, message: "Logged out successfully." },
      { status: 200 },
    );
  } catch (error) {
    console.error("CRITICAL: Logout pipeline execution failed:", error);

    return NextResponse.json(
      { success: false, message: "An error occurred during logout execution." },
      { status: 500 },
    );
  }
}
