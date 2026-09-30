'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { Dictionary } from '@/lib/content/ui';

/** 触发管理入口的键盘序列，不出现在任何界面文案里 */
const SEQUENCE = 'anahgo';
const SESSION_KEY = 'anahgo-lab:admin-session';

/**
 * 前端阶段只做入口隐藏与占位校验。
 * 真正的鉴权放在 Coolify 上的后端：通行码校验、会话签发、权限判断都在服务端完成。
 */
export function verifyPassphrase(value: string) {
  return value === (process.env.NEXT_PUBLIC_ADMIN_PASSPHRASE ?? 'anahgo-lab');
}

export function AdminGate({ dict }: { dict: Dictionary }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  /** 失败次数，用作抖动动画的重放键 */
  const [attempts, setAttempts] = useState(0);
  const bufferRef = useRef('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const target = event.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;

      if (event.key === 'Escape' && open) {
        setOpen(false);
        return;
      }
      if (event.key.length !== 1) return;

      bufferRef.current = (bufferRef.current + event.key.toLowerCase()).slice(-SEQUENCE.length);
      if (bufferRef.current === SEQUENCE) {
        bufferRef.current = '';
        setOpen(true);
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  useEffect(() => {
    if (open) {
      setValue('');
      setError(false);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  function submit() {
    if (verifyPassphrase(value.trim())) {
      window.sessionStorage.setItem(SESSION_KEY, '1');
      setOpen(false);
      router.push('/console');
      return;
    }
    setError(true);
    setAttempts((count) => count + 1);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <button
        type="button"
        aria-label={dict.console.cancel}
        className="m-overlay absolute inset-0 bg-black/40 backdrop-blur-[2px] dark:bg-black/70"
        onClick={() => setOpen(false)}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={dict.console.lockedTitle}
        className="m-panel relative w-full max-w-[360px] rounded-[10px] border border-line bg-bg p-6"
      >
        <h2 className="text-[15px] font-medium tracking-[-0.01em]">{dict.console.lockedTitle}</h2>
        <p className="mt-1 text-[13px] text-muted">{dict.console.lockedBody}</p>

        <form
          className="mt-5"
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
        >
          <label className="eyebrow block" htmlFor="admin-passphrase">
            {dict.console.passphraseLabel}
          </label>
          <input
            id="admin-passphrase"
            ref={inputRef}
            type="password"
            value={value}
            autoComplete="off"
            onChange={(event) => {
              setValue(event.target.value);
              setError(false);
            }}
            className="mt-2 h-9 w-full rounded-[6px] border border-line bg-surface px-3 text-[14px] text-fg outline-none focus:border-line-strong"
          />

          {error && (
            <p key={attempts} className="m-nudge mt-2 text-[13px] text-fg">
              {dict.console.wrongPassphrase}
            </p>
          )}

          <div className="mt-5 flex items-center justify-end gap-2">
            <button type="button" className="btn-ghost" onClick={() => setOpen(false)}>
              {dict.console.cancel}
            </button>
            <button type="submit" className="btn-solid">
              {dict.console.unlock}
            </button>
          </div>
        </form>

        <p className="mt-4 text-[12px] text-faint">{dict.console.hint}</p>
      </div>
    </div>
  );
}

export { SESSION_KEY };
