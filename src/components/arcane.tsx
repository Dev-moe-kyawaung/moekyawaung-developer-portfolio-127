import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { X, Send, Sparkles, RotateCcw, Radio } from 'lucide-react';
import { RUNES, ALL_INTENTS, FAM_GREETING, FAM_GREETING_MINIMAL, FAM_GREETING_PLASMA, FAM_GREETING_WARP, FAM_GREETING_NANO, FAM_GREETING_VELVET, FAM_GREETING_NEURAL, FAM_FALLBACK, FAM_SUGGESTIONS } from '../arcane';
import { CircuitTrace } from './plasma';
import { NanoAtom } from './nano';

/* ============================================================================
   GLYPH RAIN — Elder Futhark runes drifting up through the void
   ============================================================================ */
export function GlyphRain({ count = 16 }: { count?: number }) {
  const glyphs = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        ch: RUNES[Math.floor(Math.random() * RUNES.length)],
        left: Math.random() * 100,
        size: 12 + Math.random() * 22,
        dur: 16 + Math.random() * 22,
        delay: -Math.random() * 30,
        hue: Math.random() > 0.72 ? 'var(--yellow)' : Math.random() > 0.4 ? 'var(--cyan)' : 'var(--pink)',
      })).map((g, i) => ({ ...g, id: i })),
    [count]
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {glyphs.map((g) => (
        <span
          key={g.id}
          className="glyph-float"
          style={{
            left: `${g.left}%`,
            bottom: '-8vh',
            fontSize: g.size,
            color: g.hue,
            animationDuration: `${g.dur}s`,
            animationDelay: `${g.delay}s`,
            opacity: 0.5,
          }}
        >
          {g.ch}
        </span>
      ))}
    </div>
  );
}

/* ============================================================================
   SPELL CIRCLE — concentric rotating rune ring (SVG)
   ============================================================================ */
export function SpellCircle({ size = 340, opacity = 0.5, className = '' }: {
  size?: number; opacity?: number; className?: string;
}) {
  const ring1 = useMemo(() => RUNES.slice(0, 12), []);
  const ring2 = useMemo(() => RUNES.slice(12), []);
  const R1 = 44, R2 = 34;

  return (
    <div className={`spell-circle ${className}`} style={{ width: size, height: size, opacity }} aria-hidden="true">
      <svg viewBox="0 0 100 100">
        {/* outer rune ring — counter-rotating */}
        <g className="sc-spin-slow">
          <circle cx="50" cy="50" r="47" fill="none" stroke="var(--yellow)" strokeWidth="0.4" opacity="0.55" />
          <circle cx="50" cy="50" r="46" fill="none" stroke="var(--line-strong)" strokeWidth="0.2" strokeDasharray="1 3" />
          {ring1.map((r, i) => {
            const a = (i / ring1.length) * Math.PI * 2 - Math.PI / 2;
            return (
              <text
                key={r + i}
                x={50 + Math.cos(a) * R1}
                y={50 + Math.sin(a) * R1}
                fill="var(--yellow)"
                fontSize="4.4"
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily="Cinzel, serif"
                transform={`rotate(${(a * 180) / Math.PI + 90} ${50 + Math.cos(a) * R1} ${50 + Math.sin(a) * R1})`}
              >
                {r}
              </text>
            );
          })}
        </g>

        {/* inner rune ring */}
        <g className="sc-spin-med">
          <circle cx="50" cy="50" r="29" fill="none" stroke="var(--cyan)" strokeWidth="0.35" opacity="0.6" />
          <polygon
            points="50,22 74,63 26,63"
            fill="none" stroke="var(--cyan)" strokeWidth="0.35" opacity="0.5"
          />
          <polygon
            points="50,78 26,37 74,37"
            fill="none" stroke="var(--pink)" strokeWidth="0.35" opacity="0.45"
          />
          {ring2.map((r, i) => {
            const a = (i / ring2.length) * Math.PI * 2 - Math.PI / 2;
            return (
              <text
                key={r + i}
                x={50 + Math.cos(a) * R2}
                y={50 + Math.sin(a) * R2}
                fill="var(--cyan)"
                fontSize="3.6"
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily="Cinzel, serif"
                transform={`rotate(${(a * 180) / Math.PI + 90} ${50 + Math.cos(a) * R2} ${50 + Math.sin(a) * R2})`}
              >
                {r}
              </text>
            );
          })}
        </g>

        {/* the still heart */}
        <g className="sc-spin-fast">
          <circle cx="50" cy="50" r="17" fill="none" stroke="var(--violet)" strokeWidth="0.3" strokeDasharray="2 2" opacity="0.7" />
          <circle cx="50" cy="50" r="11" fill="none" stroke="var(--yellow)" strokeWidth="0.5" opacity="0.6" />
          <path d="M50 39 L54 50 L50 61 L46 50 Z" fill="var(--yellow)" opacity="0.5" />
        </g>
      </svg>
    </div>
  );
}

