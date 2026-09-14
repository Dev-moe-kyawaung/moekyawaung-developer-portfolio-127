import { Link } from '../lib/router';
import { Box, Cpu, Smartphone, Globe, Monitor, ArrowRight, Binary, Code2, GitBranch } from 'lucide-react';
import { Reveal, SectionHead } from './ui';
import { MermaidLite } from './MermaidLite';

/* ============================================================================
   HOMEPAGE SPOTLIGHT — prompt A1 (KMP Architecture)
   Tiny mermaid diagram + a 'read the full spec' link
   ============================================================================ */

const SPOT_DIAGRAM = `flowchart LR
  A(["📱 Android<br/>Compose"]) --> VM["ViewModels"]
  I(["🍎 iOS<br/>SwiftUI"]) --> VM
  D(["🖥️ Desktop<br/>Compose"]) --> VM
  W(["🌐 Web<br/>Compose / Wasm"]) --> VM
  VM --> DC{{"Domain<br/>pure Kotlin"}}
  DC --> DR["Data · Ktor · SQLDelight"]
  DR --> S[/"REST + OIDC"/]
  DR -. expects .-> P["Platform<br/>expect / actual"]
  classDef ui fill:rgba(0,240,255,0.10),stroke:#00f0ff,color:#fff
  classDef node fill:rgba(255,255,255,0.04),stroke:#888,color:#fff
  classDef core fill:rgba(139,92,246,0.18),stroke:#8b5cf6,color:#fff
  classDef plat fill:rgba(62,242,160,0.10),stroke:#3ef2a0,color:#fff
  classDef server fill:rgba(0,0,0,0.4),stroke:#888,color:#aaa
  class A,I,D,W ui
  class VM,DR node
  class DC core
  class P plat
  class S server`;

const TARGETS = [
  { i: Smartphone, l: 'Android', sub: 'Jetpack Compose' },
  { i: Smartphone, l: 'iOS', sub: 'SwiftUI' },
  { i: Monitor, l: 'Desktop', sub: 'Compose Multiplatform' },
  { i: Globe, l: 'Web', sub: 'Compose / Wasm' },
];

export default function CmpShowcase() {
  return (
    <section id="kmp" className="relative mx-auto max-w-[1440px] px-5 lg:px-10 py-20 md:py-28">
      <SectionHead
        index="A1"
        kicker="SYSTEMS · KMP ARCHITECTURE"
        mm="KMP Architecture"
        title={<>A KMP ARCHITECTURE I WOULD <span className="grad-text">SHIP</span></>}
        desc="One repository. Four targets. Eighty percent of business logic in a single :shared Kotlin module — pure domain, expect/actual platform, full CI matrix. Click through to the interactive diagram."
      />

      <div className="grid lg:grid-cols-[1fr_0.85fr] gap-8 items-stretch">
        {/* diagram panel */}
        <Reveal>
          <div className="cyber-card clip-cy overflow-hidden h-full">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--line)] bg-[var(--bg-2)]/70">
              <div className="flex items-center gap-2 font-mono2 text-[10px] tracking-[0.2em] text-[var(--cyan)]">
                <span className="pulse-dot" /> FIG. A1 · KMP TOPOLOGY
              </div>
              <span className="font-mono2 text-[9px] tracking-[0.2em] text-[var(--faint)]">4 TARGETS · 1 :shared MODULE</span>
            </div>
            <div className="h-[400px] sm:h-[460px]">
              <MermaidLite chart={SPOT_DIAGRAM} />
            </div>
            <div className="px-4 py-3 border-t border-[var(--line)] flex items-center justify-between">
              <span className="font-mono2 text-[10px] tracking-[0.2em] text-[var(--dim)]">
                ONE REPO · FOUR PRODUCTION TARGETS
              </span>
              <Link to="kmp" className="font-mono2 text-[10px] tracking-[0.18em] text-[var(--cyan)] hover:text-[var(--pink)] transition-colors inline-flex items-center gap-1.5">
                OPEN FULL SPEC <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </Reveal>

        {/* spec teaser column */}
        <Reveal delay={120}>
          <div className="flex flex-col gap-4 h-full">
            {/* target chips */}
            <div className="grid grid-cols-2 gap-2.5">
              {TARGETS.map((t) => {
                const I = t.i;
                return (
                  <div key={t.l} className="cyber-card clip-cy-sm p-4 flex items-center gap-3">
                    <span className="w-9 h-9 clip-cy-sm border border-[var(--line)] flex items-center justify-center text-[var(--cyan)]">
                      <I size={16} />
                    </span>
                    <div>
                      <div className="font-head font-bold text-[13px]">{t.l}</div>
                      <div className="font-mono2 text-[9px] tracking-[0.15em] text-[var(--faint)] uppercase">{t.sub}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* what's inside */}
            <div className="cyber-card clip-cy p-5 flex-1">
              <div className="kicker mb-3">// INSIDE THE SPEC</div>
              <ul className="space-y-2.5">
                {[
                  { i: Binary, t: 'Pure-Kotlin domain layer' },
                  { i: Cpu, t: 'expect / actual platform contract' },
                  { i: Code2, t: 'Ktor + SQLDelight data layer' },
                  { i: Box, t: 'Type-safe ViewModels & Flow' },
                  { i: GitBranch, t: '5-target CI matrix' },
                ].map((x) => {
                  const I = x.i;
                  return (
                    <li key={x.t} className="flex items-center gap-3 text-[13px] text-[var(--dim)]">
                      <span className="w-7 h-7 clip-cy-sm border border-[var(--line)] flex items-center justify-center text-[var(--cyan)] shrink-0">
                        <I size={13} />
                      </span>
                      {x.t}
                    </li>
                  );
                })}
              </ul>
              <Link
                to="kmp"
                className="btn btn-primary clip-cy-sm mt-5 w-full justify-center"
              >
                Read the architecture spec <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
