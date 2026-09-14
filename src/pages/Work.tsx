import { ArrowUpRight, GitBranch, ExternalLink, Calendar, Users, Star, Clock } from 'lucide-react';
import { PROJECTS } from '../data';
import { CASE_STUDIES as CS, CASE_STUDIES } from '../content';
import { Reveal } from '../components/ui';
import { PageShell, BlockTitle, MetricCard, NumberedRow, DefCard, TagRow, PageCta } from '../components/pageshell';
import { Lightbox } from '../components/premium';
import { Tilt } from '../components/fx';

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/* ============ PROJECT DETAIL ============ */
export function ProjectPage({ slug }: { slug: string }) {
  const p = PROJECTS.find((x) => slugify(x.title) === slug);

  if (!p) {
    return (
      <PageShell route="projects">
        <p className="text-[var(--dim)]">That project could not be found.</p>
      </PageShell>
    );
  }

  const related = PROJECTS.filter((x) => x.cat === p.cat && x.title !== p.title).slice(0, 3);

  return (
    <PageShell route="projects">
      <div className="grid lg:grid-cols-[1.35fr_0.65fr] gap-10">
        <div>
          <Reveal>
            <div className="cyber-card clip-cy-lg overflow-hidden">
              <img src={p.img} alt={`${p.title} cover`} className="w-full h-[300px] sm:h-[420px] object-cover" />
            </div>
          </Reveal>
          <Reveal delay={100}>
            <p className="mt-8 text-lg text-[var(--dim)] leading-relaxed">{p.desc}</p>
          </Reveal>

          <BlockTitle note="IMPLEMENTATION">Build Notes</BlockTitle>
          <div className="space-y-4">
            {[
              { t: 'Architecture', d: `Structured as a multi-module ${p.cat === 'flutter' ? 'Flutter' : 'Android'} project — feature modules own their UI, domain and data slices, and depend only on contracts exposed by a thin core.` },
              { t: 'State & Data', d: 'Unidirectional data flow with immutable state. Repositories expose streams backed by a local cache, so the UI renders instantly from storage and reconciles with the network in the background.' },
              { t: 'Performance', d: 'Deferred initialisation, stable models and granular rebuild scopes. Measured on a mid-range 2019 device before every release, not just the flagship on the desk.' },
              { t: 'Testing & Delivery', d: 'Domain layer unit tested without framework imports. CI runs lint, tests and a signed build on every pull request, with staged rollout on merge.' },
            ].map((x, i) => <NumberedRow key={x.t} n={i + 1} title={x.t} detail={x.d} />)}
          </div>

          <PageCta title="Need something like this built?" label="Discuss your project" />
        </div>

        {/* sidebar */}
        <aside className="space-y-5 lg:sticky lg:top-28 h-fit">
          <Reveal variant="right">
            <div className="cyber-card clip-cy p-6 space-y-5">
              <div>
                <div className="font-mono2 text-[9px] tracking-[0.25em] text-[var(--faint)]">PROJECT</div>
                <h2 className="font-display font-bold text-xl mt-1.5 leading-tight">{p.title}</h2>
              </div>
              <div className="space-y-3 pt-1">
                {[
                  { i: Star, l: 'Category', v: p.cat.toUpperCase() },
                  { i: Clock, l: 'Status', v: p.featured ? 'Featured · Active' : 'Active' },
                  { i: Calendar, l: 'Maintained', v: '2019 — Present' },
                  { i: Users, l: 'Role', v: 'Solo · End-to-end' },
                ].map((r) => (
                  <div key={r.l} className="flex items-center justify-between gap-3 text-sm">
                    <span className="flex items-center gap-2 font-mono2 text-[10px] tracking-[0.15em] text-[var(--faint)] uppercase">
                      <r.i size={12} className="text-[var(--cyan)]" />{r.l}
                    </span>
                    <span className="font-head font-semibold text-[13px] text-right">{r.v}</span>
                  </div>
                ))}
              </div>
              <TagRow items={p.tags} />
              <div className="flex flex-col gap-2.5 pt-2">
                <a href={p.repo} target="_blank" rel="noreferrer" className="btn btn-primary clip-cy-sm justify-center text-xs !py-3">
                  <GitBranch size={14} /> View Source
                </a>
                <a href="https://github.com/moekyawaung-tech/" target="_blank" rel="noreferrer" className="btn btn-ghost clip-cy-sm justify-center text-xs !py-3">
                  <ExternalLink size={14} /> More Repos
                </a>
              </div>
            </div>
          </Reveal>
        </aside>
      </div>

      {/* related */}
      {related.length > 0 && (
        <>
          <BlockTitle note="SAME STACK">Related Builds</BlockTitle>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {related.map((r) => (
              <Reveal key={r.title}>
                <Tilt max={5}>
                  <a href={`#/project/${slugify(r.title)}`} className="cyber-card clip-cy overflow-hidden group block h-full">
                    <img src={r.img} alt={r.title} loading="lazy" className="w-full h-40 object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="p-5">
                      <h3 className="font-head font-bold tracking-wide flex items-center justify-between">{r.title}
                        <ArrowUpRight size={16} className="text-[var(--pink)]" />
                      </h3>
                      <p className="mt-2 text-[13px] text-[var(--dim)] leading-relaxed line-clamp-2">{r.desc}</p>
                    </div>
                  </a>
                </Tilt>
              </Reveal>
            ))}
          </div>
        </>
      )}
    </PageShell>
  );
}

