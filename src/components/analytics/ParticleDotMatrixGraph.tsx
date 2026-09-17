'use client';

import React, { useEffect, useRef, useState } from 'react';

export interface DataPoint {
  day: string;
  xp: number;
  efficiency?: number;
}

interface ParticleDotMatrixGraphProps {
  data?: DataPoint[];
  height?: number;
  title?: string;
  totalXp?: string;
}

const DEFAULT_DATA: DataPoint[] = [
  { day: 'MON', xp: 850, efficiency: 88 },
  { day: 'TUE', xp: 1250, efficiency: 94 },
  { day: 'WED', xp: 920, efficiency: 82 },
  { day: 'THU', xp: 1480, efficiency: 98 },
  { day: 'FRI', xp: 1100, efficiency: 90 },
  { day: 'SAT', xp: 1650, efficiency: 96 },
  { day: 'SUN', xp: 1300, efficiency: 92 },
];

interface Particle {
  xRatio: number; // 0 to 1 across width
  yOffset: number; // offset from interpolated curve baseline
  radius: number;
  opacity: number;
  layer: 'primary' | 'secondary' | 'ambient';
  phase: number;
  speed: number;
  amp: number;
}

export const ParticleDotMatrixGraph: React.FC<ParticleDotMatrixGraphProps> = ({
  data = DEFAULT_DATA,
  height = 280,
  title = 'XP SECURED PER DAILY NODE SYNC',
  totalXp = '+8,550 XP',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);

  // Generate particle cloud nodes once or on data change
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const particleCount = 1800;
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const xRatio = Math.random();
      const randType = Math.random();

      let layer: 'primary' | 'secondary' | 'ambient' = 'primary';
      let yOffset = 0;
      let opacity = 0.8;
      let radius = 1.2;

      if (randType < 0.55) {
        // Primary dense core
        layer = 'primary';
        // Box-muller random normal distribution
        const u1 = Math.random();
        const u2 = Math.random();
        const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        yOffset = z * 14;
        opacity = Math.max(0.2, 0.95 - Math.abs(z) * 0.25);
        radius = Math.random() < 0.2 ? 2.2 : Math.random() < 0.5 ? 1.5 : 1.0;
      } else if (randType < 0.82) {
        // Secondary lower wave ribbon
        layer = 'secondary';
        const u1 = Math.random();
        const u2 = Math.random();
        const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);
        yOffset = 35 + z * 18;
        opacity = Math.max(0.15, 0.75 - Math.abs(z) * 0.2);
        radius = Math.random() < 0.3 ? 1.8 : 1.1;
      } else {
        // Ambient outer cloud fog
        layer = 'ambient';
        yOffset = (Math.random() - 0.5) * 110;
        opacity = Math.random() * 0.35 + 0.05;
        radius = Math.random() * 1.6 + 0.6;
      }

      particles.push({
        xRatio,
        yOffset,
        radius,
        opacity,
        layer,
        phase: Math.random() * Math.PI * 2,
        speed: 0.8 + Math.random() * 1.4,
        amp: 1.5 + Math.random() * 3.5,
      });
    }

    particlesRef.current = particles;
  }, [data]);

  // Main animation canvas loop
  useEffect(() => {
    let animId: number;
    let startTime = performance.now();

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Dynamic wave baseline calculator
    const maxVal = Math.max(...data.map((d) => d.xp), 2000);

    const getYForX = (xRatio: number, w: number, h: number): number => {
      // Padding
      const padTop = 50;
      const padBottom = 60;
      const usableH = h - padTop - padBottom;

      // Find segment
      const numPoints = data.length;
      const step = 1 / (numPoints - 1);
      const index = Math.min(numPoints - 2, Math.floor(xRatio / step));
      const subRatio = (xRatio - index * step) / step;

      // Smooth cosine interpolation between data points
      const v1 = data[index].xp;
      const v2 = data[Math.min(numPoints - 1, index + 1)].xp;
      const smoothRatio = (1 - Math.cos(subRatio * Math.PI)) / 2;
      const interpXp = v1 + (v2 - v1) * smoothRatio;

      // Convert XP to canvas Y (inverted: higher XP -> smaller Y)
      const targetY = h - padBottom - (interpXp / maxVal) * usableH;
      return targetY;
    };

    const render = (time: number) => {
      const elapsed = (time - startTime) * 0.0015; // smooth time scale
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);

      ctx.clearRect(0, 0, w, h);

      // 1. Draw Pitch Black Background
      ctx.fillStyle = '#050507';
      ctx.fillRect(0, 0, w, h);

      // 2. Draw Dotted Vertical Grid Lines & Top/Bottom Header Dots (Image 1 style)
      const numGridCols = 19;
      const gridStep = w / (numGridCols + 1);

      ctx.strokeStyle = '#1E1E28';
      ctx.fillStyle = '#FFFFFF';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 4]);

      for (let i = 1; i <= numGridCols; i++) {
        const gx = gridStep * i;

        // Top dot header
        ctx.beginPath();
        ctx.arc(gx, 18, 1.4, 0, Math.PI * 2);
        ctx.fill();

        // Bottom dot footer
        ctx.beginPath();
        ctx.arc(gx, h - 28, 1.4, 0, Math.PI * 2);
        ctx.fill();

        // Vertical dotted line
        ctx.beginPath();
        ctx.moveTo(gx, 26);
        ctx.lineTo(gx, h - 34);
        ctx.stroke();
      }
      ctx.setLineDash([]); // Reset line dash

      // 3. Render Particles forming the Dataism Wave Topography
      const particles = particlesRef.current;
      const numPoints = data.length;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Horizontal position with margins
        const padX = 40;
        const px = padX + p.xRatio * (w - padX * 2);

        // Baseline Y calculation
        const baseY = getYForX(p.xRatio, w, h);

        // Sinusoidal movement over time
        const waveShift = Math.sin(elapsed * p.speed + p.phase) * p.amp;
        const py = baseY + p.yOffset + waveShift;

        // Check distance to hovered column if active
        let highlightMultiplier = 1.0;
        let pRadius = p.radius;

        if (hoveredIndex !== null) {
          const colX = padX + (hoveredIndex / (numPoints - 1)) * (w - padX * 2);
          const distToCol = Math.abs(px - colX);
          if (distToCol < 40) {
            highlightMultiplier = 1.8 - (distToCol / 40) * 0.8;
            pRadius *= 1.25;
          }
        }

        // Draw particle dot
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, p.opacity * highlightMultiplier)})`;
        ctx.beginPath();
        ctx.arc(px, py, pRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. Draw Monospace X-Axis Labels (MON..SUN) and Day Nodes
      const padX = 40;
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      for (let i = 0; i < numPoints; i++) {
        const nx = padX + (i / (numPoints - 1)) * (w - padX * 2);
        const ny = getYForX(i / (numPoints - 1), w, h);
        const isSelected = hoveredIndex === i;

        // Draw node tick marker on wave spine
        ctx.beginPath();
        ctx.arc(nx, ny, isSelected ? 4.5 : 3.0, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? '#FFFFFF' : '#8E8E93';
        ctx.fill();
        ctx.strokeStyle = '#050507';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Label text below bottom grid
        ctx.fillStyle = isSelected ? '#FFFFFF' : '#8E8E93';
        ctx.fillText(data[i].day, nx, h - 20);
      }

      // 5. Draw Hover Hairline & Highlight if user interacts
      if (hoveredIndex !== null) {
        const hx = padX + (hoveredIndex / (numPoints - 1)) * (w - padX * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(hx, 25);
        ctx.lineTo(hx, h - 30);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // 6. Draw Sleek Telemetry Corner Annotations (Matching Image 1)
      ctx.font = '9px monospace';
      ctx.textBaseline = 'bottom';

      // Bottom Left: / DATAISM MATRIX — XP_SYNC
      ctx.textAlign = 'left';
      ctx.fillStyle = '#8E8E93';
      ctx.fillText('/ Dataism — 17 // XP_SYNC', 16, h - 6);

      // Bottom Center: / CS3 — CC /.AI
      ctx.textAlign = 'center';
      ctx.fillText('/ CS3 — CC /.AI', w / 2, h - 6);

      // Bottom Right: / NODE TOTAL: +8,550 XP
      ctx.textAlign = 'right';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(`TOTAL: ${totalXp} [ACTIVE]`, w - 16, h - 6);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
    };
  }, [data, height, hoveredIndex, totalXp]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const w = rect.width;
    const padX = 40;
    const numPoints = data.length;

    // Calculate nearest data point index
    const usableW = w - padX * 2;
    const ratio = Math.max(0, Math.min(1, (clientX - padX) / usableW));
    const rawIdx = ratio * (numPoints - 1);
    const closestIdx = Math.round(rawIdx);

    setHoveredIndex(closestIdx);
    setHoverPos({ x: clientX, y: clientY });
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    setHoverPos(null);
  };

  const activeItem = hoveredIndex !== null ? data[hoveredIndex] : null;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full overflow-hidden bg-[#050507] border border-[#1E1E26] rounded-xl shadow-[0_4px_25px_rgba(0,0,0,0.95)] font-mono select-none"
    >
      {/* Top Telemetry Header */}
      <div className="flex items-center justify-between border-b border-[#1E1E26] px-5 py-3 bg-[#08080A]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FFFFFF] animate-pulse" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#FFFFFF]">
            {title}
          </h3>
        </div>

        <div className="flex items-center gap-3 text-[10px]">
          <span className="text-[#8E8E93]">MATRIX MODE:</span>
          <span className="bg-[#18181F] text-[#FFFFFF] border border-[#383848] px-2.5 py-0.5 rounded font-bold tracking-widest uppercase">
            PARTICLE TOPOGRAPHY
          </span>
        </div>
      </div>

      {/* HTML5 Canvas Surface */}
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: `${height}px`, display: 'block' }}
      />

      {/* Interactive Tooltip Card */}
      {hoveredIndex !== null && activeItem && hoverPos && (
        <div
          className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 bg-[#0A0A0E] border border-[#FFFFFF]/40 rounded-lg p-3 shadow-[0_0_20px_rgba(255,255,255,0.15)] space-y-1 backdrop-blur-md"
          style={{
            left: `${Math.max(80, Math.min(containerRef.current?.getBoundingClientRect().width || 200, hoverPos.x))}px`,
            top: `${Math.max(70, hoverPos.y - 10)}px`,
          }}
        >
          <div className="flex items-center justify-between gap-4 border-b border-[#1E1E26] pb-1">
            <span className="text-[10px] text-[#8E8E93] font-bold">NODE SYNC // {activeItem.day}</span>
            <span className="text-[10px] text-[#FFFFFF] font-extrabold bg-[#18181F] px-1.5 py-0.2 rounded">
              +{activeItem.xp} XP
            </span>
          </div>

          {activeItem.efficiency && (
            <div className="flex items-center justify-between gap-3 text-[10px] pt-0.5">
              <span className="text-[#8E8E93]">EFFICIENCY RATE:</span>
              <span className="text-[#FFFFFF] font-bold">{activeItem.efficiency}%</span>
            </div>
          )}

          <div className="text-[9px] text-[#FFFFFF] pt-0.5 flex items-center gap-1 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFFFFF]" /> MATRIX SYNCHRONIZED
          </div>
        </div>
      )}
    </div>
  );
};

export default ParticleDotMatrixGraph;
