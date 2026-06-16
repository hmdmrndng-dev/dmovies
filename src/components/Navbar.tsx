"use client";

import Link from "next/link";
import { useState } from "react";
import {
  IconChevronDown,
  IconMenu2,
  IconMoon,
  IconSun,
  IconX,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const { resolvedTheme, setTheme } = useTheme();

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
                  className={buttonVariants({ variant: "ghost", size: "lg" })}
                >
                  {item.label}
                </Link>
              </li>
            ),
          )}
        </ul>

        <div className="ml-auto flex items-center gap-1">
          <Button
            variant="ghost"
            size="lg"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
          >
            <IconSun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <IconMoon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            <span className="sr-only">Toggle theme</span>
          </Button>

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
            {NAV_ITEMS.map((item) =>
              item.children ? (
                <li key={item.label}>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="w-full justify-between"
                    onClick={() =>
                      setMobileExpanded((prev) =>
                        prev === item.label ? null : item.label,
                      )
                    }
                  >
                    {item.label}
                    <IconChevronDown
                      className={cn(
                        "size-3.5 transition-transform",
                        mobileExpanded === item.label && "rotate-180",
                      )}
                    />
                  </Button>
                  {mobileExpanded === item.label && (
                    <ul className="ml-3 mt-1 flex flex-col border-l border-border pl-3">
                      {item.children.map((child) => (
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
                <li key={item.label}>
                  <Link
                    href={item.href!}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "lg" }),
                      "w-full justify-start",
                    )}
                    onClick={closeMobile}
                  >
                    {item.label}
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
      <Button variant="ghost" size="lg" className={cn(isOpen && "bg-muted")}>
        {item.label}
        <IconChevronDown
          className={cn(
            "size-3.5 transition-transform",
            isOpen && "rotate-180",
          )}
        />
      </Button>

      {isOpen && (
        <ul className="absolute left-0 top-full z-50 min-w-44 rounded-md border border-border bg-popover p-1 shadow-md">
          {item.children!.map((child) => (
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
