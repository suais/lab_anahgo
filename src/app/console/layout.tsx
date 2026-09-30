import type { Metadata } from 'next';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import { ThemeProvider } from '@/components/theme-provider';
import '../globals.css';

/** 管理界面不参与索引，也不出现在站点地图里 */
export const metadata: Metadata = {
  title: 'Console',
  robots: { index: false, follow: false, nocache: true },
};

export default function ConsoleLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-screen">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
