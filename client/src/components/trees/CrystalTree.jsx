import React from 'react';
import { c01, TR } from './treeUtils.js';

const CRYSTALS = [
  { pts:"0,-35 -14,0 0,8 14,0",   cx:140, cy:195, s:1.10, pKey:'cr',  d:0   },
  { pts:"0,-30 -12,0 0,6 12,0",   cx:460, cy:190, s:1.00, pKey:'cr',  d:0.3 },
  { pts:"0,-40 -16,0 0,10 16,0",  cx:200, cy:140, s:1.20, pKey:'cr',  d:0.6 },
  { pts:"0,-38 -14,0 0,8 14,0",   cx:400, cy:138, s:1.15, pKey:'cr',  d:0.2 },
  { pts:"0,-28 -10,0 0,5 10,0",   cx:110, cy:230, s:0.85, pKey:'cr2', d:0.5 },
  { pts:"0,-28 -10,0 0,5 10,0",   cx:490, cy:225, s:0.85, pKey:'cr2', d:0.8 },
  { pts:"0,-45 -18,0 0,12 18,0",  cx:260, cy:85,  s:1.30, pKey:'cr2', d:0.1 },
  { pts:"0,-42 -17,0 0,10 17,0",  cx:340, cy:82,  s:1.25, pKey:'cr2', d:0.4 },
  { pts:"0,-32 -12,0 0,7 12,0",   cx:170, cy:120, s:1.00, pKey:'cr2', d:0.7 },
  { pts:"0,-32 -12,0 0,7 12,0",   cx:430, cy:118, s:1.00, pKey:'cr2', d:0.2 },
  { pts:"0,-50 -20,0 0,14 20,0",  cx:300, cy:55,  s:1.40, pKey:'cr3', d:0   },
  { pts:"0,-36 -14,0 0,8 14,0",   cx:230, cy:110, s:1.05, pKey:'cr3', d:0.5 },
  { pts:"0,-36 -14,0 0,8 14,0",   cx:370, cy:108, s:1.05, pKey:'cr3', d:0.3 },
  { pts:"0,-25 -9,0 0,4 9,0",     cx:300, cy:140, s:0.90, pKey:'cr3', d:0.6 },
];

/* Sparkle nodes between crystals */
const SPARKLE_NODES = [
  { cx:300, cy:75,  r:4   }, { cx:140, cy:188, r:3   }, { cx:460, cy:183, r:3   },
  { cx:200, cy:132, r:3.5 }, { cx:400, cy:130, r:3.5 }, { cx:260, cy:78,  r:2.5 },
  { cx:340, cy:76,  r:2.5 }, { cx:300, cy:130, r:2   }, { cx:170, cy:108, r:2   },
  { cx:430, cy:106, r:2   },
];

