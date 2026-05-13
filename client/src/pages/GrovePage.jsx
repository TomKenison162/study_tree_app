import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../api.js';
import { TREE_THEMES } from '../components/treeTypes.jsx';

const serif  = "'Fraunces', Georgia, serif";
const sans   = "system-ui,-apple-system,'Helvetica Neue',sans-serif";
const ink    = '#2d2418';
const ink2   = '#6b5a3e';
const ink3   = '#9b8a6e';
const cream  = '#faf6ed';
const line   = 'rgba(45,36,24,0.12)';

/* ── Sky colour from session time ── */
function skyColors(dateStr) {
  const h = new Date(dateStr + (dateStr.includes('T') ? '' : ' UTC')).getHours();
  if (h >= 5  && h < 9)  return { a:'#9a6898', b:'#f8c888' };
  if (h >= 9  && h < 16) return { a:'#5090c8', b:'#c8e8f8' };
  if (h >= 16 && h < 20) return { a:'#c05828', b:'#f8b068' };
  return { a:'#0a1230', b:'#203860' };
}

/* ═══════════════════════════════════════════════════════════
   CARD-SCENE MINI TREES  viewBox="0 0 160 140"  base y=118
   ═══════════════════════════════════════════════════════════ */

function CardTreeDeciduous({ theme }) {
  const t = theme;
  return (
    <g>
      {/* trunk */}
      <rect x="77" y="82" width="6" height="36" fill={t.accentDeep} rx="2"/>
      <rect x="79" y="82" width="2" height="36" fill="rgba(255,255,255,0.2)" rx="1"/>
      {/* root flare */}
      <ellipse cx="80" cy="118" rx="9" ry="3" fill={t.accentDeep} opacity="0.5"/>
      {/* canopy layers */}
      <circle cx="80" cy="64" r="30" fill={t.leafDark} opacity="0.9"/>
      <circle cx="58" cy="72" r="20" fill={t.leafDark}/>
      <circle cx="102" cy="70" r="19" fill={t.leafDark}/>
      <circle cx="80" cy="52" r="22" fill={t.leafMid} opacity="0.95"/>
      <circle cx="62" cy="60" r="16" fill={t.leafMid}/>
      <circle cx="98" cy="58" r="15" fill={t.leafMid}/>
      <circle cx="80" cy="44" r="16" fill={t.leafLight} opacity="0.9"/>
      <circle cx="66" cy="50" r="11" fill={t.leafLight} opacity="0.85"/>
      <circle cx="94" cy="50" r="10" fill={t.leafLight} opacity="0.85"/>
      {/* gloss */}
      <ellipse cx="72" cy="46" rx="8" ry="5" fill="rgba(255,255,255,0.16)" transform="rotate(-20 72 46)"/>
    </g>
  );
}

