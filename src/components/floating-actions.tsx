"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { IconSun, IconMoon } from "@tabler/icons-react";

export function FloatingActions() {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col sm:flex-row gap-2 pointer-events-auto">
      <Button
        variant="outline"
        size="lg"
        className="rounded-full shadow-lg bg-background"
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      >
        <IconSun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
        <IconMoon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  );
}
