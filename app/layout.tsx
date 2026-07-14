import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "R.C. Parks — El futuro de la innovación industrial",
  description:
    "Parque industrial en Ciénega de Flores, N.L. Bodegas Triple A para manufactura y almacenamiento inteligente en el corredor Monterrey–Texas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
