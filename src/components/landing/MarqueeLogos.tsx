"use client";

import { motion } from "motion/react";

const logos = [
  { name: "Académie Greenwood", logo: "AG" },
  { name: "École Bright Future", logo: "EBF" },
  { name: "Éducation Elite", logo: "EE" },
  { name: "Apprentissage Sunrise", logo: "AS" },
  { name: "Académie Excellence", logo: "AE" },
  { name: "Futurs Leaders", logo: "FL" },
  { name: "Centre de Connaissance", logo: "CC" },
  { name: "Apprentissage Intelligent", logo: "AI" },
];

export function MarqueeLogos() {
  return (
    <section className="py-12 sm:py-14 md:py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-10 md:mb-12"
        >
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-muted-foreground mb-3 sm:mb-4 px-2">
            Fait confiance par les institutions éducatives de premier plan
          </h2>
        </motion.div>

        <div className="relative overflow-hidden">
          <motion.div
            animate={{
              x: [0, -100 * logos.length],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 20,
                ease: "linear",
              },
            }}
            className="flex space-x-8 sm:space-x-12 md:space-x-16"
          >
            {/* First set of logos */}
            {logos.map((logo) => (
              <div
                key={`first-${logo.name}`}
                className="flex-shrink-0 flex items-center justify-center"
              >
                <div className="w-16 h-12 sm:w-20 sm:h-14 md:w-24 md:h-16 bg-background rounded-lg border border-border flex items-center justify-center shadow-sm">
                  <span className="text-sm sm:text-base md:text-lg font-bold text-muted-foreground">
                    {logo.logo}
                  </span>
                </div>
              </div>
            ))}

            {/* Duplicate set for seamless loop */}
            {logos.map((logo) => (
              <div
                key={`second-${logo.name}`}
                className="flex-shrink-0 flex items-center justify-center"
              >
                <div className="w-16 h-12 sm:w-20 sm:h-14 md:w-24 md:h-16 bg-background rounded-lg border border-border flex items-center justify-center shadow-sm">
                  <span className="text-sm sm:text-base md:text-lg font-bold text-muted-foreground">
                    {logo.logo}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
