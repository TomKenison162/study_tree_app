import React from 'react';
import {
  buildBlobs, TWIG_DASH, TWIGS, FINE_TWIG_DASH, FINE_TWIGS,
  WILDFLOWERS,
} from './treeTypes.jsx';

const c01 = (v, a, b) => Math.max(0, Math.min(1, (v - a) / (b - a)));

/* ── grass tuft data for dynamic wind sway ── */
const GRASS_TUFTS = [
  { x:35, y:536, h:14, blades:4, delay:0 },
  { x:62, y:530, h:16, blades:5, delay:0.3 },
  { x:80, y:520, h:13, blades:4, delay:0.6 },
  { x:108, y:528, h:11, blades:3, delay:0.1 },
  { x:140, y:534, h:15, blades:5, delay:0.8 },
  { x:180, y:522, h:14, blades:4, delay:0.4 },
  { x:210, y:530, h:12, blades:3, delay:0.2 },
  { x:248, y:526, h:10, blades:3, delay:0.7 },
  { x:340, y:520, h:16, blades:5, delay:0.5 },
  { x:355, y:524, h:11, blades:3, delay:0.1 },
  { x:380, y:518, h:14, blades:4, delay:0.9 },
  { x:420, y:524, h:13, blades:4, delay:0.3 },
  { x:455, y:520, h:15, blades:5, delay:0.6 },
  { x:490, y:515, h:12, blades:3, delay:0.2 },
  { x:520, y:522, h:14, blades:4, delay:0.8 },
  { x:540, y:528, h:10, blades:3, delay:0.4 },
  { x:565, y:532, h:13, blades:4, delay:0.1 },
  { x:15, y:542, h:11, blades:3, delay:0.5 },
  { x:590, y:538, h:12, blades:3, delay:0.7 },
  { x:280, y:530, h:9, blades:3, delay:0.3 },
  { x:310, y:524, h:11, blades:3, delay:0.6 },
];

function GrassBlade({ x, y, h, angle, delay, color, opacity: op }) {
  const cpX = x + Math.sin(angle * Math.PI / 180) * h * 0.6;
  const cpY = y - h * 0.7;
  const tipX = x + Math.sin(angle * Math.PI / 180) * h * 0.3;
  const tipY = y - h;
  return (
    <path
      d={`M${x},${y} Q${cpX},${cpY} ${tipX},${tipY}`}
      stroke={color}
      strokeWidth="1.4"
      fill="none"
      strokeLinecap="round"
      opacity={op}
      style={{
        animation: `grassSway 3.2s ease-in-out ${delay}s infinite`,
        transformOrigin: `${x}px ${y}px`,
      }}
    />
  );
}

function GrassTuft({ x, y, h, blades, delay, nightOp, duskOp }) {
  const colors = ['#5a8a4a', '#4a7a3a', '#6a9a5a', '#507840'];
  return (
    <g>
      {Array.from({ length: blades }).map((_, i) => {
        const spread = (i - (blades - 1) / 2) * 8;
        const bh = h * (0.7 + Math.random() * 0.3 + (i === Math.floor(blades / 2) ? 0.15 : 0));
        const angle = spread + (i % 2 === 0 ? -3 : 3);
        return (
          <GrassBlade
            key={i}
            x={x + i * 3.5}
            y={y}
            h={bh}
            angle={angle}
            delay={delay + i * 0.15}
            color={colors[i % colors.length]}
            opacity={0.65 + (i % 2) * 0.1}
          />
        );
      })}
    </g>
  );
}

/* ─────────────────────── PINE TREE ─────────────────────── */
function PineTree({ progress, theme, sunAngleNorm, sunHeight, duskOp, rimLightOp, nightOp }) {
  const trP = c01(progress, 0.00, 0.13);
  const tr  = 'transform 1.3s cubic-bezier(0.34,1.4,0.64,1)';
  const TIERS = [
    { apex:88,  base:172, hw:44,  p: c01(progress,0.06,0.20) },
    { apex:128, base:220, hw:60,  p: c01(progress,0.14,0.29) },
    { apex:174, base:276, hw:78,  p: c01(progress,0.22,0.38) },
    { apex:226, base:338, hw:98,  p: c01(progress,0.31,0.47) },
    { apex:284, base:404, hw:119, p: c01(progress,0.40,0.57) },
    { apex:350, base:472, hw:142, p: c01(progress,0.50,0.67) },
    { apex:420, base:524, hw:164, p: c01(progress,0.60,0.77) },
  ];
  const detP = c01(progress, 0.55, 0.85);

  function tier(apex, base, hw) {
    const cx = 300;
    const h  = base - apex;
    const cy = apex + h * 0.62;
    const dp = h * 0.07;
    return `M${cx},${apex} `
      + `C${cx-hw*0.18},${cy} ${cx-hw*0.74},${base} ${cx-hw},${base+dp} `
      + `Q${cx},${base+dp*0.5} ${cx+hw},${base+dp} `
      + `C${cx+hw*0.74},${base} ${cx+hw*0.18},${cy} ${cx},${apex} Z`;
  }

  const shadowDx = -sunAngleNorm * 38;
  const shadowSX = 1 + Math.abs(sunAngleNorm) * 0.5;

  return (
    <>
      {/* Ground shadow */}
      <ellipse cx={300+shadowDx} cy="524" rx={65*shadowSX} ry={5.5-sunHeight*1.2}
        fill={`rgba(20,12,4,${0.07+(1-sunHeight)*0.04})`}
        style={{ transition:'cx 4s,rx 4s,ry 4s', filter:'blur(2px)' }}/>
      {/* Roots */}
      <path d="M294,520 C272,508 250,518 230,528" stroke="#3a1808" strokeWidth="9" strokeLinecap="round" fill="none" strokeDasharray="72" strokeDashoffset={72*(1-trP)} style={{ transition:tr }}/>
      <path d="M306,522 C330,510 354,520 372,528" stroke="#3a1808" strokeWidth="9" strokeLinecap="round" fill="none" strokeDasharray="72" strokeDashoffset={72*(1-trP)} style={{ transition:tr }}/>
      {/* Trunk */}
      <path d="M296,524 C296,460 297,350 298,200 C298,150 299,110 299,88"
        stroke="#3a1808" strokeWidth="13" strokeLinecap="round" fill="none"
        strokeDasharray="438" strokeDashoffset={438*(1-trP)} style={{ transition:tr }}/>

      {/* TIERS with canopy sway */}
      {TIERS.map(({ apex, base, hw, p }, i) => (
        <g key={i}
           style={{ transform:`scaleX(${p})`, transformOrigin:`300px ${apex}px`,
                    transition:'transform 1.35s cubic-bezier(0.34,1.45,0.64,1)',
                    animation: p > 0.5 ? `canopySway 4.5s ease-in-out ${i*0.3}s infinite` : 'none' }}>
          <path d={tier(apex+6, base+5, hw*1.06)} fill={theme.leafDark} opacity={0.6}/>
          <path d={tier(apex, base, hw)} fill={theme.leafDark}/>
          <path d={tier(apex+4, base-4, hw*0.70)} fill={theme.leafMid} opacity={0.94}/>
          <path d={tier(apex+9, base-14, hw*0.44)} fill={theme.leafLight} opacity={0.76}/>
          {rimLightOp > 0.08 && (
            <path d={tier(apex, base, hw*0.30)}
              fill={duskOp>0.5?'#ffd080':'#e8ffa8'}
              opacity={rimLightOp*0.42}
              style={{ transform:`translateX(${sunAngleNorm*hw*0.07}px)`, transition:'transform 4s' }}/>
          )}
          {nightOp > 0.18 && (
            <path d={tier(apex, base, hw)} fill="rgba(8,16,44,0.52)" opacity={nightOp*0.8}/>
          )}
          {progress > 0.88 && i < 2 && (
            <path d={tier(apex, apex+(base-apex)*0.26, hw*0.34)}
              fill="rgba(232,246,255,0.90)" opacity={0.9*p}/>
          )}
        </g>
      ))}

      {/* Trunk stripe */}
      <path d="M298,524 C298,460 299,350 299,200 C299,150 299,110 299,88"
        stroke="#6a4020" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.55"
        strokeDasharray="438" strokeDashoffset={438*(1-trP)} style={{ transition:tr }}/>

      {/* Bark ridges */}
      <g opacity={detP*0.4} style={{ transition:'opacity 1.5s' }}>
        {[130,190,260,340,420].map(y => (
          <React.Fragment key={y}>
            <path d={`M296,${y} Q295,${y+15} 297,${y+30}`} stroke="#1a0804" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
            <path d={`M302,${y+8} Q303,${y+22} 301,${y+38}`} stroke="#1a0804" strokeWidth="0.6" fill="none" strokeLinecap="round"/>
          </React.Fragment>
        ))}
      </g>

      {/* Crown tip star */}
      {detP > 0.6 && (
        <g opacity={detP*0.85} style={{ transition:'opacity 1s' }}>
          {[0,60,120,180,240,300].map(deg => {
            const r = deg*Math.PI/180;
            return <line key={deg} x1="299" y1="84" x2={299+Math.cos(r)*8} y2={84+Math.sin(r)*8}
              stroke={theme.leafLight} strokeWidth="1.5" strokeLinecap="round" opacity="0.85"/>;
          })}
          <circle cx="299" cy="84" r="3" fill={theme.leafLight} opacity="0.95"/>
        </g>
      )}
    </>
  );
}

