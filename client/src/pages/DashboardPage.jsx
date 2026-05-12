import React, { useEffect, useState } from 'react';
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

function StatCard({ label, value, sub, color, icon }) {
  return (
    <div style={{ background:cream, border:`0.5px solid ${line}`, borderRadius:16, padding:'22px 24px', boxShadow:'0 2px 16px rgba(45,36,24,0.06)' }}>
      {icon && <div style={{ fontSize:24, marginBottom:10 }}>{icon}</div>}
      <div style={{ fontSize:36, fontWeight:400, fontFamily:serif, color:color||ink, letterSpacing:'-0.03em', lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:10, fontWeight:600, letterSpacing:'0.22em', textTransform:'uppercase', fontFamily:sans, color:ink3, marginTop:6 }}>{label}</div>
      {sub && <div style={{ fontSize:12, color:ink2, fontFamily:serif, fontStyle:'italic', marginTop:4 }}>{sub}</div>}
    </div>
  );
}

function WeekBar({ day, minutes, sessions, maxMinutes }) {
  const pct = maxMinutes > 0 ? minutes / maxMinutes : 0;
  const d   = new Date(day + 'T12:00:00');
  const dayLabel = d.toLocaleDateString('en', { weekday:'short' });
  const isToday  = day === new Date().toISOString().slice(0,10);
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
      <div style={{ position:'relative', width:32, height:80, display:'flex', alignItems:'flex-end', justifyContent:'center' }}>
        <div style={{ width:24, borderRadius:4, background:pct>0?'#4a7a45':'rgba(45,36,24,0.08)', height:`${Math.max(pct*100,pct>0?8:0)}%`, transition:'height 0.6s cubic-bezier(0.34,1.56,0.64,1)', position:'relative', overflow:'hidden' }}>
          {pct > 0 && <div style={{ position:'absolute', top:0, left:0, right:0, height:'30%', background:'rgba(255,255,255,0.25)', borderRadius:'4px 4px 0 0' }}/>}
        </div>
      </div>
      {minutes > 0 && <div style={{ fontSize:9, color:'#3d5a3a', fontFamily:sans, fontWeight:600 }}>{minutes}m</div>}
      <div style={{ fontSize:9, color:isToday?ink:ink3, fontFamily:sans, fontWeight:isToday?600:400, letterSpacing:'0.1em' }}>{dayLabel}</div>
      {sessions > 0 && <div style={{ width:5, height:5, borderRadius:'50%', background:'#7ba66a' }}/>}
    </div>
  );
}

