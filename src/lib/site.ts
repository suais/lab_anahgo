export const siteConfig = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lab.anahgo.com',
  name: 'Anahgo Lab',
  shortName: 'anahgo lab',
  /** 站点标识：一个索引卡式的几何标记，与文字组合使用 */
  owner: 'Anahgo Lab',
  /** robots 与站点地图都不收录管理路径 */
  hiddenPaths: ['/console', '/api'],
  social: {
    github: process.env.NEXT_PUBLIC_GITHUB_URL ?? '',
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? '',
  },
  /**
   * 搜索引擎站点验证。留空则不输出对应 meta，避免渲染空标签。
   * Google 已改用 Search Console 验证，此处主要服务 Bing / Yandex / 百度。
   */
  verification: {
    google: process.env.NEXT_PUBLIC_VERIFY_GOOGLE ?? '',
    bing: process.env.NEXT_PUBLIC_VERIFY_BING ?? '',
    yandex: process.env.NEXT_PUBLIC_VERIFY_YANDEX ?? '',
    /** 百度走 other 通道，Next 的 verification 类型没有内置键 */
    baidu: process.env.NEXT_PUBLIC_VERIFY_BAIDU ?? '',
  },
  /** 关于页等无业务数据的页面用的最后更新基准 */
  launchedAt: '2026-09-30',
} as const;

export function absoluteUrl(path = '/') {
  return `${siteConfig.url}${path === '/' ? '' : path}`;
}
