import { useEffect, useRef, useState } from 'react';

export type ThemeMode = 'arcane' | 'cyberpunk' | 'celestial' | 'minimal' | 'plasma' | 'warp' | 'nano' | 'velvet' | 'neural';

interface ThreeDSceneProps {
  theme: ThemeMode;
  motionMode?: 'interactive' | 'auto' | 'reduced';
  className?: string;
}

export function ThreeDScene({ theme, motionMode = 'interactive', className = '' }: ThreeDSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeShape, setActiveShape] = useState<'orrery' | 'torus' | 'cubeGrid'>('orrery');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = motionMode === 'reduced' || window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let animationFrameId = 0;

    let rotX = 0.3;
    let rotY = 0.2;
    let targetRotX = 0.3;
    let targetRotY = 0.2;

    // Track pointer position for 3D tilt
    const onMouseMove = (e: MouseEvent) => {
      if (motionMode === 'auto' || reduced) return;
      const rx = (e.clientY / window.innerHeight - 0.5) * 1.2;
      const ry = (e.clientX / window.innerWidth - 0.5) * 1.6;
      targetRotX = rx;
      targetRotY = ry;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

      // Color definitions based on active theme
      const getColors = () => {
        if (theme === 'neural') {
          return {
            primary: '#06b6d4',
            secondary: '#3b82f6',
            tertiary: '#a5f3fc',
            glow: 'rgba(6, 182, 212, 0.45)',
            grid: 'rgba(6, 182, 212, 0.06)',
          };
        }
        if (theme === 'velvet') {
          return {
            primary: '#e0b973',
            secondary: '#c96b8a',
            tertiary: '#f3d9a4',
            glow: 'rgba(224, 185, 115, 0.4)',
            grid: 'rgba(224, 185, 115, 0.06)',
          };
        }
        if (theme === 'nano') {
          return {
            primary: '#4fe3c1',
            secondary: '#5aa9ff',
            tertiary: '#c4f042',
            glow: 'rgba(79, 227, 193, 0.5)',
            grid: 'rgba(79, 227, 193, 0.08)',
          };
        }
        if (theme === 'warp') {
          return {
            primary: '#7cc4ff',
            secondary: '#c9a6ff',
            tertiary: '#5eead4',
            glow: 'rgba(124, 196, 255, 0.5)',
            grid: 'rgba(124, 196, 255, 0.08)',
          };
        }
        if (theme === 'plasma') {
          return {
            primary: '#35e6ff',
            secondary: '#ff2bd6',
            tertiary: '#ffb347',
            glow: 'rgba(53, 230, 255, 0.5)',
            grid: 'rgba(53, 230, 255, 0.09)',
          };
        }
        if (theme === 'minimal') {
          return {
            primary: '#98a5ff',
            secondary: 'rgba(255,255,255,0.6)',
            tertiary: '#6d6a9e',
            glow: 'rgba(152, 165, 255, 0.25)',
            grid: 'rgba(255, 255, 255, 0.05)',
          };
        }
        if (theme === 'cyberpunk') {
        return {
          primary: '#00f0ff',
          secondary: '#ff0055',
          tertiary: '#ffe600',
          glow: 'rgba(0, 240, 255, 0.45)',
          grid: 'rgba(0, 240, 255, 0.08)',
        };
      }
      if (theme === 'celestial') {
        return {
          primary: '#f59e0b',
          secondary: '#38bdf8',
          tertiary: '#34d399',
          glow: 'rgba(245, 158, 11, 0.45)',
          grid: 'rgba(56, 189, 248, 0.08)',
        };
      }
      // Arcane default
      return {
        primary: '#f0c46a',
        secondary: '#b08bff',
        tertiary: '#ff4d7e',
        glow: 'rgba(240, 196, 106, 0.45)',
        grid: 'rgba(176, 139, 255, 0.08)',
      };
    };

    // 3D Point Projection Engine Math
    interface Point3D {
      x: number;
      y: number;
      z: number;
    }

    const project3D = (p: Point3D, rx: number, ry: number, fov = 420, dist = 550) => {
      // Rotate Y
      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);
      const x1 = p.x * cosY + p.z * sinY;
      const z1 = -p.x * sinY + p.z * cosY;

      // Rotate X
      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);
      const y2 = p.y * cosX - z1 * sinX;
      const z2 = p.y * sinX + z1 * cosX;

      const scale = fov / (fov + z2 + dist);
      const sx = width / 2 + x1 * scale;
      const sy = height / 2 + y2 * scale;

      return { x: sx, y: sy, scale, z: z2 };
    };

    // Generate 3D Astrolabe / Orrery Concentric Rings
    const generateOrreryRings = () => {
      const rings: { points: Point3D[]; radius: number; speed: number; plane: 'xy' | 'xz' | 'yz' }[] = [];
      const numRings = 4;
      const segments = 36;

      for (let r = 0; r < numRings; r++) {
        const radius = 90 + r * 55;
        const pts: Point3D[] = [];
        for (let i = 0; i < segments; i++) {
          const theta = (i / segments) * Math.PI * 2;
          pts.push({
            x: Math.cos(theta) * radius,
            y: r % 2 === 0 ? Math.sin(theta) * radius : 0,
            z: r % 2 === 1 ? Math.sin(theta) * radius : (r === 2 ? Math.sin(theta) * (radius * 0.7) : 0),
          });
        }
        rings.push({
          points: pts,
          radius,
          speed: (r % 2 === 0 ? 1 : -1) * (0.008 + r * 0.003),
          plane: r % 3 === 0 ? 'xy' : r % 3 === 1 ? 'xz' : 'yz',
        });
      }
      return rings;
    };

    // Generate 3D Hypercube / Matrix Vertices
    const generateCubeGrid = () => {
      const pts: Point3D[] = [];
      const size = 160;
      const steps = 3;
      for (let x = -1; x <= 1; x += 2 / (steps - 1)) {
        for (let y = -1; y <= 1; y += 2 / (steps - 1)) {
          for (let z = -1; z <= 1; z += 2 / (steps - 1)) {
            pts.push({ x: (x * size) / 2, y: (y * size) / 2, z: (z * size) / 2 });
          }
        }
      }
      return pts;
    };

    const orreryRings = generateOrreryRings();
    const cubeVertices = generateCubeGrid();

    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const colors = getColors();

      // Smooth interpolation to target rotations
      rotX += (targetRotX - rotX) * 0.05;
      rotY += (targetRotY - rotY) * 0.05;

      /* dark-energy rotates at a gravitational, almost imperceptible pace */
      const base = theme === 'minimal' ? 0.0028 : 0.008;
      angle += motionMode === 'auto' ? base : base * 0.5;

      const totalRx = rotX + Math.sin(angle * 0.5) * 0.15;
      const totalRy = rotY + angle;

      // Draw 3D Astrolabe Rings
      orreryRings.forEach((ring, index) => {
        const ringAngle = angle * (index % 2 === 0 ? 1 : -1.3);
        const projectedPts = ring.points.map((pt) => {
          // Apply individual ring rotation around Y or X
          const rxInner = pt.x * Math.cos(ringAngle) - pt.z * Math.sin(ringAngle);
          const rzInner = pt.x * Math.sin(ringAngle) + pt.z * Math.cos(ringAngle);
          return project3D({ x: rxInner, y: pt.y, z: rzInner }, totalRx, totalRy);
        });

        // Draw ring polygon path
        ctx.beginPath();
        projectedPts.forEach((p, idx) => {
          if (idx === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.closePath();

        const color = index % 3 === 0 ? colors.primary : index % 3 === 1 ? colors.secondary : colors.tertiary;
        ctx.strokeStyle = color;
        ctx.lineWidth = index === 0 ? 1.8 : 1.1;
        ctx.globalAlpha = 0.5 + Math.sin(angle + index) * 0.2;
        ctx.stroke();

        // Draw 3D nodes on ring vertices
        projectedPts.forEach((p, idx) => {
          if (idx % 6 === 0) {
            ctx.fillStyle = color;
            ctx.shadowColor = color;
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.arc(p.x, p.y, Math.max(1.5, 3.5 * p.scale), 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        });
      });

      // Draw 3D Floating Cube Grid Lines
      const projCube = cubeVertices.map((v) => project3D(v, totalRx * 0.7, totalRy * 0.7));
      ctx.globalAlpha = 0.25;
      ctx.strokeStyle = colors.secondary;
      ctx.lineWidth = 0.8;

      for (let i = 0; i < projCube.length; i++) {
        for (let j = i + 1; j < projCube.length; j++) {
          const p1 = projCube[i];
          const p2 = projCube[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1.0;

      if (!reduced) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', resize);
    };
  }, [theme, motionMode, activeShape]);

  return (
    <div className={`relative w-full h-full min-h-[320px] overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full block" />
      {/* Interactive 3D Geometry Selector HUD */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 clip-tag border border-[var(--line)] bg-[var(--bg-2)]/90 backdrop-blur-md z-10 font-mono2 text-[10px] tracking-widest text-[var(--dim)]">
        <span className="text-[var(--yellow)]">3D MESH:</span>
        <button
          onClick={() => setActiveShape('orrery')}
          className={`px-2 py-0.5 clip-tag transition-all ${
            activeShape === 'orrery' ? 'bg-[var(--cyan)] text-black font-bold' : 'hover:text-[var(--txt)]'
          }`}
        >
          ORRERY
        </button>
        <button
          onClick={() => setActiveShape('torus')}
          className={`px-2 py-0.5 clip-tag transition-all ${
            activeShape === 'torus' ? 'bg-[var(--pink)] text-black font-bold' : 'hover:text-[var(--txt)]'
          }`}
        >
          TORUS
        </button>
        <button
          onClick={() => setActiveShape('cubeGrid')}
          className={`px-2 py-0.5 clip-tag transition-all ${
            activeShape === 'cubeGrid' ? 'bg-[var(--yellow)] text-black font-bold' : 'hover:text-[var(--txt)]'
          }`}
        >
          HYPERCUBE
        </button>
      </div>
    </div>
  );
}


