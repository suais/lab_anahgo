'use client';

import { useEffect, useId, useRef, useState } from 'react';

interface DropdownProps {
  /** 触发按钮的无障碍名称 */
  label: string;
  trigger: React.ReactNode;
  children: (close: () => void) => React.ReactNode;
  align?: 'left' | 'right';
}

export function Dropdown({ label, trigger, children, align = 'right' }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className="icon-btn"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen((value) => !value)}
      >
        {trigger}
      </button>

      {open && (
        <div
          id={panelId}
          role="menu"
          className={`m-menu absolute top-[calc(100%+6px)] z-50 min-w-[148px] overflow-hidden rounded-[8px] border border-line bg-bg py-1 shadow-[0_8px_24px_rgba(0,0,0,0.10)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.55)] ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

export function DropdownItem({
  active = false,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-3 px-3 py-[6px] text-left text-[13px] transition-colors hover:bg-surface-hover ${
        active ? 'text-fg' : 'text-muted'
      }`}
    >
      <span>{children}</span>
      {active && <span aria-hidden="true" className="text-[10px] leading-none">●</span>}
    </button>
  );
}
