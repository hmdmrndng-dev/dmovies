import { tmdb } from "@/lib/tmdb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const response = await tmdb.get(`/movie/${id}/videos?language=en-US`);
  return NextResponse.json(response.data);
}
