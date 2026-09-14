import { useEffect, useRef, useState } from 'react';
import type { ReactNode, MouseEvent } from 'react';
import { ArrowUp, Terminal } from 'lucide-react';
import { useScrollY } from '../hooks';
import { GlyphRain, SpellCircle } from './arcane';

/* ============ PRELOADER — boot sequence with progress bar ============ */
export function Preloader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const dur = 1500;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      setPct(Math.round(p * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => { setGone(true); setTimeout(onDone, 620); }, 260);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  const lines = ['> init kotlin.runtime...', '> link jetpack.compose...', '> auth firebase.ok', '> build variants: release'];

  return (
    <div className={`preloader ${gone ? 'done' : ''}`} aria-hidden={gone}>
      <div className="grid-bg opacity-60" />
      <div className="relative flex flex-col items-center gap-6 px-6">
        <div className="relative w-28 h-28 flex items-center justify-center">
          <div className="ring-rotate" />
          <div className="w-full h-full rounded-full bg-[#070b16] flex items-center justify-center font-display font-900 text-2xl grad-text" style={{ fontWeight: 900 }}>
            MKA
          </div>
        </div>
        <div className="font-mono2 text-[11px] tracking-[0.3em] text-[var(--dim)] flex items-center gap-2">
          <Terminal size={13} className="text-[var(--cyan)]" />
          BOOTING PORTFOLIO v2026.1
        </div>
        <div className="w-64 h-[6px] prog-track">
          <div className="prog-fill h-full" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, var(--cyan), var(--pink))' }} />
        </div>
        <div className="font-mono2 text-xs text-[var(--cyan)] w-64 text-between flex justify-between">
          {lines.slice(0, Math.max(1, Math.ceil(pct / 26))).map((l) => (
            <span key={l} className="text-[10px] text-[var(--faint)] hidden sm:block">{l}</span>
          ))}
          <span className="text-[var(--pink)]">{pct}%</span>
        </div>
      </div>
    </div>
  );
}

/* ============ CUSTOM CURSOR — dot + trailing ring ============ */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(hover: none)').matches) return;
    document.documentElement.classList.add('custom-cursor-on');

    let x = -100, y = -100, rx = -100, ry = -100;
    let raf = 0;
    const move = (e: globalThis.MouseEvent) => {
      x = e.clientX; y = e.clientY;
      if (dotRef.current) dotRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%,-50%)`;
    };
    const over = (e: globalThis.MouseEvent) => {
      const t = e.target as HTMLElement;
      const hit = t.closest('a, button, input, textarea, [data-cursor]');
      ringRef.current?.classList.toggle('hovering', !!hit);
    };
    const loop = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      if (ringRef.current) ringRef.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('mousemove', move, { passive: true });
    window.addEventListener('mouseover', over, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove('custom-cursor-on');
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}

/* ============ GLOBAL BACKGROUND — grid + orbs + scanlines ============ */
export function Background() {
  const y = useScrollY();
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[var(--bg)]" aria-hidden="true">
      {/* base vertical gradient wash */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% -10%, var(--cyan-soft), transparent 60%), radial-gradient(ellipse 60% 50% at 90% 110%, var(--pink-soft), transparent 60%)' }} />
      <div className="sigil-field" />
      <div className="sigil-floor" />
      {/* drifting Elder Futhark glyphs */}
      <GlyphRain count={18} />
      {/* great summoning circle centred in the void */}
      <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2"
           style={{ transform: `translate(-50%, calc(-50% + ${y * 0.04}px))` }}>
        <SpellCircle size={760} opacity={0.16} />
      </div>
      {/* parallax glow orbs (depth-based) */}
      <div className="orb w-[420px] h-[420px] -top-32 -left-32" style={{ background: 'var(--cyan)', transform: `translateY(${y * 0.06}px)` }} />
      <div className="orb w-[380px] h-[380px] top-1/3 -right-32" style={{ background: 'var(--pink)', animationDelay: '-5s', transform: `translateY(${y * -0.05}px)` }} />
      <div className="orb w-[300px] h-[300px] bottom-10 left-1/4" style={{ background: 'var(--violet)', animationDelay: '-9s' }} />
      {/* CRT scanlines overlay */}
      <div className="scanlines" />
    </div>
  );
}

/* ============ 3D TILT WRAPPER ============ */
export function Tilt({ children, className = '', max = 7 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) translateY(-4px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
  };
  return (
    <div ref={ref} className={`tilt ${className}`} onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </div>
  );
}

/* ============ BACK TO TOP — appears after 400px ============ */
export function BackToTop() {
  const y = useScrollY();
  const show = y > 400;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className={`fixed bottom-6 right-6 z-40 w-12 h-12 clip-cy-sm flex items-center justify-center bg-[var(--panel)] border border-[var(--line-strong)] text-[var(--cyan)] transition-all duration-500 hover:bg-[var(--cyan)] hover:text-black ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'}`}
      style={{ boxShadow: show ? 'var(--glow-c)' : 'none' }}
    >
      <ArrowUp size={20} />
    </button>
  );
}

/* ============ STICKY CTA — availability pill ============ */
export function StickyCta() {
  const y = useScrollY();
  const show = y > 650;
  return (
    <a
      href="#contact"
      className={`fixed bottom-6 left-6 z-40 flex items-center gap-3 pl-4 pr-5 py-3 clip-tag bg-[var(--panel)] border border-[var(--line-strong)] backdrop-blur-md font-head font-semibold tracking-widest text-sm uppercase transition-all duration-500 hover:border-[var(--pink)] ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'}`}
    >
      <span className="pulse-dot" />
      <span className="text-[var(--txt)]">Hire Me</span>
    </a>
  );
}
