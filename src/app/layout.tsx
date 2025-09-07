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
  title: "Yeko Admin",
  description:
    "Yeko est une plateforme éducative le suivie de la vie scolaire des élèves par leur parent",
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
    <html lang="en">
      <body
        className={`${dmSans.variable} ${dmSerif.variable} ${dmMono.variable} antialiased`}
      >
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
