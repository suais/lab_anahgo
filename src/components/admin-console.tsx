'use client';

import { useEffect, useState } from 'react';
import { SESSION_KEY, verifyPassphrase } from '@/components/admin-gate';
import { getDictionary } from '@/lib/content/ui';
import { defaultLocale, isLocale, type Locale } from '@/lib/i18n';
import { getAllProjects } from '@/lib/content/projects';

/**
 * 管理面板占位。
 * 通行码校验目前发生在前端，只用于占位演示；接入后端后改为服务端签发会话。
 */
export function AdminConsole() {
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const matched = document.cookie.match(/NEXT_LOCALE=(zh|en|ja)/);
    if (matched && isLocale(matched[1])) setLocale(matched[1]);
    setUnlocked(window.sessionStorage.getItem(SESSION_KEY) === '1');
    setReady(true);
  }, []);

  const dict = getDictionary(locale);

  function submit() {
    if (verifyPassphrase(value.trim())) {
      window.sessionStorage.setItem(SESSION_KEY, '1');
      setUnlocked(true);
      return;
    }
    setError(true);
  }

  return (
    <div className="container-page py-16">
      <p className="eyebrow">{dict.console.secretHint}</p>
      <h1 className="mt-4 text-[26px] font-medium tracking-[-0.03em]">
        {unlocked ? dict.console.panelTitle : dict.console.lockedTitle}
      </h1>

      {!ready ? null : unlocked ? (
        <>
          <p className="mt-3 max-w-[60ch] text-[15px] text-muted">{dict.console.panelBody}</p>

          <div className="mt-10 overflow-hidden rounded-[10px] border border-line">
            <table className="w-full text-left text-[13px]">
              <thead className="border-b border-line text-faint">
                <tr>
                  <th className="px-4 py-2 font-normal">slug</th>
                  <th className="px-4 py-2 font-normal">{dict.project.domain}</th>
                  <th className="px-4 py-2 font-normal">{dict.project.category}</th>
                  <th className="px-4 py-2 font-normal">{dict.project.status}</th>
                  <th className="px-4 py-2 font-normal">{dict.project.updated}</th>
                </tr>
              </thead>
              <tbody>
                {getAllProjects().map((project) => (
                  <tr key={project.slug} className="border-b border-line last:border-b-0">
                    <td className="px-4 py-2 font-mono">
                      {project.slug}
                      {project.hidden ? (
                        <span className="ml-2 text-[11px] text-faint">{dict.console.hidden}</span>
                      ) : null}
                    </td>
                    <td className="px-4 py-2 font-mono text-muted">{project.domain}</td>
                    <td className="px-4 py-2">{dict.category[project.category]}</td>
                    <td className="px-4 py-2">{dict.status[project.status]}</td>
                    <td className="px-4 py-2 font-mono text-muted">{project.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-[13px] text-faint">{dict.console.hint}</p>
        </>
      ) : (
        <form
          className="mt-8 max-w-[320px]"
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
        >
          <p className="text-[14px] text-muted">{dict.console.lockedBody}</p>
          <label className="eyebrow mt-5 block" htmlFor="console-passphrase">
            {dict.console.passphraseLabel}
          </label>
          <input
            id="console-passphrase"
            type="password"
            autoComplete="off"
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              setError(false);
            }}
            className="mt-2 h-9 w-full rounded-[6px] border border-line bg-surface px-3 text-[14px] outline-none focus:border-line-strong"
          />
          {error && <p className="mt-2 text-[13px]">{dict.console.wrongPassphrase}</p>}
          <button type="submit" className="btn-solid mt-5">
            {dict.console.unlock}
          </button>
          <p className="mt-5 text-[12px] text-faint">{dict.console.hint}</p>
        </form>
      )}
    </div>
  );
}