/* ============================================================================
   SIGIL — small inline rune badge with glow
   ============================================================================ */
export function Sigil({ rune, size = 40, color = 'var(--yellow)', label }: {
  rune: string; size?: number; color?: string; label?: string;
}) {
  return (
    <span
      className="sigil-wrap relative inline-flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
      title={label}
      aria-label={label || `Sigil ${rune}`}
    >
      <svg viewBox="0 0 40 40" className="absolute inset-0 w-full h-full">
        <circle cx="20" cy="20" r="18" fill="none" stroke={color} strokeWidth="0.9" opacity="0.5" />
        <circle cx="20" cy="20" r="15" fill="none" stroke={color} strokeWidth="0.4" strokeDasharray="1.6 2.4" opacity="0.7" />
        <path d="M20 2 L20 8 M20 32 L20 38 M2 20 L8 20 M32 20 L38 20" stroke={color} strokeWidth="0.7" opacity="0.55" />
      </svg>
      <span
        className="relative font-rune font-bold candle"
        style={{ color, fontSize: size * 0.38, textShadow: `0 0 12px ${color}` }}
      >
        {rune}
      </span>
    </span>
  );
}

/* ============================================================================
   ARCANE DIAGRAM — animated architecture sigil for spellbooks
   ============================================================================ */
export function ArcaneDiagram({ nodes, color = 'var(--yellow)' }: { nodes: string[]; color?: string }) {
  const n = nodes.length;
  const radius = 34;
  return (
    <div className="relative w-full aspect-square max-w-[168px] mx-auto" aria-hidden="true">
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
        {/* orbit rings */}
        <circle cx="50" cy="50" r={radius + 9} fill="none" stroke={color} strokeWidth="0.3" strokeDasharray="1.5 3" opacity="0.5" />
        <circle cx="50" cy="50" r={radius} fill="none" stroke={color} strokeWidth="0.35" opacity="0.55" />

        {/* connecting leylines */}
        {nodes.map((_, i) => {
          const a = (i / n) * Math.PI * 2 - Math.PI / 2;
          const x = 50 + Math.cos(a) * radius;
          const y = 50 + Math.sin(a) * radius;
          return <line key={i} x1="50" y1="50" x2={x} y2={y} stroke={color} strokeWidth="0.3" opacity="0.35" />;
        })}

        {/* orbiting nodes */}
        <g className="diagram-orbit">
          {nodes.map((label, i) => {
            const a = (i / n) * Math.PI * 2 - Math.PI / 2;
            const x = 50 + Math.cos(a) * radius;
            const y = 50 + Math.sin(a) * radius;
            return (
              <g key={label}>
                <circle className="diagram-node" cx={x} cy={y} r="3.6" fill={color} opacity="0.7" />
                <text
                  x={x} y={y} fill="var(--txt)" fontSize="3.5"
                  textAnchor="middle" dominantBaseline="central"
                  fontFamily="JetBrains Mono, monospace" letterSpacing="0.2"
                >
                  {label}
                </text>
              </g>
            );
          })}
        </g>

        {/* the core */}
        <circle cx="50" cy="50" r="9" fill="none" stroke={color} strokeWidth="0.5" opacity="0.8" />
        <circle cx="50" cy="50" r="4.5" fill={color} opacity="0.25" className="diagram-node" />
        <text x="50" y="50.6" fill={color} fontSize="5" textAnchor="middle" dominantBaseline="central" fontFamily="Cinzel, serif">ᛗ</text>
      </svg>
    </div>
  );
}

