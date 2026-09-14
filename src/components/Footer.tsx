import { useState } from 'react';
import type { FormEvent } from 'react';
import { Zap, ArrowRight, Send, Check, Heart } from 'lucide-react';
import { PROFILE, NAV_LINKS, SOCIALS } from '../data';
import { NAV_GROUPS } from '../content';
import { useCopy } from '../hooks';
import { SocialIcon } from './ui';

export default function Footer() {
  const [nlEmail, setNlEmail] = useState('');
  const [nlOk, setNlOk] = useState(false);
  const { copied, copy } = useCopy();

  const subscribe = (e: FormEvent) => {
    e.preventDefault();
    if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(nlEmail)) {
      setNlOk(true);
      setNlEmail('');
      setTimeout(() => setNlOk(false), 5200);
    }
  };

  return (
    <footer className="relative border-t border-[var(--line)] bg-[var(--bg-2)]/80 backdrop-blur-md">
      {/* top glow line */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-[var(--cyan)] to-transparent opacity-60" />

      <div className="mx-auto max-w-[1600px] px-5 lg:px-10 py-14">
        <div className="grid md:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_0.9fr_1.1fr] gap-10">
          {/* ---- brand + newsletter ---- */}
          <div>
            <a href="#home" className="flex items-center gap-3 mb-5">
              <span className="relative w-11 h-11 clip-cy-sm bg-gradient-to-br from-[var(--cyan)] to-[var(--pink)] flex items-center justify-center">
                <span className="absolute inset-[2px] clip-cy-sm bg-[var(--bg-2)] flex items-center justify-center">
                  <Zap size={18} className="text-[var(--cyan)]" />
                </span>
              </span>
              <span className="leading-none">
                <span className="block font-display font-bold text-sm tracking-[0.22em]">MOE KYAW AUNG</span>
                <span className="block font-mono2 text-[9px] tracking-[0.3em] text-[var(--faint)] mt-1">SENIOR ANDROID DEV</span>
              </span>
            </a>
            <p className="text-sm text-[var(--dim)] leading-relaxed max-w-sm mb-6">
              Building secure, scalable, user-friendly mobile experiences for 12 years —
              from Kotlin and Compose to Flutter and Firebase. <span className="font-mm text-[var(--txt)]">ကုဒ်နှင့်အတူ ယဉ်ကျေးမှု။ ရည်မှန်းချက်နှင့်အတူ တည်ဆောက်မှု။</span>
            </p>

            {/* newsletter */}
            <form onSubmit={subscribe} className="flex gap-2 max-w-sm" noValidate={false}>
              <label htmlFor="nl" className="sr-only">Email for newsletter</label>
              <input
                id="nl" type="email" required value={nlEmail} onChange={(e) => setNlEmail(e.target.value)}
                placeholder="you@company.com" className="field flex-1 !py-2.5 text-sm"
              />
              <button type="submit" aria-label="Subscribe" className="btn btn-primary clip-cy-sm !px-4 !py-2.5">
                {nlOk ? <Check size={15} /> : <Send size={15} />}
              </button>
            </form>
            {nlOk && (
              <p role="status" className="mt-2.5 font-mm text-xs text-[var(--green)]">
                စာရင်းသွင်းပြီးပါပြီ — သတင်းစာများ ရောက်လာမည်။
              </p>
            )}
          </div>

          {/* ---- quick links ---- */}
          <nav aria-label="Footer navigation">
            <h4 className="font-display font-bold tracking-[0.2em] text-xs uppercase text-[var(--cyan)] mb-5">EXPLORE</h4>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`} className="group flex items-center gap-2 text-sm text-[var(--dim)] hover:text-[var(--txt)] transition-colors">
                    <ArrowRight size={12} className="text-[var(--pink)] opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    <span className="font-head font-semibold">{l.en}</span>
                    <span className="font-mm text-[10px] text-[var(--faint)]">{l.mm}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* ---- collections ---- */}
          <div>
            <h4 className="font-display font-bold tracking-[0.2em] text-xs uppercase text-[var(--yellow)] mb-5">ARCHIVE</h4>
            <ul className="space-y-2.5 text-sm text-[var(--dim)]">
              {[
                { l: 'GitHub Accounts', n: '32 namespaces' },
                { l: 'Lovable Builds', n: '31 apps' },
                { l: 'Email Identities', n: '20 aliases' },
                { l: 'Certificates', n: '40+ verified' },
                { l: 'Repositories', n: '600+ public' },
                { l: 'Social Network', n: '20 platforms' },
              ].map((x) => (
                <li key={x.l}>
                  <a href="#collections" className="flex items-center justify-between group hover:text-[var(--txt)] transition-colors">
                    <span className="font-head font-semibold">{x.l}</span>
                    <span className="font-mono2 text-[10px] text-[var(--faint)] group-hover:text-[var(--yellow)]">{x.n}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ---- contact ---- */}
          <div>
            <h4 className="font-display font-bold tracking-[0.2em] text-xs uppercase text-[var(--pink)] mb-5">SIGNAL ME</h4>
            <ul className="space-y-3 text-sm">
              {PROFILE.phones.map((p) => (
                <li key={p}>
                  <a href={`tel:${p.replace(/\s/g, '')}`} className="font-mono2 text-xs text-[var(--dim)] hover:text-[var(--cyan)] transition-colors">{p}</a>
                </li>
              ))}
              <li>
                <button
                  onClick={() => copy(PROFILE.primaryEmail)}
                  className="font-mono2 text-xs text-[var(--dim)] hover:text-[var(--pink)] transition-colors inline-flex items-center gap-2"
                >
                  {PROFILE.primaryEmail}
                  {copied ? <Check size={11} className="text-[var(--green)]" /> : <ArrowRight size={11} />}
                </button>
              </li>
              <li className="font-mm text-xs text-[var(--faint)]">{PROFILE.location}</li>
            </ul>
            <div className="flex flex-wrap gap-2 mt-5">
              {SOCIALS.slice(0, 12).map((s) => (
                <a
                  key={s.key} href={s.href} target={s.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 clip-cy-sm border border-[var(--line)] flex items-center justify-center text-[var(--dim)] hover:text-[var(--cyan)] hover:border-[var(--cyan)] transition-all"
                >
                  <SocialIcon name={s.key} size={14} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ---- full sitemap — every page on the site ---- */}
      <div className="border-t border-[var(--line)]">
        <div className="mx-auto max-w-[1600px] px-5 lg:px-10 py-12">
          <h4 className="font-mono2 text-[9px] tracking-[0.3em] text-[var(--cyan)] uppercase mb-8">
            SITEMAP · 30 PAGES
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
            {NAV_GROUPS.map((g) => (
              <nav key={g.group} aria-label={`${g.group} pages`}>
                <h5 className="font-mono2 text-[9px] tracking-[0.2em] text-[var(--faint)] uppercase mb-3.5 pb-2 border-b border-[var(--line)]">
                  {g.group}
                </h5>
                <ul className="space-y-2">
                  {g.items.map((it) => (
                    <li key={it.to + it.label}>
                      <a
                        href={it.to ? `#/${it.to}` : '#/'}
                        className="group flex flex-col leading-tight"
                      >
                        <span className="font-head font-semibold text-[12.5px] text-[var(--dim)] group-hover:text-[var(--cyan)] transition-colors">
                          {it.label}
                        </span>
                        {it.mm && <span className="font-mm text-[9px] text-[var(--faint)]">{it.mm}</span>}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
      </div>

      {/* bottom bar */}
      <div className="border-t border-[var(--line)]">
        <div className="mx-auto max-w-[1440px] px-5 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-mono2 text-[10px] tracking-[0.2em] text-[var(--faint)]">
            © 2026 MOE KYAW AUNG · V2026.1 · ALL SYSTEMS OPERATIONAL
          </p>
          <p className="font-mono2 text-[10px] tracking-[0.2em] text-[var(--faint)] flex items-center gap-1.5">
            DESIGNED & BUILT WITH <Heart size={11} className="text-[var(--pink)]" /> IN MYANMAR
          </p>
        </div>
      </div>
    </footer>
  );
}
