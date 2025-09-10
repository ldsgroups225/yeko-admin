import * as motion from "motion/react-client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { generateId } from "@/lib/utils";

export function NewSchoolFormSkeleton() {
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
      className="space-y-6"
    >
      {/* Basic Information Card */}
      <motion.div variants={cardVariants}>
        <Card>
          <CardHeader>
            <motion.div
              className="h-6 w-48 rounded bg-muted/40 mb-2"
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
            <motion.div
              className="h-4 w-64 rounded bg-muted/30"
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.01, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2,
              }}
            />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={generateId()} className="space-y-2">
                <motion.div
                  className="h-4 w-24 rounded bg-muted/30"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
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
                  className="h-10 w-full rounded bg-muted/40"
                  animate={{
                    opacity: [0.4, 0.8, 0.4],
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
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Contact Information Card */}
      <motion.div variants={cardVariants}>
        <Card>
          <CardHeader>
            <motion.div
              className="h-6 w-40 rounded bg-muted/40 mb-2"
              animate={{
                opacity: [0.4, 0.8, 0.4],
                scale: [1, 1.01, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            />
            <motion.div
              className="h-4 w-56 rounded bg-muted/30"
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.01, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.7,
              }}
            />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={generateId()} className="space-y-2">
                <motion.div
                  className="h-4 w-20 rounded bg-muted/30"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.01, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.1 + 0.8,
                  }}
                />
                <motion.div
                  className="h-10 w-full rounded bg-muted/40"
                  animate={{
                    opacity: [0.4, 0.8, 0.4],
                    scale: [1, 1.01, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.1 + 0.9,
                  }}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Additional Settings Card */}
      <motion.div variants={cardVariants}>
        <Card>
          <CardHeader>
            <motion.div
              className="h-6 w-44 rounded bg-muted/40 mb-2"
              animate={{
                opacity: [0.4, 0.8, 0.4],
                scale: [1, 1.01, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.0,
              }}
            />
            <motion.div
              className="h-4 w-60 rounded bg-muted/30"
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.01, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.2,
              }}
            />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={generateId()} className="space-y-2">
                  <motion.div
                    className="h-4 w-16 rounded bg-muted/30"
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                      scale: [1, 1.01, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.1 + 1.3,
                    }}
                  />
                  <motion.div
                    className="h-10 w-full rounded bg-muted/40"
                    animate={{
                      opacity: [0.4, 0.8, 0.4],
                      scale: [1, 1.01, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.1 + 1.4,
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <motion.div
                className="h-4 w-32 rounded bg-muted/30"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.01, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5,
                }}
              />
              <motion.div
                className="h-10 w-full rounded bg-muted/40"
                animate={{
                  opacity: [0.4, 0.8, 0.4],
                  scale: [1, 1.01, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.6,
                }}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Form Actions */}
      <motion.div className="flex justify-end gap-4" variants={cardVariants}>
        <motion.div
          className="h-10 w-20 rounded bg-muted/40"
          animate={{
            opacity: [0.4, 0.8, 0.4],
            scale: [1, 1.01, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.7,
          }}
        />
        <motion.div
          className="h-10 w-32 rounded bg-muted/40"
          animate={{
            opacity: [0.4, 0.8, 0.4],
            scale: [1, 1.01, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.8,
          }}
        />
      </motion.div>
    </motion.div>
  );
}

export default NewSchoolFormSkeleton;
