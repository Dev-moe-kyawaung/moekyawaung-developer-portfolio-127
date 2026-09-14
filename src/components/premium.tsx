import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode, KeyboardEvent } from 'react';
import { Search, CornerDownLeft, X, ChevronLeft, ChevronRight, Command } from 'lucide-react';
import { navigate } from '../lib/router';
import { NAV_GROUPS } from '../content';

/* ============================================================
   PARTICLE NETWORK — canvas constellation with cursor gravity
   ============================================================ */
export function Particles({ density = 0.00009, className = '' }: { density?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    /* honour reduced-motion — render one static frame instead */
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0, h = 0, raf = 0;
    const pointer = { x: -9999, y: -9999 };

    type P = { x: number; y: number; vx: number; vy: number; r: number; hue: number };
    let pts: P[] = [];

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(120, Math.max(28, Math.round(w * h * density)));
      pts = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.5 + 0.6,
        hue: Math.random() > 0.6 ? 330 : Math.random() > 0.3 ? 185 : 50,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const LINK = 128;

      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        /* gentle attraction toward the pointer */
        const dx = pointer.x - p.x;
        const dy = pointer.y - p.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 24000 && d2 > 1) {
          const f = 0.00028;
          p.vx += dx * f;
          p.vy += dy * f;
        }
        /* clamp speed */
        p.vx = Math.max(-0.5, Math.min(0.5, p.vx));
        p.vy = Math.max(-0.5, Math.min(0.5, p.vy));
      }

      /* links */
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i], b = pts[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK) {
            const alpha = (1 - dist / LINK) * 0.3;
            ctx.strokeStyle = `hsla(${a.hue}, 100%, 62%, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      /* nodes */
      for (const p of pts) {
        ctx.fillStyle = `hsla(${p.hue}, 100%, 68%, 0.85)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reduced) raf = requestAnimationFrame(draw);
    };

    const onMove = (e: globalThis.MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
    };
    const onLeave = () => { pointer.x = -9999; pointer.y = -9999; };

    resize();
    draw();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseout', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseout', onLeave);
    };
  }, [density]);

  return <canvas ref={ref} className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} aria-hidden="true" />;
}

/* ============================================================
   MAGNETIC WRAPPER — element leans toward the cursor
   ============================================================ */
export function Magnetic({ children, strength = 0.28, className = '' }: {
  children: ReactNode; strength?: number; className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  const onMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    el.style.transition = 'transform 0.12s ease-out';
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = 'transform 0.5s cubic-bezier(0.22,1,0.36,1)';
    el.style.transform = 'translate(0,0)';
  };

  return (
    <span ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className={`inline-block will-change-transform ${className}`}>
      {children}
    </span>
  );
}

/* ============================================================
   LIGHTBOX GALLERY — keyboard accessible, arrow navigation
   ============================================================ */
