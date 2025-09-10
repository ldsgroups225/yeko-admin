import * as motion from "motion/react-client";
import { getSchoolDetailDataWrapper } from "@/services/dataService";
import { SchoolDetailStructuredData } from "../structured-data";
import { UpdateSchoolForm } from "./_components";
import {
  SchoolDetailInfo,
  SchoolStudentsList,
} from "./_components/DynamicSchoolDetailComponents";

interface UpdateSchoolPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UpdateSchoolPage({
  params,
}: UpdateSchoolPageProps) {
  const { id } = await params;
  const schoolData = await getSchoolDetailDataWrapper(id);

  if (!schoolData) {
    return (
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-3xl font-bold text-foreground">
            École non trouvée
          </h1>
        </motion.div>
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-muted-foreground">
            L'école demandée n'existe pas ou a été supprimée.
          </p>
        </motion.div>
      </motion.div>
    );
  }

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

  return (
    <>
      <SchoolDetailStructuredData school={schoolData} />
      <motion.div
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={sectionVariants}>
          <SchoolDetailInfo school={schoolData} />
        </motion.div>

        <motion.div variants={sectionVariants}>
          <SchoolStudentsList students={schoolData.students} />
        </motion.div>

        <motion.div variants={sectionVariants}>
          <UpdateSchoolForm school={schoolData} />
        </motion.div>
      </motion.div>
    </>
  );
}
