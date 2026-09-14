import { useEffect, useRef, useState } from 'react';
import { useInView } from '../hooks';
import { Loader2 } from 'lucide-react';

interface Props { chart: string; }

/** Render-only variant of Mermaid — no toolbar, no zoom. For inline spotlights. */
export function MermaidLite({ chart }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { ref: inViewRef, inView } = useInView(0.15);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const sampleTheme = () => {
    const cs = getComputedStyle(document.documentElement);
    const get = (v: string) => cs.getPropertyValue(v).trim() || '#00f0ff';
    return {
      bg: get('--bg'),
      panel: get('--bg-2'),
      txt: get('--txt'),
      line: get('--line'),
      cyan: get('--cyan'),
      pink: get('--pink'),
      violet: get('--violet'),
      green: get('--green'),
    };
  };

  const render = async () => {
    if (!ref.current) return;
    setStatus('loading');
    setError(null);
    try {
      const w = window as unknown as { mermaid?: { initialize: (cfg: object) => void; render: (id: string, src: string) => Promise<{ svg: string }> } };
      if (!w.mermaid) {
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement('script');
          s.type = 'module';
          s.src = 'https://cdn.jsdelivr.net/npm/mermaid@10.9.1/dist/mermaid.esm.min.mjs';
          s.onload = () => resolve();
          s.onerror = () => reject(new Error('Could not load Mermaid runtime'));
          document.head.appendChild(s);
        });
      }
      const m = w.mermaid!;
      const t = sampleTheme();
      m.initialize({
        startOnLoad: false,
        securityLevel: 'loose',
        fontFamily: 'JetBrains Mono, monospace',
        theme: 'base',
        themeVariables: {
          background: t.panel,
          primaryColor: t.panel,
          primaryTextColor: t.txt,
          primaryBorderColor: t.cyan,
          lineColor: t.cyan,
          textColor: t.txt,
          fontSize: '12px',
          edgeLabelBackground: t.bg,
          clusterBkg: t.bg,
          clusterBorder: t.line,
        },
        flowchart: { curve: 'basis', nodeSpacing: 30, rankSpacing: 40, padding: 12 },
      });
      const id = `mmd-lite-${Math.random().toString(36).slice(2, 9)}`;
      const out = await m.render(id, chart);
      ref.current.innerHTML = out.svg;
      setStatus('ready');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to render diagram');
      setStatus('error');
    }
  };

  useEffect(() => {
    if (inView) render();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  useEffect(() => {
    const obs = new MutationObserver(() => {
      if (ref.current && inView) render();
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <div ref={inViewRef} className="relative w-full h-full overflow-hidden">
      <div ref={ref} className="w-full h-full flex items-center justify-center" />
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-[var(--bg)]/40 backdrop-blur-[1px]">
          <Loader2 size={16} className="text-[var(--cyan)] animate-spin" />
          <span className="font-mono2 text-[9px] tracking-[0.25em] text-[var(--cyan)]">COMPILING</span>
        </div>
      )}
      {status === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center p-3 text-center">
          <span className="text-[11px] text-[var(--pink)] max-w-xs">{error}</span>
        </div>
      )}
    </div>
  );
}
