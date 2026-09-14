import { useState } from 'react';
import { ShieldCheck, ExternalLink, Copy, Check, Mail, GitBranch, Globe, Sparkles } from 'lucide-react';
import { CERTS, CERT_CATS, GITHUB_ACCOUNTS, LOVABLE_APPS, EMAILS, SOCIALS } from '../data';
import { useCopy } from '../hooks';
import { Reveal, SectionHead, SocialIcon } from './ui';

/* ============ CERTIFICATES — filterable credential gallery ============ */
export function Certificates() {
  const [cat, setCat] = useState<string>('All');
  const cats = CERT_CATS as readonly string[];
  const list = cat === 'All' ? CERTS : CERTS.filter((c) => c.cat === cat);

  return (
    <section id="certificates" className="relative mx-auto max-w-[1440px] px-5 lg:px-10 py-20 md:py-28">
      <SectionHead
        index="05"
        kicker="CERTIFICATES"
        mm="လက်မှတ်များ"
        title={<>CREDENTIAL <span className="grad-text">VAULT</span></>}
        desc="40+ verified certifications across 9 domains — programming languages, web, mobile, databases, AI/ML, security, blockchain, software engineering and business. Each card links to a verifiable certificate ID."
      />

      {/* category filters */}
      <Reveal>
        <div className="flex flex-wrap gap-2 mb-10">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              aria-pressed={cat === c}
              className={`px-4 py-2 clip-tag font-head font-semibold tracking-[0.12em] uppercase text-[11px] border transition-all ${
                cat === c
                  ? 'bg-gradient-to-r from-[var(--yellow)] to-[var(--pink)] text-black border-transparent'
                  : 'border-[var(--line)] text-[var(--dim)] hover:border-[var(--yellow)] hover:text-[var(--txt)]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </Reveal>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {list.map((cert, i) => (
          <Reveal key={cert.id} delay={(i % 4) * 70}>
            <a
              href={`https://www.programminghub.io/certificate?id=${cert.id}`}
              target="_blank"
              rel="noreferrer"
              className="cyber-card clip-cy-sm sweep p-5 flex flex-col gap-3 h-full group"
            >
              <div className="flex items-start justify-between">
                <span className="w-10 h-10 clip-cy-sm border border-[var(--line)] flex items-center justify-center text-[var(--yellow)] group-hover:text-[var(--cyan)] transition-colors">
                  <ShieldCheck size={18} />
                </span>
                <ExternalLink size={14} className="text-[var(--faint)] group-hover:text-[var(--pink)] transition-colors" />
              </div>
              <h3 className="font-head font-bold text-[15px] leading-snug">{cert.name}</h3>
              <div className="mt-auto flex items-center justify-between font-mono2 text-[10px] text-[var(--faint)]">
                <span className="tracking-[0.12em]">{cert.date.toUpperCase()}</span>
                <span className="tracking-wider">#{cert.id.slice(-6)}</span>
              </div>
              <span className="font-mono2 text-[9px] tracking-[0.18em] uppercase px-2 py-1 clip-tag border border-[var(--line)] text-[var(--cyan)] w-fit">
                {cert.cat}
              </span>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ============ COLLECTIONS — GitHub / Lovable / Email / Social ============ */
type Tab = 'github' | 'lovable' | 'email' | 'social';
const TABS: { id: Tab; label: string; mm: string; count: number }[] = [
  { id: 'github', label: 'GitHub Accounts', mm: 'ဂစ်ဟပ်', count: GITHUB_ACCOUNTS.length },
  { id: 'lovable', label: 'Lovable Apps', mm: 'လဗ်ဘယ်', count: LOVABLE_APPS.length },
  { id: 'email', label: 'Email Collection', mm: 'အီးမေးလ်', count: EMAILS.length },
  { id: 'social', label: 'Social Network', mm: 'ဆိုရှယ်', count: SOCIALS.length },
];

const subdomain = (url: string) => {
  try {
    return new URL(url).hostname.split('.')[0];
  } catch {
    return url;
  }
};

function EmailCard({ email }: { email: string }) {
  const { copied, copy } = useCopy();
  return (
    <div className="cyber-card clip-cy-sm p-4 flex items-center justify-between gap-3 group">
      <a href={`mailto:${email}`} className="flex items-center gap-3 min-w-0">
        <span className="w-9 h-9 shrink-0 clip-cy-sm border border-[var(--line)] flex items-center justify-center text-[var(--pink)]">
          <Mail size={15} />
        </span>
        <span className="font-mono2 text-xs text-[var(--dim)] group-hover:text-[var(--cyan)] transition-colors truncate">{email}</span>
      </a>
      <button
        onClick={() => copy(email)}
        aria-label={`Copy ${email}`}
        className="w-8 h-8 shrink-0 flex items-center justify-center border border-[var(--line)] clip-cy-sm text-[var(--dim)] hover:text-[var(--cyan)] hover:border-[var(--cyan)] transition-all"
      >
        {copied ? <Check size={13} className="text-[var(--green)]" /> : <Copy size={13} />}
      </button>
    </div>
  );
}

export function Collections() {
  const [tab, setTab] = useState<Tab>('github');

  return (
    <section id="collections" className="relative mx-auto max-w-[1440px] px-5 lg:px-10 py-20 md:py-28">
      <SectionHead
        index="06"
        kicker="COLLECTIONS"
        mm="စုစည်းမှုများ"
        title={<>THE <span className="grad-text">ARCHIVE</span></>}
        desc="One developer, many namespaces. GitHub organizations, Lovable builds, verified email identities and a full social network — all maintained under one brand."
      />

      {/* tab bar */}
      <Reveal>
        <div className="flex flex-wrap gap-2.5 mb-10">
          {TABS.map((tb) => (
            <button
              key={tb.id}
              onClick={() => setTab(tb.id)}
              aria-pressed={tab === tb.id}
              className={`flex items-center gap-3 px-5 py-3 clip-tag border font-head font-bold tracking-[0.12em] uppercase text-xs transition-all ${
                tab === tb.id
                  ? 'bg-gradient-to-r from-[var(--cyan)] to-[var(--violet)] text-black border-transparent'
                  : 'border-[var(--line)] text-[var(--dim)] hover:border-[var(--cyan)] hover:text-[var(--txt)]'
              }`}
            >
              {tab === tb.id ? <Sparkles size={13} /> : <Globe size={13} className="opacity-60" />}
              {tb.label}
              <span className={`font-mono2 text-[9px] px-1.5 py-0.5 ${tab === tb.id ? 'bg-black/25 text-black' : 'bg-[var(--cyan-soft)] text-[var(--cyan)]'}`}>
                {tb.count}
              </span>
            </button>
          ))}
        </div>
      </Reveal>

      {/* ---- GITHUB ---- */}
      {tab === 'github' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {GITHUB_ACCOUNTS.map((u, i) => (
            <Reveal key={u + i} delay={(i % 4) * 50}>
              <a
                href={u}
                target="_blank"
                rel="noreferrer"
                className="cyber-card clip-cy-sm p-4 flex items-center gap-3 group"
              >
                <span className="w-9 h-9 shrink-0 clip-cy-sm bg-gradient-to-br from-[var(--cyan)] to-[var(--violet)] p-[1px]">
                  <span className="w-full h-full clip-cy-sm bg-[var(--bg-2)] flex items-center justify-center text-[var(--cyan)]">
                    <GitBranch size={14} />
                  </span>
                </span>
                <span className="min-w-0">
                  <span className="block font-head font-bold text-[13px] truncate group-hover:text-[var(--cyan)] transition-colors">
                    {subdomain(u)}
                  </span>
                  <span className="block font-mono2 text-[9px] text-[var(--faint)] tracking-wider">.github.io</span>
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      )}

      {/* ---- LOVABLE ---- */}
      {tab === 'lovable' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {LOVABLE_APPS.map((u, i) => (
            <Reveal key={u + i} delay={(i % 4) * 50}>
              <a
                href={u}
                target="_blank"
                rel="noreferrer"
                className="cyber-card clip-cy-sm p-4 flex items-center gap-3 group"
              >
                <span className="w-9 h-9 shrink-0 clip-cy-sm bg-gradient-to-br from-[var(--pink)] to-[var(--yellow)] p-[1px]">
                  <span className="w-full h-full clip-cy-sm bg-[var(--bg-2)] flex items-center justify-center text-[var(--pink)]">
                    <Sparkles size={14} />
                  </span>
                </span>
                <span className="min-w-0">
                  <span className="block font-head font-bold text-[13px] truncate group-hover:text-[var(--pink)] transition-colors">
                    {subdomain(u)}
                  </span>
                  <span className="block font-mono2 text-[9px] text-[var(--faint)] tracking-wider">.lovable.app</span>
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      )}

      {/* ---- EMAIL ---- */}
      {tab === 'email' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {EMAILS.map((e, i) => (
            <Reveal key={e} delay={(i % 3) * 60}>
              <EmailCard email={e} />
            </Reveal>
          ))}
        </div>
      )}

      {/* ---- SOCIAL ---- */}
      {tab === 'social' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {SOCIALS.map((s, i) => (
            <Reveal key={s.key} delay={(i % 5) * 50}>
              <a
                href={s.href}
                target={s.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="cyber-card clip-cy-sm sweep p-4 flex items-center gap-3.5 group"
              >
                <span className="w-11 h-11 shrink-0 clip-cy-sm border border-[var(--line)] flex items-center justify-center text-[var(--cyan)] group-hover:text-[var(--pink)] group-hover:border-[var(--pink)] transition-colors">
                  <SocialIcon name={s.key} size={18} />
                </span>
                <span className="min-w-0">
                  <span className="block font-head font-bold text-sm group-hover:text-[var(--cyan)] transition-colors">{s.label}</span>
                  <span className="block font-mono2 text-[9px] text-[var(--faint)] truncate">{s.handle}</span>
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
