export const locales = ['zh', 'en', 'ja'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'zh';

export const localeMeta: Record<Locale, { label: string; english: string; htmlLang: string; ogLocale: string }> = {
  zh: { label: '简体中文', english: 'Chinese (Simplified)', htmlLang: 'zh-CN', ogLocale: 'zh_CN' },
  en: { label: 'English', english: 'English', htmlLang: 'en', ogLocale: 'en_US' },
  ja: { label: '日本語', english: 'Japanese', htmlLang: 'ja', ogLocale: 'ja_JP' },
};

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

/** 从 Accept-Language 头部挑一个受支持的语言，未命中则返回默认语言 */
export function matchLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;

  const ranked = acceptLanguage
    .split(',')
    .map((part) => {
      const [tag, q] = part.trim().split(';q=');
      return { tag: tag.toLowerCase(), quality: q ? Number.parseFloat(q) : 1 };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const { tag } of ranked) {
    const base = tag.split('-')[0];
    if (isLocale(base)) return base;
    if (base === 'zh') return 'zh';
  }
  return defaultLocale;
}

export function localizedPath(locale: Locale, path = '/') {
  const clean = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`;
  return `/${locale}${clean}`;
}
