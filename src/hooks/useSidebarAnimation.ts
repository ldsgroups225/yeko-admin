"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";

export function useSidebarAnimation() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  const activeItem = useMemo(() => {
    return pathname;
  }, [pathname]);

  const getAnimationVariants = () => ({
    hidden: {
      opacity: 0,
      x: -20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30,
      },
    },
    hover: {
      x: 2,
      scale: 1.01,
      transition: {
        type: "spring" as const,
        stiffness: 500,
        damping: 30,
        mass: 0.8,
      },
    },
    tap: {
      scale: 0.99,
      transition: {
        type: "spring" as const,
        stiffness: 600,
        damping: 25,
      },
    },
  });

  const getIconVariants = () => ({
    idle: {
      rotate: 0,
      scale: 1,
    },
    hover: {
      rotate: 2,
      scale: 1.05,
      transition: {
        type: "spring" as const,
        stiffness: 600,
        damping: 30,
        mass: 0.6,
      },
    },
    active: {
      rotate: [0, 2, -2, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatDelay: 4,
        ease: "easeInOut" as const,
      },
    },
  });

  return {
    isActive,
    activeItem,
    getAnimationVariants,
    getIconVariants,
  };
}
