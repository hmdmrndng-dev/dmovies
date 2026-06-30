import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  IconBookmark,
  IconHeart,
  IconLoader,
  IconStar,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

type Genre = {
  id: number;
  name: string;
};

type Keyword = {
  id: number;
  name: string;
};

type MediaHeaderProps = {
  tv: {
    title: string;
    tagline?: string;
    overview?: string;
    vote_average?: number;
    adult?: boolean;
    genres?: Genre[];
    release_date?: string | null;
    poster_path?: string | null;
    runtime?: number | null;
    status?: string;
    production_companies?: Array<{ name: string }>;
  };
  socialLinks: Array<{
    id: string | null | undefined;
    label: string;
    url: string;
    icon: React.ReactNode;
  }>;
  hasMultipleBackdrops: boolean;
  onOpenTrailer: () => void;
  onOpenLogin: () => void;
  isTrailerLoading: boolean;
  keywords: Keyword[];
  user: any | null;
};

export default function MediaHeader({
  tv: movie,
  socialLinks,
  onOpenTrailer,
  onOpenLogin,
  isTrailerLoading,
  keywords,
  user,
}: MediaHeaderProps) {
  return (
    <section>
      <div className="flex flex-col md:flex-row gap-6 lg:gap-10">
        <div className="flex flex-row md:flex-col gap-4 items-end md:items-stretch shrink-0 md:w-52 lg:w-64">
          <div className="relative w-28 sm:w-36 md:w-full aspect-[2/3] rounded-xl overflow-hidden shadow-2xl ring-1 ring-border bg-zinc-900">
            {movie.poster_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                alt={movie.title || "Poster"}
                fill
                priority
                sizes="(max-width: 640px) 112px, (max-width: 768px) 144px, 256px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground text-xs">
                No Poster
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 flex-1 md:flex-none">
            {socialLinks.filter((l) => l.id).length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {socialLinks
                  .filter((link) => link.id)
                  .map((link) => (
                    <Button
                      key={link.label}
                      size="icon"
                      variant="outline"
                      asChild
                      title={link.label}
                    >
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.icon}
                        <span className="sr-only">{link.label}</span>
                      </a>
                    </Button>
                  ))}
              </div>
            )}
            <Button
              size="lg"
              disabled={isTrailerLoading}
              onClick={onOpenTrailer}
              className="w-full"
            >
              {isTrailerLoading ? (
                <>
                  <IconLoader className="ml-2 animate-spin" />
                </>
              ) : (
                "Watch Trailer"
              )}
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4 flex-1 min-w-0 pt-2">
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 font-semibold"
            >
              {movie.status || "Unknown Status"}
            </Badge>
            <Badge
              variant="outline"
              className="bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20 font-semibold"
            >
              Movie
            </Badge>
            <Badge
              variant="outline"
              className={cn(
                "px-2.5 py-0.5 font-bold tracking-wider uppercase",
                movie.adult
                  ? "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400"
                  : "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
              )}
            >
              {movie.adult ? "R-Rated" : "PG-13"}
            </Badge>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
            {movie.title}
          </h1>

          <div className="flex flex-col gap-1">
            <p className="text-sm text-muted-foreground">
              {movie.release_date
                ? new Date(movie.release_date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "N/A"}
            </p>
            {movie.tagline && (
              <p className="text-sm italic text-muted-foreground">
                &ldquo;{movie.tagline}&rdquo;
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            {movie.genres?.map((genre) => (
              <Badge key={genre.id} variant="secondary">
                {genre.name}
              </Badge>
            ))}
            {movie.runtime ? (
              <>
                <span className="text-muted-foreground text-sm mx-1">•</span>
                <Badge variant="secondary">
                  {`${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`}
                </Badge>
              </>
            ) : null}
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <div className="flex flex-col items-center gap-1.5">
              <Badge
                variant="outline"
                className="w-12 h-12 flex items-center justify-center text-lg font-bold hover:scale-120 transition-transform duration-200 cursor-default"
              >
                {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
              </Badge>

              <span className="w-20 text-center text-[11px] font-medium text-muted-foreground leading-tight">
                TMDB Rating
              </span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <Button
                variant="ghost"
                className="w-12 h-12"
                onClick={user ? undefined : onOpenLogin}
              >
                <IconStar className="!w-8 !h-8" />
              </Button>

              <span className="w-20 text-center text-[11px] font-medium text-muted-foreground leading-tight">
                What's your rating?
              </span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <Button
                variant="ghost"
                className="w-12 h-12"
                onClick={user ? undefined : onOpenLogin}
              >
                <IconHeart className="!w-8 !h-8" />
              </Button>
              <span className="w-20 text-center text-[11px] font-medium text-muted-foreground leading-tight">
                Add to favorites
              </span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <Button
                variant="ghost"
                className="w-12 h-12"
                onClick={user ? undefined : onOpenLogin}
              >
                <IconBookmark className="!w-8 !h-8" />
              </Button>
              <span className="w-20 text-center text-[11px] font-medium text-muted-foreground leading-tight">
                Add to watchlist
              </span>
            </div>
          </div>

          <div>
            <h2 className="font-semibold text-base mb-2">Overview</h2>
            <p className="text-sm leading-relaxed text-justify text-muted-foreground">
              {movie.overview || "No overview available."}
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-base mb-2">
              Production Companies
            </h2>
            <p className="text-sm leading-relaxed text-justify text-muted-foreground">
              {movie.production_companies
                ?.map((company) => company.name)
                .join(", ") || "No production companies available."}
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-base mb-2">Keywords</h2>
            {keywords.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword) => (
                  <Badge key={keyword.id} variant="secondary">
                    {keyword.name}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm leading-relaxed text-justify text-muted-foreground">
                No keywords available.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
