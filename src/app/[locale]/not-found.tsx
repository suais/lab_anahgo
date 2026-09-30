'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getDictionary } from '@/lib/content/ui';
import { defaultLocale, isLocale } from '@/lib/i18n';

/**
 * Next 的 not-found 边界拿不到 params，所以从路径首段读语言。
 * SSR 阶段 usePathname 已有值，无 JS 也能拿到正确语言。
 */
export default function LocaleNotFound() {
  const pathname = usePathname();
  const segment = pathname?.split('/')[1];
  const locale = isLocale(segment) ? segment : defaultLocale;
  const dict = getDictionary(locale);

  return (
    <div className="container-page flex min-h-[52vh] flex-col justify-center py-20">
      <p className="font-mono text-[12px] text-faint">404</p>
      <h1 className="mt-4 text-[28px] font-medium tracking-[-0.03em]">{dict.notFound.title}</h1>
      <p className="mt-3 max-w-[46ch] text-[15px] text-muted">{dict.notFound.body}</p>
      <Link href={`/${locale}`} className="btn-solid mt-8 self-start">
        {dict.notFound.backHome}
      </Link>
    </div>
  );
}
