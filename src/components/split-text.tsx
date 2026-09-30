import type { CSSProperties } from 'react';

const CJK = /[㐀-䶿一-鿿぀-ヿｦ-ﾟ]/;

/**
 * 切分显示单元：汉字与假名逐字，拉丁词整体保留。
 * 逐字拆拉丁单词会造成单词内断行，所以英文走词级。
 */
function splitUnits(text: string): string[] {
  const units: string[] = [];
  let latin = '';

  for (const char of text) {
    if (CJK.test(char)) {
      if (latin) {
        units.push(latin);
        latin = '';
      }
      units.push(char);
    } else if (/\s/.test(char)) {
      if (latin) {
        units.push(latin);
        latin = '';
      }
      units.push(char);
    } else {
      latin += char;
    }
  }

  if (latin) units.push(latin);
  return units;
}

const PHRASE_BREAK = /[，。、；：！？,.;:!?]/;

/** 按标点切句，标点留在前一句末尾 */
function splitPhrases(text: string): string[] {
  const parts: string[] = [];
  let buffer = '';

  for (const char of text) {
    buffer += char;
    if (PHRASE_BREAK.test(char)) {
      parts.push(buffer);
      buffer = '';
    }
  }

  if (buffer) parts.push(buffer);
  return parts;
}

/**
 * 逐字揭示的纯展示层。
 *
 * 文本仍以真实字符留在 DOM 里，爬虫与复制不受影响；
 * 无障碍靠父元素的 aria-label 朗读整句，避免逐字念。
 *
 * glyph 模式给标题：逐字落位，并支持悬停波纹。
 * phrase 模式给段落：按句浮现。段内句子用 inline 排布，
 * 不能用 inline-block，否则长句在窄屏会整块溢出。
 */
export function SplitText({
  text,
  className,
  mode = 'glyph',
}: {
  text: string;
  className?: string;
  mode?: 'glyph' | 'phrase';
}) {
  if (mode === 'phrase') {
    return (
      <span className={className}>
        {splitPhrases(text).map((phrase, index) => (
          <span key={`${phrase}-${index}`} className="m-phrase" style={{ '--i': index } as CSSProperties}>
            {phrase}
          </span>
        ))}
      </span>
    );
  }

  const units = splitUnits(text);

  return (
    <span className={className ? `glyph-field ${className}` : 'glyph-field'} aria-hidden="true">
      {units.map((unit, index) =>
        /\s/.test(unit) ? (
          // 空格不参与动画，但要占位，否则英文词会连在一起
          <span key={`${unit}-${index}`}>{unit}</span>
        ) : (
          <span key={`${unit}-${index}`} className="m-glyph" style={{ '--i': index } as CSSProperties}>
            <span>{unit}</span>
          </span>
        ),
      )}
    </span>
  );
}
