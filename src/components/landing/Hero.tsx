"use client";

import { ArrowRight, Play } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-3 sm:px-4 bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-6 sm:mb-8"
          >
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full mr-1.5 sm:mr-2 animate-pulse"></span>
            <span className="hidden sm:inline">
              Utilisé par plus de 500 écoles dans le monde
            </span>
            <span className="sm:hidden">500+ écoles nous font confiance</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-4 sm:mb-6 leading-tight px-2"
          >
            <span className="block sm:inline">
              La Plateforme Tout-en-Un pour
            </span>{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent block sm:inline">
              Gérer et Développer
            </span>{" "}
            <span className="block sm:inline">Votre École</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto leading-relaxed px-2"
          >
            Yeko Admin simplifie l'administration, rationalise les finances et
            améliore la communication pour les directeurs, éducateurs et
            parents.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-12 sm:mb-14 md:mb-16 px-4"
          >
            <Button
              size="lg"
              className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 min-h-[48px] sm:min-h-[56px]"
              asChild
            >
              <a href="#demo">
                <span className="hidden sm:inline">
                  Demander une Démo Gratuite
                </span>
                <span className="sm:hidden">Démo Gratuite</span>
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 min-h-[48px] sm:min-h-[56px]"
              asChild
            >
              <a href="#features">
                <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Voir la Démo
              </a>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto px-4"
          >
            <div className="text-center p-4 sm:p-0">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-1 sm:mb-2">
                500+
              </div>
              <div className="text-sm sm:text-base text-muted-foreground leading-tight">
                <span className="hidden sm:inline">
                  Écoles Nous Font Confiance
                </span>
                <span className="sm:hidden">Écoles</span>
              </div>
            </div>
            <div className="text-center p-4 sm:p-0">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-1 sm:mb-2">
                50K+
              </div>
              <div className="text-sm sm:text-base text-muted-foreground leading-tight">
                <span className="hidden sm:inline">Élèves Gérés</span>
                <span className="sm:hidden">Élèves</span>
              </div>
            </div>
            <div className="text-center p-4 sm:p-0">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-1 sm:mb-2">
                99.9%
              </div>
              <div className="text-sm sm:text-base text-muted-foreground leading-tight">
                <span className="hidden sm:inline">
                  Garantie de Disponibilité
                </span>
                <span className="sm:hidden">Disponibilité</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
