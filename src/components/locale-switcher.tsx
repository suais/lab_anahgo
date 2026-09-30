'use client';

import { Globe } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { Dropdown, DropdownItem } from '@/components/dropdown';
import { localeMeta, locales, type Locale } from '@/lib/i18n';

export function LocaleSwitcher({ current, label }: { current: Locale; label: string }) {
  const router = useRouter();
  const pathname = usePathname();

  function switchTo(locale: Locale) {
    const segments = pathname.split('/');
    // 路径首段是语言，替换它即可保留当前页面
    segments[1] = locale;
    const nextPath = segments.join('/') || `/${locale}`;

    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; samesite=lax`;
    router.push(nextPath);
  }

  return (
    <Dropdown
      label={label}
      trigger={
        <>
          <Globe className="size-[15px]" aria-hidden="true" />
          <span className="ml-1 font-mono text-[11px] uppercase">{current}</span>
        </>
      }
    >
      {(close) => (
        <>
          {locales.map((locale) => (
            <DropdownItem
              key={locale}
              active={locale === current}
              onClick={() => {
                switchTo(locale);
                close();
              }}
            >
              <span className="inline-flex items-center gap-2">
                <span className="font-mono text-[11px] uppercase text-faint">{locale}</span>
                {localeMeta[locale].label}
              </span>
            </DropdownItem>
          ))}
        </>
      )}
    </Dropdown>
  );
}
