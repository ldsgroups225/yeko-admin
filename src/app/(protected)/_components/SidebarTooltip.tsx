"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SidebarTooltipProps {
  content: string;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
}

export function SidebarTooltip({
  content,
  children,
  side = "right",
  className,
}: SidebarTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const getTooltipPosition = () => {
    switch (side) {
      case "top":
        return "bottom-full left-1/2 -translate-x-1/2 mb-2";
      case "right":
        return "left-full top-1/2 -translate-y-1/2 ml-2";
      case "bottom":
        return "top-full left-1/2 -translate-x-1/2 mt-2";
      case "left":
        return "right-full top-1/2 -translate-y-1/2 mr-2";
      default:
        return "left-full top-1/2 -translate-y-1/2 ml-2";
    }
  };

  const getArrowPosition = () => {
    switch (side) {
      case "top":
        return "top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-muted";
      case "right":
        return "right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-muted";
      case "bottom":
        return "bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-muted";
      case "left":
        return "left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-muted";
      default:
        return "right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-muted";
    }
  };

  return (
    <button
      type="button"
      className="relative"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            role="tooltip"
            aria-live="polite"
            className={cn(
              "absolute z-50 rounded-lg bg-muted px-2 py-1 text-xs text-muted-foreground shadow-lg",
              getTooltipPosition(),
              className,
            )}
          >
            {content}
            <div
              className={cn("absolute h-0 w-0 border-4", getArrowPosition())}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
