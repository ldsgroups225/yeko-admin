import { GraduationCap, Users } from "lucide-react";
import * as motion from "motion/react-client";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SchoolStudentsListProps {
  students: Array<{
    id: string;
    students?: {
      first_name: string;
      last_name: string;
      date_of_birth: string | null;
    };
    classes?: {
      name: string;
    } | null;
    enrollment_status: string;
  }>;
}

export async function SchoolStudentsList({
  students,
}: SchoolStudentsListProps) {
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

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
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
      scale: 1.01,
      y: -2,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 25,
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

  const iconVariants = {
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

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={cardVariants} whileHover="hover">
        <Card>
          <CardHeader>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <CardTitle className="flex items-center gap-2">
                <motion.div variants={iconVariants}>
                  <Users className="h-5 w-5 text-primary" />
                </motion.div>
                Étudiants récents
              </CardTitle>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <CardDescription>
                Derniers étudiants inscrits dans cette école
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent>
            <motion.div className="space-y-4" variants={containerVariants}>
              {students.length === 0 ? (
                <motion.div
                  className="text-center py-8"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Aucun étudiant inscrit pour le moment
                  </p>
                </motion.div>
              ) : (
                students.map((student, index) => (
                  <motion.div
                    key={student.id}
                    className="flex items-center justify-between p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    variants={itemVariants}
                    whileHover="hover"
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <motion.div
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10"
                        variants={iconVariants}
                      >
                        <Users className="h-5 w-5 text-primary" />
                      </motion.div>
                      <div>
                        <motion.p
                          className="font-medium text-foreground"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 + 0.7 }}
                        >
                          {student.students
                            ? `${student.students.first_name} ${student.students.last_name}`
                            : "Étudiant"}
                        </motion.p>
                        <motion.p
                          className="text-sm text-muted-foreground"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 + 0.8 }}
                        >
                          {student.classes?.name || "Classe non assignée"}
                        </motion.p>
                      </div>
                    </div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.9 }}
                    >
                      <Badge
                        variant={
                          student.enrollment_status === "accepted"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {student.enrollment_status === "accepted"
                          ? "Inscrit"
                          : "En attente"}
                      </Badge>
                    </motion.div>
                  </motion.div>
                ))
              )}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
