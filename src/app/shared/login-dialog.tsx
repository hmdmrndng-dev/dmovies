"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconLoader, IconLock, IconUser } from "@tabler/icons-react";

interface LoginDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function LoginDialog({
  isOpen,
  onOpenChange,
  onSuccess,
}: LoginDialogProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid username or password");
      }

      setUsername("");
      setPassword("");
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {/* 🎯 Theme Mapping: Updated canvas wrapper to semantic variables */}
      <DialogContent className="w-[90vw] sm:max-w-[420px] p-6 border border-border bg-background text-foreground shadow-2xl">
        <DialogHeader className="space-y-1.5">
          <DialogTitle className="text-xl font-bold tracking-tight">
            Sign in to TMDB
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Use your official TMDB account details to rate movies and manage
            your watchlist.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleLogin} className="space-y-4 pt-2">
          {error && (
            <div className="p-3 text-xs font-medium bg-destructive/10 border border-destructive/20 text-destructive rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <Label
              htmlFor="username"
              className="text-xs font-semibold text-foreground/90"
            >
              Username
            </Label>
            <div className="relative">
              {/* 🎯 Theme Mapping: Muted foreground for secondary elements */}
              <IconUser className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
              <Input
                id="username"
                type="text"
                required
                disabled={isLoading}
                placeholder="Your TMDB username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-9 bg-background border-input text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="password"
              className="text-xs font-semibold text-foreground/90"
            >
              Password
            </Label>
            <div className="relative">
              <IconLock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
              <Input
                id="password"
                type="password"
                required
                disabled={isLoading}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 bg-background border-input text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          </div>

          <DialogFooter className="pt-2 flex flex-col gap-2 sm:flex-row-reverse">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto font-medium"
            >
              {isLoading ? (
                <>
                  <IconLoader className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Login"
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={isLoading}
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}