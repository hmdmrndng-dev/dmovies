"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import StackIcon from "tech-stack-icons";
import { useTheme } from "next-themes";
import Link from "next/link";

export function Footer() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    setMounted(true);
  }, []);

  const iconVariant = mounted && resolvedTheme === "dark" ? "dark" : "light";

  return (
    <footer className="w-full border-t bg-background text-muted-foreground">
      <div className="mx-auto max-w-5xl px-6 py-8 md:py-10 flex flex-col gap-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-4 text-xs">
            <div className="flex flex-col items-center gap-2 sm:flex-row">
              <span className="font-medium text-muted-foreground/80">
                Built with
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <StackIcon
                  name="typescript"
                  className="h-5 w-auto"
                  variant={iconVariant}
                />
                <StackIcon
                  name="react"
                  className="h-5 w-auto"
                  variant={iconVariant}
                />
                <StackIcon
                  name="nextjs"
                  className="h-5 w-auto"
                  variant={iconVariant}
                />
                <StackIcon
                  name="shadcnui"
                  className="h-5 w-auto"
                  variant={iconVariant}
                />
                <StackIcon
                  name="tailwindcss"
                  className="h-5 w-auto"
                  variant={iconVariant}
                />
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 sm:flex-row">
              <span className="font-medium text-muted-foreground/80">
                Deployed on
              </span>
              <StackIcon
                name="vercel"
                className="h-5 w-auto"
                variant={iconVariant}
              />
            </div>
          </div>

          <div className="flex flex-col items-center gap-2.5 md:items-end text-center md:text-right">
            <div className="relative h-4 w-24 [backface-visibility:hidden]">
              <Image
                src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
                alt="The Movie Database (TMDB) Logo"
                fill
                loading="lazy"
                sizes="96px"
                className="object-contain pointer-events-none opacity-75 hover:opacity-100 transition-opacity duration-200"
              />
            </div>
            <p className="text-[11px] sm:text-xs leading-normal max-w-[280px]">
              This product uses the TMDB API but is not endorsed or certified by
              TMDB.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row text-[11px] sm:text-xs text-muted-foreground/60">
          <p>
            &copy; 2026 Designed & Developed by{" "}
            <a
              href="https://hmdmrndng.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
            >
              hmdmrndng
            </a>
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
    </footer>
  );
}
