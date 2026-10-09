import type { Metadata, Viewport } from "next";
import { ABeeZee, Raleway } from "next/font/google";
import "./globals.css";
import { NOME_APP } from "@/lib/marca";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["200", "300", "400", "600", "900"],
});

const abeezee = ABeeZee({
  variable: "--font-abeezee",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: { default: NOME_APP, template: `%s · ${NOME_APP}` },
  description: "Acompanhe sua jornada de fertilidade com cuidado, ciência e apoio.",
  applicationName: NOME_APP,
  appleWebApp: { capable: true, title: NOME_APP, statusBarStyle: "default" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${raleway.variable} ${abeezee.variable} h-full antialiased`}>
      <body className="min-h-full bg-white text-grafite">{children}</body>
    </html>
  );
}
