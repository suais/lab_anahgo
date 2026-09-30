import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // 项目截图后续由 Coolify 上的对象存储提供，此处先登记来源前缀
    remotePatterns: [
      { protocol: 'https', hostname: '*.anahgo.com' },
      { protocol: 'https', hostname: 'assets.anahgo.com' },
    ],
  },
  async headers() {
    return [
      {
        source: '/console/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
          { key: 'Referrer-Policy', value: 'no-referrer' },
        ],
      },
    ];
  },
};

export default nextConfig;
