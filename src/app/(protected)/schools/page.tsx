import { Building2, Plus } from "lucide-react";
import * as motion from "motion/react-client";
import Link from "next/link";
import { Header } from "@/components/Header";
import { NavbarActionButton } from "@/components/NavbarActionButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getSchoolsBasicWrapper } from "@/services/dataService";
import {
  SchoolFilters,
  SchoolStatCards,
} from "./_components/DynamicSchoolComponents";
import { SchoolsListProgressive } from "./_components/SchoolsListProgressive";
import { SchoolsStructuredData } from "./structured-data";

export default async function SchoolsPage() {
  const schools = await getSchoolsBasicWrapper();
  // Note: totalStudents will be calculated progressively as student counts load

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
    <>
      <SchoolsStructuredData />
      <motion.div
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={sectionVariants}>
          <Header
            title="Gestion des écoles"
            description={`${schools.length} écoles • Chargement des effectifs...`}
            trailing={<NavbarActionButton />}
          />
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={sectionVariants}
        >
          <SchoolStatCards />
        </motion.div>

        {/* Search and Filters */}
        <motion.div variants={sectionVariants}>
          <SchoolFilters />
        </motion.div>

        {/* Schools Grid with Progressive Loading */}
        <motion.div variants={sectionVariants}>
          <SchoolsListProgressive />
        </motion.div>

        {/* Empty State */}
        {schools.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Card className="text-center py-12">
              <CardContent>
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.7, type: "spring", stiffness: 500 }}
                >
                  <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                </motion.div>
                <motion.h3
                  className="text-lg font-semibold mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  Aucune école trouvée
                </motion.h3>
                <motion.p
                  className="text-muted-foreground mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  Commencez par ajouter votre première école à la plateforme.
                </motion.p>
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button asChild>
                    <Link href="/schools/new" prefetch={true}>
                      <Plus className="h-4 w-4 mr-2" />
                      Créer une école
                    </Link>
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </>
  );
}
