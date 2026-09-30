'use client';

import { useEffect, useRef, useState } from 'react';

/** 整段动画时长 */
const DURATION = 1500;
/** 前段留给奇点：一点微光先亮起，再炸开 */
const SINGULARITY = 220;
/** 爆发瞬间射出的细线数量 */
const RAYS = 14;

type Particle = {
  angle: number;
  /** 最终飞行距离 */
  reach: number;
  size: number;
  /** 出膛错峰（毫秒），让边缘不至于整齐得像圆环 */
  delay: number;
};

/**
 * 把主题色变量转成带透明度的 rgba。
 * 变量是十六进制，解析失败时退回中性灰 —— 宁可灰也不能画出彩色。
 */
function toRgba(value: string, alpha: number) {
  const hex = value.trim();
  if (/^#[0-9a-f]{6}$/i.test(hex)) {
    const n = Number.parseInt(hex.slice(1), 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
  }
  if (/^#[0-9a-f]{3}$/i.test(hex)) {
    const n = Number.parseInt(hex.slice(1), 16);
    return `rgba(${((n >> 8) & 15) * 17}, ${((n >> 4) & 15) * 17}, ${(n & 15) * 17}, ${alpha})`;
  }
  return `rgba(128, 128, 128, ${alpha})`;
}

const easeOut = (t: number) => 1 - (1 - t) ** 3;

/**
 * 首页载入时的一次大爆炸：奇点亮起 → 粒子向外飞散 → 淡出，随后文字才落位。
 *
 * 播完即卸载画布并停掉 rAF，不在后台常驻。粒子只有前景一色，
 * 主题切换时取的是 --foreground / --background，明暗都落在黑白灰阶上。
 */
export function BigBang() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [alive, setAlive] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 减少动效时不放动画，画布直接不参与渲染
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setAlive(false);
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setAlive(false);
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    if (width === 0 || height === 0) {
      setAlive(false);
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const rootStyle = getComputedStyle(document.documentElement);
    const ink = (alpha: number) => toRgba(rootStyle.getPropertyValue('--foreground'), alpha);
    const veil = (alpha: number) => toRgba(rootStyle.getPropertyValue('--background'), alpha);

    const cx = width * 0.5;
    const cy = height * 0.44;
    const maxReach = Math.hypot(width, height) * 0.55;
    const count = Math.round(Math.min(360, Math.max(150, (width * height) / 2400)));

    // 距离取幂分布：多数粒子留在近处，少数冲到边缘，比均匀分布更像一次爆发
    const particles: Particle[] = Array.from({ length: count }, () => {
      const roll = Math.random();
      return {
        angle: Math.random() * Math.PI * 2,
        reach: maxReach * (0.12 + 0.88 * roll ** 1.7),
        size: 0.5 + Math.random() * 1.6,
        delay: Math.random() * 140,
      };
    });

    let frame = 0;
    /*
     * 起点取首帧的时间戳，不能先取 performance.now()：
     * rAF 回调拿到的是当前帧已确定的时刻，可能早于这里记下的时间，
     * 于是 elapsed 变负，奇点半径算出负值，arc 直接抛 IndexSizeError。
     */
    let start = 0;
    const span = DURATION - SINGULARITY;

    const draw = (now: number) => {
      if (start === 0) start = now;
      const elapsed = now - start;

      // 每帧用背景色薄薄盖一层，粒子自然拖出尾迹
      ctx.fillStyle = veil(0.24);
      ctx.fillRect(0, 0, width, height);

      if (elapsed < SINGULARITY) {
        const s = elapsed / SINGULARITY;
        ctx.beginPath();
        ctx.arc(cx, cy, 1.5 + s * 5.5, 0, Math.PI * 2);
        ctx.fillStyle = ink(0.9);
        ctx.fill();
        frame = requestAnimationFrame(draw);
        return;
      }

      const tp = Math.min((elapsed - SINGULARITY) / span, 1);

      // 射线只在爆发前段出现，之后交给粒子
      if (tp < 0.5) {
        const rt = tp / 0.5;
        const len = maxReach * easeOut(rt);
        ctx.strokeStyle = ink(0.32 * (1 - rt));
        ctx.lineWidth = 1;
        for (let i = 0; i < RAYS; i += 1) {
          const angle = (i / RAYS) * Math.PI * 2 + 0.13;
          const cos = Math.cos(angle);
          const sin = Math.sin(angle);
          ctx.beginPath();
          ctx.moveTo(cx + cos * len * 0.16, cy + sin * len * 0.16);
          ctx.lineTo(cx + cos * len, cy + sin * len);
          ctx.stroke();
        }
      }

      for (const particle of particles) {
        const local = Math.min(Math.max((elapsed - SINGULARITY - particle.delay) / (span - particle.delay), 0), 1);
        const alpha = (1 - local) ** 1.5;
        if (alpha <= 0.02) continue;
        const dist = particle.reach * easeOut(local);
        ctx.beginPath();
        ctx.arc(
          cx + Math.cos(particle.angle) * dist,
          cy + Math.sin(particle.angle) * dist,
          particle.size * (1 - 0.45 * local),
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = ink(alpha * 0.95);
        ctx.fill();
      }

      if (tp >= 1) {
        ctx.clearRect(0, 0, width, height);
        setAlive(false);
        return;
      }

      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!alive) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
    />
  );
}
