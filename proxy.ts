import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, locales } from "./app/dictionaries";

/**
 * Manda las rutas sin idioma (/, /contacto...) al idioma preferido del navegador,
 * con español como respaldo. En Next 16 esto vive en proxy.ts, no en middleware.ts.
 */
function getLocale(request: NextRequest) {
  const header = request.headers.get("accept-language");
  if (!header) return defaultLocale;

  const preferred = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { tag: tag.split("-")[0].toLowerCase(), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  return preferred.find((p) => isLocale(p.tag))?.tag ?? defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) =>
      pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return;

  request.nextUrl.pathname = `/${getLocale(request)}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Deja pasar API, assets y archivos internos; solo redirige rutas de página.
  // `api` es imprescindible: sin él, /api/contact se redirige a /es/api/contact
  // y el endpoint deja de responder. `getquote`/`cotiza` son las landings de
  // campaña: viven fuera de `[lang]` con URL limpia, así que NO deben redirigirse
  // al idioma del navegador (romperían el enlace del anuncio).
  matcher: [
    "/((?!api|_next|assets|favicon.ico|getquote|cotiza|renta-de-naves-industriales|.*\\.).*)",
  ],
};
