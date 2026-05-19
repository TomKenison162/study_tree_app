import React from 'react';
import { c01 } from './treeUtils.js';

const STALKS = [
  { x: 300, top: 15,  w: 16, delay: 0.00, curve: 0,   lean: 0 },
  { x: 265, top: 42,  w: 14, delay: 0.02, curve: -10, lean: -3 },
  { x: 335, top: 38,  w: 14, delay: 0.03, curve: 8,   lean: 2 },
  { x: 232, top: 82,  w: 12, delay: 0.05, curve: -14, lean: -5 },
  { x: 368, top: 72,  w: 12, delay: 0.06, curve: 12,  lean: 4 },
  { x: 282, top: 55,  w: 11, delay: 0.08, curve: -6,  lean: -2 },
  { x: 318, top: 50,  w: 11, delay: 0.09, curve: 5,   lean: 1 },
  { x: 210, top: 115, w: 9,  delay: 0.11, curve: -18, lean: -6 },
  { x: 390, top: 105, w: 9,  delay: 0.12, curve: 15,  lean: 5 },
  { x: 248, top: 95,  w: 10, delay: 0.14, curve: -11, lean: -4 },
  { x: 352, top: 88,  w: 10, delay: 0.15, curve: 9,   lean: 3 },
];

function stalkPath(s) {
  const midX = s.x + s.curve;
  const topX = s.x + s.curve * 0.7 + s.lean;
  return `M${s.x},520 C${s.x},${(520 + s.top) * 0.6} ${midX},${(520 + s.top) * 0.4} ${topX},${s.top}`;
}

function interpQuad(x0, y0, x1, y1, x2, y2, t) {
  const mt = 1 - t;
  return {
    x: mt * mt * x0 + 2 * mt * t * x1 + t * t * x2,
    y: mt * mt * y0 + 2 * mt * t * y1 + t * t * y2,
  };
}

const SWAY_DUR = [5.2, 4.8, 5.5, 4.6, 5.0, 5.8, 4.9, 5.3, 4.7, 5.1, 4.5];

