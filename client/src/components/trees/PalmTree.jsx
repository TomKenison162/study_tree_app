import React from 'react';
import { c01 } from './treeUtils.js';

const FRONDS = [
  { angle:-80, len:140, curve:50  },
  { angle:-55, len:155, curve:65  },
  { angle:-30, len:165, curve:80  },
  { angle:-10, len:150, curve:90  },
  { angle:15,  len:160, curve:85  },
  { angle:40,  len:155, curve:70  },
  { angle:65,  len:140, curve:55  },
  { angle:85,  len:120, curve:45  },
  { angle:-95, len:110, curve:40  },
  { angle:100, len:105, curve:38  },
];

const FROND_SWAY_DURATIONS = [4.2, 5.0, 4.6, 5.4, 4.8, 5.2, 4.4, 5.8, 4.9, 5.1];

const CROWN_X = 310;
const CROWN_Y = 108;

export default function PalmTree({ progress, theme, sunAngleNorm, sunHeight, duskOp, rimLightOp, nightOp }) {
  const trP  = c01(progress, 0.00, 0.25);
  const detP = c01(progress, 0.50, 0.80);
  const trunkW = 18 + trP * 10;

  const shadowDx = -sunAngleNorm * 42;
  const shadowSX = 1 + Math.abs(sunAngleNorm) * 0.5;

  const trunkPath = `M300,520 C298,460 302,400 296,340 C292,280 298,220 302,160 C305,130 308,115 ${CROWN_X},${CROWN_Y}`;

  const dashTr = 'stroke-dashoffset 2.2s cubic-bezier(0.34,1.2,0.64,1), stroke-width 1.8s ease-out';

  return (
    <>
      <ellipse cx={300+shadowDx} cy="524" rx={70*shadowSX} ry={6-sunHeight*1.2}
        fill={`rgba(20,12,4,${0.08+(1-sunHeight)*0.04})`}
        style={{ transition:'cx 4s,rx 4s,ry 4s', filter:'blur(2px)' }}/>

      <path d="M294,524 C282,518 268,522 252,530" stroke="#5a4020" strokeWidth="8" strokeLinecap="round" fill="none"
        strokeDasharray="48" strokeDashoffset={48*(1-trP)} style={{ transition:dashTr }}/>
      <path d="M308,524 C320,518 334,522 350,530" stroke="#5a4020" strokeWidth="8" strokeLinecap="round" fill="none"
        strokeDasharray="48" strokeDashoffset={48*(1-trP)} style={{ transition:dashTr }}/>

      <path d={trunkPath}
        stroke="#3a1e0a" strokeWidth={trunkW * 0.36} strokeLinecap="round" fill="none" opacity="0.15"
        strokeDasharray="440" strokeDashoffset={440*(1-trP)} style={{ transition:dashTr }}/>
      <path d={trunkPath}
        stroke="#6a4820" strokeWidth={trunkW} strokeLinecap="round" fill="none"
        strokeDasharray="440" strokeDashoffset={440*(1-trP)} style={{ transition:dashTr }}/>
      <path d={`M302,520 C300,460 304,400 298,340 C294,280 300,220 304,160 C306,132 310,117 ${CROWN_X+2},${CROWN_Y+2}`}
        stroke="#8a6840" strokeWidth={Math.max(3, trunkW * 0.36)} strokeLinecap="round" fill="none" opacity="0.4"
        strokeDasharray="440" strokeDashoffset={440*(1-trP)} style={{ transition:dashTr }}/>

      <g opacity={detP*0.4} style={{ transition:'opacity 1.5s' }}>
        {[480,430,380,330,280,230,180].map((y, i) => (
          <path key={y} d={`M${296+i*0.3},${y} Q${300},${y+12} ${304-i*0.3},${y+24}`}
            stroke="#2a1204" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
        ))}
      </g>

      {FRONDS.map((f, i) => {
        const frondStart = 0.18 + i * 0.03;
        const frondEnd = frondStart + 0.30;
        const p = c01(progress, frondStart, frondEnd);

        const rad  = f.angle * Math.PI / 180;
        const tipX = CROWN_X + Math.sin(rad) * f.len;
        const tipY = CROWN_Y - Math.cos(rad) * f.len * 0.45 + f.curve;
        const cp1x = CROWN_X + Math.sin(rad) * f.len * 0.4;
        const cp1y = CROWN_Y - Math.cos(rad) * f.len * 0.35;
        const cp2x = CROWN_X + Math.sin(rad) * f.len * 0.75;
        const cp2y = CROWN_Y - Math.cos(rad) * f.len * 0.2 + f.curve * 0.6;
        const frondD = `M${CROWN_X},${CROWN_Y} C${cp1x},${cp1y} ${cp2x},${cp2y} ${tipX},${tipY}`;
        const pathLen = 200;

        return (
          <g key={`fr${i}`} style={{
            animation: p > 0.6
              ? `frondFlex ${FROND_SWAY_DURATIONS[i]}s ease-in-out ${i*0.32}s infinite`
              : 'none',
            transformOrigin:`${CROWN_X}px ${CROWN_Y}px`,
          }}>
            <g style={{
              transform: `scale(${p})`,
              transformOrigin: `${CROWN_X}px ${CROWN_Y}px`,
              transition: 'transform 1.8s cubic-bezier(0.22,1.5,0.36,1), opacity 0.8s ease-out',
              opacity: Math.min(1, p * 3),
            }}>
              <path d={frondD} stroke={theme.leafDark} strokeWidth="4" strokeLinecap="round" fill="none"
                strokeDasharray={pathLen} strokeDashoffset={pathLen*(1-p)}
                style={{ transition:'stroke-dashoffset 2s cubic-bezier(0.34,1.2,0.64,1)' }}/>
              <path d={frondD} stroke={theme.leafMid} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.45"
                strokeDasharray={pathLen} strokeDashoffset={pathLen*(1-p)}
                style={{ transition:'stroke-dashoffset 2s cubic-bezier(0.34,1.2,0.64,1)' }}/>
              {p > 0.3 && Array.from({length:10}, (_, j) => {
                const t = 0.12 + j * 0.09;
                const bx = CROWN_X*(1-t)**3 + 3*cp1x*t*(1-t)**2 + 3*cp2x*t*t*(1-t) + tipX*t**3;
                const by = CROWN_Y*(1-t)**3 + 3*cp1y*t*(1-t)**2 + 3*cp2y*t*t*(1-t) + tipY*t**3;
                const side = j%2===0 ? 1 : -1;
                const lLen = (12 + j*1.8) * Math.min(1, p*2);
                const perpRad = rad + side * Math.PI * 0.32;
                return (
                  <path key={`lft${j}`}
                    d={`M${bx},${by} L${bx+Math.sin(perpRad)*lLen},${by+Math.cos(perpRad)*lLen*0.5}`}
                    stroke={j%3===0 ? theme.leafLight : theme.leafMid}
                    strokeWidth={2.2-j*0.08} strokeLinecap="round" fill="none"
                    opacity={Math.min(1, p*2-0.2)*0.82}
                    style={{ transition:'opacity 1.5s' }}/>
                );
              })}
            </g>
          </g>
        );
      })}

      {detP > 0.3 && (
        <g opacity={detP*0.8} style={{ transition:'opacity 1.5s' }}>
          <circle cx={CROWN_X-5}  cy={CROWN_Y+20} r="5.5" fill="#6a5020"/>
          <circle cx={CROWN_X+9}  cy={CROWN_Y+24} r="5"   fill="#7a6030"/>
          <circle cx={CROWN_X-1}  cy={CROWN_Y+30} r="4.5" fill="#6a5020"/>
          <circle cx={CROWN_X-7}  cy={CROWN_Y+18} r="1.5" fill="#9a8050" opacity="0.5"/>
          <circle cx={CROWN_X+11} cy={CROWN_Y+22} r="1.5" fill="#9a8050" opacity="0.5"/>
        </g>
      )}

      {rimLightOp > 0.1 && (
        <path d={trunkPath}
          stroke={duskOp>0.5?'#c89060':'#ffe8c0'} strokeWidth="3" strokeLinecap="round" fill="none"
          opacity={rimLightOp*0.35} transform={`translate(${sunAngleNorm*8},0)`}
          style={{ transition:'transform 4s,opacity 4s' }}
          strokeDasharray="440" strokeDashoffset={440*(1-trP)}/>
      )}
      {nightOp > 0.18 && (
        <path d={trunkPath}
          stroke="rgba(8,16,44,0.4)" strokeWidth="32" strokeLinecap="round" fill="none"
          opacity={nightOp*0.5}
          strokeDasharray="440" strokeDashoffset={440*(1-trP)}/>
      )}
    </>
  );
}
