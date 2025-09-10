"use client";

import { Quote, Star } from "lucide-react";
import { motion } from "motion/react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Directrice",
    school: "Académie Greenwood",
    content:
      "Yeko Admin a transformé la façon dont nous gérons notre école. Les outils administratifs sont intuitifs, et les fonctionnalités de communication ont renforcé notre relation avec les parents.",
    rating: 5,
    avatar: "SJ",
  },
  {
    name: "Michael Chen",
    role: "Directeur Financier",
    school: "École Bright Future",
    content:
      "Les fonctionnalités de gestion financière sont exceptionnelles. Nous pouvons maintenant suivre les dépenses, gérer les paiements de scolarité et générer des rapports en quelques clics.",
    rating: 5,
    avatar: "MC",
  },
  {
    name: "Emily Rodriguez",
    role: "Parent",
    school: "Éducation Elite",
    content:
      "En tant que parent, j'adore la facilité avec laquelle je peux rester connecté avec l'école de mon enfant. Les mises à jour en temps réel et les fonctionnalités de messagerie me tiennent informé de tout.",
    rating: 5,
    avatar: "ER",
  },
  {
    name: "David Thompson",
    role: "Directeur IT",
    school: "Apprentissage Sunrise",
    content:
      "La plateforme est incroyablement fiable et sécurisée. Le tableau de bord analytique nous donne des informations précieuses sur les performances des élèves et les opérations de l'école.",
    rating: 5,
    avatar: "DT",
  },
  {
    name: "Lisa Wang",
    role: "Enseignante",
    school: "Académie Excellence",
    content:
      "Yeko Admin rend mon travail tellement plus facile. Je peux gérer mes classes, communiquer avec les parents et suivre les progrès des élèves, le tout en un seul endroit.",
    rating: 5,
    avatar: "LW",
  },
  {
    name: "Robert Kim",
    role: "Administrateur Scolaire",
    school: "Futurs Leaders",
    content:
      "Les fonctionnalités de rapport complets nous aident à prendre des décisions basées sur les données. L'équipe de support est également fantastique - toujours réactive et utile.",
    rating: 5,
    avatar: "RK",
  },
];

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 bg-muted/30"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-14 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4 px-2">
            Ce Que Disent Nos Clients
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-2">
            Rejoignez des centaines d'écoles qui ont transformé leurs opérations
            avec Yeko Admin.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-background border border-border rounded-lg p-4 sm:p-5 md:p-6 relative touch-manipulation"
            >
              <Quote className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary/20 absolute top-3 sm:top-4 right-3 sm:right-4" />

              <div className="flex items-center mb-3 sm:mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={`${testimonial.name}-star-${i}`}
                    className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              <p className="text-muted-foreground mb-4 sm:mb-5 md:mb-6 leading-relaxed text-sm sm:text-base">
                "{testimonial.content}"
              </p>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs sm:text-sm font-semibold text-primary">
                    {testimonial.avatar}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-foreground text-sm sm:text-base truncate">
                    {testimonial.name}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground truncate">
                    {testimonial.role}, {testimonial.school}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 sm:mt-14 md:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 md:gap-8 text-center"
        >
          <div className="p-3 sm:p-4">
            <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">
              4.9/5
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              Note Moyenne
            </div>
          </div>
          <div className="p-3 sm:p-4">
            <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">
              500+
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              Écoles Satisfaites
            </div>
          </div>
          <div className="p-3 sm:p-4">
            <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">
              50K+
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              Élèves Gérés
            </div>
          </div>
          <div className="p-3 sm:p-4">
            <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">
              24/7
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              Support Disponible
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
