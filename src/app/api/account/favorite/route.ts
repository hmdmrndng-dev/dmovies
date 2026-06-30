import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mediaType, mediaId, isFavorite } = body;

    if (!mediaType || !mediaId === undefined || isFavorite === undefined) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    const sessionId = request.headers.get("x-tmdb-session-id");

    if (!sessionId) {
      return NextResponse.json(
        { message: "Unauthorized. Missing session ID." },
        { status: 401 },
      );
    }

    const tmdbResponse = await fetch(
      `https://api.themoviedb.org/3/account/account/favorite?session_id=${sessionId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({
          media_type: mediaType,
          media_id: mediaId,
          favorite: isFavorite,
        }),
      },
    );

    const data = await tmdbResponse.json();

    if (!tmdbResponse.ok) {
      return NextResponse.json(
        { message: data.status_message || "TMDB operation failed" },
        { status: tmdbResponse.status },
      );
    }

    return NextResponse.json({ success: true, message: data.status_message });
  } catch (error) {
    console.error("Favorite toggle error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
