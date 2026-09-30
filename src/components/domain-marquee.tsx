import type { CSSProperties } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '@/lib/content/projects';

/**
 * 域名条带的副本数。
 *
 * 无缝循环的做法是把同一组条目连写 N 份，再让轨道位移 1/N 后归零。
 * 三份是为了兜住窄容器：项目少的时候，两份拼起来可能还没容器宽，
 * 循环到接缝处会露出空白。
 */
const COPIES = 3;

/**
 * 一条横向流动的域名索引。
 *
 * 位移交给 CSS 动画，暂停也交给 CSS（:hover / :focus-within），
 * 所以这里不需要客户端组件：不 hydrate，不占主线程。
 */
export function DomainMarquee({ projects }: { projects: Project[] }) {
  return (
    <div className="marquee" style={{ '--n': projects.length } as CSSProperties}>
      <div className="marquee-track" style={{ '--copies': COPIES } as CSSProperties}>
        {Array.from({ length: COPIES }, (_, copy) =>
          projects.map((project, index) => {
            // 副本只负责填满接缝，读屏与 Tab 序列都跳过，但保留可点击
            const duplicate = copy > 0;

            return (
              <a
                key={`${copy}-${project.slug}`}
                href={project.url}
                target="_blank"
                rel="noopener"
                style={{ '--i': index } as CSSProperties}
                className="m-spoke link-line group flex shrink-0 items-center gap-2 font-mono text-[12px] text-muted transition-colors hover:text-fg"
                aria-hidden={duplicate || undefined}
                tabIndex={duplicate ? -1 : undefined}
                data-duplicate={duplicate || undefined}
              >
                <span
                  className="m-dot size-[5px] bg-line-strong transition-colors group-hover:bg-fg"
                  style={{ '--i': index } as CSSProperties}
                  aria-hidden="true"
                />
                {project.domain}
                <ArrowUpRight
                  className="size-[12px] -translate-x-1 opacity-0 transition-[opacity,transform] duration-150 group-hover:translate-x-0 group-hover:opacity-100"
                  aria-hidden="true"
                />
              </a>
            );
          }),
        )}
      </div>
    </div>
  );
}
