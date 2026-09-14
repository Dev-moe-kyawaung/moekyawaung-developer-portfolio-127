import { useEffect, useMemo, useRef } from 'react';
import { GitBranch, ArrowUpRight, Radio, Satellite, Gauge } from 'lucide-react';

/* ============================================================================
   WARP DRIVE SYSTEM
   Starfield motion · gravity lens · HUD panels · mission logs · warp tunnel
   ============================================================================ */

/** SVG filter defs for gravity-lens distortion — mounted once at root. */
export function WarpDefs() {
  return (
    <svg aria-hidden="true" focusable="false" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
      <defs>
        <filter id="warp-lens" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.006 0.01" numOctaves="2" seed="17" result="n">
            <animate attributeName="baseFrequency" dur="18s"
              values="0.005 0.009;0.009 0.014;0.005 0.009" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="14" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  );
}

/* ============================================================================
   WARP STARFIELD — perspective star streaks accelerating from center
   ============================================================================ */
export function WarpField({ count = 220, className = '' }: { count?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const speedRef = useRef(1);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 0, h = 0, cx = 0, cy = 0, raf = 0;
    type S = { x: number; y: number; z: number; pz: number };
    let stars: S[] = [];

    const seed = () => {
      stars = Array.from({ length: count }, () => {
        const z = Math.random() * w;
        return { x: (Math.random() - 0.5) * w, y: (Math.random() - 0.5) * h, z, pz: z };
      });
    };

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      cx = w / 2; cy = h / 2;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const draw = () => {
      ctx.fillStyle = 'rgba(2, 4, 12, 0.35)';
      ctx.fillRect(0, 0, w, h);
      const spd = speedRef.current;

      for (const s of stars) {
        s.pz = s.z;
        s.z -= 2.2 * spd;
        if (s.z < 1) {
          s.z = w; s.pz = w;
          s.x = (Math.random() - 0.5) * w;
          s.y = (Math.random() - 0.5) * h;
        }
        const sx = cx + (s.x / s.z) * w;
        const sy = cy + (s.y / s.z) * w;
        const px = cx + (s.x / s.pz) * w;
        const py = cy + (s.y / s.pz) * w;
        const size = Math.max(0.4, (1 - s.z / w) * 2.4);
        const hue = s.z < w * 0.35 ? '#c9a6ff' : '#7cc4ff';
        ctx.strokeStyle = hue;
        ctx.globalAlpha = Math.min(1, (1 - s.z / w) * 1.2);
        ctx.lineWidth = size;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      /* ease speed back to cruise */
      speedRef.current += (1 - speedRef.current) * 0.03;
      if (!reduced) raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    /* brief jump to warp on scroll */
    const boost = () => { speedRef.current = Math.min(9, speedRef.current + 2.4); };
    window.addEventListener('resize', resize);
    window.addEventListener('wheel', boost, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('wheel', boost);
    };
  }, [count]);

  return <canvas ref={ref} className={`w-full h-full ${className}`} aria-hidden="true" />;
}

/* ============================================================================
   HUD FRAME — corner brackets + tick strip wrapper
   ============================================================================ */
export function HudFrame({ children, label, className = '' }: {
  children: React.ReactNode; label?: string; className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <span className="hud-corner border-t-2 border-l-2 top-0 left-0" />
      <span className="hud-corner border-t-2 border-r-2 top-0 right-0" />
      <span className="hud-corner border-b-2 border-l-2 bottom-0 left-0" />
      <span className="hud-corner border-b-2 border-r-2 bottom-0 right-0" />
      {label && (
        <span className="absolute -top-2.5 left-6 px-2 bg-[var(--bg)] font-mono2 text-[9px] tracking-[0.25em] text-[var(--cyan)] uppercase">
          {label}
        </span>
      )}
      {children}
    </div>
  );
}

/* ============================================================================
   ORBITAL PATH — animated diagram of a project's system as orbits
   ============================================================================ */
export function OrbitalPath({ nodes, className = '' }: { nodes: string[]; className?: string }) {
  return (
    <div className={`relative w-full max-w-[160px] aspect-square mx-auto ${className}`} aria-hidden="true">
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
        {/* elliptical orbits */}
        {nodes.map((_, i) => {
          const rx = 16 + i * 7;
          const ry = (16 + i * 7) * 0.62;
          return (
            <ellipse
              key={i} cx="50" cy="50" rx={rx} ry={ry}
              fill="none" stroke="rgba(124,196,255,0.18)" strokeWidth="0.4"
              transform={`rotate(${i * 24} 50 50)`}
            />
          );
        })}
        {/* orbiting satellites */}
        {nodes.map((label, i) => {
          const rx = 16 + i * 7;
          const rot = i * 24;
          const dur = 8 + i * 4;
          return (
            <g key={label} transform={`rotate(${rot} 50 50)`}>
              <g className="orbit-spin" style={{ animationDuration: `${dur}s`, transformOrigin: '50px 50px' }}>
                <circle className="orbit-sat" cx={50 + rx} cy="50" r="2.2" fill="#7cc4ff"
                  style={{ animationDelay: `${i * 0.4}s` }} />
                <text x={50 + rx} y="46" fill="rgba(232,242,255,0.6)" fontSize="3.3"
                  textAnchor="middle" fontFamily="JetBrains Mono, monospace"
                  transform={`rotate(${-rot} ${50 + rx} 50)`}>
                  {label}
                </text>
              </g>
            </g>
          );
        })}
        {/* the star at the barycenter */}
        <circle cx="50" cy="50" r="4.5" fill="#ffd66b" opacity="0.35" />
        <circle cx="50" cy="50" r="2.4" fill="#fff" />
      </svg>
    </div>
  );
}

/* ============================================================================
   MISSION LOG — project card as a starship mission record
   ============================================================================ */
function hashStr(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const STATUS = ['NOMINAL', 'ORBIT STABLE', 'CRUISING', 'DOCKED', 'ONLINE'];

export function MissionLog({ title, desc, tags, img, cat, index, nodes, href, repo }: {
  title: string; desc: string; tags: string[]; img: string; cat: string;
  index: number; nodes: string[]; href: string; repo: string;
}) {
  const h = useMemo(() => hashStr(title), [title]);
  const stardate = `${2426 + (h % 40)}.${100 + (h % 900)}`;
  const status = STATUS[h % STATUS.length];
  const integrity = 91 + (h % 9);
  const velocity = (1.2 + (h % 80) / 100).toFixed(2);

  return (
    <article className="hud-panel group flex flex-col">
      <div className="hud-ticks" />
      {/* header */}
      <div className="flex items-center justify-between px-5 pt-3.5 pb-2">
        <div className="flex items-center gap-2">
          <Radio size={12} className="text-[var(--cyan)]" />
          <span className="font-mono2 text-[10px] tracking-[0.22em] text-[var(--cyan)]">
            LOG {String(index).padStart(3, '0')}
          </span>
        </div>
        <span className="font-mono2 text-[9px] tracking-[0.18em] text-[var(--green)] flex items-center gap-1.5">
          <span className="pulse-dot" /> {status}
        </span>
      </div>

      <div className="px-5 pb-5 flex flex-col gap-4 flex-1">
        {/* title + stardate */}
        <div>
          <div className="font-mono2 text-[9px] tracking-[0.2em] text-[var(--faint)]">STARDATE {stardate} · {cat}</div>
          <h3 className="mt-1.5 font-display font-bold text-[17px] leading-tight group-hover:text-[var(--cyan)] transition-colors duration-400">
            {title}
          </h3>
        </div>

        {/* mission briefing */}
        <p className="text-[13px] text-[var(--dim)] leading-relaxed">
          <span className="font-mono2 text-[8.5px] tracking-[0.25em] text-[var(--faint)] block mb-1">MISSION BRIEFING</span>
          {desc}
        </p>

        {/* orbital path diagram */}
        <div className="opacity-80 group-hover:opacity-100 transition-opacity duration-500">
          <OrbitalPath nodes={nodes} />
          <div className="text-center font-mono2 text-[8px] tracking-[0.28em] text-[var(--faint)] -mt-1">
            ORBITAL SYSTEM MAP
          </div>
        </div>

        {/* telemetry readouts */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono2 text-[8.5px] tracking-[0.16em] text-[var(--faint)] flex items-center gap-1"><Gauge size={9} /> HULL</span>
              <span className="font-display text-[11px] font-bold text-[var(--cyan)]">{integrity}%</span>
            </div>
            <div className="hud-meter"><span style={{ width: `${integrity}%` }} /></div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono2 text-[8.5px] tracking-[0.16em] text-[var(--faint)] flex items-center gap-1"><Satellite size={9} /> WARP</span>
              <span className="font-display text-[11px] font-bold text-[var(--pink)]">{velocity}c</span>
            </div>
            <div className="hud-meter"><span style={{ width: `${Math.min(100, Number(velocity) * 48)}%`, background: 'linear-gradient(90deg, var(--pink), var(--yellow))' }} /></div>
          </div>
        </div>

        {/* tags */}
        <div className="flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <span key={t} className="px-2 py-0.5 font-mono2 text-[9px] tracking-[0.12em] uppercase border border-[var(--line)] text-[var(--cyan)]">
              {t}
            </span>
          ))}
        </div>

        {/* links */}
        <div className="flex gap-2 pt-1 mt-auto">
          <a href={repo} target="_blank" rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 border border-[var(--line-strong)] font-head font-bold text-[10.5px] tracking-[0.14em] uppercase text-[var(--cyan)] hover:bg-[var(--cyan)] hover:text-black transition-all">
            <GitBranch size={12} /> Archive
          </a>
          <a href={href}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 border border-[var(--line)] font-head font-bold text-[10.5px] tracking-[0.14em] uppercase text-[var(--dim)] hover:border-[var(--pink)] hover:text-[var(--pink)] transition-all">
            Debrief <ArrowUpRight size={12} />
          </a>
        </div>
      </div>

      <img src={img} alt="" aria-hidden="true" className="hidden" />
    </article>
  );
}

/* ============================================================================
   WARP TUNNEL VEIL — route transition streaking to light speed
   ============================================================================ */
export function WarpVeil({ phase }: { phase: 'idle' | 'in' | 'out' }) {
  const streaks = useMemo(
    () => Array.from({ length: 40 }, (_, i) => ({
      angle: (i / 40) * 360 + Math.random() * 8,
      delay: Math.random() * 0.25,
      hue: Math.random() > 0.7 ? '#c9a6ff' : '#7cc4ff',
    })),
    []
  );
  if (phase === 'idle') return null;
  return (
    <div className="warp-veil" data-phase={phase} aria-hidden="true">
      {streaks.map((s, i) => (
        <span
          key={i}
          className="warp-streak"
          style={{
            transform: `rotate(${s.angle}deg)`,
            animationDelay: `${s.delay}s`,
            background: `linear-gradient(90deg, transparent, ${s.hue}, #fff)`,
          }}
        />
      ))}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-mono2 text-[11px] tracking-[0.5em] text-[var(--cyan)] animate-pulse">ENGAGING WARP</span>
      </div>
    </div>
  );
}
