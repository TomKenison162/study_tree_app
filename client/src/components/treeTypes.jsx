/* ════════════════════════════════════════════════════════════
   TREE TYPES — 9 unique species
   ════════════════════════════════════════════════════════════ */

export const TREE_THEMES = {
  orchard: {
    name: 'Orchard', shape: 'deciduous',
    leafDark: '#2d4a2a', leafMid: '#4a7a45', leafLight: '#7ba66a',
    accent: '#5a7a4a', accentDeep: '#3d5a3a',
    glow: 'rgba(245,200,112,', petal: '#7ba66a',
    canopyScale: 1.0, canopyDropY: 0,
  },
  sakura: {
    name: 'Sakura', shape: 'deciduous',
    leafDark: '#7a2d4a', leafMid: '#b85278', leafLight: '#e9a8c0',
    accent: '#b85278', accentDeep: '#7a2d4a',
    glow: 'rgba(253,228,236,', petal: '#f5b8c8',
    canopyScale: 0.92, canopyDropY: 8,
  },
  maple: {
    name: 'Maple', shape: 'deciduous',
    leafDark: '#7a2e0a', leafMid: '#c4521e', leafLight: '#e89548',
    accent: '#b86134', accentDeep: '#7a3e1a',
    glow: 'rgba(248,180,80,', petal: '#e89548',
    canopyScale: 0.95, canopyDropY: 0,
  },
  willow: {
    name: 'Willow', shape: 'deciduous',
    leafDark: '#3e4e30', leafMid: '#7a9268', leafLight: '#bccfa0',
    accent: '#7a9268', accentDeep: '#4a5e38',
    glow: 'rgba(220,232,180,', petal: '#c4d4a8',
    canopyScale: 1.05, canopyDropY: 28,
  },
  jacaranda: {
    name: 'Jacaranda', shape: 'deciduous',
    leafDark: '#3a2858', leafMid: '#6a4e9c', leafLight: '#b09cdc',
    accent: '#7858a8', accentDeep: '#4a327a',
    glow: 'rgba(208,180,240,', petal: '#c8b0e8',
    canopyScale: 1.0, canopyDropY: 5,
  },
  oak: {
    name: 'Oak', shape: 'oak',
    leafDark: '#1a3a18', leafMid: '#2e5a2a', leafLight: '#4a7a3e',
    accent: '#3a6a30', accentDeep: '#1a3a18',
    glow: 'rgba(100,180,80,', petal: '#8ab87a',
    canopyScale: 1.18, canopyDropY: 0,
  },
  birch: {
    name: 'Birch', shape: 'birch',
    leafDark: '#4a5e30', leafMid: '#8ab050', leafLight: '#c8e090',
    accent: '#90b050', accentDeep: '#506030',
    glow: 'rgba(200,220,100,', petal: '#d4e8a8',
    canopyScale: 0.82, canopyDropY: -15,
  },
  pine: {
    name: 'Pine', shape: 'pine',
    leafDark: '#0e2e10', leafMid: '#1e5020', leafLight: '#3a7830',
    accent: '#3a7830', accentDeep: '#0e2e10',
    glow: 'rgba(80,160,80,', petal: '#a8c898',
    canopyScale: 1.0, canopyDropY: 0,
  },
  bonsai: {
    name: 'Bonsai', shape: 'bonsai',
    leafDark: '#2a3e20', leafMid: '#507040', leafLight: '#88a868',
    accent: '#607850', accentDeep: '#304028',
    glow: 'rgba(140,180,100,', petal: '#b8c8a0',
    canopyScale: 1.0, canopyDropY: 0,
  },
  magnolia: {
    name: 'Magnolia', shape: 'deciduous',
    leafDark: '#2a4030', leafMid: '#4a7050', leafLight: '#7aaa78',
    accent: '#e0b8c8', accentDeep: '#8a4060',
    glow: 'rgba(240,200,220,', petal: '#f0c8d8',
    canopyScale: 0.96, canopyDropY: 4,
    flowerColor: '#f0d0e0', flowerAccent: '#e8a0b8',
  },
  redwood: {
    name: 'Redwood', shape: 'redwood',
    leafDark: '#1a3818', leafMid: '#2a5820', leafLight: '#3a7a30',
    accent: '#5a3a20', accentDeep: '#3a2010',
    glow: 'rgba(100,70,40,', petal: '#8a6040',
    canopyScale: 1.0, canopyDropY: 0,
  },
  wisteria: {
    name: 'Wisteria', shape: 'wisteria',
    leafDark: '#4a2868', leafMid: '#7a4ea8', leafLight: '#c8a8e0',
    accent: '#8a60b8', accentDeep: '#4a2868',
    glow: 'rgba(180,140,220,', petal: '#d4b8f0',
    canopyScale: 1.0, canopyDropY: 0,
  },
  baobab: {
    name: 'Baobab', shape: 'baobab',
    leafDark: '#2a4a1e', leafMid: '#4a7a35', leafLight: '#7aaa5a',
    accent: '#6a5a3a', accentDeep: '#4a3a20',
    glow: 'rgba(120,100,70,', petal: '#8a8060',
    canopyScale: 1.0, canopyDropY: 0,
  },
  crystal: {
    name: 'Crystal', shape: 'crystal',
    leafDark: '#1a3a5a', leafMid: '#3a7aaa', leafLight: '#a0d8ff',
    accent: '#50a0d0', accentDeep: '#1a4a6a',
    glow: 'rgba(100,180,240,', petal: '#b0e0ff',
    canopyScale: 1.0, canopyDropY: 0,
  },
};

