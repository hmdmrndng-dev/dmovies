import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { tmdb } from "@/lib/tmdb";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required" },
        { status: 400 },
      );
    }

    const tokenRes = await tmdb.get(
      "https://api.themoviedb.org/3/authentication/token/new",
    );
    const requestToken = tokenRes.data.request_token;

    await tmdb.post(
      "https://api.themoviedb.org/3/authentication/token/validate_with_login",
      {
        username,
        password,
        request_token: requestToken,
      },
    );

    const sessionRes = await tmdb.post(
      "https://api.themoviedb.org/3/authentication/session/new",
      {
        request_token: requestToken,
      },
    );
    const sessionId = sessionRes.data.session_id;

    const cookieStore = await cookies();
    cookieStore.set("tmdb_session_id", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, 
      path: "/",
    });

    return NextResponse.json({
      success: true,
      message: "Logged in successfully",
    });
  } catch (error: any) {
    console.error("Auth API Error:", error);

    const status = error.response?.status || 500;
    const message =
      error.response?.data?.status_message ||
      "Authentication failed. Please check your credentials or try again later.";

    return NextResponse.json({ message }, { status });
  }
}
