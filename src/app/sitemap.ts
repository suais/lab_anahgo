import type { MetadataRoute } from 'next';
import { getProjects } from '@/lib/content/projects';
import { locales } from '@/lib/i18n';
import { absoluteUrl, siteConfig } from '@/lib/site';

interface Entry {
  path: string;
  lastModified: Date;
  changeFrequency: 'weekly' | 'monthly' | 'yearly';
  priority: number;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const projects = getProjects();
  // 首页的 lastmod 取全站最新一次项目更新，而不是构建时间：
  // 每次部署都刷新全站 lastmod 会让搜索引擎误判内容变动频率
  const siteLastModified = projects.reduce(
    (latest, project) => (project.updated > latest ? project.updated : latest),
    projects[0]?.updated ?? siteConfig.launchedAt,
  );

  const entries: Entry[] = [
    { path: '/', lastModified: new Date(siteLastModified), changeFrequency: 'weekly', priority: 1 },
    { path: '/about', lastModified: new Date(siteConfig.launchedAt), changeFrequency: 'yearly', priority: 0.5 },
    ...projects.map((project) => ({
      path: `/projects/${project.slug}`,
      lastModified: new Date(project.updated),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];

  return locales.flatMap((locale) =>
    entries.map((entry) => ({
      url: absoluteUrl(`/${locale}${entry.path === '/' ? '' : entry.path}`),
      lastModified: entry.lastModified,
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
      alternates: {
        languages: Object.fromEntries([
          ...locales.map((item) => [item, absoluteUrl(`/${item}${entry.path === '/' ? '' : entry.path}`)]),
          // x-default 指向语言协商入口，与页面里的 hreflang 保持一致
          ['x-default', absoluteUrl(entry.path)],
        ]),
      },
    })),
  );
}