/* ════════════════════════════════════════════════════════════
   SHARED DECIDUOUS TREE DATA
   ════════════════════════════════════════════════════════════ */

function makeBlob(cx, cy, r, vars) {
  const n = vars.length;
  const pts = vars.map((v, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return [+(cx + Math.cos(a) * (r + v)).toFixed(2), +(cy + Math.sin(a) * (r + v)).toFixed(2)];
  });
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < n; i++) {
    const c = pts[i], nx = pts[(i + 1) % n];
    d += `Q${c[0]},${c[1]},${+((c[0] + nx[0]) / 2).toFixed(2)},${+((c[1] + nx[1]) / 2).toFixed(2)}`;
  }
  return d + 'Z';
}

export const FOLIAGE_BASE = [
  { cx:155, cy:195, r:70, v:[8,-10,14,-6,10,-14,8,-10,12],     ph:0 },
  { cx:445, cy:210, r:76, v:[-8,12,-6,16,-8,6,14,-7,10],       ph:0 },
  { cx:238, cy:78,  r:84, v:[12,-10,16,-12,10,-16,14,-10,12,-6], ph:0 },
  { cx:360, cy:80,  r:72, v:[-8,12,-6,15,-8,6,12,-7,8,-10],    ph:0 },
  { cx:178, cy:248, r:54, v:[8,-6,10,-8,6,-10,8],               ph:0 },
  { cx:390, cy:255, r:58, v:[-6,10,-8,14,-6,8,-12,7],           ph:0 },
  { cx:298, cy:160, r:90, v:[10,-12,14,-10,12,-14,10,-8,12,-10], ph:0 },
  { cx:112, cy:178, r:64, v:[8,-6,12,-8,6,-10,8,-6,10],         ph:1 },
  { cx:468, cy:200, r:67, v:[-6,12,-8,10,-6,14,-8,6,10],        ph:1 },
  { cx:215, cy:62,  r:78, v:[12,-8,16,-10,8,-15,12,-8,10,-6],   ph:1 },
  { cx:375, cy:64,  r:70, v:[-8,12,-6,15,-8,6,12,-7,8,-10],     ph:1 },
  { cx:158, cy:238, r:50, v:[6,-8,10,-6,8,-10,6],               ph:1 },
  { cx:414, cy:248, r:54, v:[-6,10,-8,12,-6,8,-10],             ph:1 },
  { cx:56,  cy:268, r:48, v:[8,-6,10,-8,6],                     ph:1 },
  { cx:510, cy:148, r:52, v:[-6,10,-8,12,-6,8],                 ph:1 },
  { cx:140, cy:105, r:60, v:[10,-8,14,-10,8,-15,12],            ph:1 },
  { cx:290, cy:236, r:46, v:[6,-8,10,-6,8,-10],                 ph:1 },
  { cx:298, cy:128, r:62, v:[8,-10,12,-8,10,-12,8,-6,10],       ph:1 },
  { cx:92,  cy:155, r:55, v:[8,-6,10,-8,6,-10,8],               ph:2 },
  { cx:490, cy:184, r:58, v:[-6,10,-8,12,-6,8,-10],             ph:2 },
  { cx:182, cy:44,  r:64, v:[10,-8,15,-10,8,-15,12,-6],         ph:2 },
  { cx:350, cy:44,  r:60, v:[-8,12,-6,15,-8,6,12,-7],           ph:2 },
  { cx:42,  cy:256, r:42, v:[6,-6,10,-8,6],                     ph:2 },
  { cx:524, cy:132, r:45, v:[-6,8,-6,10,-6],                    ph:2 },
  { cx:118, cy:90,  r:52, v:[8,-8,12,-10,8,-12,8],              ph:2 },
  { cx:386, cy:42,  r:50, v:[-6,10,-8,12,-6,8],                 ph:2 },
  { cx:278, cy:226, r:38, v:[6,-8,8,-6,8,-8],                   ph:2 },
  { cx:314, cy:260, r:35, v:[-6,8,-6,10,-6],                    ph:2 },
  { cx:248, cy:108, r:48, v:[8,-6,10,-8,6,-10,8],               ph:2 },
  { cx:340, cy:200, r:46, v:[-6,10,-8,8,-6,10,-6],              ph:2 },
];

