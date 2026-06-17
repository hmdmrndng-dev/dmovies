"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { IconSearch, IconX } from "@tabler/icons-react";

export function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  useEffect(() => {
    if (pathname === "/search" && !query.trim()) {
      router.push("/");
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

  return (
    <div
      className={cn(
        "relative flex items-center w-full max-w-xs transition-all duration-200",
        isFocused && "max-w-sm",
      )}
    >
      <IconSearch
        className={cn(
          "absolute left-3 size-4 transition-colors duration-200 pointer-events-none",
          isFocused ? "text-primary" : "text-muted-foreground",
        )}
      />
      <input
        ref={inputRef}
        type="text"
        placeholder="Search movies & TV shows..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(
          "w-full rounded-full border bg-muted/60 pl-9 pr-8 py-1.5 text-sm text-foreground placeholder:text-muted-foreground",
          "outline-none transition-all duration-200",
          "border-border hover:border-border/80 hover:bg-muted/80",
          "focus:border-primary/50 focus:bg-background focus:ring-2 focus:ring-primary/20",
        )}
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-2.5 rounded-full p-0.5 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Clear search"
        >
          <IconX className="size-3.5" />
        </button>
      )}
    </div>
  );
}
