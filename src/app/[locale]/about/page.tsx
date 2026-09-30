import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/lib/content/ui';
import { isLocale, type Locale } from '@/lib/i18n';
import { buildMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);

  return buildMetadata({
    locale,
    title: dict.about.seoTitle,
    description: dict.about.body,
    path: '/about',
  });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale as Locale);

  return (
    <article className="container-page pb-8 pt-16 md:pt-24">
      <p className="eyebrow">{dict.about.eyebrow}</p>
      <h1 className="mt-5 max-w-[20ch] text-[32px] font-medium leading-[1.1] tracking-[-0.035em] sm:text-[44px]">
        {dict.about.heading}
      </h1>
      <p className="mt-6 max-w-[58ch] text-[16px] text-muted">{dict.about.body}</p>

      <div className="mt-16 grid gap-12 border-t border-line pt-10 md:grid-cols-2">
        <div>
          <h2 className="text-[18px] font-medium tracking-[-0.02em]">{dict.about.principleTitle}</h2>
          <ul className="mt-4 max-w-[52ch]">
            {dict.about.principles.map((item) => (
              <li key={item} className="flex gap-3 border-t border-line py-3 text-[15px] last:border-b">
                <span className="mt-[9px] size-[5px] shrink-0 bg-fg" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-[18px] font-medium tracking-[-0.02em]">{dict.about.contactTitle}</h2>
          <p className="mt-4 max-w-[52ch] text-[15px] text-muted">{dict.about.contactBody}</p>
        </div>
      </div>
    </article>
  );
}
