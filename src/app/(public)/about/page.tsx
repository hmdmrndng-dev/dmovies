import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="w-full h-screen px-6 xl:px-24 flex flex-col items-center justify-center bg-background text-foreground">
      <div className="max-w-md w-full space-y-8 text-center flex flex-col items-center">
        <div className="flex flex-col items-center gap-6 p-8 rounded-lg bg-card border text-card-foreground w-full shadow-sm">
          <div className="flex items-center justify-center h-14 w-full">
            <div className="relative h-full w-64 [backface-visibility:hidden]">
              <Image
                src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
                alt="The Movie Database (TMDB) Logo"
                fill
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 256px"
                className="object-contain pointer-events-none opacity-80 hover:opacity-100 transition-opacity duration-200"
              />
            </div>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground leading-normal max-w-[280px]">
            This product uses the TMDB API but is not endorsed or certified by
            TMDB.
          </p>

          <Link
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
          >
            Visit themoviedb.org
          </Link>
        </div>
      </div>
    </main>
  );
}
