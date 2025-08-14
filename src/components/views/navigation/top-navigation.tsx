/**
 * Top Navigation Component - Updated on 12/09/2025
 * Features: Tech crypto aesthetic navigation with glassmorphism and user dropdown
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
    void signOut({ callbackUrl: "/signin" });
  };

  return null;

  // return (
  //   <nav className="glass-card border-b border-border/50 backdrop-blur-xl bg-background/80 px-4 py-4 sticky top-0 z-50">
  //     <div className="mx-auto flex max-w-6xl items-center justify-between">
  //       {/* User Section */}
  //       <div className="flex items-center gap-4">
  //         {status === "loading" ? (
  //           <div className="h-10 w-10 animate-pulse rounded-full bg-primary/20 border-2 border-primary/30" />
  //         ) : session?.user ? (
  //           <DropdownMenu>
  //             <DropdownMenuTrigger asChild>
  //               <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:scale-110 hover:glow-effect">
  //                 <Avatar className="h-10 w-10 ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-300">
  //                   <AvatarImage
  //                     src={session.user.profile_image_url}
  //                     alt={session.user.username || "User"}
  //                   />
  //                   <AvatarFallback className="bg-primary/10 text-primary font-bold">
  //                     {session.user.username?.[0]?.toUpperCase() || "U"}
  //                   </AvatarFallback>
  //                 </Avatar>
  //               </Button>
  //             </DropdownMenuTrigger>
  //             <DropdownMenuContent className="w-64 glass-card tech-border rounded-2xl p-2" align="end" forceMount>
  //               <DropdownMenuLabel className="font-normal p-3">
  //                 <div className="flex flex-col space-y-2">
  //                   <p className="text-sm font-semibold leading-none">
  //                     {session.user.name}
  //                   </p>
  //                   <p className="text-xs leading-none text-muted-foreground">
  //                     @{session.user.username}
  //                   </p>
  //                 </div>
  //               </DropdownMenuLabel>
  //               <DropdownMenuSeparator className="bg-border/50" />
  //               <DropdownMenuItem asChild>
  //                 <Link href="/profile" className="flex items-center gap-3 cursor-pointer rounded-xl p-3 hover:bg-primary/10 transition-colors">
  //                   <div className="p-1 rounded-lg bg-primary/10">
  //                     <User className="h-4 w-4 text-primary" />
  //                   </div>
  //                   Profile
  //                 </Link>
  //               </DropdownMenuItem>
  //               <DropdownMenuSeparator className="bg-border/50" />
  //               <DropdownMenuItem
  //                 onClick={handleSignOut}
  //                 className="flex items-center gap-3 cursor-pointer rounded-xl p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
  //               >
  //                 <div className="p-1 rounded-lg bg-red-500/10">
  //                   <LogOut className="h-4 w-4" />
  //                 </div>
  //                 Sign out
  //               </DropdownMenuItem>
  //             </DropdownMenuContent>
  //           </DropdownMenu>
  //         ) : (
  //           <Button asChild size="sm" className="rounded-2xl">
  //             <Link href="/signin">Sign in</Link>
  //           </Button>
  //         )}
  //       </div>
  //     </div>
  //   </nav>
  // );
}