function CardTreePine({ theme }) {
  const t = theme;
  // 4 tiers, centered x=80, base y=118
  const cx = 80;
  function tier(ax, ay, bx1, by1) {
    const droop = (by1 - ay) * 0.08;
    return `M${cx},${ay} C${cx - (bx1-cx)*0.3},${ay+(by1-ay)*0.6} ${bx1 + 8},${by1} ${bx1},${by1+droop} Q${cx},${by1+droop*0.5} ${2*cx-bx1},${by1+droop} C${2*cx-bx1-8},${by1} ${cx+(bx1-cx)*0.3},${ay+(by1-ay)*0.6} ${cx},${ay} Z`;
  }
  return (
    <g>
      {/* trunk */}
      <rect x="79" y="95" width="3" height="23" fill="#5a3010" rx="1"/>
      {/* T4 (bottom, widest) */}
      <path d={tier(cx, 82, cx-46, 112)} fill={t.leafDark} opacity="0.65"/>
      <path d={tier(cx, 80, cx-44, 110)} fill={t.leafDark}/>
      <path d={tier(cx, 82, cx-34, 108)} fill={t.leafMid} opacity="0.9"/>
      {/* T3 */}
      <path d={tier(cx, 62, cx-36, 90)} fill={t.leafDark} opacity="0.65"/>
      <path d={tier(cx, 60, cx-34, 88)} fill={t.leafDark}/>
      <path d={tier(cx, 62, cx-26, 86)} fill={t.leafMid} opacity="0.9"/>
      {/* T2 */}
      <path d={tier(cx, 44, cx-26, 68)} fill={t.leafDark} opacity="0.65"/>
      <path d={tier(cx, 42, cx-24, 66)} fill={t.leafDark}/>
      <path d={tier(cx, 44, cx-18, 64)} fill={t.leafMid} opacity="0.9"/>
      {/* T1 (top) */}
      <path d={tier(cx, 24, cx-16, 48)} fill={t.leafDark} opacity="0.65"/>
      <path d={tier(cx, 22, cx-15, 46)} fill={t.leafDark}/>
      <path d={tier(cx, 24, cx-11, 44)} fill={t.leafLight} opacity="0.8"/>
      {/* trunk over tiers */}
      <rect x="79.5" y="95" width="2" height="23" fill="#7a4820" opacity="0.6"/>
      {/* crown tip */}
      <circle cx="80" cy="20" r="3" fill={t.leafLight} opacity="0.9"/>
    </g>
  );
}

function CardTreeBonsai({ theme }) {
  const t = theme;
  return (
    <g>
      {/* pot */}
      <path d="M62,118 L98,118 L93,102 L67,102 Z" fill="#c4845a"/>
      <path d="M62,117 L98,117" stroke="#e0a87a" strokeWidth="1.2"/>
      <path d="M67,102 L93,102" stroke="#9a5830" strokeWidth="0.8"/>
      <ellipse cx="80" cy="102" rx="13" ry="3" fill="#6a4020" opacity="0.55"/>
      {/* trunk */}
      <path d="M80,102 C78,94 82,88 79,82 C77,78 74,76 76,70" stroke={t.accentDeep} strokeWidth="5" fill="none" strokeLinecap="round"/>
      <path d="M80,100 C79,93 82,87 79.5,82" stroke="#a07040" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5"/>
      {/* branches */}
      <path d="M77,82 C68,78 58,73 50,68" stroke={t.accentDeep} strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      <path d="M78,78 C88,73 99,68 108,63" stroke={t.accentDeep} strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M76,71 C74,65 75,58 74,52" stroke={t.accentDeep} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* left cloud cluster */}
      <circle cx="46" cy="64" r="18" fill={t.leafDark}/>
      <circle cx="56" cy="55" r="14" fill={t.leafMid}/>
      <circle cx="38" cy="58" r="12" fill={t.leafDark}/>
      <circle cx="50" cy="48" r="10" fill={t.leafLight} opacity="0.85"/>
      {/* right cloud cluster */}
      <circle cx="110" cy="58" r="16" fill={t.leafDark}/>
      <circle cx="100" cy="50" r="12" fill={t.leafMid}/>
      <circle cx="118" cy="50" r="11" fill={t.leafDark}/>
      <circle cx="108" cy="43" r="9" fill={t.leafLight} opacity="0.85"/>
      {/* top cluster */}
      <circle cx="73" cy="48" r="14" fill={t.leafMid}/>
      <circle cx="80" cy="40" r="11" fill={t.leafLight}/>
      <circle cx="69" cy="40" r="9" fill={t.leafMid}/>
    </g>
  );
}

