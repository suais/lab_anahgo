import type { CSSProperties } from 'react';
import { notFound } from 'next/navigation';
import { BigBang } from '@/components/big-bang';
import { DomainMarquee } from '@/components/domain-marquee';
import { JsonLd } from '@/components/json-ld';
import { ProjectDirectory } from '@/components/project-directory';
import { SplitText } from '@/components/split-text';
import { getCategories, getProjects } from '@/lib/content/projects';
import { getDictionary } from '@/lib/content/ui';
import { isLocale, localeMeta, type Locale } from '@/lib/i18n';
import { organizationNode } from '@/lib/seo';
import { absoluteUrl, siteConfig } from '@/lib/site';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale as Locale);
  const projects = getProjects();
  const categories = getCategories();
  const latestUpdate = projects.reduce((latest, project) => (project.updated > latest ? project.updated : latest), '');

  const pageUrl = absoluteUrl(`/${locale}`);
  const siteUrl = siteConfig.url;

  /**
   * 用 @graph 把三个节点串起来：站点、组织、当前页面。
   * 分开声明的话 Google 无法把页面归属到站点，站点名称也拿不到信号。
   */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}#website`,
        url: siteUrl,
        name: dict.site.name,
        description: dict.site.description,
        inLanguage: localeMeta[locale as Locale].htmlLang,
        publisher: { '@id': `${siteUrl}#organization` },
      },
      organizationNode(),
      {
        '@type': 'CollectionPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: `${dict.site.name} | ${dict.site.tagline}`,
        description: dict.site.description,
        inLanguage: localeMeta[locale as Locale].htmlLang,
        isPartOf: { '@id': `${siteUrl}#website` },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: projects.length,
          itemListElement: projects.map((project, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: project.name[locale as Locale],
            item: {
              '@type': 'SoftwareApplication',
              name: project.name[locale as Locale],
              description: project.tagline[locale as Locale],
              url: project.url,
              applicationCategory: 'DeveloperApplication',
              operatingSystem: 'Web',
            },
          })),
        },
      },
    ],
  };

  const stats = [
    { value: String(projects.length), label: dict.home.statsProjects },
    { value: String(categories.length), label: dict.home.statsCategories },
    { value: latestUpdate, label: dict.home.statsUpdated },
  ];

  return (
    // --burst 把整条载入编排顺延：等大爆炸放完，文字才落位
    <div style={{ '--burst': '900ms' } as CSSProperties}>
      <JsonLd data={jsonLd} />

      <section className="container-page relative m-rise pb-12 pt-16 md:pt-24">
        {/* 大爆炸铺在文字之下，播完自行卸载 */}
        <BigBang />

        {/* aria-label 让读屏软件念整句，视觉上仍是逐字落位 */}
        <h1 aria-label={dict.home.heading} className="max-w-[18ch] text-display font-medium">
          <SplitText text={dict.home.heading} />
        </h1>

        <p className="mt-6 max-w-[58ch] text-[16px] text-muted">
          <SplitText text={dict.home.lede} mode="phrase" />
        </p>

        <dl className="m-fade mt-10 flex flex-wrap gap-x-12 gap-y-6" style={{ '--d': '780ms' } as CSSProperties}>
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt className="font-mono text-[11px] uppercase tracking-[0.04em] text-faint">{stat.label}</dt>
              <dd className="mt-1 font-mono text-[20px] tracking-[-0.02em]">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="domain-strip" className="container-page pb-14">
        <h2 id="domain-strip" className="eyebrow">
          {dict.home.domainStripLabel}
        </h2>
        <div className="relative mt-3">
          <span aria-hidden="true" className="m-rule absolute inset-x-0 top-0 h-px bg-line" />
          <span aria-hidden="true" className="m-rule absolute inset-x-0 bottom-0 h-px bg-line" />

          <DomainMarquee projects={projects} />
        </div>
      </section>

      <div className="container-page">
        <ProjectDirectory locale={locale as Locale} dict={dict} projects={projects} categories={categories} />
      </div>
    </div>
  );
}
