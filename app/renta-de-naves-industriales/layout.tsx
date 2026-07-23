import type { Metadata } from "next";
import "../globals.css";
import { SiteShell } from "../components/site-shell";
import { getDictionary } from "../dictionaries";

/**
 * Root layout propio de la landing de renta. Como /cotiza y /getquote, vive
 * fuera de `[lang]` para servir en una URL limpia, así que aporta su propio
 * `<html>`/`<body>` vía SiteShell. Solo existe en español.
 */
const dict = getDictionary("es");

export const metadata: Metadata = {
  title: dict.rental.metaTitle,
  description: dict.rental.metaDescription,
  alternates: { canonical: "/renta-de-naves-industriales" },
};

export default function RentalLayout({
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
