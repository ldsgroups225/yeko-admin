import * as motion from "motion/react-client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { generateId } from "@/lib/utils";

export function SchoolsListSkeleton({ rows = 6 }: { rows?: number }) {
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

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {Array.from({ length: rows }).map((_, index) => (
        <motion.div
          key={generateId()}
          variants={cardVariants}
          className="h-full"
        >
          <Card aria-hidden className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <motion.div
                    className="h-6 w-3/4 rounded bg-muted/40 mb-2"
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
                    className="h-4 w-1/2 rounded bg-muted/30"
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
                <motion.div
                  className="h-6 w-16 rounded-full bg-muted/40"
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
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <motion.div
                    className="h-3 w-12 rounded bg-muted/30 mb-1"
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                      scale: [1, 1.01, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.1 + 0.4,
                    }}
                  />
                  <motion.div
                    className="h-4 w-16 rounded bg-muted/40"
                    animate={{
                      opacity: [0.4, 0.8, 0.4],
                      scale: [1, 1.01, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.1 + 0.5,
                    }}
                  />
                </div>
                <div>
                  <motion.div
                    className="h-3 w-12 rounded bg-muted/30 mb-1"
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                      scale: [1, 1.01, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.1 + 0.6,
                    }}
                  />
                  <motion.div
                    className="h-4 w-20 rounded bg-muted/40"
                    animate={{
                      opacity: [0.4, 0.8, 0.4],
                      scale: [1, 1.01, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.1 + 0.7,
                    }}
                  />
                </div>
              </div>

              <motion.div
                className="h-4 w-24 rounded bg-muted/40"
                animate={{
                  opacity: [0.4, 0.8, 0.4],
                  scale: [1, 1.01, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.1 + 0.8,
                }}
              />

              <div className="space-y-2">
                <motion.div
                  className="h-3 w-16 rounded bg-muted/30"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.01, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.1 + 0.9,
                  }}
                />
                <motion.div
                  className="h-3 w-20 rounded bg-muted/30"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.01, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.1 + 1.0,
                  }}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <motion.div
                  className="h-8 flex-1 rounded bg-muted/40"
                  animate={{
                    opacity: [0.4, 0.8, 0.4],
                    scale: [1, 1.01, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.1 + 1.1,
                  }}
                />
                <motion.div
                  className="h-8 flex-1 rounded bg-muted/40"
                  animate={{
                    opacity: [0.4, 0.8, 0.4],
                    scale: [1, 1.01, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.1 + 1.2,
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default SchoolsListSkeleton;