export default function CrystalTree({ progress, theme, sunAngleNorm, sunHeight, duskOp, rimLightOp, nightOp }) {
  const trP  = c01(progress, 0.00, 0.16);
  const brP  = c01(progress, 0.12, 0.35);
  const crP  = c01(progress, 0.28, 0.55);
  const cr2P = c01(progress, 0.40, 0.68);
  const cr3P = c01(progress, 0.52, 0.80);
  const detP = c01(progress, 0.60, 0.90);

  const pMap = { cr: crP, cr2: cr2P, cr3: cr3P };

  const shadowDx = -sunAngleNorm * 40;
  const shadowSX = 1 + Math.abs(sunAngleNorm) * 0.5;

  return (
    <>
      <ellipse cx={300+shadowDx} cy="524" rx={75*shadowSX} ry={6-sunHeight*1.2}
        fill={`rgba(10,20,40,${0.10+(1-sunHeight)*0.06})`}
        style={{ transition:'cx 4s,rx 4s,ry 4s', filter:'blur(2px)' }}/>

      {/* Root crystals */}
      <path d="M294,520 C274,510 254,518 234,528" stroke="#3a5a7a" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.6"
        strokeDasharray="65" strokeDashoffset={65*(1-trP)} style={{ transition:TR }}/>
      <path d="M306,520 C326,510 346,518 366,528" stroke="#3a5a7a" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.6"
        strokeDasharray="65" strokeDashoffset={65*(1-trP)} style={{ transition:TR }}/>

      {/* Central trunk prism */}
      <polygon points="300,520 280,520 286,380 290,260 294,180 298,120 300,80 302,120 306,180 310,260 314,380 320,520"
        fill={theme.leafMid} opacity={0.55*trP} style={{ transition:'opacity 2s' }}/>
      <polygon points="300,520 288,520 292,380 296,260 298,180 300,120 300,80 300,120 302,180 304,260 308,380 312,520"
        fill={theme.leafLight} opacity={0.45*trP} style={{ transition:'opacity 2s' }}/>
      <polygon points="300,520 294,520 296,380 298,260 299,180 300,120 300,80 300,120 301,180 302,260 304,380 306,520"
        fill="rgba(200,240,255,0.3)" opacity={trP} style={{ transition:'opacity 2s' }}/>

      {/* Branch prism arms */}
      {[
        ["M296,340 C270,310 240,280 200,250 C175,230 145,215 115,205", 260],
        ["M304,340 C330,310 360,280 400,250 C425,230 455,215 485,205", 260],
        ["M298,260 C275,235 248,210 215,185 C195,170 172,158 148,150", 220],
        ["M302,260 C325,235 352,210 385,185 C405,170 428,158 452,150", 220],
        ["M298,200 C280,178 258,156 232,135", 100],
        ["M302,200 C320,178 342,156 368,135", 100],
      ].map(([d, len], i) => (
        <path key={i} d={d} stroke={theme.leafMid} strokeWidth={i < 2 ? 6 : i < 4 ? 5 : 4}
          strokeLinecap="round" fill="none" opacity={i < 2 ? 0.7 : 0.6}
          strokeDasharray={len} strokeDashoffset={len*(1-brP)} style={{ transition:TR }}/>
      ))}

      {/* Crystal formations */}
      {CRYSTALS.map((cr, i) => {
        const p = pMap[cr.pKey];
        return (
          <g key={`cr${i}`}
            style={{
              transform:`translate(${cr.cx}px,${cr.cy}px) scale(${cr.s*p})`,
              transformOrigin:'0px 0px',
              transition:'transform 1.8s cubic-bezier(0.34,1.4,0.64,1)',
              animation: p > 0.5
                ? `crystalShimmer ${3.5+i*0.3}s ease-in-out ${cr.d}s infinite, crystalFloat ${5+i*0.4}s ease-in-out ${cr.d*0.5}s infinite`
                : 'none',
            }}>
            <polygon points={cr.pts} fill={theme.leafDark} opacity="0.7"/>
            <polygon points={cr.pts} fill={theme.leafMid} opacity="0.5" transform="scale(0.75)"/>
            <polygon points={cr.pts} fill={theme.leafLight} opacity="0.4" transform="scale(0.45)"/>
            <polygon points={cr.pts} fill="rgba(220,245,255,0.5)" opacity="0.3" transform="scale(0.2)"/>
            {rimLightOp > 0.08 && (
              <polygon points={cr.pts} fill={duskOp>0.5?'#ffd0a0':'#e0f8ff'}
                opacity={rimLightOp*0.3} transform={`translate(${sunAngleNorm*4},0) scale(0.6)`}/>
            )}
            {nightOp > 0.18 && (
              <>
                <polygon points={cr.pts} fill="rgba(8,16,44,0.4)" opacity={nightOp*0.6}/>
                <polygon points={cr.pts} fill="rgba(100,200,255,0.15)" opacity={nightOp*0.4} transform="scale(0.55)"/>
              </>
            )}
          </g>
        );
      })}

      {/* Sparkle nodes between crystals */}
      {detP > 0.3 && (
        <g opacity={detP*0.7} style={{ transition:'opacity 1.5s' }}>
          {SPARKLE_NODES.map((sp, i) => (
            <g key={`sp${i}`}>
              <circle cx={sp.cx} cy={sp.cy} r={sp.r}
                fill="rgba(220,240,255,0.8)"
                style={{ animation:`twinkle ${2.2+i*0.35}s ease-in-out ${i*0.42}s infinite` }}/>
              {/* Refraction cross rays */}
              {[0,90].map(deg => {
                const r = deg*Math.PI/180;
                return <line key={deg}
                  x1={sp.cx} y1={sp.cy}
                  x2={sp.cx+Math.cos(r)*sp.r*2.5}
                  y2={sp.cy+Math.sin(r)*sp.r*2.5}
                  stroke="rgba(200,235,255,0.6)" strokeWidth="0.8"
                  style={{ animation:`twinkle ${2.2+i*0.35}s ease-in-out ${i*0.42}s infinite` }}/>;
              })}
            </g>
          ))}
        </g>
      )}

      {/* Rim light on trunk prism */}
      {rimLightOp > 0.1 && (
        <polygon points="300,520 288,520 292,380 296,260 298,180 300,120 300,80 300,120 302,180 304,260 308,380 312,520"
          fill={duskOp>0.5?'#ffc090':'#d0f0ff'} opacity={rimLightOp*0.25}
          style={{ transform:`translateX(${sunAngleNorm*6}px)`, transition:'transform 4s,opacity 4s' }}/>
      )}
    </>
  );
}
