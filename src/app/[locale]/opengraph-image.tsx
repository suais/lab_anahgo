import { ImageResponse } from 'next/og';
import { getProjects } from '@/lib/content/projects';
import { locales } from '@/lib/i18n';

export const alt = 'anahgo lab';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/**
 * 社交分享图只用拉丁字符：satori 默认字体不含中日文字形，
 * 混入中文会渲染成空白。
 */
export default function OpengraphImage() {
  const count = getProjects().length;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#000',
          color: '#fff',
          padding: '72px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              border: '3px solid #fff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <div style={{ width: 20, height: 3, background: '#fff' }} />
            <div style={{ width: 13, height: 3, background: '#fff' }} />
          </div>
          <div style={{ fontSize: 34, letterSpacing: '-0.02em' }}>anahgo lab</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 76, letterSpacing: '-0.04em', lineHeight: 1.05 }}>
            {`Index of ${count} sites`}
          </div>
          <div style={{ fontSize: 30, color: '#a1a1a1', marginTop: 18 }}>
            Tools, references and guides on their own domains.
          </div>
        </div>

        <div style={{ display: 'flex', fontSize: 26, color: '#8c8c8c' }}>lab.anahgo.com</div>
      </div>
    ),
    size,
  );
}
