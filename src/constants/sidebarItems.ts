import { BarChart3, Building2, Settings, Users } from "lucide-react";

// Define the sidebar item interface
interface SidebarItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Define sidebar items with const assertion for strict typing
export const sidebarItems = [
  {
    title: "Tableau de bord",
    href: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "Écoles",
    href: "/schools",
    icon: Building2,
  },
  {
    title: "Utilisateurs",
    href: "/users",
    icon: Users,
  },
  {
    title: "Paramètres",
    href: "/settings",
    icon: Settings,
  },
] as const satisfies readonly SidebarItem[];

// Extract valid parent hrefs from sidebarItems
type ActionButtonParent = (typeof sidebarItems)[number]["href"];

// Define ActionButton interface with strict parent validation
interface ActionButton {
  title: string;
  parent: ActionButtonParent;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Define action buttons with strict type checking
export const actionButtons: ActionButton[] = [
  {
    title: "Nouvelle école",
    parent: "/schools",
    href: "/schools/new",
    icon: Building2,
  },
  {
    title: "Nouvel utilisateur",
    parent: "/users",
    href: "/users/new",
    icon: Users,
  },
];
