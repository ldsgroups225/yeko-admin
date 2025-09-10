"use client";

import { ArrowRight, CheckCircle } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section
      id="demo"
      className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 bg-gradient-to-br from-primary/5 to-primary/10"
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 sm:mb-6 px-2">
            Prêt à Transformer Votre École ?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-2">
            Rejoignez des centaines d'écoles qui utilisent déjà Yeko Admin pour
            rationaliser leurs opérations et améliorer la réussite des élèves.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-10 sm:mb-12 px-4">
            <Button
              size="lg"
              className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 min-h-[48px] sm:min-h-[56px] touch-manipulation"
              asChild
            >
              <a href="#contact">
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
              className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 min-h-[48px] sm:min-h-[56px] touch-manipulation"
              asChild
            >
              <a href="/sign-in">
                <span className="hidden sm:inline">
                  Commencer l'Essai Gratuit
                </span>
                <span className="sm:hidden">Essai Gratuit</span>
              </a>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-background border border-border rounded-lg p-4 sm:p-5 md:p-6 touch-manipulation"
            >
              <div className="flex items-center space-x-3 mb-3 sm:mb-4">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                <h3 className="font-semibold text-foreground text-sm sm:text-base">
                  Démo Gratuite
                </h3>
              </div>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                Découvrez Yeko Admin en action avec une démo personnalisée
                adaptée aux besoins de votre école.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-background border border-border rounded-lg p-4 sm:p-5 md:p-6 touch-manipulation"
            >
              <div className="flex items-center space-x-3 mb-3 sm:mb-4">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                <h3 className="font-semibold text-foreground text-sm sm:text-base">
                  Configuration Facile
                </h3>
              </div>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                Commencez en quelques minutes avec notre processus de
                configuration guidé et notre support d'intégration dédié.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-background border border-border rounded-lg p-4 sm:p-5 md:p-6 touch-manipulation sm:col-span-2 md:col-span-1"
            >
              <div className="flex items-center space-x-3 mb-3 sm:mb-4">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                <h3 className="font-semibold text-foreground text-sm sm:text-base">
                  Support 24/7
                </h3>
              </div>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                Obtenez de l'aide quand vous en avez besoin avec notre équipe de
                support client disponible 24h/24.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
