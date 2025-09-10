import { Building2, Calendar, Mail, MapPin, Phone, Users } from "lucide-react";
import * as motion from "motion/react-client";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SchoolDetailInfoProps {
  school: {
    id: string;
    name: string;
    code: string;
    city: string;
    email: string;
    phone: string;
    address?: string | null;
    status: string;
    is_technical_education: boolean | null;
    studentCount: number;
    created_at: string | null;
  };
}

export async function SchoolDetailInfo({ school }: SchoolDetailInfoProps) {
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
      className="space-y-6"
    >
      {/* School Header */}
      <motion.div variants={cardVariants} whileHover="hover">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <motion.div variants={iconVariants}>
                      <Building2 className="h-6 w-6 text-primary" />
                    </motion.div>
                    {school.name}
                  </CardTitle>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <CardDescription className="flex items-center gap-1 mt-2">
                    <MapPin className="h-4 w-4" />
                    {school.city}
                  </CardDescription>
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Badge
                  variant={
                    school.status === "private" ? "default" : "secondary"
                  }
                  className="text-sm"
                >
                  {school.status === "private" ? "Active" : "En attente"}
                </Badge>
              </motion.div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Code de l'école</p>
                <p className="font-medium text-lg">{school.code}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Type d'enseignement
                </p>
                <p className="font-medium">
                  {school.is_technical_education ? "Technique" : "Général"}
                </p>
              </div>
            </motion.div>

            <motion.div
              className="flex items-center gap-2 text-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Users className="h-5 w-5 text-primary" />
              <span className="font-semibold">{school.studentCount}</span>
              <span className="text-muted-foreground">étudiants inscrits</span>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Contact Information */}
      <motion.div variants={cardVariants} whileHover="hover">
        <Card>
          <CardHeader>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                Informations de contact
              </CardTitle>
            </motion.div>
          </CardHeader>
          <CardContent className="space-y-3">
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
            >
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{school.email}</span>
            </motion.div>
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
            >
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{school.phone}</span>
            </motion.div>
            {school.address && (
              <motion.div
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 }}
              >
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span className="font-medium">{school.address}</span>
              </motion.div>
            )}
            <motion.div
              className="flex items-center gap-3 pt-2 border-t"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.3 }}
            >
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Créée le{" "}
                {school.created_at
                  ? new Date(school.created_at).toLocaleDateString("fr-FR")
                  : "Date inconnue"}
              </span>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
