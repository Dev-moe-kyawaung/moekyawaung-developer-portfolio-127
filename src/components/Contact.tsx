import { useState } from 'react';
import type { FormEvent } from 'react';
import { Send, MapPin, Phone, Mail, Clock, CheckCircle2, MessageSquare } from 'lucide-react';
import { PROFILE, SOCIALS } from '../data';
import { Reveal, SectionHead, SocialIcon } from './ui';

/* form state shape */
interface FormState { name: string; email: string; subject: string; message: string; }
type Errors = Partial<Record<keyof FormState, string>>;
const EMPTY: FormState = { name: '', email: '', subject: '', message: '' };

/* Myanmar validation messages */
const MM = {
  name: 'နာမည်ကို အနည်းဆုံး စာလုံး ၃ လုံး ထည့်ပေးပါ။',
  email: 'အီးမေးလ်လိပ်စာ မှန်ကန်စွာ ထည့်ပေးပါ (ဥပမာ — name@mail.com)။',
  subject: 'ခေါင်းစဉ် ထည့်ပေးပါ။',
  message: 'စာတို အနည်းဆုံး စာလုံး ၁၀ လုံး ရေးပေးပါ။',
  okTitle: 'စာရောက်ရှိသွားပါပြီ။',
  okBody: '၂၄ နာရီအတွင်း ပြန်ကြားပေးပါမည်။ အရေးကြီးပါက Telegram မှာ ဆက်သွယ်နိုင်ပါတယ်။',
};

function validate(f: FormState): Errors {
  const e: Errors = {};
  if (f.name.trim().length < 3) e.name = MM.name;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email)) e.email = MM.email;
  if (f.subject.trim().length < 2) e.subject = MM.subject;
  if (f.message.trim().length < 10) e.message = MM.message;
  return e;
}

