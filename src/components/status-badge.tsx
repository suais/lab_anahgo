import type { ProjectStatus } from '@/lib/content/projects';
import type { Dictionary } from '@/lib/content/ui';

/**
 * 状态指示。
 *
 * 在线用一个跳动的绿点表示，不显示文字 —— 文字仍在 DOM 里（sr-only 供读屏，
 * title 供鼠标悬停），所以状态信息没有丢，只是不再占位。
 * 其余状态靠形状区分：测试中=空心圈，维护中=虚线圈，这两者保留文字。
 */
export function StatusBadge({ status, labels }: { status: ProjectStatus; labels: Dictionary['status'] }) {
  const text = labels[status];
  const live = status === 'live';

  return (
    <span className="inline-flex items-center gap-[6px] text-[12px] text-muted" title={text}>
      {live && <span className="status-live" aria-hidden="true" />}
      {status === 'beta' && <span className="size-[7px] rounded-full border border-fg" aria-hidden="true" />}
      {status === 'maintenance' && (
        <span className="size-[7px] rounded-full border border-dashed border-faint" aria-hidden="true" />
      )}
      <span className={live ? 'sr-only' : undefined}>{text}</span>
    </span>
  );
}
