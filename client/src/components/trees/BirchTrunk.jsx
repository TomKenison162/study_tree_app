import React from 'react';

const CATKINS = [
  { x:170, y:246, len:18, d:0   },
  { x:104, y:170, len:14, d:0.4 },
  { x:422, y:266, len:16, d:0.8 },
  { x:498, y:194, len:13, d:0.2 },
  { x:216, y:50,  len:12, d:0.6 },
  { x:420, y:60,  len:15, d:1.0 },
];

const dashTr = 'stroke-dashoffset 2s cubic-bezier(0.34,1.2,0.64,1)';

export default function BirchTrunk({ tP, detailP, tr, rimLightOp, duskOp, sunAngleNorm, rimLightX }) {
  return (
    <>
      <path d="M294,520 C272,508 250,518 230,528" stroke="#8a8070" strokeWidth="9" strokeLinecap="round" fill="none"
        strokeDasharray="72" strokeDashoffset={72*(1-tP)} style={{ transition:dashTr }}/>
      <path d="M306,522 C330,510 354,520 372,528" stroke="#8a8070" strokeWidth="9" strokeLinecap="round" fill="none"
        strokeDasharray="72" strokeDashoffset={72*(1-tP)} style={{ transition:dashTr }}/>

      <path d="M292,524 C290,462 294,398 286,330 C282,270 288,214 284,150"
        stroke="#d8d0c8" strokeWidth="9" strokeLinecap="round" fill="none" opacity="0.18"
        strokeDasharray="394" strokeDashoffset={394*(1-tP)} style={{ transition:dashTr }}/>
      <path d="M300,524 C298,462 305,398 296,330 C290,269 298,214 294,152 C290,116 298,96 298,72"
        stroke="#e8e0d4" strokeWidth="26" strokeLinecap="round" fill="none"
        strokeDasharray="552" strokeDashoffset={552*(1-tP)} style={{ transition:dashTr }}/>
      <path d="M308,524 C307,462 310,398 306,330 C304,269 308,214 306,152 C305,122 307,102 307,80"
        stroke="#c0b8b0" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.4"
        strokeDasharray="450" strokeDashoffset={450*(1-tP)} style={{ transition:dashTr }}/>

      <path d="M300,524 C298,462 305,398 296,330 C290,269 298,214 294,152 C290,116 298,96 298,72"
        stroke="rgba(255,255,245,0.5)" strokeWidth="8" strokeLinecap="round" fill="none"
        strokeDasharray="552" strokeDashoffset={552*(1-tP)}
        style={{ animation:'birchShimmer 6s ease-in-out infinite', transition:dashTr }}/>

      <g opacity={detailP * 0.9} style={{ transition:'opacity 1.5s' }}>
        {[490,455,418,385,350,312,275,238,205,172,138].map((y, i) => (
          <React.Fragment key={y}>
            <path d={`M${292-i%2*2},${y} Q${300},${y+3} ${308+i%2*2},${y}`}
              stroke="#8a7a6a" strokeWidth={1.5-i*0.08} fill="none" strokeLinecap="round" opacity="0.7"/>
            <path d={`M${292-i%2*3},${y+6} Q${300},${y+9} ${308+i%2*3},${y+6}`}
              stroke="#8a7a6a" strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.5"/>
          </React.Fragment>
        ))}
      </g>

      {detailP > 0.4 && (
        <g opacity={detailP * 0.7} style={{ transition:'opacity 1.5s' }}>
          {CATKINS.map((ck, i) => (
            <g key={i} style={{
              animation:`wisteriaChainSway ${4+i*0.5}s ease-in-out ${ck.d}s infinite`,
              transformOrigin:`${ck.x}px ${ck.y}px`,
            }}>
              {Array.from({length: Math.floor(ck.len/5)}, (_, j) => (
                <ellipse key={j} cx={ck.x+(j%2-0.5)*1.5} cy={ck.y+j*5}
                  rx={2.5-j*0.15} ry={2}
                  fill="#b8a870" opacity={0.7-j*0.08}/>
              ))}
            </g>
          ))}
        </g>
      )}

      {rimLightOp > 0.1 && (
        <path d="M300,524 C298,462 305,398 296,330 C290,269 298,214 294,152 C290,116 298,96 298,72"
          stroke={duskOp>0.5?'#ffcca0':'#fffff0'}
          strokeWidth="4" strokeLinecap="round" fill="none"
          opacity={rimLightOp*0.55}
          transform={`translate(${rimLightX*8},0)`}
          style={{ transition:'opacity 4s,transform 4s,stroke 4s' }}
          strokeDasharray="552" strokeDashoffset={552*(1-tP)}/>
      )}
    </>
  );
}
