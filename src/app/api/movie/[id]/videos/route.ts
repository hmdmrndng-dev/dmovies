import { tmdb } from "@/lib/tmdb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Movie ID is required" },
        { status: 400 },
      );
    }

    const response = await tmdb.get(`/movie/${id}/videos?language=en-US`);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("TMDB Videos API Route Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch movie videos" },
      { status: 500 },
    );
  }
}
