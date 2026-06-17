import { tmdb } from "@/lib/tmdb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("query");
  const page = req.nextUrl.searchParams.get("page") || "1";

  if (!query || query.trim() === "") {
    return NextResponse.json({ results: [] });
  }

  try {
    const response = await tmdb.get("/search/multi", {
      params: {
        query: query,
        include_adult: false,
        language: "en-US",
        page: page, 
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("TMDB Search API Route Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch search results" },
      { status: 500 },
    );
  }
}
