import Link from 'next/link';
import { Logo, Wordmark } from '@/components/logo';
import { getProjects } from '@/lib/content/projects';
import type { Dictionary } from '@/lib/content/ui';
import type { Locale } from '@/lib/i18n';

export function SiteFooter({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const projects = getProjects();

  return (
    <footer className="mt-24 border-t border-line">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-[42ch]">
          <div className="flex items-center gap-2">
            <Logo size={18} />
            <Wordmark />
          </div>
          {/* 站点标语：页脚首列在版式上已留出 42ch 的文本量度，这里落位 */}
          <p className="mt-4 text-[14px] leading-relaxed text-muted">{dict.site.tagline}</p>
        </div>

        <div>
          <h2 className="eyebrow">{dict.footer.projects}</h2>
          <ul className="mt-4 space-y-[6px]">
            {projects.map((project) => (
              <li key={project.slug}>
                <Link
                  href={`/${locale}/projects/${project.slug}`}
                  className="link-line text-[14px] text-muted transition-colors hover:text-fg"
                >
                  {project.name[locale]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="eyebrow">{dict.footer.sections}</h2>
          <ul className="mt-4 space-y-[6px]">
            <li>
              <Link href={`/${locale}`} className="text-[14px] text-muted transition-colors hover:text-fg">
                {dict.nav.index}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/about`} className="text-[14px] text-muted transition-colors hover:text-fg">
                {dict.nav.about}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="container-page flex flex-wrap items-center justify-between gap-2 border-t border-line py-6 text-[13px] text-faint">
        <span>
          © {new Date().getFullYear()} Anahgo Lab. {dict.footer.rights}
        </span>
        <span className="font-mono text-[12px]">lab.anahgo.com</span>
      </div>
    </footer>
  );
}
