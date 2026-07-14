import Image from "next/image";
import { ContactForm } from "./components/contact-form";
import { LocationTabs } from "./components/location-tabs";
import { Reveal } from "./components/reveal";
import { fronteras, marqueeWords, stats } from "./content";

const SHELL = "mx-auto w-full max-w-[1400px] px-6 md:px-10";
const EYEBROW = "text-[12.5px] font-medium uppercase tracking-[3px]";

const navLinks = [
  { href: "#porque", label: "¿Por qué?" },
  { href: "#amenidades", label: "Amenidades" },
  { href: "#ubicacion", label: "Ubicación" },
  { href: "#galeria", label: "Galería" },
];

const tiles = [
  {
    num: "02",
    title: "Planta de CFE frente al parque",
    desc: "Subestación dedicada con energía de alta capacidad.",
    delay: 60,
    surface: "bg-azure text-ink",
    ghost: "text-ink/12",
    dot: "bg-ink",
    body: "text-ink/70",
  },
  {
    num: "03",
    title: "Caseta de vigilancia 24/7",
    desc: "Seguridad permanente y acceso controlado.",
    delay: 120,
    surface: "bg-ink text-white",
    ghost: "text-white/10",
    dot: "bg-azure",
    body: "text-white/60",
  },
  {
    num: "04",
    title: "Oficinas con salas de juntas",
    desc: "Espacios corporativos listos para operar.",
    delay: 0,
    surface: "bg-stone text-ink hover:bg-stone-dark",
    ghost: "text-ink/10",
    dot: "bg-azure",
    body: "text-ink/55",
  },
  {
    num: "05",
    title: "Rampas neumáticas",
    desc: "Andenes para carga y descarga eficiente.",
    delay: 60,
    surface: "bg-stone text-ink hover:bg-stone-dark",
    ghost: "text-ink/10",
    dot: "bg-azure",
    body: "text-ink/55",
  },
  {
    num: "06",
    title: "+200,000 casas alrededor",
    desc: "Mano de obra calificada de inmediato.",
    delay: 120,
    surface: "bg-ink text-white",
    ghost: "text-white/10",
    dot: "bg-azure",
    body: "text-white/60",
  },
];

