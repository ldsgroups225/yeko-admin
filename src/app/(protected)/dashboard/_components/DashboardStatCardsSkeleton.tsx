import * as motion from "motion/react-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateId } from "@/lib/utils";

export function DashboardStatCardsSkeleton() {
  const cells = new Array(4).fill(null);

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
      className="contents"
    >
      {cells.map((_, index) => (
        <motion.div
          key={generateId()}
          variants={cardVariants}
          className="h-full"
        >
          <Card aria-hidden className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <motion.div
                  className="h-4 w-24 rounded-md bg-muted/40"
                  animate={{
                    opacity: [0.4, 0.8, 0.4],
                    scale: [1, 1.02, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.1,
                  }}
                />
              </CardTitle>
              <motion.div
                className="h-4 w-4 rounded-md bg-muted/40"
                animate={{
                  opacity: [0.4, 0.8, 0.4],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.1 + 0.2,
                }}
              />
            </CardHeader>

            <CardContent>
              <motion.div
                className="h-8 w-24 rounded bg-muted/40 mb-2"
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
                className="h-3 w-32 rounded bg-muted/30"
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
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default DashboardStatCardsSkeleton;