/* ─────────────────────── REDWOOD TREE (TOWERING) ─────────────────────── */
function RedwoodTree({ progress, theme, sunAngleNorm, sunHeight, duskOp, rimLightOp, nightOp }) {
  const trP   = c01(progress, 0.00, 0.15);
  const detP  = c01(progress, 0.40, 0.70);
  const fullP = c01(progress, 0.55, 0.85);
  const tr    = 'transform 1.3s cubic-bezier(0.34,1.4,0.64,1)';
  const shadowDx = -sunAngleNorm * 55;
  const shadowSX = 1 + Math.abs(sunAngleNorm) * 0.5;

  const TIERS = [
    { apex: -560, base: -490, hw: 30,  p: c01(progress, 0.14, 0.34) },
    { apex: -500, base: -410, hw: 40,  p: c01(progress, 0.18, 0.38) },
    { apex: -430, base: -330, hw: 50,  p: c01(progress, 0.22, 0.42) },
    { apex: -350, base: -240, hw: 62,  p: c01(progress, 0.26, 0.46) },
    { apex: -270, base: -150, hw: 74,  p: c01(progress, 0.30, 0.50) },
    { apex: -190, base: -60,  hw: 86,  p: c01(progress, 0.34, 0.54) },
    { apex: -100, base: 40,   hw: 98,  p: c01(progress, 0.38, 0.58) },
    { apex: -10,  base: 140,  hw: 108, p: c01(progress, 0.42, 0.62) },
    { apex: 80,   base: 230,  hw: 118, p: c01(progress, 0.46, 0.66) },
    { apex: 170,  base: 320,  hw: 126, p: c01(progress, 0.50, 0.70) },
    { apex: 260,  base: 400,  hw: 134, p: c01(progress, 0.54, 0.74) },
    { apex: 340,  base: 470,  hw: 140, p: c01(progress, 0.58, 0.78) },
    { apex: 410,  base: 524,  hw: 148, p: c01(progress, 0.62, 0.82) },
  ];

  function tier(apex, base, hw) {
    const cx = 300;
    const h = base - apex;
    const cy = apex + h * 0.55;
    const dp = h * 0.05;
    return `M${cx},${apex} `
      + `C${cx-hw*0.15},${cy} ${cx-hw*0.7},${base} ${cx-hw},${base+dp} `
      + `Q${cx},${base+dp*0.3} ${cx+hw},${base+dp} `
      + `C${cx+hw*0.7},${base} ${cx+hw*0.15},${cy} ${cx},${apex} Z`;
  }

  return (
    <>
      {/* Shadow — massive old-growth */}
      <ellipse cx={300+shadowDx} cy="524" rx={100*shadowSX} ry={7-sunHeight*1.5}
        fill={`rgba(20,12,4,${0.10+(1-sunHeight)*0.05})`}
        style={{ transition:'cx 4s,rx 4s,ry 4s', filter:'blur(3px)' }}/>

      {/* Massive buttress roots */}
      <path d="M280,520 C240,498 190,508 140,528" stroke="#5a2a10" strokeWidth="16" strokeLinecap="round" fill="none"
        strokeDasharray="150" strokeDashoffset={150*(1-trP)} style={{ transition:tr }}/>
      <path d="M320,522 C360,500 410,510 460,528" stroke="#5a2a10" strokeWidth="16" strokeLinecap="round" fill="none"
        strokeDasharray="150" strokeDashoffset={150*(1-trP)} style={{ transition:tr }}/>
      <path d="M290,524 C265,532 230,542 190,552" stroke="#5a2a10" strokeWidth="10" strokeLinecap="round" fill="none"
        strokeDasharray="110" strokeDashoffset={110*(1-trP)} style={{ transition:tr }}/>
      <path d="M310,524 C335,532 370,542 410,552" stroke="#5a2a10" strokeWidth="10" strokeLinecap="round" fill="none"
        strokeDasharray="110" strokeDashoffset={110*(1-trP)} style={{ transition:tr }}/>
      <path d="M295,526 C275,536 255,548 240,558" stroke="#5a2a10" strokeWidth="7" strokeLinecap="round" fill="none"
        strokeDasharray="75" strokeDashoffset={75*(1-trP)} style={{ transition:tr }}/>
      <path d="M305,526 C325,536 345,548 360,558" stroke="#5a2a10" strokeWidth="7" strokeLinecap="round" fill="none"
        strokeDasharray="75" strokeDashoffset={75*(1-trP)} style={{ transition:tr }}/>

      {/* Towering trunk — thick old-growth reddish-brown bark */}
      <path d="M275,524 C273,350 277,200 275,50 C273,-100 277,-250 275,-400 C274,-480 276,-530 276,-580"
        stroke="#3a1808" strokeWidth="16" strokeLinecap="round" fill="none" opacity="0.25"
        strokeDasharray="1200" strokeDashoffset={1200*(1-trP)} style={{ transition:tr }}/>
      <path d="M300,524 C298,350 302,200 300,50 C298,-100 302,-250 300,-400 C299,-480 300,-530 300,-580"
        stroke="#6a3018" strokeWidth="46" strokeLinecap="round" fill="none"
        strokeDasharray="1200" strokeDashoffset={1200*(1-trP)} style={{ transition:tr }}/>
      <path d="M325,524 C323,350 327,200 325,50 C323,-100 327,-250 325,-400 C324,-480 324,-530 324,-580"
        stroke="#8a4828" strokeWidth="12" strokeLinecap="round" fill="none" opacity="0.5"
        strokeDasharray="1200" strokeDashoffset={1200*(1-trP)} style={{ transition:tr }}/>

      {/* Bark texture — deep fissures all the way up the tower */}
      <g opacity={detP * 0.55} style={{ transition:'opacity 1.5s' }}>
        {[-500,-440,-380,-320,-260,-200,-140,-80,-20,40,100,160,220,280,340,400,460].map((y, i) => (
          <React.Fragment key={y}>
            <path d={`M${294-i%2},${y} Q${293},${y+20} ${295+i%2},${y+40}`} stroke="#2a0e04" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
            <path d={`M${304+i%2},${y+10} Q${305},${y+30} ${303-i%2},${y+50}`} stroke="#2a0e04" strokeWidth="1" fill="none" strokeLinecap="round"/>
            <path d={`M${299},${y+5} Q${300},${y+15} ${299},${y+25}`} stroke="#2a0e04" strokeWidth="0.7" fill="none" strokeLinecap="round"/>
          </React.Fragment>
        ))}
      </g>

      {/* Bark color variation — reddish-brown strips */}
      <g opacity={detP * 0.3}>
        <path d="M296,500 C295,300 297,100 296,-100 C295,-250 297,-400 298,-550"
          stroke="#8a3818" strokeWidth="7" fill="none" strokeLinecap="round"
          strokeDasharray="1200" strokeDashoffset={1200*(1-trP)} style={{ transition:tr }}/>
      </g>

      {/* Rim light on towering trunk */}
      {rimLightOp > 0.1 && (
        <path d="M300,524 C298,350 302,200 300,50 C298,-100 302,-250 300,-400 C299,-480 300,-530 300,-580"
          stroke={duskOp>0.5?'#ffb070':'#ffe8a8'} strokeWidth="6" strokeLinecap="round" fill="none"
          opacity={rimLightOp*0.4} transform={`translate(${sunAngleNorm*14},0)`}
          style={{ transition:'opacity 4s,transform 4s,stroke 4s' }}
          strokeDasharray="1200" strokeDashoffset={1200*(1-trP)}/>
      )}

      {/* 13 canopy tiers towering to the sky */}
      {TIERS.map(({ apex, base, hw, p }, i) => (
        <g key={i}
           style={{ transform:`scaleX(${p})`, transformOrigin:`300px ${apex}px`,
                    transition:'transform 1.35s cubic-bezier(0.34,1.45,0.64,1)',
                    animation: p > 0.5 ? `canopySway 5s ease-in-out ${i*0.4}s infinite` : 'none' }}>
          <path d={tier(apex+4, base+3, hw*1.04)} fill={theme.leafDark} opacity={0.5}/>
          <path d={tier(apex, base, hw)} fill={theme.leafDark}/>
          <path d={tier(apex+3, base-5, hw*0.65)} fill={theme.leafMid} opacity={0.9}/>
          <path d={tier(apex+7, base-12, hw*0.38)} fill={theme.leafLight} opacity={0.7}/>
          {rimLightOp > 0.08 && (
            <path d={tier(apex, base, hw*0.25)}
              fill={duskOp>0.5?'#ffd080':'#e8ffa8'}
              opacity={rimLightOp*0.35}
              style={{ transform:`translateX(${sunAngleNorm*hw*0.06}px)`, transition:'transform 4s' }}/>
          )}
          {nightOp > 0.18 && (
            <path d={tier(apex, base, hw)} fill="rgba(8,16,44,0.52)" opacity={nightOp*0.75}/>
          )}
        </g>
      ))}

      {/* Moss patches along the towering trunk */}
      <g opacity={fullP * 0.6} style={{ transition:'opacity 1.5s' }}>
        <ellipse cx="290" cy="460" rx="9" ry="4" fill="#5a8a3a" opacity="0.6"/>
        <ellipse cx="312" cy="380" rx="7" ry="3" fill="#6a9a4a" opacity="0.5"/>
        <ellipse cx="288" cy="300" rx="6" ry="2.5" fill="#5a7a3a" opacity="0.4"/>
        <ellipse cx="310" cy="200" rx="5" ry="2" fill="#6a9a4a" opacity="0.35"/>
        <ellipse cx="292" cy="100" rx="5" ry="2" fill="#5a8a3a" opacity="0.3"/>
        <ellipse cx="308" cy="0" rx="4" ry="1.5" fill="#6a9a4a" opacity="0.25"/>
        <ellipse cx="294" cy="-100" rx="4" ry="1.5" fill="#5a8a3a" opacity="0.2"/>
        <ellipse cx="306" cy="-200" rx="3" ry="1.5" fill="#6a9a4a" opacity="0.18"/>
      </g>
    </>
  );
}

