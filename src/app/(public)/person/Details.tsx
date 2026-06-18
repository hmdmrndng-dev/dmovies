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
import { cn } from "@/lib/utils";
import { IconMovie } from "@tabler/icons-react";
import MediaHeader from "@/components/people/sections/MediaHeader";

type Person = {
  id: number;
  name: string;
  biography: string;
  birthday?: string | null;
  deathday?: string | null;
  place_of_birth?: string | null;
  gender?: number | null;
  profile_path?: string;
  known_for_department?: string | null;
};

type TmdbImages = {
  backdrops: Array<{ backdrop_path: string }>;
};

export default function Details({
  person,
  images,
}: {
  person: Person;
  images: TmdbImages;
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

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

  const backdropsList = images?.backdrops || [];

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
                key={image.backdrop_path}
                className="relative h-[40vh] md:h-[55vh] lg:h-[65vh] pl-0 basis-full [backface-visibility:hidden]"
              >
                {image.backdrop_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/original${image.backdrop_path}`}
                    alt={person.name}
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
        <MediaHeader person={person} hasMultipleBackdrops={backdropsList.length > 1} />
      </div>
    </main>
  );
}
