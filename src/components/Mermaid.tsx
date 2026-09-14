import { useEffect, useRef, useState } from 'react';
import { useInView } from '../hooks';
import { Loader2, ZoomIn, ZoomOut, Maximize2, RotateCw } from 'lucide-react';

interface Props {
  chart: string;
  caption?: string;
  height?: number;
}

/**
 * Lightweight Mermaid renderer that loads the CDN library once and
 * renders a chart string into the provided container. Auto-responds
 * to the active theme (minimal/arcane/cyberpunk/etc.) by sampling
 * CSS custom properties.
 */
export function Mermaid({ chart, caption, height = 460 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const { ref: inViewRef, inView } = useInView(0.15);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [seed, setSeed] = useState(0);

  /* pick theme tokens from CSS variables so the chart matches the realm */
  const sampleTheme = () => {
    const cs = getComputedStyle(document.documentElement);
    const get = (v: string) => cs.getPropertyValue(v).trim() || '#00f0ff';
    return {
      bg: get('--bg'),
      panel: get('--bg-2'),
      txt: get('--txt'),
      dim: get('--dim'),
      line: get('--line'),
      lineStrong: get('--line-strong'),
      cyan: get('--cyan'),
      pink: get('--pink'),
      yellow: get('--yellow'),
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
          secondaryColor: t.panel,
          tertiaryColor: t.panel,
          lineColor: t.cyan,
          textColor: t.txt,
          fontSize: '13px',
          edgeLabelBackground: t.bg,
          clusterBkg: t.bg,
          clusterBorder: t.line,
        },
        flowchart: {
          curve: 'basis',
          nodeSpacing: 36,
          rankSpacing: 50,
          padding: 14,
        },
      });
      const id = `mmd-${Math.random().toString(36).slice(2, 9)}`;
      const out = await m.render(id, chart);
      ref.current.innerHTML = out.svg;
      /* wire up clickable nodes: data-cursor is added by the source */
      ref.current.querySelectorAll('[data-cursor]').forEach((el) => {
        const node = el as HTMLElement;
        node.style.cursor = 'pointer';
      });
      setStatus('ready');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to render diagram');
      setStatus('error');
    }
  };

  useEffect(() => {
    if (inView) render();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, seed]);

  /* re-render when the realm changes so colors stay in sync */
  useEffect(() => {
    const obs = new MutationObserver(() => setSeed((s) => s + 1));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);

  const reset = () => { setZoom(1); wrap.current?.scrollTo({ top: 0, left: 0, behavior: 'smooth' }); };
  const zoomBy = (d: number) => setZoom((z) => Math.min(2.4, Math.max(0.5, +(z + d).toFixed(2))));

  return (
    <figure
      ref={inViewRef}
      className="cyber-card clip-cy relative overflow-hidden"
    >
      {/* tool bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--line)] bg-[var(--bg-2)]/70">
        <div className="flex items-center gap-2 font-mono2 text-[10px] tracking-[0.2em] text-[var(--cyan)]">
          <span className="pulse-dot" />
          INTERACTIVE · FLOW DIAGRAM
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={() => zoomBy(-0.15)} aria-label="Zoom out" className="w-7 h-7 clip-cy-sm border border-[var(--line)] flex items-center justify-center text-[var(--dim)] hover:text-[var(--cyan)] hover:border-[var(--cyan)] transition-all">
            <ZoomOut size={13} />
          </button>
          <span className="w-12 text-center font-mono2 text-[10px] text-[var(--dim)]">{Math.round(zoom * 100)}%</span>
          <button onClick={() => zoomBy(0.15)} aria-label="Zoom in" className="w-7 h-7 clip-cy-sm border border-[var(--line)] flex items-center justify-center text-[var(--dim)] hover:text-[var(--cyan)] hover:border-[var(--cyan)] transition-all">
            <ZoomIn size={13} />
          </button>
          <button onClick={reset} aria-label="Reset view" className="w-7 h-7 clip-cy-sm border border-[var(--line)] flex items-center justify-center text-[var(--dim)] hover:text-[var(--pink)] hover:border-[var(--pink)] transition-all">
            <Maximize2 size={12} />
          </button>
          <button onClick={() => setSeed((s) => s + 1)} aria-label="Re-render" className="w-7 h-7 clip-cy-sm border border-[var(--line)] flex items-center justify-center text-[var(--dim)] hover:text-[var(--violet)] hover:border-[var(--violet)] transition-all">
            <RotateCw size={12} />
          </button>
        </div>
      </div>

      <div
        ref={wrap}
        className="relative w-full overflow-auto"
        style={{ height }}
      >
        <div
          ref={ref}
          className="min-w-full h-full flex items-center justify-center"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center', transition: 'transform 0.25s ease' }}
        />

        {status === 'loading' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[var(--bg)]/55 backdrop-blur-sm">
            <Loader2 size={22} className="text-[var(--cyan)] animate-spin" />
            <span className="font-mono2 text-[10px] tracking-[0.25em] text-[var(--cyan)]">COMPILING DIAGRAM</span>
          </div>
        )}

        {status === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
            <span className="font-mono2 text-[10px] tracking-[0.25em] text-[var(--pink)]">RENDER FAILED</span>
            <span className="text-xs text-[var(--dim)] max-w-md">{error}</span>
            <button onClick={() => setSeed((s) => s + 1)} className="btn btn-ghost clip-cy-sm !py-2 !px-4 text-xs">RETRY</button>
          </div>
        )}
      </div>

      {caption && (
        <figcaption className="px-4 py-2.5 border-t border-[var(--line)] font-mono2 text-[10px] tracking-[0.18em] text-[var(--dim)]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
