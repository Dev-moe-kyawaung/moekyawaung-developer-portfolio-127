import { useState, useEffect } from 'react';
import { Palette, Sparkles, Compass, Shield, Monitor, Check } from 'lucide-react';
import type { ThemeMode } from './ThreeDScene';

interface ThemeControlDockProps {
  currentTheme: ThemeMode;
  onThemeChange: (t: ThemeMode) => void;
  motionMode: 'interactive' | 'auto' | 'reduced';
  onMotionModeChange: (m: 'interactive' | 'auto' | 'reduced') => void;
}

export function ThemeControlDock({
  currentTheme,
  onThemeChange,
  motionMode,
  onMotionModeChange,
}: ThemeControlDockProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Close dock on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const themes: { id: ThemeMode; label: string; icon: string; color: string; desc: string }[] = [
    {
      id: 'neural',
      label: 'Neural Interface',
      icon: '🧠',
      color: '#06b6d4',
      desc: 'Connected Nodes, Soft Data Lines, Luminous Synapse Trails',
    },
    {
      id: 'velvet',
      label: 'Velvet',
      icon: '❖',
      color: '#e0b973',
      desc: 'Deep Wine, Champagne Gold, Soft Glow, Playfair Typography',
    },
    {
      id: 'plasma',
      label: 'Plasma Reactor',
      icon: '⚛',
      color: '#35e6ff',
      desc: 'Rotating Energy Cores, Heatwave Distortion, Neon Particle Flows',
    },
    {
      id: 'nano',
      label: 'Nano Tech',
      icon: '⬡',
      color: '#4fe3c1',
      desc: 'Molecular Particles, Animated Bonds, Atomic Orbits, Nano-Modules',
    },
    {
      id: 'warp',
      label: 'Warp Drive',
      icon: '🛸',
      color: '#7cc4ff',
      desc: 'Hyperspace Starfield, Warp Tunnels, Gravity Lens, Ship HUD',
    },
    {
      id: 'minimal',
      label: 'Dark Energy',
      icon: '◐',
      color: '#f5f5f7',
      desc: 'Deep Black, Cosmic Gradients, Gravitational Motion — the architect\'s room',
    },
    {
      id: 'arcane',
      label: 'Arcane Grimoire',
      icon: '🔮',
      color: '#f0c46a',
      desc: 'Rune Gold & Violet Void, Gothic Vellum, Spell Circles',
    },
    {
      id: 'cyberpunk',
      label: 'Cyberpunk Matrix',
      icon: '⚡',
      color: '#00f0ff',
      desc: 'Obsidian Grid, Neon Cyan & Hot Pink, Scanlines',
    },
    {
      id: 'celestial',
      label: 'Celestial Orrery',
      icon: '🌌',
      color: '#f59e0b',
      desc: 'Cosmos Midnight, Astrolabe Gold & Sapphire Slate',
    },
  ];

  const motionOptions: { id: 'interactive' | 'auto' | 'reduced'; label: string; icon: typeof Compass }[] = [
    { id: 'interactive', label: '3D Interactive Parallax', icon: Compass },
    { id: 'auto', label: '3D Orbital Orbit', icon: Sparkles },
    { id: 'reduced', label: 'Reduced Motion (Flat)', icon: Monitor },
  ];

  return (
    <div className="fixed bottom-6 left-6 z-[92] flex items-center gap-2">
      {/* Floating Theme Switcher Trigger Badge */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open 3D Theme & Animation Controls"
        aria-expanded={isOpen}
        className="cyber-card clip-cy-sm px-4 py-2.5 flex items-center gap-2.5 bg-[var(--bg-2)]/90 border border-[var(--line-strong)] text-[var(--txt)] hover:border-[var(--yellow)] hover:scale-105 transition-all shadow-xl group"
      >
        <span className="relative flex items-center justify-center w-5 h-5">
          <Palette size={16} className="text-[var(--yellow)] group-hover:rotate-45 transition-transform" />
        </span>
        <div className="text-left font-mono2 leading-none hidden sm:block">
          <span className="block text-[9px] text-[var(--faint)] tracking-widest uppercase">THEME & 3D</span>
          <span className="block text-[11px] text-[var(--yellow)] font-bold uppercase mt-0.5">
            {currentTheme.toUpperCase()}
          </span>
        </div>
        <span className="w-2 h-2 rounded-full bg-[var(--green)] animate-ping ml-1" />
      </button>

      {/* Floating 3D HUD Control Modal Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn" onClick={() => setIsOpen(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg cyber-card clip-cy-lg p-6 sm:p-7 border border-[var(--line-strong)] bg-[var(--bg-2)] shadow-2xl relative space-y-6"
            role="dialog"
            aria-label="3D Theme and Motion Settings"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 clip-cy-sm border border-[var(--line-strong)] flex items-center justify-center text-[var(--yellow)] bg-[var(--panel)]">
                  <Sparkles size={20} />
                </span>
                <div>
                  <h3 className="font-display font-bold text-lg text-[var(--txt)] uppercase tracking-wider">
                    3D Theme & Motion Engine
                  </h3>
                  <p className="font-mono2 text-[10px] text-[var(--faint)] tracking-widest uppercase">
                    Select Realm Aesthetic & 3D Spatial Rig
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 clip-cy-sm border border-[var(--line)] flex items-center justify-center text-[var(--faint)] hover:text-[var(--pink)] hover:border-[var(--pink)] transition-all font-mono2 text-xs"
              >
                ✕
              </button>
            </div>

            {/* Theme Selection */}
            <div className="space-y-3">
              <label className="font-mono2 text-[10px] tracking-[0.2em] text-[var(--yellow)] uppercase block flex items-center gap-1.5">
                <Shield size={12} /> SELECT REALM THEME
              </label>
              <div className="grid gap-3">
                {themes.map((t) => {
                  const active = currentTheme === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        onThemeChange(t.id);
                      }}
                      className={`w-full p-4 clip-cy-sm border text-left transition-all flex items-center justify-between group ${
                        active
                          ? 'border-[var(--yellow)] bg-[var(--cyan-soft)] shadow-lg'
                          : 'border-[var(--line)] bg-[var(--panel)] hover:border-[var(--cyan)]'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <span className="text-2xl">{t.icon}</span>
                        <div>
                          <span className="font-display font-bold text-sm text-[var(--txt)] block uppercase group-hover:text-[var(--yellow)] transition-colors">
                            {t.label}
                          </span>
                          <span className="font-serif2 text-xs text-[var(--dim)] block mt-0.5">
                            {t.desc}
                          </span>
                        </div>
                      </div>
                      {active && (
                        <span className="w-6 h-6 clip-cy-sm bg-[var(--yellow)] text-black flex items-center justify-center shrink-0">
                          <Check size={14} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3D Motion Mode Selection */}
            <div className="space-y-3 pt-2 border-t border-[var(--line)]">
              <label className="font-mono2 text-[10px] tracking-[0.2em] text-[var(--cyan)] uppercase block flex items-center gap-1.5">
                <Compass size={12} /> 3D SPATIAL MOTION RIG
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {motionOptions.map((m) => {
                  const active = motionMode === m.id;
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      onClick={() => onMotionModeChange(m.id)}
                      className={`p-3 clip-tag border text-center transition-all flex flex-col items-center gap-1.5 ${
                        active
                          ? 'border-[var(--cyan)] bg-[var(--cyan-soft)] text-[var(--cyan)] font-bold'
                          : 'border-[var(--line)] text-[var(--dim)] hover:border-[var(--cyan)]'
                      }`}
                    >
                      <Icon size={16} />
                      <span className="font-mono2 text-[9.5px] uppercase tracking-wider">{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-[var(--line)] flex items-center justify-between font-mono2 text-[10px] text-[var(--faint)]">
              <span>REAL-TIME SHADER ENGINE ACTIVE</span>
              <button
                onClick={() => setIsOpen(false)}
                className="btn btn-primary clip-cy-sm !py-1.5 !px-4 text-[10px]"
              >
                APPLY THEME
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
