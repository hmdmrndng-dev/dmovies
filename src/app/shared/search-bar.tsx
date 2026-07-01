"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { IconSearch, IconX } from "@tabler/icons-react";
import { Button } from "../../components/ui/button";

export function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(!!searchParams.get("q"));

  useEffect(() => {
    const currentQuery = searchParams.get("q") || "";
    setQuery(currentQuery);
    if (currentQuery) {
      setIsOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (pathname === "/search" && !query.trim()) {
      router.push("/");
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        const targetUrl = `/search?q=${encodeURIComponent(query.trim())}`;
        if (pathname === "/search") {
          router.replace(targetUrl);
        } else {
          router.push(targetUrl);
        }
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, router, pathname]);

  const handleClear = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  const handleOpenSearch = () => {
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 80);
  };

  return (
    <div className="flex items-center">
      {/* Mobile-only Trigger Icon (Hidden when search is open) */}
      <Button
        type="button"
        onClick={handleOpenSearch}
        variant="ghost"
        size="icon"
        className={cn("md:hidden size-8", isOpen && "hidden")}
        aria-label="Open search"
      >
        <IconSearch className="size-3.5" />
      </Button>

      {/* Main Search Container */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          // Desktop Defaults (Inline expansion)
          "md:relative md:flex md:items-center md:h-8 md:rounded-md md:overflow-hidden md:bg-transparent md:border-none md:p-0",
          isOpen ? (isFocused ? "md:w-72 lg:w-80" : "md:w-64") : "md:w-8",
          isOpen &&
            isFocused &&
            "md:border-primary/50 md:bg-background md:ring-2 md:ring-primary/20",
          // Mobile Behavior (Drops down below the fixed navbar)
          isOpen
            ? "absolute left-0 top-full flex items-center w-full h-14 bg-background border-b border-border px-6 z-50 shadow-md md:shadow-none"
            : "hidden md:flex", // Hide container entirely on mobile when closed
        )}
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="Search movies & TV shows..."
          value={query}
          onClick={handleOpenSearch}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            if (!query.trim()) {
              setIsOpen(false);
            }
          }}
          className={cn(
            "w-full h-full bg-transparent outline-none text-foreground transition-opacity duration-200",
            "text-base text-sm",
            "pl-4 pr-8",
            isOpen
              ? "opacity-100 placeholder:text-muted-foreground"
              : "opacity-0 placeholder:text-transparent cursor-pointer md:cursor-text",
          )}
        />

        {/* Right-side Icons */}
        <div className="absolute right-6 md:right-2 flex items-center justify-center h-full top-0 z-10 pointer-events-none">
          {query ? (
            <Button
              // We use onMouseDown + preventDefault so it doesn't trigger the input's onBlur prematurely
              onMouseDown={(e) => {
                e.preventDefault();
                handleClear();
              }}
              variant="ghost"
              className="pointer-events-auto text-muted-foreground hover:bg-transparent transition-colors p-1 h-auto"
              aria-label="Clear search"
            >
              <IconX className="size-5 md:size-3.5" />
            </Button>
          ) : (
            <>
              {/* Mobile Close Button (Shows when open but empty) */}
              <Button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setIsOpen(false);
                }}
                variant="ghost"
                className="pointer-events-auto text-muted-foreground md:hidden hover:bg-transparent p-1 h-auto"
                aria-label="Close search"
              >
                <IconX className="size-3.5" />
              </Button>

              {/* Desktop Search Icon */}
              <Button
                type="button"
                onClick={handleOpenSearch}
                variant="ghost"
                disabled={isOpen}
                className={cn(
                  "hidden md:flex text-muted-foreground transition-colors duration-200 p-1 h-auto",
                  !isOpen
                    ? "pointer-events-auto hover:bg-transparent cursor-pointer"
                    : "pointer-events-none",
                )}
                aria-label="Open search"
              >
                <IconSearch className="size-3.5" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
