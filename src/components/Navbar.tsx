"use client";

import Link from "next/link";
import { useState } from "react";
import { IconChevronDown } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

type NavLink = { label: string; href: string };
type NavItem = { label: string; href?: string; children?: NavLink[] };

const NAV_ITEMS: NavItem[] = [
  {
    label: "Movies",
    href: "/movies",
    children: [
      { label: "Popular", href: "/movies/popular" },
      { label: "Now Playing", href: "/movies/now-playing" },
      { label: "Upcoming", href: "/movies/upcoming" },
      { label: "Top Rated", href: "/movies/top-rated" },
    ],
  },
  {
    label: "TV Shows",
    href: "/tv",
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

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <nav className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-4">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-primary"
        >
          dmovies
        </Link>

        <ul className="ml-auto flex items-center gap-1">
          {NAV_ITEMS.map((item) =>
            item.children ? (
              <DropdownItem
                key={item.label}
                item={item}
                isOpen={open === item.label}
                onOpen={() => setOpen(item.label)}
                onClose={() => setOpen(null)}
              />
            ) : (
              <li key={item.label}>
                <Link
                  href={item.href!}
                  className="rounded-md px-3 py-1.5 text-sm font-medium text-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ),
          )}
        </ul>
      </nav>
    </header>
  );
}

function DropdownItem({
  item,
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
      <Link
        href={item.href!}
        className={cn(
          "flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-foreground/70 transition-colors hover:bg-muted hover:text-foreground sticky",
          isOpen && "bg-muted text-foreground",
        )}
      >
        {item.label}
        <IconChevronDown
          className={cn(
            "size-3.5 transition-transform",
            isOpen && "rotate-180",
          )}
        />
      </Link>

      {isOpen && (
        <ul className="absolute left-0 top-full z-50 min-w-44 rounded-md border border-border bg-popover p-1 shadow-md">
          {item.children!.map((child) => (
            <li key={child.href}>
              <Link
                href={child.href}
                className="block rounded px-3 py-1.5 text-sm text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
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
