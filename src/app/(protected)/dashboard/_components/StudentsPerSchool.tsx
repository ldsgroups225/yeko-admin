import * as motion from "motion/react-client";
import { getStudentsPerSchoolWrapper } from "@/services/dataService";

export async function StudentsPerSchool() {
  const studentsPerSchool = await getStudentsPerSchoolWrapper();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      x: -30,
      scale: 0.9,
    },
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

  const numberVariants = {
    hidden: { scale: 0, rotate: -180 },
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

  const countVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 25,
        delay: 0.4,
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
      {studentsPerSchool.map((school, index) => (
        <motion.div
          key={school.schoolName}
          className="flex items-center justify-between cursor-pointer hover:bg-muted/30 p-2 rounded-lg transition-colors"
          variants={itemVariants}
          whileHover="hover"
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium"
              variants={numberVariants}
            >
              {index + 1}
            </motion.div>
            <div>
              <motion.p
                className="font-medium text-foreground"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 + 0.5 }}
              >
                {school.schoolName}
              </motion.p>
            </div>
          </div>
          <motion.div className="text-right" variants={countVariants}>
            <motion.p
              className="font-medium"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.08 + 0.6 }}
            >
              {school.studentCount}
            </motion.p>
            <motion.p
              className="text-xs text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.08 + 0.7 }}
            >
              étudiants
            </motion.p>
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
}
