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
      router.back();
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
    <div
      className={cn(
        "relative flex items-center h-8 rounded-md transition-all duration-300 ease-in-out overflow-hidden",
        isOpen ? (isFocused ? "w-72 sm:w-80" : "w-64") : "w-8",
        isOpen &&
          isFocused &&
          "border-primary/50 bg-background ring-2 ring-primary/20",
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
          "w-full h-full bg-transparent outline-none text-sm text-foreground pl-4 pr-8 transition-opacity duration-200",
          isOpen
            ? "opacity-100 placeholder:text-muted-foreground"
            : "opacity-0 placeholder:text-transparent cursor-pointer",
        )}
      />

      <div className="absolute right-3 flex items-center justify-center size-3.5 z-10 pointer-events-none">
        {query ? (
          <Button
            onClick={handleClear}
            variant="ghost"
            className="pointer-events-auto text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <IconX className="size-3.5" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleOpenSearch}
            variant="ghost"
            disabled={isOpen}
            className={cn(
              "text-muted-foreground transition-colors duration-200 size-3.5",
              !isOpen
                ? "pointer-events-auto hover:text-foreground cursor-pointer"
                : "pointer-events-none",
            )}
            aria-label="Open search"
          >
            <IconSearch className="size-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