export default function BambooTree({ progress, theme, sunAngleNorm, sunHeight, duskOp, rimLightOp, nightOp }) {
  const shadowDx = -sunAngleNorm * 38;
  const shadowSX = 1 + Math.abs(sunAngleNorm) * 0.5;
  const dashTr = 'stroke-dashoffset 2s cubic-bezier(0.34,1.2,0.64,1)';
  const shootP = c01(progress, 0.00, 0.06);

  return (
    <>
      <ellipse cx={300 + shadowDx} cy="524" rx={80 * shadowSX} ry={5.5 - sunHeight * 1}
        fill={`rgba(20,12,4,${0.07 + (1 - sunHeight) * 0.04})`}
        style={{ transition: 'cx 4s,rx 4s,ry 4s', filter: 'blur(2px)' }} />

      {shootP > 0 && shootP < 0.95 && (
        <g opacity={Math.min(1, shootP * 5) * (1 - c01(progress, 0.05, 0.10))} style={{ transition: 'opacity 0.8s' }}>
          {[{ x: 288, h: 28 }, { x: 312, h: 22 }, { x: 272, h: 18 }, { x: 340, h: 15 }].map((sh, i) => (
            <g key={`sh${i}`}>
              <polygon points={`${sh.x - 3},520 ${sh.x},${520 - sh.h * shootP} ${sh.x + 3},520`}
                fill={theme.leafMid} opacity="0.8" />
              <polygon points={`${sh.x - 1},520 ${sh.x + 0.5},${520 - sh.h * shootP * 0.7} ${sh.x + 2},520`}
                fill={theme.leafLight} opacity="0.4" />
            </g>
          ))}
        </g>
      )}

      <g style={{
        animation: 'bambooLean 8s ease-in-out infinite',
        transformOrigin: '300px 524px',
      }}>
        {STALKS.map((s, i) => {
          const p = c01(progress, s.delay, s.delay + 0.28);
          const leafStart = s.delay + 0.22;
          const leafP = c01(progress, leafStart, leafStart + 0.24);
          const h = 520 - s.top;
          const segments = Math.floor(h / 48);
          const sd = stalkPath(s);

          const midX = s.x + s.curve;
          const topX = s.x + s.curve * 0.7 + s.lean;
          const cpX = (s.x + midX) / 2;
          const cpY = (520 + s.top) / 2;

          return (
            <g key={`bst${i}`}>
              <path d={sd} stroke="#2a1808" strokeWidth={s.w + 3} strokeLinecap="round" fill="none" opacity="0.1"
                strokeDasharray={h} strokeDashoffset={h * (1 - p)} style={{ transition: dashTr }} />
              <path d={sd} stroke={theme.leafDark} strokeWidth={s.w} strokeLinecap="round" fill="none"
                strokeDasharray={h} strokeDashoffset={h * (1 - p)} style={{ transition: dashTr }} />
              <path d={sd} stroke={theme.leafMid} strokeWidth={s.w * 0.55} strokeLinecap="round" fill="none" opacity="0.6"
                strokeDasharray={h} strokeDashoffset={h * (1 - p)} style={{ transition: dashTr }} />
              <path d={sd} stroke={theme.leafLight} strokeWidth={s.w * 0.2} strokeLinecap="round" fill="none" opacity="0.25"
                strokeDasharray={h} strokeDashoffset={h * (1 - p)} style={{ transition: dashTr }} />

              {Array.from({ length: segments }, (_, j) => {
                const t = (j + 1) / (segments + 1);
                const pt = interpQuad(s.x, 520, cpX, cpY, topX, s.top, t);
                const visible = p > t;
                if (!visible) return null;
                const side = (i + j) % 2 === 0 ? -1 : 1;
                return (
                  <g key={`nd${j}`}>
                    <line x1={pt.x - s.w * 0.75} y1={pt.y} x2={pt.x + s.w * 0.75} y2={pt.y}
                      stroke={theme.leafDark} strokeWidth="3" strokeLinecap="round" opacity="0.55" />
                    <line x1={pt.x - s.w * 0.5} y1={pt.y} x2={pt.x + s.w * 0.5} y2={pt.y}
                      stroke={theme.leafLight} strokeWidth="1.2" strokeLinecap="round" opacity="0.35" />
                    {j % 2 === 0 && (
                      <path d={`M${pt.x + side * s.w * 0.35},${pt.y} L${pt.x + side * (s.w * 0.35 + 6)},${pt.y - 7} L${pt.x + side * s.w * 0.15},${pt.y - 4} Z`}
                        fill={theme.leafMid} opacity="0.3" />
                    )}
                    {j > 0 && j % 2 === 1 && (
                      <path d={`M${pt.x},${pt.y} L${pt.x + side * 16},${pt.y - 10}`}
                        stroke={theme.leafDark} strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.35" />
                    )}
                  </g>
                );
              })}

              {leafP > 0 && (
                <g style={{
                  animation: leafP > 0.6
                    ? `bambooLeafFlutter ${SWAY_DUR[i] * 0.42}s ease-in-out ${i * 0.25}s infinite`
                    : 'none',
                  transformOrigin: `${topX}px ${s.top}px`,
                }}>
                  <g style={{
                    transform: `scale(${leafP}) rotate(${(1 - leafP) * 12}deg)`,
                    transformOrigin: `${topX}px ${s.top}px`,
                    transition: 'transform 1.6s cubic-bezier(0.22,1.5,0.36,1)',
                  }}>
                    {[-70, -50, -30, -10, 10, 30, 50, 70, -85, 85].map((angle, li) => {
                      const rad = (angle - 90) * Math.PI / 180;
                      const leafLen = 25 + (li % 3) * 10 + (i < 3 ? 5 : 0);
                      const flip = li % 2 === 0 ? -4 : 4;
                      const tipX = topX + Math.cos(rad) * leafLen;
                      const tipY = s.top + Math.sin(rad) * leafLen;
                      const cpX2 = (topX + tipX) / 2 + Math.sin(rad) * flip;
                      const cpY2 = (s.top + tipY) / 2 - Math.cos(rad) * flip;
                      return (
                        <g key={`lf${li}`}>
                          <path d={`M${topX},${s.top} Q${cpX2},${cpY2} ${tipX},${tipY}`}
                            stroke={li % 2 === 0 ? theme.leafMid : theme.leafLight}
                            strokeWidth={2.5 - li * 0.1} strokeLinecap="round" fill="none"
                            opacity={0.82 - li * 0.03} />
                          <path d={`M${topX},${s.top} Q${cpX2 + flip * 0.3},${cpY2} ${tipX},${tipY}`}
                            stroke={li % 3 === 0 ? theme.leafLight : theme.leafMid}
                            strokeWidth={4 - li * 0.2} strokeLinecap="round" fill="none"
                            opacity={0.25} />
                        </g>
                      );
                    })}
                  </g>
                </g>
              )}

              {leafP > 0.5 && i < 6 && (
                <g opacity={leafP * 0.55}>
                  {[0.3, 0.55].map((t, mi) => {
                    const pt = interpQuad(s.x, 520, cpX, cpY, topX, s.top, t);
                    return (
                      <g key={`ml${mi}`}>
                        {[-50, -20, 15, 45].map((a, ai) => {
                          const rad = (a - 90) * Math.PI / 180;
                          const ll = 15 + ai * 2;
                          const tx = pt.x + Math.cos(rad) * ll;
                          const ty = pt.y + Math.sin(rad) * ll;
                          return (
                            <path key={ai} d={`M${pt.x},${pt.y} Q${(pt.x + tx) / 2 + 2},${(pt.y + ty) / 2 - 2} ${tx},${ty}`}
                              stroke={ai % 2 === 0 ? theme.leafMid : theme.leafLight}
                              strokeWidth={1.3} strokeLinecap="round" fill="none" opacity={0.45} />
                          );
                        })}
                      </g>
                    );
                  })}
                </g>
              )}

              {rimLightOp > 0.1 && (
                <path d={sd}
                  stroke={duskOp > 0.5 ? '#a0d060' : '#d0ffa0'} strokeWidth="2" strokeLinecap="round" fill="none"
                  opacity={rimLightOp * 0.3} transform={`translate(${sunAngleNorm * 3},0)`}
                  strokeDasharray={h} strokeDashoffset={h * (1 - p)}
                  style={{ transition: 'stroke-dashoffset 2s,transform 4s' }} />
              )}
              {nightOp > 0.18 && (
                <path d={sd}
                  stroke="rgba(8,16,44,0.4)" strokeWidth={s.w + 4} strokeLinecap="round" fill="none"
                  opacity={nightOp * 0.5} strokeDasharray={h} strokeDashoffset={h * (1 - p)} />
              )}
            </g>
          );
        })}
      </g>

      {progress > 0.45 && (
        <g opacity={c01(progress, 0.45, 0.70) * 0.4}>
          {[
            { x: 238, r: 18 }, { x: 262, r: -10 }, { x: 325, r: 25 },
            { x: 358, r: -15 }, { x: 290, r: 8 }, { x: 380, r: -5 },
          ].map((d, i) => (
            <ellipse key={i} cx={d.x} cy={522} rx="4.5" ry="1.5" fill={i % 2 === 0 ? theme.leafMid : theme.leafDark}
              transform={`rotate(${d.r} ${d.x} 522)`} opacity="0.45" />
          ))}
        </g>
      )}
    </>
  );
}
