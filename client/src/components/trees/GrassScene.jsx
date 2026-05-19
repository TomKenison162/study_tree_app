import React from 'react';

const GRASS_TUFTS = [
  { x:35,  y:536, h:14, blades:4, delay:0   },
  { x:62,  y:530, h:16, blades:5, delay:0.3 },
  { x:80,  y:520, h:13, blades:4, delay:0.6 },
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
  { x:15,  y:542, h:11, blades:3, delay:0.5 },
  { x:590, y:538, h:12, blades:3, delay:0.7 },
  { x:280, y:530, h:9,  blades:3, delay:0.3 },
  { x:310, y:524, h:11, blades:3, delay:0.6 },
];

const COLORS = ['#5a8a4a', '#4a7a3a', '#6a9a5a', '#507840'];
const DUSK_COLORS = ['#8a7040', '#7a6030', '#9a8050', '#6a5828'];

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
  const baseColors = duskOp > 0.5 ? DUSK_COLORS : COLORS;
  return (
    <g>
      {Array.from({ length: blades }).map((_, i) => {
        const spread = (i - (blades - 1) / 2) * 8;
        const bh = h * (0.75 + (i % 3) * 0.1 + (i === Math.floor(blades / 2) ? 0.15 : 0));
        const angle = spread + (i % 2 === 0 ? -3 : 3);
        return (
          <GrassBlade
            key={i}
            x={x + i * 3.5}
            y={y}
            h={bh}
            angle={angle}
            delay={delay + i * 0.18}
            color={baseColors[i % baseColors.length]}
            opacity={0.6 + (i % 3) * 0.08}
          />
        );
      })}
    </g>
  );
}

export default function GrassScene({ nightOp, duskOp }) {
  return (
    <>
      {GRASS_TUFTS.map((tuft, i) => (
        <GrassTuft key={i} {...tuft} nightOp={nightOp} duskOp={duskOp} />
      ))}
    </>
  );
}
