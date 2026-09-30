'use client';

import { ArrowUpRight, LayoutGrid, List, Rows3, Search, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { Monogram } from '@/components/monogram';
import { StatusBadge } from '@/components/status-badge';
import { format, type Dictionary } from '@/lib/content/ui';
import type { Project, ProjectCategory } from '@/lib/content/projects';
import type { Locale } from '@/lib/i18n';

type Layout = 'grid' | 'list' | 'compact';
type Sort = 'updated' | 'name';

const LAYOUT_KEY = 'anahgo-lab:layout';
const SORT_KEY = 'anahgo-lab:sort';

export function ProjectDirectory({
  locale,
  dict,
  projects,
  categories,
}: {
  locale: Locale;
  dict: Dictionary;
  projects: Project[];
  categories: ProjectCategory[];
}) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<ProjectCategory | 'all'>('all');
  const [layout, setLayout] = useState<Layout>('grid');
  const [sort, setSort] = useState<Sort>('updated');
  /** 每次切换布局或分类自增，用于重放结果区的入场动画 */
  const [motionKey, setMotionKey] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);

  // 布局与排序沿用上次的偏好，避免每次访问都要重选
  useEffect(() => {
    const savedLayout = window.localStorage.getItem(LAYOUT_KEY);
    if (savedLayout === 'grid' || savedLayout === 'list' || savedLayout === 'compact') setLayout(savedLayout);

    const savedSort = window.localStorage.getItem(SORT_KEY);
    if (savedSort === 'name' || savedSort === 'updated') setSort(savedSort);
  }, []);

  // 斜杠键聚焦搜索框
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== '/' || event.metaKey || event.ctrlKey) return;
      const target = event.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
      event.preventDefault();
      searchRef.current?.focus();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  function chooseLayout(next: Layout) {
    if (next === layout) return;
    setLayout(next);
    window.localStorage.setItem(LAYOUT_KEY, next);
    setMotionKey((value) => value + 1);
  }

  function chooseCategory(next: ProjectCategory | 'all') {
    setCategory(next);
    setMotionKey((value) => value + 1);
  }

  function chooseSort(next: Sort) {
    setSort(next);
    window.localStorage.setItem(SORT_KEY, next);
  }

  const visible = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    const matched = projects.filter((project) => {
      if (category !== 'all' && project.category !== category) return false;
      if (!keyword) return true;

      const haystack = [
        project.brand,
        project.name[locale],
        project.tagline[locale],
        project.description[locale],
        project.domain,
        ...project.tags,
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(keyword);
    });

    return matched.sort((a, b) => {
      if (sort === 'name') return a.brand.localeCompare(b.brand);
      return b.updated.localeCompare(a.updated);
    });
  }, [projects, category, query, locale, sort]);

  const layoutOptions: { value: Layout; icon: typeof LayoutGrid; label: string }[] = [
    { value: 'grid', icon: LayoutGrid, label: dict.home.layoutGrid },
    { value: 'list', icon: List, label: dict.home.layoutList },
    { value: 'compact', icon: Rows3, label: dict.home.layoutCompact },
  ];

  return (
    <section id="index" className="scroll-mt-20">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
        <h2 className="text-[18px] font-medium tracking-[-0.02em]">{dict.home.allTitle}</h2>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-[14px] -translate-y-1/2 text-faint"
              aria-hidden="true"
            />
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={dict.home.searchPlaceholder}
              aria-label={dict.home.searchLabel}
              className="h-9 w-full min-w-[220px] rounded-[6px] border border-line bg-surface pl-9 pr-3 text-[14px] text-fg outline-none placeholder:text-faint focus:border-line-strong sm:w-[260px]"
            />
          </div>

          <div
            role="group"
            aria-label={dict.home.layoutLabel}
            className="flex items-center gap-[2px] rounded-[6px] border border-line p-[2px]"
          >
            {layoutOptions.map((option) => {
              const Icon = option.icon;
              const active = layout === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => chooseLayout(option.value)}
                  aria-label={option.label}
                  aria-pressed={active}
                  title={option.label}
                  className={`flex h-[30px] w-[32px] items-center justify-center rounded-[4px] transition-colors ${
                    active ? 'bg-invert-bg text-invert-fg' : 'text-muted hover:bg-surface-hover hover:text-fg'
                  }`}
                >
                  <Icon className="size-[14px]" aria-hidden="true" />
                </button>
              );
            })}
          </div>

          <select
            value={sort}
            onChange={(event) => chooseSort(event.target.value as Sort)}
            aria-label={dict.home.sortLabel}
            className="h-9 rounded-[6px] border border-line bg-surface px-2 text-[13px] text-fg outline-none focus:border-line-strong"
          >
            <option value="updated">{dict.home.sortUpdated}</option>
            <option value="name">{dict.home.sortName}</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <FilterChip active={category === 'all'} onClick={() => chooseCategory('all')}>
          {dict.home.filterAll}
        </FilterChip>
        {categories.map((item) => (
          <FilterChip key={item} active={category === item} onClick={() => chooseCategory(item)}>
            {dict.category[item]}
          </FilterChip>
        ))}
        {(category !== 'all' || query) && (
          <button
            type="button"
            onClick={() => {
              chooseCategory('all');
              setQuery('');
            }}
            className="inline-flex items-center gap-1 px-2 py-[3px] text-[13px] text-faint transition-colors hover:text-fg"
          >
            <X className="size-[12px]" aria-hidden="true" />
            {dict.home.clearFilters}
          </button>
        )}
      </div>

      <p className="mt-5 text-[13px] text-faint" aria-live="polite">
        {format(dict.home.resultCount, { count: visible.length })}
      </p>

      {/* key 变化即重放入场动画，只在用户主动切换布局或分类后发生 */}
      <div key={motionKey}>
        {visible.length === 0 ? (
          <div className="m-item mt-6 rounded-[10px] border border-dashed border-line-strong px-6 py-14 text-center">
            <p className="text-[15px] font-medium">{dict.home.emptyTitle}</p>
            <p className="mt-1 text-[14px] text-muted">{dict.home.emptyBody}</p>
          </div>
        ) : layout === 'grid' ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((project, index) => (
              <ProjectCard
                key={project.slug}
                project={project}
                locale={locale}
                dict={dict}
                index={index}
                animate={motionKey > 0}
              />
            ))}
          </div>
        ) : layout === 'list' ? (
          <ul className="mt-2">
            {visible.map((project, index) => (
              <ProjectRow
                key={project.slug}
                project={project}
                locale={locale}
                dict={dict}
                index={index}
                animate={motionKey > 0}
              />
            ))}
          </ul>
        ) : (
          <div className="mt-6 grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {visible.map((project, index) => (
              <ProjectTile
                key={project.slug}
                project={project}
                locale={locale}
                index={index}
                animate={motionKey > 0}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3 py-[3px] text-[13px] transition-colors ${
        active ? 'border-fg bg-invert-bg text-invert-fg' : 'border-line text-muted hover:border-line-strong hover:text-fg'
      }`}
    >
      {children}
    </button>
  );
}

function ProjectCard({
  project,
  locale,
  dict,
  index = 0,
  animate = false,
}: {
  project: Project;
  locale: Locale;
  dict: Dictionary;
  index?: number;
  animate?: boolean;
}) {
  const detailHref = `/${locale}/projects/${project.slug}`;

  return (
    <article
      className={`card group relative flex flex-col p-5 ${animate ? 'm-item' : ''}`}
      style={animate ? ({ '--i': index } as CSSProperties) : undefined}
    >
      <Link href={detailHref} className="absolute inset-0 rounded-[10px]" aria-label={project.name[locale]} />

      <div className="pointer-events-none relative flex items-start justify-between gap-3">
        <Monogram brand={project.brand} />
        <span className="font-mono text-[11px] text-faint">{dict.category[project.category]}</span>
      </div>

      <div className="pointer-events-none relative mt-4 flex-1">
        <h3 className="text-[16px] font-medium leading-snug tracking-[-0.01em]">{project.name[locale]}</h3>
        <p className="mt-1 text-[14px] text-muted">{project.tagline[locale]}</p>
        <p className="mt-3 font-mono text-[12px] text-faint">{project.domain}</p>
      </div>

      <div className="relative mt-5 flex items-center justify-between border-t border-line pt-3">
        <StatusBadge status={project.status} labels={dict.status} />
        <div className="flex items-center gap-2">
          <a
            href={project.url}
            target="_blank"
            rel="noopener"
            aria-label={`${dict.home.openSite}：${project.domain}`}
            className="icon-btn relative"
          >
            <ArrowUpRight
              className="size-[15px] transition-transform duration-150 group-hover:-translate-y-[2px] group-hover:translate-x-[2px]"
              aria-hidden="true"
            />
          </a>
        </div>
      </div>
    </article>
  );
}

function ProjectRow({
  project,
  locale,
  dict,
  index = 0,
  animate = false,
}: {
  project: Project;
  locale: Locale;
  dict: Dictionary;
  index?: number;
  animate?: boolean;
}) {
  const detailHref = `/${locale}/projects/${project.slug}`;

  return (
    <li
      className={`relative border-b border-line transition-colors last:border-b-0 hover:bg-surface ${
        animate ? 'm-item' : ''
      }`}
      style={animate ? ({ '--i': index } as CSSProperties) : undefined}
    >
      <Link href={detailHref} className="absolute inset-0" aria-label={project.name[locale]} />

      <div className="pointer-events-none relative flex flex-wrap items-center gap-x-4 gap-y-2 py-4">
        <Monogram brand={project.brand} size={32} />

        <div className="min-w-[180px] flex-1">
          <p className="text-[15px] font-medium tracking-[-0.01em]">{project.name[locale]}</p>
          <p className="text-[13px] text-muted">{project.tagline[locale]}</p>
        </div>

        <p className="hidden font-mono text-[12px] text-faint md:block">{project.domain}</p>
        <p className="w-[92px] text-[13px] text-muted">{dict.category[project.category]}</p>
        <div className="w-[80px]">
          <StatusBadge status={project.status} labels={dict.status} />
        </div>
        <span className="text-[13px] text-faint">{project.updated}</span>
      </div>

      <a
        href={project.url}
        target="_blank"
        rel="noopener"
        aria-label={`${dict.home.openSite}：${project.domain}`}
        className="icon-btn absolute right-0 top-1/2 -translate-y-1/2"
      >
        <ArrowUpRight
          className="size-[15px] transition-transform duration-150 group-hover:-translate-y-[2px] group-hover:translate-x-[2px]"
          aria-hidden="true"
        />
      </a>
    </li>
  );
}

function ProjectTile({
  project,
  locale,
  index = 0,
  animate = false,
}: {
  project: Project;
  locale: Locale;
  index?: number;
  animate?: boolean;
}) {
  return (
    <article
      className={`card relative flex items-center gap-3 p-3 ${animate ? 'm-item' : ''}`}
      style={animate ? ({ '--i': index } as CSSProperties) : undefined}
    >
      <Link href={`/${locale}/projects/${project.slug}`} className="absolute inset-0 rounded-[10px]" aria-label={project.name[locale]} />
      <div className="pointer-events-none relative flex min-w-0 items-center gap-3">
        <Monogram brand={project.brand} size={28} />
        <div className="min-w-0">
          <p className="truncate text-[14px] font-medium tracking-[-0.01em]">{project.name[locale]}</p>
          <p className="truncate font-mono text-[11px] text-faint">{project.domain}</p>
        </div>
      </div>
    </article>
  );
}
