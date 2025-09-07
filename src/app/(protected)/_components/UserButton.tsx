import { LogOut, Users } from "lucide-react";
import { signOutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { fetchUserProfile } from "@/services";

export async function UserButton() {
  const user = await fetchUserProfile();

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
          <Users className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {user.fullName}
          </p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>
      </div>
      <form action={signOutAction}>
        <Button variant="ghost" size="sm" type="submit">
          <LogOut className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