const visionFacts = [
  { term: "Fundación", value: "2024" },
  { term: "Giro", value: "Parques Industriales" },
  { term: "Región", value: "Noreste de México · Texas" },
];

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      {/* NAV */}
      <header className="sticky top-0 z-50 border-b border-stone bg-white/90 backdrop-blur-md">
        <div className={`${SHELL} flex h-[78px] items-center justify-between`}>
          <a href="#top" className="flex items-center">
            <Image
              src="/assets/logo-black.png"
              alt="R.C. Parks"
              width={500}
              height={87}
              priority
              className="h-[26px] w-auto"
            />
          </a>
          <nav className="flex items-center gap-5 md:gap-9">
            <div className="hidden items-center gap-9 md:flex">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-[14.5px] text-ink/70 transition-colors hover:text-ink"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <a
              href="#contacto"
              className="rounded-[2px] bg-ink px-[22px] py-3 text-[14.5px] font-medium text-white transition-colors hover:bg-azure hover:text-ink"
            >
              Solicitar espacio
            </a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section
        id="top"
        className="relative flex min-h-[90vh] items-end overflow-hidden bg-ink text-white"
      >
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/assets/drone.jpg"
            alt="Vista aérea del parque en Ciénega de Flores"
            fill
            priority
            sizes="100vw"
            className="animate-kenburns object-cover opacity-[0.62]"
          />
        </div>
        <div className="absolute inset-0 z-10 bg-linear-0 from-ink/95 from-0% via-ink/45 via-45% to-ink/25" />

        <div className={`${SHELL} relative z-20 pt-32 pb-20`}>
          <div className="fade-up mb-6 flex items-center gap-[13px]">
            <span className="h-px w-[34px] bg-azure" />
            <span className={`${EYEBROW} text-azure`}>
              Parque Industrial · Ciénega de Flores, N.L.
            </span>
          </div>

          <h1 className="fade-up max-w-[1050px] text-[clamp(2.6rem,7vw,80px)] leading-[0.98] font-medium tracking-[-0.037em] text-balance">
            El futuro de la innovación industrial.
          </h1>

          <div className="fade-up mt-9 flex flex-wrap items-end justify-between gap-8">
            <p className="max-w-[560px] text-[clamp(1rem,2vw,20px)] leading-[1.55] text-pretty text-white/85">
              Espacios Triple A diseñados para la nueva era de manufactura y
              almacenamiento inteligente. Redefiniendo la logística industrial
              del Noreste de México y Texas.
            </p>
            <div className="flex flex-wrap gap-3.5">
              <a
                href="#contacto"
                className="rounded-[2px] bg-azure px-[34px] py-[17px] text-[16px] font-medium text-ink transition-colors hover:bg-white"
              >
                Solicitar un espacio
              </a>
              <a
                href="#ubicacion"
                className="rounded-[2px] border border-white/45 px-[34px] py-[17px] text-[16px] transition-colors hover:border-white hover:bg-white/10"
              >
                Ver ubicación
              </a>
            </div>
          </div>
        </div>
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
              {marqueeWords.map((word) => (
                <span key={word}>
                  <span className="text-[15px] font-medium tracking-[0.5px] uppercase">
                    {word}
                  </span>
                  <span className="mx-7 inline-block size-[9px] rounded-full bg-ink align-middle" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* STATS */}
      <section className="bg-ink py-24 text-white">
        <div className={SHELL}>
          <div className="grid grid-cols-1 gap-px border border-white/15 bg-white/15 sm:grid-cols-3">
            {stats.map((stat) => (
              <Reveal key={stat.label} delay={stat.delay} className="bg-ink">
                <div className="px-6 py-10 md:px-[34px] md:py-[46px]">
                  <div className="text-[clamp(2.2rem,4vw,54px)] leading-none font-medium tracking-[-0.046em] whitespace-nowrap text-azure">
                    {stat.value}
                  </div>
                  <div className="mt-3.5 text-[15px] leading-[1.4] text-white/60">
                    {stat.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* POR QUÉ */}
      <section id="porque" className="scroll-mt-20 bg-white py-24 md:py-32">
        <div className={SHELL}>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <Reveal>
              <span className={`${EYEBROW} text-azure`}>
                01 — ¿Por qué R.C. Parks?
              </span>
              <div className="mt-[22px] h-0.5 w-[54px] bg-ink" />
            </Reveal>
            <Reveal delay={120}>
              <h2 className="text-[clamp(2rem,4vw,46px)] leading-[1.1] font-medium tracking-[-0.035em] text-balance">
                El epicentro de las oportunidades en el sector industrial de
                Monterrey.
              </h2>
              <p className="mt-7 text-[clamp(1rem,1.8vw,19px)] leading-[1.65] text-pretty text-ink/70">
                En R.C. Parks no solo ofrecemos lugares: encarnamos una visión
                sólida y un compromiso con la excelencia. Representamos más que
                espacios, representamos oportunidades para el crecimiento y el
                éxito empresarial.
              </p>
              <p className="mt-5 text-[clamp(1rem,1.8vw,19px)] leading-[1.65] text-pretty text-ink/70">
                Combinamos infraestructura, ubicación y asesoría para el éxito
                de nuestros clientes, generando un impacto positivo en el
                desarrollo económico y social de la región.
              </p>
            </Reveal>
          </div>

          <Reveal delay={80} className="mt-16">
            <div className="relative overflow-hidden rounded-[4px]">
              <Image
                src="/assets/render-entrance.png"
                alt="Acceso principal del parque"
                width={1600}
                height={900}
                sizes="(max-width: 1400px) 100vw, 1400px"
                className="h-[320px] w-full object-cover md:h-[520px]"
              />
              <div className="absolute inset-x-0 bottom-0 bg-linear-0 from-ink/85 to-transparent px-6 py-8 text-white md:px-10">
                <span className="text-[13px] tracking-[2px] text-azure uppercase">
                  Acceso controlado · Vigilancia 24/7
                </span>
                <div className="mt-1.5 text-[clamp(1.15rem,2.2vw,24px)] font-medium tracking-[-0.5px]">
                  Un parque diseñado para operar de clase mundial.
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* AMENIDADES */}
      <section id="amenidades" className="scroll-mt-20 bg-white py-24 md:py-32">
        <div className={SHELL}>
          <Reveal className="mb-16">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <span className={`${EYEBROW} text-ink/50`}>
                  02 — Amenidades estratégicas
                </span>
                <h2 className="mt-[18px] text-[clamp(2rem,4vw,48px)] leading-[1.05] font-medium tracking-[-0.035em]">
                  Parque Ciénega de Flores
                </h2>
              </div>
              <p className="max-w-[300px] text-[15px] leading-[1.55] text-ink/60">
                Ciénega de Flores 405, Predio No. 23, Zona Norte, N.L. México.
              </p>
            </div>
          </Reveal>

          <div className="grid auto-rows-[232px] grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature tile — spans 2x2 on the bento grid */}
            <Reveal className="sm:col-span-2 sm:row-span-2">
              <div className="relative h-full overflow-hidden rounded-[5px] transition-transform duration-400 hover:-translate-y-[5px]">
                <Image
                  src="/assets/render-aerial.png"
                  alt="Bodegas Triple A"
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
                  <span className="text-xs font-medium tracking-[2px] text-azure uppercase">
                    Construcción de concreto
                  </span>
                  <h3 className="mt-2.5 text-[clamp(1.5rem,3vw,34px)] leading-[1.08] font-medium tracking-[-0.035em]">
                    Bodegas Triple A / AAA
                  </h3>
                  <p className="mt-3 max-w-[440px] text-[16px] leading-[1.5] text-white/80">
                    Naves modulares de la más alta especificación, listas para
                    manufactura y almacenamiento inteligente.
                  </p>
                </div>
              </div>
            </Reveal>

            {tiles.map((tile) => (
              <Reveal key={tile.num} delay={tile.delay}>
                <div
                  className={`relative flex h-full flex-col justify-between overflow-hidden rounded-[5px] p-[30px] transition-[transform,background-color] duration-400 hover:-translate-y-[5px] ${tile.surface}`}
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
                      {tile.title}
                    </h3>
                    <p className={`mt-2 text-sm leading-[1.45] ${tile.body}`}>
                      {tile.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* VISIÓN */}
      <section className="relative overflow-hidden bg-azure py-24 text-ink md:py-30">
        <span
          className="pointer-events-none absolute -top-10 -right-2.5 text-[240px] leading-none font-medium tracking-[-12px] text-ink/5"
          aria-hidden
        >
          R.C.
        </span>
        <div className={`${SHELL} relative`}>
          <Reveal>
            <div className="mb-7 flex items-center gap-[13px]">
              <span className="h-px w-[34px] bg-ink" />
              <span className={EYEBROW}>Nuestra visión</span>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="max-w-[1080px] text-[clamp(2.2rem,5vw,60px)] leading-[1.04] font-medium tracking-[-0.04em] text-balance">
              “Tenemos una visión de futuro: ser el referente del sector
              industrial.”
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-7 max-w-[680px] text-[clamp(1.05rem,2vw,21px)] leading-[1.5] text-pretty text-ink/70">
              Conectamos negocios con soluciones de infraestructura de clase
              mundial, generando un impacto positivo en el desarrollo económico
              y social de la región.
            </p>
          </Reveal>
          <Reveal delay={220}>
            <dl className="mt-14 flex flex-wrap gap-12 border-t border-ink/20 pt-7">
              {visionFacts.map((fact) => (
                <div key={fact.term}>
                  <dt className="text-[13px] tracking-[1.5px] text-ink/50 uppercase">
                    {fact.term}
                  </dt>
                  <dd className="mt-1.5 text-[24px] font-medium tracking-[-0.5px]">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* GALERÍA */}
      <section
        id="galeria"
        className="scroll-mt-20 bg-ink py-24 text-white md:py-32"
      >
        <div className={SHELL}>
          <Reveal className="mb-14">
            <span className={`${EYEBROW} text-azure`}>03 — Galería</span>
            <h2 className="mt-[18px] max-w-[700px] text-[clamp(2rem,4vw,48px)] leading-[1.05] font-medium tracking-[-0.035em] text-balance">
              Bodegas Triple A, listas para la operación de clase mundial.
            </h2>
          </Reveal>

          <Reveal delay={60} className="mb-4">
            <div className="relative overflow-hidden rounded-[4px]">
              <Image
                src="/assets/render-aerial.png"
                alt="Vista aérea del masterplan"
                width={1600}
                height={900}
                sizes="(max-width: 1400px) 100vw, 1400px"
                className="h-[340px] w-full object-cover md:h-[560px]"
              />
              <div className="absolute inset-x-0 bottom-0 bg-linear-0 from-ink/80 to-transparent px-6 py-7 md:px-9">
                <span className="text-[13px] tracking-[2px] text-azure uppercase">
                  Masterplan
                </span>
                <div className="mt-1 text-[clamp(1.1rem,2vw,22px)] font-medium">
                  Naves modulares con andenes y rampas neumáticas.
                </div>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            <Reveal delay={80}>
              <div className="overflow-hidden rounded-[4px]">
                <Image
                  src="/assets/render-entrance.png"
                  alt="Acceso al parque"
                  width={1200}
                  height={800}
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="h-[320px] w-full object-cover"
                />
              </div>
            </Reveal>
            <Reveal delay={140}>
              <div className="overflow-hidden rounded-[4px]">
                <Image
                  src="/assets/drone.jpg"
                  alt="Avance de obra"
                  width={1200}
                  height={800}
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="h-[320px] w-full object-cover"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* UBICACIÓN */}
      <section id="ubicacion" className="scroll-mt-20 bg-white py-24 md:py-32">
        <div className={SHELL}>
          <Reveal className="mb-14">
            <div className="max-w-[760px]">
              <span className={`${EYEBROW} text-azure`}>
                04 — Ubicación estratégica
              </span>
              <h2 className="mt-[18px] text-[clamp(2rem,4vw,48px)] leading-[1.05] font-medium tracking-[-0.035em] text-balance">
                En el corazón del corredor industrial Monterrey–Texas.
              </h2>
            </div>
          </Reveal>

          <Reveal className="mb-10">
            <div className="grid gap-4 sm:grid-cols-3">
              {fronteras.map((frontera) => (
                <div
                  key={frontera.name}
                  className="flex items-center justify-between rounded-[3px] border border-stone px-[26px] py-[22px]"
                >
                  <div>
                    <div className="text-xs tracking-[1.5px] text-ink/45 uppercase">
                      Frontera
                    </div>
                    <div className="mt-1 text-[18px] font-medium">
                      {frontera.name}
                    </div>
                  </div>
                  <div className="text-[24px] font-medium tracking-[-1px] text-azure">
                    {frontera.km}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <Reveal>
              <div className="overflow-hidden rounded-[4px] border border-stone bg-stone">
                <Image
                  src="/assets/map-infografia.png"
                  alt="Mapa de puntos estratégicos alrededor del parque"
                  width={1200}
                  height={1000}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="h-auto w-full"
                />
              </div>
            </Reveal>
            <Reveal delay={100}>
              <LocationTabs />
            </Reveal>
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section
        id="contacto"
        className="scroll-mt-20 bg-ink py-24 text-white md:py-32"
      >
        <div className={`${SHELL} grid gap-12 lg:grid-cols-2 lg:gap-20`}>
          <Reveal>
            <span className={`${EYEBROW} text-azure`}>05 — Contacto</span>
            <h2 className="mt-5 text-[clamp(2.1rem,4.5vw,50px)] leading-[1.04] font-medium tracking-[-0.04em] text-balance">
              Solicita tu espacio en R.C. Parks.
            </h2>
            <p className="mt-6 max-w-[440px] text-[clamp(1rem,1.8vw,19px)] leading-[1.6] text-pretty text-white/70">
              Déjanos tus datos y un asesor te contactará para conocer tus
              necesidades de espacio, energía y logística.
            </p>

            <div className="mt-12 flex flex-col gap-6">
              <a
                href="mailto:contacto@rc-parks.com"
                className="flex flex-col gap-1.5 transition-colors hover:text-azure"
              >
                <span className="text-xs tracking-[1.5px] text-white/40 uppercase">
                  Email
                </span>
                <span className="text-[20px] font-medium">
                  contacto@rc-parks.com
                </span>
              </a>
              <a
                href="https://wa.me/528131006363"
                className="flex flex-col gap-1.5 transition-colors hover:text-azure"
              >
                <span className="text-xs tracking-[1.5px] text-white/40 uppercase">
                  Teléfono · WhatsApp
                </span>
                <span className="text-[20px] font-medium">
                  +52 81 3100 6363
                </span>
              </a>
              <div className="flex flex-col gap-1.5">
                <span className="text-xs tracking-[1.5px] text-white/40 uppercase">
                  Dirección
                </span>
                <span className="text-[16px] leading-[1.45] text-white/75">
                  Ciénega de Flores 405, Predio No. 23,
                  <br />
                  Zona Norte, N.L. México
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <ContactForm />
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-ink pt-18 pb-12 text-white">
        <div
          className={`${SHELL} flex flex-wrap items-start justify-between gap-10`}
        >
          <div className="flex items-start gap-[22px]">
            <Image
              src="/assets/logo-square.png"
              alt="R.C. Parks"
              width={256}
              height={256}
              className="size-16 rounded-[4px]"
            />
            <p className="mt-0.5 max-w-[360px] text-[15px] leading-[1.55] text-white/55">
              Redefiniendo la logística industrial del Noreste de México y
              Texas. Espacios Triple A para la nueva era de manufactura.
            </p>
          </div>
          <div className="sm:text-right">
            <a
              href="mailto:contacto@rc-parks.com"
              className="text-[17px] font-medium transition-colors hover:text-azure"
            >
              contacto@rc-parks.com
            </a>
            <p className="mt-2 text-sm text-white/45">rc-parks.com</p>
          </div>
        </div>
        <div
          className={`${SHELL} mt-11 border-t border-white/10 pt-6 text-[13px] text-white/40`}
        >
          © 2026 R.C. Parks. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
