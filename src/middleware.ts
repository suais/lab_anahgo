import { NextResponse, type NextRequest } from 'next/server';
import { defaultLocale, isLocale, locales, matchLocale } from '@/lib/i18n';

const LOCALE_COOKIE = 'NEXT_LOCALE';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 管理入口不带语言前缀，也不参与语言协商
  if (pathname === '/console' || pathname.startsWith('/console/')) {
    return NextResponse.next();
  }

  const hasLocale = locales.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`));
  if (hasLocale) return NextResponse.next();

  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(cookieLocale) ? cookieLocale : matchLocale(request.headers.get('accept-language'));

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;

  const response = NextResponse.redirect(url);
  // 重定向目标取决于 Accept-Language 与 cookie，必须声明 Vary，
  // 否则 CDN 会把第一个访客的语言版本缓存给所有人
  response.headers.set('Vary', 'Accept-Language, Cookie');
  if (cookieLocale !== locale) {
    response.cookies.set(LOCALE_COOKIE, locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    });
  }
  return response;
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)'],
};
