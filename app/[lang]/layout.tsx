import type { Metadata } from "next";
import "../globals.css";
import { AttributionTracker } from "../components/attribution-tracker";
import { getDictionary, isLocale, locales, defaultLocale } from "../dictionaries";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(isLocale(lang) ? lang : defaultLocale);

  return {
    title: dict.metadata.title,
    description: dict.metadata.description,
    alternates: {
      canonical: `/${lang}`,
      languages: { es: "/es", en: "/en" },
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;

  return (
    <html lang={lang} className="h-full antialiased">
      <body className="flex min-h-full flex-col font-sans">
        <AttributionTracker />
        {children}
      </body>
    </html>
  );
}
