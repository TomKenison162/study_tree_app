import React from 'react';
import { c01 } from './treeUtils.js';

const CHAINS = [
  { x:130, y:268, len:150, d:0   },
  { x:155, y:252, len:175, d:0.3 },
  { x:178, y:240, len:185, d:0.6 },
  { x:200, y:233, len:170, d:0.2 },
  { x:222, y:228, len:155, d:0.8 },
  { x:245, y:235, len:140, d:0.1 },
  { x:268, y:232, len:160, d:0.5 },
  { x:290, y:230, len:170, d:0.7 },
  { x:310, y:230, len:168, d:0.2 },
  { x:332, y:232, len:155, d:0.4 },
  { x:355, y:235, len:145, d:0.9 },
  { x:378, y:240, len:160, d:0.3 },
  { x:400, y:248, len:180, d:0.6 },
  { x:422, y:255, len:175, d:0.1 },
  { x:445, y:265, len:155, d:0.5 },
  { x:465, y:275, len:135, d:0.8 },
  { x:235, y:248, len:120, d:0.4 },
  { x:365, y:248, len:125, d:0.7 },
];

const SWAY_DURATIONS = [5.2,4.8,5.5,4.6,5.0,5.8,4.7,5.3,4.9,5.6,5.1,4.8,5.4,5.0,4.7,5.2,5.5,4.9];
const BOB_DURATIONS  = [3.2,2.8,3.5,2.6,3.0,3.8,2.7,3.3,2.9,3.6,3.1,2.8,3.4,3.0,2.7,3.2,3.5,2.9];

function chainProgress(ch, progress) {
  const dist = Math.abs(ch.x - 300) / 170;
  const start = 0.24 + dist * 0.18;
  const end = start + 0.26;
  return c01(progress, start, end);
}

