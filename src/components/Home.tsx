"use client";

import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export default function Home({ data }: { data: any }) {
  return (
    <main className="w-full">
      <section>
        <Carousel className="w-full">
          <CarouselContent>
            {data.results.map((movie: any) => (
              <CarouselItem key={movie.id} className=" h-screen">
                <Card className="relative h-full w-full overflow-hidden border-none rounded-none bg-black">
                  {movie.backdrop_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
                      alt={movie.title}
                      fill
                      priority={true}
                      className="object-cover object-center"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-zinc-900 text-zinc-500">
                      No Image Available
                    </div>
                  )}

                  <div className="absolute inset-0 z-20 bg-gradient-to-t from-black via-black/60 to-transparent" />
                  <div className="absolute inset-0 z-20 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

                  <div className="absolute bottom-0 left-0 z-30 flex h-full w-full flex-col justify-end p-8 md:p-16 lg:w-2/3 lg:p-24 text-white">
                    <Badge
                      variant="secondary"
                      className="mb-4 w-fit bg-white/20 text-white backdrop-blur-sm border-none md:text-sm px-3 py-1"
                    >
                      Popular Movie
                    </Badge>

                    <h2 className="text-4xl font-extrabold tracking-tight drop-shadow-lg md:text-6xl lg:text-7xl">
                      {movie.title}
                    </h2>

                    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-300 drop-shadow md:text-lg">
                      {movie.overview.length > 300
                        ? movie.overview.substring(0, 300) + "..."
                        : movie.overview}
                    </p>

                    <div className="mt-8 flex items-center gap-4">
                      <Button
                        size="lg"
                        className="bg-white text-black hover:bg-zinc-200 font-bold px-8"
                      >
                        Watch Trailer
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        className="bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 border-none px-8"
                      >
                        More Info
                      </Button>
                    </div>
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>
      
    </main>
  );
}