/* ─────────────────────── BONSAI TREE ─────────────────────── */
function BonsaiTree({ progress, theme, sunAngleNorm, sunHeight, duskOp, rimLightOp, nightOp }) {
  const potP  = c01(progress, 0.00, 0.12);
  const trP   = c01(progress, 0.06, 0.22);
  const brP   = c01(progress, 0.16, 0.38);
  const p1P   = c01(progress, 0.28, 0.50);
  const p2P   = c01(progress, 0.38, 0.60);
  const p3P   = c01(progress, 0.48, 0.72);
  const p4P   = c01(progress, 0.58, 0.80);
  const detP  = c01(progress, 0.60, 0.88);
  const trSlow = 'transform 1.5s cubic-bezier(0.34,1.2,0.64,1)';
  const tr    = 'transform 1.2s cubic-bezier(0.34,1.4,0.64,1)';
  const shadowDx = -sunAngleNorm * 38;

  const puffs = [
    { cx:202, cy:400, r:28, col:theme.leafDark,  p:p1P },
    { cx:220, cy:386, r:22, col:theme.leafMid,   p:p1P },
    { cx:188, cy:388, r:20, col:theme.leafDark,  p:p1P },
    { cx:212, cy:370, r:17, col:theme.leafLight, p:p1P },
    { cx:198, cy:375, r:14, col:theme.leafMid,   p:p1P },
    { cx:390, cy:392, r:26, col:theme.leafDark,  p:p2P },
    { cx:405, cy:376, r:20, col:theme.leafMid,   p:p2P },
    { cx:374, cy:382, r:19, col:theme.leafDark,  p:p2P },
    { cx:396, cy:362, r:16, col:theme.leafLight, p:p2P },
    { cx:298, cy:400, r:22, col:theme.leafMid,   p:p3P },
    { cx:300, cy:383, r:18, col:theme.leafLight, p:p3P },
    { cx:290, cy:370, r:15, col:theme.leafMid,   p:p3P },
    { cx:308, cy:360, r:12, col:theme.leafLight, p:p4P },
    { cx:295, cy:354, r:10, col:theme.leafLight, p:p4P },
  ];

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
      </g>

      {/* Shadow */}
      <ellipse cx={300 + shadowDx} cy="522" rx={60 + Math.abs(sunAngleNorm)*20} ry="4"
        fill={`rgba(20,12,4,0.10)`} style={{ filter:'blur(2px)', transition:'cx 4s,rx 4s' }}/>

      {/* Trunk */}
      <path d="M300,503 C295,488 306,472 300,458 C295,446 288,438 292,425 C295,415 302,408 299,396"
        stroke="#3a1808" strokeWidth="11" strokeLinecap="round" fill="none"
        strokeDasharray="115" strokeDashoffset={115*(1-trP)} style={{ transition:tr }}/>
      <path d="M302,503 C298,488 308,472 302,458 C297,446 290,438 294,425"
        stroke="#7a4828" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.5"
        strokeDasharray="80" strokeDashoffset={80*(1-trP)} style={{ transition:tr }}/>

      {/* Bark marks */}
      <g opacity={detP * 0.5} style={{ transition:'opacity 1.5s' }}>
        <path d="M299,490 Q297,480 300,470" stroke="#1a0804" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
        <path d="M301,468 Q300,455 302,445" stroke="#1a0804" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
        <path d="M299,442 Q297,432 300,422" stroke="#1a0804" strokeWidth="0.7" fill="none" strokeLinecap="round"/>
      </g>

      {/* Branches */}
      <path d="M295,440 C278,435 258,428 238,422"
        stroke="#4a2410" strokeWidth="7" strokeLinecap="round" fill="none"
        strokeDasharray="62" strokeDashoffset={62*(1-brP)} style={{ transition:tr }}/>
      <path d="M238,422 C225,418 212,414 198,410"
        stroke="#4a2410" strokeWidth="5" strokeLinecap="round" fill="none"
        strokeDasharray="45" strokeDashoffset={45*(1-brP)} style={{ transition:tr }}/>
      <path d="M300,448 C318,442 338,435 360,428"
        stroke="#4a2410" strokeWidth="7" strokeLinecap="round" fill="none"
        strokeDasharray="65" strokeDashoffset={65*(1-brP)} style={{ transition:tr }}/>
      <path d="M360,428 C376,422 390,416 406,410"
        stroke="#4a2410" strokeWidth="5" strokeLinecap="round" fill="none"
        strokeDasharray="50" strokeDashoffset={50*(1-brP)} style={{ transition:tr }}/>
      <path d="M238,422 C228,415 218,412 210,408"
        stroke="#5a3018" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity={brP}/>
      <path d="M406,410 C415,404 422,400 430,396"
        stroke="#5a3018" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity={brP}/>
      <path d="M298,418 C297,412 298,406 298,398"
        stroke="#5a3018" strokeWidth="4" strokeLinecap="round" fill="none"
        strokeDasharray="22" strokeDashoffset={22*(1-brP)} style={{ transition:tr }}/>

      {/* Canopy cloud-puffs with sway */}
      {puffs.map((pf, i) => (
        <g key={i} style={{
          transform:`scale(${pf.p})`, transformOrigin:`${pf.cx}px ${pf.cy}px`, transition:trSlow,
          animation: pf.p > 0.5 ? `canopySway 4s ease-in-out ${i*0.2}s infinite` : 'none',
        }}>
          <circle cx={pf.cx} cy={pf.cy} r={pf.r} fill={pf.col}/>
          {rimLightOp > 0.1 && (
            <circle cx={pf.cx + sunAngleNorm * pf.r * 0.4} cy={pf.cy - sunHeight * pf.r * 0.4}
              r={pf.r * 0.35}
              fill={duskOp > 0.5 ? '#ffd49a' : '#fff4c4'}
              opacity={rimLightOp * 0.38}
              style={{ filter:'blur(2px)', transition:'cx 4s,cy 4s,opacity 4s' }}/>
          )}
          {nightOp > 0.2 && (
            <circle cx={pf.cx} cy={pf.cy} r={pf.r}
              fill="rgba(20,30,70,0.45)" opacity={nightOp * 0.6}/>
          )}
        </g>
      ))}

      {/* Moss on pot */}
      <g opacity={detP * 0.8} style={{ transition:'opacity 1.5s' }}>
        <ellipse cx="293" cy="503" rx="8" ry="2.5" fill="#5a7a3a" opacity="0.7"/>
        <ellipse cx="310" cy="503" rx="6" ry="2" fill="#7a9a4a" opacity="0.55"/>
      </g>
    </>
  );
}

