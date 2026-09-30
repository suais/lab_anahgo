import type { Metadata } from 'next';
import { locales, localeMeta, type Locale } from '@/lib/i18n';
import { absoluteUrl, siteConfig } from '@/lib/site';

interface SeoInput {
  locale: Locale;
  /** 只传页面自身的标题，品牌后缀由 layout 的 title.template 统一附加 */
  title?: string;
  description: string;
  /** 不含语言前缀的路径，例如 /projects/jtwarp */
  path?: string;
  noIndex?: boolean;
  keywords?: string[];
}

/** 路径 -> 带语言前缀的绝对地址；首页不产生重复的 `/zh/` 尾斜杠 */
function localizedUrl(locale: Locale, path: string) {
  return absoluteUrl(`/${locale}${path === '/' ? '' : path}`);
}

/** 只输出已配置的验证标签，未配置时整项省略，避免渲染空 content */
function verificationMeta(): Metadata['verification'] {
  const { google, bing, yandex, baidu } = siteConfig.verification;
  const known: Record<string, string> = {};
  if (google) known.google = google;
  if (bing) known.bing = bing;
  if (yandex) known.yandex = yandex;

  const other: Record<string, string> = {};
  if (baidu) other['baidu-site-verification'] = baidu;

  return {
    ...known,
    ...(Object.keys(other).length > 0 ? { other } : {}),
  };
}

export function buildMetadata({
  locale,
  title,
  description,
  path = '/',
  noIndex = false,
  keywords,
}: SeoInput): Metadata {
  const url = localizedUrl(locale, path);

  // hreflang 必须包含自身在内全部变体，并给出 x-default 供未匹配语言回落
  const languages = Object.fromEntries(
    locales.map((item) => [localeMeta[item].htmlLang, localizedUrl(item, path)]),
  );

  return {
    metadataBase: new URL(siteConfig.url),
    ...(title ? { title } : {}),
    description,
    applicationName: siteConfig.name,
    ...(keywords?.length ? { keywords } : {}),
    alternates: {
      canonical: url,
      languages: { ...languages, 'x-default': absoluteUrl(path) },
    },
    openGraph: {
      type: 'website',
      siteName: siteConfig.name,
      ...(title ? { title } : {}),
      description,
      url,
      locale: localeMeta[locale].ogLocale,
      alternateLocale: locales.filter((item) => item !== locale).map((item) => localeMeta[item].ogLocale),
    },
    twitter: {
      card: 'summary_large_image',
      ...(title ? { title } : {}),
      description,
    },
    robots: noIndex ? { index: false, follow: false, nocache: true } : { index: true, follow: true },
    verification: verificationMeta(),
  };
}

/** 结构化数据里复用的组织节点，避免每个页面重复声明 */
export function organizationNode() {
  return {
    '@type': 'Organization',
    '@id': `${siteConfig.url}#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl('/icon.svg'),
    ...(siteConfig.social.email ? { email: siteConfig.social.email } : {}),
  };
}
