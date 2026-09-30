'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Dropdown, DropdownItem } from '@/components/dropdown';

export function ThemeToggle({ labels }: { labels: { theme: string; light: string; dark: string; system: string } }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const current = mounted ? theme : undefined;

  return (
    <Dropdown
      label={labels.theme}
      trigger={
        /* key 随主题变化，图标切换时重放一次旋转淡入 */
        <span key={current ?? 'init'} className="m-icon inline-flex">
          <Sun className="size-[15px] dark:hidden" aria-hidden="true" />
          <Moon className="hidden size-[15px] dark:block" aria-hidden="true" />
        </span>
      }
    >
      {(close) => (
        <>
          <DropdownItem
            active={mounted && current === 'light'}
            onClick={() => {
              setTheme('light');
              close();
            }}
          >
            <span className="inline-flex items-center gap-2">
              <Sun className="size-[13px]" aria-hidden="true" />
              {labels.light}
            </span>
          </DropdownItem>
          <DropdownItem
            active={mounted && current === 'dark'}
            onClick={() => {
              setTheme('dark');
              close();
            }}
          >
            <span className="inline-flex items-center gap-2">
              <Moon className="size-[13px]" aria-hidden="true" />
              {labels.dark}
            </span>
          </DropdownItem>
          <DropdownItem
            active={mounted && current === 'system'}
            onClick={() => {
              setTheme('system');
              close();
            }}
          >
            <span className="inline-flex items-center gap-2">
              <Monitor className="size-[13px]" aria-hidden="true" />
              {labels.system}
            </span>
          </DropdownItem>
        </>
      )}
    </Dropdown>
  );
}