export function buildBlobs(theme) {
  const sc = theme.canopyScale || 1;
  const dy = theme.canopyDropY || 0;
  return FOLIAGE_BASE.map(f => ({
    ...f,
    cy: f.cy + dy,
    r: f.r * sc,
    path: makeBlob(f.cx, f.cy + dy, f.r * sc, f.v.map(v => v * sc)),
    col: f.ph === 0 ? theme.leafDark : f.ph === 1 ? theme.leafMid : theme.leafLight,
    op: f.ph === 0 ? 0.85 : f.ph === 1 ? 0.92 : 0.88,
  }));
}

export const TWIG_DASH = 90;
export const TWIGS = [
  'M170,246 Q150,232 130,222', 'M170,246 Q158,238 142,230',
  'M104,170 Q88,156 78,142',   'M104,170 Q92,164 80,162',
  'M50,290 Q34,288 22,290',    'M50,290 Q42,300 36,310',
  'M422,266 Q442,252 460,242', 'M422,266 Q438,260 452,258',
  'M498,194 Q514,182 526,170', 'M498,194 Q510,196 522,200',
  'M524,150 Q540,140 552,134', 'M524,150 Q528,160 530,170',
  'M216,50  Q210,32 206,18',   'M216,50  Q224,38 234,30',
  'M420,60  Q428,42 432,28',   'M420,60  Q412,46 402,34',
  'M146,110 Q132,96  124,84',  'M146,110 Q150,98 152,86',
  'M370,62  Q380,50 392,42',   'M370,62  Q360,52 352,44',
  'M62,132  Q48,124  38,118',  'M62,132  Q54,142  46,150',
  'M518,178 Q534,168 544,160', 'M518,178 Q524,188 526,200',
];

