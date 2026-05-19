import React from 'react';
import { c01 } from './treeUtils.js';

function bough(cx, apex, base, hw) {
  const h = base - apex;
  const sag = h * 0.08;
  return (
    `M${cx},${apex} ` +
    `C${cx-hw*0.15},${apex+h*0.28} ${cx-hw*0.65},${apex+h*0.48} ${cx-hw},${base} ` +
    `C${cx-hw*0.65},${base+sag*1.1} ${cx-hw*0.25},${base+sag*0.8} ${cx},${base+sag*0.3} ` +
    `C${cx+hw*0.25},${base+sag*0.8} ${cx+hw*0.65},${base+sag*1.1} ${cx+hw},${base} ` +
    `C${cx+hw*0.65},${apex+h*0.48} ${cx+hw*0.15},${apex+h*0.28} ${cx},${apex} Z`
  );
}

const TIERS = [
  { apex: 82,  base: 158, hw: 36,  pRange: [0.52, 0.70] },
  { apex: 116, base: 202, hw: 52,  pRange: [0.46, 0.64] },
  { apex: 158, base: 254, hw: 70,  pRange: [0.40, 0.58] },
  { apex: 208, base: 314, hw: 90,  pRange: [0.33, 0.51] },
  { apex: 264, base: 380, hw: 112, pRange: [0.26, 0.44] },
  { apex: 328, base: 450, hw: 134, pRange: [0.18, 0.36] },
  { apex: 396, base: 524, hw: 158, pRange: [0.10, 0.28] },
];

const BRANCH_DATA = TIERS.map(({ apex, base, hw }, i) => {
  const y = apex + (base - apex) * 0.35;
  const count = Math.min(8, 3 + i);
  return Array.from({ length: count }, (_, j) => {
    const side = j % 2 === 0 ? -1 : 1;
    const spread = (0.25 + Math.floor(j / 2) * 0.2) * hw;
    const droop = 6 + Math.floor(j / 2) * 4;
    return {
      d: `M300,${y} Q${300 + side * spread * 0.55},${y + droop * 0.4} ${300 + side * spread},${y + droop}`,
      len: Math.sqrt(spread * spread + droop * droop),
    };
  });
});

const PINECONES = [
  { x: 208, y: 445, r: -5 }, { x: 392, y: 440, r: 6 },
  { x: 185, y: 400, r: -8 }, { x: 415, y: 395, r: 4 },
  { x: 230, y: 368, r: -3 }, { x: 370, y: 362, r: 7 },
  { x: 255, y: 320, r: 5 },  { x: 345, y: 315, r: -4 },
];

const SWAY_DUR = [3.6, 4.2, 3.8, 4.6, 4.0, 4.8, 3.9];
const SHIVER_DUR = [2.0, 1.7, 2.3, 1.9, 2.5, 2.1, 2.2];

