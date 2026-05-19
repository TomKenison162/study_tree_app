import React from 'react';
import { c01 } from './treeUtils.js';

const TIERS = [
  { apex:-560, base:-490, hw:30,  pRange:[0.46,0.64] },
  { apex:-500, base:-410, hw:40,  pRange:[0.43,0.61] },
  { apex:-430, base:-330, hw:50,  pRange:[0.40,0.58] },
  { apex:-350, base:-240, hw:62,  pRange:[0.37,0.55] },
  { apex:-270, base:-150, hw:74,  pRange:[0.34,0.52] },
  { apex:-190, base:-60,  hw:86,  pRange:[0.31,0.49] },
  { apex:-100, base:40,   hw:98,  pRange:[0.28,0.46] },
  { apex:-10,  base:140,  hw:108, pRange:[0.25,0.43] },
  { apex:80,   base:230,  hw:118, pRange:[0.22,0.40] },
  { apex:170,  base:320,  hw:126, pRange:[0.19,0.37] },
  { apex:260,  base:400,  hw:134, pRange:[0.16,0.34] },
  { apex:340,  base:470,  hw:140, pRange:[0.13,0.31] },
  { apex:410,  base:524,  hw:148, pRange:[0.10,0.28] },
];

const SWAY_DURATIONS = [4.8,5.2,4.6,5.5,4.9,5.8,5.1,4.7,5.4,5.0,4.8,5.3,4.6];

function tierPath(apex, base, hw) {
  const cx = 300;
  const h = base - apex;
  const cy = apex + h * 0.55;
  const dp = h * 0.05;
  return `M${cx},${apex} `
    + `C${cx-hw*0.15},${cy} ${cx-hw*0.7},${base} ${cx-hw},${base+dp} `
    + `Q${cx},${base+dp*0.3} ${cx+hw},${base+dp} `
    + `C${cx+hw*0.7},${base} ${cx+hw*0.15},${cy} ${cx},${apex} Z`;
}

const MOSS_POSITIONS = [
  { cx:290, cy:460, rx:9,  ry:4  },
  { cx:312, cy:380, rx:7,  ry:3  },
  { cx:288, cy:300, rx:6,  ry:2.5},
  { cx:310, cy:200, rx:5,  ry:2  },
  { cx:292, cy:100, rx:5,  ry:2  },
  { cx:308, cy:0,   rx:4,  ry:1.5},
  { cx:294, cy:-100,rx:4,  ry:1.5},
  { cx:306, cy:-200,rx:3,  ry:1.5},
];

