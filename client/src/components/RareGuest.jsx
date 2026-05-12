import React from 'react';

export const GUEST_CONFIG = {
  fox: {
    name: 'Fox', rarity: 'Common', rarityMark: '●',
    color: '#b05a18', glowColor: 'rgba(200,100,30,0.7)',
    pos: { bottom: '19%', left: '8%' },
    w: 68, h: 84,
    leaveAnim: 'foxRun',
    idleAnim: 'petBob',
  },
  owl: {
    name: 'Owl', rarity: 'Rare', rarityMark: '■',
    color: '#2a5a9a', glowColor: 'rgba(42,90,180,0.7)',
    pos: { top: '32%', left: '16%' },
    w: 62, h: 78,
    leaveAnim: 'owlFly',
    idleAnim: 'owlBlink',
  },
  bear: {
    name: 'Bear', rarity: 'Epic', rarityMark: '◆',
    color: '#6a38b0', glowColor: 'rgba(106,56,180,0.7)',
    pos: { bottom: '22%', left: '34%' },
    w: 84, h: 100,
    leaveAnim: 'bearLeave',
    idleAnim: 'petBob',
  },
  cat: {
    name: 'Cat', rarity: 'Legendary', rarityMark: '★',
    color: '#b89010', glowColor: 'rgba(200,160,20,0.8)',
    pos: { top: '36%', left: '27%' },
    w: 68, h: 84,
    leaveAnim: 'catVanish',
    idleAnim: 'catShimmer',
  },
};

/* ── FOX ── */
function FoxSVG({ alert, clicked }) {
  const eyeR = alert ? 5.5 : 4;
  const earPts = alert ? '14,20 8,2 22,14' : '14,20 8,2 22,14';
  return (
    <svg viewBox="0 0 68 84" width="68" height="84" style={{ display:'block' }}>
      {/* Tail */}
      <path d="M50,70 C62,56 66,44 62,32 C58,24 50,28 48,38 C46,48 48,60 50,70" fill="#d4621e"/>
      <path d="M62,32 C66,28 68,30 66,36 C64,40 60,38 58,34" fill="#fef0d8"/>
      {/* Body */}
      <ellipse cx="32" cy="62" rx="20" ry="16" fill="#c85a18"/>
      {/* Back paws */}
      <ellipse cx="18" cy="75" rx="9" ry="5.5" fill="#a04010" transform="rotate(-8 18 75)"/>
      <ellipse cx="46" cy="75" rx="9" ry="5.5" fill="#a04010" transform="rotate(8 46 75)"/>
      {/* Head */}
      <ellipse cx="32" cy="30" rx="18" ry="17" fill="#c85a18"/>
      {/* Ears */}
      <polygon points={earPts} fill="#c85a18"/>
      <polygon points={alert ? '15,19 10,5 21,14' : '15,19 10,5 21,14'} fill="#1a0808" opacity="0.85"/>
      <polygon points="50,20 56,2 42,14" fill="#c85a18"/>
      <polygon points="49,19 54,5 43,14" fill="#1a0808" opacity="0.85"/>
      {/* Face */}
      <path d="M18,36 Q32,48 46,36 Q44,25 32,25 Q20,25 18,36 Z" fill="#fef0d8"/>
      {/* Eyes */}
      <circle cx="24" cy="28" r={eyeR} fill="#1a0808"/>
      {alert && <circle cx="24" cy="28" r={eyeR+0.5} fill="none" stroke="#c85a18" strokeWidth="1.5" opacity="0.4"/>}
      <circle cx={alert?'23.2':'25.2'} cy={alert?'26':'27'} r={alert?2:1.4} fill="white" opacity="0.65"/>
      <circle cx="40" cy="28" r={eyeR} fill="#1a0808"/>
      {alert && <circle cx="40" cy="28" r={eyeR+0.5} fill="none" stroke="#c85a18" strokeWidth="1.5" opacity="0.4"/>}
      <circle cx={alert?'39.2':'41.2'} cy={alert?'26':'27'} r={alert?2:1.4} fill="white" opacity="0.65"/>
      {/* Nose */}
      <ellipse cx="32" cy="38" rx="3" ry="2.5" fill="#1a0808"/>
      <path d="M29,40 Q32,43 35,40" stroke="#1a0808" strokeWidth="1" fill="none" strokeLinecap="round"/>
      {/* Whiskers */}
      <line x1="28" y1="38" x2="10" y2="35" stroke="#a06040" strokeWidth="0.7" opacity="0.5"/>
      <line x1="28" y1="40" x2="10" y2="43" stroke="#a06040" strokeWidth="0.7" opacity="0.5"/>
      <line x1="36" y1="38" x2="54" y2="35" stroke="#a06040" strokeWidth="0.7" opacity="0.5"/>
      <line x1="36" y1="40" x2="54" y2="43" stroke="#a06040" strokeWidth="0.7" opacity="0.5"/>
      {/* Front paws */}
      <ellipse cx="22" cy="78" rx="7" ry="4.5" fill="#a04010"/>
      <ellipse cx="42" cy="78" rx="7" ry="4.5" fill="#a04010"/>
      {/* Alert — brows */}
      {alert && <>
        <path d="M20,22 Q24,20 28,22" stroke="#1a0808" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M36,22 Q40,20 44,22" stroke="#1a0808" strokeWidth="2" fill="none" strokeLinecap="round"/>
      </>}
    </svg>
  );
}

