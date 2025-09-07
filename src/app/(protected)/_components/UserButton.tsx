import { LogOut } from "lucide-react";
import Image from "next/image";
import { signOutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { fetchUserProfile } from "@/services";

export async function UserButton() {
  const user = await fetchUserProfile();

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
        <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center shadow-medium">
          {user.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={user.fullName || "User"}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <span className="text-sm font-bold text-primary-foreground">
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
