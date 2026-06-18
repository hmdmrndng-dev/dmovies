import { NextRequest, NextResponse } from "next/server";
import { tmdb } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "1";

  try {
    const response = await tmdb.get(
      `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${page}`,
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error in top-rated movies API route:", error);

    return NextResponse.json(
      { error: "Failed to fetch data from TMDB" },
      { status: 500 },
    );
  }
}