/* ─────────────────────── BIRCH TRUNK ─────────────────────── */
function BirchTrunk({ tP, detailP, tr, rimLightOp, duskOp, sunAngleNorm, rimLightX }) {
  return (
    <>
      <path d="M294,520 C272,508 250,518 230,528" stroke="#8a8070" strokeWidth="9" strokeLinecap="round" fill="none" strokeDasharray="72" strokeDashoffset={72*(1-tP)} style={{ transition:tr }}/>
      <path d="M306,522 C330,510 354,520 372,528" stroke="#8a8070" strokeWidth="9" strokeLinecap="round" fill="none" strokeDasharray="72" strokeDashoffset={72*(1-tP)} style={{ transition:tr }}/>
      <path d="M292,524 C290,462 294,398 286,330 C282,270 288,214 284,150" stroke="#d8d0c8" strokeWidth="9" strokeLinecap="round" fill="none" opacity="0.18" strokeDasharray="394" strokeDashoffset={394*(1-tP)} style={{ transition:tr }}/>
      <path d="M300,524 C298,462 305,398 296,330 C290,269 298,214 294,152 C290,116 298,96 298,72" stroke="#e8e0d4" strokeWidth="26" strokeLinecap="round" fill="none" strokeDasharray="552" strokeDashoffset={552*(1-tP)} style={{ transition:tr }}/>
      <path d="M308,524 C307,462 310,398 306,330 C304,269 308,214 306,152 C305,122 307,102 307,80" stroke="#c0b8b0" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.4" strokeDasharray="450" strokeDashoffset={450*(1-tP)} style={{ transition:tr }}/>
      <g opacity={detailP * 0.9} style={{ transition:'opacity 1.5s' }}>
        {[490,455,418,385,350,312,275,238,205,172,138].map((y, i) => (
          <React.Fragment key={y}>
            <path d={`M${292-i%2*2},${y} Q${300},${y+3} ${308+i%2*2},${y}`} stroke="#8a7a6a" strokeWidth={1.5 - i*0.08} fill="none" strokeLinecap="round" opacity="0.7"/>
            <path d={`M${292-i%2*3},${y+6} Q${300},${y+9} ${308+i%2*3},${y+6}`} stroke="#8a7a6a" strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.5"/>
          </React.Fragment>
        ))}
      </g>
      {rimLightOp > 0.1 && (
        <path d="M300,524 C298,462 305,398 296,330 C290,269 298,214 294,152 C290,116 298,96 298,72"
          stroke={duskOp > 0.5 ? '#ffcca0' : '#fffff0'}
          strokeWidth="4" strokeLinecap="round" fill="none"
          opacity={rimLightOp * 0.55}
          transform={`translate(${rimLightX * 8}, 0)`}
          style={{ transition:'opacity 4s,transform 4s,stroke 4s' }}
          strokeDasharray="552" strokeDashoffset={552*(1-tP)}/>
      )}
    </>
  );
}

