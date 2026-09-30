import { ImageResponse } from 'next/og';
import { getProject, getProjects } from '@/lib/content/projects';
import { locales } from '@/lib/i18n';

export const alt = 'anahgo lab';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return locales.flatMap((locale) => getProjects().map((project) => ({ locale, slug: project.slug })));
}

const categoryLabel: Record<string, string> = {
  tool: 'Tool',
  reference: 'Reference',
  guide: 'Guide',
  directory: 'Directory',
};

/**
 * 与首页共用同一套版式：黑底白字、左上角标识。
 * 只用拉丁字符——satori 默认字体不含中日字形，混入会渲染成空白。
 */
export default async function OpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#000',
            color: '#fff',
            fontSize: 64,
          }}
        >
          anahgo lab
        </div>
      ),
      size,
    );
  }

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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
          <div style={{ fontSize: 24, color: '#8c8c8c' }}>
            {categoryLabel[project.category] ?? 'Site'}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 88, letterSpacing: '-0.04em', lineHeight: 1.05 }}>{project.brand}</div>
          <div style={{ display: 'flex', fontSize: 30, color: '#a1a1a1', marginTop: 20 }}>
            {project.domain}
          </div>
        </div>

        <div style={{ display: 'flex', fontSize: 26, color: '#8c8c8c' }}>lab.anahgo.com</div>
      </div>
    ),
    size,
  );
}
