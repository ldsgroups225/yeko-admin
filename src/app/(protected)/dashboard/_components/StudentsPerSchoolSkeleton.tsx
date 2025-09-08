import * as motion from "motion/react-client";
import { generateId } from "@/lib/utils";

export function StudentsPerSchoolSkeleton({
  rows = 5,
}: {
  /** How many placeholder rows to render */
  rows?: number;
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30, scale: 0.9 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30,
        duration: 0.6,
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
          className="flex items-center justify-between"
          variants={itemVariants}
        >
          <div className="flex items-center gap-3 min-w-0">
            <motion.div
              className="h-8 w-8 flex-shrink-0 rounded-full bg-muted/40"
              animate={{
                opacity: [0.4, 0.8, 0.4],
                scale: [1, 1.05, 1],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.08,
              }}
            />

            <div className="min-w-0">
              <motion.div
                className="h-4 w-40 rounded bg-muted/40"
                animate={{
                  opacity: [0.4, 0.8, 0.4],
                  scale: [1, 1.01, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.08 + 0.2,
                }}
              />
            </div>
          </div>

          <div className="text-right min-w-[56px]">
            <motion.div
              className="h-4 w-12 rounded bg-muted/40 mx-auto"
              animate={{
                opacity: [0.4, 0.8, 0.4],
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.08 + 0.3,
              }}
            />
            <motion.div
              className="h-3 w-16 rounded bg-muted/30 mt-1 mx-auto"
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.01, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.08 + 0.4,
              }}
            />
          </div>
        </motion.li>
      ))}
    </motion.ul>
  );
}

export default StudentsPerSchoolSkeleton;
