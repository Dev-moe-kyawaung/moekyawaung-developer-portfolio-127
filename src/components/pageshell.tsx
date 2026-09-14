import type { ReactNode } from 'react';
import { ChevronRight, Zap } from 'lucide-react';
import { Link } from '../lib/router';
import { PAGE_META } from '../content';
import { Reveal } from './ui';

/* ============================================================
   PAGE SHELL — banner, breadcrumb and framed body for sub-pages
   ============================================================ */
export function PageShell({ route, children, wide = false }: {
  route: string; children: ReactNode; wide?: boolean;
}) {
  const meta = PAGE_META[route] ?? { title: route, kicker: 'SECTION', desc: '' };
  return (
    <>
      {/* ---- page banner ---- */}
      <header className="relative pt-32 pb-14 md:pt-40 md:pb-20 overflow-hidden border-b border-[var(--line)]">
        <div className="absolute inset-0 -z-[1]"
          style={{ background: 'radial-gradient(ellipse 70% 90% at 15% 0%, var(--cyan-soft), transparent 65%), radial-gradient(ellipse 55% 80% at 95% 100%, var(--pink-soft), transparent 60%)' }} />
        <div className="grid-bg opacity-70" />

        <div className={`relative mx-auto ${wide ? 'max-w-[1600px]' : 'max-w-[1440px]'} px-5 lg:px-10`}>
          {/* breadcrumb */}
          <Reveal>
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono2 text-[10px] tracking-[0.2em] text-[var(--faint)] mb-6">
              <Link to="" className="hover:text-[var(--cyan)] transition-colors flex items-center gap-1.5">
                <Zap size={11} className="text-[var(--cyan)]" /> HOME
              </Link>
              <ChevronRight size={11} className="opacity-50" />
              <span className="text-[var(--cyan)] uppercase">{meta.title}</span>
            </nav>
          </Reveal>

          <Reveal delay={80}>
            <p className="kicker mb-3"><span className="kicker-line" />{meta.kicker}</p>
          </Reveal>
          <Reveal delay={160}>
            <h1 className="font-display font-black uppercase leading-[0.95] text-[clamp(2rem,5.5vw,4rem)]">
              <span className="grad-text">{meta.title}</span>
            </h1>
          </Reveal>
          {meta.desc && (
            <Reveal delay={240}>
              <p className="mt-5 max-w-2xl text-[var(--dim)] leading-relaxed">{meta.desc}</p>
            </Reveal>
          )}
        </div>
      </header>

      {/* ---- page body ---- */}
      <div className={`mx-auto ${wide ? 'max-w-[1600px]' : 'max-w-[1440px]'} px-5 lg:px-10 py-16 md:py-24`}>
        {children}
      </div>
    </>
  );
}

/* ---------- reusable building blocks ---------- */

/** Standard sub-heading used inside pages */
export function BlockTitle({ children, note }: { children: ReactNode; note?: string }) {
  return (
    <Reveal>
      <div className="flex flex-wrap items-baseline justify-between gap-3 mb-8 mt-16 first:mt-0">
        <h2 className="font-display font-bold text-xl sm:text-2xl uppercase tracking-wide flex items-center gap-4">
          <span className="kicker-line" />
          {children}
        </h2>
        {note && <span className="font-mono2 text-[10px] tracking-[0.2em] text-[var(--faint)]">{note}</span>}
      </div>
    </Reveal>
  );
}

/** Metric call-out card with before → after comparison */
export function MetricCard({ label, before, after, delta }: {
  label: string; before: string; after: string; delta: string;
}) {
  const positive = !delta.startsWith('+') || label.toLowerCase().includes('completion') || label.toLowerCase().includes('opt-in');
  return (
    <div className="cyber-card clip-cy-sm p-5 sweep">
      <div className="font-mono2 text-[9px] tracking-[0.2em] text-[var(--faint)] uppercase">{label}</div>
      <div className="mt-3 flex items-center gap-3 font-display font-bold">
        <span className="text-sm text-[var(--faint)] line-through decoration-[var(--pink)]/60">{before}</span>
        <ChevronRight size={14} className="text-[var(--faint)]" />
        <span className="text-2xl text-[var(--cyan)]">{after}</span>
      </div>
      <div className="mt-3">
        <span className={`px-2.5 py-1 clip-tag font-mono2 text-[10px] tracking-widest ${positive ? 'text-[var(--green)] border border-[var(--green)]' : 'text-[var(--green)] border border-[var(--green)]'}`}>
          {delta}
        </span>
      </div>
    </div>
  );
}

/** Numbered content row with title + detail */
export function NumberedRow({ n, title, detail }: { n: number; title: string; detail: string }) {
  return (
    <Reveal delay={n * 60}>
      <div className="cyber-card clip-cy-sm sweep p-5 sm:p-6 flex gap-5 group">
        <span className="font-display font-black text-2xl grad-text shrink-0 leading-none pt-0.5 w-10">
          {String(n).padStart(2, '0')}
        </span>
        <div>
          <h3 className="font-head font-bold text-base sm:text-lg tracking-wide group-hover:text-[var(--cyan)] transition-colors">{title}</h3>
          <p className="mt-2 text-sm text-[var(--dim)] leading-relaxed">{detail}</p>
        </div>
      </div>
    </Reveal>
  );
}

/** Simple two-column definition card */
export function DefCard({ title, detail, color = 'var(--cyan)' }: { title: string; detail: string; color?: string }) {
  return (
    <div className="cyber-card clip-cy-sm sweep p-5 border-l-2" style={{ borderLeftColor: color }}>
      <h3 className="font-head font-bold text-[15px] tracking-wide" style={{ color }}>{title}</h3>
      <p className="mt-2 text-[13px] text-[var(--dim)] leading-relaxed">{detail}</p>
    </div>
  );
}

/** Tag pill row */
export function TagRow({ items, color = 'var(--cyan)' }: { items: string[]; color?: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((t) => (
        <span key={t} className="px-3 py-1 clip-tag font-mono2 text-[9px] tracking-[0.15em] uppercase border" style={{ color, borderColor: `${color}55` }}>
          {t}
        </span>
      ))}
    </div>
  );
}

/** CTA strip used at the bottom of pages */
export function PageCta({ title = 'Want work like this on your product?', to = 'contact', label = 'Start a conversation' }: {
  title?: string; to?: string; label?: string;
}) {
  return (
    <Reveal>
      <div className="mt-20 cyber-card clip-cy-lg p-8 sm:p-12 relative overflow-hidden corner-frame">
        <div className="absolute inset-0 -z-[1] opacity-40"
          style={{ background: 'linear-gradient(115deg, var(--cyan-soft), transparent 45%, var(--pink-soft))' }} />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="font-display font-bold text-xl sm:text-2xl uppercase leading-tight">{title}</h3>
            <p className="mt-2.5 text-sm text-[var(--dim)]">Replies within 24 hours · Burmese, English or Thai · GMT+6:30</p>
          </div>
          <Link to={to} className="btn btn-primary clip-cy shrink-0">{label}</Link>
        </div>
      </div>
    </Reveal>
  );
}
