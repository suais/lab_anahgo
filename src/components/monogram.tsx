/** 项目首字母标记：白底黑字，暗色下反相 */
export function Monogram({ brand, size = 36 }: { brand: string; size?: number }) {
  const letter = brand.replace(/[^A-Za-z]/g, '').charAt(0).toUpperCase() || '#';

  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-[8px] bg-invert-bg font-mono text-invert-fg"
      style={{ width: size, height: size, fontSize: size * 0.42, letterSpacing: '-0.02em' }}
      aria-hidden="true"
    >
      {letter}
    </span>
  );
}
