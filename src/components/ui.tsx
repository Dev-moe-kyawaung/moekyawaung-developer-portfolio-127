import type { ReactNode } from 'react';
import { GitBranch, Briefcase, MonitorPlay, Clapperboard, Mail, Phone, Send, Globe, Play,
  AtSign, BookOpen, Camera, Film, Hash, MessageCircle, CreditCard, Pin, Rss, Link2 } from 'lucide-react';
import { useInView, useCounter } from '../hooks';
import type { Stat } from '../data';

/* ---------- Reveal-on-scroll wrapper ---------- */
export function Reveal({ children, delay = 0, className = '', variant = '' }: {
  children: ReactNode; delay?: number; className?: string; variant?: 'left' | 'right' | '';
}) {
  const { ref, inView } = useInView(0.12);
  return (
    <div
      ref={ref}
      className={`reveal ${variant ? `reveal-${variant}` : ''} ${inView ? 'in' : ''} ${className}`}
      style={{ ['--rd' as string]: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ---------- Section heading ---------- */
export function SectionHead({ index, kicker, title, desc, mm }: {
  index: string; kicker: string; title: ReactNode; desc?: string; mm?: string;
}) {
  return (
    <div className="mb-12 md:mb-16">
      <Reveal>
        <div className="flex items-center gap-3 mb-4">
          <span className="kicker"><span className="kicker-line" />{`// ${index} — ${kicker}`}</span>
          {mm && <span className="font-mm text-xs text-[var(--faint)] tracking-wide">{mm}</span>}
        </div>
      </Reveal>
      <Reveal delay={90}>
        <h2 className="font-display font-800 leading-[1.05] text-3xl sm:text-4xl lg:text-5xl uppercase" style={{ fontWeight: 800 }}>
          {title}
        </h2>
      </Reveal>
      {desc && (
        <Reveal delay={180}>
          <p className="mt-5 max-w-2xl text-[var(--dim)] leading-relaxed">{desc}</p>
        </Reveal>
      )}
    </div>
  );
}

/* ---------- Animated counter stat ---------- */
export function StatCounter({ stat }: { stat: Stat }) {
  const { ref, inView } = useInView(0.4);
  const v = useCounter(stat.n, inView);
  return (
    <div ref={ref} className="text-center px-4 py-6">
      <div className="font-display text-4xl sm:text-5xl font-bold grad-text">
        {v}<span className="text-[var(--pink)]">{stat.suffix}</span>
      </div>
      <div className="mt-2 font-head font-semibold tracking-[0.18em] uppercase text-sm text-[var(--txt)]">{stat.label}</div>
      <div className="font-mm text-[11px] text-[var(--faint)] mt-1">{stat.mm}</div>
    </div>
  );
}

/* ---------- Skill progress bar (animates on scroll into view) ---------- */
export function ProgressBar({ label, val, color, note, delay = 0 }: {
  label: string; val: number; color: string; note: string; delay?: number;
}) {
  const { ref, inView } = useInView(0.4);
  return (
    <div ref={ref}>
      <div className="flex items-end justify-between mb-2">
        <div>
          <span className="font-head font-bold tracking-wide text-[15px]">{label}</span>
          <span className="ml-3 font-mono2 text-[10px] text-[var(--faint)]">{note}</span>
        </div>
        <span className="font-display text-sm" style={{ color }}>{val}%</span>
      </div>
      <div className="prog-track">
        <div
          className="prog-fill"
          style={{ width: inView ? `${val}%` : '0%', background: `linear-gradient(90deg, ${color}, transparent 160%)`, transitionDelay: `${delay}ms` }}
        />
      </div>
    </div>
  );
}

/* ---------- SVG animated progress ring ---------- */
export function ProgressRing({ label, val, color, size = 128 }: {
  label: string; val: number; color: string; size?: number;
}) {
  const { ref, inView } = useInView(0.4);
  const r = 44;
  const circ = 2 * Math.PI * r;
  return (
    <div ref={ref} className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r={r} fill="none" stroke="var(--line)" strokeWidth="7" />
          <circle
            cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={inView ? circ - (circ * val) / 100 : circ}
            style={{ transition: 'stroke-dashoffset 1.8s cubic-bezier(0.22,1,0.36,1) 0.2s', filter: `drop-shadow(0 0 6px ${color})` }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display font-bold text-xl" style={{ color }}>{val}%</span>
        </div>
      </div>
      <span className="font-head font-semibold tracking-[0.2em] uppercase text-xs text-[var(--dim)]">{label}</span>
    </div>
  );
}

/* ---------- Marquee strip ---------- */
export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="marquee border-y border-[var(--line)] bg-[var(--panel)] backdrop-blur-sm py-3">
      <div className="marquee-track">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-6 px-6 font-display text-xs sm:text-sm tracking-[0.25em] text-[var(--dim)] whitespace-nowrap">
            {t}
            <span className="w-1.5 h-1.5 rotate-45" style={{ background: i % 3 === 0 ? 'var(--cyan)' : i % 3 === 1 ? 'var(--pink)' : 'var(--yellow)' }} />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- Social icon resolver (lucide) ---------- */
const ICON_MAP: Record<string, React.ComponentType<{ size?: number | string; className?: string }>> = {
  github: GitBranch, linkedin: Briefcase, youtube: Clapperboard, instagram: Camera,
  mail: Mail, email: Mail, phone: Phone, telegram: Send, gravatar: Globe,
  playstore: Play, bluesky: AtSign, tumblr: BookOpen, flickr: Camera, vimeo: Film,
  twitch: MonitorPlay, slack: Hash, paypal: CreditCard, strikingly: Link2,
  reddit: MessageCircle, pinterest: Pin, wordpress: Rss,
};

export function SocialIcon({ name, size = 18, className = '' }: { name: string; size?: number; className?: string }) {
  const Cmp = ICON_MAP[name] ?? Globe;
  return <Cmp size={size} className={className} />;
}
