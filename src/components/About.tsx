import { MapPin, Mail, Phone, BadgeCheck, Quote, Cpu, ShieldCheck, Bot, Cloud, Rocket, Award, Flame } from 'lucide-react';
import { PROFILE, IMAGES, TIMELINE } from '../data';
import { Reveal, SectionHead } from './ui';

const INFO = [
  { k: 'Full Name', v: 'Moe Kyaw Aung · မိုးကျော်အောင်' },
  { k: 'Role', v: 'Senior Android Developer', accent: true },
  { k: 'Location', v: 'Tachileik, MM ↔ Bangkok, TH' },
  { k: 'Languages', v: 'Burmese · English · Kotlin' },
  { k: 'Focus', v: 'Mobile · Backend · Security · AI' },
  { k: 'Status', v: 'Open to Work', accent: true },
];

const FOCUS = [
  { icon: Cpu, label: 'Mobile', val: 'Kotlin · Jetpack Compose · MVVM · Clean Arch', color: 'var(--cyan)' },
  { icon: Cloud, label: 'Backend', val: 'Firebase · REST APIs · Python', color: 'var(--pink)' },
  { icon: ShieldCheck, label: 'Security', val: 'Ethical Hacking · Cybersecurity', color: 'var(--yellow)' },
  { icon: Bot, label: 'AI / ML', val: 'Claude API · TFLite · On-Device ML', color: 'var(--violet)' },
];