function TreeTypeBar({ treeType, count, total }) {
  const theme = TREE_THEMES[treeType] || TREE_THEMES.orchard;
  const pct   = total > 0 ? count / total : 0;
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10 }}>
      <TinyTreeIcon themeKey={treeType} size={22}/>
      <div style={{ flex:1 }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
          <span style={{ fontSize:12, fontFamily:serif, color:ink }}>{theme.name}</span>
          <span style={{ fontSize:11, fontFamily:sans, color:ink3 }}>{count}</span>
        </div>
        <div style={{ height:4, background:'rgba(45,36,24,0.08)', borderRadius:2, overflow:'hidden' }}>
          <div style={{ height:'100%', background:theme.accent, width:`${pct*100}%`, borderRadius:2, transition:'width 0.8s cubic-bezier(0.34,1.56,0.64,1)' }}/>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    api.getStats()
      .then(setStats)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  if (!user) return null;

  const totalHours = stats ? Math.floor(stats.totalMinutes/60) : 0;
  const totalMinsRem = stats ? stats.totalMinutes%60 : 0;
  const timeDisplay = totalHours > 0 ? `${totalHours}h ${totalMinsRem}m` : stats ? `${stats.totalMinutes}m` : '—';
  const maxWeeklyMins = stats ? Math.max(...stats.weeklyData.map(d=>d.minutes), 1) : 1;

  const memberDays = stats && stats.memberSince
    ? Math.floor((Date.now() - new Date(stats.memberSince)) / 86400000) + 1
    : 0;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom:32 }}>
        <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:8 }}>
          <div style={{ width:44, height:44, borderRadius:'50%', background:user.avatar_color||'#4a7a45', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:20, fontFamily:sans, boxShadow:`0 4px 12px ${user.avatar_color||'#4a7a45'}44` }}>
            {(user.username||'U')[0].toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontSize:24, fontWeight:400, color:ink, fontFamily:serif, letterSpacing:'-0.02em', margin:0 }}>
              {user.username}'s grove
            </h1>
            <p style={{ fontSize:12, color:ink3, margin:0, fontFamily:sans }}>
              Member for {memberDays} {memberDays===1?'day':'days'}
            </p>
          </div>
        </div>
      </div>

      {loading && (
        <div style={{ textAlign:'center', padding:'60px 0', color:ink3, fontFamily:serif, fontStyle:'italic' }}>
          Growing your stats…
        </div>
      )}
      {error && (
        <div style={{ background:'rgba(180,60,40,0.08)', border:'0.5px solid rgba(180,60,40,0.2)', borderRadius:10, padding:'12px 16px', color:'#b03020', fontFamily:sans, fontSize:13 }}>{error}</div>
      )}

      {stats && (
        <>
          {/* Overview cards */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:14, marginBottom:28 }}>
            <StatCard label="Study time" value={timeDisplay} sub={`${stats.totalSessions} sessions`} color="#3d5a3a"/>
            <StatCard label="Trees grown" value={stats.totalSessions} sub={`${Object.keys(TREE_THEMES).filter(k => stats.treeBreakdown.find(b=>b.tree_type===k)).length} species`} color="#4a7a45"/>
            <StatCard label="Cards done" value={stats.totalCards.toLocaleString()} sub={`${stats.totalRedos} redos`} color="#7a3e1a"/>
            <StatCard label="Day streak"
              value={
                <span style={{ display:'inline-flex', alignItems:'center', gap:6 }}>
                  {stats.streak}
                  {stats.streak > 0 && (
                    <svg width="18" height="22" viewBox="0 0 18 22" style={{ verticalAlign:'middle', marginBottom:2 }}>
                      <path d="M9,2 C7,6 4,8 4,13 C4,17.4 6.2,20 9,20 C11.8,20 14,17.4 14,13 C14,8 11,6 9,2 Z" fill={stats.streak>2?'#c45820':'#a87840'} opacity="0.9"/>
                      <path d="M9,8 C8,10 6.5,11 6.5,13.5 C6.5,15.8 7.6,17 9,17 C10.4,17 11.5,15.8 11.5,13.5 C11.5,11 10,10 9,8 Z" fill={stats.streak>4?'#f8e020':'#f8c040'} opacity="0.85"/>
                    </svg>
                  )}
                </span>
              }
              sub={stats.streak>0?`${stats.streak === 1 ? 'day' : 'days'} in a row`:'Start today'}
              color={stats.streak>2?'#b86134':'#9b8a6e'}/>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:28 }}>
            {/* Weekly chart */}
            <div style={{ background:cream, border:`0.5px solid ${line}`, borderRadius:16, padding:'20px 22px', boxShadow:'0 2px 16px rgba(45,36,24,0.06)' }}>
              <div style={{ fontSize:10, fontWeight:600, letterSpacing:'0.22em', textTransform:'uppercase', fontFamily:sans, color:ink3, marginBottom:16 }}>This week</div>
              <div style={{ display:'flex', alignItems:'flex-end', gap:4 }}>
                {stats.weeklyData.map(d => (
                  <WeekBar key={d.day} day={d.day} minutes={d.minutes} sessions={d.sessions} maxMinutes={maxWeeklyMins}/>
                ))}
              </div>
              <div style={{ marginTop:14, fontSize:11, color:ink2, fontFamily:serif, fontStyle:'italic' }}>
                {stats.weeklyData.reduce((s,d)=>s+d.minutes,0)} min this week · {stats.weeklyData.reduce((s,d)=>s+d.sessions,0)} sessions
              </div>
            </div>

            {/* Tree breakdown */}
            <div style={{ background:cream, border:`0.5px solid ${line}`, borderRadius:16, padding:'20px 22px', boxShadow:'0 2px 16px rgba(45,36,24,0.06)' }}>
              <div style={{ fontSize:10, fontWeight:600, letterSpacing:'0.22em', textTransform:'uppercase', fontFamily:sans, color:ink3, marginBottom:16 }}>Species grown</div>
              {stats.treeBreakdown.length === 0 && (
                <p style={{ fontSize:13, color:ink3, fontFamily:serif, fontStyle:'italic' }}>No sessions yet</p>
              )}
              {stats.treeBreakdown.map(b => (
                <TreeTypeBar key={b.tree_type} treeType={b.tree_type} count={b.count} total={stats.totalSessions}/>
              ))}
            </div>
          </div>

          {/* Personal bests */}
          <div style={{ background:cream, border:`0.5px solid ${line}`, borderRadius:16, padding:'20px 22px', boxShadow:'0 2px 16px rgba(45,36,24,0.06)' }}>
            <div style={{ fontSize:10, fontWeight:600, letterSpacing:'0.22em', textTransform:'uppercase', fontFamily:sans, color:ink3, marginBottom:16 }}>Personal bests</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16 }}>
              {[
                { label:'Longest session', value:stats.longestSession?`${stats.longestSession} min`:'—' },
                { label:'Most cards', value:stats.mostCardsSession||'—' },
                { label:'Total sessions', value:stats.totalSessions },
              ].map(pb => (
                <div key={pb.label} style={{ textAlign:'center', padding:'12px', background:'rgba(90,122,74,0.06)', borderRadius:10 }}>
                  <div style={{ fontSize:26, fontWeight:400, fontFamily:serif, color:ink, letterSpacing:'-0.02em' }}>{pb.value}</div>
                  <div style={{ fontSize:9, color:ink3, fontFamily:sans, letterSpacing:'0.18em', textTransform:'uppercase', marginTop:4 }}>{pb.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ textAlign:'center', marginTop:24 }}>
            <a href="/grove" style={{ fontSize:12, color:'#3d5a3a', fontFamily:sans, fontWeight:500, textDecoration:'none', letterSpacing:'0.08em' }}>
              View full grove →
            </a>
          </div>
        </>
      )}
    </div>
  );
}
