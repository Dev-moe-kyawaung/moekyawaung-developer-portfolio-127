import { useEffect, useState } from 'react';
import { Check, Zap, Crown, ChevronLeft, ChevronRight, Plus, Quote, User } from 'lucide-react';
import { PLANS, TESTIMONIALS, FAQS } from '../data';
import type { Currency } from '../data';
import { Reveal, SectionHead } from './ui';

/* ============ PRICING — currency-aware (USD / MMK / THB) ============ */
function fmt(cur: Currency, v?: number): string {
  if (v === undefined) return '';
  const n = v.toLocaleString('en-US');
  if (cur === 'USD') return `$${n}`;
  if (cur === 'THB') return `฿${n}`;
  return `${n} K`;
}

export function Pricing() {
  const [cur, setCur] = useState<Currency>('USD');
  const curs: { id: Currency; label: string }[] = [
    { id: 'USD', label: 'USD $' }, { id: 'MMK', label: 'MMK K' }, { id: 'THB', label: 'THB ฿' },
  ];

  return (
    <section id="pricing" className="relative mx-auto max-w-[1440px] px-5 lg:px-10 py-20 md:py-28">
      <SectionHead
        index="07"
        kicker="PRICING"
        mm="ဈေးနှုန်းများ"
        title={<>CONSULTING <span className="grad-text">RATES</span></>}
        desc="Transparent engagement pricing in Myanmar Kyat, Thai Baht and US Dollar. Every package starts with a free 20-minute discovery call."
      />

      {/* currency switcher */}
      <Reveal>
        <div className="flex items-center gap-2 mb-10" role="group" aria-label="Currency selector">
          <span className="font-mono2 text-[10px] tracking-[0.25em] text-[var(--faint)] mr-2">CURRENCY //</span>
          {curs.map((c) => (
            <button
              key={c.id}
              onClick={() => setCur(c.id)}
              aria-pressed={cur === c.id}
              className={`px-4 py-2 clip-tag font-head font-bold tracking-widest text-xs border transition-all ${
                cur === c.id
                  ? 'bg-gradient-to-r from-[var(--yellow)] to-[var(--pink)] text-black border-transparent'
                  : 'border-[var(--line)] text-[var(--dim)] hover:border-[var(--yellow)]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </Reveal>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5 items-stretch">
        {PLANS.map((p, i) => (
          <Reveal key={p.name} delay={i * 80} className="h-full">
            <article
              className={`relative cyber-card clip-cy p-6 flex flex-col gap-5 h-full ${
                p.featured ? '!border-[var(--pink)] shadow-[0_0_36px_-8px_rgba(255,45,120,0.4)]' : ''
              }`}
            >
              {p.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 clip-tag bg-gradient-to-r from-[var(--pink)] to-[var(--yellow)] text-black font-head font-bold text-[10px] tracking-[0.2em] flex items-center gap-1.5">
                  <Crown size={11} /> MOST POPULAR
                </span>
              )}
              <div>
                <h3 className="font-display font-bold text-lg uppercase tracking-wider">{p.name}</h3>
                <p className="text-xs text-[var(--dim)] mt-2 leading-relaxed min-h-[2.6em]">{p.blurb}</p>
              </div>
              <div className="flex items-end gap-2">
                {p.custom ? (
                  <span className="font-display font-black text-3xl grad-text">CUSTOM</span>
                ) : (
                  <>
                    <span className="font-display font-black text-3xl text-[var(--cyan)]">{fmt(cur, cur === 'USD' ? p.usd : cur === 'MMK' ? p.mmk : p.thb)}</span>
                    <span className="font-mono2 text-[10px] text-[var(--faint)] pb-1.5">/ {p.unit}</span>
                  </>
                )}
              </div>
              <ul className="space-y-2.5 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[13px] text-[var(--dim)]">
                    <Check size={14} className="text-[var(--green)] shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className={`btn clip-cy-sm justify-center text-xs !py-3 ${p.featured ? 'btn-primary' : 'btn-ghost'}`}
              >
                {p.custom ? 'Request Quote' : 'Book Now'} <Zap size={13} />
              </a>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal delay={150}>
        <p className="mt-8 text-center font-mono2 text-[11px] text-[var(--faint)] tracking-wide">
          // Rates indexed quarterly · MMK / THB / USD · Long-term retainers available on request
        </p>
      </Reveal>
    </section>
  );
}

/* ============ TESTIMONIALS — auto-advancing slider ============ */
export function Testimonials() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = TESTIMONIALS.length;

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIdx((p) => (p + 1) % n), 5600);
    return () => clearInterval(id);
  }, [paused, n]);

  const item = TESTIMONIALS[idx];
  const initials = item.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <section id="testimonials" className="relative mx-auto max-w-[1440px] px-5 lg:px-10 py-20 md:py-28">
      <SectionHead
        index="08"
        kicker="TESTIMONIALS"
        mm="စကားချီးများ"
        title={<>TRUSTED BY <span className="grad-text">TEAMS</span></>}
      />

      <Reveal>
        <div
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="cyber-card clip-cy-lg p-8 sm:p-12 relative overflow-hidden">
            <div className="absolute top-6 left-6 sm:top-8 sm:left-8 text-[var(--cyan)] opacity-25">
              <Quote size={64} strokeWidth={1} />
            </div>
            <div key={idx} className="relative reveal in">
              <p className="text-lg sm:text-2xl font-head font-medium leading-relaxed text-[var(--txt)] text-center min-h-[7rem]">
                “{item.quote}”
              </p>
              <div className="mt-8 flex items-center justify-center gap-4">
                <span className="w-14 h-14 clip-cy-sm bg-gradient-to-br from-[var(--cyan)] via-[var(--violet)] to-[var(--pink)] p-[1.5px]">
                  <span className="w-full h-full clip-cy-sm bg-[var(--bg-2)] flex items-center justify-center font-display font-bold text-sm">
                    {initials}
                  </span>
                </span>
                <span className="text-left">
                  <span className="block font-head font-bold tracking-wide">{item.name}</span>
                  <span className="block font-mono2 text-[10px] tracking-[0.2em] text-[var(--cyan)] mt-1 uppercase">{item.role}</span>
                </span>
              </div>
            </div>
          </div>

          {/* controls */}
          <div className="mt-6 flex items-center justify-center gap-5">
            <button
              onClick={() => setIdx((p) => (p - 1 + n) % n)}
              aria-label="Previous testimonial"
              className="w-11 h-11 clip-cy-sm border border-[var(--line)] flex items-center justify-center text-[var(--dim)] hover:text-[var(--cyan)] hover:border-[var(--cyan)] transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-2.5">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`h-1.5 transition-all duration-400 ${i === idx ? 'w-9 bg-gradient-to-r from-[var(--cyan)] to-[var(--pink)]' : 'w-4 bg-[var(--line)]'}`}
                />
              ))}
            </div>
            <button
              onClick={() => setIdx((p) => (p + 1) % n)}
              aria-label="Next testimonial"
              className="w-11 h-11 clip-cy-sm border border-[var(--line)] flex items-center justify-center text-[var(--dim)] hover:text-[var(--pink)] hover:border-[var(--pink)] transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* mirror avatars */}
          <div className="mt-8 flex justify-center gap-3 opacity-70">
            {TESTIMONIALS.map((t, i) => (
              <button
                key={t.name}
                onClick={() => setIdx(i)}
                aria-label={`Show testimonial from ${t.name}`}
                className={`w-9 h-9 clip-cy-sm border flex items-center justify-center transition-all ${
                  i === idx ? 'border-[var(--cyan)] text-[var(--cyan)]' : 'border-[var(--line)] text-[var(--faint)]'
                }`}
              >
                <User size={13} />
              </button>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ============ FAQ ACCORDION ============ */
export function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="relative mx-auto max-w-[1440px] px-5 lg:px-10 py-20 md:py-28">
      <SectionHead
        index="09"
        kicker="FAQ"
        mm="မေးခွန်းများ"
        title={<>COMMON <span className="grad-text">SIGNALS</span></>}
      />

      <div className="max-w-3xl mx-auto space-y-3.5">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={f.q} delay={i * 60}>
              <div className={`cyber-card clip-cy-sm overflow-hidden ${isOpen ? '!border-[var(--cyan)]' : ''}`}>
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-${i}`}
                  className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-5 text-left"
                >
                  <span className="flex items-center gap-4">
                    <span className="font-mono2 text-[10px] text-[var(--pink)] tracking-widest">{String(i + 1).padStart(2, '0')}</span>
                    <span className="font-head font-bold text-[15px] sm:text-base tracking-wide">{f.q}</span>
                  </span>
                  <Plus
                    size={18}
                    className={`shrink-0 text-[var(--cyan)] transition-transform duration-400 ${isOpen ? 'rotate-45' : ''}`}
                  />
                </button>
                <div id={`faq-${i}`} className={`faq-body ${isOpen ? 'open' : ''}`}>
                  <div>
                    <p className="px-5 sm:px-6 pb-5 pl-[3.7rem] text-sm text-[var(--dim)] leading-relaxed">{f.a}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
