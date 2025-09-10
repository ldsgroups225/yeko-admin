"use client";

import { Save } from "lucide-react";
import * as motion from "motion/react-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { createSchool } from "@/actions/schools";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const initialState = {
  message: "",
  errors: {},
};

export function NewSchoolForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    createSchool,
    initialState,
  );

  // Handle successful creation
  useEffect(() => {
    if (state?.success) {
      toast.success("École créée avec succès");
      router.push("/schools");
    }
  }, [state?.success, router]);

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
    <motion.form
      className="space-y-6"
      action={formAction}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Display error message */}
      {state?.message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Alert variant="destructive">
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <motion.div variants={cardVariants} whileHover="hover">
          <Card>
            <CardHeader>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <CardTitle>Informations générales</CardTitle>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <CardDescription>Détails de base de l'école</CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent className="space-y-4">
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Label htmlFor="name">Nom de l'école *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Ex: Lycée Classique d'Abidjan"
                  required
                  aria-describedby={
                    state?.errors?.name ? "name-error" : undefined
                  }
                />
                {state?.errors?.name && (
                  <div id="name-error" className="text-sm text-destructive">
                    {state.errors.name.join(", ")}
                  </div>
                )}
              </motion.div>

              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Label htmlFor="code">Code de l'école *</Label>
                <Input
                  id="code"
                  name="code"
                  placeholder="Ex: LJM001"
                  required
                  aria-describedby={
                    state?.errors?.code ? "code-error" : undefined
                  }
                />
                {state?.errors?.code && (
                  <div id="code-error" className="text-sm text-destructive">
                    {state.errors.code.join(", ")}
                  </div>
                )}
              </motion.div>

              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Label htmlFor="cycle_id">Cycle d'enseignement *</Label>
                <Select name="cycle_id" required defaultValue="secondary">
                  <SelectTrigger
                    aria-describedby={
                      state?.errors?.cycle_id ? "cycle_id-error" : undefined
                    }
                  >
                    <SelectValue placeholder="Sélectionner un cycle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary">Primaire</SelectItem>
                    <SelectItem value="secondary">Secondaire</SelectItem>
                  </SelectContent>
                </Select>
                {state?.errors?.cycle_id && (
                  <div id="cycle_id-error" className="text-sm text-destructive">
                    {state.errors.cycle_id.join(", ")}
                  </div>
                )}
              </motion.div>

              <motion.div
                className="flex items-center space-x-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Checkbox
                  id="is_technical_education"
                  name="is_technical_education"
                />
                <Label htmlFor="is_technical_education">
                  École d'enseignement technique
                </Label>
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
                transition={{ delay: 0.3 }}
              >
                <CardTitle>Informations de contact</CardTitle>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <CardDescription>Coordonnées de l'école</CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent className="space-y-4">
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="exemple@email.com"
                  required
                  aria-describedby={
                    state?.errors?.email ? "email-error" : undefined
                  }
                />
                {state?.errors?.email && (
                  <div id="email-error" className="text-sm text-destructive">
                    {state.errors.email.join(", ")}
                  </div>
                )}
              </motion.div>

              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Label htmlFor="phone">Téléphone *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+225 xx xx xx xxxx"
                  required
                  aria-describedby={
                    state?.errors?.phone ? "phone-error" : undefined
                  }
                />
                {state?.errors?.phone && (
                  <div id="phone-error" className="text-sm text-destructive">
                    {state.errors.phone.join(", ")}
                  </div>
                )}
              </motion.div>

              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Label htmlFor="city">Ville *</Label>
                <Input
                  id="city"
                  name="city"
                  placeholder="Ex: Abidjan"
                  required
                  aria-describedby={
                    state?.errors?.city ? "city-error" : undefined
                  }
                />
                {state?.errors?.city && (
                  <div id="city-error" className="text-sm text-destructive">
                    {state.errors.city.join(", ")}
                  </div>
                )}
              </motion.div>

              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Label htmlFor="address">Adresse</Label>
                <Textarea
                  id="address"
                  name="address"
                  placeholder="Adresse complète de l'école"
                  rows={3}
                  aria-describedby={
                    state?.errors?.address ? "address-error" : undefined
                  }
                />
                {state?.errors?.address && (
                  <div id="address-error" className="text-sm text-destructive">
                    {state.errors.address.join(", ")}
                  </div>
                )}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Additional Settings */}
      <motion.div variants={cardVariants} whileHover="hover">
        <Card>
          <CardHeader>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <CardTitle>Paramètres additionnels</CardTitle>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <CardDescription>
                Configuration avancée de l'école
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent className="space-y-4">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="space-y-2">
                <Label htmlFor="state_id">État</Label>
                <Select name="state_id" defaultValue="3">
                  <SelectTrigger
                    aria-describedby={
                      state?.errors?.state_id ? "state_id-error" : undefined
                    }
                  >
                    <SelectValue placeholder="Sélectionner un état" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Active</SelectItem>
                    <SelectItem value="3">Suspendu</SelectItem>
                  </SelectContent>
                </Select>
                {state?.errors?.state_id && (
                  <div id="state_id-error" className="text-sm text-destructive">
                    {state.errors.state_id.join(", ")}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Public ou Privé</Label>
                <Select name="status" defaultValue="private">
                  <SelectTrigger
                    aria-describedby={
                      state?.errors?.status ? "status-error" : undefined
                    }
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">Privé</SelectItem>
                    <SelectItem value="public">Publique</SelectItem>
                  </SelectContent>
                </Select>
                {state?.errors?.status && (
                  <div id="status-error" className="text-sm text-destructive">
                    {state.errors.status.join(", ")}
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Label htmlFor="image_url">Logo de l'école (URL)</Label>
              <Input
                id="image_url"
                name="image_url"
                type="url"
                placeholder="https://exemple.com/logo.png"
                aria-describedby={
                  state?.errors?.image_url ? "image_url-error" : undefined
                }
              />
              {state?.errors?.image_url && (
                <div id="image_url-error" className="text-sm text-destructive">
                  {state.errors.image_url.join(", ")}
                </div>
              )}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Form Actions */}
      <motion.div
        className="flex justify-end gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <Button variant="outline" type="button" asChild>
            <Link href="/schools">Annuler</Link>
          </Button>
        </motion.div>
        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <Button type="submit" disabled={pending}>
            <Save className="h-4 w-4 mr-2" />
            {pending ? "Création..." : "Créer l'école"}
          </Button>
        </motion.div>
      </motion.div>
    </motion.form>
  );
}
