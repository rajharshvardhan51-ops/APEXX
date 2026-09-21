'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Compass, Cpu, Maximize2, Radio, Terminal, Crosshair, Activity, Layers } from 'lucide-react';
import { useWeatherLocation } from '@/hooks/useWeatherLocation';

export interface SummitTopologyProps {
  growthPercentage?: number; // 0 to 100 (backwards compatibility)
  completionIndex?: number;  // 0 to 100
  className?: string;
}

// Inner 3D Point-Cloud Scene Component with Custom GLSL Shader
const SummitPointCloud: React.FC<{ completionIndex: number }> = ({ completionIndex }) => {
  const groupRef = useRef<THREE.Group>(null);
  const shaderRef = useRef<THREE.ShaderMaterial>(null);

  // High-resolution plane geometry (220 x 220 = 48,400 vertices)
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(11, 11, 220, 220);
    geo.rotateX(-Math.PI / 2); // Lay horizontal
    return geo;
  }, []);

  // Custom GLSL Shader Material for sharp alpine ridged noise & radar elevation
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uCompletion: { value: completionIndex / 100 },
        uMaxHeight: { value: 3.4 },
        uPointSize: { value: 1.35 },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uCompletion;
        uniform float uMaxHeight;
        uniform float uPointSize;

        varying float vElevation;
        varying float vDist;
        varying float vRadarSweep;
        varying float vContour;
        varying vec2 vPosition;

        // 2D Simplex Noise generator
        vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

        float snoise(vec2 v) {
          const vec4 C = vec4(
            0.211324865405187,
            0.366025403784439,
           -0.577350269189626,
            0.024390243902439
          );
          vec2 i  = floor(v + dot(v, C.yy));
          vec2 x0 = v - i + dot(i, C.xx);
          vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod(i, 289.0);
          vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
          vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
          m = m * m;
          m = m * m;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
          vec3 g;
          g.x  = a0.x  * x0.x  + h.x  * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }

        // Ridged noise for sharp alpine mountain peaks
        float ridgedNoise(vec2 p) {
          return 1.0 - abs(snoise(p));
        }

        // Alpine Ridged Noise & Multi-Peak Crown Synthesis
        float alpineTerrain(vec2 p) {
          float elevation = 0.0;
          float weight = 0.72;
          float freq = 0.48;
          for (int i = 0; i < 5; i++) {
            float r = ridgedNoise(p * freq);
            r = pow(r, 2.4); // Razor-sharp cresting
            elevation += r * weight;
            freq *= 2.1;
            weight *= 0.42;
          }

          // Main Tall Back Spire Pinnacle (matching high center pinnacle in reference image)
          float mainSpire = exp(-dot((p - vec2(0.0, -0.15)) * vec2(1.2, 0.85), (p - vec2(0.0, -0.15)) * vec2(1.2, 0.85)) * 2.2) * 2.8;

          // Front & Side Crown Pinnacles (Cluster of sharp peaks forming the alpine crown)
          float peakLeft  = exp(-dot((p - vec2(-0.45, 0.20)) * 2.4, (p - vec2(-0.45, 0.20)) * 2.4)) * 1.6;
          float peakRight = exp(-dot((p - vec2(0.50, 0.15)) * 2.2, (p - vec2(0.50, 0.15)) * 2.2)) * 1.7;
          float peakFront = exp(-dot((p - vec2(0.05, 0.40)) * 2.5, (p - vec2(0.05, 0.40)) * 2.5)) * 1.4;

          elevation += mainSpire + peakLeft + peakRight + peakFront;

          return elevation;
        }

        void main() {
          vec3 pos = position;
          float dist = length(pos.xz);
          vDist = dist;
          vPosition = pos.xz;

          // Smooth radial boundary falloff
          float centerFactor = pow(max(0.0, 1.0 - dist / 5.2), 1.4);

          // Calculate alpine ridge height with multi-peak crown
          float rawHeight = alpineTerrain(pos.xz * 0.45);

          // Live radar sweep radial modulation
          float sweepAngle = atan(pos.z, pos.x) + uTime * 0.8;
          float radarWave = sin(sweepAngle * 2.5 - dist * 1.8) * 0.05 * centerFactor;
          vRadarSweep = sin(sweepAngle * 3.0);

          // Completion index height scale (0.0 -> 1.0)
          float heightScale = 0.65 + uCompletion * 2.8;
          float elevation = pow(rawHeight, 1.3) * centerFactor * uMaxHeight * heightScale + radarWave;
          pos.y = max(0.0, elevation);
          vElevation = pos.y;

          // Combined horizontal AND radial contour factor for stunning top-view & side-view geometry
          float hContour = abs(sin(pos.y * 14.0));
          float rContour = abs(sin(dist * 16.0));
          vContour = max(hContour, rContour * 0.65);

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;

          // Crisp point size with contour line emphasis
          float contourSizeBonus = smoothstep(0.82, 1.0, vContour) * 0.9;
          gl_PointSize = clamp((uPointSize + contourSizeBonus) * (26.0 / -mvPosition.z), 1.0, 3.6);
        }
      `,
      fragmentShader: `
        uniform float uCompletion;
        uniform float uMaxHeight;

        varying float vElevation;
        varying float vDist;
        varying float vRadarSweep;
        varying float vContour;

        void main() {
          // Circular crisp particle shape
          vec2 coord = gl_PointCoord - vec2(0.5);
          float r = length(coord);
          if (r > 0.5) discard;

          // Crisp anti-aliased edge
          float alphaEdge = smoothstep(0.5, 0.18, r);

          // Height ratio calculation
          float maxExpected = uMaxHeight * (0.65 + uCompletion * 2.8) + 0.01;
          float heightRatio = clamp(vElevation / maxExpected, 0.0, 1.0);

          // Contour line glow highlight (creates horizontal & radial stippled wireframe lines)
          float contourHighlight = smoothstep(0.82, 1.0, vContour) * 0.35;

          // Monochrome palette: silver slate base to pure glowing white peaks & contours
          vec3 baseColor = vec3(0.50, 0.55, 0.65);
          vec3 peakColor = vec3(1.00, 1.00, 1.00);
          vec3 color = mix(baseColor, peakColor, clamp(pow(heightRatio, 1.1) + contourHighlight * 0.4, 0.0, 1.0));

          // Opacity depth gradient: sparse base stipples -> intense peak crests & contour line brightness
          float baseOpacity = mix(0.08, 0.96, pow(heightRatio, 1.3)) + contourHighlight;

          // Live radar sweep highlight effect
          float sweepHighlight = smoothstep(0.85, 1.0, vRadarSweep) * 0.2 * heightRatio;

          // Peripheral boundary edge fade out
          float edgeFade = smoothstep(5.2, 3.0, vDist);

          float finalAlpha = alphaEdge * (baseOpacity + sweepHighlight) * edgeFade;

          gl_FragColor = vec4(color, finalAlpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });
  }, []);

  // Update uniforms and rotation on frame render
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08; // Slow cinematic rotation
    }
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
      shaderRef.current.uniforms.uCompletion.value = Math.min(100, Math.max(0, completionIndex)) / 100;
    }
  });

  return (
    <group ref={groupRef} position={[0, -1.2, 0]}>
      {/* Hyper-Dense Monochrome Point-Cloud Mountain */}
      <points geometry={geometry} material={shaderMaterial}>
        <primitive object={shaderMaterial} ref={shaderRef} attach="material" />
      </points>
    </group>
  );
};

