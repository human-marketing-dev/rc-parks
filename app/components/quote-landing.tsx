import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "./contact-form";
import { LocationTabs } from "./location-tabs";
import { Reveal } from "./reveal";
import { SocialLinks } from "./social-links";
import { Button } from "./ui/button";
import { Container } from "./ui/container";
import { Eyebrow } from "./ui/eyebrow";
import { SectionTitle } from "./ui/section-title";
import { WhatsAppTrigger } from "./whatsapp-provider";
import { contactInfo, formatDistance, fronteras } from "../content";
import { getDictionary, type Dictionary, type Locale } from "../dictionaries";

/**
 * Landing de campaña (Google Ads) compartida por /cotiza (es) y /getquote (en).
 * Reutiliza el diseño y las secciones del home, pero reordenada para conversión:
 * hero con formulario a la vista, diferenciadores, inventario y una prueba
 * visual (amenidades + ubicación) antes del cierre. Los enlaces de navegación
 * del home se omiten a propósito para no fugar el tráfico pagado.
 */

/** Íconos de los diferenciadores (línea, heredan color con currentColor). */
function DiffIcon({ id }: { id: string }) {
  const common = {
    width: 26,
    height: 26,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (id) {
    case "cfe": // planta / subestación
      return (
        <svg {...common}>
          <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
          <path d="M7 18h1M12 18h1M17 18h1" />
        </svg>
      );
    case "power": // rayo / capacidad eléctrica
      return (
        <svg {...common}>
          <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
        </svg>
      );
    case "security": // escudo con check
      return (
        <svg {...common}>
          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "airport": // avión
      return (
        <svg {...common}>
          <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
        </svg>
      );
    case "border": // camión / logística a frontera
      return (
        <svg {...common}>
          <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h1" />
          <path d="M15 18H9" />
          <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
          <circle cx="7" cy="18" r="2" />
          <circle cx="18" cy="18" r="2" />
        </svg>
      );
    default:
      return null;
  }
}

/** Solo la apariencia del bento de amenidades: los textos salen del diccionario. */
const tileStyles = [
  {
    key: "cfe",
    num: "02",
    delay: 60,
    surface: "bg-azure text-ink",
    ghost: "text-ink/12",
    dot: "bg-ink",
    body: "text-ink/70",
  },
  {
    key: "security",
    num: "03",
    delay: 120,
    surface: "bg-ink text-white",
    ghost: "text-white/10",
    dot: "bg-azure",
    body: "text-white/60",
  },
  {
    key: "offices",
    num: "04",
    delay: 0,
    surface: "bg-stone text-ink hover:bg-stone-dark",
    ghost: "text-ink/10",
    dot: "bg-azure",
    body: "text-ink/55",
  },
  {
    key: "ramps",
    num: "05",
    delay: 60,
    surface: "bg-stone text-ink hover:bg-stone-dark",
    ghost: "text-ink/10",
    dot: "bg-azure",
    body: "text-ink/55",
  },
  {
    key: "homes",
    num: "06",
    delay: 120,
    surface: "bg-ink text-white",
    ghost: "text-white/10",
    dot: "bg-azure",
    body: "text-white/60",
  },
] as const;

export function QuoteLanding({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);
  const q = t.quote;

  const privacyHref = `/${lang}/aviso-de-privacidad`;
  // Cada landing enlaza a la otra: /cotiza ↔ /getquote.
  const otherHref = lang === "es" ? "/getquote" : "/cotiza";

  // Formulario de campaña: mismo form del sitio, con el CTA renombrado a
  // "Solicitar Espacio" y el checkbox de consentimiento activado.
  const formDict = { ...t.contact.form, submit: q.hero.cta };
  const consent = { ...q.consent, href: privacyHref };

  return (
    <div className="overflow-x-hidden">
      {/* NAV — mínimo: sin menú de secciones para no fugar el tráfico pagado. */}
      <header className="sticky top-0 z-50 border-b border-stone bg-white/90 backdrop-blur-md">
        <Container className="flex h-[70px] items-center justify-between">
          <Link href={`/${lang}`} className="flex items-center">
            <Image
              src="/assets/logo-rc-parks-black.webp"
              alt="R.C. Parks"
              width={500}
              height={87}
              priority
              className="h-[22px] w-auto md:h-[24px]"
            />
          </Link>
          <div className="flex items-center gap-3 md:gap-5">
            <Link
              href={otherHref}
              className="text-nav text-ink/70 transition-colors hover:text-ink"
            >
              {q.nav.otherLang}
            </Link>
            <Button
              href="#cotizar"
              variant="dark"
              size="compact"
              className="whitespace-nowrap"
            >
              {q.nav.cta}
            </Button>
          </div>
        </Container>
      </header>

      {/* HERO con formulario a la vista sobre el video de fondo. */}
      <section
        id="cotizar"
        className="relative flex items-center overflow-hidden bg-ink py-14 text-white md:min-h-[calc(100svh-70px)] md:py-20"
      >
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            className="h-full w-full object-cover opacity-[0.5]"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/assets/hero-poster.jpg"
            aria-hidden="true"
          >
            <source src="/assets/hero.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="absolute inset-0 z-10 bg-linear-0 from-ink/95 from-0% via-ink/70 via-50% to-ink/60" />

        <Container className="relative z-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            {/* Columna izquierda: propuesta de valor */}
            <div>
              <div className="fade-up mb-5 flex items-center gap-[13px]">
                <span className="h-px w-[34px] bg-azure" />
                <Eyebrow>{q.hero.eyebrow}</Eyebrow>
              </div>
              <SectionTitle as="h1" size="xl" className="fade-up max-w-[620px]">
                {q.hero.title}
              </SectionTitle>
              <p className="fade-up mt-4 text-display-md font-medium text-azure">
                {q.hero.range}
              </p>
              <p className="fade-up mt-6 max-w-[520px] text-lead text-pretty text-white/85">
                {q.hero.lead}
              </p>
            </div>

            {/* Columna derecha: formulario */}
            <div className="fade-up">
              <div className="mb-4">
                <h2 className="text-[22px] font-medium tracking-[-0.5px]">
                  {q.hero.formHeading}
                </h2>
                <p className="mt-1 text-[14px] text-white/60">
                  {q.hero.formSub}
                </p>
              </div>
              <ContactForm
                dict={formDict}
                locale={lang}
                consent={consent}
                idPrefix="hero-"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* DIFERENCIADORES — tira de íconos */}
      <section className="border-b border-stone bg-white py-14 md:py-16">
        <Container>
          <Reveal className="mb-9">
            <Eyebrow tone="muted">{q.differentiators.eyebrow}</Eyebrow>
            <SectionTitle className="mt-3 max-w-[720px]">
              {q.differentiators.title}
            </SectionTitle>
          </Reveal>
          <div className="grid grid-cols-2 gap-x-6 gap-y-9 sm:grid-cols-3 lg:grid-cols-5">
            {q.differentiators.items.map((item) => (
              <div key={item.id} className="flex flex-col gap-2.5">
                <span className="flex size-11 items-center justify-center rounded-field bg-azure/15 text-azure">
                  <DiffIcon id={item.id} />
                </span>
                <span className="text-[22px] leading-none font-medium tracking-[-0.5px]">
                  {item.value}
                </span>
                <span className="text-[14px] leading-[1.4] text-ink/60">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* PRODUCTOS — inventario y rangos de m² */}
      <section className="bg-white py-20 md:py-28">
        <Container>
          <Reveal className="mb-12 max-w-[720px]">
            <Eyebrow>{q.products.eyebrow}</Eyebrow>
            <SectionTitle className="mt-[18px]">{q.products.title}</SectionTitle>
            <p className="mt-5 text-lead text-pretty text-ink/70">
              {q.products.lead}
            </p>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-2">
            {q.products.items.map((product, index) => {
              const dark = index === 1;
              return (
                <Reveal key={product.id} delay={index * 80}>
                  <div
                    className={`flex h-full flex-col rounded-tile p-8 md:p-10 ${
                      dark ? "bg-ink text-white" : "border border-stone bg-stone"
                    }`}
                  >
                    <span
                      className={`text-label tracking-label uppercase ${
                        dark ? "text-azure" : "text-ink/45"
                      }`}
                    >
                      {q.products.rangeLabel}
                    </span>
                    <span className="mt-2 text-display-md font-medium tracking-[-0.02em] text-azure">
                      {product.range}
                    </span>
                    <h3 className="mt-4 text-[22px] font-medium tracking-[-0.5px]">
                      {product.name}
                    </h3>
                    <p
                      className={`mt-3 text-body leading-[1.5] ${
                        dark ? "text-white/70" : "text-ink/65"
                      }`}
                    >
                      {product.body}
                    </p>
                    {product.note ? (
                      <span
                        className={`mt-5 inline-flex w-fit rounded-btn px-3 py-1.5 text-[13px] font-medium ${
                          dark
                            ? "bg-azure text-ink"
                            : "bg-ink text-white"
                        }`}
                      >
                        {product.note}
                      </span>
                    ) : null}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* AMENIDADES (bento) — prueba visual del parque */}
      <section className="bg-white pb-20 md:pb-28">
        <Container>
          <Reveal className="mb-12">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <Eyebrow tone="muted">{t.amenities.eyebrow}</Eyebrow>
                <SectionTitle className="mt-[18px]">
                  {t.amenities.title}
                </SectionTitle>
              </div>
              <p className="max-w-[300px] text-[15px] leading-[1.55] text-ink/60">
                {t.amenities.address}
              </p>
            </div>
          </Reveal>

          <div className="grid auto-rows-[232px] grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            <Reveal className="sm:col-span-2 sm:row-span-2">
              <div className="relative h-full overflow-hidden rounded-tile transition-transform duration-400 hover:-translate-y-[5px]">
                <Image
                  src="/assets/rc-parks-aerea.webp"
                  alt={t.amenities.feature.imageAlt}
                  fill
                  sizes="(max-width: 640px) 100vw, 66vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-0 from-ink/90 from-0% via-ink/15 via-60% to-ink/35" />
                <span
                  className="absolute top-6 right-[30px] text-[120px] leading-none font-medium tracking-[-4px] text-white/15"
                  aria-hidden
                >
                  01
                </span>
                <div className="absolute inset-x-0 bottom-0 max-w-[560px] p-8 text-white md:p-10">
                  <span className="text-xs font-medium tracking-caption text-azure uppercase">
                    {t.amenities.feature.eyebrow}
                  </span>
                  <h3 className="mt-2.5 text-display-md font-medium">
                    {t.amenities.feature.title}
                  </h3>
                  <p className="mt-3 max-w-[440px] text-body leading-[1.5] text-white/80">
                    {t.amenities.feature.body}
                  </p>
                </div>
              </div>
            </Reveal>

            {tileStyles.map((tile) => {
              const copy =
                t.amenities.tiles[
                  tile.key as keyof Dictionary["amenities"]["tiles"]
                ];
              return (
                <Reveal key={tile.key} delay={tile.delay}>
                  <div
                    className={`relative flex h-full flex-col justify-between overflow-hidden rounded-tile p-[30px] transition-[transform,background-color] duration-400 hover:-translate-y-[5px] ${tile.surface}`}
                  >
                    <span
                      className={`absolute top-3.5 right-6 text-[72px] leading-none font-medium tracking-[-3px] ${tile.ghost}`}
                      aria-hidden
                    >
                      {tile.num}
                    </span>
                    <span
                      className={`size-[9px] rounded-full ${tile.dot}`}
                      aria-hidden
                    />
                    <div>
                      <h3 className="text-[22px] leading-[1.15] font-medium tracking-[-0.5px]">
                        {copy.title}
                      </h3>
                      <p className={`mt-2 text-sm leading-[1.45] ${tile.body}`}>
                        {copy.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* UBICACIÓN — prueba de logística (fronteras + mapa) */}
      <section className="bg-ink py-20 text-white md:py-28">
        <Container>
          <Reveal className="mb-12">
            <div className="max-w-[760px]">
              <Eyebrow>{t.location.eyebrow}</Eyebrow>
              <SectionTitle className="mt-[18px]">
                {t.location.title}
              </SectionTitle>
            </div>
          </Reveal>

          <Reveal className="mb-10">
            <div className="grid gap-4 sm:grid-cols-3">
              {fronteras.map((frontera) => (
                <div
                  key={frontera.id}
                  className="flex items-center justify-between rounded-field border border-white/15 px-[26px] py-[22px]"
                >
                  <div>
                    <div className="text-xs tracking-label text-white/40 uppercase">
                      {t.location.borderLabel}
                    </div>
                    <div className="mt-1 text-[18px] font-medium">
                      {frontera.name}
                    </div>
                  </div>
                  <div className="text-[24px] font-medium tracking-[-1px] text-azure">
                    {formatDistance(frontera.km, lang)}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <Reveal>
              <div className="overflow-hidden rounded-card border border-white/15 bg-white/5">
                <Image
                  src="/assets/mapa-rc-parks.webp"
                  alt={t.location.mapAlt}
                  width={1599}
                  height={1600}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="h-auto w-full"
                />
              </div>
            </Reveal>
            <Reveal delay={100}>
              <LocationTabs dict={t.location} locale={lang} />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* CIERRE — segundo formulario */}
      <section className="scroll-mt-20 bg-white py-20 md:py-28">
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <Eyebrow tone="muted">{t.contact.eyebrow}</Eyebrow>
            <SectionTitle className="mt-5">{q.hero.formHeading}</SectionTitle>
            <p className="mt-6 max-w-[440px] text-lead text-pretty text-ink/70">
              {t.contact.lead}
            </p>

            <div className="mt-12 flex flex-col gap-6">
              <a
                href={`mailto:${contactInfo.email}`}
                className="flex flex-col gap-1.5 transition-colors hover:text-azure"
              >
                <span className="text-xs tracking-label text-ink/40 uppercase">
                  {t.contact.emailLabel}
                </span>
                <span className="text-[20px] font-medium">
                  {contactInfo.email}
                </span>
              </a>
              <WhatsAppTrigger
                location="contact_section"
                className="flex flex-col gap-1.5 transition-colors hover:text-azure"
              >
                <span className="text-xs tracking-label text-ink/40 uppercase">
                  {t.contact.phoneLabel}
                </span>
                <span className="text-[20px] font-medium">
                  {contactInfo.phone}
                </span>
              </WhatsAppTrigger>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="rounded-card border border-stone p-1.5">
              <ContactForm dict={formDict} locale={lang} consent={consent} />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-ink pt-16 pb-12 text-white">
        <Container className="flex flex-wrap items-start justify-between gap-10">
          <div className="flex items-start gap-[22px]">
            <Image
              src="/assets/logo-rc-parks-blue-black.webp"
              alt="R.C. Parks"
              width={256}
              height={256}
              className="size-16 rounded-card"
            />
            <p className="mt-0.5 max-w-[360px] text-[15px] leading-[1.55] text-white/55">
              {t.footer.tagline}
            </p>
          </div>
          <div className="flex flex-col gap-5 sm:items-end sm:text-right">
            <div>
              <a
                href={`mailto:${contactInfo.email}`}
                className="text-[17px] font-medium transition-colors hover:text-azure"
              >
                {contactInfo.email}
              </a>
              <p className="mt-2 text-sm text-white/45">{contactInfo.site}</p>
            </div>
            <SocialLinks label={t.footer.social} />
          </div>
        </Container>
        <Container className="mt-11 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-white/10 pt-6 text-label text-white/40">
          <span>{t.footer.rights}</span>
          <div className="flex gap-x-6">
            <Link
              href={privacyHref}
              className="transition-colors hover:text-azure"
            >
              {t.footer.privacy}
            </Link>
            <Link href={`/${lang}`} className="transition-colors hover:text-azure">
              {contactInfo.site}
            </Link>
          </div>
        </Container>
      </footer>
    </div>
  );
}
