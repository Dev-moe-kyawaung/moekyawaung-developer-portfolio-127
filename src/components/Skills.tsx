import { SKILL_BARS, RINGS, CHIP_CLOUD } from '../data';
import { DISCIPLINES, RUNES } from '../arcane';
import { Reveal, SectionHead, ProgressBar, ProgressRing } from './ui';
import { Sigil, SpellCircle } from './arcane';

/* sigil assigned to each core skill */
const SKILL_SIGILS = ['ᚲ', 'ᚹ', 'ᛗ', 'ᚠ', 'ᛚ', 'ᛞ'];

export default function Skills() {
  return (
    <section id="skills" className="relative mx-auto max-w-[1440px] px-5 lg:px-10 py-20 md:py-28">
      <SectionHead
        index="02"
        kicker="THE DISCIPLINES"
        mm="ကျွမ်းကျင်မှုများ"
        title={<>MAGIC I <span className="grad-text">COMMAND</span></>}
        desc="Twelve years refining a grimoire that ships — Kotlin-first Android, modern Jetpack, Firebase bindings, and the Mirror Craft of Flutter when one codebase wins."
      />

      <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-16 items-start">
        {/* ---- mana bars ---- */}
        <Reveal>
          <div className="cyber-card clip-cy p-7 sm:p-9 space-y-7 corner-frame relative">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-display font-bold tracking-widest text-sm uppercase text-[var(--yellow)]">Mastered Arts</h3>
              <span className="font-mono2 text-[10px] text-[var(--faint)] tracking-[0.2em]">ᛈ ATTUNEMENT.SCAN</span>
            </div>
            {SKILL_BARS.map((s, i) => (
              <div key={s.label} className="flex gap-4 items-start">
                <span className="shrink-0 pt-1 hidden sm:block">
                  <Sigil rune={SKILL_SIGILS[i] ?? 'ᛗ'} size={38} color={s.color} label={s.label} />
                </span>
                <div className="flex-1 min-w-0">
                  <ProgressBar key={s.label} label={s.label} val={s.val} color={s.color} note={s.note} delay={i * 130} />
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* ---- mana rings inside a spell circle ---- */}
        <Reveal delay={140} variant="right">
          <div className="cyber-card clip-cy p-7 sm:p-9 relative overflow-hidden">
            <div className="absolute -right-24 -top-24 pointer-events-none">
              <SpellCircle size={340} opacity={0.18} />
            </div>
            <h3 className="font-display font-bold tracking-widest text-sm uppercase text-[var(--pink)] mb-8 relative">
              Attunement Rings
            </h3>
            <div className="relative grid grid-cols-2 gap-x-4 gap-y-10 place-items-center">
              {RINGS.map((r) => (
                <ProgressRing key={r.label} label={r.label} val={r.val} color={r.color} />
              ))}
            </div>
            <p className="relative mt-8 text-[12.5px] text-[var(--faint)] leading-relaxed font-serif2 italic">
              // attunement self-assessed against production work — three million users served,
              99.9 percent crash-free, sixty frames per second held on low-end devices.
            </p>
          </div>
        </Reveal>
      </div>

      {/* ---- incantation cloud ---- */}
      <Reveal delay={120}>
        <div className="mt-12 flex flex-wrap justify-center gap-2.5">
          {CHIP_CLOUD.map((c, i) => {
            const rune = RUNES[i % RUNES.length];
            return (
              <span
                key={c}
                className="group px-4 py-2 clip-tag font-serif2 text-[14px] border border-[var(--line)] text-[var(--dim)] hover:text-[#160d24] hover:border-[var(--yellow)] transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
              >
                <span className="font-rune text-[11px] text-[var(--yellow)] group-hover:text-[#160d24] transition-colors opacity-70">{rune}</span>
                {c}
              </span>
            );
          })}
        </div>
      </Reveal>

      {/* ---- the glossary ---- */}
      <Reveal delay={170}>
        <div className="mt-14 cyber-card clip-cy p-6 sm:p-8">
          <h3 className="font-display font-bold text-base uppercase tracking-widest text-[var(--yellow)] mb-6 flex items-center gap-3">
            <span className="font-rune text-lg candle">ᚱ</span> Glossary of the Two Tongues
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
            {Object.values(DISCIPLINES).map((d) => (
              <div key={d.arcane} className="flex gap-3.5 items-baseline border-b border-[var(--line)] pb-3">
                <span className="font-rune text-base text-[var(--yellow)] shrink-0 candle">{d.rune}</span>
                <div className="min-w-0">
                  <div className="font-display font-bold text-[12.5px] text-[var(--txt)] leading-tight">{d.arcane}</div>
                  <div className="font-mono2 text-[9px] tracking-[0.12em] text-[var(--faint)] mt-1 uppercase">{d.tech}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
