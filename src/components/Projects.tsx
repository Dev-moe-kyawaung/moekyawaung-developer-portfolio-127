import { useState } from 'react';
import { GitBranch, ArrowUpRight } from 'lucide-react';
import { PROJECTS, PROJ_FILTERS } from '../data';
import type { ProjCat } from '../data';
import { DIAGRAMS, DISCIPLINES } from '../arcane';
import type { ThemeMode } from './ThreeDScene';
import { Reveal, SectionHead } from './ui';
import { ThreeDSpellbook } from './ThreeDSpellbook';
import { ReactorModule } from './plasma';
import { MissionLog } from './warp';
import { NanoModule } from './nano';
import { VelvetWork } from './velvet';

/* ============================================================================
   RESEARCH-PAPER PRESENTATION — Dark Energy mode
   Projects as papers: index, abstract, schematic, measured outcomes
   ============================================================================ */

/** Measured outcomes per project — the paper's data section */
const PAPER_METRICS: Record<string, [string, string][]> = {
  'Social Dashboard': [['P95 stream latency', '180ms'], ['Offline replay', '100%'], ['Rebuild scope', '−62%']],
  'Video Player': [['Buffer recovery', '2.1s'], ['PiP success', '99.2%'], ['Memory delta', '+4MB']],
  'POS Ultimate Pro Max': [['Receipt print', '1.8s'], ['SKU lookup', '12ms'], ['Downtime · 14mo', '0']],
  'PWA App': [['Install rate', '41%'], ['Offline coverage', '100%'], ['LCP', '1.3s']],
  'Job Portal App': [['Search P95', '240ms'], ['Saved-job sync', '100%'], ['Install size', '24MB']],
  'Game Collection': [['Frame budget', '16.6ms'], ['Save-state', '<50ms'], ['Input latency', '8ms']],
  'Advance POS Version': [['Day-close', '3.2s'], ['Barcode scan', '11ms'], ['Lost sync ops', '0']],
  'Weather App': [['Forecast fetch', '310ms'], ['Scene anim', '60fps'], ['Battery', '2%/day']],
  'Thailand Travel': [['Offline tiles', '100%'], ['Route plan', '400ms'], ['i18n coverage', '100%']],
  'Daily Planner': [['Reminder drift', '0'], ['Widget draw', '9ms'], ['W4 retention', '+18%']],
  'Lens Lite': [['Scan time', '60ms'], ['EXIF parse', '40ms'], ['Cold start', '0.9s']],
  'Snake Game App': [['Loop', '60fps'], ['Input', '6ms'], ['Haptic sync', '1:1']],
  'My Postcode Web': [['Search 11k rows', '18ms'], ['TTFB', '90ms'], ['Availability', '99.98%']],
  'Hospital Lists': [['Filter 1.4k', '25ms'], ['LCP', '1.1s'], ['Data freshness', 'daily']],
  'Crypto & Money Tracker': [['Rate sync', '1.2s'], ['Vault unlock', '340ms'], ['Chart render', '60fps']],
  'E-commerce Shop': [['Cart add', '80ms'], ['Payment success', '98.6%'], ['LCP', '1.4s']],
};

const CAT_SHORT: Record<ProjCat, string> = {
  android: 'NATIVE ANDROID', flutter: 'CROSS-PLATFORM', web: 'WEB / PWA', game: 'GAME SYSTEM',
};

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** Minimal monochrome schematic — the paper's Figure 1 */
function PaperDiagram({ nodes }: { nodes: string[] }) {
  const n = nodes.length;
  const radius = 33;
  return (
    <div className="relative w-full max-w-[150px] aspect-square mx-auto py-1" aria-hidden="true">
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
        <circle cx="50" cy="50" r={radius + 8} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.4" />
        <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="0.5" />
        {/* crosshair */}
        <line x1="50" y1="12" x2="50" y2="20" stroke="rgba(255,255,255,0.14)" strokeWidth="0.4" />
        <line x1="50" y1="80" x2="50" y2="88" stroke="rgba(255,255,255,0.14)" strokeWidth="0.4" />
        <line x1="12" y1="50" x2="20" y2="50" stroke="rgba(255,255,255,0.14)" strokeWidth="0.4" />
        <line x1="80" y1="50" x2="88" y2="50" stroke="rgba(255,255,255,0.14)" strokeWidth="0.4" />
        <g className="diagram-orbit">
          {nodes.map((label, i) => {
            const a = (i / n) * Math.PI * 2 - Math.PI / 2;
            const x = 50 + Math.cos(a) * radius;
            const y = 50 + Math.sin(a) * radius;
            return (
              <g key={label}>
                <line x1="50" y1="50" x2={x} y2={y} stroke="rgba(255,255,255,0.12)" strokeWidth="0.4" />
                <circle cx={x} cy={y} r="2.2" fill="#98a5ff" opacity="0.9" />
                <text
                  x={x} y={y - 5.5} fill="rgba(255,255,255,0.5)" fontSize="3.4"
                  textAnchor="middle" fontFamily="JetBrains Mono, monospace" letterSpacing="0.2"
                >
                  {label}
                </text>
              </g>
            );
          })}
        </g>
        <circle cx="50" cy="50" r="3" fill="rgba(255,255,255,0.85)" />
      </svg>
    </div>
  );
}

