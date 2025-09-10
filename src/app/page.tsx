import { CTA } from "@/components/landing/CTA";
import { FeatureTabs } from "@/components/landing/FeatureTabs";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { MarqueeLogos } from "@/components/landing/MarqueeLogos";
import { Navbar } from "@/components/landing/Navbar";
import { Testimonials } from "@/components/landing/Testimonials";

export default function LandingPage() {
  return (
    <main className="flex flex-col items-center">
      <Navbar />
      <Hero />
      <MarqueeLogos />
      <FeatureTabs />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
