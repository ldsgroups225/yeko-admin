import * as motion from "motion/react-client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { generateId } from "@/lib/utils";

export function SchoolStudentsListSkeleton({ rows = 5 }: { rows?: number }) {
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
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Card>
        <CardHeader>
          <motion.div
            className="h-6 w-48 rounded bg-muted/40"
            animate={{
              opacity: [0.4, 0.8, 0.4],
              scale: [1, 1.01, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </CardHeader>
        <CardContent>
          <motion.div className="space-y-4" variants={cardVariants}>
            {Array.from({ length: rows }).map((_, index) => (
              <motion.div
                key={generateId()}
                className="flex items-center justify-between p-3 border border-border rounded-lg"
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
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    className="h-10 w-10 rounded-full bg-muted/40"
                    animate={{
                      opacity: [0.4, 0.8, 0.4],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.1 + 0.2,
                    }}
                  />
                  <div className="space-y-2">
                    <motion.div
                      className="h-4 w-32 rounded bg-muted/40"
                      animate={{
                        opacity: [0.4, 0.8, 0.4],
                        scale: [1, 1.01, 1],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.1 + 0.3,
                      }}
                    />
                    <motion.div
                      className="h-3 w-24 rounded bg-muted/30"
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
                  </div>
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
                    delay: index * 0.1 + 0.5,
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default SchoolStudentsListSkeleton;
