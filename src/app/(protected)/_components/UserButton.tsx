"use client";

import { LogOut } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { signOutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types";

export function UserButton() {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const supabase = createClient();

        // Get current user
        const {
          data: { user: authUser },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !authUser) {
          console.error("Authentication error:", authError);
          setUser(null);
          return;
        }

        // Get user profile
        const { data: profile, error: profileError } = await supabase
          .from("users")
          .select("id, email, first_name, last_name, phone, avatar_url")
          .eq("id", authUser.id)
          .single();

        if (profileError || !profile) {
          console.error("Profile fetch error:", profileError);
          setUser(null);
          return;
        }

        // Build user profile
        const userProfile: Profile = {
          id: authUser.id,
          email: profile.email || "",
          firstName: profile.first_name ?? "",
          lastName: profile.last_name ?? "",
          fullName:
            `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim(),
          phoneNumber: profile.phone ?? "",
          avatarUrl: profile.avatar_url || null,
        };

        setUser(userProfile);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-muted animate-pulse"></div>
          <div className="flex-1 min-w-0">
            <div className="h-4 bg-muted rounded animate-pulse mb-1"></div>
            <div className="h-3 bg-muted rounded animate-pulse w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Generate initials from full name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all duration-200 group">
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center shadow-medium border border-primary">
          {user.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={user.fullName || "User"}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <span className="text-sm font-bold text-muted-foreground">
              {getInitials(user.fullName || "User")}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">
            {user.fullName}
          </p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>
      </div>
      <form action={signOutAction}>
        <Button
          variant="ghost"
          size="sm"
          type="submit"
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
