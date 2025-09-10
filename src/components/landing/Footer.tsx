"use client";

import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

const footerLinks = {
  product: [
    { name: "Fonctionnalités", href: "#features" },
    { name: "Tarifs", href: "#pricing" },
    { name: "Démo", href: "#demo" },
    { name: "Sécurité", href: "#security" },
  ],
  company: [
    { name: "À Propos", href: "#about" },
    { name: "Carrières", href: "#careers" },
    { name: "Blog", href: "#blog" },
    { name: "Presse", href: "#press" },
  ],
  support: [
    { name: "Centre d'Aide", href: "#help" },
    { name: "Documentation", href: "#docs" },
    { name: "Contact", href: "#contact" },
    { name: "Statut", href: "#status" },
  ],
  legal: [
    { name: "Politique de Confidentialité", href: "#privacy" },
    { name: "Conditions d'Utilisation", href: "#terms" },
    { name: "Politique des Cookies", href: "#cookies" },
    { name: "RGPD", href: "#gdpr" },
  ],
};

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "#" },
  { name: "Twitter", icon: Twitter, href: "#" },
  { name: "LinkedIn", icon: Linkedin, href: "#" },
  { name: "Instagram", icon: Instagram, href: "#" },
];

export function Footer() {
  return (
    <footer id="contact" className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-12 sm:py-14 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 sm:gap-10">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm sm:text-lg">
                    Y
                  </span>
                </div>
                <span className="text-lg sm:text-xl font-bold text-foreground">
                  Yeko Admin
                </span>
              </div>

              <p className="text-muted-foreground mb-6 max-w-md text-sm sm:text-base leading-relaxed">
                La plateforme tout-en-un pour gérer et développer votre école.
                Rationalisez l'administration, améliorez la communication et
                prenez des décisions basées sur les données.
              </p>

              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center space-x-3 text-muted-foreground text-sm sm:text-base">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span className="break-all">bonjour@yekopro.com</span>
                </div>
                <div className="flex items-center space-x-3 text-muted-foreground text-sm sm:text-base">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span>+225 XX XX XX XX</span>
                </div>
                <div className="flex items-center space-x-3 text-muted-foreground text-sm sm:text-base">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span>Abidjan, Côte d'Ivoire</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
            {Object.entries(footerLinks).map(([category, links], index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="font-semibold text-foreground mb-3 sm:mb-4 capitalize text-sm sm:text-base">
                  {category}
                </h3>
                <ul className="space-y-2 sm:space-y-3">
                  {links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-muted-foreground hover:text-primary transition-colors duration-200 text-xs sm:text-sm touch-manipulation block py-1"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-border"
        >
          <div className="max-w-md">
            <h3 className="font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">
              Restez Informé
            </h3>
            <p className="text-muted-foreground mb-4 text-xs sm:text-sm leading-relaxed">
              Recevez les dernières mises à jour et les insights éducatifs
              directement dans votre boîte de réception.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
              <input
                type="email"
                placeholder="Entrez votre email"
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base min-h-[44px] sm:min-h-[40px]"
              />
              <Button className="text-sm sm:text-base py-2.5 sm:py-2 min-h-[44px] sm:min-h-[40px] touch-manipulation">
                S'abonner
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4"
        >
          <div className="text-muted-foreground text-xs sm:text-sm text-center sm:text-left">
            © 2025 Yeko Admin. Tous droits réservés.
          </div>

          <div className="flex space-x-3 sm:space-x-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <Button
                  key={social.name}
                  variant="ghost"
                  size="sm"
                  asChild
                  className="h-9 w-9 sm:h-8 sm:w-8 p-0 touch-manipulation"
                >
                  <a href={social.href} aria-label={social.name}>
                    <Icon className="h-4 w-4" />
                  </a>
                </Button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