/* ─────────────────────── MAIN SCENE COMPONENT ─────────────────────── */
export default function TreeScene({ progress, theme, treeShake, shimmer }) {
  const safeProgress = Math.max(0, Math.min(1, progress));

  const tP        = c01(safeProgress, 0.00, 0.10);
  const brP       = c01(safeProgress, 0.06, 0.22);
  const sbP       = c01(safeProgress, 0.16, 0.32);
  const twigP     = c01(safeProgress, 0.26, 0.42);
  const fineTwigP = c01(safeProgress, 0.34, 0.50);
  const l1P       = c01(safeProgress, 0.36, 0.52);
  const l2P       = c01(safeProgress, 0.42, 0.58);
  const l3P       = c01(safeProgress, 0.48, 0.65);
  const detailP   = c01(safeProgress, 0.20, 0.40);
  const scaleOf   = (ph) => ph === 0 ? l1P : ph === 1 ? l2P : l3P;
  const tr        = 'transform 1.2s cubic-bezier(0.34,1.4,0.64,1)';
  const trSlow    = 'transform 1.5s cubic-bezier(0.34,1.2,0.64,1)';

  /* SKY */
  const dawnOp  = Math.max(0, 1 - safeProgress * 2);
  const dayOp   = Math.max(0, 1 - Math.abs(safeProgress - 0.5) * 2);
  const duskOp  = Math.max(0, safeProgress * 2 - 1);
  const nightOp = Math.max(0, safeProgress * 2 - 1.4);

  const sunPct    = safeProgress * 88 + 4;
  const sunArcY   = 5 + Math.pow(safeProgress * 2 - 1, 2) * 28;

  /* LIGHTING */
  const sunAngleNorm   = (sunPct - 48) / 44;
  const sunHeight      = 1 - c01(sunArcY, 5, 33);
  const shadowDx       = -sunAngleNorm * 38;
  const shadowStretchX = 1 + Math.abs(sunAngleNorm) * 0.5;
  const shadowOp       = 0.10 + (1 - sunHeight) * 0.04;
  const shadowBlur     = 1.2 + (1 - sunHeight) * 1.8;
  const nightWashOp    = nightOp * 0.7;
  const rimLightOp     = sunHeight * (1 - nightOp) * 0.6;
  const rimLightX      = sunAngleNorm;
  const grassWarmth    = Math.max(dawnOp, duskOp);
  const grassDarken    = nightOp;

  const BLOBS = buildBlobs(theme);
  const isPine    = theme.shape === 'pine';
  const isBonsai  = theme.shape === 'bonsai';
  const isBirch   = theme.shape === 'birch';
  const isRedwood = theme.shape === 'redwood';

  const treeSceneProps = {
    progress: safeProgress, theme,
    sunAngleNorm, sunHeight, duskOp,
    rimLightOp, rimLightX, nightOp,
  };

  return (
    <div style={{ position:'relative', flex:'1 1 50%', overflow:'hidden', zIndex:3 }}>

      {/* Night wash */}
      {nightWashOp > 0.01 && (
        <div style={{
          position:'absolute', inset:'30% 0 0 0', pointerEvents:'none', zIndex:2,
          background:'linear-gradient(to bottom, transparent 0%, rgba(15,25,55,0.45) 70%, rgba(8,15,40,0.65) 100%)',
          mixBlendMode:'multiply', opacity:nightWashOp, transition:'opacity 4s',
        }}/>
      )}

      {/* Tree container */}
      <div style={{
        position:'absolute', bottom:0, left:0, right:0,
        display:'flex', justifyContent:'center',
        animation:treeShake?'treeShake 1.2s ease-out':'none',
        filter:shimmer?'brightness(1.18) saturate(1.12)':'none',
        transition:'filter 0.7s ease-out',
      }}>
        <svg viewBox="0 -180 600 740" xmlns="http://www.w3.org/2000/svg"
          overflow={isRedwood ? "visible" : undefined}
          style={{ width:'100%', height:'auto', maxHeight:'96vh', display:'block' }}>
          <defs>
            <radialGradient id="rimLight" cx={rimLightX>0?'85%':'15%'} cy="30%" r="50%">
              <stop offset="0%" stopColor={duskOp>0.5?'#ffd09a':'#fff8d8'} stopOpacity={rimLightOp}/>
              <stop offset="60%" stopColor="#ffffff" stopOpacity="0"/>
            </radialGradient>
          </defs>

          {/* Ground — layered terrain */}
          <path d="M-10,520 Q150,506 300,512 Q450,518 620,504 L620,562 L-10,562 Z" fill="#7ba66a"/>
          <path d="M-10,540 Q150,530 300,533 Q450,535 620,530 L620,562 L-10,562 Z" fill="#5a8a4a" opacity="0.6"/>
          <path d="M-10,548 Q100,542 200,545 Q350,548 500,543 Q570,540 620,542 L620,562 L-10,562 Z" fill="#4a7a3a" opacity="0.3"/>
          <path d="M-10,520 Q150,506 300,512 Q450,518 620,504 L620,562 L-10,562 Z"
            fill={duskOp>0.5?'#c4682a':'#fdb87a'} opacity={grassWarmth*0.25}
            style={{ transition:'fill 4s,opacity 4s' }}/>
          <path d="M-10,520 Q150,506 300,512 Q450,518 620,504 L620,562 L-10,562 Z"
            fill="#1a2a4a" opacity={grassDarken*0.55} style={{ transition:'opacity 4s' }}/>

          {/* Dynamic grass tufts with wind sway */}
          {GRASS_TUFTS.map((tuft, i) => (
            <GrassTuft key={i} {...tuft} nightOp={nightOp} duskOp={duskOp}/>
          ))}

          {/* Stones and details */}
          <ellipse cx="218" cy="524" rx="11" ry="4.5" fill="#9a8e7a"/>
          <ellipse cx="218" cy="522.5" rx="9" ry="3" fill="#bab09e"/>
          <ellipse cx="382" cy="528" rx="9" ry="3.8" fill="#9a8e7a"/>
          <ellipse cx="382" cy="526.7" rx="7" ry="2.5" fill="#bab09e"/>
          <ellipse cx="520" cy="530" rx="7" ry="3" fill="#a09484"/>
          <ellipse cx="520" cy="529" rx="5.5" ry="2" fill="#b8ae9e"/>
          {/* Mushroom */}
          <g><ellipse cx="160" cy="528" rx="3" ry="6" fill="#f0e8d8"/>
            <path d="M152,524 Q160,514 168,524 Q165,527 160,527 Q155,527 152,524 Z" fill="#c64a3a"/>
            <circle cx="156" cy="521" r="1" fill="#fff8e0"/><circle cx="161" cy="519" r="0.8" fill="#fff8e0"/>
          </g>
          {/* Second mushroom */}
          <g>
            <ellipse cx="470" cy="525" rx="2.5" ry="5" fill="#e8e0d0"/>
            <path d="M464,522 Q470,514 476,522 Q474,524 470,524 Q466,524 464,522 Z" fill="#8a6040"/>
            <circle cx="467" cy="519" r="0.7" fill="#f8f0e0"/>
          </g>
          {dayOp > 0.1 && (
            <g style={{ transition:'transform 4s' }}>
              <ellipse cx={218+sunAngleNorm*-6} cy="528" rx={11*shadowStretchX*0.7} ry="2"
                fill={`rgba(45,36,24,${shadowOp*0.7})`} style={{ transition:'cx 4s,rx 4s,fill 4s' }}/>
              <ellipse cx={382+sunAngleNorm*-5} cy="531" rx={9*shadowStretchX*0.7} ry="1.8"
                fill={`rgba(45,36,24,${shadowOp*0.7})`} style={{ transition:'cx 4s,rx 4s,fill 4s' }}/>
            </g>
          )}

          {/* Wildflowers */}
          {WILDFLOWERS.map((f,i) => (
            <g key={i}>
              <circle cx={f.x} cy={f.y} r="1.6" fill={f.c} opacity="0.95"/>
              <circle cx={f.x} cy={f.y} r="0.7" fill="#fde68a" opacity="0.9"/>
              <line x1={f.x} y1={f.y+1.6} x2={f.x} y2={f.y+5} stroke="#5a8a4a" strokeWidth="0.8" opacity="0.5"/>
              {dayOp > 0.2 && (
                <ellipse cx={f.x+sunAngleNorm*-3} cy={f.y+5} rx={1.5+Math.abs(sunAngleNorm)*1.5} ry="0.7"
                  fill="rgba(45,36,24,0.18)" style={{ transition:'cx 4s,rx 4s' }}/>
              )}
            </g>
          ))}

          {/* ═══ TREE ═══ */}
          {isPine ? (
            <PineTree {...treeSceneProps}/>
          ) : isBonsai ? (
            <BonsaiTree {...treeSceneProps}/>
          ) : isRedwood ? (
            <RedwoodTree {...treeSceneProps}/>
          ) : (
            <>
              {/* ── DECIDUOUS/BIRCH/OAK TREE ── */}
              <ellipse cx={300+shadowDx} cy="524" rx={92*shadowStretchX} ry={9-sunHeight*1.5}
                fill={`rgba(45,36,24,${shadowOp})`}
                style={{ transition:'cx 4s,rx 4s,ry 4s,fill 4s', filter:`blur(${shadowBlur}px)` }}/>

              {/* Roots */}
              <path d="M294,520 C272,508 250,518 230,528" stroke={isBirch?'#8a8070':'#4a3018'} strokeWidth="11" strokeLinecap="round" fill="none" strokeDasharray="72" strokeDashoffset={72*(1-tP)} style={{ transition:tr }}/>
              <path d="M306,522 C330,510 354,520 372,528" stroke={isBirch?'#8a8070':'#4a3018'} strokeWidth="11" strokeLinecap="round" fill="none" strokeDasharray="72" strokeDashoffset={72*(1-tP)} style={{ transition:tr }}/>
              <path d="M298,522 C295,528 289,536 281,542" stroke={isBirch?'#8a8070':'#4a3018'} strokeWidth="7" strokeLinecap="round" fill="none" strokeDasharray="30" strokeDashoffset={30*(1-tP)} style={{ transition:tr }}/>
              <path d="M302,522 C307,528 313,536 320,541" stroke={isBirch?'#8a8070':'#4a3018'} strokeWidth="7" strokeLinecap="round" fill="none" strokeDasharray="30" strokeDashoffset={30*(1-tP)} style={{ transition:tr }}/>

              {isBirch ? (
                <BirchTrunk tP={tP} detailP={detailP} tr={tr}
                  rimLightOp={rimLightOp} duskOp={duskOp}
                  sunAngleNorm={sunAngleNorm} rimLightX={rimLightX}/>
              ) : (
                <>
                  <path d="M292,524 C290,462 294,398 286,330 C282,270 288,214 284,150" stroke="#3a2005" strokeWidth="9" strokeLinecap="round" fill="none" opacity="0.22" strokeDasharray="394" strokeDashoffset={394*(1-tP)} style={{ transition:tr }}/>
                  <path d="M300,524 C298,462 305,398 296,330 C290,269 298,214 294,152 C290,116 298,96 298,72" stroke="#5a3a1f" strokeWidth="28" strokeLinecap="round" fill="none" strokeDasharray="552" strokeDashoffset={552*(1-tP)} style={{ transition:tr }}/>
                  <path d="M308,524 C307,462 310,398 306,330 C304,269 308,214 306,152 C305,122 307,102 307,80" stroke="#a07248" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.45" strokeDasharray="450" strokeDashoffset={450*(1-tP)} style={{ transition:tr }}/>
                  <path d="M286,524 C284,462 288,398 282,330 C280,269 284,214 282,152 C280,122 284,102 284,80" stroke="#2a1808" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.35" strokeDasharray="450" strokeDashoffset={450*(1-tP)} style={{ transition:tr }}/>
                  {rimLightOp > 0.1 && (
                    <path d="M300,524 C298,462 305,398 296,330 C290,269 298,214 294,152 C290,116 298,96 298,72"
                      stroke={duskOp>0.5?'#ffb070':'#ffe8a8'} strokeWidth="4" strokeLinecap="round" fill="none"
                      opacity={rimLightOp*0.5} transform={`translate(${rimLightX*8},0)`}
                      style={{ transition:'opacity 4s,transform 4s,stroke 4s' }}
                      strokeDasharray="552" strokeDashoffset={552*(1-tP)}/>
                  )}
                  {dayOp > 0.2 && (
                    <path d="M300,524 C298,462 305,398 296,330 C290,269 298,214 294,152 C290,116 298,96 298,72"
                      stroke="rgba(20,12,4,0.6)" strokeWidth="6" strokeLinecap="round" fill="none"
                      opacity={dayOp*0.4} transform={`translate(${-rimLightX*10},0)`}
                      style={{ transition:'opacity 4s,transform 4s' }}
                      strokeDasharray="552" strokeDashoffset={552*(1-tP)}/>
                  )}
                  <g opacity={0.35*detailP} style={{ transition:'opacity 1.5s' }}>
                    <path d="M292,440 Q290,400 293,360" stroke="#3a2005" strokeWidth="1" fill="none" strokeLinecap="round"/>
                    <path d="M298,470 Q296,420 299,370 Q301,320 297,270" stroke="#3a2005" strokeWidth="1" fill="none" strokeLinecap="round"/>
                    <path d="M304,440 Q303,390 305,340" stroke="#3a2005" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
                  </g>
                  <g opacity={detailP} style={{ transition:'opacity 1.5s' }}>
                    <ellipse cx="295" cy="340" rx="5" ry="3" fill="#2a1808"/>
                    <ellipse cx="295" cy="340" rx="3" ry="1.5" fill="#5a3a1f"/>
                    <g opacity={0.8}>
                      <ellipse cx="290" cy="400" rx="6" ry="9" fill="#1a0e02"/>
                      <ellipse cx="290" cy="402" rx="4" ry="7" fill="#0a0500"/>
                    </g>
                  </g>
                  <g opacity={detailP*0.85} style={{ transition:'opacity 1.5s' }}>
                    <ellipse cx="289" cy="510" rx="9" ry="3" fill="#5a7a3a" opacity="0.7"/>
                    <ellipse cx="310" cy="513" rx="7" ry="2.5" fill="#5a7a3a" opacity="0.65"/>
                  </g>
                </>
              )}

              {/* Main branches */}
              <path d="M296,332 C264,309 220,276 170,246 C144,229 108,214 74,202" stroke={isBirch?'#7a7060':'#5a3818'} strokeWidth="15" strokeLinecap="round" fill="none" strokeDasharray="305" strokeDashoffset={305*(1-brP)} style={{ transition:tr }}/>
              <path d="M304,346 C342,324 383,291 422,266 C454,244 492,232 526,222" stroke={isBirch?'#7a7060':'#5a3818'} strokeWidth="15" strokeLinecap="round" fill="none" strokeDasharray="305" strokeDashoffset={305*(1-brP)} style={{ transition:tr }}/>
              <path d="M296,254 C278,220 258,182 240,144 C224,110 218,80 216,50" stroke={isBirch?'#7a7060':'#5a3818'} strokeWidth="13" strokeLinecap="round" fill="none" strokeDasharray="290" strokeDashoffset={290*(1-brP)} style={{ transition:tr }}/>
              <path d="M302,244 C320,211 344,174 364,142 C380,114 400,88 420,60" stroke={isBirch?'#7a7060':'#5a3818'} strokeWidth="13" strokeLinecap="round" fill="none" strokeDasharray="290" strokeDashoffset={290*(1-brP)} style={{ transition:tr }}/>

              {/* Sub-branches */}
              <path d="M198,274 C175,242 152,212 104,170" stroke={isBirch?'#8a8070':'#6a4828'} strokeWidth="9" strokeLinecap="round" fill="none" strokeDasharray="188" strokeDashoffset={188*(1-sbP)} style={{ transition:tr }}/>
              <path d="M144,240 C124,264 96,280 50,290" stroke={isBirch?'#8a8070':'#6a4828'} strokeWidth="8" strokeLinecap="round" fill="none" strokeDasharray="162" strokeDashoffset={162*(1-sbP)} style={{ transition:tr }}/>
              <path d="M384,298 C418,264 452,234 498,194" stroke={isBirch?'#8a8070':'#6a4828'} strokeWidth="9" strokeLinecap="round" fill="none" strokeDasharray="188" strokeDashoffset={188*(1-sbP)} style={{ transition:tr }}/>
              <path d="M434,262 C452,221 470,182 524,150" stroke={isBirch?'#8a8070':'#6a4828'} strokeWidth="8" strokeLinecap="round" fill="none" strokeDasharray="184" strokeDashoffset={184*(1-sbP)} style={{ transition:tr }}/>
              <path d="M266,184 C236,160 190,132 146,110" stroke={isBirch?'#8a8070':'#6a4828'} strokeWidth="9" strokeLinecap="round" fill="none" strokeDasharray="165" strokeDashoffset={165*(1-sbP)} style={{ transition:tr }}/>
              <path d="M247,134 C272,104 320,84 370,62" stroke={isBirch?'#8a8070':'#6a4828'} strokeWidth="8" strokeLinecap="round" fill="none" strokeDasharray="165" strokeDashoffset={165*(1-sbP)} style={{ transition:tr }}/>

              {/* Twigs */}
              {TWIGS.map((d,i) => (
                <path key={`tw${i}`} d={d} stroke={isBirch?'#9a9080':'#7a5638'} strokeWidth="2.5" strokeLinecap="round" fill="none"
                  strokeDasharray={TWIG_DASH} strokeDashoffset={TWIG_DASH*(1-twigP)} style={{ transition:tr }}/>
              ))}
              {FINE_TWIGS.map((d,i) => (
                <path key={`ft${i}`} d={d} stroke={isBirch?'#b0a898':'#8a6850'} strokeWidth="1.4" strokeLinecap="round" fill="none"
                  strokeDasharray={FINE_TWIG_DASH} strokeDashoffset={FINE_TWIG_DASH*(1-fineTwigP)} style={{ transition:tr }} opacity="0.85"/>
              ))}

              {/* Vine (not on birch) */}
              {!isBirch && (
                <g opacity={detailP*0.85} style={{ transition:'opacity 1.5s' }}>
                  <path d="M180,250 Q176,290 178,330 Q180,360 178,388" stroke={theme.leafMid} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.65"/>
                  {[270,295,320,345,372].map((y,i) => (
                    <ellipse key={y} cx={i%2===0?174:180} cy={y} rx="3" ry="2" fill={theme.leafLight} opacity="0.8"
                      transform={`rotate(${i%2===0?-30:20} ${i%2===0?174:180} ${y})`}/>
                  ))}
                </g>
              )}

              {/* Foliage blobs with canopy sway */}
              {BLOBS.map((b,i) => (
                <path key={i} d={b.path} fill={b.col} opacity={b.op}
                  style={{
                    transform:`scale(${scaleOf(b.ph)})`, transformOrigin:`${b.cx}px ${b.cy}px`, transition:trSlow,
                    animation: scaleOf(b.ph) > 0.5 ? `canopySway 4.5s ease-in-out ${(i%7)*0.4}s infinite` : 'none',
                  }}/>
              ))}
              {BLOBS.filter(b => b.ph===2).slice(0,9).map((b,i) => (
                <ellipse key={`sp${i}`} cx={b.cx-b.r*0.26} cy={b.cy-b.r*0.32} rx={b.r*0.2} ry={b.r*0.13}
                  fill="rgba(255,255,255,0.18)"
                  style={{ transform:`scale(${l3P})`, transformOrigin:`${b.cx}px ${b.cy}px`, transition:trSlow }}/>
              ))}

              {/* Canopy rim light */}
              {rimLightOp > 0.1 && BLOBS.filter(b => b.ph===2).map((b,i) => (
                <ellipse key={`rim${i}`} cx={b.cx+rimLightX*b.r*0.55} cy={b.cy-sunHeight*b.r*0.3-4}
                  rx={b.r*0.45} ry={b.r*0.25}
                  fill={duskOp>0.5?'#ffd49a':'#fff4c4'}
                  opacity={rimLightOp*l3P*0.45}
                  style={{ transform:`scale(${l3P})`, transformOrigin:`${b.cx}px ${b.cy}px`,
                    transition:'cx 4s,cy 4s,opacity 4s,fill 4s', filter:'blur(2px)' }}/>
              ))}

              {/* Canopy shadow side */}
              {dayOp > 0.2 && BLOBS.filter(b => b.ph===1||b.ph===0).map((b,i) => (
                <ellipse key={`shd${i}`} cx={b.cx-rimLightX*b.r*0.5} cy={b.cy+b.r*0.2}
                  rx={b.r*0.5} ry={b.r*0.35}
                  fill={nightOp>0.3?'rgba(20,20,60,0.5)':'rgba(30,20,10,0.32)'}
                  opacity={dayOp*scaleOf(b.ph)*0.4}
                  style={{ transform:`scale(${scaleOf(b.ph)})`, transformOrigin:`${b.cx}px ${b.cy}px`,
                    transition:'cx 4s,opacity 4s,fill 4s', filter:'blur(3px)' }}/>
              ))}

              {/* Leaf accents */}
              {l3P > 0.5 && BLOBS.filter(b => b.ph===2).map((b,i) => (
                <g key={`leaf${i}`} opacity={l3P}>
                  <ellipse cx={b.cx+b.r*0.7} cy={b.cy-b.r*0.2} rx="3.5" ry="2" fill={theme.leafLight}
                    transform={`rotate(${30+i*22} ${b.cx+b.r*0.7} ${b.cy-b.r*0.2})`}/>
                  <ellipse cx={b.cx-b.r*0.6} cy={b.cy+b.r*0.3} rx="3" ry="1.8" fill={theme.leafLight}
                    transform={`rotate(${-20+i*15} ${b.cx-b.r*0.6} ${b.cy+b.r*0.3})`}/>
                </g>
              ))}
            </>
          )}
        </svg>
      </div>

      {/* Grass sway + canopy sway keyframes */}
      <style>{`
        @keyframes grassSway {
          0%, 100% { transform: rotate(0deg); }
          25%      { transform: rotate(3deg); }
          50%      { transform: rotate(-2deg); }
          75%      { transform: rotate(2.5deg); }
        }
        @keyframes canopySway {
          0%, 100% { transform: translateX(0px) rotate(0deg); }
          33%      { transform: translateX(1.5px) rotate(0.3deg); }
          66%      { transform: translateX(-1px) rotate(-0.2deg); }
        }
      `}</style>
    </div>
  );
}
