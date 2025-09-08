import * as motion from "motion/react-client";
import { Badge } from "@/components/ui/badge";
import { getRecentSchoolsWrapper } from "@/services/dataService";

export async function RecentSchool() {
  const recentSchools = await getRecentSchoolsWrapper();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      x: -20,
      scale: 0.95,
    },
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
    hover: {
      scale: 1.02,
      x: 4,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 25,
      },
    },
  };

  const badgeVariants = {
    hidden: { scale: 0, rotate: -10 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring" as const,
        stiffness: 500,
        damping: 30,
        delay: 0.3,
      },
    },
  };

  return (
    <motion.div
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {recentSchools.map((school, index) => (
        <motion.div
          key={school.id}
          className="flex items-center justify-between p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
          variants={itemVariants}
          whileHover="hover"
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex-1">
            <motion.p
              className="font-medium text-foreground"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.4 }}
            >
              {school.name}
            </motion.p>
            <motion.p
              className="text-sm text-muted-foreground"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.5 }}
            >
              {school.city} • {school.studentCount} étudiants
            </motion.p>
          </div>
          <motion.div variants={badgeVariants}>
            <Badge
              variant={school.status === "active" ? "default" : "secondary"}
            >
              {school.status === "active" ? "Active" : "En attente"}
            </Badge>
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
}
