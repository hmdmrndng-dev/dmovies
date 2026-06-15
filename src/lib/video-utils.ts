export type Video = {
  key: string;
  site: string;
  type: string;
  official: boolean;
};

export function pickTrailer(videos: Video[]): string | null {
  const trailer =
    videos.find(
      (v) => v.site === "YouTube" && v.type === "Trailer" && v.official,
    ) ??
    videos.find((v) => v.site === "YouTube" && v.type === "Trailer") ??
    videos.find((v) => v.site === "YouTube");
  return trailer?.key ?? null;
}
