import React from 'react';
import { c01, TR, TR_SLOW } from './treeUtils.js';

const PUFFS = [
  { cx:202, cy:400, r:28, col:'dark',  pKey:'p1' },
  { cx:220, cy:386, r:22, col:'mid',   pKey:'p1' },
  { cx:188, cy:388, r:20, col:'dark',  pKey:'p1' },
  { cx:212, cy:370, r:17, col:'light', pKey:'p1' },
  { cx:198, cy:375, r:14, col:'mid',   pKey:'p1' },
  { cx:390, cy:392, r:26, col:'dark',  pKey:'p2' },
  { cx:405, cy:376, r:20, col:'mid',   pKey:'p2' },
  { cx:374, cy:382, r:19, col:'dark',  pKey:'p2' },
  { cx:396, cy:362, r:16, col:'light', pKey:'p2' },
  { cx:298, cy:400, r:22, col:'mid',   pKey:'p3' },
  { cx:300, cy:383, r:18, col:'light', pKey:'p3' },
  { cx:290, cy:370, r:15, col:'mid',   pKey:'p3' },
  { cx:308, cy:360, r:12, col:'light', pKey:'p4' },
  { cx:295, cy:354, r:10, col:'light', pKey:'p4' },
];

const SWAY_DUR = [3.8, 4.2, 3.6, 4.5, 4.0, 3.9, 4.4, 3.7, 4.1, 3.8, 4.3, 3.9, 4.6, 4.2];

