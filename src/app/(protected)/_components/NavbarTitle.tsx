"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { actionButtons } from "@/constants";

// Page title mappings for better UX
const pageTitles: Record<string, { title: string; description: string }> = {
  "/dashboard": {
    title: "Tableau de bord",
    description: "Vue d'ensemble de votre plateforme de gestion scolaire",
  },
  "/schools": {
    title: "Écoles",
    description: "Gérez les écoles de votre plateforme",
  },
  "/users": {
    title: "Utilisateurs",
    description: "Gérez les membres de vos écoles",
  },
  "/settings": {
    title: "Paramètres",
    description: "Configurez votre plateforme",
  },
};

export const NavbarTitle = () => {
  const pathname = usePathname();
  const [actionButton, setActionButton] = useState<
    (typeof actionButtons)[0] | null
  >(null);
  const [pageInfo, setPageInfo] = useState<{
    title: string;
    description: string;
  } | null>(null);

  useEffect(() => {
    const button = actionButtons.find((button) => button.href === pathname);
    setActionButton(button || null);

    // Set page info for regular pages
    const info = pageTitles[pathname];
    setPageInfo(info || null);
  }, [pathname]);

  // Show action button context (for add/edit pages)
  if (actionButton) {
    return (
      <div className="flex items-center gap-4 animate-slide-up">
        <Button variant="outline" size="sm" asChild className="hover-lift">
          <Link href={actionButton.parent}>
            <ArrowLeft className="size-4 mr-2" />
            Retour
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <actionButton.icon className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {actionButton.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {actionButton.title.includes("école")
                ? "Ajouter une nouvelle école à la plateforme"
                : actionButton.title.includes("membre")
                  ? "Ajouter un nouveau membre à une école"
                  : "Créer un nouvel élément"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show regular page title
  if (pageInfo) {
    return (
      <div className="animate-slide-up">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          {pageInfo.title}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {pageInfo.description}
        </p>
      </div>
    );
  }

  return null;
};
