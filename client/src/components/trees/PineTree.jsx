import React from 'react';
import { c01 } from './treeUtils.js';

const TIERS = [
  { apex:88,  base:172, hw:44,  pRange:[0.50,0.70] },
  { apex:128, base:220, hw:60,  pRange:[0.43,0.62] },
  { apex:174, base:276, hw:78,  pRange:[0.36,0.54] },
  { apex:226, base:338, hw:98,  pRange:[0.29,0.47] },
  { apex:284, base:404, hw:119, pRange:[0.22,0.41] },
  { apex:350, base:472, hw:142, pRange:[0.15,0.34] },
  { apex:420, base:524, hw:164, pRange:[0.08,0.28] },
];

function tierPath(apex, base, hw) {
  const cx = 300;
  const h  = base - apex;
  const cy = apex + h * 0.62;
  const dp = h * 0.07;
  return `M${cx},${apex} `
    + `C${cx-hw*0.18},${cy} ${cx-hw*0.74},${base} ${cx-hw},${base+dp} `
    + `Q${cx},${base+dp*0.5} ${cx+hw},${base+dp} `
    + `C${cx+hw*0.74},${base} ${cx+hw*0.18},${cy} ${cx},${apex} Z`;
}

const SWAY_DURATIONS = [3.8, 4.5, 4.1, 4.9, 4.3, 5.2, 4.7];
const SHIVER_DURATIONS = [2.1, 1.8, 2.4, 1.9, 2.6, 2.0, 2.3];

export default function PineTree({ progress, theme, sunAngleNorm, sunHeight, duskOp, rimLightOp, nightOp }) {
  const trP  = c01(progress, 0.00, 0.13);
  const detP = c01(progress, 0.60, 0.88);

  const tierProgress = TIERS.map(t => c01(progress, t.pRange[0], t.pRange[1]));
  const trunkW = 8 + trP * 5;

  const shadowDx = -sunAngleNorm * 38;
  const shadowSX = 1 + Math.abs(sunAngleNorm) * 0.5;

  const dashTr = 'stroke-dashoffset 2s cubic-bezier(0.34,1.2,0.64,1), stroke-width 1.8s ease-out';

  return (
    <>
      <ellipse cx={300+shadowDx} cy="524" rx={65*shadowSX} ry={5.5-sunHeight*1.2}
        fill={`rgba(20,12,4,${0.07+(1-sunHeight)*0.04})`}
        style={{ transition:'cx 4s,rx 4s,ry 4s', filter:'blur(2px)' }}/>

      <path d="M294,520 C272,508 250,518 230,528" stroke="#3a1808" strokeWidth="9" strokeLinecap="round" fill="none"
        strokeDasharray="72" strokeDashoffset={72*(1-trP)} style={{ transition:dashTr }}/>
      <path d="M306,522 C330,510 354,520 372,528" stroke="#3a1808" strokeWidth="9" strokeLinecap="round" fill="none"
        strokeDasharray="72" strokeDashoffset={72*(1-trP)} style={{ transition:dashTr }}/>

      <path d="M296,524 C296,460 297,350 298,200 C298,150 299,110 299,88"
        stroke="#1a0a04" strokeWidth={trunkW+3} strokeLinecap="round" fill="none" opacity="0.15"
        strokeDasharray="438" strokeDashoffset={438*(1-trP)} style={{ transition:dashTr }}/>
      <path d="M296,524 C296,460 297,350 298,200 C298,150 299,110 299,88"
        stroke="#3a1808" strokeWidth={trunkW} strokeLinecap="round" fill="none"
        strokeDasharray="438" strokeDashoffset={438*(1-trP)} style={{ transition:dashTr }}/>
      <path d="M299,524 C299,460 300,350 301,200 C301,150 302,110 302,88"
        stroke="#6a4020" strokeWidth={Math.max(2, trunkW*0.3)} strokeLinecap="round" fill="none" opacity="0.55"
        strokeDasharray="438" strokeDashoffset={438*(1-trP)} style={{ transition:dashTr }}/>

      {TIERS.map(({ apex, base, hw }, i) => {
        const p = tierProgress[i];
        const oy = `300px ${apex + (base - apex) * 0.25}px`;
        const swayAnim = `canopySway ${SWAY_DURATIONS[i]}s ease-in-out ${i * 0.35}s infinite`;
        const shiverAnim = `pineTierShiver ${SHIVER_DURATIONS[i]}s ease-in-out ${i * 0.22}s infinite`;
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
              <path d={tierPath(apex + 6, base + 5, hw * 1.06)} fill={theme.leafDark} opacity={0.6}/>
              <path d={tierPath(apex, base, hw)} fill={theme.leafDark}/>
              <path d={tierPath(apex + 4, base - 4, hw * 0.70)} fill={theme.leafMid} opacity={0.94}/>
              <path d={tierPath(apex + 9, base - 14, hw * 0.44)} fill={theme.leafLight} opacity={0.76}/>
              {p > 0.7 && (
                <g style={{ animation: shiverAnim, transformOrigin: `300px ${apex + 4}px` }}>
                  <path d={tierPath(apex + 2, base - 2, hw * 0.52)} fill={theme.leafMid} opacity={0.18}/>
                </g>
              )}
              {rimLightOp > 0.08 && (
                <path d={tierPath(apex, base, hw * 0.30)}
                  fill={duskOp > 0.5 ? '#ffd080' : '#e8ffa8'}
                  opacity={rimLightOp * 0.42}
                  style={{ transform: `translateX(${sunAngleNorm * hw * 0.07}px)`, transition: 'transform 4s' }}/>
              )}
              {nightOp > 0.18 && (
                <path d={tierPath(apex, base, hw)} fill="rgba(8,16,44,0.52)" opacity={nightOp * 0.8}/>
              )}
              {progress > 0.88 && i < 2 && (
                <path d={tierPath(apex, apex + (base - apex) * 0.26, hw * 0.34)}
                  fill="rgba(232,246,255,0.90)" opacity={0.9 * p}/>
              )}
            </g>
          </g>
        );
      })}

      <g opacity={detP * 0.4} style={{ transition: 'opacity 1.5s' }}>
        {[130, 190, 260, 340, 420].map(y => (
          <React.Fragment key={y}>
            <path d={`M296,${y} Q295,${y + 15} 297,${y + 30}`} stroke="#1a0804" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
            <path d={`M302,${y + 8} Q303,${y + 22} 301,${y + 38}`} stroke="#1a0804" strokeWidth="0.6" fill="none" strokeLinecap="round"/>
          </React.Fragment>
        ))}
      </g>

      {detP > 0.6 && (
        <g opacity={detP * 0.85} style={{ transition: 'opacity 1s' }}>
          <g style={{ animation: 'crownStarSpin 18s linear infinite', transformOrigin: '299px 84px' }}>
            {[0, 60, 120, 180, 240, 300].map(deg => {
              const r = deg * Math.PI / 180;
              return <line key={deg} x1="299" y1="84" x2={299 + Math.cos(r) * 9} y2={84 + Math.sin(r) * 9}
                stroke={theme.leafLight} strokeWidth="1.5" strokeLinecap="round" opacity="0.8"/>;
            })}
          </g>
          <circle cx="299" cy="84" r="3.5" fill={theme.leafLight} opacity="0.95"
            style={{ animation: 'twinkle 2.8s ease-in-out infinite' }}/>
        </g>
      )}
    </>
  );
}
