import { Edit, MapPin, Users } from "lucide-react";
import * as motion from "motion/react-client";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AssignHeadMasterWrapper } from "./AssignHeadMasterWrapper";

interface School {
  id: string;
  name: string;
  code: string;
  city: string;
  email: string;
  phone: string;
  status: string;
  is_technical_education: boolean | null;
  studentCount: number;
}

interface SchoolsListProps {
  schools: School[];
}

export async function SchoolsList({ schools }: SchoolsListProps) {
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
        delay: 0.3,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {schools.map((school, index) => (
        <motion.div
          key={school.id}
          variants={cardVariants}
          whileHover="hover"
          whileTap={{ scale: 0.98 }}
          className="h-full"
        >
          <Card className="h-full hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.4 }}
                  >
                    <CardTitle className="text-lg">{school.name}</CardTitle>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                  >
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {school.city}
                    </CardDescription>
                  </motion.div>
                </div>
                <motion.div variants={iconVariants}>
                  <Badge
                    variant={
                      school.status === "private" ? "default" : "secondary"
                    }
                  >
                    {school.status === "private" ? "Active" : "En attente"}
                  </Badge>
                </motion.div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <motion.div
                className="grid grid-cols-2 gap-4 text-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.6 }}
              >
                <div>
                  <p className="text-muted-foreground">Code</p>
                  <p className="font-medium">{school.code}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Type</p>
                  <p className="font-medium">
                    {school.is_technical_education ? "Technique" : "Général"}
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-center gap-2 text-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.7 }}
              >
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{school.studentCount}</span>
                <span className="text-muted-foreground">étudiants</span>
              </motion.div>

              <motion.div
                className="space-y-1 text-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.8 }}
              >
                <p className="text-muted-foreground">Contact</p>
                <p>{school.email}</p>
                <p>{school.phone}</p>
              </motion.div>

              <motion.div
                className="flex gap-2 pt-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.9 }}
              >
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link href={`/schools/${school.id}`} prefetch={true}>
                    <Edit className="h-3 w-3 mr-1" />
                    Modifier
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link href={`/schools/${school.id}/students`} prefetch={true}>
                    <Users className="h-3 w-3 mr-1" />
                    Étudiants
                  </Link>
                </Button>
              </motion.div>
            </CardContent>
            <CardFooter>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 1.0 }}
              >
                <AssignHeadMasterWrapper
                  schoolId={school.id}
                  schoolName={school.name}
                />
              </motion.div>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
