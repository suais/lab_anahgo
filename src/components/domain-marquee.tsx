import type { CSSProperties } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '@/lib/content/projects';

/**
 * 域名条带的份数。
 *
 * 无缝循环的做法是把同一组条目连写 N 份成 N 个等宽小组，再让轨道位移 1/N 后归零。
 * 每组的宽度下限是容器宽（见 globals.css 的 .marquee-group），所以两份一定铺得满
 * 可视区域，接缝处露不出空白；三份留一份在视野外，滚动时两头都有内容接着。
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
        {Array.from({ length: COPIES }, (_, copy) => {
          // 第 2 份起只负责填满接缝，读屏与 Tab 序列都跳过，但保留可点击
          const duplicate = copy > 0;

          return (
            <div
              key={copy}
              className="marquee-group shrink-0"
              data-duplicate={duplicate || undefined}
            >
              {projects.map((project, index) => (
                <a
                  key={project.slug}
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
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
