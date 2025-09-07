"use client";

import { UserPlus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { actionButtons } from "@/constants";

export const NavbarActionButton = () => {
  const pathname = usePathname();
  const [actionButton, setActionButton] = useState<
    (typeof actionButtons)[0] | null
  >(null);

  useEffect(() => {
    const button = actionButtons.find((button) => button.parent === pathname);
    setActionButton(button || null);
  }, [pathname]);

  if (!actionButton) return null;

  return (
    <Button variant="outline" size="sm" className="ml-auto" asChild>
      <Link href={actionButton.href}>
        <UserPlus className="h-4 w-4 mr-2" />
        {actionButton.title}
      </Link>
    </Button>
  );
};
