import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LanguageSwitch } from "../../components/language-switch";
import { Container } from "../../components/ui/container";
import { Eyebrow } from "../../components/ui/eyebrow";
import { SectionTitle } from "../../components/ui/section-title";
import { getDictionary, isLocale, defaultLocale } from "../../dictionaries";

/** Prosa legal: un solo lugar define el cuerpo de texto de toda la página. */
const PROSE = "text-[15.5px] leading-[1.75] text-ink/75";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/aviso-de-privacidad">): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(isLocale(lang) ? lang : defaultLocale);

  return {
    title: dict.privacy.metaTitle,
    description: dict.privacy.metaDescription,
    alternates: {
      canonical: `/${lang}/aviso-de-privacidad`,
      languages: {
        es: "/es/aviso-de-privacidad",
        en: "/en/aviso-de-privacidad",
      },
    },
  };
}

export default async function PrivacyPage({
  params,
}: PageProps<"/[lang]/aviso-de-privacidad">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const t = getDictionary(lang);

  return (
    <>
      <header className="border-b border-stone bg-white">
        <Container className="flex h-[78px] items-center justify-between">
          <Link href={`/${lang}`} className="flex items-center">
            <Image
              src="/assets/logo-rc-parks-black.webp"
              alt="R.C. Parks"
              width={500}
              height={87}
              priority
              className="h-[22px] w-auto md:h-[26px]"
            />
          </Link>
          <nav className="flex items-center gap-4 md:gap-6">
            <Link
              href={`/${lang}`}
              className="text-nav text-ink/70 transition-colors hover:text-ink"
            >
              {t.privacy.backHome}
            </Link>
            <LanguageSwitch locale={lang} dict={t.languageSwitch} />
          </nav>
        </Container>
      </header>

      <main className="flex-1 bg-white py-16 md:py-24">
        <Container>
          <div className="max-w-[860px]">
            <Eyebrow>{t.privacy.eyebrow}</Eyebrow>
            <SectionTitle className="mt-4">{t.privacy.title}</SectionTitle>
            <p className="mt-3 text-label text-ink/45">{t.privacy.updated}</p>

            {t.privacy.intro.map((paragraph) => (
              <p key={paragraph} className={`mt-6 ${PROSE}`}>
                {paragraph}
              </p>
            ))}

            {t.privacy.sections.map((section) => (
              <section key={section.heading} className="mt-12">
                <h2 className="text-[20px] font-medium tracking-[-0.3px]">
                  {section.heading}
                </h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className={`mt-4 ${PROSE}`}>
                    {paragraph}
                  </p>
                ))}
                {section.items.length > 0 ? (
                  <ul className={`mt-4 flex list-disc flex-col gap-2 pl-5 marker:text-azure ${PROSE}`}>
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
                {section.after.map((paragraph) => (
                  <p key={paragraph} className={`mt-4 ${PROSE}`}>
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </Container>
      </main>

      <footer className="border-t border-stone bg-white">
        <Container className="flex flex-wrap items-center justify-between gap-4 py-8 text-label text-ink/45">
          <span>{t.footer.rights}</span>
          <Link
            href={`/${lang}`}
            className="transition-colors hover:text-ink"
          >
            {t.privacy.backHome}
          </Link>
        </Container>
      </footer>
    </>
  );
}
