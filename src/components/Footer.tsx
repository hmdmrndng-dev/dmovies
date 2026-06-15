import React from "react";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background py-6">
      <div className="container justify-center max-w-7xl mx-auto px-4 flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-2 md:flex-row md:gap-4">
          <img
            src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
            alt="The Movie Database"
            className="h-4 w-auto object-contain opacity-70 contrast-200 transition-all duration-200"
          />
          <p className="max-w-[300px] text-center text-xs leading-normal text-muted-foreground md:text-left md:max-w-sm">
            This product uses the TMDB API but is not endorsed or certified by
            TMDB.
          </p>
        </div>
      </div>
    </footer>
  );
}