export default function RedwoodTree({ progress, theme, sunAngleNorm, sunHeight, duskOp, rimLightOp, nightOp }) {
  const trP   = c01(progress, 0.00, 0.15);
  const detP  = c01(progress, 0.45, 0.72);
  const fullP = c01(progress, 0.55, 0.85);

  const tierProgress = TIERS.map(t => c01(progress, t.pRange[0], t.pRange[1]));
  const trunkW = 30 + trP * 16;

  const shadowDx = -sunAngleNorm * 55;
  const shadowSX = 1 + Math.abs(sunAngleNorm) * 0.5;

  const dashTr = 'stroke-dashoffset 2s cubic-bezier(0.34,1.2,0.64,1), stroke-width 1.8s ease-out';

  return (
    <>
      <ellipse cx={300+shadowDx} cy="524" rx={100*shadowSX} ry={7-sunHeight*1.5}
        fill={`rgba(20,12,4,${0.10+(1-sunHeight)*0.05})`}
        style={{ transition:'cx 4s,rx 4s,ry 4s', filter:'blur(3px)' }}/>

      {fullP > 0.3 && (
        <g opacity={fullP * 0.35} style={{ transition:'opacity 2s' }}>
          {[260, 295, 330, 360, 230].map((cx, i) => (
            <ellipse key={i} cx={cx} cy={520-i*3} rx={22+i*5} ry={4+i*1.5}
              fill="rgba(220,230,240,0.6)"
              style={{
                animation:`fogWisp ${6+i*1.2}s ease-in-out ${i*1.1}s infinite`,
                filter:'blur(3px)',
              }}/>
          ))}
        </g>
      )}

      <path d="M280,520 C240,498 190,508 140,528" stroke="#5a2a10" strokeWidth="16" strokeLinecap="round" fill="none"
        strokeDasharray="150" strokeDashoffset={150*(1-trP)} style={{ transition:dashTr }}/>
      <path d="M320,522 C360,500 410,510 460,528" stroke="#5a2a10" strokeWidth="16" strokeLinecap="round" fill="none"
        strokeDasharray="150" strokeDashoffset={150*(1-trP)} style={{ transition:dashTr }}/>
      <path d="M290,524 C265,532 230,542 190,552" stroke="#5a2a10" strokeWidth="10" strokeLinecap="round" fill="none"
        strokeDasharray="110" strokeDashoffset={110*(1-trP)} style={{ transition:dashTr }}/>
      <path d="M310,524 C335,532 370,542 410,552" stroke="#5a2a10" strokeWidth="10" strokeLinecap="round" fill="none"
        strokeDasharray="110" strokeDashoffset={110*(1-trP)} style={{ transition:dashTr }}/>
      <path d="M295,526 C275,536 255,548 240,558" stroke="#5a2a10" strokeWidth="7" strokeLinecap="round" fill="none"
        strokeDasharray="75" strokeDashoffset={75*(1-trP)} style={{ transition:dashTr }}/>
      <path d="M305,526 C325,536 345,548 360,558" stroke="#5a2a10" strokeWidth="7" strokeLinecap="round" fill="none"
        strokeDasharray="75" strokeDashoffset={75*(1-trP)} style={{ transition:dashTr }}/>

      <path d="M275,524 C273,350 277,200 275,50 C273,-100 277,-250 275,-400 C274,-480 276,-530 276,-580"
        stroke="#3a1808" strokeWidth={trunkW * 0.35} strokeLinecap="round" fill="none" opacity="0.25"
        strokeDasharray="1200" strokeDashoffset={1200*(1-trP)} style={{ transition:dashTr }}/>
      <path d="M300,524 C298,350 302,200 300,50 C298,-100 302,-250 300,-400 C299,-480 300,-530 300,-580"
        stroke="#6a3018" strokeWidth={trunkW} strokeLinecap="round" fill="none"
        strokeDasharray="1200" strokeDashoffset={1200*(1-trP)} style={{ transition:dashTr }}/>
      <path d="M325,524 C323,350 327,200 325,50 C323,-100 327,-250 325,-400 C324,-480 324,-530 324,-580"
        stroke="#8a4828" strokeWidth={trunkW * 0.26} strokeLinecap="round" fill="none" opacity="0.5"
        strokeDasharray="1200" strokeDashoffset={1200*(1-trP)} style={{ transition:dashTr }}/>

      <g opacity={detP * 0.55} style={{ transition:'opacity 1.5s' }}>
        {[-500,-440,-380,-320,-260,-200,-140,-80,-20,40,100,160,220,280,340,400,460].map((y, i) => (
          <React.Fragment key={y}>
            <path d={`M${294-i%2},${y} Q${293},${y+20} ${295+i%2},${y+40}`} stroke="#2a0e04" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
            <path d={`M${304+i%2},${y+10} Q${305},${y+30} ${303-i%2},${y+50}`} stroke="#2a0e04" strokeWidth="1" fill="none" strokeLinecap="round"/>
            <path d={`M${299},${y+5} Q${300},${y+15} ${299},${y+25}`} stroke="#2a0e04" strokeWidth="0.7" fill="none" strokeLinecap="round"/>
          </React.Fragment>
        ))}
      </g>

      <g opacity={detP * 0.3}>
        <path d="M296,500 C295,300 297,100 296,-100 C295,-250 297,-400 298,-550"
          stroke="#8a3818" strokeWidth="7" fill="none" strokeLinecap="round"
          strokeDasharray="1200" strokeDashoffset={1200*(1-trP)} style={{ transition:dashTr }}/>
      </g>

      {rimLightOp > 0.1 && (
        <path d="M300,524 C298,350 302,200 300,50 C298,-100 302,-250 300,-400 C299,-480 300,-530 300,-580"
          stroke={duskOp>0.5?'#ffb070':'#ffe8a8'} strokeWidth="6" strokeLinecap="round" fill="none"
          opacity={rimLightOp*0.4} transform={`translate(${sunAngleNorm*14},0)`}
          style={{ transition:'opacity 4s,transform 4s,stroke 4s' }}
          strokeDasharray="1200" strokeDashoffset={1200*(1-trP)}/>
      )}

      {TIERS.map(({ apex, base, hw }, i) => {
        const p = tierProgress[i];
        const oy = `300px ${apex + (base - apex) * 0.3}px`;
        const swayAnim = `canopySway ${SWAY_DURATIONS[i]}s ease-in-out ${i * 0.4}s infinite`;
        return (
          <g key={i} style={{
            animation: p > 0.6 ? swayAnim : 'none',
            transformOrigin: oy,
          }}>
            <g style={{
              transform: `scale(${p}) translateY(${(1 - p) * 8}px)`,
              transformOrigin: oy,
              transition: 'transform 1.6s cubic-bezier(0.22,1.6,0.36,1), opacity 0.8s ease-out',
              opacity: Math.min(1, p * 3),
            }}>
              <path d={tierPath(apex+4, base+3, hw*1.04)} fill={theme.leafDark} opacity={0.5}/>
              <path d={tierPath(apex, base, hw)} fill={theme.leafDark}/>
              <path d={tierPath(apex+3, base-5, hw*0.65)} fill={theme.leafMid} opacity={0.9}/>
              <path d={tierPath(apex+7, base-12, hw*0.38)} fill={theme.leafLight} opacity={0.7}/>
              {rimLightOp > 0.08 && (
                <path d={tierPath(apex, base, hw*0.25)}
                  fill={duskOp>0.5?'#ffd080':'#e8ffa8'}
                  opacity={rimLightOp*0.35}
                  style={{ transform:`translateX(${sunAngleNorm*hw*0.06}px)`, transition:'transform 4s' }}/>
              )}
              {nightOp > 0.18 && (
                <path d={tierPath(apex, base, hw)} fill="rgba(8,16,44,0.52)" opacity={nightOp*0.75}/>
              )}
            </g>
          </g>
        );
      })}

      <g opacity={fullP * 0.6} style={{ transition:'opacity 1.5s' }}>
        {MOSS_POSITIONS.map((m, i) => (
          <ellipse key={i} cx={m.cx} cy={m.cy} rx={m.rx} ry={m.ry}
            fill={i % 2 === 0 ? '#5a8a3a' : '#6a9a4a'}
            opacity={0.35 - i * 0.02}
            style={{ animation:`mossBreath ${4+i*0.7}s ease-in-out ${i*0.5}s infinite` }}/>
        ))}
      </g>
    </>
  );
}
