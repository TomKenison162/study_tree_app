import React from 'react';
import { c01 } from './treeUtils.js';

const CRYSTALS = [
  { cx: 130, cy: 200, pts: "0,-40 -16,0 0,10 16,0",  s: 1.12, pKey: 'cr',  d: 0,   rot: -10 },
  { cx: 470, cy: 195, pts: "0,-38 -14,0 0,9 14,0",   s: 1.05, pKey: 'cr',  d: 0.3, rot: 7 },
  { cx: 190, cy: 138, pts: "0,-48 -19,0 0,12 19,0",  s: 1.22, pKey: 'cr',  d: 0.6, rot: -14 },
  { cx: 410, cy: 135, pts: "0,-45 -17,0 0,11 17,0",  s: 1.18, pKey: 'cr',  d: 0.2, rot: 11 },
  { cx: 100, cy: 240, pts: "0,-32 -12,0 0,7 12,0",   s: 0.88, pKey: 'cr2', d: 0.5, rot: -16 },
  { cx: 500, cy: 232, pts: "0,-30 -11,0 0,6 11,0",   s: 0.85, pKey: 'cr2', d: 0.8, rot: 13 },
  { cx: 248, cy: 80,  pts: "0,-55 -21,0 0,15 21,0",  s: 1.38, pKey: 'cr2', d: 0.1, rot: -6 },
  { cx: 352, cy: 76,  pts: "0,-52 -20,0 0,13 20,0",  s: 1.32, pKey: 'cr2', d: 0.4, rot: 9 },
  { cx: 158, cy: 118, pts: "0,-36 -14,0 0,8 14,0",   s: 1.02, pKey: 'cr2', d: 0.7, rot: -12 },
  { cx: 442, cy: 115, pts: "0,-36 -14,0 0,8 14,0",   s: 1.02, pKey: 'cr2', d: 0.2, rot: 8 },
  { cx: 300, cy: 42,  pts: "0,-62 -24,0 0,18 24,0",  s: 1.50, pKey: 'cr3', d: 0,   rot: 0 },
  { cx: 220, cy: 108, pts: "0,-40 -16,0 0,10 16,0",  s: 1.10, pKey: 'cr3', d: 0.5, rot: -8 },
  { cx: 380, cy: 105, pts: "0,-40 -16,0 0,10 16,0",  s: 1.10, pKey: 'cr3', d: 0.3, rot: 5 },
  { cx: 300, cy: 135, pts: "0,-30 -11,0 0,7 11,0",   s: 0.95, pKey: 'cr3', d: 0.6, rot: 3 },
  { cx: 165, cy: 170, pts: "0,-28 -10,0 0,6 10,0",   s: 0.82, pKey: 'cr',  d: 0.4, rot: -18 },
  { cx: 435, cy: 168, pts: "0,-26 -9,0 0,5 9,0",     s: 0.80, pKey: 'cr',  d: 0.7, rot: 15 },
];

const HEX_BASES = [
  { cx: 268, cy: 508, w: 14, h: 20 },
  { cx: 332, cy: 506, w: 12, h: 17 },
  { cx: 245, cy: 514, w: 10, h: 14 },
  { cx: 355, cy: 512, w: 11, h: 16 },
  { cx: 288, cy: 516, w: 8,  h: 11 },
  { cx: 312, cy: 515, w: 9,  h: 13 },
];

const SHARDS = [
  { cx: 175, cy: 168, size: 7 },
  { cx: 425, cy: 162, size: 6 },
  { cx: 300, cy: 85,  size: 8 },
  { cx: 235, cy: 125, size: 5 },
  { cx: 365, cy: 122, size: 5 },
  { cx: 145, cy: 215, size: 6 },
  { cx: 455, cy: 210, size: 5 },
  { cx: 280, cy: 65,  size: 4 },
  { cx: 320, cy: 62,  size: 4 },
];

const SPARKLES = [
  { cx: 300, cy: 58, r: 5.5 }, { cx: 130, cy: 192, r: 4 }, { cx: 470, cy: 188, r: 4 },
  { cx: 190, cy: 130, r: 4.5 }, { cx: 410, cy: 128, r: 4.5 }, { cx: 248, cy: 74, r: 3.5 },
  { cx: 352, cy: 70, r: 3.5 }, { cx: 300, cy: 128, r: 3 }, { cx: 158, cy: 112, r: 3 },
  { cx: 442, cy: 108, r: 3 }, { cx: 220, cy: 102, r: 2.5 }, { cx: 380, cy: 100, r: 2.5 },
  { cx: 165, cy: 164, r: 2 }, { cx: 435, cy: 162, r: 2 },
];

