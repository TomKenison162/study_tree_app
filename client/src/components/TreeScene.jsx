import React from 'react';
import {
  buildBlobs, TWIG_DASH, TWIGS, FINE_TWIG_DASH, FINE_TWIGS, WILDFLOWERS,
} from './treeTypes.jsx';
import { c01 } from './trees/treeUtils.js';
import {
  PineTree, RedwoodTree, BonsaiTree, BirchTrunk,
  WisteriaTree, BaobabTree, CrystalTree,
  BambooTree, PalmTree, CypressTree,
  GrassScene, KEYFRAMES,
} from './trees/index.js';

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

  const dawnOp  = Math.max(0, 1 - safeProgress * 2);
  const dayOp   = Math.max(0, 1 - Math.abs(safeProgress - 0.5) * 2);
  const duskOp  = Math.max(0, safeProgress * 2 - 1);
  const nightOp = Math.max(0, safeProgress * 2 - 1.4);

  const sunPct  = safeProgress * 88 + 4;
  const sunArcY = 5 + Math.pow(safeProgress * 2 - 1, 2) * 28;

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
  const isBamboo   = theme.shape === 'bamboo';
  const isPalm     = theme.shape === 'palm';
  const isCypress  = theme.shape === 'cypress';

  const treeProps = {
    progress: safeProgress, theme,
    sunAngleNorm, sunHeight, duskOp,
    rimLightOp, rimLightX, nightOp,
  };

  return (
    <div style={{ position:'relative', flex:'1 1 50%', overflow:'hidden', zIndex:3 }}>

      {nightWashOp > 0.01 && (
        <div style={{
          position:'absolute', inset:'30% 0 0 0', pointerEvents:'none', zIndex:2,
          background:'linear-gradient(to bottom, transparent 0%, rgba(15,25,55,0.45) 70%, rgba(8,15,40,0.65) 100%)',
          mixBlendMode:'multiply', opacity:nightWashOp, transition:'opacity 4s',
        }}/>
      )}

      <div style={{
        position:'absolute', bottom:0, left:0, right:0,
        display:'flex', justifyContent:'center',
        animation: treeShake ? 'treeShake 1.2s ease-out' : 'none',
        filter: shimmer ? 'brightness(1.18) saturate(1.12)' : 'none',
        transition:'filter 0.7s ease-out',
      }}>
        <svg viewBox="0 -180 600 740" xmlns="http://www.w3.org/2000/svg"
          overflow={isRedwood ? 'visible' : undefined}
          style={{ width:'100%', height:'auto', maxHeight:'96vh', display:'block' }}>
          <defs>
            <radialGradient id="rimLight" cx={rimLightX>0?'85%':'15%'} cy="30%" r="50%">
              <stop offset="0%" stopColor={duskOp>0.5?'#ffd09a':'#fff8d8'} stopOpacity={rimLightOp}/>
              <stop offset="60%" stopColor="#ffffff" stopOpacity="0"/>
            </radialGradient>
          </defs>

          {/* Ground */}
          <path d="M-10,520 Q150,506 300,512 Q450,518 620,504 L620,562 L-10,562 Z" fill="#7ba66a"/>
          <path d="M-10,540 Q150,530 300,533 Q450,535 620,530 L620,562 L-10,562 Z" fill="#5a8a4a" opacity="0.6"/>
          <path d="M-10,548 Q100,542 200,545 Q350,548 500,543 Q570,540 620,542 L620,562 L-10,562 Z" fill="#4a7a3a" opacity="0.3"/>
          <path d="M-10,520 Q150,506 300,512 Q450,518 620,504 L620,562 L-10,562 Z"
            fill={duskOp>0.5?'#c4682a':'#fdb87a'} opacity={grassWarmth*0.25}
            style={{ transition:'fill 4s,opacity 4s' }}/>
          <path d="M-10,520 Q150,506 300,512 Q450,518 620,504 L620,562 L-10,562 Z"
            fill="#1a2a4a" opacity={grassDarken*0.55} style={{ transition:'opacity 4s' }}/>

          <GrassScene nightOp={nightOp} duskOp={duskOp}/>

          {/* Stones */}
          <ellipse cx="218" cy="524" rx="11" ry="4.5" fill="#9a8e7a"/>
          <ellipse cx="218" cy="522.5" rx="9" ry="3" fill="#bab09e"/>
          <ellipse cx="382" cy="528" rx="9" ry="3.8" fill="#9a8e7a"/>
          <ellipse cx="382" cy="526.7" rx="7" ry="2.5" fill="#bab09e"/>
          <ellipse cx="520" cy="530" rx="7" ry="3" fill="#a09484"/>
          <ellipse cx="520" cy="529" rx="5.5" ry="2" fill="#b8ae9e"/>
          {/* Mushroom */}
          <g>
            <ellipse cx="160" cy="528" rx="3" ry="6" fill="#f0e8d8"/>
            <path d="M152,524 Q160,514 168,524 Q165,527 160,527 Q155,527 152,524 Z" fill="#c64a3a"/>
            <circle cx="156" cy="521" r="1" fill="#fff8e0"/>
            <circle cx="161" cy="519" r="0.8" fill="#fff8e0"/>
          </g>
          <g>
            <ellipse cx="470" cy="525" rx="2.5" ry="5" fill="#e8e0d0"/>
            <path d="M464,522 Q470,514 476,522 Q474,524 470,524 Q466,524 464,522 Z" fill="#8a6040"/>
            <circle cx="467" cy="519" r="0.7" fill="#f8f0e0"/>
          </g>
          {dayOp > 0.1 && (
            <g>
              <ellipse cx={218+sunAngleNorm*-6} cy="528" rx={11*shadowStretchX*0.7} ry="2"
                fill={`rgba(45,36,24,${shadowOp*0.7})`} style={{ transition:'cx 4s,rx 4s,fill 4s' }}/>
              <ellipse cx={382+sunAngleNorm*-5} cy="531" rx={9*shadowStretchX*0.7} ry="1.8"
                fill={`rgba(45,36,24,${shadowOp*0.7})`} style={{ transition:'cx 4s,rx 4s,fill 4s' }}/>
            </g>
          )}

          {/* Wildflowers */}
          {WILDFLOWERS.map((f, i) => (
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
            <PineTree {...treeProps}/>
          ) : isBonsai ? (
            <BonsaiTree {...treeProps}/>
          ) : isRedwood ? (
            <RedwoodTree {...treeProps}/>
          ) : isWisteria ? (
            <WisteriaTree {...treeProps}/>
          ) : isBaobab ? (
            <BaobabTree {...treeProps}/>
          ) : isCrystal ? (
            <CrystalTree {...treeProps}/>
          ) : isBamboo ? (
            <BambooTree {...treeProps}/>
          ) : isPalm ? (
            <PalmTree {...treeProps}/>
          ) : isCypress ? (
            <CypressTree {...treeProps}/>
          ) : (
            <>
              {/* ── DECIDUOUS / BIRCH / OAK ── */}
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
                  {/* Standard deciduous trunk */}
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
              {TWIGS.map((d, i) => (
                <path key={`tw${i}`} d={d} stroke={isBirch?'#9a9080':'#7a5638'} strokeWidth="2.5" strokeLinecap="round" fill="none"
                  strokeDasharray={TWIG_DASH} strokeDashoffset={TWIG_DASH*(1-twigP)} style={{ transition:tr }}/>
              ))}
              {FINE_TWIGS.map((d, i) => (
                <path key={`ft${i}`} d={d} stroke={isBirch?'#b0a898':'#8a6850'} strokeWidth="1.4" strokeLinecap="round" fill="none"
                  strokeDasharray={FINE_TWIG_DASH} strokeDashoffset={FINE_TWIG_DASH*(1-fineTwigP)} style={{ transition:tr }} opacity="0.85"/>
              ))}

              {/* Vine (not on birch) */}
              {!isBirch && (
                <g opacity={detailP*0.85} style={{ transition:'opacity 1.5s' }}>
                  <path d="M180,250 Q176,290 178,330 Q180,360 178,388" stroke={theme.leafMid} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.65"/>
                  {[270,295,320,345,372].map((y, i) => (
                    <ellipse key={y} cx={i%2===0?174:180} cy={y} rx="3" ry="2" fill={theme.leafLight} opacity="0.8"
                      transform={`rotate(${i%2===0?-30:20} ${i%2===0?174:180} ${y})`}/>
                  ))}
                </g>
              )}

              {/* Foliage blobs */}
              {BLOBS.map((b, i) => (
                <path key={i} d={b.path} fill={b.col} opacity={b.op}
                  style={{
                    transform:`scale(${scaleOf(b.ph)})`, transformOrigin:`${b.cx}px ${b.cy}px`, transition:trSlow,
                    animation: scaleOf(b.ph) > 0.5 ? `canopySway 4.5s ease-in-out ${(i%7)*0.4}s infinite` : 'none',
                  }}/>
              ))}
              {BLOBS.filter(b => b.ph===2).slice(0,9).map((b, i) => (
                <ellipse key={`sp${i}`} cx={b.cx-b.r*0.26} cy={b.cy-b.r*0.32} rx={b.r*0.2} ry={b.r*0.13}
                  fill="rgba(255,255,255,0.18)"
                  style={{ transform:`scale(${l3P})`, transformOrigin:`${b.cx}px ${b.cy}px`, transition:trSlow }}/>
              ))}

              {/* Canopy rim light */}
              {rimLightOp > 0.1 && BLOBS.filter(b => b.ph===2).map((b, i) => (
                <ellipse key={`rim${i}`} cx={b.cx+rimLightX*b.r*0.55} cy={b.cy-sunHeight*b.r*0.3-4}
                  rx={b.r*0.45} ry={b.r*0.25}
                  fill={duskOp>0.5?'#ffd49a':'#fff4c4'}
                  opacity={rimLightOp*l3P*0.45}
                  style={{ transform:`scale(${l3P})`, transformOrigin:`${b.cx}px ${b.cy}px`,
                    transition:'cx 4s,cy 4s,opacity 4s,fill 4s', filter:'blur(2px)' }}/>
              ))}

              {/* Canopy shadow side */}
              {dayOp > 0.2 && BLOBS.filter(b => b.ph===1||b.ph===0).map((b, i) => (
                <ellipse key={`shd${i}`} cx={b.cx-rimLightX*b.r*0.5} cy={b.cy+b.r*0.2}
                  rx={b.r*0.5} ry={b.r*0.35}
                  fill={nightOp>0.3?'rgba(20,20,60,0.5)':'rgba(30,20,10,0.32)'}
                  opacity={dayOp*scaleOf(b.ph)*0.4}
                  style={{ transform:`scale(${scaleOf(b.ph)})`, transformOrigin:`${b.cx}px ${b.cy}px`,
                    transition:'cx 4s,opacity 4s,fill 4s', filter:'blur(3px)' }}/>
              ))}

              {/* Leaf accents */}
              {l3P > 0.5 && BLOBS.filter(b => b.ph===2).map((b, i) => (
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

      <style>{KEYFRAMES}</style>
    </div>
  );
}
