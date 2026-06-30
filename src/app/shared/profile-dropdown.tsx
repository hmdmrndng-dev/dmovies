"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IconLogout, IconUser, IconLogin } from "@tabler/icons-react";
import LoginDialog from "./login-dialog";
import { toast } from "sonner";

interface ProfileDropdownProps {
  user: {
    username: string;
    avatar: {
      tmdb: {
        avatar_path: string | null;
      };
      gravatar: {
        hash: string;
      };
    };
  } | null;
}

export default function ProfileDropdown({ user }: ProfileDropdownProps) {
  const router = useRouter();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const avatarPath = user?.avatar?.tmdb?.avatar_path;

  const buttonStyle = "relative h-8 w-8 rounded-md";

  async function handleLogout() {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        toast.success("Logged out successfully", {
          description: "See you next time!",
        });
        router.refresh();
      } else {
        toast.error("Failed to log out", {
          description: "Please try again later.",
        });
      }
    } catch (error) {
      console.error("Failed to destroy session during logout:", error);
      toast.error("An unexpected error occurred.");
    }
  }

  // 🎯 GUEST STATE (Matches closed SearchBar shape)
  if (!user) {
    return (
      <>
        <Button
          variant="ghost"
          onClick={() => setIsLoginOpen(true)}
          className={buttonStyle}
          aria-label="Sign In"
        >
          <IconLogin className="h-4 w-4" />
        </Button>

        <LoginDialog
          isOpen={isLoginOpen}
          onOpenChange={setIsLoginOpen}
          onSuccess={() => {
            toast.success("Welcome back!", {
              description: "You have successfully logged in.",
            });
            router.refresh();
          }}
        />
      </>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={buttonStyle}>
          {avatarPath ? (
            <img
              src={`https://image.tmdb.org/t/p/w150_and_h150_face${avatarPath}`}
              alt={user.username}
              className="h-full w-full rounded-md object-cover" // 🎯 Changed to rounded-md to match the button frame
            />
          ) : (
            <IconUser className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 mt-1 shadow-xl" align="end">
        <DropdownMenuLabel className="font-normal py-2.5 px-3">
          <div className="flex flex-col space-y-0.5">
            <p className="text-xs font-medium">Logged in as</p>
            <p className="text-sm font-semibold tracking-tight truncate">
              {user.username}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="text-red-400 focus:bg-red-500/10 focus:text-red-400 cursor-pointer gap-2 py-2 px-3 transition-colors"
        >
          <IconLogout className="h-4 w-4" />
          <span className="font-medium text-sm">Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
