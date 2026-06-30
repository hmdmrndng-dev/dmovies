import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { tmdb } from "@/lib/tmdb";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("tmdb_session_id")?.value;

    if (!sessionId) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 },
      );
    }

    const { account_id, media_id, media_type, watchlist } =
      await request.json();

    const res = await tmdb.post(
      `https://api.themoviedb.org/3/account/${account_id}/watchlist?session_id=${sessionId}`,
      { media_type, media_id, watchlist },
    );

    return NextResponse.json(res.data);
  } catch (error: any) {
    const status = error.response?.status || 500;
    const message =
      error.response?.data?.status_message || "Failed to update watchlist";
    return NextResponse.json({ message }, { status });
  }
}
