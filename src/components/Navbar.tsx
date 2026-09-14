import { useEffect, useState } from 'react';
import { Menu, X, Sun, Moon, Languages, Zap, ChevronDown } from 'lucide-react';
import { NAV_LINKS, I18N } from '../data';
import type { Lang } from '../data';
import { NAV_GROUPS } from '../content';
import { useScrollY, useLang } from '../hooks';
import { Link, useRoute } from '../lib/router';
import { CommandPalette } from './premium';

interface Props {
  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;
  setLang: (l: Lang) => void;
}

export default function Navbar({ theme, setTheme, setLang }: Props) {
  const y = useScrollY();
  const lang = useLang();
  const route = useRoute();
  const t = I18N[lang];
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const [active, setActive] = useState('home');

  /* scrollspy only matters on the landing page */
  useEffect(() => {
    if (route !== '') return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-38% 0px -55% 0px' }
    );
    NAV_LINKS.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [route]);

  /* close the mega menu on click-outside or Escape */
  useEffect(() => {
    if (!mega) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMega(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mega]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  /* primary links only make sense on home — elsewhere they route */
  const home = route === '';

  const LangToggle = ({ className = '' }: { className?: string }) => (
    <div className={`flex items-center border border-[var(--line)] clip-tag overflow-hidden ${className}`} role="group" aria-label="Language">
      {(['en', 'mm'] as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`px-3 py-1.5 font-head font-semibold text-xs tracking-widest transition-colors ${
            lang === l ? 'bg-[var(--cyan)] text-black' : 'text-[var(--dim)] hover:text-[var(--txt)]'
          }`}
        >
          {l === 'en' ? 'EN' : 'မြန်မာ'}
        </button>
      ))}
    </div>
  );

  return (
    <>
      <header className={`nav-shell fixed top-0 inset-x-0 z-50 ${y > 40 ? 'scrolled' : ''}`}>
        <nav className="mx-auto max-w-[1600px] px-5 lg:px-10 h-[76px] flex items-center justify-between gap-4" aria-label="Primary">
          {/* ---------- logo ---------- */}
          <Link to="" className="flex items-center gap-3 shrink-0 group" ariaLabel="Home">
            <span className="relative w-11 h-11 clip-cy-sm bg-gradient-to-br from-[var(--cyan)] to-[var(--pink)] flex items-center justify-center">
              <span className="absolute inset-[2px] clip-cy-sm bg-[var(--bg)] flex items-center justify-center">
                <Zap size={18} className="text-[var(--cyan)] group-hover:rotate-12 transition-transform" />
              </span>
            </span>
            <span className="leading-none hidden sm:block">
              <span className="block font-display font-bold text-sm tracking-[0.22em]">MKA</span>
              <span className="block font-mono2 text-[9px] tracking-[0.3em] text-[var(--faint)] mt-1">ANDROID · DEV</span>
            </span>
          </Link>

          {/* ---------- desktop links ---------- */}
          <ul className="hidden xl:flex items-center gap-6">
            {NAV_LINKS.slice(0, 5).map((l) => {
              const isActive = home ? active === l.id : route === l.id;
              return (
                <li key={l.id}>
                  {home ? (
                    <a href={`#${l.id}`} className={`nav-link flex flex-col items-center leading-none ${isActive ? 'active' : ''}`}>
                      <span className="font-head font-semibold text-[13px] tracking-[0.14em] uppercase">{l.en}</span>
                      <span className="font-mm text-[9px] text-[var(--faint)] mt-1">{l.mm}</span>
                    </a>
                  ) : (
                    <Link to={l.id === 'home' ? '' : l.id} className={`nav-link flex flex-col items-center leading-none ${isActive ? 'active' : ''}`}>
                      <span className="font-head font-semibold text-[13px] tracking-[0.14em] uppercase">{l.en}</span>
                      <span className="font-mm text-[9px] text-[var(--faint)] mt-1">{l.mm}</span>
                    </Link>
                  )}
                </li>
              );
            })}

            {/* mega menu trigger */}
            <li className="relative" onMouseEnter={() => setMega(true)} onMouseLeave={() => setMega(false)}>
              <button
                onClick={() => setMega((p) => !p)}
                aria-expanded={mega}
                aria-haspopup="true"
                className="nav-link flex flex-col items-center leading-none"
              >
                <span className="flex items-center gap-1.5 font-head font-semibold text-[13px] tracking-[0.14em] uppercase">
                  Explore <ChevronDown size={12} className={`transition-transform duration-300 ${mega ? 'rotate-180 text-[var(--cyan)]' : ''}`} />
                </span>
                <span className="font-mm text-[9px] text-[var(--faint)] mt-1">အားလုံး</span>
              </button>

              {/* ---------- mega panel ---------- */}
              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-300 ${mega ? 'visible opacity-100 translate-y-0' : 'invisible opacity-0 -translate-y-2'}`}
              >
                <div className="w-[min(90vw,1080px)] cyber-card clip-cy-lg !bg-[var(--bg-2)] p-7 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-7">
                  {NAV_GROUPS.map((g) => (
                    <div key={g.group}>
                      <h3 className="font-mono2 text-[9px] tracking-[0.25em] text-[var(--cyan)] uppercase mb-4 pb-2 border-b border-[var(--line)]">{g.group}</h3>
                      <ul className="space-y-2.5">
                        {g.items.map((it) => (
                          <li key={it.to}>
                            <Link
                              to={it.to}
                              className="group flex flex-col leading-tight"
                            >
                              <span className="font-head font-semibold text-[13px] text-[var(--dim)] group-hover:text-[var(--cyan)] transition-colors">
                                {it.label}
                              </span>
                              {it.mm && <span className="font-mm text-[9px] text-[var(--faint)]">{it.mm}</span>}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </li>
          </ul>

          {/* ---------- actions ---------- */}
          <div className="flex items-center gap-2.5">
            <CommandPalette />
            <LangToggle className="hidden md:flex" />
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="w-9 h-9 flex items-center justify-center border border-[var(--line)] clip-cy-sm text-[var(--dim)] hover:text-[var(--cyan)] hover:border-[var(--cyan)] transition-all"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <Link to="contact" className="hidden lg:inline-flex btn btn-primary clip-cy-sm !py-2.5 !px-5 text-xs">
              {t.contactMe}
            </Link>
            <button
              className="xl:hidden w-10 h-10 flex items-center justify-center border border-[var(--line)] clip-cy-sm text-[var(--cyan)]"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
            >
              <Menu size={20} />
            </button>
          </div>
        </nav>

        {/* reading progress */}
        <div className="h-[2px] bg-transparent">
          <div
            className="h-full bg-gradient-to-r from-[var(--cyan)] via-[var(--yellow)] to-[var(--pink)]"
            style={{ width: `${Math.min(100, (y / Math.max(1, document.body.scrollHeight - innerHeight)) * 100)}%`, transition: 'width 0.15s linear' }}
          />
        </div>
      </header>

      {/* ============ MOBILE DRAWER ============ */}
      <div className={`fixed inset-0 z-[60] xl:hidden transition-all duration-500 ${open ? 'visible opacity-100' : 'invisible opacity-0'}`}>
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setOpen(false)} aria-hidden="true" />
        <aside
          className={`absolute right-0 top-0 h-full w-[88%] max-w-sm bg-[var(--bg-2)] border-l border-[var(--line)] flex flex-col overflow-y-auto transition-transform duration-500 ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile menu"
        >
          <div className="sticky top-0 bg-[var(--bg-2)] flex items-center justify-between p-6 border-b border-[var(--line)]">
            <span className="kicker flex items-center gap-2"><Languages size={12} />ALL PAGES</span>
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="w-10 h-10 flex items-center justify-center border border-[var(--line)] clip-cy-sm text-[var(--pink)]">
              <X size={20} />
            </button>
          </div>

          <div className="p-6 space-y-7">
            {NAV_GROUPS.map((g) => (
              <nav key={g.group} aria-label={g.group}>
                <h3 className="font-mono2 text-[9px] tracking-[0.25em] text-[var(--cyan)] uppercase mb-3">{g.group}</h3>
                <ul className="space-y-1">
                  {g.items.map((it) => (
                    <li key={it.to + it.label}>
                      <Link
                        to={it.to}
                        className="flex items-center justify-between px-3.5 py-2.5 border border-transparent hover:border-[var(--line)] hover:bg-[var(--cyan-soft)] transition-all group"
                      >
                        <span className="font-head font-bold tracking-[0.1em] uppercase text-sm group-hover:text-[var(--cyan)] transition-colors">{it.label}</span>
                        {it.mm && <span className="font-mm text-[10px] text-[var(--faint)]">{it.mm}</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <div className="mt-auto sticky bottom-0 bg-[var(--bg-2)] border-t border-[var(--line)] p-6 flex flex-col gap-4">
            <LangToggle />
            <Link to="contact" className="btn btn-primary clip-cy-sm justify-center">{t.contactMe}</Link>
            <p className="font-mm text-xs text-[var(--faint)] text-center">{t.available}</p>
          </div>
        </aside>
      </div>
    </>
  );
}
