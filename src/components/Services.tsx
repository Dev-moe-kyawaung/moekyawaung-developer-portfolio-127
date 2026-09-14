import { Smartphone, Layers, Cloud, Gauge, ShieldCheck, Wrench } from 'lucide-react';
import { SERVICES } from '../data';
import { Reveal, SectionHead } from './ui';
import { Tilt } from './fx';

const ICONS: Record<string, React.ComponentType<{ size?: number | string }>> = {
  Smartphone, Layers, Cloud, Gauge, ShieldCheck,
};

export default function Services() {
  return (
    <section id="services" className="relative mx-auto max-w-[1440px] px-5 lg:px-10 py-20 md:py-28">
      <SectionHead
        index="03"
        kicker="SERVICES"
        mm="ဝန်ဆောင်မှုများ"
        title={<>WHAT I <span className="grad-text">DELIVER</span></>}
        desc="End-to-end capability — from the first Compose screen to a signed release build on the Play Store. Every engagement ships with documentation and knowledge transfer."
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SERVICES.map((s, i) => {
          const Icon = ICONS[s.icon] ?? Wrench;
          return (
            <Reveal key={s.title} delay={i * 90}>
              <Tilt max={6}>
                <article className="cyber-card clip-cy sweep p-7 h-full flex flex-col gap-5 group">
                  {/* watermark number */}
                  <span className="absolute top-4 right-6 font-display font-black text-4xl opacity-[0.07] select-none">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="relative w-14 h-14 clip-cy-sm bg-gradient-to-br from-[var(--cyan)] via-[var(--violet)] to-[var(--pink)] p-[1.5px]">
                    <span className="w-full h-full clip-cy-sm bg-[var(--bg-2)] flex items-center justify-center text-[var(--cyan)] group-hover:text-[var(--pink)] transition-colors duration-300">
                      <Icon size={24} />
                    </span>
                  </span>
                  <h3 className="font-head font-bold text-xl tracking-wide">{s.title}</h3>
                  <p className="text-sm text-[var(--dim)] leading-relaxed flex-1">{s.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {s.tags.map((t) => (
                      <span key={t} className="px-2.5 py-1 clip-tag font-mono2 text-[9px] tracking-[0.15em] uppercase border border-[var(--line)] text-[var(--cyan)]">
                        {t}
                      </span>
                    ))}
                  </div>
                </article>
              </Tilt>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