export default function WisteriaTree({ progress, theme, sunAngleNorm, sunHeight, duskOp, rimLightOp, nightOp }) {
  const trP  = c01(progress, 0.00, 0.14);
  const brP  = c01(progress, 0.10, 0.30);
  const detP = c01(progress, 0.55, 0.85);

  const shadowDx = -sunAngleNorm * 45;
  const shadowSX = 1 + Math.abs(sunAngleNorm) * 0.5;

  const dashTr = 'stroke-dashoffset 2s cubic-bezier(0.34,1.2,0.64,1)';

  return (
    <>
      <ellipse cx={300+shadowDx} cy="524" rx={85*shadowSX} ry={7-sunHeight*1.5}
        fill={`rgba(20,12,4,${0.08+(1-sunHeight)*0.04})`}
        style={{ transition:'cx 4s,rx 4s,ry 4s', filter:'blur(2.5px)' }}/>

      <path d="M294,520 C265,504 235,514 200,528" stroke="#4a3020" strokeWidth="10" strokeLinecap="round" fill="none"
        strokeDasharray="100" strokeDashoffset={100*(1-trP)} style={{ transition:dashTr }}/>
      <path d="M306,522 C335,506 365,516 400,528" stroke="#4a3020" strokeWidth="10" strokeLinecap="round" fill="none"
        strokeDasharray="100" strokeDashoffset={100*(1-trP)} style={{ transition:dashTr }}/>

      <path d="M300,520 C296,460 288,400 286,340 C284,295 290,255 300,218"
        stroke="#3a2010" strokeWidth="10" strokeLinecap="round" fill="none" opacity="0.2"
        strokeDasharray="320" strokeDashoffset={320*(1-trP)} style={{ transition:dashTr }}/>
      <path d="M300,520 C296,460 288,400 286,340 C284,295 290,255 300,218"
        stroke="#5a3820" strokeWidth="24" strokeLinecap="round" fill="none"
        strokeDasharray="320" strokeDashoffset={320*(1-trP)} style={{ transition:dashTr }}/>
      <path d="M306,520 C303,458 296,396 294,336 C293,295 296,258 304,222"
        stroke="#7a5838" strokeWidth="7" strokeLinecap="round" fill="none" opacity="0.4"
        strokeDasharray="320" strokeDashoffset={320*(1-trP)} style={{ transition:dashTr }}/>

      <path d="M294,280 C258,268 210,255 140,258" stroke="#5a3820" strokeWidth="13" strokeLinecap="round" fill="none"
        strokeDasharray="165" strokeDashoffset={165*(1-brP)} style={{ transition:dashTr }}/>
      <path d="M306,280 C342,268 390,255 460,258" stroke="#5a3820" strokeWidth="13" strokeLinecap="round" fill="none"
        strokeDasharray="165" strokeDashoffset={165*(1-brP)} style={{ transition:dashTr }}/>
      <path d="M296,255 C265,246 228,238 180,238" stroke="#5a3820" strokeWidth="9" strokeLinecap="round" fill="none"
        strokeDasharray="125" strokeDashoffset={125*(1-brP)} style={{ transition:dashTr }}/>
      <path d="M304,255 C335,246 372,238 420,238" stroke="#5a3820" strokeWidth="9" strokeLinecap="round" fill="none"
        strokeDasharray="125" strokeDashoffset={125*(1-brP)} style={{ transition:dashTr }}/>
      <path d="M298,235 C275,228 252,224 220,226" stroke="#5a3820" strokeWidth="6" strokeLinecap="round" fill="none"
        strokeDasharray="85" strokeDashoffset={85*(1-brP)} style={{ transition:dashTr }}/>
      <path d="M302,235 C325,228 348,224 380,226" stroke="#5a3820" strokeWidth="6" strokeLinecap="round" fill="none"
        strokeDasharray="85" strokeDashoffset={85*(1-brP)} style={{ transition:dashTr }}/>

      {CHAINS.map((ch, i) => {
        const p = chainProgress(ch, progress);
        const n = Math.floor(ch.len / 16);
        return (
          <g key={`wch${i}`} style={{
            animation: p > 0.6
              ? `wisteriaChainSway ${SWAY_DURATIONS[i]}s ease-in-out ${ch.d}s infinite`
              : 'none',
            transformOrigin: `${ch.x}px ${ch.y}px`,
          }}>
            <g style={{
              transform: `scaleY(${p})`,
              transformOrigin: `${ch.x}px ${ch.y}px`,
              transition: 'transform 2s cubic-bezier(0.34,1.2,0.64,1)',
            }}>
              {Array.from({ length: n }, (_, j) => {
                const cy = ch.y + j * 16;
                const r  = Math.max(1.8, 5.5 - j * 0.35);
                const op = Math.max(0.4, 0.95 - j * 0.05);
                const col = j < n*0.3 ? theme.leafLight : j < n*0.65 ? theme.leafMid : theme.leafDark;
                const ox = (j % 3 - 1) * 1.5;
                return (
                  <React.Fragment key={j}>
                    <circle cx={ch.x+ox} cy={cy} r={r} fill={col} opacity={op}/>
                    {j < n-1 && <circle cx={ch.x-ox*0.6} cy={cy+8} r={r*0.6} fill={col} opacity={op*0.65}/>}
                  </React.Fragment>
                );
              })}
              {p > 0.6 && (
                <g style={{ animation:`chainBob ${BOB_DURATIONS[i]}s ease-in-out ${ch.d*0.5}s infinite`,
                            transformOrigin:`${ch.x}px ${ch.y+ch.len}px` }}>
                  <circle cx={ch.x} cy={ch.y+ch.len} r={3.5} fill={theme.leafLight} opacity="0.7"/>
                  <circle cx={ch.x} cy={ch.y+ch.len+7} r={2} fill={theme.leafMid} opacity="0.5"/>
                </g>
              )}
            </g>
          </g>
        );
      })}

      {rimLightOp > 0.1 && (
        <path d="M300,520 C296,460 288,400 286,340 C284,295 290,255 300,218"
          stroke={duskOp>0.5?'#d8a0e0':'#f0d8ff'} strokeWidth="4" strokeLinecap="round" fill="none"
          opacity={rimLightOp*0.4} transform={`translate(${sunAngleNorm*10},0)`}
          style={{ transition:'opacity 4s,transform 4s' }}
          strokeDasharray="320" strokeDashoffset={320*(1-trP)}/>
      )}

      {nightOp > 0.18 && CHAINS.map((ch, i) => {
        const p = chainProgress(ch, progress);
        return (
          <rect key={`nwch${i}`} x={ch.x-8} y={ch.y} width={16} height={ch.len*p}
            fill="rgba(10,10,40,0.30)" opacity={nightOp*0.5} rx="4"/>
        );
      })}

      <g opacity={detP*0.4} style={{ transition:'opacity 1.5s' }}>
        {[480,420,360,310,270].map(y => (
          <React.Fragment key={y}>
            <path d={`M295,${y} Q293,${y+16} 296,${y+32}`} stroke="#2a1808" strokeWidth="0.9" fill="none" strokeLinecap="round"/>
            <path d={`M304,${y+6} Q306,${y+20} 303,${y+34}`} stroke="#2a1808" strokeWidth="0.7" fill="none" strokeLinecap="round"/>
          </React.Fragment>
        ))}
      </g>
    </>
  );
}