/* ── OWL ── */
function OwlSVG({ alert, clicked }) {
  const eyeOuter = alert ? 9   : 8;
  const eyeIris  = alert ? 7.5 : 6.5;
  const eyePupil = alert ? 3.5 : 4.5;
  return (
    <svg viewBox="0 0 62 78" width="62" height="78" style={{ display:'block' }}>
      {/* Branch */}
      <path d="M0,70 Q31,64 62,68" stroke="#5a3a1f" strokeWidth="7" fill="none" strokeLinecap="round"/>
      <path d="M0,70 Q31,66 62,68" stroke="#7a5838" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.4"/>
      {/* Wings / body outline */}
      <path d="M14,36 Q10,50 14,64" stroke="#6a5020" strokeWidth="2.5" fill="none" opacity="0.5" strokeLinecap="round"/>
      <path d="M48,36 Q52,50 48,64" stroke="#6a5020" strokeWidth="2.5" fill="none" opacity="0.5" strokeLinecap="round"/>
      {/* Body */}
      <ellipse cx="31" cy="52" rx="17" ry="20" fill="#8a6830"/>
      <ellipse cx="31" cy="56" rx="11" ry="14" fill="#e8d890" opacity="0.7"/>
      {/* Head */}
      <ellipse cx="31" cy="26" rx="16" ry="16" fill="#8a6830"/>
      <ellipse cx="31" cy="28" rx="13" ry="13" fill="#c09850" opacity="0.5"/>
      {/* Ear tufts */}
      <polygon points="17,14 12,1 21,10" fill="#8a6830"/>
      <polygon points="17,13 13,4 20,10" fill="#4a3010" opacity="0.7"/>
      <polygon points="45,14 50,1 41,10" fill="#8a6830"/>
      <polygon points="45,13 49,4 42,10" fill="#4a3010" opacity="0.7"/>
      {/* Left eye */}
      <circle cx="22" cy="26" r={eyeOuter} fill="#1a0808"/>
      <circle cx="22" cy="26" r={eyeIris} fill="#e8b020"/>
      <circle cx="22" cy="26" r={eyePupil} fill="#1a0808"/>
      <circle cx={alert?'23':'23.5'} cy={alert?'24':'24.5'} r="1.6" fill="white" opacity="0.7"/>
      {/* Right eye */}
      <circle cx="40" cy="26" r={eyeOuter} fill="#1a0808"/>
      <circle cx="40" cy="26" r={eyeIris} fill="#e8b020"/>
      <circle cx="40" cy="26" r={eyePupil} fill="#1a0808"/>
      <circle cx={alert?'41':'41.5'} cy={alert?'24':'24.5'} r="1.6" fill="white" opacity="0.7"/>
      {/* Beak */}
      <polygon points="31,31 27,38 35,38" fill="#e8a820"/>
      <polygon points="31,34 28,37 34,37" fill="#c88010" opacity="0.6"/>
      {/* Talons */}
      <path d="M16,70 Q21,67 24,70" stroke="#5a3010" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M38,70 Q43,67 46,70" stroke="#5a3010" strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

/* ── BEAR ── */
function BearSVG({ alert, clicked }) {
  const brow = alert ? -6 : 0;
  return (
    <svg viewBox="0 0 84 100" width="84" height="100" style={{ display:'block' }}>
      {/* Back legs */}
      <ellipse cx="18" cy="90" rx="15" ry="9" fill="#3a1a04" transform="rotate(-8 18 90)"/>
      <ellipse cx="66" cy="90" rx="15" ry="9" fill="#3a1a04" transform="rotate(8 66 90)"/>
      {/* Body */}
      <ellipse cx="42" cy="72" rx="30" ry="26" fill="#4a2808"/>
      <ellipse cx="42" cy="78" rx="18" ry="17" fill="#7a4828" opacity="0.65"/>
      {/* Arms */}
      <ellipse cx="12" cy="68" rx="10" ry="8" fill="#4a2808"/>
      <ellipse cx="72" cy="68" rx="10" ry="8" fill="#4a2808"/>
      {/* Front paws */}
      <ellipse cx="11" cy="76" rx="9" ry="5.5" fill="#2a1004"/>
      <ellipse cx="73" cy="76" rx="9" ry="5.5" fill="#2a1004"/>
      {/* Head */}
      <ellipse cx="42" cy="38" rx="25" ry="22" fill="#4a2808"/>
      {/* Ears */}
      <circle cx="21" cy="20" r="11" fill="#4a2808"/>
      <circle cx="21" cy="20" r="7" fill="#2a1004"/>
      <circle cx="63" cy="20" r="11" fill="#4a2808"/>
      <circle cx="63" cy="20" r="7" fill="#2a1004"/>
      {/* Muzzle */}
      <ellipse cx="42" cy="48" rx="13" ry="10" fill="#7a4828"/>
      <ellipse cx="42" cy="43" rx="5.5" ry="4.5" fill="#1a0808"/>
      {/* Eyebrow lines (shift up when alert) */}
      {alert && <>
        <path d="M29,26 Q35,22 41,26" stroke="#1a0808" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M43,26 Q49,22 55,26" stroke="#1a0808" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      </>}
      {/* Eyes */}
      <circle cx="32" cy="31" r={alert?5.5:4.5} fill="#1a0808"/>
      <circle cx="33.5" cy={alert?'29':'29.5'} r={alert?2:1.8} fill="white" opacity="0.5"/>
      <circle cx="52" cy="31" r={alert?5.5:4.5} fill="#1a0808"/>
      <circle cx="53.5" cy={alert?'29':'29.5'} r={alert?2:1.8} fill="white" opacity="0.5"/>
      {/* Mouth */}
      <path d={alert?"M36,52 Q42,57 48,52":"M37,52 Q42,56 47,52"} stroke="#1a0808" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {alert && <circle cx="42" cy="53" r="2" fill="#1a0808"/>}
    </svg>
  );
}

/* ── CAT (LEGENDARY) ── */
function CatSVG({ alert, clicked }) {
  const pupilW = alert ? 3.5 : 2.2;
  return (
    <svg viewBox="0 0 68 84" width="68" height="84" style={{ display:'block' }}>
      {/* Branch */}
      <path d="M0,74 Q34,68 68,72" stroke="#5a3a1f" strokeWidth="6" fill="none" strokeLinecap="round"/>
      <path d="M0,74 Q34,70 68,72" stroke="#7a5838" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.4"/>
      {/* Tail curled */}
      <path d="M50,70 C66,58 70,44 64,30 C60,22 52,26 50,36 C48,46 50,58 50,70" fill="#c0a888"/>
      <path d="M64,30 C68,26 70,28 68,34 C66,38 62,36 60,32" fill="#e8d8c0"/>
      {/* Body */}
      <ellipse cx="30" cy="60" rx="18" ry="14" fill="#c8b898"/>
      {/* Head */}
      <circle cx="30" cy="32" r="18" fill="#c8b898"/>
      {/* Ears */}
      <polygon points="13,20 7,2 22,14" fill="#c8b898"/>
      <polygon points="14,19 9,5 21,14" fill="#e8b0b8" opacity="0.85"/>
      <polygon points="47,20 53,2 38,14" fill="#c8b898"/>
      <polygon points="46,19 51,5 39,14" fill="#e8b0b8" opacity="0.85"/>
      {/* Subtle tabby marks */}
      <path d="M16,26 Q21,28 21,33" stroke="#a89070" strokeWidth="1.2" fill="none" opacity="0.45"/>
      <path d="M44,26 Q39,28 39,33" stroke="#a89070" strokeWidth="1.2" fill="none" opacity="0.45"/>
      {/* Eyes — legendary blue */}
      <circle cx="21" cy="30" r="7" fill="#1a0808"/>
      <circle cx="21" cy="30" r="5.5" fill="#4a98e0"/>
      <ellipse cx="21" cy="30" rx={pupilW} ry="4.5" fill="#1a0808"/>
      <circle cx="22.5" cy="28.5" r="1.5" fill="white" opacity="0.8"/>
      <circle cx="39" cy="30" r="7" fill="#1a0808"/>
      <circle cx="39" cy="30" r="5.5" fill="#4a98e0"/>
      <ellipse cx="39" cy="30" rx={pupilW} ry="4.5" fill="#1a0808"/>
      <circle cx="40.5" cy="28.5" r="1.5" fill="white" opacity="0.8"/>
      {/* Alert — wide round pupils */}
      {alert && <>
        <circle cx="21" cy="30" r="4.2" fill="#1a0808"/>
        <circle cx="39" cy="30" r="4.2" fill="#1a0808"/>
        <circle cx="22.5" cy="28.5" r="1.5" fill="white" opacity="0.8"/>
        <circle cx="40.5" cy="28.5" r="1.5" fill="white" opacity="0.8"/>
      </>}
      {/* Nose */}
      <path d="M27,38 L30,35 L33,38 Z" fill="#f0a0b0"/>
      <path d="M30,38 L30,42 M30,42 Q27,44 26,45 M30,42 Q33,44 34,45" stroke="#a07888" strokeWidth="0.9" fill="none" strokeLinecap="round"/>
      {/* Whiskers */}
      <line x1="24" y1="39" x2="4"  y2="35" stroke="#b0a090" strokeWidth="0.7" opacity="0.6"/>
      <line x1="24" y1="41" x2="4"  y2="45" stroke="#b0a090" strokeWidth="0.7" opacity="0.6"/>
      <line x1="36" y1="39" x2="56" y2="35" stroke="#b0a090" strokeWidth="0.7" opacity="0.6"/>
      <line x1="36" y1="41" x2="56" y2="45" stroke="#b0a090" strokeWidth="0.7" opacity="0.6"/>
      {/* Front paws */}
      <ellipse cx="18" cy="72" rx="8" ry="5" fill="#b8a888"/>
      <ellipse cx="38" cy="72" rx="8" ry="5" fill="#b8a888"/>
      {/* Legendary sparkle dots (idle only) */}
      {!alert && !clicked && [0,60,120,180,240,300].map(deg => {
        const r = deg * Math.PI / 180;
        const d = 26;
        return <circle key={deg} cx={30+Math.cos(r)*d} cy={30+Math.sin(r)*d} r="1.5"
          fill="#c8a820" opacity="0.5"
          style={{ animation:`catStar 2s ease-in-out ${deg/60*0.3}s infinite` }}/>;
      })}
    </svg>
  );
}

/* ── MAIN COMPONENT ── */
export default function RareGuest({ type, state, countdown, onClick }) {
  if (!type) return null;
  const cfg = GUEST_CONFIG[type];
  if (!cfg) return null;

  const isAlert   = state === 'alert';
  const isClicked = state === 'clicked';
  const isLeaving = state === 'leaving';
  const isEntering = state === 'entering' || state === 'idle';

  const anim = isClicked  ? 'guestHappy 0.7s ease-out'
    : isLeaving            ? `${cfg.leaveAnim} 0.7s ease-in forwards`
    : isAlert              ? `${cfg.idleAnim} 2.2s ease-in-out infinite, alertGlow 1s ease-in-out infinite`
    : `guestEnter 0.55s cubic-bezier(0.34,1.56,0.64,1) both, ${cfg.idleAnim} 2.8s ease-in-out 1s infinite`;

  return (
    <>
      <div
        onClick={isAlert ? onClick : undefined}
        style={{
          position: 'absolute',
          ...cfg.pos,
          zIndex: 18,
          cursor: isAlert ? 'pointer' : 'default',
          pointerEvents: isAlert ? 'auto' : 'none',
          userSelect: 'none',
          animation: anim,
          filter: isAlert
            ? `drop-shadow(0 0 10px ${cfg.glowColor}) drop-shadow(0 0 4px ${cfg.glowColor})`
            : 'drop-shadow(0 2px 6px rgba(0,0,0,0.25))',
          transition: 'filter 0.3s',
        }}
        title={isAlert ? `Click the ${cfg.name}!` : undefined}
      >
        {/* Rarity reveal banner */}
        {(state === 'entering') && (
          <div style={{
            position: 'absolute', top: -32, left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(250,246,237,0.95)',
            border: `0.5px solid ${cfg.color}44`,
            borderRadius: 6, padding: '3px 9px',
            fontSize: 9, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase',
            color: cfg.color, whiteSpace: 'nowrap',
            fontFamily: "system-ui,-apple-system,sans-serif",
            boxShadow: `0 2px 12px ${cfg.color}22`,
            animation: 'badgeFadeOut 3.2s ease-out 0.3s both',
          }}>
            {cfg.rarityMark} {cfg.rarity} · {cfg.name}
          </div>
        )}

        {/* Alert: speech bubble + countdown */}
        {isAlert && (
          <div style={{
            position: 'absolute', top: -52, left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(250,246,237,0.97)',
            border: '0.5px solid rgba(45,36,24,0.14)',
            borderRadius: 10, padding: '6px 12px',
            display: 'flex', alignItems: 'center', gap: 8,
            boxShadow: '0 4px 18px rgba(45,36,24,0.14)',
            whiteSpace: 'nowrap',
            animation: 'alertBubble 0.4s cubic-bezier(0.34,1.56,0.64,1)',
          }}>
            <span style={{
              fontSize: 11, fontFamily: "'Fraunces',Georgia,serif",
              fontStyle: 'italic', color: '#2d2418',
            }}>
              {type==='fox'?'Still there?':type==='owl'?'Who...?':type==='bear'?'Hmm?':'...'}
            </span>
            <svg width="22" height="22" viewBox="0 0 22 22">
              <circle cx="11" cy="11" r="9" fill="none" stroke="rgba(45,36,24,0.1)" strokeWidth="2"/>
              <circle cx="11" cy="11" r="9" fill="none"
                stroke={countdown<=6?'#b03020':'#c4965a'}
                strokeWidth="2.5" strokeLinecap="round"
                strokeDasharray={`${2*Math.PI*9}`}
                strokeDashoffset={2*Math.PI*9*(1 - countdown/20)}
                transform="rotate(-90 11 11)"
                style={{ transition:'stroke-dashoffset 1s linear,stroke 0.5s' }}/>
              <text x="11" y="15" textAnchor="middle" fontSize="8"
                fill={countdown<=6?'#b03020':'#6b5a3e'}
                fontFamily="system-ui,sans-serif" fontWeight="600">{countdown}</text>
            </svg>
            {/* Bubble tail */}
            <div style={{
              position:'absolute', bottom:-6, left:'50%',
              transform:'translateX(-50%)',
              width:0, height:0,
              borderLeft:'5px solid transparent',
              borderRight:'5px solid transparent',
              borderTop:'6px solid rgba(250,246,237,0.97)',
            }}/>
          </div>
        )}

        {/* Clicked: success text */}
        {isClicked && (
          <div style={{
            position:'absolute', top:-28, left:'50%', transform:'translateX(-50%)',
            fontSize:11, fontFamily:"'Fraunces',Georgia,serif",
            color:'#3d5a3a', fontStyle:'italic', whiteSpace:'nowrap',
            animation:'floaterRise 1.2s ease-out forwards',
          }}>
            back to it!
          </div>
        )}

        {/* Animal SVG */}
        {type==='fox'  && <FoxSVG  alert={isAlert} clicked={isClicked}/>}
        {type==='owl'  && <OwlSVG  alert={isAlert} clicked={isClicked}/>}
        {type==='bear' && <BearSVG alert={isAlert} clicked={isClicked}/>}
        {type==='cat'  && <CatSVG  alert={isAlert} clicked={isClicked}/>}
      </div>

      <style>{`
        @keyframes guestEnter {
          0%   { transform: scale(0) translateY(16px); opacity: 0; }
          65%  { transform: scale(1.1) translateY(-4px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes petBob {
          0%,100% { transform: translateY(0) rotate(0deg); }
          40%     { transform: translateY(-5px) rotate(-1.5deg); }
          70%     { transform: translateY(-3px) rotate(1deg); }
        }
        @keyframes owlBlink {
          0%,90%,100% { transform: translateY(0); }
          45% { transform: translateY(-4px); }
          92% { transform: scaleY(1); }
          94% { transform: scaleY(0.85); }
          96% { transform: scaleY(1); }
        }
        @keyframes catShimmer {
          0%,100% { transform: translateY(0) rotate(0.5deg); filter: drop-shadow(0 2px 6px rgba(0,0,0,0.25)); }
          50%     { transform: translateY(-5px) rotate(-0.5deg); filter: drop-shadow(0 4px 12px rgba(200,160,20,0.3)) drop-shadow(0 2px 6px rgba(0,0,0,0.25)); }
        }
        @keyframes catStar {
          0%,100% { opacity: 0.2; transform: scale(0.8); }
          50%     { opacity: 0.8; transform: scale(1.4); }
        }
        @keyframes alertGlow {
          0%,100% { filter: drop-shadow(0 0 6px var(--glow,rgba(200,100,30,0.5))); }
          50%     { filter: drop-shadow(0 0 18px var(--glow,rgba(200,100,30,0.9))); }
        }
        @keyframes guestHappy {
          0%   { transform: scale(1) rotate(0deg); }
          18%  { transform: scale(1.22) rotate(-12deg) translateY(-10px); }
          38%  { transform: scale(1.14) rotate(10deg) translateY(-14px); }
          58%  { transform: scale(1.18) rotate(-6deg) translateY(-8px); }
          78%  { transform: scale(1.06) rotate(4deg) translateY(-3px); }
          100% { transform: scale(1) rotate(0deg) translateY(0); }
        }
        @keyframes foxRun {
          0%   { transform: translateX(0) scaleX(1); opacity: 1; }
          60%  { transform: translateX(-80px) scaleX(-1) rotate(-5deg); opacity: 0.7; }
          100% { transform: translateX(-220px) scaleX(-1); opacity: 0; }
        }
        @keyframes owlFly {
          0%   { transform: scale(1) translateY(0); opacity: 1; }
          30%  { transform: scale(1.1) translateY(-20px) rotate(-10deg); opacity: 1; }
          100% { transform: scale(0.3) translateY(-160px) rotate(20deg); opacity: 0; }
        }
        @keyframes bearLeave {
          0%   { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(160px); opacity: 0; }
        }
        @keyframes catVanish {
          0%   { opacity: 1; transform: scale(1) rotate(0); }
          40%  { opacity: 1; transform: scale(1.08) rotate(-4deg); }
          100% { opacity: 0; transform: scale(0) rotate(8deg); }
        }
        @keyframes alertBubble {
          0%   { transform: translateX(-50%) scale(0.6); opacity: 0; }
          65%  { transform: translateX(-50%) scale(1.05); opacity: 1; }
          100% { transform: translateX(-50%) scale(1); opacity: 1; }
        }
        @keyframes badgeFadeOut {
          0%   { opacity: 0; transform: translateX(-50%) translateY(4px); }
          12%  { opacity: 1; transform: translateX(-50%) translateY(-4px); }
          75%  { opacity: 1; transform: translateX(-50%) translateY(-4px); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
        }
        @keyframes floaterRise {
          0%   { opacity: 0; transform: translateX(-50%) translateY(0) scale(0.8); }
          20%  { opacity: 1; transform: translateX(-50%) translateY(-8px) scale(1); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-48px) scale(1.04); }
        }
      `}</style>
    </>
  );
}
