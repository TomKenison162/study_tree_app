import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../api.js';
import { TREE_THEMES, TinyTreeIcon } from '../components/treeTypes.jsx';

const serif = "'Fraunces', Georgia, serif";
const sans  = "system-ui,-apple-system,'Helvetica Neue',sans-serif";
const ink   = '#2d2418';
const ink2  = '#6b5a3e';
const ink3  = '#9b8a6e';
const cream = '#faf6ed';
const line  = 'rgba(45,36,24,0.12)';

function formatDate(str) {
  const d = new Date(str);
  return d.toLocaleDateString('en', { month:'short', day:'numeric', year:'numeric' });
}
function formatTime(str) {
  const d = new Date(str);
  return d.toLocaleTimeString('en', { hour:'numeric', minute:'2-digit' });
}

function TreeCard({ session, index }) {
  const theme  = TREE_THEMES[session.tree_type] || TREE_THEMES.orchard;
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position:'relative', cursor:'pointer',
        background: hover ? `${theme.accent}10` : cream,
        border: `0.5px solid ${hover ? theme.accent : line}`,
        borderRadius:14, padding:'16px 14px',
        display:'flex', flexDirection:'column', alignItems:'center', gap:10,
        transition:'all 0.2s', boxShadow: hover ? `0 8px 24px ${theme.accent}22` : '0 1px 8px rgba(45,36,24,0.04)',
        animation:`treePop 0.4s cubic-bezier(0.34,1.56,0.64,1) ${index*0.02}s both`,
      }}
    >
      <div style={{ transition:'transform 0.2s', transform:hover?'scale(1.08)':'scale(1)' }}>
        <TinyTreeIcon themeKey={session.tree_type} size={42}/>
      </div>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:12, fontFamily:serif, color:ink, marginBottom:2 }}>{theme.name}</div>
        <div style={{ fontSize:10, color:ink3, fontFamily:sans }}>{formatDate(session.completed_at)}</div>
      </div>
      <div style={{ display:'flex', gap:8, fontSize:10, fontFamily:sans, color:ink2 }}>
        <span>{session.duration_mins}m</span>
        <span style={{ color:line }}>·</span>
        <span>{session.cards_done}/{session.cards_total}</span>
      </div>
      {session.intention && (
        <div style={{ fontSize:10, color:ink3, fontFamily:serif, fontStyle:'italic', textAlign:'center', lineHeight:1.4, overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', maxWidth:'100%' }}>
          "{session.intention}"
        </div>
      )}
      {hover && (
        <div style={{
          position:'absolute', bottom:-1, left:-1, right:-1,
          background:cream, border:`0.5px solid ${theme.accent}`,
          borderTop:'none', borderRadius:'0 0 14px 14px',
          padding:'10px 12px',
          boxShadow:`0 8px 20px ${theme.accent}22`,
          zIndex:10,
        }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, fontSize:10, fontFamily:sans, color:ink2 }}>
            <span>🌱 {session.cards_fresh} fresh</span>
            <span>🔄 {session.cards_review} review</span>
            <span>↩️ {session.redos} redos</span>
            <span>🕐 {formatTime(session.completed_at)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GrovePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [total,    setTotal]    = useState(0);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [filter,   setFilter]   = useState('all');
  const offset = useRef(0);
  const [hasMore, setHasMore]  = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    loadMore(true);
  }, [user, navigate]);

  async function loadMore(reset=false) {
    setLoading(true);
    try {
      const off = reset ? 0 : offset.current;
      const { sessions:s, total:t } = await api.getSessions(50, off);
      if (reset) { setSessions(s); offset.current = s.length; }
      else { setSessions(prev => [...prev, ...s]); offset.current += s.length; }
      setTotal(t);
      setHasMore(offset.current < t);
    } catch(e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const filtered = filter === 'all' ? sessions : sessions.filter(s => s.tree_type === filter);
  const treeTypes = [...new Set(sessions.map(s => s.tree_type))];

  if (!user) return null;

  return (
    <div>
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontSize:28, fontWeight:400, color:ink, fontFamily:serif, letterSpacing:'-0.02em', margin:'0 0 6px 0' }}>
          {user.username}'s grove
        </h1>
        <p style={{ fontSize:13, color:ink3, fontFamily:serif, fontStyle:'italic', margin:0 }}>
          {total} {total===1?'tree':'trees'} grown
        </p>
      </div>

      {/* Filter pills */}
      {treeTypes.length > 1 && (
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:24 }}>
          {['all', ...treeTypes].map(k => {
            const theme = k === 'all' ? null : TREE_THEMES[k];
            const active = filter === k;
            return (
              <button key={k} onClick={() => setFilter(k)} style={{
                display:'flex', alignItems:'center', gap:6,
                padding:'6px 14px', borderRadius:20,
                border: active ? `1.5px solid ${theme?.accent||'#3d5a3a'}` : `0.5px solid ${line}`,
                background: active ? `${theme?.accent||'#4a7a45'}15` : cream,
                cursor:'pointer', fontSize:11, fontFamily:sans,
                color: active ? (theme?.accentDeep||'#3d5a3a') : ink2,
                fontWeight: active ? 600 : 400,
                letterSpacing:'0.08em', transition:'all 0.2s',
              }}>
                {k !== 'all' && <TinyTreeIcon themeKey={k} size={14}/>}
                {k === 'all' ? `All (${sessions.length})` : (TREE_THEMES[k]?.name||k)}
              </button>
            );
          })}
        </div>
      )}

      {error && (
        <div style={{ color:'#b03020', fontFamily:sans, fontSize:13, marginBottom:16 }}>{error}</div>
      )}

      {filtered.length === 0 && !loading && (
        <div style={{ textAlign:'center', padding:'80px 0' }}>
          <TinyTreeIcon themeKey="orchard" size={52}/>
          <p style={{ fontSize:15, color:ink2, fontFamily:serif, fontStyle:'italic', marginTop:16 }}>
            Your grove is empty. Start your first session to plant a tree.
          </p>
          <a href="/timer" style={{ display:'inline-block', marginTop:16, padding:'10px 22px', background:'#3d5a3a', color:cream, borderRadius:10, fontSize:11, fontFamily:sans, fontWeight:500, letterSpacing:'0.18em', textTransform:'uppercase', textDecoration:'none' }}>
            Start a session
          </a>
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))', gap:14 }}>
        {filtered.map((s,i) => (
          <TreeCard key={s.id} session={s} index={i}/>
        ))}
      </div>

      {hasMore && !loading && (
        <div style={{ textAlign:'center', marginTop:28 }}>
          <button onClick={() => loadMore()} style={{ background:'transparent', border:`0.5px solid ${line}`, borderRadius:10, padding:'10px 22px', fontSize:11, fontFamily:sans, fontWeight:500, letterSpacing:'0.18em', textTransform:'uppercase', color:ink2, cursor:'pointer' }}>
            Load more
          </button>
        </div>
      )}

      {loading && (
        <div style={{ textAlign:'center', padding:'40px 0', color:ink3, fontFamily:serif, fontStyle:'italic' }}>
          Watering your grove…
        </div>
      )}

      <style>{`
        @keyframes treePop{0%{transform:scale(0);opacity:0}100%{transform:scale(1);opacity:1}}
      `}</style>
    </div>
  );
}
