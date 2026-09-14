import { useEffect, useMemo, useRef, useState } from 'react';
import { GitBranch, ArrowUpRight, Activity, Zap } from 'lucide-react';

/* ============================================================================
   PLASMA REACTOR SYSTEM
   Rotating energy cores · heatwave distortion · neon particle flows
   Reactor modules · circuit-trace visualisation
   ============================================================================ */

/** Filters + gradients, mounted once at app root. */
export function PlasmaDefs() {
  return (
    <svg aria-hidden="true" focusable="false" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
      <defs>
        {/* strong heatwave distortion */}
        <filter id="plasma-heat" x="-25%" y="-25%" width="150%" height="150%">
          <feTurbulence type="fractalNoise" baseFrequency="0.013 0.028" numOctaves="2" seed="9" result="noise">
            <animate
              attributeName="baseFrequency"
              dur="9s"
              values="0.011 0.024;0.019 0.04;0.011 0.024"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="7" xChannelSelector="R" yChannelSelector="G" />
        </filter>

        {/* subtle heatwave for text-bearing surfaces */}
        <filter id="plasma-heat-soft" x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="1" seed="3" result="noise2">
            <animate
              attributeName="baseFrequency"
              dur="12s"
              values="0.01 0.018;0.016 0.028;0.01 0.018"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise2" scale="2.5" xChannelSelector="R" yChannelSelector="G" />
        </filter>

        {/* plasma bloom */}
        <filter id="plasma-bloom" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}

/** Apply heatwave distortion to a visual (no critical text inside). */
export function HeatShimmer({ children, soft = false, className = '' }: {
  children: React.ReactNode; soft?: boolean; className?: string;
}) {
  return <div className={`${soft ? 'heat-shimmer-soft' : 'heat-shimmer'} ${className}`}>{children}</div>;
}

/* ============================================================================
   ROTATING ENERGY CORE
   ============================================================================ */
export function PlasmaCore({ size, className = '' }: { size?: number; className?: string }) {
  return (
    <div
      className={`plasma-core ${className}`}
      style={size ? { width: size, height: size } : undefined}
      aria-hidden="true"
    >
      {/* outer flare */}
      <div className="pcore-flare" style={{ inset: '-16%' }} />

      {/* containment rings — counter-rotating */}
      <div className="pcore-ring pcore-spin-a" style={{ inset: 0 }} />
      <div
        className="pcore-ring pcore-spin-b"
        style={{ inset: '11%', opacity: 0.85 }}
      />
      {/* segmented arc */}
      <div className="pcore-arc pcore-spin-c" style={{ inset: '21%', opacity: 0.9 }} />
      <div className="pcore-arc pcore-spin-a" style={{ inset: '31%', opacity: 0.55 }} />

      {/* orbiting sparks */}
      <div className="pcore-spin-b" style={{ position: 'absolute', inset: '4%' }}>
        <span className="pcore-spark" style={{ top: -2, left: '50%', marginLeft: -2.5 }} />
      </div>
      <div className="pcore-spin-c" style={{ position: 'absolute', inset: '17%' }}>
        <span
          className="pcore-spark"
          style={{ bottom: -2, left: '50%', marginLeft: -2, background: 'var(--pink)', boxShadow: '0 0 12px var(--pink), 0 0 26px var(--pink)' }}
        />
      </div>

      {/* the core itself */}
      <div
        className="pcore-orb"
        style={{
          width: '46%',
          height: '46%',
          boxShadow: '0 0 70px rgba(53,230,255,0.5), 0 0 140px rgba(106,75,255,0.28), inset 0 0 34px rgba(255,255,255,0.4)',
        }}
      />
    </div>
  );
}

/* ============================================================================
   NEON PARTICLE FLOW — particles streaming along circuit lanes
   ============================================================================ */
export function NeonFlow({ lanes = 7, className = '' }: { lanes?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 0, h = 0, raf = 0;
    type P = { lane: number; x: number; v: number; len: number; hue: string };
    let ps: P[] = [];

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ps = Array.from({ length: lanes * 5 }, () => ({
        lane: Math.floor(Math.random() * lanes),
        x: Math.random() * w,
        v: 40 + Math.random() * 130,
        len: 26 + Math.random() * 70,
        hue: Math.random() > 0.75 ? '#ff2bd6' : Math.random() > 0.35 ? '#35e6ff' : '#ffb347',
      }));
    };

    resize();
    let last = performance.now();
    const loop = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      ctx.clearRect(0, 0, w, h);
      const gap = h / (lanes + 1);

      ctx.lineWidth = 1;
      for (let i = 1; i <= lanes; i++) {
        const y = i * gap;
        ctx.strokeStyle = 'rgba(53,230,255,0.07)';
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      for (const p of ps) {
        const y = (p.lane + 1) * gap;
        p.x += p.v * dt;
        if (p.x - p.len > w) {
          p.x = -p.len - Math.random() * 160;
          p.lane = Math.floor(Math.random() * lanes);
        }
        const grad = ctx.createLinearGradient(p.x - p.len, y, p.x, y);
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        grad.addColorStop(1, p.hue);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.shadowColor = p.hue;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.moveTo(p.x - p.len, y);
        ctx.lineTo(p.x, y);
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(p.x, y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reduced) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [lanes]);

  return <canvas ref={ref} className={`w-full h-full ${className}`} aria-hidden="true" />;
}

/* ============================================================================
   REACTOR MODULE — project card with live animated performance metrics
   ============================================================================ */
function hashStr(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Three live gauges oscillating around deterministic baselines */
function useLiveMetrics(seed: string) {
  const bases = useMemo(() => {
    const h = hashStr(seed);
    return [58 + (h % 28), 62 + ((h >> 3) % 30), 92 + ((h >> 5) % 7)];
  }, [seed]);

  const [vals, setVals] = useState(bases);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVals(bases);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const e = (t - t0) / 1000;
      setVals([
        bases[0] + Math.sin(e * 0.55) * 5 + Math.sin(e * 1.7) * 2,
        bases[1] + Math.sin(e * 0.42 + 1.2) * 6 + Math.sin(e * 2.1) * 2,
        Math.min(99.9, bases[2] + Math.sin(e * 0.3 + 2.4) * 1.6),
      ]);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [bases]);

  return vals;
}

const METRIC_LABELS = ['CORE LOAD', 'THROUGHPUT', 'STABILITY'];

export function ReactorModule({ title, desc, tags, img, cat, index, href, repo }: {
  title: string; desc: string; tags: string[]; img: string; cat: string; index: number; href: string; repo: string;
}) {
  const vals = useLiveMetrics(title);
  const [load, thr, stab] = vals;

  return (
    <article className="reactor-module clip-cy group">
      {/* header strip */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--line)]">
        <div className="flex items-center gap-2.5">
          <span className="pulse-dot" />
          <span className="font-mono2 text-[10px] tracking-[0.22em] text-[var(--cyan)]">
            MODULE {String(index).padStart(2, '0')}
          </span>
        </div>
        <span className="font-mono2 text-[9px] tracking-[0.2em] text-[var(--faint)] uppercase">{cat}</span>
      </div>

      {/* body */}
      <div className="p-5 flex flex-col gap-4 flex-1">
        <div className="flex gap-4 items-start">
          {/* mini reactor core */}
          <div className="shrink-0 hidden sm:block">
            <PlasmaCore size={74} />
          </div>
          <div className="min-w-0">
            <h3 className="font-display font-bold text-[17px] leading-tight group-hover:text-[var(--cyan)] transition-colors duration-400">
              {title}
            </h3>
            <p className="mt-2 text-[13px] text-[var(--dim)] leading-relaxed">{desc}</p>
          </div>
        </div>

        {/* ---- live performance metrics ---- */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center gap-2 font-mono2 text-[9px] tracking-[0.2em] text-[var(--faint)]">
            <Activity size={11} className="text-[var(--cyan)]" /> LIVE TELEMETRY
          </div>
          {METRIC_LABELS.map((label, i) => {
            const v = vals[i];
            const warn = label !== 'STABILITY' && v > 88;
            return (
              <div key={label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono2 text-[9px] tracking-[0.16em] text-[var(--dim)] uppercase">{label}</span>
                  <span className={`font-display text-[11px] font-bold ${warn ? 'text-[var(--yellow)]' : 'text-[var(--cyan)]'}`}>
                    {v.toFixed(1)}%
                  </span>
                </div>
                <div className="meter-track">
                  <div
                    className={`meter-fill ${warn ? 'warn' : ''}`}
                    style={{ width: `${Math.max(4, Math.min(100, v))}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* specs row */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {[
            { l: 'OUTPUT', v: `${Math.round(thr * 12)} ops/s` },
            { l: 'UPTIME', v: `${stab.toFixed(2)}%` },
            { l: 'STATE', v: load > 85 ? 'PEAK' : 'NOMINAL' },
          ].map((m) => (
            <div key={m.l} className="plasma-chip clip-cy-sm px-2.5 py-2">
              <div className="font-display text-[11.5px] font-bold text-[var(--txt)] leading-tight">{m.v}</div>
              <div className="font-mono2 text-[8px] tracking-[0.16em] text-[var(--faint)] mt-1">{m.l}</div>
            </div>
          ))}
        </div>

        {/* tags */}
        <div className="flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <span key={t} className="px-2 py-0.5 clip-tag font-mono2 text-[9px] tracking-[0.12em] uppercase border border-[var(--line)] text-[var(--cyan)]">
              {t}
            </span>
          ))}
        </div>

        {/* links */}
        <div className="flex gap-2 pt-1 mt-auto">
          <a
            href={repo}
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 clip-tag border border-[var(--line-strong)] font-head font-bold text-[10.5px] tracking-[0.14em] uppercase text-[var(--cyan)] hover:bg-[var(--cyan)] hover:text-black transition-all"
          >
            <GitBranch size={12} /> Source
          </a>
          <a
            href={href}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 clip-tag border border-[var(--line)] font-head font-bold text-[10.5px] tracking-[0.14em] uppercase text-[var(--dim)] hover:border-[var(--pink)] hover:text-[var(--pink)] transition-all"
          >
            Inspect <ArrowUpRight size={12} />
          </a>
        </div>
      </div>

      <img src={img} alt="" aria-hidden="true" className="hidden" />
    </article>
  );
}

/* ============================================================================
   CIRCUIT TRACE — visualises the codebase as an energy circuit
   Used inside the AI assistant
   ============================================================================ */
const CIRCUIT_NODES = [
  { id: 'n1', label: 'KOTLIN', x: 13, y: 24 },
  { id: 'n2', label: 'COMPOSE', x: 13, y: 76 },
  { id: 'n3', label: 'ARCH', x: 50, y: 50 },
  { id: 'n4', label: 'FIREBASE', x: 87, y: 24 },
  { id: 'n5', label: 'CI/CD', x: 87, y: 76 },
];

const CIRCUIT_LINKS: [number, number][] = [[0, 2], [1, 2], [2, 3], [2, 4], [0, 1], [3, 4]];

export function CircuitTrace({ active = false, className = '' }: { active?: boolean; className?: string }) {
  return (
    <div className={`plasma-chip clip-cy-sm p-2 ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-[92px]" aria-hidden="true">
        {/* board traces */}
        {CIRCUIT_LINKS.map(([a, b], i) => {
          const p1 = CIRCUIT_NODES[a];
          const p2 = CIRCUIT_NODES[b];
          return (
            <g key={i}>
              <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="rgba(53,230,255,0.22)" strokeWidth="0.7" />
              <line
                className="circuit-pulse"
                x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                stroke="var(--cyan)" strokeWidth="1.1"
                style={{ animationDuration: active ? '0.85s' : '2.1s' }}
              />
            </g>
          );
        })}

        {/* nodes */}
        {CIRCUIT_NODES.map((n) => (
          <g key={n.id}>
            <circle
              className="circuit-node"
              cx={n.x} cy={n.y} r={n.id === 'n3' ? 5 : 3.4}
              fill={n.id === 'n3' ? 'var(--pink)' : 'var(--cyan)'}
              style={{ animationDelay: `${CIRCUIT_NODES.indexOf(n) * 0.35}s` }}
            />
            <text
              x={n.x} y={n.y + (n.y > 50 ? 9 : -8)}
              fill="rgba(234,249,255,0.6)" fontSize="4.2"
              textAnchor="middle" fontFamily="JetBrains Mono, monospace" letterSpacing="0.2"
            >
              {n.label}
            </text>
          </g>
        ))}

        {/* central chip glow */}
        <circle cx="50" cy="50" r="9" fill="none" stroke="rgba(255,43,214,0.28)" strokeWidth="0.5" />
      </svg>
    </div>
  );
}

/* Small energy badge used inline (e.g. hero stats) */
export function EnergyBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="plasma-chip clip-cy-sm px-3.5 py-2 flex items-center gap-2.5">
      <Zap size={13} className="text-[var(--cyan)]" />
      <div>
        <div className="font-display font-bold text-[13px] leading-none text-[var(--txt)]">{value}</div>
        <div className="font-mono2 text-[8px] tracking-[0.18em] text-[var(--faint)] mt-1 uppercase">{label}</div>
      </div>
    </div>
  );
}
