import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const serif = "'Fraunces', Georgia, serif";
const sans  = "system-ui,-apple-system,'Helvetica Neue',sans-serif";
const ink   = '#2d2418';
const ink2  = '#6b5a3e';
const ink3  = '#9b8a6e';
const cream = '#faf6ed';
const line  = 'rgba(45,36,24,0.12)';

function NavLink({ to, children, active }) {
  return (
    <Link to={to} style={{
      fontFamily: sans, fontSize: 11, fontWeight: 500,
      letterSpacing: '0.18em', textTransform: 'uppercase',
      color: active ? ink : ink3, textDecoration: 'none',
      padding: '6px 10px', borderRadius: 8,
      background: active ? `rgba(90,122,74,0.10)` : 'transparent',
      transition: 'all 0.2s',
    }}>
      {children}
    </Link>
  );
}

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isTimer = location.pathname === '/timer' || location.pathname === '/';

  if (isTimer) return <>{children}</>;

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div style={{ width:'100%', minHeight:'100vh', background: '#f5f0e8', fontFamily: serif, color: ink }}>
      <nav style={{
        position:'sticky', top:0, zIndex:100,
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'12px 28px',
        background:'rgba(250,246,237,0.92)',
        backdropFilter:'blur(12px)',
        borderBottom:`0.5px solid ${line}`,
        boxShadow:'0 1px 20px rgba(45,36,24,0.06)',
      }}>
        <Link to="/timer" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
          <svg width="24" height="28" viewBox="0 0 22 26">
            <rect x="9" y="14" width="4" height="11" fill="#5a3a1f" rx="0.5"/>
            <circle cx="11" cy="10" r="8" fill="#4a7a45"/>
            <circle cx="7" cy="8" r="5" fill="#7ba66a"/>
            <circle cx="14" cy="9" r="4" fill="#7ba66a"/>
          </svg>
          <span style={{ fontFamily: serif, fontSize:18, fontWeight:400, color:ink, letterSpacing:'-0.02em' }}>
            Study Tree
          </span>
        </Link>

        <div style={{ display:'flex', gap:4, alignItems:'center' }}>
          <NavLink to="/timer" active={false}>Timer</NavLink>
          <NavLink to="/dashboard" active={location.pathname==='/dashboard'}>Stats</NavLink>
          <NavLink to="/grove" active={location.pathname==='/grove'}>Grove</NavLink>
        </div>

        {user && (
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{
              width:32, height:32, borderRadius:'50%',
              background: user.avatar_color || '#4a7a45',
              display:'flex', alignItems:'center', justifyContent:'center',
              color:'white', fontSize:13, fontWeight:500, fontFamily:sans,
              boxShadow:`0 0 0 2px ${cream}, 0 0 0 3px ${user.avatar_color || '#4a7a45'}33`,
            }}>
              {(user.username || 'U')[0].toUpperCase()}
            </div>
            <span style={{ fontSize:13, color:ink2, fontFamily:sans }}>{user.username}</span>
            <button onClick={handleLogout} style={{
              background:'transparent', border:`0.5px solid ${line}`,
              borderRadius:8, padding:'5px 12px', cursor:'pointer',
              fontSize:10, fontWeight:500, letterSpacing:'0.16em',
              textTransform:'uppercase', fontFamily:sans, color:ink3,
              transition:'all 0.2s',
            }}>
              Out
            </button>
          </div>
        )}
      </nav>

      <main style={{ maxWidth:960, margin:'0 auto', padding:'32px 24px' }}>
        {children}
      </main>
    </div>
  );
}
