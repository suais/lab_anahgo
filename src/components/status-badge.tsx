import type { ProjectStatus } from '@/lib/content/projects';
import type { Dictionary } from '@/lib/content/ui';

/**
 * 状态用形状区分，不依赖颜色：
 * 在线=实心点，测试中=空心圈，维护中=虚线圈。
 */
export function StatusBadge({ status, labels }: { status: ProjectStatus; labels: Dictionary['status'] }) {
  const text = labels[status];

  return (
    <span className="inline-flex items-center gap-[6px] text-[12px] text-muted">
      {status === 'live' && <span className="size-[6px] rounded-full bg-fg" aria-hidden="true" />}
      {status === 'beta' && <span className="size-[7px] rounded-full border border-fg" aria-hidden="true" />}
      {status === 'maintenance' && (
        <span className="size-[7px] rounded-full border border-dashed border-faint" aria-hidden="true" />
      )}
      <span>{text}</span>
    </span>
  );
}