export default function About({ index = '01' }: { index?: string }) {
  return (
    <section id="about" className="relative mx-auto max-w-[1440px] px-5 lg:px-10 py-20 md:py-28">
      <SectionHead
        index={index}
        kicker="ABOUT"
        mm="ကျွန်တော်အကြောင်း"
        title={<>DEVELOPER BY PASSION,<br /><span className="grad-text">LEARNER BY NATURE</span></>}
      />

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* -------- left: narrative -------- */}
        <div className="space-y-6">
          <Reveal>
            <p className="text-[var(--dim)] leading-relaxed">
              I'm a Senior Android Developer who builds apps with strong architecture, careful performance
              tuning, and practical collaboration. My work usually sits at the intersection of product
              thinking, system design, and implementation discipline — <span className="text-[var(--txt)]">from UI to networking,
              local caching, testing, and release-ready builds.</span>
            </p>
          </Reveal>
          <Reveal delay={100}>
            <p className="text-[var(--dim)] leading-relaxed">
              With nearly <span className="text-[var(--cyan)] font-semibold">12 years of hands-on experience</span>, I focus on
              clean architecture, maintainable code, and practical security. I prefer codebases that teams
              can understand, test, and extend — clear boundaries, reliable data flow, stable releases.
            </p>
          </Reveal>

          {/* quote */}
          <Reveal delay={180}>
            <blockquote className="relative cyber-card clip-cy p-6 pl-14 corner-frame">
              <Quote size={26} className="absolute left-5 top-6 text-[var(--pink)]" />
              <p className="font-mm text-lg text-[var(--txt)] leading-relaxed">
                “Code with culture. Build with purpose.”
              </p>
              <cite className="block mt-3 font-mono2 text-[10px] tracking-[0.25em] text-[var(--faint)] not-italic">
                — PERSONAL PHILOSOPHY
              </cite>
            </blockquote>
          </Reveal>

          {/* focus map */}
          <Reveal delay={240}>
            <div className="grid sm:grid-cols-2 gap-4">
              {FOCUS.map((f) => (
                <div key={f.label} className="cyber-card clip-cy-sm sweep p-4 flex gap-3.5 items-start">
                  <span className="w-10 h-10 shrink-0 clip-cy-sm border border-[var(--line)] flex items-center justify-center" style={{ color: f.color }}>
                    <f.icon size={18} />
                  </span>
                  <div>
                    <div className="font-head font-bold tracking-widest uppercase text-sm" style={{ color: f.color }}>{f.label}</div>
                    <div className="text-xs text-[var(--dim)] mt-1 leading-relaxed">{f.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* -------- right: portrait + info -------- */}
        <div className="space-y-6">
          <Reveal variant="right">
            <div className="relative group">
              <div className="cyber-card clip-cy-lg overflow-hidden">
                <img src={IMAGES.about} alt="Moe Kyaw Aung working" className="w-full h-[340px] object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div>
                    <div className="font-display font-bold text-lg">{PROFILE.name}</div>
                    <div className="font-mono2 text-[10px] tracking-[0.25em] text-[var(--cyan)] mt-1">SR. ANDROID DEVELOPER</div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 clip-tag border border-[var(--line-strong)] bg-[var(--panel)]">
                    <Rocket size={12} className="text-[var(--yellow)]" />
                    <span className="font-mono2 text-[9px] tracking-widest">EST. 2014</span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* currently building + certs */}
          <Reveal variant="right" delay={120}>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="cyber-card clip-cy-sm p-4 border-l-2 !border-l-[var(--pink)]">
                <div className="flex items-center gap-2 font-mono2 text-[10px] tracking-[0.2em] text-[var(--pink)]">
                  <Flame size={12} /> CURRENTLY BUILDING
                </div>
                <p className="mt-2.5 text-sm text-[var(--txt)] leading-relaxed">{PROFILE.currentlyBuilding}</p>
              </div>
              <div className="cyber-card clip-cy-sm p-4 border-l-2 !border-l-[var(--yellow)]">
                <div className="flex items-center gap-2 font-mono2 text-[10px] tracking-[0.2em] text-[var(--yellow)]">
                  <Award size={12} /> CERTIFICATIONS
                </div>
                <p className="mt-2.5 text-sm text-[var(--txt)] leading-relaxed">{PROFILE.certificationsNote}</p>
              </div>
            </div>
          </Reveal>

          {/* info list */}
          <Reveal variant="right" delay={200}>
            <ul className="cyber-card clip-cy divide-y divide-[var(--line)]">
              {INFO.map((i) => (
                <li key={i.k} className="flex items-center justify-between px-5 py-3.5 gap-4">
                  <span className="font-mono2 text-[10px] tracking-[0.2em] text-[var(--faint)] uppercase shrink-0">{i.k}</span>
                  <span className={`font-head font-semibold text-sm text-right ${i.accent ? 'text-[var(--cyan)]' : 'text-[var(--txt)]'}`}>{i.v}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* quick contact row */}
          <Reveal variant="right" delay={260}>
            <div className="flex flex-wrap gap-3">
              <a href={`mailto:${PROFILE.primaryEmail}`} className="flex items-center gap-2 px-4 py-2.5 clip-tag border border-[var(--line)] text-xs text-[var(--dim)] hover:text-[var(--cyan)] hover:border-[var(--cyan)] transition-all">
                <Mail size={14} /> {PROFILE.primaryEmail}
              </a>
              <a href="tel:+959889000889" className="flex items-center gap-2 px-4 py-2.5 clip-tag border border-[var(--line)] text-xs text-[var(--dim)] hover:text-[var(--pink)] hover:border-[var(--pink)] transition-all">
                <Phone size={14} /> +95 9 889 000 889
              </a>
              <span className="flex items-center gap-2 px-4 py-2.5 clip-tag border border-[var(--line)] text-xs text-[var(--dim)]">
                <MapPin size={14} className="text-[var(--yellow)]" /> GMT+6:30
              </span>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ================= TIMELINE ================= */}
      <div className="mt-24">
        <Reveal>
          <h3 className="font-display font-bold text-2xl sm:text-3xl uppercase mb-12 flex items-center gap-4">
            <span className="kicker-line" /> CAREER <span className="grad-text">TIMELINE</span>
          </h3>
        </Reveal>
        <div className="relative">
          <div className="tl-line left-4 md:left-1/2 md:-translate-x-1/2" />
          <div className="space-y-10">
            {TIMELINE.map((item, i) => (
              <Reveal key={item.year} delay={i * 90} variant={i % 2 ? 'right' : 'left'}>
                <div className={`relative pl-14 md:pl-0 md:grid md:grid-cols-2 md:gap-14 items-center`}>
                  {/* dot */}
                  <span className="tl-dot left-4 md:left-1/2 md:-translate-x-1/2 top-1.5 md:top-1/2 md:-translate-y-1/2 z-10" />
                  {/* card */}
                  <div className={`${i % 2 === 0 ? 'md:col-start-1 md:text-right md:pr-4' : 'md:col-start-2 md:pl-4'}`}>
                    <div className="cyber-card clip-cy sweep p-5 inline-block text-left w-full">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-display font-bold grad-text text-xl">{item.year}</span>
                        <span className="px-2.5 py-0.5 clip-tag font-mono2 text-[9px] tracking-[0.18em] border border-[var(--line-strong)] text-[var(--cyan)] flex items-center gap-1.5">
                          <BadgeCheck size={11} /> {item.impact}
                        </span>
                      </div>
                      <h4 className="mt-2.5 font-head font-bold text-lg tracking-wide">{item.title}</h4>
                      <div className="font-mono2 text-[10px] tracking-[0.2em] text-[var(--pink)] mt-0.5">{item.org.toUpperCase()}</div>
                      <p className="mt-2.5 text-sm text-[var(--dim)] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
