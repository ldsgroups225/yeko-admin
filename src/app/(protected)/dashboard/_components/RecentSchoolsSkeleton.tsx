import * as motion from "motion/react-client";
import { generateId } from "@/lib/utils";

export function RecentSchoolSkeleton({ rows = 5 }: { rows?: number }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20, scale: 0.95 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30,
        duration: 0.5,
      },
    },
  };

  return (
    <motion.ul
      aria-hidden
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {Array.from({ length: rows }).map((_, index) => (
        <motion.li
          key={generateId()}
          className="flex items-center justify-between p-3 border border-border rounded-lg"
          variants={itemVariants}
        >
          <div className="flex-1 min-w-0">
            <motion.div
              className="h-4 w-3/5 rounded bg-muted/40 mb-2"
              animate={{
                opacity: [0.4, 0.8, 0.4],
                scale: [1, 1.01, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.1,
              }}
            />
            <motion.div
              className="h-3 w-1/2 rounded bg-muted/30"
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.01, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.1 + 0.2,
              }}
            />
          </div>

          <div className="ml-4 flex-shrink-0">
            <motion.div
              className="h-6 w-20 rounded-full bg-muted/40"
              animate={{
                opacity: [0.4, 0.8, 0.4],
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.1 + 0.3,
              }}
            />
          </div>
        </motion.li>
      ))}
    </motion.ul>
  );
}

export default RecentSchoolSkeleton;
