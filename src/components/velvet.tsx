import { ArrowUpRight, GitBranch, Award, ChevronRight } from 'lucide-react';
import { Link } from '../lib/router';
import { CASE_STUDIES, AWARDS } from '../content';
import { Reveal, SectionHead } from './ui';

/* ============================================================================
   VELVET — LUXURY PERSONAL BRAND SYSTEM
   Soft ambience · large premium work cards · case studies · grouped stack
   ============================================================================ */

/* ---------- soft ambience: wine, plum and champagne glows over fine grain ---------- */
export function VelvetAmbience() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div className="velvet-glow" style={{ width: 680, height: 680, top: '-22%', left: '-14%', background: 'rgba(122, 59, 94, 0.6)' }} />
      <div className="velvet-glow" style={{ width: 560, height: 560, top: '18%', right: '-16%', background: 'rgba(224, 185, 115, 0.26)', animationDelay: '-12s' }} />
      <div className="velvet-glow" style={{ width: 520, height: 520, bottom: '-24%', left: '32%', background: 'rgba(201, 107, 138, 0.28)', animationDelay: '-22s' }} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 55% at 50% 100%, rgba(14,7,9,0.85), transparent 70%)' }} />
      <div className="velvet-grain" />
    </div>
  );
}

/* ============================================================================
   SELECTED WORK — large premium card
   ============================================================================ */