export const FINE_TWIG_DASH = 50;
export const FINE_TWIGS = [
  'M130,222 Q120,212 112,206', 'M130,222 Q126,232 122,238',
  'M460,242 Q470,232 478,228', 'M460,242 Q464,252 466,258',
  'M78,142  Q70,134  64,128',  'M78,142  Q72,148  68,154',
  'M526,170 Q536,162 542,158', 'M526,170 Q530,178 530,184',
  'M206,18  Q200,8   196,2',   'M206,18  Q212,8   216,2',
  'M432,28  Q438,18  442,10',  'M432,28  Q426,18  422,10',
  'M22,290  Q12,290  4,294',   'M552,134 Q562,128 570,124',
  'M124,84  Q116,74  112,66',  'M392,42  Q400,32  406,24',
  'M234,30  Q240,18  244,8',   'M402,34  Q394,22  390,12',
  'M152,86  Q156,76  158,68',  'M352,44  Q346,32  342,22',
];

export const RAYS = Array.from({ length: 20 }, (_, i) => i * (360 / 20));

export const LEAVES = Array.from({ length: 14 }, (_, i) => ({
  id: i, x: 5 + i * 6.5, delay: i * 0.7, dur: 5 + i * 0.4,
  size: i % 3 === 0 ? 8 : i % 3 === 1 ? 5 : 6,
  col: ['#7a9d6a', '#c4965a', '#e5b899', '#9bb38a', '#d8c19a'][i % 5],
}));

export const GLOW_ORBS = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  x: 8 + (i * 31.7) % 84,
  delay: (i * 0.7) % 8,
  dur: 6 + (i % 5),
  size: i % 3 === 0 ? 5 : i % 3 === 1 ? 3.5 : 4,
}));

export const WILDFLOWERS = [
  { x: 50,  y: 542, c: '#ffffff' }, { x: 78,  y: 548, c: '#fde68a' },
  { x: 112, y: 540, c: '#f9a8d4' }, { x: 138, y: 549, c: '#ffffff' },
  { x: 168, y: 542, c: '#c4b5fd' }, { x: 195, y: 550, c: '#fde68a' },
  { x: 392, y: 549, c: '#f9a8d4' }, { x: 420, y: 543, c: '#ffffff' },
  { x: 446, y: 550, c: '#fde68a' }, { x: 478, y: 544, c: '#c4b5fd' },
  { x: 506, y: 548, c: '#ffffff' }, { x: 542, y: 542, c: '#f9a8d4' },
  { x: 25,  y: 548, c: '#fde68a' }, { x: 568, y: 545, c: '#ffffff' },
  { x: 218, y: 552, c: '#f9a8d4' }, { x: 376, y: 552, c: '#ffffff' },
];

export const DRIFT_LEAVES = Array.from({ length: 8 }, (_, i) => ({
  id: i, delay: i * 4 + (i % 3), dur: 14 + (i % 5),
  startY: 5 + (i * 9) % 25, size: 6 + (i % 3) * 2,
  col: ['#7a9d6a', '#c4965a', '#e89548', '#9bb38a'][i % 4],
}));

export const STARS = Array.from({ length: 42 }, (_, i) => ({
  id: i, x: 3 + (i * 17.3) % 95, y: 1 + (i * 11.7) % 38,
  size: i % 4 === 0 ? 2.6 : i % 4 === 1 ? 1.6 : 1.2,
  delay: (i * 0.3) % 4,
}));

export const FIREFLIES = Array.from({ length: 14 }, (_, i) => ({
  id: i, x: 8 + (i * 13.7) % 84, y: 35 + (i * 7.3) % 35,
  delay: (i * 0.5) % 6, dur: 5 + (i % 4),
}));

export const BUTTERFLIES = Array.from({ length: 4 }, (_, i) => ({
  id: i, delay: i * 3.2, dur: 14 + i * 2,
  yStart: 35 + i * 8,
  col: ['#e9a8c0', '#fde68a', '#c4b5fd', '#a8d4d4'][i],
}));

