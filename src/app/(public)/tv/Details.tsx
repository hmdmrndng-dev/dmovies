"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { pickTrailer, type Video } from "@/lib/video-utils";
import { getSocialLinks } from "@/lib/social-utils";
import { cn } from "@/lib/utils";
import MediaHeader from "@/components/tv/sections/MediaHeader";
import Credits from "@/components/tv/sections/Credits";
import Similar from "@/components/tv/sections/Similar";
import { IconMovie } from "@tabler/icons-react";
import Trailer from "@/app/shared/trailer-dialog";
import { useRouter } from "next/navigation";
import LoginDialog from "@/app/shared/login-dialog";
import { useMediaAction } from "@/hooks/useMediaAction";
import { toast } from "sonner";
import Seasons from "@/components/tv/sections/Seasons";

type Tvs = {
  id: number;
  name: string;
  tagline: string;
  overview: string;
  poster_path: string | null;
  vote_average: number;
  adult: boolean;
  genres: Genre[];
  first_air_date: string | null;
  last_air_date: string | null;
  status: string;
  seasons: Season[];
};

type Season = {
  air_date: string | null;
  episode_count: number;
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

type TmdbImages = {
  backdrops: Array<{ file_path: string }>;
};

type Genre = {
  id: number;
  name: string;
};

type ExternalIds = {
  imdb_id: string | null;
  facebook_id: string | null;
  instagram_id: string | null;
  twitter_id: string | null;
  youtube_id: string | null;
  wikidata_id: string | null;
  tik_tok_id: string | null;
};

type TvCredits = {
  cast: Cast[];
  crew: Crew[];
};

type Cast = {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
};

type Crew = {
  id: number;
  name: string;
  job: string;
  profile_path: string | null;
};

type Keywords = {
  id: number;
  name: string;
};

type SimilarTvs = {
  id: number;
  name: string;
  poster_path: string | null;
  first_air_date: string | null;
};

export default function Details({
  tvs,
  credits,
  images,
  externalIds,
  keywords,
  similar,
  user,
  isFavorited: initialFavorited,
  isInWatchlist: initialInWatchlist,
}: {
  tvs: Tvs;
  credits: TvCredits;
  images: TmdbImages;
  externalIds: ExternalIds;
  keywords: Keywords[];
  similar: SimilarTvs[];
  user: any | null;
  isFavorited: boolean;
  isInWatchlist: boolean;
}) {
  const router = useRouter();
  const [activeModal, setActiveModal] = useState<"trailer" | "login" | null>(
    null,
  );
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const socialLinks = getSocialLinks(externalIds);
  const {
    isActive: favorited,
    isLoading: favoriteLoading,
    toggle: toggleFavorite,
  } = useMediaAction({
    initialState: initialFavorited,
    user,
    mediaId: tvs.id,
    mediaType: "tv",
    actionType: "favorite",
    onRequireLogin: openLogin,
  });
  const {
    isActive: inWatchlist,
    isLoading: watchlistLoading,
    toggle: toggleWatchlist,
  } = useMediaAction({
    initialState: initialInWatchlist,
    user,
    mediaId: tvs.id,
    mediaType: "tv",
    actionType: "watchlist",
    onRequireLogin: openLogin,
  });

  const autoplayPlugin = useRef(
    Autoplay({
      delay: 4000,
      stopOnInteraction: false,
    }),
  );

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [trailerTitle, setTrailerTitle] = useState("");
  const [trailerDescription, setTrailerDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function openTrailer(data: Tvs) {
    setActiveModal("trailer");
    setLoading(true);
    setTrailerTitle(data.name);
    setTrailerDescription(data.overview);
    try {
      const res = await fetch(`/api/tv/${data.id}/videos`);
      const json = await res.json();
      setTrailerKey(pickTrailer(json.results as Video[]));
    } finally {
      setLoading(false);
    }
  }

  async function openLogin() {
    setActiveModal("login");
  }

  const backdropsList = images?.backdrops?.slice(0, 10) || [];
  return (
    <main className="mt-16">
      <div className="relative">
        <Carousel
          className="w-full overflow-hidden transform-gpu [backface-visibility:hidden]"
          setApi={setApi}
          plugins={[autoplayPlugin.current]}
        >
          <CarouselContent className="will-change-transform ml-0">
            {backdropsList.map((image, index) => (
              <CarouselItem
                key={image.file_path}
                className="relative h-[40vh] md:h-[55vh] lg:h-[65vh] pl-0 basis-full [backface-visibility:hidden]"
              >
                {image.file_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/original${image.file_path}`}
                    alt={tvs.name}
                    fill
                    priority={index === 0}
                    loading={index === 0 ? undefined : "lazy"}
                    sizes="100vw"
                    className="object-cover pointer-events-none"
                  />
                ) : (
                  <div className="w-full aspect-[10/16] bg-gray-300 rounded-xl flex items-center justify-center text-gray-700 text-sm font-medium select-none shadow-md">
                    <IconMovie />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
              </CarouselItem>
            ))}
          </CarouselContent>

          {backdropsList.length > 1 && (
            <div className="absolute bottom-4 right-8 z-40 flex items-center justify-center gap-1.5">
              {backdropsList.map((_, i) => (
                <button
                  key={i}
                  onClick={() => api?.scrollTo(i)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
                    i === current
                      ? "w-6 bg-primary"
                      : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50 dark:bg-muted/40 dark:hover:bg-muted/80",
                  )}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </Carousel>
      </div>

      <div
        className={cn(
          "relative z-10 px-4 md:px-8 xl:px-24 pb-12",
          backdropsList.length > 1 ? "-mt-16 md:-mt-24" : "mt-4",
        )}
      >
        <MediaHeader
          tv={tvs}
          socialLinks={socialLinks}
          hasMultipleBackdrops={backdropsList.length > 1}
          onOpenTrailer={() => openTrailer(tvs)}
          onOpenLogin={openLogin}
          isTrailerLoading={loading}
          keywords={keywords}
          user={user}
          isFavorited={favorited}
          onFavorite={toggleFavorite}
          isFavoriteLoading={favoriteLoading}
          isInWatchlist={inWatchlist}
          onWatchlist={toggleWatchlist}
          isWatchlistLoading={watchlistLoading}
        />

        <Seasons seasons={tvs.seasons} />

        <Credits cast={credits.cast} />

        <Credits crew={credits.crew} />

        <Similar similar={similar} />
      </div>

      <Trailer
        isOpen={activeModal === "trailer"}
        onOpenChange={(open) => setActiveModal(open ? "trailer" : null)}
        trailerKey={trailerKey}
        trailerTitle={trailerTitle}
        trailerDescription={trailerDescription}
        loading={trailerKey === null && loading}
      />

      <LoginDialog
        isOpen={activeModal === "login"}
        onOpenChange={(open) => setActiveModal(open ? "login" : null)}
        onSuccess={() => {
          toast.success("Welcome back!", {
            description: "You have successfully logged in.",
          });
          router.refresh();
        }}
      />
    </main>
  );
}
