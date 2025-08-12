/**
 * Top Navigation Component - Created on 12/08/2025 16:48
 * Features: User dropdown with profile and sign out functionality
 */
"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { LogOut, User, Camera } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function TopNavigation() {
  const { data: session, status } = useSession();

  const handleSignOut = () => {
    signOut({ callbackUrl: "/signin" });
  };

  return (
    <nav className="border-b bg-background px-4 py-3">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        {/* Logo/Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-foreground hover:text-primary transition-colors"
        >
          <Camera className="h-6 w-6" />
          Ditto
        </Link>

        {/* User Section */}
        <div className="flex items-center gap-4">
          {status === "loading" ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
          ) : session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={session.user.profile_image_url}
                      alt={session.user.username || "User"}
                    />
                    <AvatarFallback>
                      {session.user.username?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session.user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      @{session.user.username}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <Link href="/signin">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