/** One paper */
function ResearchPaper({ title, desc, tags, img, cat, index, href, repo }: {
  title: string; desc: string; tags: string[]; img: string; cat: ProjCat; index: number; href: string; repo: string;
}) {
  const metrics = PAPER_METRICS[title] ?? [['Measured', '—'], ['Verified', '—'], ['Released', '—']];
  return (
    <article className="paper-card p-7 group">
      {/* paper header */}
      <div className="flex items-center justify-between font-mono2 text-[10px] tracking-[0.2em] text-white/40">
        <span>PAPER {String(index).padStart(2, '0')}</span>
        <span>{CAT_SHORT[cat]}</span>
      </div>

      <h3 className="mt-4 font-display text-[22px] leading-tight tracking-[-0.015em] font-medium group-hover:text-white transition-colors duration-500">
        {title}
      </h3>

      {/* abstract */}
      <p className="mt-3 text-[13.5px] leading-relaxed text-[var(--dim)]">
        <span className="font-mono2 text-[9px] tracking-[0.25em] text-white/30 block mb-1.5">ABSTRACT</span>
        {desc}
      </p>

      {/* figure */}
      <div className="my-5 opacity-70 group-hover:opacity-100 transition-opacity duration-700">
        <PaperDiagram nodes={DIAGRAMS[cat] ?? DIAGRAMS.android} />
        <div className="text-center font-mono2 text-[8.5px] tracking-[0.28em] text-white/25 -mt-1">
          FIG. {index} — SYSTEM TOPOLOGY
        </div>
      </div>

      {/* measured outcomes */}
      <div className="grid grid-cols-3 divide-x divide-white/10 border-t border-b border-white/10">
        {metrics.map(([label, value]) => (
          <div key={label} className="px-3 py-3 first:pl-0">
            <div className="font-display text-[15px] font-medium tracking-tight text-white/90">{value}</div>
            <div className="mt-1 font-mono2 text-[8.5px] tracking-[0.14em] text-white/35 uppercase leading-tight">{label}</div>
          </div>
        ))}
      </div>

      {/* footer: tags + links */}
      <div className="flex items-center justify-between gap-3 mt-5">
        <div className="flex flex-wrap gap-x-3 gap-y-1 min-w-0">
          {tags.map((t) => (
            <span key={t} className="font-mono2 text-[9px] tracking-[0.12em] text-white/35 uppercase">{t}</span>
          ))}
        </div>
        <div className="flex gap-4 shrink-0">
          <a href={repo} target="_blank" rel="noreferrer" className="font-mono2 text-[9.5px] tracking-[0.18em] text-white/55 hover:text-white transition-colors flex items-center gap-1">
            REPO <GitBranch size={10} />
          </a>
          <a href={href} className="font-mono2 text-[9.5px] tracking-[0.18em] text-white/55 hover:text-white transition-colors flex items-center gap-1">
            PAPER <ArrowUpRight size={10} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>

      {/* subtle cover plate, hidden */}
      <img src={img} alt="" aria-hidden="true" className="hidden" />
    </article>
  );
}

