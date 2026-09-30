/**
 * 站点标识：一张被折角的索引卡。
 * 纯几何，随主题反相，不加彩色。
 */
export function Logo({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
      shapeRendering="geometricPrecision"
    >
      <rect x="0.75" y="0.75" width="18.5" height="18.5" rx="4.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6.4 14.2 10 5.8l3.6 8.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
      <path d="M8.1 11.6h3.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  );
}

export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-baseline gap-[3px] text-[15px] leading-none tracking-[-0.02em]">
      <span className="font-medium">anahgo</span>
      {!compact && <span className="text-faint transition-colors duration-200 group-hover:text-muted">lab</span>}
    </span>
  );
}
