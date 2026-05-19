import React from 'react';
import { c01 } from './treeUtils.js';

const STALKS = [
  { x:300, top:30,  w:14, delay:0.00, leafDelay:0.30 },
  { x:270, top:60,  w:12, delay:0.03, leafDelay:0.33 },
  { x:330, top:50,  w:12, delay:0.04, leafDelay:0.34 },
  { x:240, top:100, w:10, delay:0.07, leafDelay:0.37 },
  { x:360, top:90,  w:10, delay:0.08, leafDelay:0.38 },
  { x:285, top:80,  w:9,  delay:0.10, leafDelay:0.40 },
  { x:315, top:70,  w:9,  delay:0.11, leafDelay:0.41 },
];

const LEAF_ANGLES = [-40, -25, -10, 10, 25, 40];

const SWAY_DURATIONS = [5.2, 4.8, 5.5, 4.6, 5.0, 5.8, 4.9];
const SHIVER_DURATIONS = [2.1, 2.4, 1.9, 2.2, 2.5, 2.0, 2.3];

export default function BambooTree({ progress, theme, sunAngleNorm, sunHeight, duskOp, rimLightOp, nightOp }) {
  const shadowDx = -sunAngleNorm * 35;
  const shadowSX = 1 + Math.abs(sunAngleNorm) * 0.5;

  const dashTr = 'stroke-dashoffset 2s cubic-bezier(0.34,1.2,0.64,1)';

  return (
    <>
      <ellipse cx={300+shadowDx} cy="524" rx={65*shadowSX} ry={5-sunHeight*1}
        fill={`rgba(20,12,4,${0.07+(1-sunHeight)*0.04})`}
        style={{ transition:'cx 4s,rx 4s,ry 4s', filter:'blur(2px)' }}/>

      <g style={{
        animation: 'bambooLean 8s ease-in-out infinite',
        transformOrigin: '300px 524px',
      }}>
        {STALKS.map((s, i) => {
          const p     = c01(progress, s.delay, s.delay + 0.32);
          const leafP = c01(progress, s.leafDelay, s.leafDelay + 0.28);
          const h = 520 - s.top;
          const segments = Math.floor(h / 55);

          return (
            <g key={`bst${i}`}>
              <path d={`M${s.x},520 L${s.x},${s.top}`}
                stroke="#2a1808" strokeWidth={s.w+2} strokeLinecap="round" fill="none" opacity="0.1"
                strokeDasharray={h} strokeDashoffset={h*(1-p)}
                style={{ transition:dashTr }}/>
              <path d={`M${s.x},520 L${s.x},${s.top}`}
                stroke={theme.leafDark} strokeWidth={s.w} strokeLinecap="round" fill="none"
                strokeDasharray={h} strokeDashoffset={h*(1-p)}
                style={{ transition:dashTr }}/>
              <path d={`M${s.x},520 L${s.x},${s.top}`}
                stroke={theme.leafMid} strokeWidth={s.w*0.5} strokeLinecap="round" fill="none" opacity="0.6"
                strokeDasharray={h} strokeDashoffset={h*(1-p)}
                style={{ transition:dashTr }}/>
              <path d={`M${s.x+s.w*0.25},520 L${s.x+s.w*0.25},${s.top}`}
                stroke={theme.leafLight} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.3"
                strokeDasharray={h} strokeDashoffset={h*(1-p)}
                style={{ transition:dashTr }}/>

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

              {leafP > 0 && (
                <g style={{
                  animation: leafP > 0.6
                    ? `bambooLeafFlutter ${SHIVER_DURATIONS[i]}s ease-in-out ${i*0.28}s infinite`
                    : 'none',
                  transformOrigin: `${s.x}px ${s.top}px`,
                }}>
                  <g style={{
                    transform: `scale(${leafP}) rotate(${(1 - leafP) * 15}deg)`,
                    transformOrigin: `${s.x}px ${s.top}px`,
                    transition: 'transform 1.6s cubic-bezier(0.22,1.5,0.36,1)',
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
                </g>
              )}

              {rimLightOp > 0.1 && (
                <path d={`M${s.x},520 L${s.x},${s.top}`}
                  stroke={duskOp>0.5?'#a0d060':'#d0ffa0'} strokeWidth="2" strokeLinecap="round" fill="none"
                  opacity={rimLightOp*0.3} transform={`translate(${sunAngleNorm*3},0)`}
                  strokeDasharray={h} strokeDashoffset={h*(1-p)}
                  style={{ transition:'stroke-dashoffset 2s,transform 4s' }}/>
              )}
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
