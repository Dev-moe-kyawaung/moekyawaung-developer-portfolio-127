import { useEffect, useState } from 'react';
import type { MouseEvent } from 'react';
import { ArrowRight, Download, ChevronDown, MapPin, Star, Code2, Terminal } from 'lucide-react';
import { PROFILE, ROLES, IMAGES, STATS, MARQUEE_ITEMS, SOCIALS, I18N } from '../data';
import { useTyping, useLang } from '../hooks';
import { SocialIcon, StatCounter, Marquee, Reveal } from './ui';
import { Particles, Magnetic } from './premium';
import { SpellCircle, GlyphRain, Sigil } from './arcane';
import { DISCIPLINES } from '../arcane';
import { PlasmaCore, HeatShimmer, NeonFlow } from './plasma';
import { WarpField, HudFrame } from './warp';
import { MolecularField, NanoAtom } from './nano';
import { VelvetAmbience } from './velvet';

/* Concentric gravitational field — the dark-energy hero motif */
function GravField({ size = 800 }: { size?: number }) {
  return (
    <div className="relative pointer-events-none" style={{ width: size, height: size }} aria-hidden="true">
      {/* concentric field lines */}
      {[0.3, 0.48, 0.68, 0.92].map((r, i) => (
        <div
          key={i}
          className="absolute rounded-full border"
          style={{ inset: `${(1 - r) * 50}%`, borderColor: `rgba(255,255,255,${0.04 + i * 0.016})` }}
        />
      ))}
      {/* slow satellites on the field */}
      {[
        { r: 48, d: 52, dot: 3, color: 'rgba(255,255,255,0.65)' },
        { r: 68, d: 84, dot: 2.5, color: 'rgba(152,165,255,0.7)' },
        { r: 30, d: 30, dot: 2, color: 'rgba(255,255,255,0.4)' },
      ].map((o, i) => (
        <div key={i} className="absolute grav-orbit" style={{ inset: `${(1 - o.r) * 50}%`, animationDuration: `${o.d}s` }}>
          <span
            className="absolute rounded-full"
            style={{ top: -o.dot / 2, left: '50%', width: o.dot, height: o.dot, background: o.color, boxShadow: `0 0 12px ${o.color}` }}
          />
        </div>
      ))}
      {/* the singularity */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <span className="block w-1.5 h-1.5 rounded-full bg-white/80" />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/10 grav-pulse" />
      </div>
    </div>
  );
}

/* Resume text file generated client-side (ATS-friendly) */
function downloadResume() {
  const txt = [
    'MOE KYAW AUNG — Senior Android Developer',
    'Tachileik, Myanmar | Bangkok, Thailand',
    'Phone: +95 9 889 000 889 | Email: moekyawaung@engineer.com',
    'GitHub: https://github.com/Dev-moe-kyawaung/',
    '',
    'SUMMARY',
    'Senior Android Engineer with 12 years of experience building secure, scalable,',
    'user-friendly mobile applications. Strong in Kotlin and modern Jetpack development',
    '(Compose, ViewModel, Room), Firebase integration, and REST API consumption.',
    'Clean architecture, maintainable code, and practical security focus.',
    '',
    'CORE SKILLS',
    'Kotlin · Jetpack Compose · MVVM / MVI · Clean Architecture · Coroutines · Flow',
    'Room · Retrofit · Dagger/Hilt · Firebase Suite · Flutter / Dart · CI/CD (GitHub Actions)',
    '',
    'EXPERIENCE',
    '2014 Junior Android Developer — Mandalay Tech Studio (3 apps published)',
    '2017 Android Developer — Yangon Digital Agency (6 apps migrated to Kotlin)',
    '2019 Senior Android Developer — Bangkok Startup Collective (8 apps, 1M+ installs)',
    '2021 Lead Mobile Engineer — Regional FinTech (99.9% crash-free sessions)',
    '2023 Mobile Architect — Multi-Product Platform (3M+ active users)',
    '2026 Independent Senior Consultant — Remote (40+ certifications)',
    '',
    'CERTIFICATIONS: 40+ — Google Developers Launchpad, Programming Hub',
  ].join('\n');
  const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Moe-Kyaw-Aung-Resume-2026.txt';
  a.click();
  URL.revokeObjectURL(url);
}

import { ThreeDScene } from './ThreeDScene';
import type { ThemeMode } from './ThreeDScene';

interface HeroProps {
  realmTheme?: ThemeMode;
  motionMode?: 'interactive' | 'auto' | 'reduced';
}

export default function Hero({ realmTheme = 'arcane', motionMode = 'interactive' }: HeroProps) {
  const lang = useLang();
  const t = I18N[lang];
  const typed = useTyping(ROLES);
  const [par, setPar] = useState({ x: 0, y: 0 });
  const minimal = realmTheme === 'minimal';
  const plasma = realmTheme === 'plasma';
  const warp = realmTheme === 'warp';
  const nano = realmTheme === 'nano';
  const velvet = realmTheme === 'velvet';
  const neural = realmTheme === 'neural';

  /* mouse parallax for floating hero cards */
  const onMove = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setPar({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 });
  };

  /* fade-up entrance on mount */
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(id);
  }, []);

  const enter = (d: number) => ({
    transitionDelay: `${d}ms`,
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : 'translateY(30px)',
    transition: 'opacity 1s cubic-bezier(0.22,1,0.36,1), transform 1s cubic-bezier(0.22,1,0.36,1)',
  });

  return (
    <section id="home" className="relative min-h-screen flex flex-col overflow-hidden" onMouseMove={onMove}>
      {/* ---- video background ---- */}
      <div className="absolute inset-0 -z-[5]">
        <video
          className="w-full h-full object-cover opacity-45 hero-video"
          autoPlay
          muted
          loop
          playsInline
          poster={IMAGES.heroPoster}
          aria-hidden="true"
        >
          <source src={IMAGES.heroVideo} type="video/mp4" />
        </video>
        {/* cinematic grade */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(4,6,12,0.82) 0%, rgba(4,6,12,0.55) 40%, var(--bg) 100%)' }} />
      <div className="sigil-field" />
      <div className="scanlines" />
      <div className="scan-beam" />
      {minimal && (
        <>
          {/* starfield + soft cosmic gradients */}
          <div className="starfield" />
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 55% 45% at 72% 18%, rgba(99,102,241,0.10), transparent 62%), radial-gradient(ellipse 45% 38% at 18% 82%, rgba(148,130,255,0.055), transparent 60%)',
            }}
          />
        </>
      )}
      {plasma && (
        <>
          {/* reactor chamber glow */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 50% 45% at 76% 22%, rgba(53,230,255,0.14), transparent 62%), radial-gradient(ellipse 45% 40% at 16% 84%, rgba(255,43,214,0.10), transparent 62%)',
            }}
          />
          {/* neon particle flows along circuit lanes */}
          <div className="absolute inset-0 opacity-70">
            <NeonFlow lanes={9} />
          </div>
        </>
      )}
      {warp && (
        <>
          {/* hyperspace starfield */}
          <div className="absolute inset-0">
            <WarpField count={260} />
          </div>
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 50% 46%, transparent 30%, rgba(2,4,12,0.55) 78%), radial-gradient(ellipse 40% 36% at 78% 20%, rgba(124,196,255,0.12), transparent 60%)',
            }}
          />
        </>
      )}
      {nano && (
        <>
          {/* molecular particle simulation */}
          <div className="absolute inset-0">
            <MolecularField density={0.00009} />
          </div>
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 44% 40% at 78% 22%, rgba(79,227,193,0.12), transparent 62%), radial-gradient(ellipse 40% 38% at 16% 82%, rgba(90,169,255,0.08), transparent 62%)',
            }}
          />
        </>
      )}
      {neural && (
        <>
          {/* neural interface synaptic nodes backdrop */}
          <div className="absolute inset-0 opacity-70">
            <MolecularField density={0.000065} />
          </div>
          <div
            className="absolute inset-0 animate-gravitate"
            style={{
              background:
                'radial-gradient(circle at 75% 25%, rgba(6,182,212,0.14), transparent 60%), radial-gradient(circle at 20% 75%, rgba(99,102,241,0.08), transparent 60%)',
            }}
          />
        </>
      )}
      {velvet && <VelvetAmbience />}
      {!minimal && !plasma && !warp && !nano && !velvet && !neural && <Particles density={0.00008} />}
      {/* 3D Spatial Canvas Scene */}
      {!velvet && !neural && (
        <div className="absolute inset-0 opacity-70 pointer-events-none">
          <ThreeDScene theme={realmTheme} motionMode={motionMode} />
        </div>
      )}
      {neural && (
        <div className="absolute inset-0 opacity-80 pointer-events-none">
          <ThreeDScene theme={realmTheme} motionMode={motionMode} />
        </div>
      )}
      {plasma && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <HeatShimmer>
            <PlasmaCore size={880} />
          </HeatShimmer>
        </div>
      )}
      {warp && (
        /* distant gravity-lensed core */
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div
            className="gravity-lens rounded-full"
            style={{
              width: 300, height: 300,
              background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.5) 0%, rgba(124,196,255,0.28) 22%, transparent 60%)',
            }}
          />
        </div>
      )}
      {nano && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <NanoAtom size={820} className="opacity-40" />
        </div>
      )}
      {minimal ? (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <GravField size={880} />
        </div>
      ) : !plasma && !warp && !nano && !velvet ? (
        /* great summoning circle behind the sorcerer */
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <SpellCircle size={820} opacity={0.3} />
        </div>
      ) : null}
    </div>

      <div className="flex-1 flex items-center w-full mx-auto max-w-[1440px] px-5 lg:px-10 pt-32 pb-16">
        <div className="grid lg:grid-cols-[1.12fr_0.88fr] gap-14 lg:gap-8 items-center w-full">
          {/* ================= LEFT ================= */}
          <div>
            <div style={enter(100)} className="inline-flex items-center gap-2.5 px-4 py-2 mb-7 clip-tag border border-[var(--line-strong)] bg-[var(--panel)] backdrop-blur-md">
              <span className="pulse-dot" />
              <span className={`text-[11px] tracking-[0.2em] uppercase font-head font-semibold ${lang === 'mm' ? 'font-mm' : ''}`}>{t.available}</span>
              <Star size={12} className="text-[var(--yellow)]" />
            </div>

            <p style={enter(200)} className={`font-mono2 text-sm text-[var(--cyan)] mb-3 ${lang === 'mm' ? 'font-mm' : ''}`}>
              {t.hello} <span className="text-[var(--dim)]">//</span> <span className="font-mm">{PROFILE.mmName}</span>
            </p>

            <h1 style={enter(300)} className="font-display font-black uppercase leading-[0.95] text-[clamp(2.6rem,7vw,5.4rem)]">
              <span className="grad-text glitch-flicker hero-name">{PROFILE.name}</span>
            </h1>

            {/* typing rotator */}
            <div style={enter(420)} className="mt-5 min-h-[2.4em] flex items-center">
              <Terminal size={18} className="text-[var(--pink)] mr-3 shrink-0" />
              <p className="font-head font-semibold text-lg sm:text-2xl text-[var(--dim)] tracking-wide">
                {typed}<span className="type-caret" />
              </p>
            </div>

            <p style={enter(540)} className={`mt-6 max-w-xl text-[var(--dim)] leading-relaxed ${lang === 'mm' ? 'font-mm' : ''}`}>
              {t.heroDesc}
            </p>

            {/* CTAs */}
            <div style={enter(660)} className="mt-9 flex flex-wrap gap-4">
              <Magnetic strength={0.22}>
                <a href="#projects" className="btn btn-primary clip-cy">
                  {t.viewProjects} <ArrowRight size={17} />
                </a>
              </Magnetic>
              <Magnetic strength={0.18}>
                <button onClick={downloadResume} className="btn btn-ghost clip-cy">
                  <Download size={17} /> {t.resume}
                </button>
              </Magnetic>
              <Magnetic strength={0.18}>
                <a href="#contact" className="btn btn-ghost clip-cy hidden sm:inline-flex">
                  {t.contactMe}
                </a>
              </Magnetic>
            </div>

            {/* socials */}
            <div style={enter(780)} className="mt-9 flex flex-wrap items-center gap-2.5">
              <span className="font-mono2 text-[10px] tracking-[0.25em] text-[var(--faint)] mr-2 hidden sm:block">CONNECT //</span>
              {SOCIALS.slice(0, 10).map((s) => (
                <a
                  key={s.key}
                  href={s.href}
                  target={s.href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  className="w-10 h-10 clip-cy-sm border border-[var(--line)] bg-[var(--panel)] flex items-center justify-center text-[var(--dim)] hover:text-[var(--cyan)] hover:border-[var(--cyan)] hover:shadow-[0_0_18px_rgba(0,240,255,0.3)] transition-all hover:-translate-y-1"
                >
                  <SocialIcon name={s.key} size={16} />
                </a>
              ))}
              <a href="#collections" className="font-mono2 text-[10px] tracking-widest text-[var(--cyan)] hover:text-[var(--pink)] transition-colors ml-1">
                +10 MORE
              </a>
            </div>
          </div>

          {/* ================= RIGHT — the sorcerer's portal ================= */}
          <div style={enter(500)} className={`relative mx-auto w-fit ${minimal ? 'animate-gravitate' : ''}`}>
            {neural ? (
              <>
                {/* synaptic link orbits around portrait */}
                <div className="absolute -inset-10 rounded-full border border-[rgba(6,182,212,0.25)] synapse-pulse" />
                <div className="absolute -inset-10 border border-[rgba(6,182,212,0.15)] rounded-full orbit-spin" style={{ animationDuration: '11s' }}>
                  <span className="absolute top-0 left-1/2 w-2 h-2 -ml-1 rounded-full bg-[var(--cyan)] synapse-pulse" />
                </div>
              </>
            ) : velvet ? null : nano ? (
              <>
                {/* electron shells orbiting the portrait */}
                {[
                  { rot: 0, dur: 9, c: 'var(--cyan)' },
                  { rot: 60, dur: 13, c: 'var(--pink)' },
                  { rot: 120, dur: 17, c: 'var(--yellow)' },
                ].map((s, i) => (
                  <div key={i} className="absolute -inset-8 sm:-inset-12 pointer-events-none" style={{ transform: `rotate(${s.rot}deg)` }}>
                    <div className="absolute inset-0 rounded-[100%] border" style={{ borderColor: s.c, opacity: 0.35, height: '52%', top: '24%' }} />
                    <div className="absolute inset-0 electron-shell" style={{ animationDuration: `${s.dur}s` }}>
                      <span className="absolute left-1/2 w-2.5 h-2.5 -ml-[5px] rounded-full" style={{ top: '24%', background: s.c, boxShadow: `0 0 10px ${s.c}` }} />
                    </div>
                  </div>
                ))}
              </>
            ) : warp ? (
              <HudFrame label="VESSEL // MKA-2026" className="p-3">
                {/* orbital rings around the portrait */}
                <div className="absolute -inset-5 sm:-inset-7 rounded-full border border-[var(--line)] opacity-60" style={{ transform: 'rotateX(70deg)' }} />
                <div className="absolute -inset-5 sm:-inset-7 orbit-spin" style={{ animationDuration: '14s', transform: 'rotateX(70deg)' }}>
                  <span className="absolute top-0 left-1/2 w-2 h-2 -ml-1 rounded-full bg-[var(--cyan)]" style={{ boxShadow: '0 0 12px var(--cyan)' }} />
                </div>
              </HudFrame>
            ) : plasma ? (
              <>
                {/* containment vessel around the portrait */}
                <div className="absolute -inset-6 sm:-inset-8 pointer-events-none">
                  <PlasmaCore className="!w-full !h-full" />
                </div>
                <div className="absolute -inset-6 sm:-inset-8 rounded-full border border-[var(--line-strong)] opacity-60" />
              </>
            ) : minimal ? (
              <>
                {/* thin halo + slow gravitational satellite */}
                <div className="absolute -inset-8 sm:-inset-10 rounded-full border border-white/10" />
                <div className="absolute -inset-8 sm:-inset-10 grav-orbit" style={{ animationDuration: '13s' }}>
                  <span
                    className="absolute top-0 left-1/2 w-1.5 h-1.5 -ml-[3px] rounded-full bg-white/70"
                    style={{ boxShadow: '0 0 10px rgba(255,255,255,0.5)' }}
                  />
                </div>
              </>
            ) : (
              <>
                <GlyphRain count={9} />
                <div className="ring-dashed" />
                <div className="ring-rotate" />
                {/* outer rune circle */}
                <div className="absolute -inset-14 sm:-inset-20 pointer-events-none">
                  <SpellCircle size={undefined} opacity={0.85} className="!relative !inset-auto !w-full !h-full" />
                </div>
              </>
            )}
            <div className={`relative w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] rounded-full overflow-hidden bg-[var(--bg-2)] ${velvet ? 'velvet-frame' : 'border-2 border-[var(--line-strong)]'}`}
              style={{ transform: `translate(${par.x * -14}px, ${par.y * -14}px)`, transition: 'transform 0.35s ease-out', boxShadow: velvet ? undefined : neural ? '0 0 50px -10px rgba(6,182,212,0.4), inset 0 0 30px rgba(99,102,241,0.25)' : '0 0 60px -10px rgba(240,196,106,0.35), inset 0 0 40px rgba(139,92,246,0.2)' }}>
              <img src={IMAGES.avatar} alt="Moe Kyaw Aung — the sorcerer" className="w-full h-full object-cover" loading="eager" />
              <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle at 70% 20%, transparent 52%, rgba(7,5,15,0.6))' }} />
            </div>

            {/* orbiting discipline sigils (arcane realms only) */}
            {!minimal && !plasma && !warp && !nano && !velvet && !neural && Object.values(DISCIPLINES).slice(0, 6).map((d, i) => {
              const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
              const rad = 200;
              return (
                <span
                  key={d.tech}
                  className="absolute left-1/2 top-1/2 hidden sm:block"
                  style={{ transform: `translate(-50%,-50%) translate(${Math.cos(a) * rad}px, ${Math.sin(a) * rad}px)` }}
                  title={`${d.arcane} — ${d.tech}`}
                >
                  <Sigil rune={d.rune} size={42} label={`${d.arcane} · ${d.tech}`} />
                </span>
              );
            })}

            {/* floating badges */}
            <div className="absolute -left-10 sm:-left-20 top-8 float-card" style={{ ['--fr' as string]: '-4deg', transform: `translate(${par.x * 26}px, ${par.y * 20}px)` }}>
              <div className="cyber-card clip-cy-sm px-4 py-3 flex items-center gap-3">
                <Code2 size={18} className="text-[var(--cyan)]" />
                <div>
                  <div className="font-display font-bold text-lg leading-none">12+</div>
                  <div className="font-mono2 text-[9px] tracking-[0.2em] text-[var(--faint)] mt-1">YEARS</div>
                </div>
              </div>
            </div>
            <div className="absolute -right-6 sm:-right-16 bottom-16 float-card" style={{ ['--fr' as string]: '3deg', animationDelay: '-3s', transform: `translate(${par.x * -22}px, ${par.y * -18}px)` }}>
              <div className="cyber-card clip-cy-sm px-4 py-3 flex items-center gap-3">
                <MapPin size={18} className="text-[var(--pink)]" />
                <div>
                  <div className="font-head font-bold text-sm leading-none">MM ↔ TH</div>
                  <div className="font-mono2 text-[9px] tracking-[0.2em] text-[var(--faint)] mt-1">GMT+6:30</div>
                </div>
              </div>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-5 float-card" style={{ animationDelay: '-1.5s' }}>
              <div className="cyber-card clip-tag px-5 py-2.5">
                <span className="font-mono2 text-[10px] tracking-[0.22em] text-[var(--yellow)]">100% SATISFACTION</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---- stats strip ---- */}
      <Reveal className="relative z-10 mx-auto w-full max-w-[1440px] px-5 lg:px-10 pb-10">
        <div className="cyber-card clip-cy grid grid-cols-2 md:grid-cols-4 divide-x divide-[var(--line)]">
          {STATS.map((s) => <StatCounter key={s.label} stat={s} />)}
        </div>
      </Reveal>

      {/* scroll cue */}
      <div className="relative z-10 flex justify-center pb-5">
        <a href="#about" aria-label="Scroll to about section" className={`flex flex-col items-center gap-1 text-[var(--faint)] hover:text-[var(--cyan)] transition-colors ${lang === 'mm' ? 'font-mm' : ''}`}>
          <span className="font-mono2 text-[9px] tracking-[0.3em]">{t.scroll}</span>
          <ChevronDown size={16} className="animate-bounce" />
        </a>
      </div>

      {/* tech marquee */}
      <Marquee items={MARQUEE_ITEMS} />
    </section>
  );
}