function CardTreeBirch({ theme }) {
  const t = theme;
  return (
    <g>
      {/* trunk — white */}
      <rect x="76" y="74" width="8" height="44" fill="#e8e0d0" rx="3"/>
      {/* bark marks */}
      {[80,91,102,113].map(y => (
        <path key={y} d={`M76,${y} Q80,${y+2} 84,${y}`} stroke="#8a7a6a" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.65"/>
      ))}
      <rect x="78" y="74" width="2" height="44" fill="rgba(255,255,255,0.4)" rx="1"/>
      {/* canopy — lighter, smaller */}
      <circle cx="80" cy="62" r="24" fill={t.leafDark} opacity="0.9"/>
      <circle cx="63" cy="68" r="16" fill={t.leafMid}/>
      <circle cx="97" cy="67" r="15" fill={t.leafMid}/>
      <circle cx="80" cy="52" r="18" fill={t.leafLight} opacity="0.95"/>
      <circle cx="66" cy="57" r="12" fill={t.leafLight} opacity="0.85"/>
      <circle cx="94" cy="56" r="11" fill={t.leafLight} opacity="0.85"/>
      <ellipse cx="73" cy="48" rx="7" ry="4.5" fill="rgba(255,255,255,0.18)" transform="rotate(-15 73 48)"/>
    </g>
  );
}

function CardTreeOak({ theme }) {
  const t = theme;
  return (
    <g>
      {/* thick trunk */}
      <rect x="73" y="86" width="14" height="32" fill={t.accentDeep} rx="3"/>
      <rect x="77" y="86" width="4" height="32" fill="rgba(255,255,255,0.18)" rx="2"/>
      <ellipse cx="80" cy="118" rx="14" ry="5" fill={t.accentDeep} opacity="0.5"/>
      {/* wide canopy — oak spreads far */}
      <circle cx="80" cy="65" r="36" fill={t.leafDark} opacity="0.9"/>
      <circle cx="48" cy="72" r="26" fill={t.leafDark}/>
      <circle cx="112" cy="70" r="24" fill={t.leafDark}/>
      <circle cx="60" cy="55" r="22" fill={t.leafMid}/>
      <circle cx="100" cy="53" r="21" fill={t.leafMid}/>
      <circle cx="80" cy="48" r="26" fill={t.leafMid} opacity="0.9"/>
      <circle cx="65" cy="44" r="16" fill={t.leafLight} opacity="0.85"/>
      <circle cx="95" cy="42" r="15" fill={t.leafLight} opacity="0.85"/>
      <circle cx="80" cy="38" r="18" fill={t.leafLight} opacity="0.9"/>
      <ellipse cx="70" cy="42" rx="10" ry="6" fill="rgba(255,255,255,0.15)" transform="rotate(-20 70 42)"/>
    </g>
  );
}

function CardTree({ themeKey }) {
  const theme = TREE_THEMES[themeKey] || TREE_THEMES.orchard;
  switch (theme.shape) {
    case 'pine':   return <CardTreePine   theme={theme}/>;
    case 'bonsai': return <CardTreeBonsai theme={theme}/>;
    case 'birch':  return <CardTreeBirch  theme={theme}/>;
    case 'oak':    return <CardTreeOak    theme={theme}/>;
    default:       return <CardTreeDeciduous theme={theme}/>;
  }
}

/* ═══════════════════════════════════════════════════════════
   FOREST PANORAMA  (shows all trees in one wide scene)
   ═══════════════════════════════════════════════════════════ */