export function VelvetWork({ index, title, desc, tags, img, cat, metrics, href, repo, wide = false }: {
  index: number; title: string; desc: string; tags: string[]; img: string; cat: string;
  metrics: [string, string][]; href: string; repo: string; wide?: boolean;
}) {
  return (
    <article className={`velvet-work group flex flex-col ${wide ? 'lg:flex-row' : ''}`}>
      {/* plate */}
      <div className={`relative overflow-hidden ${wide ? 'h-64 lg:h-auto lg:w-[56%] lg:min-h-[420px]' : 'h-60'}`}>
        <img
          src={img}
          alt={`${title} — selected work`}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-105"
          style={{ filter: 'saturate(0.82) contrast(1.02)' }}
        />
        <div className={`absolute inset-0 ${wide ? 'lg:hidden' : ''}`} style={{ background: 'linear-gradient(180deg, rgba(16,7,11,0.05) 25%, rgba(16,7,11,0.96) 100%)' }} />
        {wide && <div className="absolute inset-0 hidden lg:block" style={{ background: 'linear-gradient(90deg, rgba(16,7,11,0.05) 45%, rgba(16,7,11,0.98) 100%)' }} />}
        <span className="absolute top-4 left-6 velvet-numeral text-[64px]">{String(index).padStart(2, '0')}</span>
      </div>

      {/* body */}
      <div className={`p-7 sm:p-9 flex flex-col gap-4 flex-1 ${wide ? 'lg:justify-center lg:pl-4' : ''}`}>
        <div className="flex items-center gap-3 font-mono2 text-[9.5px] tracking-[0.28em] text-[var(--cyan)] uppercase">
          <span>{cat}</span>
          <span className="w-8 h-px bg-[var(--line-strong)]" />
          <span className="text-[var(--faint)]">Selected work</span>
        </div>
        <h3 className="font-display text-[24px] sm:text-[28px] leading-[1.15] text-[var(--txt)] group-hover:text-[var(--yellow)] transition-colors duration-500">
          {title}
        </h3>
        <p className="font-serif2 text-[17px] leading-relaxed text-[var(--dim)]">{desc}</p>
        <div className="velvet-rule" />
        <div className="grid grid-cols-3 gap-4">
          {metrics.map(([l, v]) => (
            <div key={l}>
              <div className="font-display text-[20px] text-[var(--yellow)] leading-none">{v}</div>
              <div className="font-mono2 text-[8.5px] tracking-[0.18em] text-[var(--faint)] uppercase mt-2 leading-tight">{l}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {tags.map((t) => <span key={t} className="font-serif2 italic text-[15px] text-[var(--dim)]">{t}</span>)}
        </div>
        <div className="flex items-center gap-8 pt-2 mt-auto">
          <a href={href} className="velvet-link">Read the story <ArrowUpRight size={13} /></a>
          <a href={repo} target="_blank" rel="noreferrer" className="velvet-link !text-[var(--dim)] hover:!text-[var(--cyan)]">
            <GitBranch size={13} /> Source
          </a>
        </div>
      </div>
    </article>
  );
}

/* ============================================================================
   CASE STUDIES — screenshot · architecture notes · measurable results
   ============================================================================ */
export function VelvetCaseStudies() {
  return (
    <section id="case-studies" className="relative mx-auto max-w-[1440px] px-5 lg:px-10 py-20 md:py-28">
      <SectionHead
        index="02"
        kicker="CASE STUDIES"
        mm="လေ့လာမှုများ"
        title={<>PROBLEM, APPROACH, <span className="grad-text">MEASURED RESULT</span></>}
        desc="Three engagements documented end to end — the screens, the architecture beneath them, and the numbers they moved. Every figure is from a release build on mid-range hardware."
      />
      <div className="space-y-8">
        {CASE_STUDIES.map((cs, i) => (
          <Reveal key={cs.slug} delay={i * 80}>
            <article className="velvet-work group grid lg:grid-cols-[0.95fr_1.05fr]">
              {/* screenshot */}
              <div className={`relative h-72 lg:h-auto lg:min-h-[460px] overflow-hidden ${i % 2 ? 'lg:order-2' : ''}`}>
                <img
                  src={cs.hero}
                  alt={`${cs.title} — screenshot`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-105"
                  style={{ filter: 'saturate(0.85)' }}
                />
                <div className="absolute inset-0 lg:hidden" style={{ background: 'linear-gradient(180deg, transparent 30%, rgba(16,7,11,0.96) 100%)' }} />
                <div
                  className="absolute inset-0 hidden lg:block"
                  style={{ background: i % 2
                    ? 'linear-gradient(270deg, rgba(16,7,11,0.05) 55%, rgba(16,7,11,0.98) 100%)'
                    : 'linear-gradient(90deg, rgba(16,7,11,0.05) 55%, rgba(16,7,11,0.98) 100%)' }}
                />
                <span className="absolute top-4 left-6 velvet-numeral text-[72px]">{String(i + 1).padStart(2, '0')}</span>
                <div className="absolute bottom-5 left-6 right-6 flex flex-wrap gap-x-3 gap-y-1">
                  {cs.stack.slice(0, 4).map((s) => (
                    <span key={s} className="font-mono2 text-[9px] tracking-[0.2em] text-[var(--yellow)] uppercase">{s}</span>
                  ))}
                </div>
              </div>

              {/* notes */}
              <div className="p-8 sm:p-10 flex flex-col gap-6">
                <div className="flex flex-wrap items-center gap-3 font-mono2 text-[9.5px] tracking-[0.26em] uppercase text-[var(--faint)]">
                  <span className="text-[var(--cyan)]">{cs.year}</span><span>·</span><span>{cs.role}</span><span>·</span><span>{cs.duration}</span>
                </div>
                <div>
                  <h3 className="font-display text-[26px] sm:text-[30px] leading-[1.12]">{cs.title}</h3>
                  <p className="mt-3 font-serif2 text-[17.5px] leading-relaxed text-[var(--dim)]">{cs.sub}</p>
                </div>

                <div>
                  <div className="font-mono2 text-[9px] tracking-[0.3em] text-[var(--cyan)] uppercase mb-3">Architecture notes</div>
                  <ul className="space-y-2.5">
                    {cs.architecture.slice(0, 3).map((a) => (
                      <li key={a.layer} className="font-serif2 text-[15.5px] leading-relaxed text-[var(--dim)]">
                        <span className="font-display text-[14px] text-[var(--yellow)] mr-2">{a.layer}</span>{a.detail}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="font-mono2 text-[9px] tracking-[0.3em] text-[var(--cyan)] uppercase mb-3">Measurable results</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {cs.metrics.map((m) => (
                      <div key={m.label} className="border-l border-[var(--line-strong)] pl-3.5">
                        <div className="font-display text-[22px] leading-none text-[var(--yellow)]">{m.after}</div>
                        <div className="font-serif2 text-[13px] text-[var(--faint)] line-through mt-1.5">{m.before}</div>
                        <div className="font-mono2 text-[8.5px] tracking-[0.16em] text-[var(--dim)] uppercase mt-2 leading-tight">{m.label}</div>
                        <div className="font-mono2 text-[9px] tracking-[0.12em] text-[var(--green)] mt-1">{m.delta}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <a href={`#/case-study/${cs.slug}`} className="velvet-link mt-auto pt-2">
                  Read the full case study <ArrowUpRight size={13} />
                </a>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ============================================================================
   STACK — grouped by Android · Mobile Architecture · APIs · AI
   ============================================================================ */
const STACK_GROUPS = [
  {
    num: 'I', title: 'Android', lead: 'Twelve years of native craft.',
    items: ['Kotlin · Coroutines · Flow', 'Jetpack Compose · Material 3', 'Room · Paging 3 · DataStore', 'Hilt · WorkManager', 'Navigation 3 · predictive back', 'Baseline profiles · R8'],
  },
  {
    num: 'II', title: 'Mobile Architecture', lead: 'Boundaries that hold for years.',
    items: ['Clean Architecture · MVVM / MVI', 'Multi-module feature slices', 'Kotlin Multiplatform · Flutter', 'Offline-first sync engines', 'Type-safe state contracts', 'Testing pyramid · contract tests'],
  },
  {
    num: 'III', title: 'APIs & Backend', lead: 'Resilient by default.',
    items: ['REST · OpenAPI 3.1', 'Retrofit · OkHttp · Ktor', 'Firebase — Auth · Firestore · FCM · Crashlytics', 'GraphQL · WebSocket streams', 'OAuth2 · OIDC · PKCE', 'Idempotency & retry policy'],
  },
  {
    num: 'IV', title: 'AI & On-device ML', lead: 'Intelligence that respects the device.',
    items: ['TensorFlow Lite · LiteRT', 'ML Kit — vision · GenAI', 'Claude API integrations', 'On-device summarisation & captioning', 'Latency & memory budgets', 'Privacy-first model lifecycle'],
  },
];

export function VelvetStack() {
  return (
    <section id="skills" className="relative mx-auto max-w-[1440px] px-5 lg:px-10 py-20 md:py-28">
      <SectionHead
        index="04"
        kicker="THE STACK"
        mm="နည်းပညာများ"
        title={<>TOOLS, CHOSEN <span className="grad-text">DELIBERATELY</span></>}
        desc="Grouped the way I think about a product — the native layer, the architecture that holds it, the APIs it speaks, and the intelligence it carries on-device."
      />
      <div className="grid md:grid-cols-2 gap-6">
        {STACK_GROUPS.map((g, i) => (
          <Reveal key={g.title} delay={i * 80}>
            <div className="cyber-card sweep p-8 h-full relative overflow-hidden">
              <span className="velvet-numeral absolute -top-3 right-6 text-[92px]">{g.num}</span>
              <div className="relative">
                <div className="font-mono2 text-[9px] tracking-[0.3em] text-[var(--cyan)] uppercase">Group {g.num}</div>
                <h3 className="mt-2 font-display text-2xl">{g.title}</h3>
                <p className="mt-1.5 font-serif2 italic text-[16.5px] text-[var(--dim)]">{g.lead}</p>
                <div className="velvet-rule my-5" />
                <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
                  {g.items.map((it) => (
                    <li key={it} className="flex items-start gap-2.5 font-serif2 text-[16px] text-[var(--txt)]">
                      <span className="mt-[10px] w-1.5 h-1.5 rounded-full bg-[var(--cyan)] shrink-0" />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ============================================================================
   ACHIEVEMENTS — recognition + credentials
   ============================================================================ */
export function VelvetAchievements() {
  const headline = [
    { v: '40+', l: 'Verified certifications', n: 'Programming Hub · Google' },
    { v: '9', l: 'Technical domains', n: 'Mobile · AI · Security · more' },
    { v: '2020', l: 'Google Developers Launchpad', n: 'Advanced Android track' },
  ];
  return (
    <section id="certificates" className="relative mx-auto max-w-[1440px] px-5 lg:px-10 py-20 md:py-28">
      <SectionHead
        index="05"
        kicker="ACHIEVEMENTS"
        mm="အောင်မြင်မှုများ"
        title={<>RECOGNITION & <span className="grad-text">CREDENTIALS</span></>}
        desc="Forty-plus verified certifications across nine domains, and the recognition that followed the work."
      />
      <Reveal>
        <div className="cyber-card p-7 sm:p-9 grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[var(--line)] mb-8">
          {headline.map((h) => (
            <div key={h.l} className="py-4 sm:py-0 sm:px-8 first:sm:pl-0 last:sm:pr-0">
              <div className="font-display text-4xl grad-text">{h.v}</div>
              <div className="mt-2 font-serif2 text-[17px] text-[var(--txt)]">{h.l}</div>
              <div className="font-mono2 text-[9px] tracking-[0.2em] text-[var(--faint)] uppercase mt-1">{h.n}</div>
            </div>
          ))}
        </div>
      </Reveal>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {AWARDS.map((a, i) => (
          <Reveal key={a.title} delay={i * 70}>
            <div className="cyber-card sweep p-6 h-full flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-full border border-[var(--line-strong)] flex items-center justify-center text-[var(--cyan)]">
                  <Award size={16} />
                </span>
                <span className="font-display italic text-[var(--yellow)] text-lg">{a.year}</span>
              </div>
              <h3 className="font-display text-[17px] leading-snug">{a.title}</h3>
              <div className="font-mono2 text-[9px] tracking-[0.22em] text-[var(--cyan)] uppercase">{a.org}</div>
              <p className="font-serif2 text-[15.5px] text-[var(--dim)] leading-relaxed">{a.note}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={120}>
        <div className="mt-10 flex flex-wrap gap-10 justify-center">
          <Link to="certificates" className="velvet-link">Browse all certificates <ChevronRight size={13} /></Link>
          <Link to="awards" className="velvet-link">Full awards record <ChevronRight size={13} /></Link>
        </div>
      </Reveal>
    </section>
  );
}

/* ============================================================================
   VEIL — route transition
   ============================================================================ */
export function VelvetVeil({ phase }: { phase: 'idle' | 'in' | 'out' }) {
  if (phase === 'idle') return null;
  return (
    <div className="velvet-veil" data-phase={phase} aria-hidden="true">
      <span className="vv-line" />
      <span className="vv-mono">MKA</span>
    </div>
  );
}