export function Lightbox({ images }: { images: { src: string; caption: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);

  const close = () => setOpen(null);
  const next = () => setOpen((p) => (p === null ? null : (p + 1) % images.length));
  const prev = () => setOpen((p) => (p === null ? null : (p - 1 + images.length) % images.length));

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (open === null) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  };

  useEffect(() => {
    if (open !== null) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {/* thumbnails */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {images.map((im, i) => (
          <button
            key={im.src + i}
            onClick={() => setOpen(i)}
            className="relative group cyber-card clip-cy-sm overflow-hidden aspect-[4/3]"
            aria-label={`Open image: ${im.caption}`}
          >
            <img src={im.src} alt={im.caption} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70 group-hover:opacity-95 transition-opacity" />
            <span className="absolute bottom-2 left-2 right-2 text-left font-mono2 text-[9px] leading-tight text-white/90 line-clamp-2">{im.caption}</span>
          </button>
        ))}
      </div>

      {/* modal */}
      {open !== null && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8 bg-black/92 backdrop-blur-md"
          role="dialog" aria-modal="true" aria-label="Image viewer" onKeyDown={onKey} tabIndex={-1}
        >
          <button onClick={close} aria-label="Close viewer" className="absolute top-5 right-5 w-11 h-11 clip-cy-sm border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:border-[var(--cyan)] z-10">
            <X size={20} />
          </button>
          <button onClick={prev} aria-label="Previous image" className="absolute left-3 sm:left-6 w-11 h-11 clip-cy-sm border border-white/20 flex items-center justify-center text-white/80 hover:text-[var(--cyan)] hover:border-[var(--cyan)] z-10">
            <ChevronLeft size={20} />
          </button>
          <button onClick={next} aria-label="Next image" className="absolute right-3 sm:right-6 w-11 h-11 clip-cy-sm border border-white/20 flex items-center justify-center text-white/80 hover:text-[var(--cyan)] hover:border-[var(--cyan)] z-10">
            <ChevronRight size={20} />
          </button>

          <figure className="max-w-5xl w-full">
            <img src={images[open].src} alt={images[open].caption} className="w-full max-h-[75vh] object-contain clip-cy-lg" />
            <figcaption className="mt-4 flex items-center justify-between gap-4">
              <span className="font-head font-semibold text-sm text-white/90">{images[open].caption}</span>
              <span className="font-mono2 text-[10px] tracking-[0.25em] text-[var(--cyan)] shrink-0">
                {String(open + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
              </span>
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}

/* ============================================================
   COMMAND PALETTE — ⌘K / Ctrl+K navigation
   ============================================================ */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);

  /* flatten nav into searchable commands */
  const commands = useMemo(
    () =>
      NAV_GROUPS.flatMap((g) =>
        g.items.map((i) => ({ ...i, group: g.group, to: i.to || '' }))
      ),
    []
  );

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return commands;
    return commands.filter((c) => c.label.toLowerCase().includes(s) || c.group.toLowerCase().includes(s));
  }, [q, commands]);

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((p) => !p);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!open) { setQ(''); setSel(0); }
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => { setSel(0); }, [q]);

  const run = (to: string) => { setOpen(false); navigate(to); };

  return (
    <>
      {/* trigger */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open command palette"
        className="hidden md:flex items-center gap-2.5 px-3.5 h-9 clip-tag border border-[var(--line)] text-[var(--faint)] hover:text-[var(--cyan)] hover:border-[var(--cyan)] transition-all font-mono2 text-[10px] tracking-[0.15em]"
      >
        <Search size={13} />
        QUICK FIND
        <kbd className="flex items-center gap-0.5 px-1.5 py-0.5 border border-[var(--line)] text-[9px]">
          <Command size={9} />K
        </kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-[300] flex items-start justify-center pt-[12vh] px-4 bg-black/80 backdrop-blur-md" onClick={() => setOpen(false)}>
          <div
            className="w-full max-w-lg cyber-card clip-cy-lg overflow-hidden !border-[var(--line-strong)]"
            onClick={(e) => e.stopPropagation()}
            role="dialog" aria-modal="true" aria-label="Command palette"
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--line)]">
              <Search size={17} className="text-[var(--cyan)] shrink-0" />
              {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search 30 pages…"
                aria-label="Search pages"
                className="flex-1 bg-transparent outline-none text-[var(--txt)] placeholder:text-[var(--faint)] font-head text-base"
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') { e.preventDefault(); setSel((p) => Math.min(results.length - 1, p + 1)); }
                  if (e.key === 'ArrowUp') { e.preventDefault(); setSel((p) => Math.max(0, p - 1)); }
                  if (e.key === 'Enter' && results[sel]) run(results[sel].to);
                }}
              />
              <kbd className="px-1.5 py-0.5 border border-[var(--line)] font-mono2 text-[9px] text-[var(--faint)]">ESC</kbd>
            </div>

            <ul className="max-h-[52vh] overflow-y-auto py-2" role="listbox">
              {results.length === 0 && (
                <li className="px-5 py-8 text-center font-mono2 text-xs text-[var(--faint)]">NO MATCHING PAGE</li>
              )}
              {results.map((c, i) => (
                <li key={c.to + c.label} role="option" aria-selected={i === sel}>
                  <button
                    onMouseEnter={() => setSel(i)}
                    onClick={() => run(c.to)}
                    className={`w-full flex items-center justify-between gap-3 px-5 py-3 text-left transition-colors ${
                      i === sel ? 'bg-[var(--cyan-soft)]' : ''
                    }`}
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      <span className="font-mono2 text-[9px] tracking-[0.15em] text-[var(--pink)] shrink-0">{c.group.toUpperCase()}</span>
                      <span className={`font-head font-bold text-sm truncate ${i === sel ? 'text-[var(--cyan)]' : ''}`}>{c.label}</span>
                      {c.mm && <span className="font-mm text-[10px] text-[var(--faint)] shrink-0">{c.mm}</span>}
                    </span>
                    {i === sel && <CornerDownLeft size={13} className="text-[var(--cyan)] shrink-0" />}
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--line)] font-mono2 text-[9px] tracking-[0.18em] text-[var(--faint)]">
              <span>↑↓ NAVIGATE · ⏎ OPEN</span>
              <span>{results.length} RESULTS</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ============================================================
   SECTION RAIL — right-edge dot navigation with active glow
   ============================================================ */
export function ScrollRail({ ids }: { ids: string[] }) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-40% 0px -50% 0px' }
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [ids]);

  return (
    <nav aria-label="Section rail" className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-3.5">
      {ids.map((id) => (
        <a
          key={id}
          href={`#${id}`}
          aria-label={`Jump to ${id}`}
          className="group relative flex items-center justify-end"
        >
          <span className={`absolute right-5 font-mono2 text-[9px] tracking-[0.2em] uppercase whitespace-nowrap transition-all duration-300 ${
            active === id ? 'opacity-100 text-[var(--cyan)]' : 'opacity-0 group-hover:opacity-100 text-[var(--faint)]'
          }`}>
            {id}
          </span>
          <span
            className={`block rotate-45 border transition-all duration-400 ${
              active === id
                ? 'w-3 h-3 bg-[var(--cyan)] border-[var(--cyan)] shadow-[0_0_12px_var(--cyan)]'
                : 'w-2 h-2 border-[var(--line-strong)] group-hover:border-[var(--cyan)]'
            }`}
          />
        </a>
      ))}
    </nav>
  );
}
