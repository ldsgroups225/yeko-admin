import { Building2, GraduationCap, TrendingUp, Users } from "lucide-react";
import * as motion from "motion/react-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSchoolsWithStatsWrapper } from "@/services/dataService";

export async function SchoolStatCards() {
  const { totalSchools, activeSchools, totalStudents, totalTeachers } =
    await getSchoolsWithStatsWrapper();

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
    hover: {
      scale: 1.02,
      y: -2,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 25,
      },
    },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring" as const,
        stiffness: 500,
        damping: 30,
        delay: 0.2,
      },
    },
  };

  const numberVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 25,
        delay: 0.3,
      },
    },
  };

  return (
    <>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className="h-full"
      >
        <Card className="h-full cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Écoles</CardTitle>
            <motion.div variants={iconVariants}>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </motion.div>
          </CardHeader>
          <CardContent>
            <motion.div
              className="text-2xl font-bold"
              variants={numberVariants}
            >
              {totalSchools}
            </motion.div>
            <p className="text-xs text-muted-foreground">
              <span className="text-chart-3">{activeSchools} actives</span>
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        transition={{ delay: 0.1 }}
        className="h-full"
      >
        <Card className="h-full cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Étudiants
            </CardTitle>
            <motion.div variants={iconVariants}>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </motion.div>
          </CardHeader>
          <CardContent>
            <motion.div
              className="text-2xl font-bold"
              variants={numberVariants}
            >
              {totalStudents.toLocaleString()}
            </motion.div>
            <p className="text-xs text-muted-foreground">
              Répartis dans {totalSchools} écoles
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        transition={{ delay: 0.2 }}
        className="h-full"
      >
        <Card className="h-full cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enseignants</CardTitle>
            <motion.div variants={iconVariants}>
              <Users className="h-4 w-4 text-muted-foreground" />
            </motion.div>
          </CardHeader>
          <CardContent>
            <motion.div
              className="text-2xl font-bold"
              variants={numberVariants}
            >
              {totalTeachers}
            </motion.div>
            <p className="text-xs text-muted-foreground">
              Personnel enseignant actif
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        transition={{ delay: 0.3 }}
        className="h-full"
      >
        <Card className="h-full cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moyenne/École</CardTitle>
            <motion.div variants={iconVariants}>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </motion.div>
          </CardHeader>
          <CardContent>
            <motion.div
              className="text-2xl font-bold"
              variants={numberVariants}
            >
              {Math.round(totalStudents / totalSchools)}
            </motion.div>
            <p className="text-xs text-muted-foreground">Étudiants par école</p>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
}
