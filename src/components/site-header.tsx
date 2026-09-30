'use client';

import Link from 'next/link';
import { LocaleSwitcher } from '@/components/locale-switcher';
import { Logo, Wordmark } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import type { Dictionary } from '@/lib/content/ui';
import type { Locale } from '@/lib/i18n';

export function SiteHeader({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-md">
      <div className="container-page flex h-14 items-center justify-between gap-4">
        <Link href={`/${locale}`} className="group flex items-center gap-2 text-fg" aria-label={dict.site.name}>
          {/* 标识在悬停时抬起半格，是页面上唯一一处纯粹的装饰性反馈 */}
          <span className="m-lift">
            <Logo />
          </span>
          <Wordmark />
        </Link>

        <div className="flex items-center gap-1">
          <LocaleSwitcher current={locale} label={dict.nav.language} />
          <ThemeToggle
            labels={{
              theme: dict.nav.theme,
              light: dict.nav.themeLight,
              dark: dict.nav.themeDark,
              system: dict.nav.themeSystem,
            }}
          />
        </div>
      </div>
    </header>
  );
}
