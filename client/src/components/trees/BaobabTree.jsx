import React from 'react';
import { c01, TR } from './treeUtils.js';

const TRUNK_D      = "M248,524 C243,480 232,420 228,370 C224,310 228,265 242,230 C252,206 270,190 290,182 C300,178 310,178 320,182 C340,190 358,206 368,230 C382,265 386,310 382,370 C378,420 367,480 362,524 Z";
const TRUNK_HIGH_D = "M268,524 C265,480 258,420 256,370 C254,315 258,270 268,242 C276,222 286,210 300,205 C314,210 324,222 332,242 C342,270 346,315 344,370 C342,420 335,480 332,524 Z";

const BRANCHES = [
  { d:"M260,230 C230,210 190,195 140,180", w:11, da:135 },
  { d:"M350,228 C380,208 420,194 470,178", w:11, da:140 },
  { d:"M255,250 C225,238 185,230 130,228", w:8,  da:135 },
  { d:"M355,248 C385,236 425,228 480,226", w:8,  da:140 },
  { d:"M272,215 C258,198 240,178 218,158", w:9,  da:70  },
  { d:"M338,213 C352,196 370,176 392,156", w:9,  da:70  },
  { d:"M290,195 C280,172 268,148 258,120", w:7,  da:85  },
  { d:"M318,194 C328,170 340,146 350,118", w:7,  da:85  },
];

const CROWNS = [
  { cx:140, cy:170, rx:35, ry:25, swayDur:5.5 },
  { cx:470, cy:168, rx:35, ry:25, swayDur:4.8 },
  { cx:130, cy:220, rx:30, ry:20, swayDur:6.0 },
  { cx:480, cy:218, rx:30, ry:20, swayDur:5.2 },
  { cx:218, cy:148, rx:30, ry:22, swayDur:4.6 },
  { cx:392, cy:146, rx:30, ry:22, swayDur:5.8 },
  { cx:258, cy:110, rx:28, ry:20, swayDur:5.1 },
  { cx:350, cy:108, rx:28, ry:20, swayDur:4.9 },
  { cx:300, cy:150, rx:24, ry:18, swayDur:5.4 },
];