/* ============================================================================
   SPELLBOOK CARD — project as a bound grimoire
   ============================================================================ */
export function SpellbookCard({
  title, desc, tags, img, diagram, rune, accent = 'var(--yellow)', repo, href, badge, children,
}: {
  title: string; desc: string; tags: string[]; img: string; diagram: string[];
  rune: string; accent?: string; repo?: string; href?: string; badge?: string; children?: ReactNode;
}) {
  return (
    <article className="spellbook flex flex-col group">
      {/* fore-edge illustration */}
      <div className="relative h-40 overflow-hidden border-b border-[var(--line)] ml-[11px]">
        <img
          src={img} alt={`${title} plate`} loading="lazy"
          className="w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-110"
          style={{ filter: 'saturate(0.75) contrast(1.05)' }}
        />
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 20%, var(--bg) 100%), radial-gradient(circle at 70% 30%, ${accent}22, transparent 60%)` }} />
        <span
          className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 clip-tag font-rune text-[10px] tracking-[0.2em]"
          style={{ color: accent, border: `1px solid ${accent}88`, background: 'rgba(10,7,20,0.72)' }}
        >
          <span className="candle">{rune}</span> {badge}
        </span>
      </div>

      <div className="p-5 pl-6 flex flex-col gap-3 flex-1">
        <h3 className="font-display font-bold text-lg leading-tight">{title}</h3>
        <p className="text-[13.5px] text-[var(--dim)] leading-relaxed flex-1 font-serif2">{desc}</p>

        {/* the arcane diagram */}
        <div className="py-1 -my-1 opacity-80 group-hover:opacity-100 transition-opacity duration-500">
          <ArcaneDiagram nodes={diagram} color={accent} />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <span key={t} className="px-2 py-0.5 font-mono2 text-[9px] tracking-[0.12em] uppercase border border-[var(--line)] text-[var(--dim)]">
              {t}
            </span>
          ))}
        </div>

        {children}

        <div className="flex gap-2 pt-1">
          {repo && (
            <a href={repo} target="_blank" rel="noreferrer"
              className="flex-1 text-center px-3 py-2.5 clip-tag border font-head font-bold text-[10.5px] tracking-[0.14em] uppercase transition-all"
              style={{ borderColor: `${accent}66`, color: accent }}>
              Open Tome
            </a>
          )}
          {href && (
            <a href={href}
              className="flex-1 text-center px-3 py-2.5 clip-tag border border-[var(--line)] font-head font-bold text-[10.5px] tracking-[0.14em] uppercase text-[var(--dim)] hover:border-[var(--pink)] hover:text-[var(--pink)] transition-all">
              Read Spell
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

/* ============================================================================
   RUNIX — the digital familiar
   Local intent-matching assistant. No network, no API.
   ============================================================================ */
interface Msg { role: 'fam' | 'user'; text: string; title?: string; runes?: string; follow?: string[]; }

function consult(q: string): Msg {
  const s = q.toLowerCase().trim();
  if (!s) return { role: 'fam', text: FAM_FALLBACK };

  let best: { intent: (typeof ALL_INTENTS)[number]; score: number } | null = null;
  for (const intent of ALL_INTENTS) {
    let score = 0;
    for (const k of intent.keys) {
      if (s.includes(k)) score += k.length; // longer matches weigh more
    }
    if (score > 0 && (!best || score > best.score)) best = { intent, score };
  }

  if (!best) return { role: 'fam', text: FAM_FALLBACK, follow: FAM_SUGGESTIONS.slice(0, 3) };
  return {
    role: 'fam',
    title: best.intent.title,
    runes: best.intent.runes,
    text: best.intent.answer,
    follow: best.intent.follow,
  };
}

export function Familiar({ minimal = false, plasma = false, warp = false, nano = false, velvet = false, neural = false }: { minimal?: boolean; plasma?: boolean; warp?: boolean; nano?: boolean; velvet?: boolean; neural?: boolean }) {
  const greeting = neural ? FAM_GREETING_NEURAL : velvet ? FAM_GREETING_VELVET : nano ? FAM_GREETING_NANO : warp ? FAM_GREETING_WARP : plasma ? FAM_GREETING_PLASMA : minimal ? FAM_GREETING_MINIMAL : FAM_GREETING;
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ role: 'fam', text: greeting }]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [unread, setUnread] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  /* re-greet when the realm changes */
  useEffect(() => {
    setMsgs([{ role: 'fam', text: greeting }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minimal, plasma, warp, nano, velvet, neural]);

  /* keep the transcript pinned to the newest line */
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, thinking, open]);

  const ask = (raw?: string) => {
    const q = (raw ?? input).trim();
    if (!q || thinking) return;
    setMsgs((p) => [...p, { role: 'user', text: q }]);
    setInput('');
    setThinking(true);
    /* the familiar deliberates */
    setTimeout(() => {
      setMsgs((p) => [...p, consult(q)]);
      setThinking(false);
    }, 620 + Math.random() * 420);
  };

  const reset = () => {
    setMsgs([{ role: 'fam', text: greeting }]);
    setInput('');
  };

  return (
    <>
      {/* ---- summoning orb / quiet advisor node ---- */}
      <button
        onClick={() => { setOpen((p) => !p); setUnread(false); }}
        aria-label={open ? 'Dismiss the advisor' : 'Consult the architecture advisor'}
        aria-expanded={open}
        className="fixed bottom-6 right-6 z-[95] group"
      >
        {neural ? (
          <span
            className="relative block w-14 h-14 rounded-full border border-[var(--line-strong)] bg-[#020617]/95 flex items-center justify-center transition-transform duration-500 group-hover:scale-105"
            style={{ boxShadow: '0 0 0 6px rgba(6,182,212,0.06), 0 24px 60px -20px rgba(6,182,212,0.55)' }}
          >
            <span className="absolute inset-[-7px] rounded-full border border-[rgba(6,182,212,0.25)]" aria-hidden="true" />
            <span className="relative flex items-center justify-center w-6 h-6">
              <span className="absolute w-2.5 h-2.5 rounded-full bg-[var(--cyan)] synapse-pulse" />
              <span className="absolute inset-[-4px] rounded-full border border-[var(--cyan)]" />
            </span>
          </span>
        ) : velvet ? (
          <span
            className="relative block w-14 h-14 rounded-full border border-[var(--line-strong)] bg-[#170b11]/95 flex items-center justify-center transition-transform duration-500 group-hover:scale-105"
            style={{ boxShadow: '0 0 0 6px rgba(224,185,115,0.06), 0 24px 60px -20px rgba(224,185,115,0.55)' }}
          >
            <span className="absolute inset-[-7px] rounded-full border border-[rgba(224,185,115,0.25)]" aria-hidden="true" />
            <span className="text-[26px] leading-none text-[var(--yellow)]" style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>M</span>
          </span>
        ) : nano ? (
          <span className="relative block w-14 h-14 rounded-full border border-[var(--line-strong)] bg-[#061417]/95 flex items-center justify-center transition-transform duration-500 group-hover:scale-105" style={{ boxShadow: 'var(--glow-c)' }}>
            <NanoAtom size={54} />
          </span>
        ) : warp ? (
          <span className="relative block w-14 h-14 rounded-full border border-[var(--line-strong)] bg-[#040816]/95 flex items-center justify-center transition-transform duration-500 group-hover:scale-105" style={{ boxShadow: 'var(--glow-c)' }}>
            {/* two orbital satellites */}
            <span className="absolute inset-[-6px] rounded-full border border-[var(--line)] orbit-spin" style={{ animationDuration: '8s' }} aria-hidden="true">
              <span className="absolute top-0 left-1/2 w-1.5 h-1.5 -ml-[3px] rounded-full bg-[var(--cyan)]" style={{ boxShadow: '0 0 8px var(--cyan)' }} />
            </span>
            <span className="absolute inset-[-6px] rounded-full orbit-spin" style={{ animationDuration: '5s', animationDirection: 'reverse' }} aria-hidden="true">
              <span className="absolute bottom-0 left-1/2 w-1 h-1 -ml-0.5 rounded-full bg-[var(--pink)]" style={{ boxShadow: '0 0 8px var(--pink)' }} />
            </span>
            <Radio size={18} className="text-[var(--cyan)]" />
          </span>
        ) : minimal ? (
          <>
            <span className="relative block w-12 h-12 rounded-full border border-white/20 bg-[#0a0a0e]/90 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
              {/* slow gravitational satellite */}
              <span className="absolute inset-[-9px] rounded-full border border-white/10 grav-orbit" style={{ animationDuration: '11s' }} aria-hidden="true">
                <span className="absolute top-0 left-1/2 w-1 h-1 -ml-0.5 rounded-full bg-white/60" />
              </span>
              <span className="w-2 h-2 rounded-full bg-white/85" />
            </span>
          </>
        ) : (
          <>
            <span className="familiar-halo" aria-hidden="true" />
            <span className="familiar-orb flex items-center justify-center">
              <Sparkles size={22} className="text-[#fff6de] drop-shadow-[0_0_8px_rgba(255,240,200,0.9)]" />
            </span>
            {/* speech ping */}
            <span className="absolute -top-1 -left-1 font-rune text-[13px] text-[var(--yellow)] candle" aria-hidden="true">ᛝ</span>
          </>
        )}
        {unread && !open && (
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[var(--pink)] border-2 border-[var(--bg)] animate-pulse" />
        )}
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap px-3 py-1.5 clip-tag border border-[var(--line-strong)] bg-[var(--bg-2)] font-mono2 text-[9px] tracking-[0.2em] text-[var(--yellow)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
           {neural ? 'COGNITIVE LINK' : velvet ? 'CONCIERGE' : nano ? 'SCAN STRUCTURE' : warp ? 'SHIP COMPUTER' : plasma ? 'TRACE CIRCUIT' : minimal ? 'ASK AURA' : 'ASK RUNIX'}
        </span>
      </button>

      {/* ---- the familiar's presence ---- */}
      <div className="familiar-panel" data-open={open} role="dialog" aria-label="RUNIX — digital familiar" aria-modal="false">
        {/* header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--line)] shrink-0">
          {neural ? (
            <span className="relative w-9 h-9 shrink-0 rounded-full border border-[var(--line-strong)] flex items-center justify-center text-[var(--cyan)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--cyan)] synapse-pulse" />
            </span>
          ) : velvet ? (
            <span
              className="relative w-9 h-9 shrink-0 rounded-full border border-[var(--line-strong)] flex items-center justify-center text-[var(--yellow)]"
              style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 18 }}
            >
              M
            </span>
          ) : nano ? (
            <span className="relative w-9 h-9 shrink-0 flex items-center justify-center">
              <NanoAtom size={40} />
            </span>
          ) : warp ? (
            <span className="relative w-9 h-9 shrink-0 flex items-center justify-center rounded-full border border-[var(--line-strong)]">
              <span className="absolute inset-[-4px] rounded-full border border-[var(--line)] orbit-spin" style={{ animationDuration: '7s' }} aria-hidden="true">
                <span className="absolute top-0 left-1/2 w-1.5 h-1.5 -ml-[3px] rounded-full bg-[var(--cyan)]" style={{ boxShadow: '0 0 8px var(--cyan)' }} />
              </span>
              <Radio size={14} className="text-[var(--cyan)]" />
            </span>
          ) : plasma ? (
            <span className="relative w-9 h-9 shrink-0 flex items-center justify-center">
              <span className="pcore-ring pcore-spin-a" style={{ position: 'absolute', inset: 0 }} />
              <span
                className="pcore-orb"
                style={{ width: 18, height: 18, boxShadow: '0 0 16px rgba(53,230,255,0.7), inset 0 0 8px rgba(255,255,255,0.5)' }}
              />
            </span>
          ) : minimal ? (
            <span className="relative w-9 h-9 shrink-0 rounded-full border border-white/20 flex items-center justify-center">
              <span className="absolute inset-[-5px] rounded-full border border-white/10 grav-orbit" style={{ animationDuration: '9s' }} aria-hidden="true">
                <span className="absolute top-0 left-1/2 w-[3px] h-[3px] -ml-[1.5px] rounded-full bg-white/60" />
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/85" />
            </span>
          ) : (
            <span className="relative w-9 h-9 shrink-0">
              <span className="familiar-halo" style={{ inset: '-4px' }} aria-hidden="true" />
              <span className="familiar-orb !w-9 !h-9 !shadow-none" style={{ animation: 'none' }}>
                <Sparkles size={14} className="text-[#fff6de]" />
              </span>
            </span>
          )}
            <div className="min-w-0 flex-1">
            <div className="font-display font-bold text-sm tracking-wider">{neural ? 'COGNIS' : velvet ? 'CONCIERGE' : nano ? 'NANO-1' : warp ? 'HELM' : plasma ? 'CORE' : minimal ? 'AURA' : 'RUNIX'}</div>
            <div className="font-mono2 text-[9px] tracking-[0.18em] text-[var(--faint)] flex items-center gap-1.5">
              <span className="pulse-dot" /> {neural ? 'COGNITIVE CORE · SYNAPSE ROUTER' : velvet ? 'PRIVATE CONCIERGE · AT YOUR SERVICE' : nano ? 'NANO-BOT · MOLECULAR ANALYST' : warp ? 'SHIP COMPUTER · NAVIGATION AI' : plasma ? 'ENERGY CIRCUIT TRACER' : minimal ? 'ARCHITECTURE ADVISOR · OFFLINE REASONING' : 'DIGITAL FAMILIAR · BOUND LOCALLY'}
            </div>
          </div>
          <button onClick={reset} aria-label="Reset conversation" className="w-8 h-8 flex items-center justify-center border border-[var(--line)] clip-cy-sm text-[var(--faint)] hover:text-[var(--yellow)] hover:border-[var(--yellow)] transition-all">
            <RotateCcw size={13} />
          </button>
          <button onClick={() => setOpen(false)} aria-label="Close familiar" className="w-8 h-8 flex items-center justify-center border border-[var(--line)] clip-cy-sm text-[var(--faint)] hover:text-[var(--pink)] hover:border-[var(--pink)] transition-all">
            <X size={14} />
          </button>
        </div>

        {/* circuit visualisation — the codebase as an energy circuit */}
        {plasma && (
          <div className="px-5 pt-4 shrink-0">
            <div className="flex items-center justify-between mb-2 font-mono2 text-[9px] tracking-[0.2em] text-[var(--faint)]">
              <span>ENERGY CIRCUIT</span>
              <span className={thinking ? 'text-[var(--cyan)]' : ''}>{thinking ? 'TRACING…' : 'STABLE'}</span>
            </div>
            <CircuitTrace active={thinking} />
          </div>
        )}

        {/* transcript */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4" aria-live="polite">
          {msgs.map((m, i) => (
            <div key={i} className={m.role === 'user' ? 'flex justify-end' : ''}>
              {m.role === 'user' ? (
                <p className="fam-msg-user max-w-[85%] px-3.5 py-2.5 clip-tag bg-[var(--cyan-soft)] border border-[var(--line)] text-[var(--txt)]">
                  {m.text}
                </p>
              ) : (
                <div className="max-w-[92%]">
                  {m.runes && !minimal && !velvet && (
                    <div className="font-rune text-[11px] tracking-[0.4em] text-[var(--yellow)] mb-1.5 candle">{m.runes}</div>
                  )}
                  {m.title && (
                    <div className="font-display font-bold text-[13px] tracking-wide text-[var(--yellow)] mb-1.5">{m.title}</div>
                  )}
                  <p className="fam-msg text-[var(--dim)] pl-3 border-l-2" style={{ borderColor: 'var(--line-strong)' }}>
                    {m.text}
                  </p>
                  {m.follow && m.follow.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {m.follow.map((f) => (
                        <button
                          key={f}
                          onClick={() => ask(f)}
                          className="px-2.5 py-1 clip-tag border border-[var(--line)] font-mono2 text-[9px] tracking-[0.1em] uppercase text-[var(--cyan)] hover:border-[var(--cyan)] hover:bg-[var(--cyan-soft)] transition-all"
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {thinking && (
            <div className="flex items-center gap-2.5 pl-3" aria-label="The familiar is considering">
              <span className="flex gap-1">
                <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
              </span>
              <span className="font-mono2 text-[9px] tracking-[0.2em] text-[var(--faint)]">{neural ? 'COGNITIVE RETRIEVAL IN PROGRESS…' : velvet ? 'ONE MOMENT, PLEASE…' : minimal ? 'REASONING…' : plasma ? 'TRACING CIRCUIT…' : warp ? 'PLOTTING COURSE…' : nano ? 'SCANNING BONDS…' : 'CONSULTING THE GRIMOIRE…'}</span>
            </div>
          )}
        </div>

        {/* suggestions */}
        <div className="px-5 pb-2 shrink-0">
          <div className="flex gap-1.5 overflow-x-auto pb-1.5" style={{ scrollbarWidth: 'thin' }}>
            {FAM_SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => ask(s)}
                className="shrink-0 px-2.5 py-1 clip-tag border border-[var(--line)] font-mono2 text-[9px] tracking-[0.08em] text-[var(--faint)] hover:text-[var(--yellow)] hover:border-[var(--yellow)] transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* inscription bar */}
        <form
          onSubmit={(e) => { e.preventDefault(); ask(); }}
          className="flex gap-2 px-5 py-4 border-t border-[var(--line)] shrink-0"
        >
          <label htmlFor="fam-in" className="sr-only">Ask the familiar</label>
          <input
            id="fam-in"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask of the craft…"
            className="field !py-2.5 flex-1 !text-[15px]"
            autoComplete="off"
          />
          <button
            type="submit"
            aria-label="Send question"
            disabled={!input.trim() || thinking}
            className="btn btn-primary clip-cy-sm !px-4 !py-2.5 !text-[11px] disabled:opacity-40 disabled:pointer-events-none"
          >
            <Send size={14} />
          </button>
        </form>
      </div>
    </>
  );
}

/* ============================================================================
   SPELL VEIL — route transition that draws a summoning circle
   ============================================================================ */
export function SpellVeil({ phase, minimal = false }: { phase: 'idle' | 'in' | 'out'; minimal?: boolean }) {
  if (phase === 'idle') return null;

  /* dark energy: a single expanding hairline, no ornament */
  if (minimal) {
    return (
      <div className="spell-veil" data-phase={phase} aria-hidden="true">
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.35" />
          <circle cx="50" cy="50" r="27" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="0.25" />
          <circle cx="50" cy="50" r="1" fill="rgba(255,255,255,0.7)" />
        </svg>
        <span className="absolute font-mono2 text-[11px] tracking-[0.5em] text-white/55">MKA · 2026</span>
      </div>
    );
  }

  return (
    <div className="spell-veil" data-phase={phase} aria-hidden="true">
      <SpellCircle size={440} opacity={0.92} />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="veil-glyph font-rune text-lg sm:text-2xl">ᛊ ᛈ ᛖ ᛚ ᛚ</span>
      </div>
    </div>
  );
}
