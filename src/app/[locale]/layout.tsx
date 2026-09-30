import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import { AdminGate } from '@/components/admin-gate';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { ThemeProvider } from '@/components/theme-provider';
import { getDictionary } from '@/lib/content/ui';
import { isLocale, localeMeta, locales, type Locale } from '@/lib/i18n';
import { buildMetadata } from '@/lib/seo';
import '../globals.css';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/** themeColor 等视口级配置在 Next 15 中需独立导出，写在 metadata 里会被忽略 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);

  return {
    ...buildMetadata({
      locale,
      description: dict.site.description,
    }),
    // 首页与各子页共用同一套标题规则：default 不套模板，子页标题自动补品牌后缀
    title: {
      default: `${dict.site.name} | ${dict.site.tagline}`,
      template: `%s | ${dict.site.name}`,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale as Locale);

  return (
    <html
      lang={localeMeta[locale as Locale].htmlLang}
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="min-h-screen">
        <ThemeProvider>
          <a href="#main" className="skip-link">
            {dict.nav.skipToContent}
          </a>
          <SiteHeader locale={locale as Locale} dict={dict} />
          <main id="main">{children}</main>
          <SiteFooter locale={locale as Locale} dict={dict} />
          <AdminGate dict={dict} />
        </ThemeProvider>
      </body>
    </html>
  );
}
