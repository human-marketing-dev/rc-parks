import type { Metadata } from "next";
import "../globals.css";
import { SiteShell } from "../components/site-shell";
import { getDictionary } from "../dictionaries";

/**
 * Root layout propio de la landing de campaña en inglés (/getquote). Vive fuera
 * de `[lang]`, así que Next lo trata como root layout independiente (ver
 * docs/agents): debe aportar `<html>`/`<body>`, cosa que hace vía SiteShell.
 */
const dict = getDictionary("en");

export const metadata: Metadata = {
  title: dict.quote.metaTitle,
  description: dict.quote.metaDescription,
  alternates: {
    canonical: "/getquote",
    languages: { es: "/cotiza", en: "/getquote" },
  },
};

export default function GetQuoteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SiteShell lang="en" dict={dict} showWhatsAppFloating={false}>
      {children}
    </SiteShell>
  );
}
