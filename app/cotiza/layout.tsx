import type { Metadata } from "next";
import "../globals.css";
import { SiteShell } from "../components/site-shell";
import { getDictionary } from "../dictionaries";

/**
 * Root layout propio de la landing de campaña en español (/cotiza). Igual que
 * /getquote: vive fuera de `[lang]` y aporta `<html>`/`<body>` vía SiteShell.
 */
const dict = getDictionary("es");

export const metadata: Metadata = {
  title: dict.quote.metaTitle,
  description: dict.quote.metaDescription,
  alternates: {
    canonical: "/cotiza",
    languages: { es: "/cotiza", en: "/getquote" },
  },
};

export default function CotizaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SiteShell lang="es" dict={dict}>
      {children}
    </SiteShell>
  );
}
