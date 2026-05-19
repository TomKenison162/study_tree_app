import React from 'react';
import { c01 } from './treeUtils.js';

const STALKS = [
  { x:240, top:100, w:10, pRange:[0.00,0.30], leafPRange:[0.28,0.55], swayDur:5.2, shiverDur:2.1 },
  { x:270, top:60,  w:12, pRange:[0.04,0.35], leafPRange:[0.32,0.60], swayDur:4.8, shiverDur:2.4 },
  { x:300, top:30,  w:14, pRange:[0.02,0.38], leafPRange:[0.35,0.65], swayDur:5.5, shiverDur:1.9 },
  { x:330, top:50,  w:12, pRange:[0.06,0.36], leafPRange:[0.34,0.62], swayDur:4.6, shiverDur:2.2 },
  { x:360, top:90,  w:10, pRange:[0.03,0.32], leafPRange:[0.30,0.58], swayDur:5.0, shiverDur:2.5 },
  { x:285, top:80,  w:9,  pRange:[0.08,0.40], leafPRange:[0.38,0.66], swayDur:5.8, shiverDur:2.0 },
  { x:315, top:70,  w:9,  pRange:[0.07,0.38], leafPRange:[0.36,0.64], swayDur:4.9, shiverDur:2.3 },
];

const LEAF_ANGLES = [-40, -25, -10, 10, 25, 40];

export default function BambooTree({ progress, theme, sunAngleNorm, sunHeight, duskOp, rimLightOp, nightOp }) {
  const shadowDx = -sunAngleNorm * 35;
  const shadowSX = 1 + Math.abs(sunAngleNorm) * 0.5;

  return (
    <>
      <ellipse cx={300+shadowDx} cy="524" rx={65*shadowSX} ry={5-sunHeight*1}
        fill={`rgba(20,12,4,${0.07+(1-sunHeight)*0.04})`}
        style={{ transition:'cx 4s,rx 4s,ry 4s', filter:'blur(2px)' }}/>

      {/* Whole-stand lean from wind */}
      <g style={{
        animation: 'bambooLean 8s ease-in-out infinite',
        transformOrigin: '300px 524px',
      }}>
        {STALKS.map((s, i) => {
          const p     = c01(progress, s.pRange[0], s.pRange[1]);
          const leafP = c01(progress, s.leafPRange[0], s.leafPRange[1]);
          const h = 520 - s.top;
          const segments = Math.floor(h / 55);

          return (
            <g key={`bst${i}`}>
              {/* Stalk shadow */}
              <path d={`M${s.x},520 L${s.x},${s.top}`}
                stroke="#2a1808" strokeWidth={s.w+2} strokeLinecap="round" fill="none" opacity="0.1"
                strokeDasharray={h} strokeDashoffset={h*(1-p)}
                style={{ transition:'stroke-dashoffset 2s cubic-bezier(0.34,1.2,0.64,1)' }}/>
              {/* Stalk base */}
              <path d={`M${s.x},520 L${s.x},${s.top}`}
                stroke={theme.leafDark} strokeWidth={s.w} strokeLinecap="round" fill="none"
                strokeDasharray={h} strokeDashoffset={h*(1-p)}
                style={{ transition:'stroke-dashoffset 2s cubic-bezier(0.34,1.2,0.64,1)' }}/>
              {/* Mid stripe */}
              <path d={`M${s.x},520 L${s.x},${s.top}`}
                stroke={theme.leafMid} strokeWidth={s.w*0.5} strokeLinecap="round" fill="none" opacity="0.6"
                strokeDasharray={h} strokeDashoffset={h*(1-p)}
                style={{ transition:'stroke-dashoffset 2s cubic-bezier(0.34,1.2,0.64,1)' }}/>
              {/* Light stripe */}
              <path d={`M${s.x+s.w*0.25},520 L${s.x+s.w*0.25},${s.top}`}
                stroke={theme.leafLight} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.3"
                strokeDasharray={h} strokeDashoffset={h*(1-p)}
                style={{ transition:'stroke-dashoffset 2s cubic-bezier(0.34,1.2,0.64,1)' }}/>

              {/* Node rings */}
              {Array.from({length:segments}, (_, j) => {
                const ny = 520 - (j+1)*55;
                const visible = p > (j+1)/segments;
                return visible ? (
                  <g key={`nd${j}`} opacity="0.65">
                    <line x1={s.x-s.w*0.6} y1={ny} x2={s.x+s.w*0.6} y2={ny}
                      stroke={theme.leafDark} strokeWidth="2.5" strokeLinecap="round"/>
                    <line x1={s.x-s.w*0.4} y1={ny} x2={s.x+s.w*0.4} y2={ny}
                      stroke={theme.leafLight} strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
                  </g>
                ) : null;
              })}

              {/* Leaf cluster at top */}
              {leafP > 0 && (
                <g style={{
                  transform:`scale(${leafP})`, transformOrigin:`${s.x}px ${s.top}px`,
                  transition:'transform 1.5s cubic-bezier(0.34,1.3,0.64,1)',
                  animation: leafP > 0.5
                    ? `bambooLeafFlutter ${s.shiverDur}s ease-in-out ${i*0.28}s infinite`
                    : 'none',
                }}>
                  {LEAF_ANGLES.map((angle, li) => {
                    const rad = angle * Math.PI / 180;
                    const leafLen = 35 + (li%2)*12;
                    const ex  = s.x + Math.sin(rad) * leafLen;
                    const ey  = s.top - Math.cos(rad) * leafLen * 0.6;
                    const cx1 = s.x + Math.sin(rad) * leafLen * 0.4;
                    const cy1 = s.top - Math.cos(rad) * leafLen * 0.3 - 8;
                    return (
                      <path key={`lf${li}`}
                        d={`M${s.x},${s.top} Q${cx1},${cy1} ${ex},${ey}`}
                        stroke={li%2===0 ? theme.leafMid : theme.leafLight}
                        strokeWidth={2.5-li*0.15} strokeLinecap="round" fill="none"
                        opacity={0.85-li*0.05}/>
                    );
                  })}
                </g>
              )}

              {/* Rim light on stalk */}
              {rimLightOp > 0.1 && (
                <path d={`M${s.x},520 L${s.x},${s.top}`}
                  stroke={duskOp>0.5?'#a0d060':'#d0ffa0'} strokeWidth="2" strokeLinecap="round" fill="none"
                  opacity={rimLightOp*0.3} transform={`translate(${sunAngleNorm*3},0)`}
                  strokeDasharray={h} strokeDashoffset={h*(1-p)}
                  style={{ transition:'stroke-dashoffset 2s,transform 4s' }}/>
              )}
              {/* Night wash on stalk */}
              {nightOp > 0.18 && (
                <path d={`M${s.x},520 L${s.x},${s.top}`}
                  stroke="rgba(8,16,44,0.4)" strokeWidth={s.w+4} strokeLinecap="round" fill="none"
                  opacity={nightOp*0.5} strokeDasharray={h} strokeDashoffset={h*(1-p)}/>
              )}
            </g>
          );
        })}
      </g>
    </>
  );
}
