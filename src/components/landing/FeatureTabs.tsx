"use client";

import { BarChart3, DollarSign, MessageSquare, Users } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const features = [
  {
    id: "administration",
    title: "Administration",
    description:
      "Rationalisez les tâches administratives de votre école avec notre système de gestion complet.",
    icon: Users,
    content: {
      title: "Contrôle Administratif Complet",
      description:
        "Gérez tout, de l'inscription des élèves à la planification du personnel avec notre tableau de bord intuitif.",
      features: [
        "Gestion des Informations des Élèves",
        "Gestion du Personnel et des Enseignants",
        "Planification des Cours et Emplois du Temps",
        "Suivi de la Présence",
        "Gestion des Documents",
        "Génération de Rapports",
      ],
    },
  },
  {
    id: "finance",
    title: "Gestion Financière",
    description:
      "Prenez le contrôle des finances de votre école avec des outils de comptabilité et de facturation puissants.",
    icon: DollarSign,
    content: {
      title: "Gestion Financière Simplifiée",
      description:
        "Suivez les dépenses, gérez les paiements de scolarité et générez des rapports financiers sans effort.",
      features: [
        "Gestion des Frais de Scolarité",
        "Suivi des Dépenses",
        "Rapports Financiers",
        "Traitement des Paiements",
        "Planification Budgétaire",
        "Gestion Fiscale",
      ],
    },
  },
  {
    id: "communication",
    title: "Communication",
    description:
      "Améliorez la communication entre l'école, les parents et les élèves avec notre plateforme intégrée.",
    icon: MessageSquare,
    content: {
      title: "Centre de Communication Fluide",
      description:
        "Gardez tout le monde connecté avec la messagerie en temps réel, les annonces et les mises à jour.",
      features: [
        "Messagerie Parent-Enseignant",
        "Annonces de l'École",
        "Notifications d'Événements",
        "Rapports de Progrès",
        "Alertes d'Urgence",
        "Support Multilingue",
      ],
    },
  },
  {
    id: "analytics",
    title: "Analyses et Rapports",
    description:
      "Prenez des décisions basées sur les données avec des analyses complètes et des rapports détaillés.",
    icon: BarChart3,
    content: {
      title: "Insights Basés sur les Données",
      description:
        "Accédez à des analyses puissantes pour comprendre les performances des élèves et les opérations de l'école.",
      features: [
        "Analyses des Performances des Élèves",
        "Rapports Financiers",
        "Analyses de Présence",
        "Tableau de Bord Personnalisé",
        "Capacités d'Exportation",
        "Analyse des Tendances",
      ],
    },
  },
];

export function FeatureTabs() {
  const [activeTab, setActiveTab] = useState("administration");

  return (
    <section id="features" className="py-12 sm:py-16 md:py-20 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-14 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4 px-2">
            Tout Ce Dont Vous Avez Besoin pour Diriger Votre École
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-2">
            Notre plateforme complète fournit tous les outils dont vous avez
            besoin pour gérer, développer et exceller dans l'éducation.
          </p>
        </motion.div>

        {/* Mobile Tab Navigation */}
        <div className="lg:hidden mb-6 sm:mb-8">
          <div className="relative">
            <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-hide snap-x snap-mandatory">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Button
                    key={feature.id}
                    variant={activeTab === feature.id ? "default" : "outline"}
                    className="flex-shrink-0 px-4 py-3 text-sm min-h-[48px] touch-manipulation snap-start"
                    onClick={() => setActiveTab(feature.id)}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    <span className="whitespace-nowrap">{feature.title}</span>
                  </Button>
                );
              })}
            </div>
            {/* Gradient fade indicators */}
            <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-background to-transparent pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-background to-transparent pointer-events-none"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Desktop Tab Navigation */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="space-y-3 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Button
                    key={feature.id}
                    variant={activeTab === feature.id ? "default" : "ghost"}
                    className="w-full justify-start h-auto p-4 text-left hover:bg-muted/50 transition-colors touch-manipulation"
                    onClick={() => setActiveTab(feature.id)}
                  >
                    <div className="flex items-start space-x-3 w-full">
                      <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm leading-tight">
                          {feature.title}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                          {feature.description}
                        </div>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="col-span-1 lg:col-span-3">
            <AnimatePresence mode="wait">
              {features.map((feature) => {
                if (activeTab !== feature.id) return null;

                return (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-background border border-border rounded-lg p-4 sm:p-6 md:p-8 shadow-sm"
                  >
                    <div className="flex items-start space-x-3 mb-4 sm:mb-6">
                      <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground leading-tight">
                          {feature.content.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base md:text-lg leading-relaxed">
                      {feature.content.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {feature.content.features.map((item, index) => (
                        <motion.div
                          key={`${feature.id}-${item}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="flex items-start space-x-3 p-3 rounded-md hover:bg-muted/30 transition-colors touch-manipulation"
                        >
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2"></div>
                          <span className="text-foreground text-sm sm:text-base leading-relaxed">
                            {item}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