export default function PineTree({ progress, theme, sunAngleNorm, sunHeight, duskOp, rimLightOp, nightOp }) {
  const trP = c01(progress, 0.00, 0.14);
  const detP = c01(progress, 0.55, 0.82);
  const coneP = c01(progress, 0.62, 0.86);

  const tierProgress = TIERS.map(t => c01(progress, t.pRange[0], t.pRange[1]));
  const trunkW = 12 + trP * 8;

  const shadowDx = -sunAngleNorm * 42;
  const shadowSX = 1 + Math.abs(sunAngleNorm) * 0.5;
  const dashTr = 'stroke-dashoffset 2s cubic-bezier(0.34,1.2,0.64,1), stroke-width 1.8s ease-out';

  return (
    <>
      <ellipse cx={300 + shadowDx} cy="526" rx={72 * shadowSX} ry={6 - sunHeight * 1.2}
        fill={`rgba(20,12,4,${0.08 + (1 - sunHeight) * 0.05})`}
        style={{ transition: 'cx 4s,rx 4s,ry 4s', filter: 'blur(2px)' }} />

      <path d="M286,522 C256,508 222,516 188,530" stroke="#3a1808" strokeWidth="12" strokeLinecap="round" fill="none"
        strokeDasharray="105" strokeDashoffset={105 * (1 - trP)} style={{ transition: dashTr }} />
      <path d="M314,522 C344,508 378,516 412,530" stroke="#3a1808" strokeWidth="12" strokeLinecap="round" fill="none"
        strokeDasharray="105" strokeDashoffset={105 * (1 - trP)} style={{ transition: dashTr }} />
      <path d="M292,526 C272,534 248,542 228,548" stroke="#3a1808" strokeWidth="7" strokeLinecap="round" fill="none"
        strokeDasharray="70" strokeDashoffset={70 * (1 - trP)} style={{ transition: dashTr }} />
      <path d="M308,526 C328,534 352,542 372,548" stroke="#3a1808" strokeWidth="7" strokeLinecap="round" fill="none"
        strokeDasharray="70" strokeDashoffset={70 * (1 - trP)} style={{ transition: dashTr }} />
      <path d="M296,528 C284,536 268,544 252,550" stroke="#3a1808" strokeWidth="5" strokeLinecap="round" fill="none"
        strokeDasharray="50" strokeDashoffset={50 * (1 - trP)} style={{ transition: dashTr }} />
      <path d="M304,528 C316,536 332,544 348,550" stroke="#3a1808" strokeWidth="5" strokeLinecap="round" fill="none"
        strokeDasharray="50" strokeDashoffset={50 * (1 - trP)} style={{ transition: dashTr }} />

      <path d="M296,524 C296,450 298,340 298,200 C298,145 299,105 299,78"
        stroke="#1a0a04" strokeWidth={trunkW + 5} strokeLinecap="round" fill="none" opacity="0.15"
        strokeDasharray="450" strokeDashoffset={450 * (1 - trP)} style={{ transition: dashTr }} />
      <path d="M298,524 C298,450 299,340 299,200 C299,145 300,105 300,78"
        stroke="#3a1808" strokeWidth={trunkW} strokeLinecap="round" fill="none"
        strokeDasharray="450" strokeDashoffset={450 * (1 - trP)} style={{ transition: dashTr }} />
      <path d="M300,524 C300,450 301,340 300,200 C300,145 300,105 300,78"
        stroke="#5a3018" strokeWidth={Math.max(3, trunkW * 0.38)} strokeLinecap="round" fill="none" opacity="0.5"
        strokeDasharray="450" strokeDashoffset={450 * (1 - trP)} style={{ transition: dashTr }} />
      <path d="M302,524 C302,450 302,340 301,200 C301,145 301,105 301,78"
        stroke="#7a4828" strokeWidth={Math.max(1.5, trunkW * 0.15)} strokeLinecap="round" fill="none" opacity="0.3"
        strokeDasharray="450" strokeDashoffset={450 * (1 - trP)} style={{ transition: dashTr }} />

      <g opacity={detP * 0.45} style={{ transition: 'opacity 1.5s' }}>
        {[120, 170, 225, 285, 350, 420, 475].map((y, i) => (
          <React.Fragment key={y}>
            <path d={`M${297 + (i % 2)},${y} Q${296},${y + 14} ${298},${y + 28}`}
              stroke="#1a0804" strokeWidth="0.9" fill="none" strokeLinecap="round" />
            <path d={`M${302 - (i % 2)},${y + 6} Q${303},${y + 18} ${301},${y + 32}`}
              stroke="#1a0804" strokeWidth="0.7" fill="none" strokeLinecap="round" />
            <path d={`M${299},${y + 3} Q${298},${y + 11} ${300},${y + 20}`}
              stroke="#1a0804" strokeWidth="0.5" fill="none" strokeLinecap="round" />
          </React.Fragment>
        ))}
      </g>

      {TIERS.map(({ apex, base, hw }, i) => {
        const p = tierProgress[i];
        const oy = `300px ${apex + (base - apex) * 0.3}px`;

        return (
          <g key={`tier${i}`} style={{
            animation: p > 0.6 ? `canopySway ${SWAY_DUR[i]}s ease-in-out ${i * 0.35}s infinite` : 'none',
            transformOrigin: oy,
          }}>
            <g style={{
              transform: `scale(${p}) translateY(${(1 - p) * 8}px)`,
              transformOrigin: oy,
              transition: 'transform 1.6s cubic-bezier(0.22,1.6,0.36,1), opacity 0.8s ease-out',
              opacity: Math.min(1, p * 3),
            }}>
              <path d={bough(300, apex + 6, base + 5, hw * 1.06)} fill={theme.leafDark} opacity="0.4" />

              <path d={bough(300 - hw * 0.38, apex + (base - apex) * 0.22, base + 3, hw * 0.48)}
                fill={theme.leafDark} opacity="0.55" />
              <path d={bough(300 + hw * 0.38, apex + (base - apex) * 0.20, base + 2, hw * 0.45)}
                fill={theme.leafDark} opacity="0.55" />
              {i > 2 && (
                <>
                  <path d={bough(300 - hw * 0.62, apex + (base - apex) * 0.35, base + 1, hw * 0.3)}
                    fill={theme.leafDark} opacity="0.4" />
                  <path d={bough(300 + hw * 0.62, apex + (base - apex) * 0.33, base, hw * 0.28)}
                    fill={theme.leafDark} opacity="0.4" />
                </>
              )}

              <path d={bough(300, apex, base, hw)} fill={theme.leafDark} />

              <path d={bough(300, apex + 4, base - 6, hw * 0.72)} fill={theme.leafMid} opacity="0.92" />

              {p > 0.35 && BRANCH_DATA[i].map((br, j) => (
                <path key={`br${j}`} d={br.d}
                  stroke={theme.leafDark} strokeWidth="1.5" strokeLinecap="round" fill="none"
                  opacity={0.3 * p}
                  strokeDasharray={br.len} strokeDashoffset={br.len * (1 - p)}
                  style={{ transition: 'stroke-dashoffset 2s ease-out' }} />
              ))}

              <path d={bough(300, apex + 8, base - 16, hw * 0.44)} fill={theme.leafLight} opacity="0.72" />

              {p > 0.65 && (
                <g opacity={0.2 * p}>
                  {Array.from({ length: Math.min(5, 1 + Math.floor(i / 1.5)) }, (_, ni) => {
                    const nx = 300 + (ni - Math.min(5, 1 + Math.floor(i / 1.5)) / 2) * (hw * 0.3);
                    const ny = apex + (base - apex) * (0.35 + (ni % 3) * 0.12);
                    return (
                      <g key={`nd${ni}`}>
                        {[-25, -10, 5, 20].map((a, ai) => {
                          const rad = a * Math.PI / 180;
                          return (
                            <line key={ai} x1={nx} y1={ny}
                              x2={nx + Math.cos(rad) * 5} y2={ny + Math.sin(rad) * 5}
                              stroke={theme.leafLight} strokeWidth="0.7" strokeLinecap="round" />
                          );
                        })}
                      </g>
                    );
                  })}
                </g>
              )}

              {p > 0.7 && (
                <g style={{
                  animation: `pineTierShiver ${SHIVER_DUR[i]}s ease-in-out ${i * 0.22}s infinite`,
                  transformOrigin: `300px ${apex + 4}px`,
                }}>
                  <path d={bough(300, apex + 2, base - 3, hw * 0.55)} fill={theme.leafMid} opacity="0.16" />
                </g>
              )}

              {rimLightOp > 0.08 && (
                <path d={bough(300, apex, base, hw * 0.28)}
                  fill={duskOp > 0.5 ? '#ffd080' : '#e8ffa8'}
                  opacity={rimLightOp * 0.4}
                  style={{ transform: `translateX(${sunAngleNorm * hw * 0.07}px)`, transition: 'transform 4s' }} />
              )}

              {nightOp > 0.18 && (
                <path d={bough(300, apex, base, hw)} fill="rgba(8,16,44,0.50)" opacity={nightOp * 0.8} />
              )}

              {progress > 0.88 && i < 3 && (
                <path d={bough(300, apex, apex + (base - apex) * 0.22, hw * 0.36)}
                  fill="rgba(232,246,255,0.88)" opacity={0.9 * p} />
              )}
            </g>
          </g>
        );
      })}

      {coneP > 0 && (
        <g opacity={Math.min(1, coneP * 2.5)} style={{ transition: 'opacity 1.5s' }}>
          {PINECONES.map((pc, i) => (
            <g key={`cone${i}`} transform={`rotate(${pc.r} ${pc.x} ${pc.y})`}
              style={{ animation: coneP > 0.5 ? `canopySway ${5 + i * 0.3}s ease-in-out ${i * 0.4}s infinite` : 'none',
                       transformOrigin: `${pc.x}px ${pc.y - 8}px` }}>
              <ellipse cx={pc.x} cy={pc.y} rx="5" ry="8" fill="#5a3818" />
              <ellipse cx={pc.x} cy={pc.y - 1} rx="3.5" ry="5.5" fill="#7a5028" opacity="0.7" />
              <ellipse cx={pc.x} cy={pc.y - 2} rx="1.8" ry="3.2" fill="#9a6838" opacity="0.5" />
              {[-4, -1, 2, 5].map((dy, si) => (
                <path key={si} d={`M${pc.x - 3.5},${pc.y + dy} Q${pc.x},${pc.y + dy - 1.8} ${pc.x + 3.5},${pc.y + dy}`}
                  stroke="#4a2808" strokeWidth="0.5" fill="none" opacity="0.45" />
              ))}
            </g>
          ))}
        </g>
      )}

      {detP > 0.6 && (
        <g opacity={detP * 0.85} style={{ transition: 'opacity 1s' }}>
          <g style={{ animation: 'crownStarSpin 18s linear infinite', transformOrigin: '300px 74px' }}>
            {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => {
              const r = deg * Math.PI / 180;
              return <line key={deg} x1="300" y1="74" x2={300 + Math.cos(r) * 11} y2={74 + Math.sin(r) * 11}
                stroke={theme.leafLight} strokeWidth="1.8" strokeLinecap="round" opacity="0.75" />;
            })}
          </g>
          <circle cx="300" cy="74" r="4.5" fill={theme.leafLight} opacity="0.95"
            style={{ animation: 'twinkle 2.8s ease-in-out infinite' }} />
          <circle cx="300" cy="74" r="7" fill={theme.leafLight} opacity="0.15"
            style={{ animation: 'twinkle 2.8s ease-in-out 0.5s infinite', filter: 'blur(2px)' }} />
        </g>
      )}

      {rimLightOp > 0.1 && (
        <path d="M298,524 C298,450 299,340 299,200 C299,145 300,105 300,78"
          stroke={duskOp > 0.5 ? '#c89060' : '#ffe8c0'} strokeWidth="3.5" strokeLinecap="round" fill="none"
          opacity={rimLightOp * 0.3} transform={`translate(${sunAngleNorm * 6},0)`}
          style={{ transition: 'transform 4s,opacity 4s' }}
          strokeDasharray="450" strokeDashoffset={450 * (1 - trP)} />
      )}
    </>
  );
}
