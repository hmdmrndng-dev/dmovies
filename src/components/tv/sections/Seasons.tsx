"use client";

import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { IconMovie, IconChevronDown } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

type Season = {
  air_date: string | null;
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  episodes: Episode[];
};

type Episode = {
  air_date: string | null;
  episode_number: number;
  id: number;
  name: string;
  overview: string;
  runtime: number | null;
  still_path: string | null;
};

// Helper to make "2023-10-12" look like "Oct 12, 2023"
const formatDate = (dateString: string | null) => {
  if (!dateString) return null;
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function Seasons({ seasons }: { seasons: Season[] }) {
  // Toggles the visibility of seasons 2+
  const [showAll, setShowAll] = useState(false);

  if (!seasons || seasons.length === 0) return null;

  // If showAll is false, only grab the very first season. Otherwise, grab them all.
  const visibleSeasons = showAll ? seasons : seasons.slice(0, 1);
  
  // Only show the toggle button if there is actually more than 1 season
  const hasMoreSeasons = seasons.length > 1;

  return (
    <section className="py-8">
      {/* Top-level toggle */}
      {hasMoreSeasons && (
        <Button
          variant="ghost"
          className="mb-6 flex items-center gap-2 px-0 text-2xl font-semibold tracking-tight hover:bg-transparent hover:opacity-80"
          onClick={() => setShowAll((prev) => !prev)}
        >
          {showAll ? "Show less" : `View all ${seasons.length} seasons`}
          <IconChevronDown
            className={cn(
              "h-6 w-6 transition-transform duration-300",
              showAll && "rotate-180"
            )}
          />
        </Button>
      )}

      {/* The accordion always renders, but its children change based on `visibleSeasons` */}
      <Accordion
        type="multiple"
        className="space-y-4 border-none"
      >
        {visibleSeasons.map((season, index) => (
          <AccordionItem
            key={season.id}
            value={`season-${season.id}`}
            className={cn(
              "rounded-xl border bg-card px-4 shadow-sm transition-colors hover:border-border/80",
              // Add a slight entrance animation only to the revealed seasons (index > 0)
              index > 0 && "animate-in fade-in slide-in-from-top-4 duration-500"
            )}
          >
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex flex-1 items-start gap-4 text-left md:items-center">
                {/* Season Poster */}
                {season.poster_path ? (
                  <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-md border shadow-sm">
                    <Image
                      src={`https://image.tmdb.org/t/p/w185${season.poster_path}`}
                      alt={season.name}
                      fill
                      sizes="64px"
                      priority={index === 0}
                      loading={index === 0 ? undefined : "lazy"}
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="flex h-24 w-16 shrink-0 items-center justify-center rounded-md border bg-muted shadow-sm">
                    <IconMovie className="h-6 w-6 text-muted-foreground/50" />
                  </div>
                )}

                {/* Season Details */}
                <div className="flex-1 space-y-1 pr-4">
                  <h3 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
                    {season.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="px-2 py-0.5 text-xs font-medium">
                      {season.episodes.length} Episodes
                    </Badge>
                    {season.air_date && (
                      <span className="text-xs font-medium text-muted-foreground">
                        {formatDate(season.air_date)}
                      </span>
                    )}
                  </div>
                  {season.overview && (
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground md:line-clamp-1">
                      {season.overview}
                    </p>
                  )}
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent className="pt-2 pb-6 h-auto">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {season.episodes.map((episode) => (
                  <div
                    key={episode.id}
                    className="group flex flex-col gap-3 rounded-xl border bg-background p-3 transition-all hover:bg-accent/50 hover:shadow-md"
                  >
                    {/* Episode Thumbnail */}
                    <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-lg border bg-muted">
                      {episode.still_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w300${episode.still_path}`}
                          alt={episode.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <IconMovie className="h-8 w-8 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>

                    {/* Episode Meta */}
                    <div className="flex flex-col flex-1 space-y-1.5">
                      <h4 className="line-clamp-1 text-sm font-semibold leading-tight text-foreground" title={episode.name}>
                        {episode.episode_number}. {episode.name}
                      </h4>

                      <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
                        {episode.air_date && <span>{formatDate(episode.air_date)}</span>}
                        {episode.air_date && episode.runtime && <span>•</span>}
                        {episode.runtime && <span>{episode.runtime} min</span>}
                      </div>

                      {episode.overview ? (
                        <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground mt-1">
                          {episode.overview}
                        </p>
                      ) : (
                        <p className="text-xs italic text-muted-foreground/70 mt-1">
                          No overview available.
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}