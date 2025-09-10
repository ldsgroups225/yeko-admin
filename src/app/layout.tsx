import type { Metadata } from "next";
import { DM_Mono, DM_Sans, DM_Serif_Text } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSerif = DM_Serif_Text({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400"],
});

const dmMono = DM_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Yeko Admin - Système de Gestion Scolaire",
  description:
    "La Plateforme Tout-en-Un pour Gérer et Développer Votre École. Simplifiez l'administration, rationalisez les finances et améliorez la communication pour les directeurs, éducateurs et parents.",
  icons: {
    icon: "/logo2.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${dmSans.variable} ${dmSerif.variable} ${dmMono.variable} antialiased`}
      >
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
