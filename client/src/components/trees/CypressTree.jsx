import React from 'react';
import { c01 } from './treeUtils.js';

const TIERS = [
  { cy: 495, rx: 56, ry: 36,  pRange: [0.08, 0.26] },
  { cy: 455, rx: 52, ry: 38,  pRange: [0.11, 0.29] },
  { cy: 412, rx: 48, ry: 40,  pRange: [0.14, 0.32] },
  { cy: 368, rx: 44, ry: 42,  pRange: [0.17, 0.35] },
  { cy: 322, rx: 40, ry: 44,  pRange: [0.20, 0.38] },
  { cy: 275, rx: 36, ry: 46,  pRange: [0.24, 0.42] },
  { cy: 228, rx: 32, ry: 48,  pRange: [0.28, 0.46] },
  { cy: 180, rx: 28, ry: 50,  pRange: [0.32, 0.50] },
  { cy: 130, rx: 24, ry: 52,  pRange: [0.36, 0.54] },
  { cy: 78,  rx: 19, ry: 48,  pRange: [0.40, 0.58] },
  { cy: 32,  rx: 13, ry: 40,  pRange: [0.44, 0.62] },
];

const TEXTURE_DOTS = TIERS.map((t, i) => {
  const count = Math.max(4, Math.floor(t.rx / 5));
  return Array.from({ length: count }, (_, j) => {
    const angle = ((j / count) * 2 - 1) * 0.7;
    const yOff = (j % 3 - 1) * t.ry * 0.2;
    return {
      cx: 300 + Math.sin(angle) * t.rx * 0.65,
      cy: t.cy + yOff,
      r: 2.5 + (j % 2) * 1.5,
    };
  });
});

const WAVE_DELAYS = [0, 0.12, 0.24, 0.36, 0.48, 0.60, 0.72, 0.84, 0.96, 1.08, 1.20];