function hexPrism(cx, cy, w, h) {
  return `M${cx},${cy - h} L${cx + w},${cy - h * 0.4} L${cx + w},${cy + h * 0.4} L${cx},${cy + h} L${cx - w},${cy + h * 0.4} L${cx - w},${cy - h * 0.4} Z`;
}

export default function CrystalTree({ progress, theme, sunAngleNorm, sunHeight, duskOp, rimLightOp, nightOp }) {
  const trP = c01(progress, 0.00, 0.16);
  const brP = c01(progress, 0.12, 0.35);
  const crP = c01(progress, 0.28, 0.52);
  const cr2P = c01(progress, 0.38, 0.62);
  const cr3P = c01(progress, 0.50, 0.76);
  const detP = c01(progress, 0.55, 0.85);
  const baseP = c01(progress, 0.03, 0.18);
  const shardP = c01(progress, 0.60, 0.85);

  const pMap = { cr: crP, cr2: cr2P, cr3: cr3P };

  const shadowDx = -sunAngleNorm * 42;
  const shadowSX = 1 + Math.abs(sunAngleNorm) * 0.5;
  const dashTr = 'stroke-dashoffset 2s cubic-bezier(0.34,1.2,0.64,1)';

  return (
    <>
      <ellipse cx={300 + shadowDx} cy="524" rx={82 * shadowSX} ry={6.5 - sunHeight * 1.3}
        fill={`rgba(10,20,40,${0.12 + (1 - sunHeight) * 0.06})`}
        style={{ transition: 'cx 4s,rx 4s,ry 4s', filter: 'blur(2.5px)' }} />

      {HEX_BASES.map((hc, i) => {
        const p = baseP;
        return (
          <g key={`hex${i}`} style={{
            transform: `scaleY(${p}) translateY(${(1 - p) * 5}px)`,
            transformOrigin: `${hc.cx}px ${hc.cy + hc.h}px`,
            transition: 'transform 1.5s cubic-bezier(0.22,1.4,0.36,1)',
            opacity: Math.min(1, p * 3),
          }}>
            <path d={hexPrism(hc.cx, hc.cy, hc.w, hc.h)} fill={theme.leafDark} opacity="0.7" />
            <path d={hexPrism(hc.cx, hc.cy, hc.w * 0.6, hc.h * 0.65)} fill={theme.leafMid} opacity="0.5" />
            <path d={hexPrism(hc.cx, hc.cy - 1, hc.w * 0.25, hc.h * 0.35)} fill={theme.leafLight} opacity="0.4" />
          </g>
        );
      })}

      <path d="M294,520 C274,510 250,518 228,530" stroke="#3a5a7a" strokeWidth="9" strokeLinecap="round" fill="none" opacity="0.6"
        strokeDasharray="70" strokeDashoffset={70 * (1 - trP)} style={{ transition: dashTr }} />
      <path d="M306,520 C326,510 350,518 372,530" stroke="#3a5a7a" strokeWidth="9" strokeLinecap="round" fill="none" opacity="0.6"
        strokeDasharray="70" strokeDashoffset={70 * (1 - trP)} style={{ transition: dashTr }} />
      <path d="M288,522 C264,516 238,524 212,536" stroke="#3a5a7a" strokeWidth="5.5" strokeLinecap="round" fill="none" opacity="0.4"
        strokeDasharray="82" strokeDashoffset={82 * (1 - trP)} style={{ transition: dashTr }} />
      <path d="M312,522 C336,516 362,524 388,536" stroke="#3a5a7a" strokeWidth="5.5" strokeLinecap="round" fill="none" opacity="0.4"
        strokeDasharray="82" strokeDashoffset={82 * (1 - trP)} style={{ transition: dashTr }} />

      <polygon points="300,520 278,520 284,380 289,260 293,180 297,120 300,65 303,120 307,180 311,260 316,380 322,520"
        fill={theme.leafMid} opacity={0.55 * trP} style={{ transition: 'opacity 2s' }} />
      <polygon points="300,520 286,520 291,380 295,260 298,180 300,120 300,65 300,120 302,180 305,260 309,380 314,520"
        fill={theme.leafLight} opacity={0.45 * trP} style={{ transition: 'opacity 2s' }} />
      <polygon points="300,520 293,520 296,380 298,260 299,180 300,120 300,65 300,120 301,180 302,260 304,380 307,520"
        fill="rgba(200,240,255,0.3)" opacity={trP} style={{ transition: 'opacity 2s' }} />

      {trP > 0.3 && (
        <g opacity={trP * 0.45}>
          <path d="M298,505 C297,395 299,290 298,195 C298,145 299,105 300,70"
            stroke="rgba(150,220,255,0.6)" strokeWidth="1.5" fill="none"
            strokeDasharray="8 14" strokeLinecap="round"
            style={{ animation: 'crystalVeinFlow 3s linear infinite' }} />
          <path d="M302,505 C303,395 301,290 302,195 C302,145 301,105 300,70"
            stroke="rgba(180,200,255,0.4)" strokeWidth="1" fill="none"
            strokeDasharray="6 16" strokeLinecap="round"
            style={{ animation: 'crystalVeinFlow 4.5s linear 1.2s infinite' }} />
          <path d="M300,505 C300,395 300,290 300,195 C300,145 300,105 300,70"
            stroke="rgba(120,240,255,0.25)" strokeWidth="0.8" fill="none"
            strokeDasharray="4 18" strokeLinecap="round"
            style={{ animation: 'crystalVeinFlow 5.5s linear 0.6s infinite' }} />
        </g>
      )}

      {[
        ["M296,340 C268,308 236,278 196,248 C170,228 140,212 105,198", 280],
        ["M304,340 C332,308 364,278 404,248 C430,228 460,212 495,198", 280],
        ["M298,260 C273,233 244,208 210,182 C190,166 168,154 140,145", 240],
        ["M302,260 C327,233 356,208 390,182 C410,166 432,154 460,145", 240],
        ["M298,195 C278,172 254,150 225,128", 115],
        ["M302,195 C322,172 346,150 375,128", 115],
        ["M299,155 C286,138 268,120 245,102", 85],
        ["M301,155 C314,138 332,120 355,102", 85],
        ["M299,120 C290,105 278,90 264,78", 60],
        ["M301,120 C310,105 322,90 336,78", 60],
      ].map(([d, len], i) => (
        <path key={i} d={d} stroke={theme.leafMid} strokeWidth={i < 2 ? 6 : i < 4 ? 5 : i < 6 ? 4 : i < 8 ? 3 : 2.5}
          strokeLinecap="round" fill="none" opacity={i < 2 ? 0.7 : i < 6 ? 0.55 : 0.45}
          strokeDasharray={len} strokeDashoffset={len * (1 - brP)} style={{ transition: dashTr }} />
      ))}

      {CRYSTALS.map((cr, i) => {
        const p = pMap[cr.pKey];
        const rot = (1 - p) * 22 + cr.rot;
        return (
          <g key={`cr${i}`} style={{
            animation: p > 0.6
              ? `crystalShimmer ${3 + i * 0.22}s ease-in-out ${cr.d}s infinite, crystalFloat ${4.2 + i * 0.32}s ease-in-out ${cr.d * 0.5}s infinite`
              : 'none',
            transformOrigin: `${cr.cx}px ${cr.cy}px`,
          }}>
            <g style={{
              transform: `translate(${cr.cx}px,${cr.cy}px) scale(${cr.s * p}) rotate(${rot}deg)`,
              transformOrigin: '0px 0px',
              transition: 'transform 1.8s cubic-bezier(0.22,1.5,0.36,1), opacity 0.8s ease-out',
              opacity: Math.min(1, p * 3),
            }}>
              <polygon points={cr.pts} fill={theme.leafDark} opacity="0.75" />
              <polygon points={cr.pts} fill={theme.leafMid} opacity="0.55" transform="scale(0.76)" />
              <polygon points={cr.pts} fill={theme.leafLight} opacity="0.45" transform="scale(0.46)" />
              <polygon points={cr.pts} fill="rgba(220,245,255,0.55)" opacity="0.35" transform="scale(0.2)" />
              <polygon points={cr.pts} fill="rgba(255,255,255,0.15)" opacity="0.25" transform="scale(0.88)" style={{ filter: 'blur(1px)' }} />

              {rimLightOp > 0.08 && (
                <polygon points={cr.pts} fill={duskOp > 0.5 ? '#ffd0a0' : '#e0f8ff'}
                  opacity={rimLightOp * 0.35} transform={`translate(${sunAngleNorm * 4},0) scale(0.6)`} />
              )}
              {nightOp > 0.18 && (
                <>
                  <polygon points={cr.pts} fill="rgba(8,16,44,0.35)" opacity={nightOp * 0.5} />
                  <polygon points={cr.pts} fill="rgba(100,200,255,0.2)" opacity={nightOp * 0.5} transform="scale(0.55)" />
                </>
              )}
            </g>
          </g>
        );
      })}

      {shardP > 0 && (
        <g opacity={Math.min(1, shardP * 2.5)} style={{ transition: 'opacity 1.5s' }}>
          {SHARDS.map((sh, i) => (
            <g key={`shard${i}`} style={{
              animation: `crystalFloat ${4 + i * 0.5}s ease-in-out ${i * 0.6}s infinite`,
              transformOrigin: `${sh.cx}px ${sh.cy}px`,
            }}>
              <polygon
                points={`${sh.cx},${sh.cy - sh.size} ${sh.cx - sh.size * 0.45},${sh.cy} ${sh.cx},${sh.cy + sh.size * 0.35} ${sh.cx + sh.size * 0.45},${sh.cy}`}
                fill={theme.leafLight} opacity="0.55"
                style={{ animation: `twinkle ${2.2 + i * 0.25}s ease-in-out ${i * 0.45}s infinite` }} />
              <polygon
                points={`${sh.cx},${sh.cy - sh.size * 0.6} ${sh.cx - sh.size * 0.2},${sh.cy} ${sh.cx},${sh.cy + sh.size * 0.15} ${sh.cx + sh.size * 0.2},${sh.cy}`}
                fill="rgba(230,250,255,0.5)" opacity="0.4" />
            </g>
          ))}
        </g>
      )}

      {detP > 0.3 && (
        <g opacity={detP * 0.78} style={{ transition: 'opacity 1.5s' }}>
          {SPARKLES.map((sp, i) => (
            <g key={`sp${i}`}>
              <circle cx={sp.cx} cy={sp.cy} r={sp.r}
                fill="rgba(220,240,255,0.85)"
                style={{ animation: `twinkle ${1.8 + i * 0.28}s ease-in-out ${i * 0.35}s infinite` }} />
              {[0, 60, 120].map(deg => {
                const r = deg * Math.PI / 180;
                return <line key={deg}
                  x1={sp.cx} y1={sp.cy}
                  x2={sp.cx + Math.cos(r) * sp.r * 3}
                  y2={sp.cy + Math.sin(r) * sp.r * 3}
                  stroke="rgba(200,235,255,0.5)" strokeWidth="0.7"
                  style={{ animation: `twinkle ${2 + i * 0.28}s ease-in-out ${i * 0.38}s infinite` }} />;
              })}
              <circle cx={sp.cx} cy={sp.cy} r={sp.r * 2}
                fill="rgba(180,230,255,0.15)" style={{ filter: 'blur(2px)', animation: `twinkle ${2.5 + i * 0.3}s ease-in-out ${i * 0.4}s infinite` }} />
            </g>
          ))}
        </g>
      )}

      {detP > 0.5 && (
        <g opacity={detP * 0.28} style={{ transition: 'opacity 2s' }}>
          {[
            { x1: 300, y1: 55, x2: 245, y2: 18, color: '#ff9090' },
            { x1: 300, y1: 55, x2: 275, y2: 12, color: '#90ff90' },
            { x1: 300, y1: 55, x2: 325, y2: 12, color: '#9090ff' },
            { x1: 300, y1: 55, x2: 355, y2: 18, color: '#ffff90' },
            { x1: 300, y1: 55, x2: 300, y2: 5,  color: '#ff90ff' },
          ].map((ray, i) => (
            <line key={`ray${i}`} x1={ray.x1} y1={ray.y1} x2={ray.x2} y2={ray.y2}
              stroke={ray.color} strokeWidth="1.5" strokeLinecap="round"
              opacity="0.5" style={{ animation: `twinkle ${2.8 + i * 0.45}s ease-in-out ${i * 0.6}s infinite` }} />
          ))}
        </g>
      )}

      {rimLightOp > 0.1 && (
        <polygon points="300,520 288,520 292,380 296,260 298,180 300,120 300,65 300,120 302,180 304,260 308,380 312,520"
          fill={duskOp > 0.5 ? '#ffc090' : '#d0f0ff'} opacity={rimLightOp * 0.25}
          style={{ transform: `translateX(${sunAngleNorm * 6}px)`, transition: 'transform 4s,opacity 4s' }} />
      )}
    </>
  );
}
