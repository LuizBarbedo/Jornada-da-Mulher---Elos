import type { MetadataRoute } from "next";
import { NOME_APP } from "@/lib/marca";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: NOME_APP,
    short_name: NOME_APP,
    description: "Acompanhe sua jornada de fertilidade com cuidado, ciência e apoio.",
    lang: "pt-BR",
    start_url: "/inicio",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      { src: "/icone/192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icone/512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icone/512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
