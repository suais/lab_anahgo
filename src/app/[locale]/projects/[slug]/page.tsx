import type { Metadata } from 'next';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/json-ld';
import { Monogram } from '@/components/monogram';
import { StatusBadge } from '@/components/status-badge';
import { getProject, getProjects, getRelatedProjects } from '@/lib/content/projects';
import { getDictionary } from '@/lib/content/ui';
import { isLocale, localeMeta, locales, type Locale } from '@/lib/i18n';
import { buildMetadata, organizationNode } from '@/lib/seo';
import { absoluteUrl, siteConfig } from '@/lib/site';

export function generateStaticParams() {
  return locales.flatMap((locale) => getProjects().map((project) => ({ locale, slug: project.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};

  const project = getProject(slug);
  if (!project) return {};

  const dict = getDictionary(locale);

  return buildMetadata({
    locale,
    // 标题只放项目名，品牌由 layout 的 template 补上；tagline 太长会挤掉品牌
    title: project.name[locale],
    description: project.description[locale],
    path: `/projects/${slug}`,
    keywords: project.tags,
  });
}

export default async function ProjectPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const project = getProject(slug);
  if (!project) notFound();

  const dict = getDictionary(locale as Locale);
  const related = getRelatedProjects(slug);

  const pageUrl = absoluteUrl(`/${locale}/projects/${slug}`);
  const siteUrl = siteConfig.url;

  /**
   * 页面自身的实体与指向目标站的应用实体分开声明：
   * 搜索结果拿到的是本页（WebPage），而 SoftwareApplication 描述的是外站那个工具。
   */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      organizationNode(),
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: project.name[locale as Locale],
        description: project.description[locale as Locale],
        inLanguage: localeMeta[locale as Locale].htmlLang,
        isPartOf: { '@id': `${siteUrl}#website` },
        about: { '@id': `${pageUrl}#app` },
        breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: dict.breadcrumb.home,
            item: absoluteUrl(`/${locale}`),
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: project.name[locale as Locale],
          },
        ],
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${pageUrl}#app`,
        name: project.name[locale as Locale],
        description: project.description[locale as Locale],
        url: project.url,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Web',
        inLanguage: localeMeta[locale as Locale].htmlLang,
        datePublished: project.released,
        dateModified: project.updated,
        keywords: project.tags.join(', '),
        isAccessibleForFree: true,
        publisher: { '@id': `${siteUrl}#organization` },
      },
    ],
  };

  const facts = [
    { label: dict.project.domain, value: project.domain },
    { label: dict.project.category, value: dict.category[project.category] },
    { label: dict.project.released, value: project.released },
    { label: dict.project.updated, value: project.updated },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />

      <article className="container-page pb-8 pt-10">
        <Link
          href={`/${locale}/#index`}
          className="link-line inline-flex items-center gap-2 text-[13px] text-muted transition-colors hover:text-fg"
        >
          <ArrowLeft className="size-[14px]" aria-hidden="true" />
          {dict.project.backToIndex}
        </Link>

        <div className="mt-8 flex items-start gap-4">
          <Monogram brand={project.brand} size={44} />
          <div className="min-w-0">
            <h1 className="text-[28px] font-medium leading-tight tracking-[-0.03em] sm:text-[34px]">
              {project.name[locale as Locale]}
            </h1>
            <p className="mt-2 text-[16px] text-muted">{project.tagline[locale as Locale]}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a href={project.url} target="_blank" rel="noopener" className="btn-solid">
            {dict.project.visit}
            <ArrowUpRight className="size-[14px]" aria-hidden="true" />
          </a>
          <span className="font-mono text-[12px] text-faint">{project.domain}</span>
          <StatusBadge status={project.status} labels={dict.status} />
        </div>

        {/* 站点预览：接入对象存储后替换为真实截图 */}
        <div className="mt-8 overflow-hidden rounded-[10px] border border-line">
          <div className="flex items-center gap-2 border-b border-line px-4 py-[10px]">
            <span className="size-[6px] rounded-full border border-line-strong" aria-hidden="true" />
            <span className="font-mono text-[11px] text-faint">{project.url}</span>
          </div>
          <div className="flex h-[200px] flex-col items-center justify-center gap-4 bg-surface sm:h-[280px]">
            <Monogram brand={project.brand} size={56} />
            <span className="font-mono text-[13px] text-faint">{project.domain}</span>
          </div>
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <h2 className="text-[18px] font-medium tracking-[-0.02em]">{dict.project.overview}</h2>
            <p className="mt-4 max-w-[62ch] text-[15px] leading-[1.75] text-muted">
              {project.description[locale as Locale]}
            </p>

            <h2 className="mt-12 text-[18px] font-medium tracking-[-0.02em]">{dict.project.highlights}</h2>
            <ul className="mt-4 max-w-[62ch]">
              {project.highlights[locale as Locale].map((item) => (
                <li key={item} className="flex gap-3 border-t border-line py-3 text-[15px] last:border-b">
                  <span className="mt-[9px] size-[5px] shrink-0 bg-fg" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <aside>
            <h2 className="text-[18px] font-medium tracking-[-0.02em]">{dict.project.details}</h2>
            <dl className="mt-4 border-t border-line">
              {facts.map((fact) => (
                <div key={fact.label} className="flex items-baseline justify-between gap-4 border-b border-line py-3">
                  <dt className="text-[13px] text-faint">{fact.label}</dt>
                  <dd className="font-mono text-[13px]">{fact.value}</dd>
                </div>
              ))}
              <div className="flex items-baseline justify-between gap-4 border-b border-line py-3">
                <dt className="text-[13px] text-faint">{dict.project.status}</dt>
                <dd>
                  <StatusBadge status={project.status} labels={dict.status} />
                </dd>
              </div>
            </dl>

            <h3 className="mt-8 text-[13px] text-faint">{dict.project.tagsLabel}</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-line px-[10px] py-[2px] font-mono text-[11px] text-muted"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="mt-20 border-t border-line pt-8">
            <h2 className="text-[18px] font-medium tracking-[-0.02em]">{dict.project.related}</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-3">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/${locale}/projects/${item.slug}`}
                    className="card flex items-center gap-3 p-4"
                  >
                    <Monogram brand={item.brand} size={28} />
                    <span className="min-w-0">
                      <span className="block truncate text-[14px] font-medium">{item.name[locale as Locale]}</span>
                      <span className="block truncate font-mono text-[11px] text-faint">{item.domain}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </>
  );
}
