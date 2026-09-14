import { useState, useRef } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import { GitBranch, ExternalLink, RotateCcw, Eye, Sparkles, Layers } from 'lucide-react';
import { ArcaneDiagram } from './arcane';

interface ThreeDSpellbookProps {
  title: string;
  desc: string;
  tags: string[];
  img: string;
  diagram: string[];
  rune: string;
  accent?: string;
  badge?: string;
  repo?: string;
  href?: string;
  children?: ReactNode;
}

export function ThreeDSpellbook({
  title,
  desc,
  tags,
  img,
  diagram,
  rune,
  accent = 'var(--yellow)',
  badge = 'ANDROID SPELL',
  repo,
  href,
  children,
}: ThreeDSpellbookProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, shineX: 50, shineY: 50 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card || isFlipped) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = (x / rect.width - 0.5) * 2;
    const py = (y / rect.height - 0.5) * 2;

    setTilt({
      rx: -py * 12,
      ry: px * 14,
      shineX: (x / rect.width) * 100,
      shineY: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0, shineX: 50, shineY: 50 });
  };

  return (
    <div className="spellbook-3d-wrapper w-full h-[540px] relative group my-2">
      {/* 3D Flip Card Container */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`spellbook-3d-card ${isFlipped ? 'flipped' : ''}`}
        style={{
          transform: isFlipped
            ? 'rotateY(180deg) translateZ(10px)'
            : `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        }}
      >
        {/* ---------------- FRONT FACE (3D Layered Spellbook) ---------------- */}
        <div className="spellbook-3d-front spellbook flex flex-col clip-cy border border-[var(--line)] bg-[var(--panel)] overflow-hidden shadow-2xl">
          {/* Holographic Dynamic Shine Overlay */}
          <div
            className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
            style={{
              background: `radial-gradient(circle at ${tilt.shineX}% ${tilt.shineY}%, ${accent}25 0%, transparent 60%)`,
            }}
          />

          {/* Fore-edge Illustration with 3D Depth */}
          <div className="relative h-44 overflow-hidden border-b border-[var(--line)] ml-[11px] preserve-3d">
            <img
              src={img}
              alt={`${title} plate`}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-110"
              style={{ filter: 'saturate(0.85) contrast(1.05)' }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(180deg, transparent 15%, var(--bg) 100%), radial-gradient(circle at 70% 30%, ${accent}22, transparent 60%)`,
              }}
            />
            {/* Floating 3D Badge */}
            <span
              className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 clip-tag font-rune text-[10px] tracking-[0.2em] depth-layer-2 shadow-lg"
              style={{ color: accent, border: `1px solid ${accent}88`, background: 'rgba(10,7,20,0.85)' }}
            >
              <span className="candle">{rune}</span> {badge}
            </span>

            {/* Flip 3D Inspector Trigger Button */}
            <button
              onClick={() => setIsFlipped(true)}
              aria-label="Inspect 3D Spellbook Back Cover"
              className="absolute top-3 right-3 px-2.5 py-1 clip-cy-sm bg-[var(--bg-2)]/90 border border-[var(--line-strong)] text-[var(--yellow)] hover:border-[var(--yellow)] font-head text-[10px] tracking-widest uppercase flex items-center gap-1.5 z-20 hover:scale-105 transition-all shadow-xl"
            >
              <Eye size={12} /> 3D REVEAL
            </button>
          </div>

          {/* Body Content with Layered Depth */}
          <div className="p-5 pl-6 flex flex-col gap-3 flex-1 preserve-3d">
            <h3 className="font-display font-bold text-lg leading-tight depth-layer-1 group-hover:text-[var(--cyan)] transition-colors">
              {title}
            </h3>
            <p className="text-[13.5px] text-[var(--dim)] leading-relaxed flex-1 font-serif2 depth-layer-1">
              {desc}
            </p>

            {/* Arcane Diagram inside 3D Layer */}
            <div className="py-1 -my-1 opacity-85 group-hover:opacity-100 transition-opacity duration-500 depth-layer-2">
              <ArcaneDiagram nodes={diagram} color={accent} />
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 depth-layer-1">
              {tags.map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 font-mono2 text-[9px] tracking-[0.12em] uppercase border border-[var(--line)] text-[var(--dim)]"
                >
                  {t}
                </span>
              ))}
            </div>

            {children}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2 depth-layer-2">
              {repo && (
                <a
                  href={repo}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 text-center px-3 py-2.5 clip-tag border font-head font-bold text-[10.5px] tracking-[0.14em] uppercase transition-all flex items-center justify-center gap-1.5 hover:scale-102"
                  style={{ borderColor: `${accent}66`, color: accent }}
                >
                  <GitBranch size={13} /> Source Tome
                </a>
              )}
              {href && (
                <a
                  href={href}
                  className="flex-1 text-center px-3 py-2.5 clip-tag border border-[var(--line)] font-head font-bold text-[10.5px] tracking-[0.14em] uppercase text-[var(--dim)] hover:border-[var(--pink)] hover:text-[var(--pink)] transition-all flex items-center justify-center gap-1.5"
                >
                  <ExternalLink size={13} /> Spell Details
                </a>
              )}
            </div>
          </div>
        </div>

        {/* ---------------- BACK FACE (System Blueprint & Inscription) ---------------- */}
        <div className="spellbook-3d-back spellbook flex flex-col clip-cy border border-[var(--yellow)] bg-[var(--bg-2)] p-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="font-rune text-xl text-[var(--yellow)] candle">{rune}</span>
              <span className="font-display font-bold text-sm tracking-wider text-[var(--cyan)] uppercase">
                {title} · SYSTEM BLUEPRINT
              </span>
            </div>
            <button
              onClick={() => setIsFlipped(false)}
              className="px-3 py-1 clip-cy-sm bg-[var(--yellow)] text-black font-head font-bold text-[10px] tracking-widest uppercase flex items-center gap-1.5 hover:bg-[var(--pink)] hover:text-white transition-all"
            >
              <RotateCcw size={12} /> RETURN FRONT
            </button>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto pr-1 text-xs">
            <div>
              <span className="font-mono2 text-[9px] text-[var(--yellow)] tracking-widest block uppercase">
                // ARCHITECTURE BLUEPRINT
              </span>
              <p className="mt-1 text-[var(--dim)] leading-relaxed font-serif2">
                Multi-module architecture designed with testable data flow contracts, Room DB persistence, and
                offline-first synchronization channels.
              </p>
            </div>

            {/* Diagram Projection */}
            <div className="cyber-card clip-cy-sm p-3 bg-[var(--bg-3)]">
              <div className="font-mono2 text-[9px] text-[var(--cyan)] tracking-widest mb-2 flex items-center gap-1">
                <Layers size={11} /> LEYLINE DATA FLOW NODES
              </div>
              <div className="grid grid-cols-5 gap-1 text-center font-mono2 text-[9px]">
                {diagram.map((node, idx) => (
                  <div key={node} className="p-1 border border-[var(--line)] clip-tag text-[var(--txt)] bg-[var(--panel)]">
                    <span className="text-[var(--pink)] block">{idx + 1}</span>
                    {node}
                  </div>
                ))}
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-2 font-mono2 text-[10px]">
              <div className="cyber-card clip-cy-sm p-2.5">
                <span className="text-[var(--faint)] block">TARGET FPS</span>
                <span className="text-[var(--green)] font-bold text-sm">60 FPS Smooth</span>
              </div>
              <div className="cyber-card clip-cy-sm p-2.5">
                <span className="text-[var(--faint)] block">CRASH-FREE</span>
                <span className="text-[var(--yellow)] font-bold text-sm">99.9% Sessions</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[var(--line)] flex items-center justify-between text-[11px] font-mono2">
            <span className="text-[var(--faint)]">STATUS: VERIFIED RELEASE</span>
            <a
              href={repo || '#'}
              target="_blank"
              rel="noreferrer"
              className="text-[var(--yellow)] hover:underline flex items-center gap-1"
            >
              <Sparkles size={11} /> OPEN REPOSITORY
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