/* ============================================================================ */
export default function Projects({ realmTheme = 'minimal' }: { realmTheme?: ThemeMode }) {
  const [filter, setFilter] = useState<ProjCat | 'all'>('all');
  const list = filter === 'all' ? PROJECTS : PROJECTS.filter((p) => p.cat === filter);
  const minimal = realmTheme === 'minimal';
  const plasma = realmTheme === 'plasma';
  const warp = realmTheme === 'warp';
  const nano = realmTheme === 'nano';
  const velvet = realmTheme === 'velvet';
  const neural = realmTheme === 'neural';
  const [showAll, setShowAll] = useState(false);

  return (
    <section id="projects" className="relative mx-auto max-w-[1440px] px-5 lg:px-10 py-20 md:py-28">
      <SectionHead
        index={velvet ? '01' : '04'}
        kicker={velvet ? 'SELECTED WORK' : nano ? 'MOLECULAR ASSEMBLY' : warp ? 'MISSION ARCHIVE' : minimal ? 'PAPER SERIES' : 'GRIMOIRE OF WORKS'}
        mm="စာအုပ်စုစည်းမှု"
        title={
          velvet ? (
            <>SELECTED <span className="grad-text">WORK</span></>
          ) : nano ? (
            <>SYSTEMS ASSEMBLED FROM <span className="grad-text">NANO-MODULES</span></>
          ) : warp ? (
            <>FLIGHT LOGS FROM <span className="grad-text">SHIPPED MISSIONS</span></>
          ) : minimal ? (
            <>WORK, DOCUMENTED LIKE <span className="grad-text">RESEARCH</span></>
          ) : (
            <>THE SPELLBOOK <span className="grad-text">LIBRARY</span></>
          )
        }
        desc={
          velvet
            ? 'Sixteen shipped products. The seven below are the ones I would show a client first — each presented with the numbers it moved.'
            : nano
            ? 'Sixteen nano-modules — each a shipped system rendered as a molecule, with its bond structure, chemical formula and structural integrity. Every module is open on GitHub.'
            : warp
            ? 'Sixteen mission logs — each a shipped system with its stardate, orbital system map and live telemetry. Every archive is open on GitHub.'
            : minimal
            ? 'Sixteen production systems presented as papers — abstract, system topology, measured outcomes. No marketing. The numbers are from release builds on mid-range hardware.'
            : 'Sixteen bound volumes — each a working app with its own sigil and architecture diagram. Every tome is open on GitHub.'
        }
      />

      {/* filter tabs */}
      <Reveal>
        <div className="flex flex-wrap gap-2.5 mb-10" role="tablist" aria-label="Project filters">
          {PROJ_FILTERS.map((f) => (
            <button
              key={f.id}
              role="tab"
              aria-selected={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={`px-5 py-2.5 clip-tag font-head font-bold tracking-[0.14em] uppercase text-xs border transition-all duration-300 ${
                filter === f.id
                  ? minimal
                    ? 'bg-white/90 text-black border-transparent'
                    : 'bg-gradient-to-r from-[var(--yellow)] to-[var(--pink)] text-[#160d24] border-transparent'
                  : 'border-[var(--line)] text-[var(--dim)] hover:border-[var(--yellow)] hover:text-[var(--txt)]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </Reveal>

      {/* the shelf */}
      <div className={velvet ? 'grid lg:grid-cols-2 gap-8' : 'grid sm:grid-cols-2 xl:grid-cols-3 gap-6'}>
        {(velvet && !showAll ? list.slice(0, 7) : list).map((p, i) =>
          neural ? (
            <Reveal key={p.title} delay={(i % 3) * 90} className="neural-connector">
              <ThreeDSpellbook
                title={p.title}
                desc={p.desc}
                tags={p.tags}
                img={p.img}
                diagram={DIAGRAMS[p.cat] ?? DIAGRAMS.android}
                rune=""
                accent="var(--cyan)"
                badge={CAT_SHORT[p.cat]}
                repo={p.repo}
                href={`#/project/${slugify(p.title)}`}
              />
            </Reveal>
          ) : velvet ? (
            <Reveal key={p.title} delay={(i % 2) * 90} className={i === 0 ? 'lg:col-span-2' : ''}>
              <VelvetWork
                index={PROJECTS.indexOf(p) + 1}
                title={p.title}
                desc={p.desc}
                tags={p.tags}
                img={p.img}
                cat={CAT_SHORT[p.cat]}
                metrics={PAPER_METRICS[p.title] ?? [['Measured', '—'], ['Verified', '—'], ['Released', '—']]}
                href={`#/project/${slugify(p.title)}`}
                repo={p.repo}
                wide={i === 0}
              />
            </Reveal>
          ) : nano ? (
            <Reveal key={p.title} delay={(i % 3) * 90}>
              <NanoModule
                title={p.title}
                desc={p.desc}
                tags={p.tags}
                img={p.img}
                cat={CAT_SHORT[p.cat]}
                index={PROJECTS.indexOf(p) + 1}
                nodes={DIAGRAMS[p.cat] ?? DIAGRAMS.android}
                href={`#/project/${slugify(p.title)}`}
                repo={p.repo}
              />
            </Reveal>
          ) : warp ? (
            <Reveal key={p.title} delay={(i % 3) * 90}>
              <MissionLog
                title={p.title}
                desc={p.desc}
                tags={p.tags}
                img={p.img}
                cat={CAT_SHORT[p.cat]}
                index={PROJECTS.indexOf(p) + 1}
                nodes={DIAGRAMS[p.cat] ?? DIAGRAMS.android}
                href={`#/project/${slugify(p.title)}`}
                repo={p.repo}
              />
            </Reveal>
          ) : plasma ? (
            <Reveal key={p.title} delay={(i % 3) * 90}>
              <ReactorModule
                title={p.title}
                desc={p.desc}
                tags={p.tags}
                img={p.img}
                cat={CAT_SHORT[p.cat]}
                index={PROJECTS.indexOf(p) + 1}
                href={`#/project/${slugify(p.title)}`}
                repo={p.repo}
              />
            </Reveal>
          ) : minimal ? (
            <Reveal key={p.title} delay={(i % 3) * 90}>
              <ResearchPaper
                title={p.title}
                desc={p.desc}
                tags={p.tags}
                img={p.img}
                cat={p.cat}
                index={PROJECTS.indexOf(p) + 1}
                href={`#/project/${slugify(p.title)}`}
                repo={p.repo}
              />
            </Reveal>
          ) : (
            <Reveal key={p.title} delay={(i % 3) * 90}>
              <ThreeDSpellbook
                title={p.title}
                desc={p.desc}
                tags={p.tags}
                img={p.img}
                diagram={DIAGRAMS[p.cat] ?? DIAGRAMS.android}
                rune={{ android: 'ᚲ', flutter: 'ᛚ', web: 'ᛜ', game: 'ᚷ' }[p.cat]}
                accent={{ android: 'var(--cyan)', flutter: 'var(--pink)', web: 'var(--yellow)', game: 'var(--violet)' }[p.cat]}
                badge={CAT_SHORT[p.cat]}
                repo={p.repo}
                href={`#/project/${slugify(p.title)}`}
              />
            </Reveal>
          )
        )}
      </div>

      {/* velvet: reveal the rest of the archive quietly */}
      {velvet && list.length > 7 && (
        <Reveal delay={100}>
          <div className="mt-10 flex flex-col items-center gap-3">
            <button onClick={() => setShowAll((s) => !s)} className="velvet-link !text-[0.82rem]">
              {showAll ? 'Show the selected seven' : `View all ${list.length} pieces`} <ArrowUpRight size={13} />
            </button>
            <a href="https://github.com/Dev-moe-kyawaung/" target="_blank" rel="noreferrer" className="font-mono2 text-[9.5px] tracking-[0.28em] text-[var(--faint)] hover:text-[var(--cyan)] transition-colors">
              600+ REPOSITORIES ON GITHUB
            </a>
          </div>
        </Reveal>
      )}

      {/* the deeper library */}
      {!velvet && (
      <Reveal delay={120}>
        <a
          href="https://github.com/Dev-moe-kyawaung/"
          target="_blank"
          rel="noreferrer"
          className={`mt-10 p-5 flex items-center justify-center gap-3 font-head font-bold tracking-[0.2em] uppercase text-sm transition-all ${
            minimal
              ? 'paper-card text-white/50 hover:text-white'
              : 'cyber-card clip-cy sweep corner-frame text-[var(--dim)] hover:text-[var(--txt)] group'
          }`}
        >
          {minimal ? (
            <span className="font-mono2 text-[10px] tracking-[0.3em]">FULL ARCHIVE — 600+ REPOSITORIES</span>
          ) : (
            <>
              <span className="font-rune text-lg text-[var(--yellow)] candle">ᛒ</span>
              OPEN THE FULL LIBRARY · 600+ REPOSITORIES
              <GitBranch size={16} className="text-[var(--cyan)] group-hover:rotate-12 transition-transform" />
            </>
          )}
          <ArrowUpRight size={14} className="text-white/40" />
        </a>
      </Reveal>
      )}

      {/* disciplines: arcane ↔ tech glossary */}
      {!velvet && (
      <Reveal delay={180}>
        <div className="mt-14">
          <h3 className="font-display font-bold text-xl uppercase mb-6 flex items-center gap-4">
            <span className="kicker-line" />
            {minimal ? (
              <span>Engineering Focus</span>
            ) : (
              <>The <span className="grad-text">Disciplines</span></>
            )}
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(DISCIPLINES).map(([key, d]) => (
              <div
                key={key}
                className={
                  minimal
                    ? 'paper-card p-5 flex items-center gap-4'
                    : 'cyber-card clip-cy-sm sweep p-5 flex items-center gap-4'
                }
              >
                <span
                  className={`w-12 h-12 shrink-0 clip-cy-sm border flex items-center justify-center font-rune text-xl ${minimal ? '' : 'candle'}`}
                  style={{ color: 'var(--yellow)', borderColor: 'var(--line-strong)' }}
                >
                  {minimal ? '·' : d.rune}
                </span>
                <div className="min-w-0">
                  <div className="font-display font-bold text-[13px] leading-tight text-[var(--txt)]">
                    {minimal ? d.tech.split('·')[0].trim() : d.arcane}
                  </div>
                  <div className="font-mono2 text-[9px] tracking-[0.12em] text-[var(--faint)] mt-1.5 uppercase truncate">{d.tech}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
      )}
    </section>
  );
}