export default function CypressTree({ progress, theme, sunAngleNorm, sunHeight, duskOp, rimLightOp, nightOp }) {
  const trP = c01(progress, 0.00, 0.14);
  const detP = c01(progress, 0.54, 0.82);

  const tierProgress = TIERS.map(t => c01(progress, t.pRange[0], t.pRange[1]));
  const trunkW = 10 + trP * 7;

  const shadowDx = -sunAngleNorm * 22;
  const shadowSX = 1 + Math.abs(sunAngleNorm) * 0.35;

  const dashTr = 'stroke-dashoffset 2s cubic-bezier(0.34,1.2,0.64,1), stroke-width 1.8s ease-out';

  return (
    <>
      <ellipse cx={300 + shadowDx} cy="526" rx={36 * shadowSX} ry={4 - sunHeight * 0.8}
        fill={`rgba(20,12,4,${0.08 + (1 - sunHeight) * 0.04})`}
        style={{ transition: 'cx 4s,rx 4s,ry 4s', filter: 'blur(1.5px)' }} />

      <path d="M294,524 C286,518 276,522 264,528" stroke="#4a3018" strokeWidth="8" strokeLinecap="round" fill="none"
        strokeDasharray="40" strokeDashoffset={40 * (1 - trP)}
        style={{ transition: 'stroke-dashoffset 1.3s cubic-bezier(0.34,1.4,0.64,1)' }} />
      <path d="M306,524 C314,518 324,522 336,528" stroke="#4a3018" strokeWidth="8" strokeLinecap="round" fill="none"
        strokeDasharray="40" strokeDashoffset={40 * (1 - trP)}
        style={{ transition: 'stroke-dashoffset 1.3s cubic-bezier(0.34,1.4,0.64,1)' }} />
      <path d="M296,526 C290,530 282,534 274,536" stroke="#4a3018" strokeWidth="5" strokeLinecap="round" fill="none"
        strokeDasharray="25" strokeDashoffset={25 * (1 - trP)} style={{ transition: dashTr }} />
      <path d="M304,526 C310,530 318,534 326,536" stroke="#4a3018" strokeWidth="5" strokeLinecap="round" fill="none"
        strokeDasharray="25" strokeDashoffset={25 * (1 - trP)} style={{ transition: dashTr }} />

      <path d="M300,522 C299,420 300,320 299,220 C298,155 299,95 300,25"
        stroke="#2a1206" strokeWidth={trunkW * 0.45} strokeLinecap="round" fill="none" opacity="0.15"
        strokeDasharray="500" strokeDashoffset={500 * (1 - trP)} style={{ transition: dashTr }} />
      <path d="M300,522 C299,420 300,320 299,220 C298,155 299,95 300,25"
        stroke="#4a2810" strokeWidth={trunkW} strokeLinecap="round" fill="none"
        strokeDasharray="500" strokeDashoffset={500 * (1 - trP)} style={{ transition: dashTr }} />
      <path d="M301,522 C300,420 301,320 300,220 C299,155 300,95 301,25"
        stroke="#6a4828" strokeWidth={Math.max(2, trunkW * 0.32)} strokeLinecap="round" fill="none" opacity="0.45"
        strokeDasharray="500" strokeDashoffset={500 * (1 - trP)} style={{ transition: dashTr }} />

      <g opacity={detP * 0.35} style={{ transition: 'opacity 1.5s' }}>
        {[480, 420, 360, 300, 240, 180, 120, 65].map((y, i) => (
          <path key={y} d={`M${299 + (i % 2)},${y} Q${298},${y + 16} ${300},${y + 32}`}
            stroke="#1a0804" strokeWidth="0.7" fill="none" strokeLinecap="round" />
        ))}
      </g>

      {TIERS.map((t, i) => {
        const p = tierProgress[i];
        const oy = `300px ${t.cy}px`;
        return (
          <g key={`ct${i}`} style={{
            animation: p > 0.6
              ? `cypressWave 4s ease-in-out ${WAVE_DELAYS[i]}s infinite`
              : 'none',
            transformOrigin: oy,
          }}>
            <g style={{
              transform: `scale(${p}) translateY(${(1 - p) * 6}px)`,
              transformOrigin: oy,
              transition: 'transform 1.6s cubic-bezier(0.22,1.6,0.36,1), opacity 0.8s ease-out',
              opacity: Math.min(1, p * 3),
            }}>
              <ellipse cx={300} cy={t.cy} rx={t.rx + 4} ry={t.ry + 3} fill={theme.leafDark} opacity="0.35" />

              <ellipse cx={300 - t.rx * 0.4} cy={t.cy - t.ry * 0.1} rx={t.rx * 0.55} ry={t.ry * 0.7}
                fill={theme.leafDark} opacity="0.5" />
              <ellipse cx={300 + t.rx * 0.4} cy={t.cy + t.ry * 0.08} rx={t.rx * 0.52} ry={t.ry * 0.68}
                fill={theme.leafDark} opacity="0.5" />

              <ellipse cx={300} cy={t.cy} rx={t.rx} ry={t.ry} fill={theme.leafDark} />

              <ellipse cx={300} cy={t.cy - 2} rx={t.rx * 0.74} ry={t.ry * 0.82} fill={theme.leafMid} opacity="0.88" />

              <ellipse cx={300} cy={t.cy - 4} rx={t.rx * 0.44} ry={t.ry * 0.58} fill={theme.leafLight} opacity="0.62" />

              {p > 0.5 && TEXTURE_DOTS[i] && TEXTURE_DOTS[i].map((dot, di) => (
                <circle key={`td${di}`} cx={dot.cx} cy={dot.cy} r={dot.r}
                  fill={di % 2 === 0 ? theme.leafMid : theme.leafDark}
                  opacity={0.25 * p} />
              ))}

              {rimLightOp > 0.08 && (
                <ellipse cx={300 + sunAngleNorm * t.rx * 0.35} cy={t.cy - sunHeight * t.ry * 0.15}
                  rx={t.rx * 0.22} ry={t.ry * 0.28}
                  fill={duskOp > 0.5 ? '#ffd080' : '#e8ffa8'} opacity={rimLightOp * 0.35}
                  style={{ filter: 'blur(2px)', transition: 'cx 4s,cy 4s' }} />
              )}
              {nightOp > 0.18 && (
                <ellipse cx={300} cy={t.cy} rx={t.rx} ry={t.ry}
                  fill="rgba(8,16,44,0.48)" opacity={nightOp * 0.7} />
              )}
            </g>
          </g>
        );
      })}

      {detP > 0.4 && (
        <g opacity={detP * 0.75} style={{ transition: 'opacity 1.5s' }}>
          <ellipse cx="300" cy="-5" rx="5" ry="22" fill={theme.leafDark} />
          <ellipse cx="300" cy="-5" rx="3" ry="17" fill={theme.leafMid} opacity="0.85" />
          <ellipse cx="300" cy="-5" rx="1.5" ry="12" fill={theme.leafLight} opacity="0.6" />
          <circle cx="300" cy="-22" r="3" fill={theme.leafLight} opacity="0.8"
            style={{ animation: 'twinkle 3.5s ease-in-out infinite' }} />
          <circle cx="300" cy="-22" r="5" fill={theme.leafLight} opacity="0.15"
            style={{ filter: 'blur(2px)', animation: 'twinkle 3.5s ease-in-out 0.5s infinite' }} />
        </g>
      )}

      {detP > 0.6 && (
        <g opacity={detP * 0.4} style={{ transition: 'opacity 1.5s' }}>
          {[
            { x: 300 - 8, y: 45 }, { x: 300 + 6, y: 80 },
            { x: 300 - 5, y: 120 }, { x: 300 + 7, y: 160 },
          ].map((gap, i) => (
            <line key={i} x1={gap.x} y1={gap.y} x2={gap.x + 1} y2={gap.y + 15}
              stroke="#4a2810" strokeWidth="1.2" strokeLinecap="round" opacity="0.3" />
          ))}
        </g>
      )}
    </>
  );
}