/* ============ CASE STUDY INDEX ============ */
export function CaseStudiesPage() {
  return (
    <PageShell route="case-studies">
      <div className="space-y-8">
        {CS.map((cs, i) => (
          <Reveal key={cs.slug} delay={i * 80}>
            <a href={`#/case-study/${cs.slug}`} className="cyber-card clip-cy-lg overflow-hidden grid md:grid-cols-[0.9fr_1.1fr] group">
              <div className="relative h-56 md:h-full overflow-hidden">
                <img src={cs.hero} alt={cs.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[var(--bg)] opacity-70 hidden md:block" />
              </div>
              <div className="p-7 sm:p-9 flex flex-col gap-4">
                <div className="flex items-center gap-3 font-mono2 text-[10px] tracking-[0.2em]">
                  <span className="text-[var(--pink)]">{cs.year}</span>
                  <span className="text-[var(--faint)]">·</span>
                  <span className="text-[var(--cyan)] uppercase">{cs.role}</span>
                  <span className="text-[var(--faint)]">·</span>
                  <span className="text-[var(--faint)]">{cs.duration}</span>
                </div>
                <h2 className="font-display font-bold text-xl sm:text-2xl leading-tight group-hover:text-[var(--cyan)] transition-colors">{cs.title}</h2>
                <p className="text-sm text-[var(--dim)] leading-relaxed">{cs.sub}</p>
                <div className="grid grid-cols-2 gap-3 mt-1">
                  {cs.metrics.slice(0, 2).map((m) => (
                    <div key={m.label} className="px-3 py-2.5 clip-cy-sm border border-[var(--line)]">
                      <div className="font-mono2 text-[8px] tracking-[0.15em] text-[var(--faint)] uppercase">{m.label}</div>
                      <div className="font-display font-bold text-[var(--green)] text-sm mt-1">{m.delta}</div>
                    </div>
                  ))}
                </div>
                <span className="mt-auto inline-flex items-center gap-2 font-head font-bold tracking-[0.15em] uppercase text-xs text-[var(--cyan)]">
                  Read case study <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
      <PageCta title="Have a problem worth a case study?" />
    </PageShell>
  );
}

/* ============ CASE STUDY DETAIL ============ */
export function CaseStudyPage({ slug }: { slug: string }) {
  const cs = CASE_STUDIES.find((x) => x.slug === slug);
  if (!cs) {
    return <PageShell route="case-studies"><p className="text-[var(--dim)]">Case study not found.</p></PageShell>;
  }

  return (
    <PageShell route="case-studies">
      {/* hero */}
      <Reveal>
        <div className="cyber-card clip-cy-lg overflow-hidden">
          <img src={cs.hero} alt={cs.title} className="w-full h-[260px] sm:h-[400px] object-cover" />
        </div>
      </Reveal>

      <div className="grid lg:grid-cols-[1.35fr_0.65fr] gap-10 mt-10">
        <div>
          <BlockTitle note="THE CHALLENGE">Problem</BlockTitle>
          <Reveal><p className="text-[var(--dim)] leading-relaxed -mt-4">{cs.problem}</p></Reveal>

          <BlockTitle note="HOW I WORKED">Approach</BlockTitle>
          <div className="space-y-4 -mt-4">
            {cs.approach.map((a, i) => <NumberedRow key={a} n={i + 1} title={`Step ${i + 1}`} detail={a} />)}
          </div>

          <BlockTitle note="SYSTEM DESIGN">Architecture</BlockTitle>
          <div className="grid sm:grid-cols-2 gap-4 -mt-4">
            {cs.architecture.map((a, i) => (
              <DefCard key={a.layer} title={a.layer} detail={a.detail}
                color={['var(--cyan)', 'var(--pink)', 'var(--yellow)', 'var(--violet)'][i % 4]} />
            ))}
          </div>

          <BlockTitle note="MEASURED">Outcomes</BlockTitle>
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 -mt-4">
            {cs.metrics.map((m) => <MetricCard key={m.label} {...m} />)}
          </div>

          <BlockTitle note="GALLERY">Screens</BlockTitle>
          <Reveal><Lightbox images={cs.gallery} /></Reveal>

          <BlockTitle note="WHAT I LEARNED">Lessons</BlockTitle>
          <ul className="space-y-3.5 -mt-4">
            {cs.lessons.map((l, i) => (
              <Reveal key={l} delay={i * 70}>
                <li className="cyber-card clip-cy-sm p-5 flex gap-4 border-l-2 !border-l-[var(--yellow)]">
                  <span className="font-mono2 text-[10px] text-[var(--yellow)] tracking-widest shrink-0 pt-1">{String(i + 1).padStart(2, '0')}</span>
                  <p className="text-sm text-[var(--dim)] leading-relaxed">{l}</p>
                </li>
              </Reveal>
            ))}
          </ul>

          <PageCta title="Want this level of rigour on your app?" />
        </div>

        {/* sidebar */}
        <aside className="space-y-5 lg:sticky lg:top-28 h-fit">
          <div className="cyber-card clip-cy p-6 space-y-5">
            <div>
              <div className="font-mono2 text-[9px] tracking-[0.25em] text-[var(--faint)]">CASE STUDY</div>
              <h2 className="font-display font-bold text-lg mt-1.5 leading-tight">{cs.title}</h2>
              <p className="mt-2 text-[13px] text-[var(--dim)] leading-relaxed">{cs.sub}</p>
            </div>
            <div className="space-y-3 pt-1 border-t border-[var(--line)]">
              {[
                { l: 'Role', v: cs.role }, { l: 'Duration', v: cs.duration }, { l: 'Year', v: cs.year },
              ].map((r) => (
                <div key={r.l} className="flex items-center justify-between text-sm">
                  <span className="font-mono2 text-[10px] tracking-[0.15em] text-[var(--faint)] uppercase">{r.l}</span>
                  <span className="font-head font-semibold text-[13px]">{r.v}</span>
                </div>
              ))}
            </div>
            <div className="pt-1 border-t border-[var(--line)]">
              <div className="font-mono2 text-[9px] tracking-[0.25em] text-[var(--faint)] mb-3">STACK</div>
              <TagRow items={cs.stack} color="var(--pink)" />
            </div>
          </div>

          {/* other case studies */}
          <div className="cyber-card clip-cy p-5">
            <div className="font-mono2 text-[9px] tracking-[0.25em] text-[var(--faint)] mb-4">MORE CASE STUDIES</div>
            <ul className="space-y-2.5">
              {CASE_STUDIES.filter((x) => x.slug !== cs.slug).map((x) => (
                <li key={x.slug}>
                  <a href={`#/case-study/${x.slug}`} className="font-head font-semibold text-sm text-[var(--dim)] hover:text-[var(--cyan)] transition-colors flex items-center gap-2">
                    <ArrowUpRight size={13} className="text-[var(--pink)] shrink-0" />{x.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