function PanoramaTree({ themeKey, cx, groundY, h }) {
  const theme = TREE_THEMES[themeKey] || TREE_THEMES.orchard;
  const hw = Math.max(8, h * 0.28);

  if (theme.shape === 'pine') {
    const tiers = 4;
    return (
      <g>
        <rect x={cx - 1} y={groundY - h} width="2" height={h} fill="#5a3010" opacity="0.8"/>
        {Array.from({ length: tiers }, (_, i) => {
          const tierFrac = i / (tiers - 1);
          const ty  = groundY - h + h * tierFrac * 0.6;
          const bw  = hw * 0.35 + hw * 0.65 * tierFrac;
          const bh  = h * 0.22;
          const droop = bh * 0.06;
          return (
            <path key={i}
              d={`M${cx},${ty} C${cx-bw*0.3},${ty+bh*0.6} ${cx-bw+4},${ty+bh} ${cx-bw},${ty+bh+droop} Q${cx},${ty+bh+droop*0.5} ${cx+bw},${ty+bh+droop} C${cx+bw-4},${ty+bh} ${cx+bw*0.3},${ty+bh*0.6} ${cx},${ty} Z`}
              fill={i % 2 === 0 ? theme.leafDark : theme.leafMid}
              opacity={0.88 + i * 0.03}
            />
          );
        })}
      </g>
    );
  }

  if (theme.shape === 'bonsai') {
    const bh = h * 0.5;
    return (
      <g>
        <path d={`M${cx - 4},${groundY} L${cx + 4},${groundY} L${cx + 3},${groundY - h*0.18} L${cx - 3},${groundY - h*0.18} Z`} fill="#c4845a"/>
        <line x1={cx} y1={groundY - h*0.18} x2={cx-1} y2={groundY - h*0.55} stroke={theme.accentDeep} strokeWidth="1.5"/>
        <circle cx={cx - hw * 0.6} cy={groundY - h * 0.7} r={Math.max(5, hw * 0.6)} fill={theme.leafMid} opacity="0.9"/>
        <circle cx={cx + hw * 0.55} cy={groundY - h * 0.65} r={Math.max(4, hw * 0.5)} fill={theme.leafMid} opacity="0.9"/>
        <circle cx={cx} cy={groundY - h * 0.85} r={Math.max(4, hw * 0.45)} fill={theme.leafLight} opacity="0.9"/>
      </g>
    );
  }

  // Deciduous / birch / oak / willow
  const trunkH = h * 0.38;
  const canopyR = hw * 1.05;
  const trunkW  = theme.shape === 'oak' ? 4 : 2.5;
  const trunkCol = theme.shape === 'birch' ? '#d8d0c8' : theme.accentDeep;

  return (
    <g>
      <rect x={cx - trunkW/2} y={groundY - trunkH} width={trunkW} height={trunkH} fill={trunkCol} rx="1"/>
      <circle cx={cx}           cy={groundY - trunkH - canopyR * 0.8} r={canopyR}       fill={theme.leafDark}  opacity={0.88}/>
      <circle cx={cx - canopyR * 0.55} cy={groundY - trunkH - canopyR * 0.5} r={canopyR * 0.72} fill={theme.leafMid}/>
      <circle cx={cx + canopyR * 0.52} cy={groundY - trunkH - canopyR * 0.48} r={canopyR * 0.68} fill={theme.leafMid}/>
      <circle cx={cx}           cy={groundY - trunkH - canopyR * 1.35} r={canopyR * 0.72} fill={theme.leafLight} opacity={0.9}/>
    </g>
  );
}

