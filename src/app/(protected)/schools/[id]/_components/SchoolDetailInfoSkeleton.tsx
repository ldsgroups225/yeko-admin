import * as motion from "motion/react-client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function SchoolDetailInfoSkeleton() {
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
      {/* Header Card */}
      <motion.div variants={cardVariants}>
        <Card>
          <CardHeader>
            <motion.div
              className="h-8 w-3/4 rounded bg-muted/40 mb-2"
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
              className="h-4 w-1/2 rounded bg-muted/30"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    delay: 0.3,
                  }}
                />
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
                    delay: 0.4,
                  }}
                />
              </div>
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
                    delay: 0.5,
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
                    delay: 0.6,
                  }}
                />
              </div>
            </div>
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
                delay: 0.7,
              }}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Contact Info Card */}
      <motion.div variants={cardVariants}>
        <Card>
          <CardHeader>
            <motion.div
              className="h-6 w-40 rounded bg-muted/40"
              animate={{
                opacity: [0.4, 0.8, 0.4],
                scale: [1, 1.01, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.8,
              }}
            />
          </CardHeader>
          <CardContent className="space-y-3">
            <motion.div
              className="h-4 w-48 rounded bg-muted/40"
              animate={{
                opacity: [0.4, 0.8, 0.4],
                scale: [1, 1.01, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.9,
              }}
            />
            <motion.div
              className="h-4 w-36 rounded bg-muted/40"
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
              className="h-4 w-28 rounded bg-muted/40"
              animate={{
                opacity: [0.4, 0.8, 0.4],
                scale: [1, 1.01, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.1,
              }}
            />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

export default SchoolDetailInfoSkeleton;
