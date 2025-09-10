"use client";

import { Menu, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 w-full bg-background/95 backdrop-blur-md border-b border-border z-50"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-1.5 sm:space-x-2"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm sm:text-lg">
                  Y
                </span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-foreground">
                Yeko Admin
              </span>
            </motion.div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6 lg:space-x-8">
              <a
                href="#features"
                className="text-sm lg:text-base text-foreground hover:text-primary transition-colors duration-200 py-2 px-1"
              >
                Fonctionnalités
              </a>
              <a
                href="#testimonials"
                className="text-sm lg:text-base text-foreground hover:text-primary transition-colors duration-200 py-2 px-1"
              >
                Témoignages
              </a>
              <a
                href="#pricing"
                className="text-sm lg:text-base text-foreground hover:text-primary transition-colors duration-200 py-2 px-1"
              >
                Tarifs
              </a>
              <a
                href="#contact"
                className="text-sm lg:text-base text-foreground hover:text-primary transition-colors duration-200 py-2 px-1"
              >
                Contact
              </a>
            </div>
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            <Button variant="ghost" size="sm" className="text-sm" asChild>
              <a href="/sign-in">Se Connecter</a>
            </Button>
            <Button size="sm" className="text-sm" asChild>
              <a href="#demo">Demander une Démo</a>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 min-h-[40px] min-w-[40px] touch-manipulation"
              aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={{
            height: isOpen ? "auto" : 0,
            opacity: isOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="md:hidden overflow-hidden bg-background/95 backdrop-blur-md"
        >
          <div className="px-3 pt-2 pb-4 space-y-1 border-t border-border">
            <button
              type="button"
              className="block w-full text-left px-3 py-3 text-base text-foreground hover:text-primary hover:bg-muted/50 transition-colors duration-200 rounded-md touch-manipulation"
              onClick={() => {
                setIsOpen(false);
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Fonctionnalités
            </button>
            <button
              type="button"
              className="block w-full text-left px-3 py-3 text-base text-foreground hover:text-primary hover:bg-muted/50 transition-colors duration-200 rounded-md touch-manipulation"
              onClick={() => {
                setIsOpen(false);
                document
                  .getElementById("testimonials")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Témoignages
            </button>
            <button
              type="button"
              className="block w-full text-left px-3 py-3 text-base text-foreground hover:text-primary hover:bg-muted/50 transition-colors duration-200 rounded-md touch-manipulation"
              onClick={() => {
                setIsOpen(false);
                document
                  .getElementById("pricing")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Tarifs
            </button>
            <button
              type="button"
              className="block w-full text-left px-3 py-3 text-base text-foreground hover:text-primary hover:bg-muted/50 transition-colors duration-200 rounded-md touch-manipulation"
              onClick={() => {
                setIsOpen(false);
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Contact
            </button>
            <div className="pt-3 space-y-2 border-t border-border mt-3">
              <Button
                variant="ghost"
                className="w-full justify-start text-base py-3 h-auto touch-manipulation"
                asChild
              >
                <a href="/sign-in">Se Connecter</a>
              </Button>
              <Button
                className="w-full text-base py-3 h-auto touch-manipulation"
                asChild
              >
                <a href="#demo">Demander une Démo</a>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}
