import * as motion from "motion/react-client";
import { Card, CardContent } from "@/components/ui/card";

export function SchoolFiltersSkeleton() {
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
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30,
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Card>
        <CardContent className="pt-6">
          <motion.div className="flex gap-4" variants={itemVariants}>
            <div className="relative flex-1">
              <motion.div
                className="h-10 w-full rounded-md bg-muted/40"
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
            </div>
            <motion.div
              className="h-10 w-20 rounded-md bg-muted/40"
              animate={{
                opacity: [0.4, 0.8, 0.4],
                scale: [1, 1.01, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2,
              }}
            />
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default SchoolFiltersSkeleton;
