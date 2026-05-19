import React from 'react';
import { c01 } from './treeUtils.js';

const TIERS = [
  { cy:480, rx:52, ry:40,  pRange:[0.10,0.30] },
  { cy:420, rx:46, ry:45,  pRange:[0.20,0.42] },
  { cy:355, rx:40, ry:50,  pRange:[0.32,0.55] },
  { cy:285, rx:34, ry:52,  pRange:[0.32,0.55] },
  { cy:210, rx:28, ry:55,  pRange:[0.44,0.68] },
  { cy:140, rx:22, ry:50,  pRange:[0.44,0.68] },
  { cy:80,  rx:16, ry:45,  pRange:[0.56,0.80] },
  { cy:30,  rx:10, ry:35,  pRange:[0.56,0.80] },
];

/* Cascade delays — wave goes from bottom to top */
const WAVE_DELAYS = [0, 0.15, 0.30, 0.45, 0.60, 0.75, 0.90, 1.05];

export default function CypressTree({ progress, theme, sunAngleNorm, sunHeight, duskOp, rimLightOp, nightOp }) {
  const trP  = c01(progress, 0.00, 0.15);
  const detP = c01(progress, 0.60, 0.88);

  const tierProgress = TIERS.map(t => c01(progress, t.pRange[0], t.pRange[1]));

  const shadowDx = -sunAngleNorm * 25;
  const shadowSX = 1 + Math.abs(sunAngleNorm) * 0.4;

  const dashTransition = 'stroke-dashoffset 2s cubic-bezier(0.34,1.2,0.64,1)';

  return (
    <>
      <ellipse cx={300+shadowDx} cy="524" rx={40*shadowSX} ry={4-sunHeight*0.8}
        fill={`rgba(20,12,4,${0.08+(1-sunHeight)*0.04})`}
        style={{ transition:'cx 4s,rx 4s,ry 4s', filter:'blur(1.5px)' }}/>

      {/* Root spread */}
      <path d="M296,522 C290,518 282,520 272,526" stroke="#4a3018" strokeWidth="7" strokeLinecap="round" fill="none"
        strokeDasharray="28" strokeDashoffset={28*(1-trP)}
        style={{ transition:'stroke-dashoffset 1.3s cubic-bezier(0.34,1.4,0.64,1)' }}/>
      <path d="M304,522 C310,518 318,520 328,526" stroke="#4a3018" strokeWidth="7" strokeLinecap="round" fill="none"
        strokeDasharray="28" strokeDashoffset={28*(1-trP)}
        style={{ transition:'stroke-dashoffset 1.3s cubic-bezier(0.34,1.4,0.64,1)' }}/>

      {/* Central column trunk */}
      <path d="M300,520 C299,420 300,320 299,220 C298,160 299,100 300,30"
        stroke="#2a1206" strokeWidth="7" strokeLinecap="round" fill="none" opacity="0.15"
        strokeDasharray="500" strokeDashoffset={500*(1-trP)} style={{ transition:dashTransition }}/>
      <path d="M300,520 C299,420 300,320 299,220 C298,160 299,100 300,30"
        stroke="#4a2810" strokeWidth="16" strokeLinecap="round" fill="none"
        strokeDasharray="500" strokeDashoffset={500*(1-trP)} style={{ transition:dashTransition }}/>
      <path d="M301,520 C300,420 301,320 300,220 C299,160 300,100 301,30"
        stroke="#6a4828" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.4"
        strokeDasharray="500" strokeDashoffset={500*(1-trP)} style={{ transition:dashTransition }}/>

      {/* Foliage tiers — cascading wave animation bottom-to-top */}
      {TIERS.map((t, i) => {
        const p = tierProgress[i];
        return (
          <g key={`ct${i}`} style={{
            transform:`scale(${p})`, transformOrigin:`300px ${t.cy}px`,
            transition:'transform 1.5s cubic-bezier(0.34,1.3,0.64,1)',
            animation: p > 0.5
              ? `cypressWave 4.2s ease-in-out ${WAVE_DELAYS[i]}s infinite`
              : 'none',
          }}>
            {/* Shadow ellipse */}
            <ellipse cx={300} cy={t.cy} rx={t.rx+3} ry={t.ry+2} fill={theme.leafDark} opacity="0.4"/>
            {/* Main body */}
            <ellipse cx={300} cy={t.cy} rx={t.rx} ry={t.ry} fill={theme.leafDark}/>
            {/* Mid highlight */}
            <ellipse cx={300} cy={t.cy-2} rx={t.rx*0.72} ry={t.ry*0.8} fill={theme.leafMid} opacity="0.88"/>
            {/* Inner light */}
            <ellipse cx={300} cy={t.cy-4} rx={t.rx*0.42} ry={t.ry*0.55} fill={theme.leafLight} opacity="0.65"/>
            {/* Rim light */}
            {rimLightOp > 0.08 && (
              <ellipse cx={300+sunAngleNorm*t.rx*0.35} cy={t.cy-sunHeight*t.ry*0.15}
                rx={t.rx*0.25} ry={t.ry*0.3}
                fill={duskOp>0.5?'#ffd080':'#e8ffa8'} opacity={rimLightOp*0.35}
                style={{ filter:'blur(2px)', transition:'cx 4s,cy 4s' }}/>
            )}
            {/* Night wash */}
            {nightOp > 0.18 && (
              <ellipse cx={300} cy={t.cy} rx={t.rx} ry={t.ry}
                fill="rgba(8,16,44,0.48)" opacity={nightOp*0.7}/>
            )}
          </g>
        );
      })}

      {/* Columnar tip bud */}
      {detP > 0.5 && (
        <g opacity={detP*0.7} style={{ transition:'opacity 1.5s' }}>
          <ellipse cx="300" cy="8" rx="4" ry="18" fill={theme.leafDark}/>
          <ellipse cx="300" cy="8" rx="2.5" ry="14" fill={theme.leafMid} opacity="0.8"/>
          <circle cx="300" cy="-8" r="2" fill={theme.leafLight} opacity="0.7"
            style={{ animation:'twinkle 4s ease-in-out infinite' }}/>
        </g>
      )}
    </>
  );
}
