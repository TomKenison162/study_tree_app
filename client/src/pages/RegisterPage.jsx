import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const serif = "'Fraunces', Georgia, serif";
const sans  = "system-ui,-apple-system,'Helvetica Neue',sans-serif";
const ink   = '#2d2418';
const ink2  = '#6b5a3e';
const ink3  = '#9b8a6e';
const cream = '#faf6ed';
const line  = 'rgba(45,36,24,0.12)';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate     = useNavigate();
  const [username, setUsername] = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await register(username, email, password);
      navigate('/timer');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const fieldStyle = {
    width:'100%', padding:'12px 16px', fontSize:14,
    fontFamily:serif, fontStyle:'italic',
    border:`0.5px solid ${line}`, borderRadius:10,
    background:'rgba(255,255,255,0.6)', color:ink, outline:'none',
    boxSizing:'border-box',
  };

  return (
    <div style={{
      minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      background:'linear-gradient(135deg, #f0ebe0 0%, #e8ddd0 50%, #ddd0c0 100%)',
      fontFamily:serif, padding:20,
    }}>
      <div style={{
        background:cream, borderRadius:20, padding:'40px 44px',
        maxWidth:420, width:'100%',
        boxShadow:'0 24px 80px rgba(45,36,24,0.14)',
        border:`0.5px solid ${line}`,
      }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <svg width="52" height="62" viewBox="0 0 22 26" style={{ marginBottom:14 }}>
            <rect x="10" y="18" width="2.5" height="7" fill="#5a3010" rx="0.5"/>
            <polygon points="11,2 3,12 19,12" fill="#0e2e10"/>
            <polygon points="11,5 4,15 18,15" fill="#1e5020"/>
            <polygon points="11,9 3,20 19,20" fill="#3a7830" opacity="0.9"/>
          </svg>
          <h1 style={{ fontSize:26, fontWeight:400, color:ink, letterSpacing:'-0.02em', margin:0, marginBottom:6 }}>
            Plant your first tree
          </h1>
          <p style={{ fontSize:13, color:ink3, fontStyle:'italic', margin:0 }}>
            Every study session grows your grove
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div>
            <input
              type="text" placeholder="Username (2-30 chars)" value={username}
              onChange={e => setUsername(e.target.value)} required
              minLength={2} maxLength={30}
              style={fieldStyle}
            />
          </div>
          <input
            type="email" placeholder="Email address" value={email}
            onChange={e => setEmail(e.target.value)} required
            style={fieldStyle}
          />
          <div>
            <input
              type="password" placeholder="Password (min 6 chars)" value={password}
              onChange={e => setPassword(e.target.value)} required minLength={6}
              style={fieldStyle}
            />
          </div>

          {error && (
            <div style={{
              background:'rgba(180,60,40,0.08)', border:'0.5px solid rgba(180,60,40,0.25)',
              borderRadius:8, padding:'8px 12px', fontSize:12, color:'#b03020',
              fontFamily:sans, letterSpacing:'0.04em',
            }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            background:loading?'rgba(45,36,24,0.2)':'#3d5a3a',
            color:cream, border:'none', borderRadius:10,
            padding:'13px', fontSize:11, fontWeight:500, cursor:loading?'not-allowed':'pointer',
            letterSpacing:'0.22em', textTransform:'uppercase', fontFamily:sans,
            boxShadow:loading?'none':'0 6px 20px rgba(61,90,58,0.4)',
            transition:'all 0.2s', marginTop:4,
          }}>
            {loading ? 'Creating…' : 'Create account'}
          </button>
        </form>

        <div style={{ textAlign:'center', marginTop:22 }}>
          <span style={{ fontSize:12, color:ink3, fontFamily:sans }}>Have an account? </span>
          <Link to="/login" style={{ fontSize:12, color:'#3d5a3a', fontFamily:sans, fontWeight:500 }}>
            Sign in →
          </Link>
        </div>
        <div style={{ textAlign:'center', marginTop:10 }}>
          <Link to="/timer" style={{ fontSize:11, color:ink3, fontFamily:sans, opacity:0.7 }}>
            Continue without account
          </Link>
        </div>
      </div>
    </div>
  );
}