export default function BonsaiTree({ progress, theme, sunAngleNorm, sunHeight, duskOp, rimLightOp, nightOp }) {
  const potP  = c01(progress, 0.00, 0.12);
  const trP   = c01(progress, 0.06, 0.22);
  const brP   = c01(progress, 0.16, 0.38);
  const p1P   = c01(progress, 0.28, 0.50);
  const p2P   = c01(progress, 0.38, 0.60);
  const p3P   = c01(progress, 0.48, 0.72);
  const p4P   = c01(progress, 0.58, 0.80);
  const detP  = c01(progress, 0.60, 0.88);

  const pMap = { p1: p1P, p2: p2P, p3: p3P, p4: p4P };
  const colMap = (col) => col === 'dark' ? theme.leafDark : col === 'mid' ? theme.leafMid : theme.leafLight;

  const shadowDx = -sunAngleNorm * 38;

  return (
    <>
      {/* Pot */}
      <g opacity={potP} style={{ transition:'opacity 0.6s' }}>
        <path d="M270,521 L330,521 L322,503 L278,503 Z" fill="#c4845a"/>
        <path d="M268,519 L332,519 L322,507 L278,507 Z" fill="#a06840" opacity="0.5"/>
        <path d="M270,521 L330,521" stroke="#e0a87a" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M278,503 L322,503" stroke="#9a5830" strokeWidth="1" strokeLinecap="round"/>
        <ellipse cx="300" cy="503" rx="22" ry="3.5" fill="#6a4020" opacity="0.6"/>
        <ellipse cx="300" cy="503" rx="18" ry="2.5" fill="#8a6840" opacity="0.4"/>
        {/* Pot rim glaze shimmer */}
        <path d="M278,503 L322,503" stroke="rgba(255,240,200,0.4)" strokeWidth="0.8"
          strokeLinecap="round"
          style={{ animation:'birchShimmer 5s ease-in-out infinite' }}/>
      </g>

      {/* Shadow */}
      <ellipse cx={300+shadowDx} cy="522" rx={60+Math.abs(sunAngleNorm)*20} ry="4"
        fill="rgba(20,12,4,0.10)" style={{ filter:'blur(2px)', transition:'cx 4s,rx 4s' }}/>

      {/* Trunk */}
      <path d="M300,503 C295,488 306,472 300,458 C295,446 288,438 292,425 C295,415 302,408 299,396"
        stroke="#3a1808" strokeWidth="11" strokeLinecap="round" fill="none"
        strokeDasharray="115" strokeDashoffset={115*(1-trP)} style={{ transition:TR }}/>
      <path d="M302,503 C298,488 308,472 302,458 C297,446 290,438 294,425"
        stroke="#7a4828" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.5"
        strokeDasharray="80" strokeDashoffset={80*(1-trP)} style={{ transition:TR }}/>

      {/* Bark marks */}
      <g opacity={detP * 0.5} style={{ transition:'opacity 1.5s' }}>
        <path d="M299,490 Q297,480 300,470" stroke="#1a0804" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
        <path d="M301,468 Q300,455 302,445" stroke="#1a0804" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
        <path d="M299,442 Q297,432 300,422" stroke="#1a0804" strokeWidth="0.7" fill="none" strokeLinecap="round"/>
      </g>

      {/* Branches */}
      <path d="M295,440 C278,435 258,428 238,422" stroke="#4a2410" strokeWidth="7" strokeLinecap="round" fill="none"
        strokeDasharray="62" strokeDashoffset={62*(1-brP)} style={{ transition:TR }}/>
      <path d="M238,422 C225,418 212,414 198,410" stroke="#4a2410" strokeWidth="5" strokeLinecap="round" fill="none"
        strokeDasharray="45" strokeDashoffset={45*(1-brP)} style={{ transition:TR }}/>
      <path d="M300,448 C318,442 338,435 360,428" stroke="#4a2410" strokeWidth="7" strokeLinecap="round" fill="none"
        strokeDasharray="65" strokeDashoffset={65*(1-brP)} style={{ transition:TR }}/>
      <path d="M360,428 C376,422 390,416 406,410" stroke="#4a2410" strokeWidth="5" strokeLinecap="round" fill="none"
        strokeDasharray="50" strokeDashoffset={50*(1-brP)} style={{ transition:TR }}/>
      <path d="M238,422 C228,415 218,412 210,408" stroke="#5a3018" strokeWidth="3.5" strokeLinecap="round" fill="none"
        opacity={brP}/>
      <path d="M406,410 C415,404 422,400 430,396" stroke="#5a3018" strokeWidth="3.5" strokeLinecap="round" fill="none"
        opacity={brP}/>
      <path d="M298,418 C297,412 298,406 298,398" stroke="#5a3018" strokeWidth="4" strokeLinecap="round" fill="none"
        strokeDasharray="22" strokeDashoffset={22*(1-brP)} style={{ transition:TR }}/>

      {/* Canopy puffs */}
      {PUFFS.map((pf, i) => {
        const p = pMap[pf.pKey];
        const col = colMap(pf.col);
        return (
          <g key={i} style={{
            transform:`scale(${p})`, transformOrigin:`${pf.cx}px ${pf.cy}px`,
            transition: TR_SLOW,
            animation: p > 0.5
              ? `canopySway ${SWAY_DUR[i]}s ease-in-out ${i*0.22}s infinite, bonsaiPuffBreathe ${5+i*0.4}s ease-in-out ${i*0.3}s infinite`
              : 'none',
          }}>
            <circle cx={pf.cx} cy={pf.cy} r={pf.r} fill={col}/>
            {rimLightOp > 0.1 && (
              <circle cx={pf.cx+sunAngleNorm*pf.r*0.4} cy={pf.cy-sunHeight*pf.r*0.4}
                r={pf.r*0.35}
                fill={duskOp>0.5?'#ffd49a':'#fff4c4'}
                opacity={rimLightOp*0.38}
                style={{ filter:'blur(2px)', transition:'cx 4s,cy 4s,opacity 4s' }}/>
            )}
            {nightOp > 0.2 && (
              <circle cx={pf.cx} cy={pf.cy} r={pf.r} fill="rgba(20,30,70,0.45)" opacity={nightOp*0.6}/>
            )}
          </g>
        );
      })}

      {/* Moss on pot */}
      <g opacity={detP*0.8} style={{ transition:'opacity 1.5s' }}>
        <ellipse cx="293" cy="503" rx="8" ry="2.5" fill="#5a7a3a" opacity="0.7"
          style={{ animation:'mossBreath 5s ease-in-out infinite' }}/>
        <ellipse cx="310" cy="503" rx="6" ry="2" fill="#7a9a4a" opacity="0.55"
          style={{ animation:'mossBreath 6s ease-in-out 1s infinite' }}/>
      </g>

      {/* Fallen petals around pot base */}
      {detP > 0.5 && (
        <g opacity={detP * 0.6} style={{ transition:'opacity 1.5s' }}>
          {[{x:268,y:523,r:8},{x:280,y:525,r:-15},{x:320,y:524,r:12},{x:335,y:522,r:-8},{x:250,y:524,r:5}].map((pt, i) => (
            <ellipse key={i} cx={pt.x} cy={pt.y} rx="3.5" ry="1.5"
              fill={theme.accent || theme.leafLight}
              opacity={0.5}
              transform={`rotate(${pt.r} ${pt.x} ${pt.y})`}/>
          ))}
        </g>
      )}
    </>
  );
}