/* Stable field component (must live outside Contact to keep focus between keystrokes) */
function Field({
  label, name, value, error, textarea = false, mm, onChange,
}: {
  label: string; name: keyof FormState; value: string; error?: string;
  textarea?: boolean; mm: string; onChange: (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}) {
  const cls = `field ${error ? 'field-error' : ''}`;
  return (
    <div>
      <label htmlFor={`f-${name}`} className="flex items-center justify-between mb-2">
        <span className="font-head font-bold tracking-widest uppercase text-xs">{label}</span>
        <span className="font-mm text-[10px] text-[var(--faint)]">{mm}</span>
      </label>
      {textarea ? (
        <textarea id={`f-${name}`} rows={5} value={value} onChange={onChange(name)} placeholder={label} className={`${cls} resize-none`} aria-invalid={!!error} />
      ) : (
        <input id={`f-${name}`} type={name === 'email' ? 'email' : 'text'} value={value} onChange={onChange(name)} placeholder={label} className={cls} aria-invalid={!!error} />
      )}
      {error && (
        <p role="alert" className="mt-2 font-mm text-xs text-[var(--pink)] flex items-center gap-1.5">
          <MessageSquare size={12} className="shrink-0" /> {error}
        </p>
      )}
    </div>
  );
}

export default function Contact({ velvet = false, index = '10' }: { velvet?: boolean; index?: string }) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((p) => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setSent(true);
      setForm(EMPTY);
      setTimeout(() => setSent(false), 7000);
    }
  };

  return (
    <section id="contact" className="relative mx-auto max-w-[1440px] px-5 lg:px-10 py-20 md:py-28">
      <SectionHead
        index={index}
        kicker="CONTACT"
        mm="ဆက်သွယ်ရန်"
        title={<>LET'S BUILD SOMETHING <span className="grad-text">RELIABLE</span></>}
        desc="Tell me about your app, your team, and your deadline. Replies within 24 hours on business days — Burmese, English or Thai."
      />

      <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 items-start">
        {/* -------- form -------- */}
        <Reveal>
          <form onSubmit={onSubmit} noValidate className="cyber-card clip-cy p-7 sm:p-9 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold tracking-widest text-sm uppercase text-[var(--cyan)]">{velvet ? 'WRITE TO ME' : 'TRANSMISSION FORM'}</h3>
              <span className="font-mono2 text-[10px] text-[var(--faint)] tracking-[0.2em]">{velvet ? 'REPLIES WITHIN 24 HOURS' : 'PGP · ENCRYPTED'}</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Your Name" name="name" mm="နာမည်" value={form.name} error={errors.name} onChange={set} />
              <Field label="Email Address" name="email" mm="အီးမေးလ်" value={form.email} error={errors.email} onChange={set} />
            </div>
            <Field label="Subject" name="subject" mm="ခေါင်းစဉ်" value={form.subject} error={errors.subject} onChange={set} />
            <Field label="Message" name="message" mm="စာတို" value={form.message} error={errors.message} onChange={set} textarea />

            <button type="submit" className="btn btn-primary clip-cy w-full justify-center">
              <Send size={16} /> SEND MESSAGE · စေလွှတ်မည်
            </button>

            {sent && (
              <div role="status" className="reveal in flex items-start gap-3 p-4 clip-cy-sm border border-[var(--green)] bg-[rgba(62,242,160,0.07)]">
                <CheckCircle2 size={20} className="text-[var(--green)] shrink-0 mt-0.5" />
                <div>
                  <p className="font-mm font-semibold text-sm text-[var(--green)]">{MM.okTitle}</p>
                  <p className="font-mm text-xs text-[var(--dim)] mt-1 leading-relaxed">{MM.okBody}</p>
                </div>
              </div>
            )}
          </form>
        </Reveal>

        {/* -------- info column -------- */}
        <div className="space-y-5">
          <Reveal variant="right" delay={90}>
            <div className="grid sm:grid-cols-2 gap-4">
              <a href={`tel:${PROFILE.phones[0].replace(/\s/g, '')}`} className="cyber-card clip-cy-sm sweep p-5 group">
                <Phone size={18} className="text-[var(--cyan)] mb-3" />
                <div className="font-mono2 text-[9px] tracking-[0.25em] text-[var(--faint)]">PRIMARY LINE</div>
                <div className="font-head font-bold text-sm mt-1.5 group-hover:text-[var(--cyan)] transition-colors">{PROFILE.phones[0]}</div>
                <div className="font-head text-xs text-[var(--dim)] mt-1">{PROFILE.phones[1]}</div>
              </a>
              <a href={`mailto:${PROFILE.primaryEmail}`} className="cyber-card clip-cy-sm sweep p-5 group">
                <Mail size={18} className="text-[var(--pink)] mb-3" />
                <div className="font-mono2 text-[9px] tracking-[0.25em] text-[var(--faint)]">EMAIL DIRECT</div>
                <div className="font-head font-bold text-sm mt-1.5 group-hover:text-[var(--pink)] transition-colors break-all">{PROFILE.primaryEmail}</div>
                <div className="font-head text-xs text-[var(--dim)] mt-1">+20 email aliases</div>
              </a>
            </div>
          </Reveal>

          <Reveal variant="right" delay={160}>
            <div className="cyber-card clip-cy-sm p-5 flex items-center gap-4">
              <span className="w-11 h-11 clip-cy-sm border border-[var(--line)] flex items-center justify-center text-[var(--yellow)] shrink-0">
                <Clock size={18} />
              </span>
              <div>
                <div className="font-head font-bold text-sm">Timezone — GMT+6:30</div>
                <div className="text-xs text-[var(--dim)] mt-1 flex items-center gap-2">
                  <span className="pulse-dot" /> Overlaps Bangkok · Singapore · EU mornings
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal variant="right" delay={220}>
            <div className="cyber-card clip-cy-sm p-5 flex items-center gap-4">
              <span className="w-11 h-11 clip-cy-sm border border-[var(--line)] flex items-center justify-center text-[var(--green)] shrink-0">
                <MapPin size={18} />
              </span>
              <div>
                <div className="font-head font-bold text-sm">{PROFILE.location}</div>
                <div className="font-mm text-xs text-[var(--dim)] mt-1">တာချီလိတ်၊ မြန်မာ ↔ ဘန်ကောက်၊ ထိုင်း</div>
              </div>
            </div>
          </Reveal>

          {/* map embed */}
          <Reveal variant="right" delay={280}>
            <div className="cyber-card clip-cy p-1.5 map-frame">
              <iframe
                title="Location map — Tachileik, Myanmar"
                src="https://maps.google.com/maps?q=Tachileik%2C%20Myanmar&t=&z=12&ie=UTF8&iwloc=&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>

          {/* social row */}
          <Reveal variant="right" delay={340}>
            <div className="flex flex-wrap gap-2.5">
              {SOCIALS.map((s) => (
                <a
                  key={s.key}
                  href={s.href}
                  target={s.href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  className="w-10 h-10 clip-cy-sm border border-[var(--line)] bg-[var(--panel)] flex items-center justify-center text-[var(--dim)] hover:text-[var(--cyan)] hover:border-[var(--cyan)] hover:-translate-y-1 transition-all"
                >
                  <SocialIcon name={s.key} size={15} />
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