function ForestPanorama({ sessions }) {
  if (!sessions.length) return null;
  const maxDur = Math.max(...sessions.map(s => s.duration_mins), 1);
  const N = sessions.length;
  const PW = Math.max(700, N * 26);
  const groundY = 185;
  const minH = 45, maxH = 150;

  const treeData = [...sessions].reverse().map((s, i) => ({
    ...s,
    x: 30 + i * ((PW - 60) / Math.max(N - 1, 1)),
    h: minH + ((s.duration_mins / maxDur) ** 0.6) * (maxH - minH),
  }));

  return (
    <div style={{ width:'100%', overflowX:'auto', borderRadius:16, boxShadow:'0 4px 24px rgba(45,36,24,0.1)', marginBottom:32 }}>
      <svg viewBox={`0 0 ${PW} 220`} xmlns="http://www.w3.org/2000/svg"
        style={{ display:'block', minWidth:PW, height:'auto', maxHeight:280 }}>
        <defs>
          <linearGradient id="panoSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5090c8"/>
            <stop offset="55%" stopColor="#b8d8f0"/>
            <stop offset="100%" stopColor="#d8eef8"/>
          </linearGradient>
          <linearGradient id="panoGrass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7ba66a"/>
            <stop offset="100%" stopColor="#5a8a4a"/>
          </linearGradient>
          {/* distant hill */}
          <linearGradient id="hillFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4a7a6a" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#4a7a6a" stopOpacity="0"/>
          </linearGradient>
        </defs>

        {/* Sky */}
        <rect width={PW} height="220" fill="url(#panoSky)"/>

        {/* Distant hills */}
        <path d={`M0,${groundY-30} Q${PW*0.15},${groundY-80} ${PW*0.3},${groundY-40} Q${PW*0.45},${groundY-100} ${PW*0.6},${groundY-50} Q${PW*0.75},${groundY-70} ${PW},${groundY-35} L${PW},${groundY} L0,${groundY} Z`}
          fill="url(#hillFade)"/>

        {/* Background tree silhouettes for depth */}
        {treeData.filter((_, i) => i % 3 === 0).map((t, i) => (
          <g key={`bg${i}`} opacity="0.25">
            <PanoramaTree themeKey={t.tree_type} cx={t.x + 12} groundY={groundY - 2} h={t.h * 0.52}/>
          </g>
        ))}

        {/* Ground */}
        <rect y={groundY} width={PW} height={220 - groundY} fill="url(#panoGrass)"/>
        <path d={`M0,${groundY} Q${PW/2},${groundY-5} ${PW},${groundY}`} fill="rgba(122,166,106,0.4)"/>

        {/* Foreground trees */}
        {treeData.map((t, i) => (
          <g key={i}>
            {/* Ground shadow */}
            <ellipse cx={t.x} cy={groundY + 1} rx={Math.max(6, t.h * 0.18)} ry="3" fill="rgba(30,20,10,0.14)"/>
            <PanoramaTree themeKey={t.tree_type} cx={t.x} groundY={groundY} h={t.h}/>
          </g>
        ))}

        {/* Ground strip detail */}
        <rect y={groundY} width={PW} height="3" fill="#5a8a4a" opacity="0.6"/>

        {/* Light fog at bottom */}
        <rect y={groundY + 25} width={PW} height={220 - groundY - 25}
          fill="rgba(220,235,210,0.18)"/>
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   GROVE CARD
   ═══════════════════════════════════════════════════════════ */

const RARITY = {
  orchard:  { label:'Orchard',   dot:'#5a7a4a' },
  sakura:   { label:'Sakura',    dot:'#b85278' },
  maple:    { label:'Maple',     dot:'#c4521e' },
  willow:   { label:'Willow',    dot:'#7a9268' },
  jacaranda:{ label:'Jacaranda', dot:'#6a4e9c' },
  oak:      { label:'Oak',       dot:'#2e5a2a' },
  birch:    { label:'Birch',     dot:'#90b050' },
  pine:     { label:'Pine',      dot:'#2a5a2a' },
  bonsai:   { label:'Bonsai',    dot:'#507040' },
};

function formatDate(s) {
  return new Date(s + (s.includes('T')?'':' UTC')).toLocaleDateString('en',{month:'short',day:'numeric'});
}
function formatTime(s) {
  return new Date(s + (s.includes('T')?'':' UTC')).toLocaleTimeString('en',{hour:'numeric',minute:'2-digit'});
}

function GroveCard({ session, index }) {
  const [hover, setHover] = useState(false);
  const sky   = skyColors(session.completed_at);
  const theme = TREE_THEMES[session.tree_type] || TREE_THEMES.orchard;
  const meta  = RARITY[session.tree_type] || RARITY.orchard;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 160, flexShrink: 0,
        background: cream,
        border: `0.5px solid ${hover ? theme.accent : line}`,
        borderRadius: 14,
        overflow: 'hidden',
        cursor: 'default',
        transition: 'all 0.22s ease',
        boxShadow: hover
          ? `0 12px 32px ${theme.accent}30, 0 2px 8px rgba(45,36,24,0.08)`
          : '0 2px 10px rgba(45,36,24,0.06)',
        transform: hover ? 'translateY(-3px)' : 'none',
        animation: `groveCardPop 0.45s cubic-bezier(0.34,1.56,0.64,1) ${Math.min(index * 0.025, 0.5)}s both`,
      }}
    >
      {/* Mini nature scene */}
      <svg viewBox="0 0 160 140" width="160" height="140" style={{ display:'block' }}>
        <defs>
          <linearGradient id={`sky${session.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={sky.a}/>
            <stop offset="100%" stopColor={sky.b}/>
          </linearGradient>
          <linearGradient id={`gnd${session.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7ba66a"/>
            <stop offset="100%" stopColor="#5a8a4a"/>
          </linearGradient>
        </defs>

        {/* Sky */}
        <rect width="160" height="140" fill={`url(#sky${session.id})`}/>
        {/* Distant horizon gradient */}
        <rect y="80" width="160" height="40" fill="rgba(220,235,210,0.25)"/>

        {/* Ground */}
        <path d="M0,118 Q40,113 80,115 Q120,117 160,112 L160,140 L0,140 Z"
          fill={`url(#gnd${session.id})`}/>
        <path d="M0,118 Q40,113 80,115 Q120,117 160,112"
          fill="none" stroke="#5a8a4a" strokeWidth="1" opacity="0.6"/>

        {/* Tree */}
        <CardTree themeKey={session.tree_type}/>

        {/* Scene shadow */}
        {hover && (
          <rect width="160" height="140" fill="rgba(255,255,255,0.04)"/>
        )}
      </svg>

      {/* Info panel */}
      <div style={{ padding:'10px 12px 12px' }}>
        {/* Species + dot */}
        <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:5 }}>
          <div style={{ width:7, height:7, borderRadius:'50%', background:meta.dot, flexShrink:0 }}/>
          <span style={{ fontSize:11, fontFamily:serif, color:ink, fontWeight:400 }}>{meta.label}</span>
          <span style={{ marginLeft:'auto', fontSize:9, color:ink3, fontFamily:sans }}>{formatDate(session.completed_at)}</span>
        </div>

        {/* Stats row */}
        <div style={{ display:'flex', gap:8, fontSize:10, fontFamily:sans, color:ink2 }}>
          <span style={{ fontVariantNumeric:'tabular-nums' }}>{session.duration_mins}m</span>
          <span style={{ color:line }}>·</span>
          <span>{session.cards_done}/{session.cards_total}</span>
          {session.redos > 0 && <>
            <span style={{ color:line }}>·</span>
            <span style={{ color:ink3 }}>{session.redos}↩</span>
          </>}
        </div>

        {/* Intention (if present) */}
        {session.intention && (
          <div style={{
            marginTop:6, fontSize:9, color:ink3, fontFamily:serif, fontStyle:'italic',
            lineHeight:1.5, display:'-webkit-box', WebkitLineClamp:2,
            WebkitBoxOrient:'vertical', overflow:'hidden',
          }}>
            "{session.intention}"
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════ */

export default function GrovePage() {
  const { user, loading: authLoading } = useAuth();
  const [sessions,  setSessions]  = useState([]);
  const [total,     setTotal]     = useState(0);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [filter,    setFilter]    = useState('all');
  const offset = useRef(0);
  const [hasMore, setHasMore]     = useState(true);

  const loadMore = useCallback(async (reset = false) => {
    setLoading(true);
    try {
      const off = reset ? 0 : offset.current;
      const { sessions: s, total: t } = await api.getSessions(50, off);
      if (reset) { setSessions(s); offset.current = s.length; }
      else { setSessions(prev => [...prev, ...s]); offset.current += s.length; }
      setTotal(t);
      setHasMore(offset.current < t);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (authLoading) return;  // wait for auth to resolve before acting
    if (!user) return;        // show sign-in prompt, don't redirect
    loadMore(true);
  }, [user, authLoading, loadMore]);

  const filtered = filter === 'all' ? sessions : sessions.filter(s => s.tree_type === filter);
  const treeTypes = [...new Set(sessions.map(s => s.tree_type))];

  /* Loading auth */
  if (authLoading) return (
    <div style={{ textAlign:'center', padding:'80px 0', color:ink3, fontFamily:serif, fontStyle:'italic' }}>
      Watering your grove…
    </div>
  );

  /* Not logged in — beautiful empty state */
  if (!user) return (
    <div style={{ textAlign:'center', padding:'80px 24px', display:'flex', flexDirection:'column', alignItems:'center', gap:24 }}>
      <svg viewBox="0 0 400 200" width="400" style={{ maxWidth:'100%', borderRadius:16, overflow:'visible' }}>
        <defs>
          <linearGradient id="emptyGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5090c8"/>
            <stop offset="100%" stopColor="#c8e8f8"/>
          </linearGradient>
        </defs>
        <rect width="400" height="200" fill="url(#emptyGradient)" rx="16"/>
        <rect y="155" width="400" height="45" fill="#7ba66a" rx="16"/>
        <rect y="170" width="400" height="30" fill="#5a8a4a"/>
        {/* 3 empty placeholder trees */}
        {[90, 200, 310].map((x, i) => (
          <g key={x} opacity={0.28}>
            <rect x={x-2} y={95} width={4} height={60} fill="#5a3a1f" rx="1"/>
            <circle cx={x} cy={80} r={28} fill="#4a7a45"/>
            <circle cx={x-16} cy={88} r={18} fill="#7ba66a"/>
            <circle cx={x+15} cy={87} r={16} fill="#7ba66a"/>
          </g>
        ))}
        <text x="200" y="105" textAnchor="middle" fontFamily="'Fraunces',Georgia,serif"
          fontSize="18" fill="rgba(255,255,255,0.85)" fontStyle="italic">
          Your grove awaits
        </text>
      </svg>
      <div>
        <p style={{ fontSize:15, color:ink2, fontFamily:serif, fontStyle:'italic', margin:'0 0 16px 0' }}>
          Sign in to grow your personal forest
        </p>
        <div style={{ display:'flex', gap:12, justifyContent:'center' }}>
          <Link to="/login" style={{
            padding:'10px 22px', background:'#3d5a3a', color:cream, borderRadius:10,
            fontSize:11, fontFamily:sans, fontWeight:500, letterSpacing:'0.18em',
            textTransform:'uppercase', textDecoration:'none',
            boxShadow:'0 6px 20px rgba(61,90,58,0.35)',
          }}>Sign in</Link>
          <Link to="/timer" style={{
            padding:'10px 22px', background:'transparent',
            border:`0.5px solid ${line}`, color:ink2, borderRadius:10,
            fontSize:11, fontFamily:sans, fontWeight:500, letterSpacing:'0.18em',
            textTransform:'uppercase', textDecoration:'none',
          }}>Start a session</Link>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:28, flexWrap:'wrap', gap:8 }}>
        <div>
          <h1 style={{ fontSize:28, fontWeight:400, color:ink, fontFamily:serif, letterSpacing:'-0.02em', margin:'0 0 4px 0' }}>
            {user.username}'s grove
          </h1>
          <p style={{ fontSize:12, color:ink3, margin:0, fontFamily:sans }}>
            {total} {total === 1 ? 'tree' : 'trees'} grown
          </p>
        </div>
        <Link to="/timer" style={{
          padding:'8px 18px', background:'#3d5a3a', color:cream, borderRadius:10,
          fontSize:10, fontFamily:sans, fontWeight:500, letterSpacing:'0.18em',
          textTransform:'uppercase', textDecoration:'none',
        }}>
          Plant more
        </Link>
      </div>

      {error && (
        <div style={{ color:'#b03020', fontFamily:sans, fontSize:13, marginBottom:16 }}>{error}</div>
      )}

      {/* Forest panorama */}
      {sessions.length > 0 && <ForestPanorama sessions={sessions}/>}

      {/* Species filter pills */}
      {treeTypes.length > 1 && (
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:24 }}>
          {['all', ...treeTypes].map(k => {
            const r   = RARITY[k];
            const active = filter === k;
            return (
              <button key={k} onClick={() => setFilter(k)} style={{
                display:'flex', alignItems:'center', gap:6,
                padding:'5px 13px', borderRadius:20,
                border: active ? `1.5px solid ${r?.dot||'#3d5a3a'}` : `0.5px solid ${line}`,
                background: active ? `${r?.dot||'#4a7a45'}18` : cream,
                cursor:'pointer', fontSize:10, fontFamily:sans,
                color: active ? (r?.dot||'#3d5a3a') : ink2,
                fontWeight: active ? 600 : 400, letterSpacing:'0.1em',
                transition:'all 0.18s',
              }}>
                {k !== 'all' && <div style={{ width:6, height:6, borderRadius:'50%', background:r?.dot||'#5a7a4a' }}/>}
                {k === 'all' ? `All · ${sessions.length}` : (r?.label || k)}
              </button>
            );
          })}
        </div>
      )}

      {/* Empty grove state (logged in, no sessions) */}
      {filtered.length === 0 && !loading && (
        <div style={{ textAlign:'center', padding:'60px 0', display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
          <svg viewBox="0 0 22 26" width="56" height="66">
            <rect x="9" y="14" width="4" height="11" fill="#c8b8a0" rx="0.5"/>
            <circle cx="11" cy="10" r="8" fill="#c0cdc0"/>
            <circle cx="7"  cy="8"  r="5" fill="#d0ddd0"/>
            <circle cx="14" cy="9"  r="4" fill="#d0ddd0"/>
          </svg>
          <p style={{ fontSize:14, color:ink2, fontFamily:serif, fontStyle:'italic', margin:0 }}>
            {filter === 'all' ? 'No trees yet — start your first session' : `No ${RARITY[filter]?.label||filter} trees yet`}
          </p>
          <Link to="/timer" style={{
            padding:'9px 20px', background:'#3d5a3a', color:cream, borderRadius:10,
            fontSize:10, fontFamily:sans, fontWeight:500, letterSpacing:'0.18em',
            textTransform:'uppercase', textDecoration:'none',
          }}>Start a session</Link>
        </div>
      )}

      {/* Card grid */}
      {filtered.length > 0 && (
        <div style={{ display:'flex', flexWrap:'wrap', gap:14 }}>
          {filtered.map((s, i) => <GroveCard key={s.id} session={s} index={i}/>)}
        </div>
      )}

      {hasMore && !loading && (
        <div style={{ textAlign:'center', marginTop:28 }}>
          <button onClick={() => loadMore()} style={{
            background:'transparent', border:`0.5px solid ${line}`,
            borderRadius:10, padding:'10px 24px', fontSize:10, fontFamily:sans,
            fontWeight:500, letterSpacing:'0.18em', textTransform:'uppercase',
            color:ink2, cursor:'pointer',
          }}>
            Load more
          </button>
        </div>
      )}

      {loading && (
        <div style={{ textAlign:'center', padding:'32px 0', color:ink3, fontFamily:serif, fontStyle:'italic' }}>
          Watering your grove…
        </div>
      )}

      <style>{`
        @keyframes groveCardPop {
          0%   { opacity:0; transform:scale(0.88) translateY(8px); }
          100% { opacity:1; transform:scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