// Fallback Loader Component
const SummitLoader: React.FC = () => (
  <div className="w-full h-full min-h-[380px] bg-[#000000] border border-[#1E1E26] rounded-xl flex flex-col items-center justify-center space-y-4 p-6 relative overflow-hidden select-none">
    <div className="w-12 h-12 rounded-full border-2 border-[#1E1E26] border-t-[#FFFFFF] animate-spin flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.2)]">
      <Cpu className="w-5 h-5 text-[#E0E0E0] animate-pulse" />
    </div>

    <div className="flex flex-col items-center font-mono space-y-1 text-center">
      <span className="text-xs font-bold text-[#FFFFFF] tracking-wider uppercase flex items-center gap-2">
        <Radio className="w-3.5 h-3.5 text-[#E0E0E0] animate-ping" /> INITIALIZING RADAR TOPOLOGY ENGINE...
      </span>
      <span className="text-[10px] text-[#8E8E93]">
        SYNTHESIZING POINT CLOUD PEAKS (220x220 VERTICES)
      </span>
    </div>
  </div>
);

// Main Export Component
export const SummitTopology: React.FC<SummitTopologyProps> = ({
  growthPercentage = 0,
  completionIndex,
  className = '',
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const { latitude, longitude } = useWeatherLocation();

  // Normalize effective completion percentage
  const activeCompletion = useMemo(() => {
    if (typeof completionIndex === 'number') return completionIndex;
    return growthPercentage;
  }, [completionIndex, growthPercentage]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <SummitLoader />;
  }

  const apexMeters = Math.round(4850 * (activeCompletion / 100));

  return (
    <div
      className={`relative w-full h-[440px] bg-[#000000] border border-[#1E1E26] rounded-xl overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.95)] select-none ${className}`}
    >
      {/* Background Radar Scanline & Grid Mask */}
      <div className="absolute inset-0 bg-cyber-grid opacity-40 pointer-events-none z-10" />

      {/* HUD Corner Brackets & Crosshair Reticles */}
      <div className="absolute top-2 left-2 z-20 pointer-events-none text-[10px] font-mono text-[#8E8E93] flex items-center gap-1">
        <span className="text-[#FFFFFF] font-bold text-glow-sm">[+</span>
        <Crosshair className="w-3 h-3 text-[#FFFFFF] inline" />
        <span>.0KCF-1109.9]</span>
      </div>

      <div className="absolute top-2 right-2 z-20 pointer-events-none text-[10px] font-mono text-[#8E8E93] flex items-center gap-1">
        <span className="text-[#FFFFFF] font-bold text-glow-sm">-8/7C6</span>
        <span>[ALT: 4850M+]</span>
      </div>

      <div className="absolute bottom-2 left-2 z-20 pointer-events-none text-[10px] font-mono text-[#8E8E93] flex items-center gap-1">
        <span className="text-[#FFFFFF] font-bold text-glow-sm">[+.258</span>
        <Layers className="w-3 h-3 text-[#FFFFFF] inline" />
        <span>MATRIX]</span>
      </div>

      <div className="absolute bottom-2 right-2 z-20 pointer-events-none text-[10px] font-mono text-[#8E8E93] flex items-center gap-1">
        <span>[RADAR: ACTIVE</span>
        <span className="text-[#FFFFFF] font-bold text-glow-sm">+]</span>
      </div>

      {/* Perimeter Telemetry Header */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none font-mono text-xs">
        <div className="flex items-center gap-2 bg-[#000000]/95 backdrop-blur-md px-3.5 py-1.5 rounded border border-[#27272A] shadow-sm">
          <Terminal className="w-3.5 h-3.5 text-[#FFFFFF]" />
          <span className="text-[#FFFFFF] font-extrabold tracking-wider text-glow-sm">
            SUMMIT TOPOLOGY // STIPPLED ELEVATION
          </span>
        </div>

        <div className="flex items-center gap-3 bg-[#000000]/95 backdrop-blur-md px-3.5 py-1.5 rounded border border-[#27272A] shadow-sm">
          <Activity className="w-3.5 h-3.5 text-[#FFFFFF] animate-pulse" />
          <span className="text-[#8E8E93]">APEX ELEVATION:</span>
          <span className="text-[#FFFFFF] font-black tracking-wide text-glow-sm">
            {apexMeters}M ({activeCompletion.toFixed(1)}%)
          </span>
        </div>
      </div>

      {/* Perimeter Coordinates & Technical Readouts Footer */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none font-mono text-[11px] text-[#8E8E93]">
        <div className="flex items-center gap-2 bg-[#000000]/90 backdrop-blur-md px-3 py-1 rounded border border-[#27272A]">
          <Compass className="w-3.5 h-3.5 text-[#FFFFFF]" />
          <span className="text-[#FFFFFF] font-bold text-glow-sm">
            LAT: {latitude.toFixed(4)}° {latitude >= 0 ? 'N' : 'S'} | LON: {longitude.toFixed(4)}° {longitude >= 0 ? 'E' : 'W'}
          </span>
        </div>

        <div className="flex items-center gap-2 bg-[#000000]/90 backdrop-blur-md px-3 py-1 rounded border border-[#27272A]">
          <Radio className="w-3.5 h-3.5 text-[#FFFFFF] animate-pulse" />
          <span className="text-[#E4E4E7]">RADAR FREQ: 1420 MHz</span>
          <span className="text-[9px] bg-[#18181F] text-[#FFFFFF] border border-[#27272A] px-1.5 py-0.5 rounded ml-1 font-bold text-glow-sm">
            SWEEP 60FPS
          </span>
        </div>
      </div>

      {/* Three.js R3F Canvas */}
      <Canvas
        camera={{ position: [0, 3.4, 7.2], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        className="w-full h-full"
      >
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={0.9} />
        <directionalLight position={[10, 15, 10]} intensity={1.2} />

        <SummitPointCloud completionIndex={activeCompletion} />

        <OrbitControls
          enableZoom={true}
          enablePan={false}
          maxPolarAngle={Math.PI / 2.02}
          minPolarAngle={0.05}
          rotateSpeed={0.6}
        />
      </Canvas>
    </div>
  );
};

export default SummitTopology;

