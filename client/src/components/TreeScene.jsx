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

/* ─────────────────────── WISTERIA TREE ─────────────────────── */
function WisteriaTree({ progress, theme, sunAngleNorm, sunHeight, duskOp, rimLightOp, nightOp }) {
  const trP  = c01(progress, 0.00, 0.14);
  const brP  = c01(progress, 0.10, 0.30);
  const ch1P = c01(progress, 0.25, 0.50);
  const ch2P = c01(progress, 0.38, 0.62);
  const ch3P = c01(progress, 0.50, 0.75);
  const detP = c01(progress, 0.55, 0.85);
  const tr   = 'transform 1.3s cubic-bezier(0.34,1.4,0.64,1)';
  const shadowDx = -sunAngleNorm * 45;
  const shadowSX = 1 + Math.abs(sunAngleNorm) * 0.5;

  const CHAINS = [
    { x:130, y:268, len:150, d:0,   p:ch1P },
    { x:155, y:252, len:175, d:0.3, p:ch1P },
    { x:178, y:240, len:185, d:0.6, p:ch1P },
    { x:200, y:233, len:170, d:0.2, p:ch1P },
    { x:222, y:228, len:155, d:0.8, p:ch2P },
    { x:245, y:235, len:140, d:0.1, p:ch2P },
    { x:268, y:232, len:160, d:0.5, p:ch2P },
    { x:290, y:230, len:170, d:0.7, p:ch2P },
    { x:310, y:230, len:168, d:0.2, p:ch2P },
    { x:332, y:232, len:155, d:0.4, p:ch2P },
    { x:355, y:235, len:145, d:0.9, p:ch3P },
    { x:378, y:240, len:160, d:0.3, p:ch3P },
    { x:400, y:248, len:180, d:0.6, p:ch3P },
    { x:422, y:255, len:175, d:0.1, p:ch3P },
    { x:445, y:265, len:155, d:0.5, p:ch3P },
    { x:465, y:275, len:135, d:0.8, p:ch3P },
    { x:235, y:248, len:120, d:0.4, p:ch2P },
    { x:365, y:248, len:125, d:0.7, p:ch3P },
  ];

  return (
    <>
      <ellipse cx={300+shadowDx} cy="524" rx={85*shadowSX} ry={7-sunHeight*1.5}
        fill={`rgba(20,12,4,${0.08+(1-sunHeight)*0.04})`}
        style={{ transition:'cx 4s,rx 4s,ry 4s', filter:'blur(2.5px)' }}/>

      <path d="M294,520 C265,504 235,514 200,528" stroke="#4a3020" strokeWidth="10" strokeLinecap="round" fill="none"
        strokeDasharray="100" strokeDashoffset={100*(1-trP)} style={{ transition:tr }}/>
      <path d="M306,522 C335,506 365,516 400,528" stroke="#4a3020" strokeWidth="10" strokeLinecap="round" fill="none"
        strokeDasharray="100" strokeDashoffset={100*(1-trP)} style={{ transition:tr }}/>

      <path d="M300,520 C296,460 288,400 286,340 C284,295 290,255 300,218"
        stroke="#3a2010" strokeWidth="10" strokeLinecap="round" fill="none" opacity="0.2"
        strokeDasharray="320" strokeDashoffset={320*(1-trP)} style={{ transition:tr }}/>
      <path d="M300,520 C296,460 288,400 286,340 C284,295 290,255 300,218"
        stroke="#5a3820" strokeWidth="24" strokeLinecap="round" fill="none"
        strokeDasharray="320" strokeDashoffset={320*(1-trP)} style={{ transition:tr }}/>
      <path d="M306,520 C303,458 296,396 294,336 C293,295 296,258 304,222"
        stroke="#7a5838" strokeWidth="7" strokeLinecap="round" fill="none" opacity="0.4"
        strokeDasharray="320" strokeDashoffset={320*(1-trP)} style={{ transition:tr }}/>

      <path d="M294,280 C258,268 210,255 140,258"
        stroke="#5a3820" strokeWidth="13" strokeLinecap="round" fill="none"
        strokeDasharray="165" strokeDashoffset={165*(1-brP)} style={{ transition:tr }}/>
      <path d="M306,280 C342,268 390,255 460,258"
        stroke="#5a3820" strokeWidth="13" strokeLinecap="round" fill="none"
        strokeDasharray="165" strokeDashoffset={165*(1-brP)} style={{ transition:tr }}/>
      <path d="M296,255 C265,246 228,238 180,238"
        stroke="#5a3820" strokeWidth="9" strokeLinecap="round" fill="none"
        strokeDasharray="125" strokeDashoffset={125*(1-brP)} style={{ transition:tr }}/>
      <path d="M304,255 C335,246 372,238 420,238"
        stroke="#5a3820" strokeWidth="9" strokeLinecap="round" fill="none"
        strokeDasharray="125" strokeDashoffset={125*(1-brP)} style={{ transition:tr }}/>
      <path d="M298,235 C275,228 252,224 220,226"
        stroke="#5a3820" strokeWidth="6" strokeLinecap="round" fill="none"
        strokeDasharray="85" strokeDashoffset={85*(1-brP)} style={{ transition:tr }}/>
      <path d="M302,235 C325,228 348,224 380,226"
        stroke="#5a3820" strokeWidth="6" strokeLinecap="round" fill="none"
        strokeDasharray="85" strokeDashoffset={85*(1-brP)} style={{ transition:tr }}/>

      {CHAINS.map((ch, i) => {
        const n = Math.floor(ch.len / 16);
        return (
          <g key={`wch${i}`}
             style={{
               transform:`scaleY(${ch.p})`, transformOrigin:`${ch.x}px ${ch.y}px`,
               transition:'transform 2s cubic-bezier(0.34,1.2,0.64,1)',
               animation: ch.p > 0.5 ? `wisteriaChainSway 5s ease-in-out ${ch.d}s infinite` : 'none',
             }}>
            {Array.from({ length: n }, (_, j) => {
              const cy = ch.y + j * 16;
              const r = Math.max(1.8, 5.5 - j * 0.35);
              const op = Math.max(0.4, 0.95 - j * 0.05);
              const col = j < n * 0.3 ? theme.leafLight : j < n * 0.65 ? theme.leafMid : theme.leafDark;
              const ox = (j % 3 - 1) * 1.5;
              return (
                <React.Fragment key={j}>
                  <circle cx={ch.x + ox} cy={cy} r={r} fill={col} opacity={op}/>
                  {j < n - 1 && <circle cx={ch.x - ox * 0.6} cy={cy + 8} r={r * 0.6} fill={col} opacity={op * 0.65}/>}
                </React.Fragment>
              );
            })}
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
      {nightOp > 0.18 && CHAINS.map((ch, i) => (
        <rect key={`nwch${i}`} x={ch.x-8} y={ch.y} width={16} height={ch.len*ch.p}
          fill="rgba(10,10,40,0.30)" opacity={nightOp*0.5} rx="4"/>
      ))}
      <g opacity={detP * 0.4} style={{ transition:'opacity 1.5s' }}>
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

/* ─────────────────────── BAOBAB TREE ─────────────────────── */
function BaobabTree({ progress, theme, sunAngleNorm, sunHeight, duskOp, rimLightOp, nightOp }) {
  const trP  = c01(progress, 0.00, 0.20);
  const brP  = c01(progress, 0.16, 0.40);
  const lfP  = c01(progress, 0.32, 0.65);
  const detP = c01(progress, 0.50, 0.80);
  const tr   = 'transform 1.3s cubic-bezier(0.34,1.4,0.64,1)';
  const shadowDx = -sunAngleNorm * 55;
  const shadowSX = 1 + Math.abs(sunAngleNorm) * 0.5;

  const trunkD = "M248,524 C243,480 232,420 228,370 C224,310 228,265 242,230 C252,206 270,190 290,182 C300,178 310,178 320,182 C340,190 358,206 368,230 C382,265 386,310 382,370 C378,420 367,480 362,524 Z";
  const trunkHighD = "M268,524 C265,480 258,420 256,370 C254,315 258,270 268,242 C276,222 286,210 300,205 C314,210 324,222 332,242 C342,270 346,315 344,370 C342,420 335,480 332,524 Z";

  const BRANCHES = [
    { d:"M260,230 C230,210 190,195 140,180", w:11, da:135 },
    { d:"M350,228 C380,208 420,194 470,178", w:11, da:140 },
    { d:"M255,250 C225,238 185,230 130,228", w:8,  da:135 },
    { d:"M355,248 C385,236 425,228 480,226", w:8,  da:140 },
    { d:"M272,215 C258,198 240,178 218,158", w:9,  da:70 },
    { d:"M338,213 C352,196 370,176 392,156", w:9,  da:70 },
    { d:"M290,195 C280,172 268,148 258,120",  w:7,  da:85 },
    { d:"M318,194 C328,170 340,146 350,118",  w:7,  da:85 },
  ];

  const CROWNS = [
    { cx:140, cy:170, rx:35, ry:25, p:lfP },
    { cx:470, cy:168, rx:35, ry:25, p:lfP },
    { cx:130, cy:220, rx:30, ry:20, p:lfP },
    { cx:480, cy:218, rx:30, ry:20, p:lfP },
    { cx:218, cy:148, rx:30, ry:22, p:lfP },
    { cx:392, cy:146, rx:30, ry:22, p:lfP },
    { cx:258, cy:110, rx:28, ry:20, p:lfP },
    { cx:350, cy:108, rx:28, ry:20, p:lfP },
    { cx:300, cy:150, rx:24, ry:18, p:lfP },
  ];

  return (
    <>
      <ellipse cx={300+shadowDx} cy="526" rx={95*shadowSX} ry={9-sunHeight*1.8}
        fill={`rgba(20,12,4,${0.10+(1-sunHeight)*0.05})`}
        style={{ transition:'cx 4s,rx 4s,ry 4s', filter:'blur(3px)' }}/>

      <path d="M262,524 C232,514 190,518 140,534" stroke="#6a5040" strokeWidth="15" strokeLinecap="round" fill="none"
        strokeDasharray="135" strokeDashoffset={135*(1-trP)} style={{ transition:tr }}/>
      <path d="M348,524 C378,514 420,518 470,534" stroke="#6a5040" strokeWidth="15" strokeLinecap="round" fill="none"
        strokeDasharray="135" strokeDashoffset={135*(1-trP)} style={{ transition:tr }}/>
      <path d="M275,528 C252,536 220,545 185,554" stroke="#6a5040" strokeWidth="9" strokeLinecap="round" fill="none"
        strokeDasharray="95" strokeDashoffset={95*(1-trP)} style={{ transition:tr }}/>
      <path d="M335,528 C358,536 390,545 425,554" stroke="#6a5040" strokeWidth="9" strokeLinecap="round" fill="none"
        strokeDasharray="95" strokeDashoffset={95*(1-trP)} style={{ transition:tr }}/>

      <path d={trunkD} fill="#6a5040"
        style={{ transform:`scaleY(${trP})`, transformOrigin:'300px 524px', transition:'transform 2.2s cubic-bezier(0.34,1.1,0.64,1)' }}/>
      <path d={trunkHighD} fill="#7a6855" opacity="0.6"
        style={{ transform:`scaleY(${trP})`, transformOrigin:'300px 524px', transition:'transform 2.2s cubic-bezier(0.34,1.1,0.64,1)' }}/>
      <path d="M285,524 C283,450 282,380 284,320 C286,275 292,245 300,225 C308,245 314,275 316,320 C318,380 317,450 315,524"
        fill="#8a7868" opacity="0.3"
        style={{ transform:`scaleY(${trP})`, transformOrigin:'300px 524px', transition:'transform 2.2s' }}/>

      <g opacity={detP * 0.35} style={{ transition:'opacity 1.5s' }}>
        {[490,450,410,370,330,300,275,255,240].map((y, i) => {
          const w = y > 400 ? 48 : y > 300 ? 62 : y > 250 ? 55 : 40;
          return (
            <path key={y} d={`M${300-w},${y} Q${300},${y+2} ${300+w},${y}`}
              stroke="#3a2818" strokeWidth="0.8" fill="none" opacity={0.5-i*0.03}/>
          );
        })}
      </g>

      {BRANCHES.map((b, i) => (
        <path key={`bb${i}`} d={b.d} stroke="#5a4030" strokeWidth={b.w} strokeLinecap="round" fill="none"
          strokeDasharray={b.da} strokeDashoffset={b.da*(1-brP)} style={{ transition:tr }}/>
      ))}

      {CROWNS.map((cr, i) => (
        <g key={`bc${i}`} style={{
          transform:`scale(${cr.p})`, transformOrigin:`${cr.cx}px ${cr.cy}px`,
          transition:'transform 1.5s cubic-bezier(0.34,1.3,0.64,1)',
          animation: cr.p > 0.5 ? `canopySway 5s ease-in-out ${i*0.4}s infinite` : 'none',
        }}>
          <ellipse cx={cr.cx} cy={cr.cy} rx={cr.rx+4} ry={cr.ry+3} fill={theme.leafDark} opacity="0.5"/>
          <ellipse cx={cr.cx} cy={cr.cy} rx={cr.rx} ry={cr.ry} fill={theme.leafDark}/>
          <ellipse cx={cr.cx} cy={cr.cy-3} rx={cr.rx*0.7} ry={cr.ry*0.65} fill={theme.leafMid} opacity="0.9"/>
          <ellipse cx={cr.cx} cy={cr.cy-5} rx={cr.rx*0.4} ry={cr.ry*0.4} fill={theme.leafLight} opacity="0.7"/>
          {rimLightOp > 0.08 && (
            <ellipse cx={cr.cx+sunAngleNorm*cr.rx*0.4} cy={cr.cy-sunHeight*cr.ry*0.3}
              rx={cr.rx*0.3} ry={cr.ry*0.2}
              fill={duskOp>0.5?'#ffd080':'#e8ffa8'} opacity={rimLightOp*0.35}
              style={{ filter:'blur(1.5px)', transition:'cx 4s,cy 4s' }}/>
          )}
          {nightOp > 0.18 && (
            <ellipse cx={cr.cx} cy={cr.cy} rx={cr.rx} ry={cr.ry}
              fill="rgba(8,16,44,0.45)" opacity={nightOp*0.7}/>
          )}
        </g>
      ))}

      {rimLightOp > 0.1 && (
        <path d={trunkD} fill={duskOp>0.5?'#c89060':'#ffe8c0'} opacity={rimLightOp*0.15}
          style={{ transform:`scaleY(${trP}) translateX(${sunAngleNorm*8}px)`, transformOrigin:'300px 524px', transition:'transform 4s,opacity 4s' }}/>
      )}

      <g opacity={detP * 0.5} style={{ transition:'opacity 1.5s' }}>
        <ellipse cx="270" cy="500" rx="12" ry="4" fill="#5a7a3a" opacity="0.5"/>
        <ellipse cx="335" cy="495" rx="10" ry="3.5" fill="#6a8a4a" opacity="0.4"/>
      </g>
    </>
  );
}

/* ─────────────────────── CRYSTAL TREE ─────────────────────── */
function CrystalTree({ progress, theme, sunAngleNorm, sunHeight, duskOp, rimLightOp, nightOp }) {
  const trP  = c01(progress, 0.00, 0.16);
  const brP  = c01(progress, 0.12, 0.35);
  const crP  = c01(progress, 0.28, 0.55);
  const cr2P = c01(progress, 0.40, 0.68);
  const cr3P = c01(progress, 0.52, 0.80);
  const detP = c01(progress, 0.60, 0.90);
  const tr   = 'transform 1.3s cubic-bezier(0.34,1.4,0.64,1)';
  const shadowDx = -sunAngleNorm * 40;
  const shadowSX = 1 + Math.abs(sunAngleNorm) * 0.5;

  const CRYSTALS = [
    { pts:"0,-35 -14,0 0,8 14,0", cx:140, cy:195, s:1.1, p:crP, d:0 },
    { pts:"0,-30 -12,0 0,6 12,0", cx:460, cy:190, s:1.0, p:crP, d:0.3 },
    { pts:"0,-40 -16,0 0,10 16,0", cx:200, cy:140, s:1.2, p:crP, d:0.6 },
    { pts:"0,-38 -14,0 0,8 14,0", cx:400, cy:138, s:1.15, p:crP, d:0.2 },
    { pts:"0,-28 -10,0 0,5 10,0", cx:110, cy:230, s:0.85, p:cr2P, d:0.5 },
    { pts:"0,-28 -10,0 0,5 10,0", cx:490, cy:225, s:0.85, p:cr2P, d:0.8 },
    { pts:"0,-45 -18,0 0,12 18,0", cx:260, cy:85, s:1.3, p:cr2P, d:0.1 },
    { pts:"0,-42 -17,0 0,10 17,0", cx:340, cy:82, s:1.25, p:cr2P, d:0.4 },
    { pts:"0,-32 -12,0 0,7 12,0", cx:170, cy:120, s:1.0, p:cr2P, d:0.7 },
    { pts:"0,-32 -12,0 0,7 12,0", cx:430, cy:118, s:1.0, p:cr2P, d:0.2 },
    { pts:"0,-50 -20,0 0,14 20,0", cx:300, cy:55, s:1.4, p:cr3P, d:0 },
    { pts:"0,-36 -14,0 0,8 14,0", cx:230, cy:110, s:1.05, p:cr3P, d:0.5 },
    { pts:"0,-36 -14,0 0,8 14,0", cx:370, cy:108, s:1.05, p:cr3P, d:0.3 },
    { pts:"0,-25 -9,0 0,4 9,0", cx:300, cy:140, s:0.9, p:cr3P, d:0.6 },
  ];

  return (
    <>
      <ellipse cx={300+shadowDx} cy="524" rx={75*shadowSX} ry={6-sunHeight*1.2}
        fill={`rgba(10,20,40,${0.10+(1-sunHeight)*0.06})`}
        style={{ transition:'cx 4s,rx 4s,ry 4s', filter:'blur(2px)' }}/>

      <path d="M294,520 C274,510 254,518 234,528" stroke="#3a5a7a" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.6"
        strokeDasharray="65" strokeDashoffset={65*(1-trP)} style={{ transition:tr }}/>
      <path d="M306,520 C326,510 346,518 366,528" stroke="#3a5a7a" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.6"
        strokeDasharray="65" strokeDashoffset={65*(1-trP)} style={{ transition:tr }}/>

      <polygon points="300,520 280,520 286,380 290,260 294,180 298,120 300,80 302,120 306,180 310,260 314,380 320,520"
        fill={theme.leafMid} opacity={0.55 * trP}
        style={{ transition:'opacity 2s' }}/>
      <polygon points="300,520 288,520 292,380 296,260 298,180 300,120 300,80 300,120 302,180 304,260 308,380 312,520"
        fill={theme.leafLight} opacity={0.45 * trP}
        style={{ transition:'opacity 2s' }}/>
      <polygon points="300,520 294,520 296,380 298,260 299,180 300,120 300,80 300,120 301,180 302,260 304,380 306,520"
        fill="rgba(200,240,255,0.3)" opacity={trP}
        style={{ transition:'opacity 2s' }}/>

      <path d="M296,340 C270,310 240,280 200,250 C175,230 145,215 115,205"
        stroke={theme.leafMid} strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.7"
        strokeDasharray="260" strokeDashoffset={260*(1-brP)} style={{ transition:tr }}/>
      <path d="M304,340 C330,310 360,280 400,250 C425,230 455,215 485,205"
        stroke={theme.leafMid} strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.7"
        strokeDasharray="260" strokeDashoffset={260*(1-brP)} style={{ transition:tr }}/>
      <path d="M298,260 C275,235 248,210 215,185 C195,170 172,158 148,150"
        stroke={theme.leafMid} strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.6"
        strokeDasharray="220" strokeDashoffset={220*(1-brP)} style={{ transition:tr }}/>
      <path d="M302,260 C325,235 352,210 385,185 C405,170 428,158 452,150"
        stroke={theme.leafMid} strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.6"
        strokeDasharray="220" strokeDashoffset={220*(1-brP)} style={{ transition:tr }}/>
      <path d="M298,200 C280,178 258,156 232,135"
        stroke={theme.leafMid} strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.5"
        strokeDasharray="100" strokeDashoffset={100*(1-brP)} style={{ transition:tr }}/>
      <path d="M302,200 C320,178 342,156 368,135"
        stroke={theme.leafMid} strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.5"
        strokeDasharray="100" strokeDashoffset={100*(1-brP)} style={{ transition:tr }}/>

      {CRYSTALS.map((cr, i) => (
        <g key={`cr${i}`} style={{
          transform:`translate(${cr.cx}px,${cr.cy}px) scale(${cr.s * cr.p})`,
          transformOrigin:'0px 0px',
          transition:'transform 1.8s cubic-bezier(0.34,1.4,0.64,1)',
          animation: cr.p > 0.5 ? `crystalShimmer 4s ease-in-out ${cr.d}s infinite` : 'none',
        }}>
          <polygon points={cr.pts} fill={theme.leafDark} opacity="0.7"/>
          <polygon points={cr.pts} fill={theme.leafMid} opacity="0.5" transform="scale(0.75)"/>
          <polygon points={cr.pts} fill={theme.leafLight} opacity="0.4" transform="scale(0.45)"/>
          <polygon points={cr.pts} fill="rgba(220,245,255,0.5)" opacity="0.3" transform="scale(0.2)"/>
          {rimLightOp > 0.08 && (
            <polygon points={cr.pts} fill={duskOp>0.5?'#ffd0a0':'#e0f8ff'}
              opacity={rimLightOp*0.3} transform={`translate(${sunAngleNorm*4},0) scale(0.6)`}/>
          )}
          {nightOp > 0.18 && (
            <>
              <polygon points={cr.pts} fill="rgba(8,16,44,0.4)" opacity={nightOp*0.6}/>
              <polygon points={cr.pts} fill="rgba(100,200,255,0.15)" opacity={nightOp*0.4} transform="scale(0.55)"/>
            </>
          )}
        </g>
      ))}

      {detP > 0.3 && (
        <g opacity={detP * 0.6} style={{ transition:'opacity 1.5s' }}>
          {[
            { cx:300, cy:75, r:4 }, { cx:140, cy:188, r:3 }, { cx:460, cy:183, r:3 },
            { cx:200, cy:132, r:3.5 }, { cx:400, cy:130, r:3.5 }, { cx:260, cy:78, r:2.5 },
            { cx:340, cy:76, r:2.5 }, { cx:300, cy:130, r:2 },
          ].map((sp, i) => (
            <circle key={`sp${i}`} cx={sp.cx} cy={sp.cy} r={sp.r}
              fill="rgba(220,240,255,0.8)"
              style={{ animation:`twinkle 2.5s ease-in-out ${i*0.4}s infinite` }}/>
          ))}
        </g>
      )}

      {rimLightOp > 0.1 && (
        <polygon points="300,520 288,520 292,380 296,260 298,180 300,120 300,80 300,120 302,180 304,260 308,380 312,520"
          fill={duskOp>0.5?'#ffc090':'#d0f0ff'} opacity={rimLightOp*0.25}
          style={{ transform:`translateX(${sunAngleNorm*6}px)`, transition:'transform 4s,opacity 4s' }}/>
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
  const isPine     = theme.shape === 'pine';
  const isBonsai   = theme.shape === 'bonsai';
  const isBirch    = theme.shape === 'birch';
  const isRedwood  = theme.shape === 'redwood';
  const isWisteria = theme.shape === 'wisteria';
  const isBaobab   = theme.shape === 'baobab';
  const isCrystal  = theme.shape === 'crystal';

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
          ) : isWisteria ? (
            <WisteriaTree {...treeSceneProps}/>
          ) : isBaobab ? (
            <BaobabTree {...treeSceneProps}/>
          ) : isCrystal ? (
            <CrystalTree {...treeSceneProps}/>
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
        @keyframes wisteriaChainSway {
          0%, 100% { transform: scaleY(1) translateX(0px) rotate(0deg); }
          20%      { transform: scaleY(1) translateX(3px) rotate(0.8deg); }
          50%      { transform: scaleY(1) translateX(-2px) rotate(-0.5deg); }
          80%      { transform: scaleY(1) translateX(2.5px) rotate(0.4deg); }
        }
        @keyframes crystalShimmer {
          0%, 100% { filter: brightness(1) saturate(1); }
          25%      { filter: brightness(1.2) saturate(1.15); }
          50%      { filter: brightness(0.95) saturate(1.05); }
          75%      { filter: brightness(1.15) saturate(1.1); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50%      { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
