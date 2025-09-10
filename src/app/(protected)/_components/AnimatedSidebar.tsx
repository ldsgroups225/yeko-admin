"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { sidebarItems } from "@/constants";
import { useSidebarAnimation } from "@/hooks/useSidebarAnimation";
import { cn } from "@/lib/utils";
import { SidebarTooltip } from "./SidebarTooltip";

interface AnimatedSidebarProps {
  className?: string;
}

export function AnimatedSidebar({ className }: AnimatedSidebarProps) {
  const { isActive, getAnimationVariants, getIconVariants } =
    useSidebarAnimation();
  const animationVariants = getAnimationVariants();
  const iconVariants = getIconVariants();

  return (
    <div className={cn("space-y-1", className)}>
      {sidebarItems.map((item, index) => {
        const active = isActive(item.href);

        return (
          <motion.div
            key={item.href}
            variants={animationVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
            transition={{
              delay: index * 0.1,
            }}
          >
            <SidebarTooltip content={item.title} side="right">
              <Link
                href={item.href}
                prefetch={true}
                className={cn(
                  "group relative flex items-center space-x-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-out",
                  "hover:bg-muted/60 hover:shadow-sm",
                  active
                    ? "bg-primary/10 text-primary shadow-soft border border-primary/20"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {/* Active indicator */}
                <AnimatePresence>
                  {active && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary"
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      exit={{ scaleY: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </AnimatePresence>

                {/* Icon with animation */}
                <motion.div
                  className="relative"
                  variants={iconVariants}
                  animate={active ? "active" : "idle"}
                  whileHover="hover"
                >
                  <item.icon
                    className={cn(
                      "h-4 w-4 transition-all duration-300",
                      active
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-primary",
                    )}
                  />

                  {/* Icon glow effect for active state */}
                  <AnimatePresence>
                    {active && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-primary/20 blur-sm"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1.2 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Text with staggered animation */}
                <motion.span
                  className={cn(
                    "transition-all duration-300",
                    active
                      ? "text-primary font-semibold"
                      : "group-hover:text-foreground",
                  )}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.1 }}
                >
                  {item.title}
                </motion.span>

                {/* Hover effect background */}
                <motion.div
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/8 to-transparent opacity-0"
                  whileHover={{
                    opacity: 1,
                    transition: {
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                      mass: 0.8,
                    },
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                    mass: 0.8,
                  }}
                />
              </Link>
            </SidebarTooltip>
          </motion.div>
        );
      })}
    </div>
  );
}
