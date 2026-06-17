"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { IconChevronDown, IconMenu2, IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Button, buttonVariants } from "@/components/ui/button";
import { Command } from "./ui/command";
import { SearchBar } from "./search-bar";

type NavLink = { label: string; href: string };
type NavItem = { label: string; href?: string; children?: NavLink[] };

const NAV_ITEMS: NavItem[] = [
  {
    label: "Movies",
    children: [
      { label: "Popular", href: "/movies/popular" },
      { label: "Now Playing", href: "/movies/now-playing" },
      { label: "Upcoming", href: "/movies/upcoming" },
      { label: "Top Rated", href: "/movies/top-rated" },
    ],
  },
  {
    label: "TV Shows",
    children: [
      { label: "Popular", href: "/tv/popular" },
      { label: "Airing Today", href: "/tv/airing-today" },
      { label: "On The Air", href: "/tv/on-the-air" },
      { label: "Top Rated", href: "/tv/top-rated" },
    ],
  },
  { label: "People", href: "/people" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const [open, setOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  const closeMobile = () => {
    setMobileOpen(false);
    setMobileExpanded(null);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="flex w-full items-center px-6 py-3 md:px-24 md:py-4">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-primary"
          onClick={closeMobile}
        >
          dmovies
        </Link>

        {/* Desktop nav */}
        <ul className="ml-auto hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((data) =>
            data.children ? (
              <DropdownItem
                key={data.label}
                item={data}
                isOpen={open === data.label}
                onOpen={() => setOpen(data.label)}
                onClose={() => setOpen(null)}
              />
            ) : (
              <li key={data.label}>
                <Link
                  href={data.href!}
                  className={buttonVariants({ variant: "ghost", size: "lg" })}
                >
                  {data.label}
                </Link>
              </li>
            ),
          )}
        </ul>

        <div className="ml-auto flex items-center gap-1">
          <Suspense>
            <SearchBar />
          </Suspense>
          <Button
            variant="ghost"
            size="lg"
            className="md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <IconX /> : <IconMenu2 />}
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="bg-background/95 px-4 pb-4 md:hidden">
          <ul className="flex flex-col gap-1 pt-2">
            {NAV_ITEMS.map((data) =>
              data.children ? (
                <li key={data.label}>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="w-full justify-between"
                    onClick={() =>
                      setMobileExpanded((prev) =>
                        prev === data.label ? null : data.label,
                      )
                    }
                  >
                    {data.label}
                    <IconChevronDown
                      className={cn(
                        "size-3.5 transition-transform",
                        mobileExpanded === data.label && "rotate-180",
                      )}
                    />
                  </Button>
                  {mobileExpanded === data.label && (
                    <ul className="ml-3 mt-1 flex flex-col border-l border-border pl-3">
                      {data.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className={cn(
                              buttonVariants({ variant: "ghost", size: "lg" }),
                              "w-full justify-start",
                            )}
                            onClick={closeMobile}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ) : (
                <li key={data.label}>
                  <Link
                    href={data.href!}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "lg" }),
                      "w-full justify-start",
                    )}
                    onClick={closeMobile}
                  >
                    {data.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </div>
      )}
    </header>
  );
}

function DropdownItem({
  item: data,
  isOpen,
  onOpen,
  onClose,
}: {
  item: NavItem;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  return (
    <li className="relative" onMouseEnter={onOpen} onMouseLeave={onClose}>
      <Button variant="ghost" size="lg" className={cn(isOpen && "bg-muted")}>
        {data.label}
        <IconChevronDown
          className={cn(
            "size-3.5 transition-transform",
            isOpen && "rotate-180",
          )}
        />
      </Button>

      {isOpen && (
        <ul className="absolute left-0 top-full z-50 min-w-44 rounded-md border border-border bg-popover p-1 shadow-md">
          {data.children!.map((child) => (
            <li key={child.href}>
              <Link
                href={child.href}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "lg" }),
                  "w-full justify-start",
                )}
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
