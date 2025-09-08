import { Building2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { sidebarItems } from "@/constants";
import { generateId } from "@/lib/utils";
import { UserButton } from "./_components";

interface Props {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: Props) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-background via-background/95 to-muted/30 relative overflow-hidden">
        {/* Decorative Elements */}
        {/* Top left abstract shapes */}
        <div className="absolute top-10 left-10 opacity-10 z-0">
          <div className="w-24 h-18 border-2 border-border rounded-lg transform rotate-12"></div>
          <div className="w-12 h-12 bg-muted rounded-full absolute -top-2 -right-2"></div>
        </div>

        {/* Wavy lines - top right */}
        <div className="absolute top-20 right-32 opacity-20 z-0">
          <svg
            width="80"
            height="40"
            viewBox="0 0 80 40"
            className="text-muted-foreground"
            aria-label="Decorative waves"
          >
            <title>Decorative waves</title>
            <path
              d="M5 20 Q20 5, 35 20 T65 20"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M10 25 Q25 10, 40 25 T70 25"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
        </div>

        {/* Bottom left dotted pattern */}
        <div className="absolute bottom-16 left-16 z-0">
          <div className="grid grid-cols-4 gap-2 opacity-30">
            {Array.from({ length: 12 }).map(() => (
              <div
                key={`dot-left-${generateId()}`}
                className="w-2 h-2 bg-primary rounded-full"
              ></div>
            ))}
          </div>
        </div>

        {/* Bottom right geometric shapes */}
        <div className="absolute bottom-20 right-20 opacity-15 z-0">
          <div className="w-16 h-12 border-2 border-border rounded-lg"></div>
          <div className="w-8 h-8 bg-muted rounded-full absolute -bottom-1 -right-1"></div>
        </div>

        {/* Top center floating elements */}
        <div className="absolute top-32 left-1/2 transform -translate-x-1/2 opacity-10 z-0">
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map(() => (
              <div
                key={`dot-center-${generateId()}`}
                className="w-2 h-2 bg-primary rounded-full"
              ></div>
            ))}
          </div>
        </div>

        {/* Right side wavy decoration */}
        <div className="absolute bottom-40 right-40 opacity-20 z-0">
          <svg
            width="60"
            height="30"
            viewBox="0 0 60 30"
            className="text-muted-foreground"
            aria-label="Decorative wave"
          >
            <title>Decorative wave</title>
            <path
              d="M5 15 Q20 5, 35 15 T55 15"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
        </div>

        <Sidebar className="border-r border-border/50 relative z-10 bg-card/80 backdrop-blur-xl shadow-soft">
          <SidebarHeader className="border-b border-border/50 p-6">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-medium">
                <Building2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground tracking-tight">
                  Yeko Admin
                </h1>
                <p className="text-xs text-muted-foreground font-medium">
                  Gestion scolaire
                </p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="px-3 py-4">
            <SidebarMenu className="space-y-1">
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.href}
                      className="flex items-center space-x-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-muted/80 hover:shadow-soft group"
                    >
                      <item.icon className="h-4 w-4 transition-colors group-hover:text-primary" />
                      <span className="transition-colors group-hover:text-foreground">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="border-t border-border/50 p-4">
            <Suspense
              fallback={
                <div className="h-10 w-10 bg-muted rounded-full animate-pulse" />
              }
            >
              <UserButton />
            </Suspense>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col relative z-10">
          <header className="border-b border-border/50 bg-card/80 backdrop-blur-xl shadow-soft supports-[backdrop-filter]:bg-card/60">
            <div className="md:hidden flex h-16 items-center px-4 lg:px-6">
              <SidebarTrigger className="md:hidden" />
              <div className="flex-1" />
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6 lg:p-8 bg-background/30 backdrop-blur-sm">
            <div className="animate-fade-in">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
