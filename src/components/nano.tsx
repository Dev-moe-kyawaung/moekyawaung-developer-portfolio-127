import { useEffect, useMemo, useRef } from 'react';
import { GitBranch, ArrowUpRight, Atom, Hexagon, Activity } from 'lucide-react';

/* ============================================================================
   NANO-PARTICLE TECH SYSTEM
   Particle simulation with molecular bonds · atomic orbits · nano-modules
   ============================================================================ */

/* ============================================================================
   MOLECULAR FIELD — particles that form bonds when within range
   ============================================================================ */
export function MolecularField({ density = 0.00007, className = '' }: { density?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 0, h = 0, raf = 0;
    const pointer = { x: -9999, y: -9999 };
    type Atom = { x: number; y: number; vx: number; vy: number; r: number; hue: string; valence: number };
    let atoms: Atom[] = [];

    const HUES = ['#4fe3c1', '#5aa9ff', '#c4f042'];

    const seed = () => {
      const count = Math.min(90, Math.max(26, Math.round(w * h * density)));
      atoms = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 2 + 1.4,
        hue: HUES[Math.floor(Math.random() * HUES.length)],
        valence: 1 + Math.floor(Math.random() * 3),
      }));
    };

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const BOND = 116;

      /* move atoms */
      for (const a of atoms) {
        a.x += a.vx;
        a.y += a.vy;
        if (a.x < 0 || a.x > w) a.vx *= -1;
        if (a.y < 0 || a.y > h) a.vy *= -1;
        /* weak pull toward pointer — a nanobot cursor */
        const dx = pointer.x - a.x;
        const dy = pointer.y - a.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 26000 && d2 > 1) {
          a.vx += dx * 0.00022;
          a.vy += dy * 0.00022;
        }
        a.vx = Math.max(-0.55, Math.min(0.55, a.vx));
        a.vy = Math.max(-0.55, Math.min(0.55, a.vy));
      }

      /* draw bonds */
      for (let i = 0; i < atoms.length; i++) {
        for (let j = i + 1; j < atoms.length; j++) {
          const a = atoms[i], b = atoms[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < BOND) {
            const alpha = (1 - dist / BOND) * 0.42;
            ctx.strokeStyle = `rgba(79, 227, 193, ${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
            /* double-bond hint for close atoms */
            if (dist < BOND * 0.55) {
              ctx.strokeStyle = `rgba(90, 169, 255, ${alpha * 0.7})`;
              const ox = -dy / dist * 2, oy = dx / dist * 2;
              ctx.beginPath();
              ctx.moveTo(a.x + ox, a.y + oy);
              ctx.lineTo(b.x + ox, b.y + oy);
              ctx.stroke();
            }
          }
        }
      }

      /* draw atoms with electron shells */
      for (const a of atoms) {
        ctx.fillStyle = a.hue;
        ctx.shadowColor = a.hue;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = `${a.hue}44`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r + 4, 0, Math.PI * 2);
        ctx.stroke();
      }

      if (!reduced) raf = requestAnimationFrame(draw);
    };

    const onMove = (e: MouseEvent) => {
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

  return <canvas ref={ref} className={`w-full h-full ${className}`} aria-hidden="true" />;
}

/* ============================================================================
   ATOM — nucleus with electrons on tilted orbital shells
   ============================================================================ */
export function NanoAtom({ size = 300, className = '' }: { size?: number; className?: string }) {
  const shells = [
    { rot: 0, dur: 6, color: 'var(--cyan)' },
    { rot: 60, dur: 9, color: 'var(--pink)' },
    { rot: 120, dur: 12, color: 'var(--yellow)' },
  ];
  return (
    <div className={`relative ${className}`} style={size ? { width: size, height: size } : undefined} aria-hidden="true">
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
        {/* nucleus glow */}
        <circle cx="50" cy="50" r="20" fill="url(#nano-nuc)" opacity="0.35" />
        <defs>
          <radialGradient id="nano-nuc">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="var(--cyan)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        {shells.map((s, i) => (
          <g key={i} transform={`rotate(${s.rot} 50 50)`}>
            <ellipse cx="50" cy="50" rx="42" ry="16" fill="none" stroke={s.color} strokeWidth="0.5" opacity="0.4" />
            <g className="electron-shell" style={{ animationDuration: `${s.dur}s`, transformOrigin: '50px 50px' }}>
              <circle cx="92" cy="50" r="2.6" fill={s.color} style={{ filter: `drop-shadow(0 0 4px ${s.color})` }} />
            </g>
          </g>
        ))}
        {/* nucleus */}
        <circle cx="50" cy="50" r="6.5" fill="var(--cyan)" style={{ filter: 'drop-shadow(0 0 8px var(--cyan))' }} />
        <circle cx="48" cy="48" r="2" fill="#fff" opacity="0.8" />
      </svg>
    </div>
  );
}

/* ============================================================================
   BOND DIAGRAM — a project's architecture as a molecule
   ============================================================================ */
export function BondDiagram({ nodes, className = '' }: { nodes: string[]; className?: string }) {
  const n = nodes.length;
  const radius = 32;
  const pts = useMemo(
    () =>
      nodes.map((label, i) => {
        const a = (i / n) * Math.PI * 2 - Math.PI / 2;
        return { label, x: 50 + Math.cos(a) * radius, y: 50 + Math.sin(a) * radius };
      }),
    [nodes, n]
  );

  return (
    <div className={`relative w-full max-w-[160px] aspect-square mx-auto ${className}`} aria-hidden="true">
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
        {/* bonds to core */}
        {pts.map((p, i) => (
          <line key={`c${i}`} x1="50" y1="50" x2={p.x} y2={p.y}
            className="bond-line" stroke="var(--cyan)" strokeWidth="0.8" opacity="0.7" />
        ))}
        {/* ring bonds between neighbours */}
        {pts.map((p, i) => {
          const q = pts[(i + 1) % n];
          return <line key={`r${i}`} x1={p.x} y1={p.y} x2={q.x} y2={q.y}
            className="bond-line-fast" stroke="var(--pink)" strokeWidth="0.5" opacity="0.4" />;
        })}
        {/* atoms */}
        {pts.map((p, i) => (
          <g key={p.label} className="atom-node" style={{ ['--ax' as string]: `${(i % 2 ? 1 : -1) * 1.5}px`, animationDelay: `${i * 0.3}s`, transformOrigin: `${p.x}px ${p.y}px` }}>
            <circle cx={p.x} cy={p.y} r="4" fill="var(--cyan)" opacity="0.9" style={{ filter: 'drop-shadow(0 0 4px var(--cyan))' }} />
            <circle cx={p.x} cy={p.y} r="6.5" fill="none" stroke="var(--cyan)" strokeWidth="0.35" opacity="0.5" />
            <text x={p.x} y={p.y - 8.5} fill="rgba(229,251,245,0.65)" fontSize="3.3"
              textAnchor="middle" fontFamily="JetBrains Mono, monospace">{p.label}</text>
          </g>
        ))}
        {/* core atom */}
        <circle cx="50" cy="50" r="7" fill="var(--pink)" opacity="0.25" />
        <circle cx="50" cy="50" r="3.4" fill="#fff" />
        <text x="50" y="50.5" fill="var(--cyan)" fontSize="3" textAnchor="middle" dominantBaseline="central" fontFamily="JetBrains Mono, monospace">Σ</text>
      </svg>
    </div>
  );
}

/* ============================================================================
   NANO MODULE — project card as a molecular assembly
   ============================================================================ */
function hashStr(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function NanoModule({ title, desc, tags, img, cat, index, nodes, href, repo }: {
  title: string; desc: string; tags: string[]; img: string; cat: string;
  index: number; nodes: string[]; href: string; repo: string;
}) {
  const h = useMemo(() => hashStr(title), [title]);
  const stability = 92 + (h % 8);
  const bonds = nodes.length + (h % 4);
  const formula = `C${8 + (h % 12)}H${10 + (h % 18)}${cat.startsWith('N') ? 'N' : 'O'}${1 + (h % 4)}`;

  return (
    <article className="nano-module group flex flex-col p-5">
      {/* header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Hexagon size={12} className="text-[var(--cyan)]" />
          <span className="font-mono2 text-[10px] tracking-[0.2em] text-[var(--cyan)]">
            NANO-{String(index).padStart(2, '0')}
          </span>
        </div>
        <span className="font-mono2 text-[9px] tracking-[0.18em] text-[var(--faint)]">{formula}</span>
      </div>

      <div className="flex gap-4 items-start">
        {/* mini atom */}
        <div className="shrink-0 hidden sm:block">
          <NanoAtom size={68} />
        </div>
        <div className="min-w-0">
          <h3 className="font-display font-bold text-[16px] leading-tight group-hover:text-[var(--cyan)] transition-colors duration-400">
            {title}
          </h3>
          <div className="font-mono2 text-[9px] tracking-[0.18em] text-[var(--faint)] mt-1 uppercase">{cat}</div>
        </div>
      </div>

      <p className="mt-3 text-[13px] text-[var(--dim)] leading-relaxed">{desc}</p>

      {/* bond diagram */}
      <div className="my-4 opacity-80 group-hover:opacity-100 transition-opacity duration-500">
        <BondDiagram nodes={nodes} />
        <div className="text-center font-mono2 text-[8px] tracking-[0.28em] text-[var(--faint)] -mt-1">
          MOLECULAR BOND STRUCTURE
        </div>
      </div>

      {/* nano telemetry */}
      <div className="grid grid-cols-3 gap-2.5 mb-4">
        {[
          { l: 'BONDS', v: String(bonds) },
          { l: 'STABILITY', v: `${stability}%` },
          { l: 'STATE', v: 'SOLID' },
        ].map((m) => (
          <div key={m.l} className="rounded-lg border border-[var(--line)] px-2.5 py-2 bg-[var(--bg-3)]/40">
            <div className="font-display text-[12px] font-bold text-[var(--txt)] leading-tight">{m.v}</div>
            <div className="font-mono2 text-[8px] tracking-[0.14em] text-[var(--faint)] mt-1">{m.l}</div>
          </div>
        ))}
      </div>

      {/* stability bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-mono2 text-[8.5px] tracking-[0.16em] text-[var(--faint)] flex items-center gap-1">
            <Activity size={9} className="text-[var(--cyan)]" /> STRUCTURAL INTEGRITY
          </span>
          <span className="font-display text-[10px] font-bold text-[var(--cyan)]">{stability}%</span>
        </div>
        <div className="nano-meter"><span style={{ width: `${stability}%` }} /></div>
      </div>

      {/* tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {tags.map((t) => (
          <span key={t} className="px-2 py-0.5 rounded-full font-mono2 text-[9px] tracking-[0.12em] uppercase border border-[var(--line)] text-[var(--cyan)]">
            {t}
          </span>
        ))}
      </div>

      {/* links */}
      <div className="flex gap-2 mt-auto">
        <a href={repo} target="_blank" rel="noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border border-[var(--line-strong)] font-head font-bold text-[10.5px] tracking-[0.14em] uppercase text-[var(--cyan)] hover:bg-[var(--cyan)] hover:text-black transition-all">
          <GitBranch size={12} /> Source
        </a>
        <a href={href}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border border-[var(--line)] font-head font-bold text-[10.5px] tracking-[0.14em] uppercase text-[var(--dim)] hover:border-[var(--pink)] hover:text-[var(--pink)] transition-all">
          Analyze <ArrowUpRight size={12} />
        </a>
      </div>

      <img src={img} alt="" aria-hidden="true" className="hidden" />
    </article>
  );
}

/* ============================================================================
   ATOMIC-ORBIT TRANSITION VEIL
   ============================================================================ */
export function AtomVeil({ phase }: { phase: 'idle' | 'in' | 'out' }) {
  if (phase === 'idle') return null;
  return (
    <div className="atom-veil" data-phase={phase} aria-hidden="true">
      <NanoAtom />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-mono2 text-[10px] tracking-[0.5em] text-[var(--cyan)] mt-40">ASSEMBLING</span>
      </div>
    </div>
  );
}

/* small inline badge */
export function NanoBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--line)] px-3.5 py-2 flex items-center gap-2.5 bg-[var(--panel)]">
      <Atom size={14} className="text-[var(--cyan)]" />
      <div>
        <div className="font-display font-bold text-[13px] leading-none text-[var(--txt)]">{value}</div>
        <div className="font-mono2 text-[8px] tracking-[0.18em] text-[var(--faint)] mt-1 uppercase">{label}</div>
      </div>
    </div>
  );
}
