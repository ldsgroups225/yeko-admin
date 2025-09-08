import { School, TrendingUp } from "lucide-react";
import * as motion from "motion/react-client";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DashboardStatCards,
  RecentSchool,
  StudentsPerSchool,
} from "./_components/DynamicDashboardComponents";

export default async function DashboardPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30,
        duration: 0.6,
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.02,
      y: -2,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 25,
      },
    },
    tap: {
      scale: 0.98,
      y: 0,
    },
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={sectionVariants}>
        <Header
          title="Tableau de bord"
          description="Vue d'ensemble de votre plateforme de gestion scolaire"
        />
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={sectionVariants}
      >
        <DashboardStatCards />
      </motion.div>

      {/* Recent Schools and Top Schools */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        variants={sectionVariants}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.6, type: "spring", stiffness: 500 }}
                >
                  <School className="h-5 w-5" />
                </motion.div>
                Écoles récentes
              </CardTitle>
              <CardDescription>
                Dernières écoles ajoutées à la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentSchool />
              <div className="mt-4">
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/schools" prefetch={true}>
                      Voir toutes les écoles
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.7, type: "spring", stiffness: 500 }}
                >
                  <TrendingUp className="h-5 w-5" />
                </motion.div>
                Écoles par effectif
              </CardTitle>
              <CardDescription>
                Classement des écoles par nombre d'étudiants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StudentsPerSchool />
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
