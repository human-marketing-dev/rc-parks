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
import {
  contactInfo,
  formatDistance,
  fronteras,
  rentalStats,
} from "../content";
import { getDictionary, type Locale } from "../dictionaries";

/**
 * Landing de renta (/renta-de-naves-industriales). Duplica el home pero
 * orientada a conversión: header sin navegación (para no fugar el tráfico),
 * formulario ya visible en el hero, rango arrendable en la strip y amenidades
 * en formato ícono + texto en lugar del bento con imagen.
 */

/** Íconos de amenidad, en línea y heredando color con currentColor. */
function AmenityIcon({ id }: { id: string }) {
  const common = {
    width: 28,
    height: 28,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (id) {
    case "warehouse": // nave industrial: techo a dos aguas + portones
      return (
        <svg {...common}>
          <path d="M3 21V9.5L12 4l9 5.5V21" />
          <path d="M3 21h18" />
          <path d="M9 21v-6h6v6" />
          <path d="M9 15h6" />
        </svg>
      );
    case "cfe": // planta / subestación eléctrica
      return (
        <svg {...common}>
          <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
          <path d="M7 18h1M12 18h1M17 18h1" />
        </svg>
      );
    case "security": // escudo con check: vigilancia y acceso controlado
      return (
        <svg {...common}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "offices": // sala de juntas: mesa y sillas
      return (
        <svg {...common}>
          <rect x="3" y="9" width="18" height="6" rx="1" />
          <path d="M7 9V7M17 9V7M7 17v-2M17 17v-2" />
          <path d="M5 7h4M15 7h4M5 17h4M15 17h4" />
        </svg>
      );
    case "ramps": // andén con rampa: carga y descarga
      return (
        <svg {...common}>
          <path d="M2 17h11V7H2z" />
          <path d="M13 11h4l4 4v2h-8z" />
          <circle cx="7" cy="19" r="1.6" />
          <circle cx="17" cy="19" r="1.6" />
        </svg>
      );
    case "homes": // vivienda: mano de obra alrededor
      return (
        <svg {...common}>
          <path d="M3 11.5 11 5l8 6.5" />
          <path d="M5 10.5V20h12v-9.5" />
          <path d="M9.5 20v-4.5h3V20" />
          <path d="M19 8V5h-2.5" />
        </svg>
      );
    default:
      return null;
  }
}

/**
 * Las 6 amenidades en un solo arreglo. `feature` era el tile grande con imagen
 * del home; aquí baja al mismo formato ícono + texto que las demás.
 */
const amenities = [
  { key: "feature", icon: "warehouse", delay: 0 },
  { key: "cfe", icon: "cfe", delay: 60 },
  { key: "security", icon: "security", delay: 120 },
  { key: "offices", icon: "offices", delay: 0 },
  { key: "ramps", icon: "ramps", delay: 60 },
  { key: "homes", icon: "homes", delay: 120 },
] as const;

export function RentalLanding({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);

  return (
    <div className="overflow-x-hidden">
      {/* NAV — sin enlaces de navegación: el único destino es el formulario. */}
      <header className="sticky top-0 z-50 border-b border-stone bg-white/90 backdrop-blur-md">
        <Container className="flex h-[78px] items-center justify-between">
          <a href="#top" className="flex items-center">
            <Image
              src="/assets/logo-rc-parks-black.webp"
              alt="R.C. Parks"
              width={500}
              height={87}
              priority
              className="h-[22px] w-auto md:h-[26px]"
            />
          </a>
          <Button
            href="#contacto"
            variant="dark"
            size="compact"
            className="whitespace-nowrap"
          >
            <span className="sm:hidden">{t.rental.ctaShort}</span>
            <span className="hidden sm:inline">{t.rental.cta}</span>
          </Button>
        </Container>
      </header>

      {/* HERO — información a la izquierda, formulario a la derecha. */}
      <section
        id="top"
        className="relative overflow-hidden bg-ink text-white"
      >
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Video decorativo: el <h1> lleva el significado, por eso aria-hidden. */}
          <video
            className="h-full w-full object-cover opacity-[0.62]"
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
        <div className="absolute inset-0 z-10 bg-linear-0 from-ink/95 from-0% via-ink/60 via-45% to-ink/40" />

        <Container className="relative z-20 grid items-center gap-12 pt-28 pb-20 lg:grid-cols-[1fr_minmax(0,520px)] lg:gap-16 lg:pt-32">
          <div>
            <div className="fade-up mb-6 flex items-center gap-[13px]">
              <span className="h-px w-[34px] bg-azure" />
              <Eyebrow>{t.hero.eyebrow}</Eyebrow>
            </div>

            <SectionTitle as="h1" size="xl" className="fade-up">
              {t.rental.heroTitle}
            </SectionTitle>

            <p className="fade-up mt-7 max-w-[560px] text-lead text-pretty text-white/85">
              {t.hero.lead}
            </p>
          </div>

          <div className="fade-up">
            {/* idPrefix: hay dos formularios en la página (hero y contacto) y
                los `id` no pueden repetirse o los <label> apuntan al otro. */}
            <ContactForm
              dict={t.contact.form}
              locale={lang}
              idPrefix="hero-"
            />
          </div>
        </Container>
      </section>

      {/* MARQUEE */}
      <div className="overflow-hidden border-b border-ink/10 bg-azure whitespace-nowrap text-ink">
        <div className="inline-flex animate-marquee will-change-transform">
          {[0, 1].map((copy) => (
            <span
              key={copy}
              className="inline-block py-[18px]"
              aria-hidden={copy === 1}
            >
              {t.marquee.map((word) => (
                <span key={word}>
                  <span className="text-body font-medium tracking-[0.5px] uppercase">
                    {word}
                  </span>
                  <span className="mx-7 inline-block size-[9px] rounded-full bg-ink align-middle" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* STATS — el primer dato es el rango arrendable, no el área total. */}
      <section className="bg-ink py-24 text-white">
        <Container>
          <div className="grid grid-cols-1 gap-px border border-white/15 bg-white/15 sm:grid-cols-3">
            {rentalStats.map((stat) => (
              <Reveal key={stat.id} delay={stat.delay} className="bg-ink">
                <div className="px-6 py-10 md:px-[34px] md:py-[46px]">
                  <div className="text-[clamp(1.7rem,3.2vw,44px)] leading-none font-medium tracking-[-0.046em] whitespace-nowrap text-azure">
                    {stat.range ? stat.range[lang] : stat.value}
                  </div>
                  <div className="mt-3.5 text-[15px] leading-[1.4] text-white/60">
                    {t.stats[stat.id]}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* POR QUÉ */}
      <section id="porque" className="scroll-mt-20 bg-white py-24 md:py-32">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <Reveal>
              <Eyebrow>{t.why.eyebrow}</Eyebrow>
              <div className="mt-[22px] h-0.5 w-[54px] bg-ink" />
            </Reveal>
            <Reveal delay={120}>
              <SectionTitle>{t.why.title}</SectionTitle>
              <p className="mt-7 text-lead text-pretty text-ink/70">
                {t.why.body1}
              </p>
              <p className="mt-5 text-lead text-pretty text-ink/70">
                {t.why.body2}
              </p>
            </Reveal>
          </div>

          <Reveal delay={80} className="mt-16">
            <div className="relative overflow-hidden rounded-card">
              <Image
                src="/assets/rc-parks-aerea-2.webp"
                alt={t.why.imageAlt}
                width={1280}
                height={720}
                sizes="(max-width: 1400px) 100vw, 1400px"
                className="h-[320px] w-full object-cover md:h-[520px]"
              />
              <div className="absolute inset-x-0 bottom-0 bg-linear-0 from-ink/85 to-transparent px-6 py-8 text-white md:px-10">
                <span className="text-label tracking-caption text-azure uppercase">
                  {t.why.captionEyebrow}
                </span>
                <div className="mt-1.5 text-[clamp(1.15rem,2.2vw,24px)] font-medium tracking-[-0.5px]">
                  {t.why.captionTitle}
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* AMENIDADES — ícono + texto, sin imagen. */}
      <section id="amenidades" className="scroll-mt-20 bg-white py-24 md:py-32">
        <Container>
          <Reveal className="mb-16">
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

          <div className="grid grid-cols-1 gap-px border border-stone bg-stone sm:grid-cols-2 lg:grid-cols-3">
            {amenities.map((amenity) => {
              const copy =
                amenity.key === "feature"
                  ? t.amenities.feature
                  : t.amenities.tiles[
                      amenity.key as keyof typeof t.amenities.tiles
                    ];

              return (
                <Reveal
                  key={amenity.key}
                  delay={amenity.delay}
                  className="bg-white"
                >
                  <div className="flex h-full flex-col gap-5 p-8 transition-colors duration-300 hover:bg-stone/40 md:p-10">
                    <span className="text-azure">
                      <AmenityIcon id={amenity.icon} />
                    </span>
                    <div>
                      <h3 className="text-[22px] leading-[1.15] font-medium tracking-[-0.5px]">
                        {copy.title}
                      </h3>
                      <p className="mt-2 text-sm leading-[1.5] text-ink/60">
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

      {/* VISIÓN */}
      <section className="relative overflow-hidden bg-azure py-24 text-ink md:py-30">
        <span
          className="pointer-events-none absolute -top-10 -right-2.5 text-[240px] leading-none font-medium tracking-[-12px] text-ink/5"
          aria-hidden
        >
          R.C.
        </span>
        <Container className="relative">
          <Reveal>
            <div className="mb-7 flex items-center gap-[13px]">
              <span className="h-px w-[34px] bg-ink" />
              <Eyebrow tone="inherit">{t.vision.eyebrow}</Eyebrow>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <SectionTitle size="xl" className="max-w-[1080px]">
              {t.vision.quote}
            </SectionTitle>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-7 max-w-[680px] text-lead text-pretty text-ink/70">
              {t.vision.lead}
            </p>
          </Reveal>
          <Reveal delay={220}>
            <dl className="mt-14 flex flex-wrap gap-12 border-t border-ink/20 pt-7">
              {t.vision.facts.map((fact) => (
                <div key={fact.term}>
                  <dt className="text-label tracking-label text-ink/50 uppercase">
                    {fact.term}
                  </dt>
                  <dd className="mt-1.5 text-[24px] font-medium tracking-[-0.5px]">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </Container>
      </section>

      {/* GALERÍA */}
      <section
        id="galeria"
        className="scroll-mt-20 bg-ink py-24 text-white md:py-32"
      >
        <Container>
          <Reveal className="mb-14">
            <Eyebrow>{t.gallery.eyebrow}</Eyebrow>
            <SectionTitle className="mt-[18px] max-w-[700px]">
              {t.gallery.title}
            </SectionTitle>
          </Reveal>

          <Reveal delay={60} className="mb-4">
            <div className="relative overflow-hidden rounded-card">
              <Image
                src="/assets/rc-parks-exterior.webp"
                alt={t.gallery.exteriorAlt}
                width={3016}
                height={1692}
                sizes="(max-width: 1400px) 100vw, 1400px"
                className="h-[340px] w-full object-cover md:h-[560px]"
              />
              <div className="absolute inset-x-0 bottom-0 bg-linear-0 from-ink/80 to-transparent px-6 py-7 md:px-9">
                <span className="text-label tracking-caption text-azure uppercase">
                  {t.gallery.captionEyebrow}
                </span>
                <div className="mt-1 text-[clamp(1.1rem,2vw,22px)] font-medium">
                  {t.gallery.captionTitle}
                </div>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            <Reveal delay={80}>
              <div className="overflow-hidden rounded-card">
                <Image
                  src="/assets/rc-parks-interior.webp"
                  alt={t.gallery.interiorAlt}
                  width={3016}
                  height={1692}
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="h-[320px] w-full object-cover"
                />
              </div>
            </Reveal>
            <Reveal delay={140}>
              <div className="overflow-hidden rounded-card">
                <Image
                  src="/assets/rc-parks-oficinas.webp"
                  alt={t.gallery.oficinasAlt}
                  width={3016}
                  height={1692}
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="h-[320px] w-full object-cover"
                />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* UBICACIÓN */}
      <section id="ubicacion" className="scroll-mt-20 bg-white py-24 md:py-32">
        <Container>
          <Reveal className="mb-14">
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
                  className="flex items-center justify-between rounded-field border border-stone px-[26px] py-[22px]"
                >
                  <div>
                    <div className="text-xs tracking-label text-ink/45 uppercase">
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
              <div className="overflow-hidden rounded-card border border-stone bg-stone">
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

      {/* CONTACTO */}
      <section
        id="contacto"
        className="scroll-mt-20 bg-ink py-24 text-white md:py-32"
      >
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <Eyebrow>{t.contact.eyebrow}</Eyebrow>
            <SectionTitle className="mt-5">{t.contact.title}</SectionTitle>
            <p className="mt-6 max-w-[440px] text-lead text-pretty text-white/70">
              {t.contact.lead}
            </p>

            <div className="mt-12 flex flex-col gap-6">
              <a
                href={`mailto:${contactInfo.email}`}
                className="flex flex-col gap-1.5 transition-colors hover:text-azure"
              >
                <span className="text-xs tracking-label text-white/40 uppercase">
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
                <span className="text-xs tracking-label text-white/40 uppercase">
                  {t.contact.phoneLabel}
                </span>
                <span className="text-[20px] font-medium">
                  {contactInfo.phone}
                </span>
              </WhatsAppTrigger>
              <div className="flex flex-col gap-1.5">
                <span className="text-xs tracking-label text-white/40 uppercase">
                  {t.contact.addressLabel}
                </span>
                <span className="text-body leading-[1.45] text-white/75">
                  {t.contact.addressLine1}
                  <br />
                  {t.contact.addressLine2}
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <ContactForm dict={t.contact.form} locale={lang} />
          </Reveal>
        </Container>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-ink pt-18 pb-12 text-white">
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
          <Link
            href={`/${lang}/aviso-de-privacidad`}
            className="transition-colors hover:text-azure"
          >
            {t.footer.privacy}
          </Link>
        </Container>
      </footer>
    </div>
  );
}