/* ════════════════════════════════════════════════════════════
   TINY TREE ICONS for pickers and grove
   ════════════════════════════════════════════════════════════ */

export function TinyTreeIcon({ themeKey, size = 32, opacity = 1 }) {
  const theme = TREE_THEMES[themeKey] || TREE_THEMES.orchard;
  const h = Math.round(size * 1.18);

  if (theme.shape === 'pine') {
    return (
      <svg width={size} height={h} viewBox="0 0 22 26" style={{ opacity }}>
        <rect x="10" y="18" width="2.5" height="7" fill="#5a3010" rx="0.5"/>
        <polygon points="11,2 3,12 19,12" fill={theme.leafDark}/>
        <polygon points="11,5 4,15 18,15" fill={theme.leafMid}/>
        <polygon points="11,9 3,20 19,20" fill={theme.leafLight} opacity="0.9"/>
      </svg>
    );
  }
  if (theme.shape === 'bonsai') {
    return (
      <svg width={size} height={h} viewBox="0 0 22 26" style={{ opacity }}>
        <rect x="8" y="21" width="6" height="3.5" fill="#c4945a" rx="0.5"/>
        <rect x="7.5" y="19.5" width="7" height="2" fill="#a87848" rx="0.5"/>
        <path d="M11,19.5 C10,16 11.5,13 11,11" stroke="#6a4020" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
        <path d="M10.5,15 C8,14 5.5,13 4,12" stroke="#6a4020" strokeWidth="1" fill="none" strokeLinecap="round"/>
        <path d="M11,14 C13,13 15.5,12 17,11.5" stroke="#6a4020" strokeWidth="1" fill="none" strokeLinecap="round"/>
        <ellipse cx="4" cy="11" rx="4" ry="2.5" fill={theme.leafMid}/>
        <ellipse cx="17" cy="11" rx="3.5" ry="2.2" fill={theme.leafMid}/>
        <ellipse cx="11" cy="9" rx="3.5" ry="2.2" fill={theme.leafLight}/>
      </svg>
    );
  }
  if (theme.shape === 'birch') {
    return (
      <svg width={size} height={h} viewBox="0 0 22 26" style={{ opacity }}>
        <rect x="9.5" y="14" width="3" height="11" fill="#ddd8c8" rx="0.5"/>
        <line x1="9.5" y1="16.5" x2="12.5" y2="16.5" stroke="#9a8a7a" strokeWidth="0.7"/>
        <line x1="9.5" y1="19.5" x2="12.5" y2="19.5" stroke="#9a8a7a" strokeWidth="0.7"/>
        <line x1="9.5" y1="22.5" x2="12.5" y2="22.5" stroke="#9a8a7a" strokeWidth="0.7"/>
        <circle cx="11" cy="9" r="7" fill={theme.leafMid}/>
        <circle cx="7.5" cy="7.5" r="4.5" fill={theme.leafLight}/>
        <circle cx="14" cy="8" r="3.8" fill={theme.leafLight}/>
      </svg>
    );
  }
  if (theme.shape === 'oak') {
    return (
      <svg width={size} height={h} viewBox="0 0 22 26" style={{ opacity }}>
        <rect x="9" y="15" width="4" height="10" fill="#5a3a1f" rx="0.5"/>
        <circle cx="11" cy="9" r="9" fill={theme.leafDark}/>
        <circle cx="6" cy="7" r="6" fill={theme.leafMid}/>
        <circle cx="16" cy="7.5" r="5.5" fill={theme.leafMid}/>
        <circle cx="11" cy="5" r="5" fill={theme.leafLight}/>
      </svg>
    );
  }
  if (theme.shape === 'redwood') {
    return (
      <svg width={size} height={h} viewBox="0 0 22 30" style={{ opacity }}>
        <rect x="9" y="8" width="4" height="20" fill="#6a3a1a" rx="0.5"/>
        <rect x="9.5" y="8" width="1" height="20" fill="#8a5a30" rx="0.5" opacity="0.4"/>
        <polygon points="11,0 5,8 17,8" fill={theme.leafDark}/>
        <polygon points="11,3 6,10 16,10" fill={theme.leafMid}/>
        <polygon points="11,6 5,14 17,14" fill={theme.leafDark} opacity="0.9"/>
        <polygon points="11,9 6,16 16,16" fill={theme.leafLight} opacity="0.8"/>
      </svg>
    );
  }
  if (theme.shape === 'wisteria') {
    return (
      <svg width={size} height={h} viewBox="0 0 22 26" style={{ opacity }}>
        <path d="M11,24 C10.5,19 10,16 11,12" stroke="#5a3820" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M10,16 C7,15 4,14 2,13" stroke="#5a3820" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        <path d="M11,14 C14,13 17,12 19,11" stroke="#5a3820" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        {[3,7,11,15,19].map((x,i) => (
          <g key={i}>
            <circle cx={x} cy={10+i%2} r="2.5" fill={theme.leafLight} opacity="0.9"/>
            <circle cx={x} cy={13+i%2} r="2" fill={theme.leafMid} opacity="0.85"/>
            <circle cx={x} cy={15.5+i%2} r="1.5" fill={theme.leafDark} opacity="0.8"/>
          </g>
        ))}
      </svg>
    );
  }
  if (theme.shape === 'baobab') {
    return (
      <svg width={size} height={h} viewBox="0 0 22 26" style={{ opacity }}>
        <path d="M8,24 C7,20 6,16 6.5,12 C7,9 8.5,7 11,6 C13.5,7 15,9 15.5,12 C16,16 15,20 14,24 Z" fill="#7a6050"/>
        <path d="M9,24 C8.5,20 8,16 8.5,12 C9,10 10,8.5 11,8 C12,8.5 13,10 13.5,12 C14,16 13.5,20 13,24 Z" fill="#8a7060" opacity="0.6"/>
        <path d="M8,7 C5,5 3,4 2,3" stroke="#5a4030" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        <path d="M14,7 C17,5 19,4 20,3" stroke="#5a4030" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        <circle cx="2" cy="2.5" r="2.5" fill={theme.leafMid}/>
        <circle cx="20" cy="2.5" r="2.5" fill={theme.leafMid}/>
        <circle cx="11" cy="5" r="3" fill={theme.leafLight} opacity="0.8"/>
      </svg>
    );
  }
  if (theme.shape === 'crystal') {
    return (
      <svg width={size} height={h} viewBox="0 0 22 26" style={{ opacity }}>
        <polygon points="11,24 9,18 10,18 8,12 10,12 9,6 11,2 13,6 12,12 14,12 12,18 13,18" fill={theme.leafMid} opacity="0.85"/>
        <polygon points="11,24 10,18 11,12 10,6 11,2 12,6 11,12 12,18" fill={theme.leafLight} opacity="0.6"/>
        <polygon points="5,14 8,10 7,16" fill={theme.leafDark} opacity="0.7"/>
        <polygon points="17,13 14,9 15,15" fill={theme.leafDark} opacity="0.7"/>
        <polygon points="4,10 7,7 6,12" fill={theme.leafLight} opacity="0.5"/>
        <polygon points="18,9 15,6 16,11" fill={theme.leafLight} opacity="0.5"/>
        <circle cx="11" cy="2" r="1.5" fill="white" opacity="0.7"/>
      </svg>
    );
  }
  return (
    <svg width={size} height={h} viewBox="0 0 22 26" style={{ opacity }}>
      <rect x="9" y="14" width="4" height="11" fill="#5a3a1f" rx="0.5"/>
      <circle cx="11" cy="10" r="8" fill={theme.leafMid}/>
      <circle cx="7" cy="8" r="5" fill={theme.leafLight}/>
      <circle cx="14" cy="9" r="4" fill={theme.leafLight}/>
    </svg>
  );
}