export default function BaobabTree({ progress, theme, sunAngleNorm, sunHeight, duskOp, rimLightOp, nightOp }) {
  const trP  = c01(progress, 0.00, 0.20);
  const brP  = c01(progress, 0.16, 0.40);
  const lfP  = c01(progress, 0.32, 0.65);
  const detP = c01(progress, 0.50, 0.80);

  const shadowDx = -sunAngleNorm * 55;
  const shadowSX = 1 + Math.abs(sunAngleNorm) * 0.5;

  return (
    <>
      <ellipse cx={300+shadowDx} cy="526" rx={95*shadowSX} ry={9-sunHeight*1.8}
        fill={`rgba(20,12,4,${0.10+(1-sunHeight)*0.05})`}
        style={{ transition:'cx 4s,rx 4s,ry 4s', filter:'blur(3px)' }}/>

      {/* Surface roots */}
      <path d="M262,524 C232,514 190,518 140,534" stroke="#6a5040" strokeWidth="15" strokeLinecap="round" fill="none"
        strokeDasharray="135" strokeDashoffset={135*(1-trP)} style={{ transition:TR }}/>
      <path d="M348,524 C378,514 420,518 470,534" stroke="#6a5040" strokeWidth="15" strokeLinecap="round" fill="none"
        strokeDasharray="135" strokeDashoffset={135*(1-trP)} style={{ transition:TR }}/>
      <path d="M275,528 C252,536 220,545 185,554" stroke="#6a5040" strokeWidth="9" strokeLinecap="round" fill="none"
        strokeDasharray="95" strokeDashoffset={95*(1-trP)} style={{ transition:TR }}/>
      <path d="M335,528 C358,536 390,545 425,554" stroke="#6a5040" strokeWidth="9" strokeLinecap="round" fill="none"
        strokeDasharray="95" strokeDashoffset={95*(1-trP)} style={{ transition:TR }}/>

      {/* Bulbous trunk */}
      <path d={TRUNK_D} fill="#6a5040"
        style={{ transform:`scaleY(${trP})`, transformOrigin:'300px 524px', transition:'transform 2.2s cubic-bezier(0.34,1.1,0.64,1)' }}/>
      <path d={TRUNK_HIGH_D} fill="#7a6855" opacity="0.6"
        style={{ transform:`scaleY(${trP})`, transformOrigin:'300px 524px', transition:'transform 2.2s cubic-bezier(0.34,1.1,0.64,1)' }}/>
      <path d="M285,524 C283,450 282,380 284,320 C286,275 292,245 300,225 C308,245 314,275 316,320 C318,380 317,450 315,524"
        fill="#8a7868" opacity="0.3"
        style={{ transform:`scaleY(${trP})`, transformOrigin:'300px 524px', transition:'transform 2.2s' }}/>

      {/* Horizontal bark lines */}
      <g opacity={detP*0.35} style={{ transition:'opacity 1.5s' }}>
        {[490,450,410,370,330,300,275,255,240].map((y, i) => {
          const w = y>400 ? 48 : y>300 ? 62 : y>250 ? 55 : 40;
          return (
            <path key={y} d={`M${300-w},${y} Q${300},${y+2} ${300+w},${y}`}
              stroke="#3a2818" strokeWidth="0.8" fill="none" opacity={0.5-i*0.03}/>
          );
        })}
      </g>

      {/* Branches with creaking sway */}
      {BRANCHES.map((b, i) => (
        <g key={`bb${i}`} style={{
          animation: brP > 0.5 ? `baobabCreak ${7+i*0.8}s ease-in-out ${i*0.6}s infinite` : 'none',
          transformOrigin: i < 4 ? '300px 240px' : '300px 200px',
        }}>
          <path d={b.d} stroke="#5a4030" strokeWidth={b.w} strokeLinecap="round" fill="none"
            strokeDasharray={b.da} strokeDashoffset={b.da*(1-brP)} style={{ transition:TR }}/>
        </g>
      ))}

      {/* Crown leaf clusters */}
      {CROWNS.map((cr, i) => (
        <g key={`bc${i}`} style={{
          transform:`scale(${lfP})`, transformOrigin:`${cr.cx}px ${cr.cy}px`,
          transition:'transform 1.5s cubic-bezier(0.34,1.3,0.64,1)',
          animation: lfP > 0.5 ? `canopySway ${cr.swayDur}s ease-in-out ${i*0.45}s infinite` : 'none',
        }}>
          <ellipse cx={cr.cx} cy={cr.cy} rx={cr.rx+4} ry={cr.ry+3} fill={theme.leafDark} opacity="0.5"/>
          <ellipse cx={cr.cx} cy={cr.cy} rx={cr.rx} ry={cr.ry} fill={theme.leafDark}/>
          <ellipse cx={cr.cx} cy={cr.cy-3} rx={cr.rx*0.7} ry={cr.ry*0.65} fill={theme.leafMid} opacity="0.9"/>
          <ellipse cx={cr.cx} cy={cr.cy-5} rx={cr.rx*0.4} ry={cr.ry*0.4} fill={theme.leafLight} opacity="0.7"/>
          {rimLightOp > 0.08 && (
            <ellipse cx={cr.cx+sunAngleNorm*cr.rx*0.4} cy={cr.cy-sunHeight*cr.ry*0.3}
              rx={cr.rx*0.3} ry={cr.ry*0.2}
              fill={duskOp>0.5?'#ffd080':'#e8ffa8'} opacity={rimLightOp*0.35}
              style={{ filter:'blur(1.5px)', transition:'cx 4s,cy 4s' }}/>
          )}
          {nightOp > 0.18 && (
            <ellipse cx={cr.cx} cy={cr.cy} rx={cr.rx} ry={cr.ry}
              fill="rgba(8,16,44,0.45)" opacity={nightOp*0.7}/>
          )}
        </g>
      ))}

      {/* Trunk rim light */}
      {rimLightOp > 0.1 && (
        <path d={TRUNK_D} fill={duskOp>0.5?'#c89060':'#ffe8c0'} opacity={rimLightOp*0.15}
          style={{
            transform:`scaleY(${trP}) translateX(${sunAngleNorm*8}px)`,
            transformOrigin:'300px 524px',
            transition:'transform 4s,opacity 4s',
          }}/>
      )}

      {/* Moss at base */}
      <g opacity={detP*0.5} style={{ transition:'opacity 1.5s' }}>
        <ellipse cx="270" cy="500" rx="12" ry="4" fill="#5a7a3a" opacity="0.5"
          style={{ animation:'mossBreath 5s ease-in-out infinite' }}/>
        <ellipse cx="335" cy="495" rx="10" ry="3.5" fill="#6a8a4a" opacity="0.4"
          style={{ animation:'mossBreath 6.5s ease-in-out 1s infinite' }}/>
      </g>
    </>
  );
}
