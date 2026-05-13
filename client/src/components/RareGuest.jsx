import React from 'react';

export const GUEST_CONFIG = {
  rabbit: {
    name: 'Rabbit', rarity: 'Common', rarityMark: '●',
    color: '#8a7060', glowColor: 'rgba(160,130,110,0.7)',
    pos: { bottom: '18%', left: '6%' },
    w: 56, h: 72,
    leaveAnim: 'rabbitHop',
    idleAnim: 'rabbitNibble',
  },
  fox: {
    name: 'Fox', rarity: 'Common', rarityMark: '●',
    color: '#b05a18', glowColor: 'rgba(200,100,30,0.7)',
    pos: { bottom: '19%', left: '8%' },
    w: 68, h: 84,
    leaveAnim: 'foxRun',
    idleAnim: 'foxIdle',
  },
  owl: {
    name: 'Owl', rarity: 'Rare', rarityMark: '■',
    color: '#2a5a9a', glowColor: 'rgba(42,90,180,0.7)',
    pos: { top: '32%', left: '16%' },
    w: 62, h: 78,
    leaveAnim: 'owlFly',
    idleAnim: 'owlIdle',
  },
  deer: {
    name: 'Deer', rarity: 'Rare', rarityMark: '■',
    color: '#8a6030', glowColor: 'rgba(160,120,60,0.7)',
    pos: { bottom: '20%', left: '4%' },
    w: 80, h: 96,
    leaveAnim: 'deerLeap',
    idleAnim: 'deerIdle',
  },
  bear: {
    name: 'Bear', rarity: 'Epic', rarityMark: '◆',
    color: '#6a38b0', glowColor: 'rgba(106,56,180,0.7)',
    pos: { bottom: '22%', left: '34%' },
    w: 84, h: 100,
    leaveAnim: 'bearLeave',
    idleAnim: 'bearIdle',
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

/* ── RABBIT ── */
function RabbitSVG({ alert, clicked }) {
  return (
    <svg viewBox="0 0 56 72" width="56" height="72" style={{ display:'block' }}>
      {/* Ears — tall and expressive */}
      <ellipse cx="18" cy="14" rx="6" ry="18" fill="#c8b8a8" transform="rotate(-8 18 14)"/>
      <ellipse cx="18" cy="14" rx="3.5" ry="14" fill="#e8a8a8" opacity="0.7" transform="rotate(-8 18 14)"/>
      <ellipse cx="36" cy="12" rx="6" ry="19" fill="#c8b8a8" transform="rotate(6 36 12)"/>
      <ellipse cx="36" cy="12" rx="3.5" ry="15" fill="#e8a8a8" opacity="0.7" transform="rotate(6 36 12)"/>
      {alert && <>
        <ellipse cx="18" cy="10" rx="6" ry="20" fill="#c8b8a8" transform="rotate(-14 18 10)"/>
        <ellipse cx="18" cy="10" rx="3.5" ry="16" fill="#e8a8a8" opacity="0.7" transform="rotate(-14 18 10)"/>
        <ellipse cx="36" cy="8" rx="6" ry="21" fill="#c8b8a8" transform="rotate(12 36 8)"/>
        <ellipse cx="36" cy="8" rx="3.5" ry="17" fill="#e8a8a8" opacity="0.7" transform="rotate(12 36 8)"/>
      </>}
      {/* Body */}
      <ellipse cx="28" cy="52" rx="16" ry="14" fill="#c8b8a8"/>
      <ellipse cx="28" cy="54" rx="12" ry="10" fill="#ddd0c4" opacity="0.6"/>
      {/* Fluffy tail */}
      <circle cx="44" cy="50" r="6" fill="#e8e0d8"/>
      <circle cx="46" cy="48" r="4" fill="#f0ebe6" opacity="0.8"/>
      {/* Head */}
      <circle cx="28" cy="34" r="14" fill="#c8b8a8"/>
      {/* Cheeks */}
      <circle cx="18" cy="38" r="5" fill="#d8c8b8" opacity="0.7"/>
      <circle cx="38" cy="38" r="5" fill="#d8c8b8" opacity="0.7"/>
      {/* Eyes */}
      <circle cx="22" cy="32" r={alert ? 4.5 : 3.5} fill="#1a0808"/>
      <circle cx={alert?'23':'23.5'} cy={alert?'30':'30.5'} r={alert?1.8:1.2} fill="white" opacity="0.7"/>
      <circle cx="34" cy="32" r={alert ? 4.5 : 3.5} fill="#1a0808"/>
      <circle cx={alert?'35':'35.5'} cy={alert?'30':'30.5'} r={alert?1.8:1.2} fill="white" opacity="0.7"/>
      {/* Nose — pink triangle */}
      <path d="M26,38 L28,36 L30,38 Z" fill="#e8908a"/>
      {/* Mouth */}
      <path d="M25,40 Q28,43 31,40" stroke="#a08878" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
      <line x1="28" y1="38" x2="28" y2="41" stroke="#a08878" strokeWidth="0.7"/>
      {/* Whiskers */}
      <line x1="24" y1="39" x2="8" y2="36" stroke="#b0a090" strokeWidth="0.6" opacity="0.5"/>
      <line x1="24" y1="41" x2="8" y2="44" stroke="#b0a090" strokeWidth="0.6" opacity="0.5"/>
      <line x1="32" y1="39" x2="48" y2="36" stroke="#b0a090" strokeWidth="0.6" opacity="0.5"/>
      <line x1="32" y1="41" x2="48" y2="44" stroke="#b0a090" strokeWidth="0.6" opacity="0.5"/>
      {/* Hind legs */}
      <ellipse cx="16" cy="62" rx="8" ry="6" fill="#b0a090" transform="rotate(-5 16 62)"/>
      <ellipse cx="40" cy="62" rx="8" ry="6" fill="#b0a090" transform="rotate(5 40 62)"/>
      {/* Front paws */}
      <ellipse cx="20" cy="64" rx="5" ry="4" fill="#b0a090"/>
      <ellipse cx="36" cy="64" rx="5" ry="4" fill="#b0a090"/>
      {/* Teeth (when alert) */}
      {alert && <>
        <rect x="26" y="40" width="2" height="2.5" rx="0.5" fill="white"/>
        <rect x="29" y="40" width="2" height="2.5" rx="0.5" fill="white"/>
      </>}
    </svg>
  );
}

/* ── FOX ── */
function FoxSVG({ alert, clicked }) {
  const eyeR = alert ? 5.5 : 4;
  return (
    <svg viewBox="0 0 68 84" width="68" height="84" style={{ display:'block' }}>
      {/* Tail — bushy with white tip */}
      <path d="M50,70 C62,56 66,44 62,32 C58,24 50,28 48,38 C46,48 48,60 50,70" fill="#d4621e"/>
      <path d="M53,68 C60,58 63,48 61,38 C60,34 56,33 54,38 C52,46 52,58 53,68" fill="#c85a18" opacity="0.6"/>
      <path d="M62,32 C66,28 68,30 66,36 C64,40 60,38 58,34" fill="#fef0d8"/>
      <path d="M63,33 C65,30 66,32 65,35" fill="white" opacity="0.5"/>
      {/* Body */}
      <ellipse cx="32" cy="62" rx="20" ry="16" fill="#c85a18"/>
      <ellipse cx="32" cy="64" rx="14" ry="10" fill="#d87828" opacity="0.4"/>
      {/* Belly fur */}
      <ellipse cx="32" cy="68" rx="10" ry="6" fill="#fef0d8" opacity="0.5"/>
      {/* Back paws with toe detail */}
      <ellipse cx="18" cy="75" rx="9" ry="5.5" fill="#1a0808" transform="rotate(-8 18 75)"/>
      <ellipse cx="46" cy="75" rx="9" ry="5.5" fill="#1a0808" transform="rotate(8 46 75)"/>
      <circle cx="14" cy="74" r="1.5" fill="#2a1818" opacity="0.5"/>
      <circle cx="18" cy="73" r="1.5" fill="#2a1818" opacity="0.5"/>
      <circle cx="46" cy="73" r="1.5" fill="#2a1818" opacity="0.5"/>
      <circle cx="50" cy="74" r="1.5" fill="#2a1818" opacity="0.5"/>
      {/* Head */}
      <ellipse cx="32" cy="30" rx="18" ry="17" fill="#c85a18"/>
      {/* Ears with inner detail */}
      <polygon points="14,20 8,2 22,14" fill="#c85a18"/>
      <polygon points="15,19 10,5 21,14" fill="#1a0808" opacity="0.85"/>
      <polygon points="15.5,18 11,7 20,14" fill="#c85a18" opacity="0.3"/>
      <polygon points="50,20 56,2 42,14" fill="#c85a18"/>
      <polygon points="49,19 54,5 43,14" fill="#1a0808" opacity="0.85"/>
      <polygon points="49.5,18 53,7 44,14" fill="#c85a18" opacity="0.3"/>
      {/* Cheek ruff */}
      <path d="M14,30 Q10,34 14,38" stroke="#d87828" strokeWidth="1.5" fill="none" opacity="0.5" strokeLinecap="round"/>
      <path d="M50,30 Q54,34 50,38" stroke="#d87828" strokeWidth="1.5" fill="none" opacity="0.5" strokeLinecap="round"/>
      {/* Face mask */}
      <path d="M18,36 Q32,48 46,36 Q44,25 32,25 Q20,25 18,36 Z" fill="#fef0d8"/>
      {/* Eyes with more detail */}
      <ellipse cx="24" cy="28" rx={eyeR} ry={eyeR*0.9} fill="#1a0808"/>
      {alert && <circle cx="24" cy="28" r={eyeR+0.5} fill="none" stroke="#c85a18" strokeWidth="1.5" opacity="0.4"/>}
      <circle cx={alert?'23.2':'25.2'} cy={alert?'26':'27'} r={alert?2:1.4} fill="white" opacity="0.65"/>
      <circle cx={alert?'22':'24'} cy={alert?'27':'28'} r="0.6" fill="white" opacity="0.4"/>
      <ellipse cx="40" cy="28" rx={eyeR} ry={eyeR*0.9} fill="#1a0808"/>
      {alert && <circle cx="40" cy="28" r={eyeR+0.5} fill="none" stroke="#c85a18" strokeWidth="1.5" opacity="0.4"/>}
      <circle cx={alert?'39.2':'41.2'} cy={alert?'26':'27'} r={alert?2:1.4} fill="white" opacity="0.65"/>
      <circle cx={alert?'38':'40'} cy={alert?'27':'28'} r="0.6" fill="white" opacity="0.4"/>
      {/* Brow line */}
      <path d="M20,24 Q24,22.5 28,24" stroke="#a04010" strokeWidth="0.8" fill="none" opacity="0.4" strokeLinecap="round"/>
      <path d="M36,24 Q40,22.5 44,24" stroke="#a04010" strokeWidth="0.8" fill="none" opacity="0.4" strokeLinecap="round"/>
      {/* Nose — shiny */}
      <ellipse cx="32" cy="38" rx="3.5" ry="2.8" fill="#1a0808"/>
      <ellipse cx="31" cy="37" rx="1.2" ry="0.8" fill="white" opacity="0.3"/>
      <path d="M29,40 Q32,43 35,40" stroke="#1a0808" strokeWidth="1" fill="none" strokeLinecap="round"/>
      {/* Whiskers */}
      <line x1="28" y1="38" x2="10" y2="35" stroke="#a06040" strokeWidth="0.7" opacity="0.5"/>
      <line x1="28" y1="40" x2="10" y2="43" stroke="#a06040" strokeWidth="0.7" opacity="0.5"/>
      <line x1="28" y1="39" x2="12" y2="39" stroke="#a06040" strokeWidth="0.5" opacity="0.35"/>
      <line x1="36" y1="38" x2="54" y2="35" stroke="#a06040" strokeWidth="0.7" opacity="0.5"/>
      <line x1="36" y1="40" x2="54" y2="43" stroke="#a06040" strokeWidth="0.7" opacity="0.5"/>
      <line x1="36" y1="39" x2="52" y2="39" stroke="#a06040" strokeWidth="0.5" opacity="0.35"/>
      {/* Front paws */}
      <ellipse cx="22" cy="78" rx="7" ry="4.5" fill="#1a0808"/>
      <ellipse cx="42" cy="78" rx="7" ry="4.5" fill="#1a0808"/>
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
      {/* Branch with texture */}
      <path d="M0,70 Q31,64 62,68" stroke="#5a3a1f" strokeWidth="7" fill="none" strokeLinecap="round"/>
      <path d="M0,70 Q31,66 62,68" stroke="#7a5838" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.4"/>
      <path d="M5,69 Q15,67 25,68" stroke="#4a2a10" strokeWidth="1" fill="none" opacity="0.3"/>
      <path d="M38,66 Q48,65 56,67" stroke="#4a2a10" strokeWidth="1" fill="none" opacity="0.3"/>
      {/* Wings folded with feather detail */}
      <path d="M14,36 Q10,50 14,64" stroke="#6a5020" strokeWidth="3" fill="none" opacity="0.5" strokeLinecap="round"/>
      <path d="M15,40 Q12,48 14,56" stroke="#5a4018" strokeWidth="1.5" fill="none" opacity="0.3" strokeLinecap="round"/>
      <path d="M48,36 Q52,50 48,64" stroke="#6a5020" strokeWidth="3" fill="none" opacity="0.5" strokeLinecap="round"/>
      <path d="M47,40 Q50,48 48,56" stroke="#5a4018" strokeWidth="1.5" fill="none" opacity="0.3" strokeLinecap="round"/>
      {/* Body with chest pattern */}
      <ellipse cx="31" cy="52" rx="17" ry="20" fill="#8a6830"/>
      <ellipse cx="31" cy="56" rx="11" ry="14" fill="#e8d890" opacity="0.7"/>
      {/* Chest chevrons */}
      <g opacity="0.35">
        <path d="M25,48 L31,51 L37,48" stroke="#6a5020" strokeWidth="1" fill="none"/>
        <path d="M25,52 L31,55 L37,52" stroke="#6a5020" strokeWidth="1" fill="none"/>
        <path d="M25,56 L31,59 L37,56" stroke="#6a5020" strokeWidth="1" fill="none"/>
        <path d="M26,60 L31,63 L36,60" stroke="#6a5020" strokeWidth="1" fill="none"/>
      </g>
      {/* Head */}
      <ellipse cx="31" cy="26" rx="16" ry="16" fill="#8a6830"/>
      {/* Facial disc */}
      <ellipse cx="31" cy="28" rx="13" ry="13" fill="#c09850" opacity="0.5"/>
      <path d="M18,28 Q31,38 44,28" stroke="#b08840" strokeWidth="0.8" fill="none" opacity="0.35"/>
      {/* Ear tufts with detail */}
      <polygon points="17,14 12,1 21,10" fill="#8a6830"/>
      <polygon points="17,13 13,4 20,10" fill="#4a3010" opacity="0.7"/>
      <line x1="14" y1="4" x2="18" y2="11" stroke="#6a5020" strokeWidth="0.6" opacity="0.5"/>
      <polygon points="45,14 50,1 41,10" fill="#8a6830"/>
      <polygon points="45,13 49,4 42,10" fill="#4a3010" opacity="0.7"/>
      <line x1="48" y1="4" x2="44" y2="11" stroke="#6a5020" strokeWidth="0.6" opacity="0.5"/>
      {/* Left eye — facial disc ring */}
      <circle cx="22" cy="26" r={eyeOuter+1.5} fill="none" stroke="#c09850" strokeWidth="1" opacity="0.4"/>
      <circle cx="22" cy="26" r={eyeOuter} fill="#1a0808"/>
      <circle cx="22" cy="26" r={eyeIris} fill="#e8b020"/>
      <circle cx="22" cy="26" r={eyeIris*0.85} fill="#d4a018" opacity="0.5"/>
      <circle cx="22" cy="26" r={eyePupil} fill="#1a0808"/>
      <circle cx={alert?'23':'23.5'} cy={alert?'24':'24.5'} r="1.8" fill="white" opacity="0.75"/>
      <circle cx="21" cy="27.5" r="0.7" fill="white" opacity="0.3"/>
      {/* Right eye */}
      <circle cx="40" cy="26" r={eyeOuter+1.5} fill="none" stroke="#c09850" strokeWidth="1" opacity="0.4"/>
      <circle cx="40" cy="26" r={eyeOuter} fill="#1a0808"/>
      <circle cx="40" cy="26" r={eyeIris} fill="#e8b020"/>
      <circle cx="40" cy="26" r={eyeIris*0.85} fill="#d4a018" opacity="0.5"/>
      <circle cx="40" cy="26" r={eyePupil} fill="#1a0808"/>
      <circle cx={alert?'41':'41.5'} cy={alert?'24':'24.5'} r="1.8" fill="white" opacity="0.75"/>
      <circle cx="39" cy="27.5" r="0.7" fill="white" opacity="0.3"/>
      {/* Beak — layered */}
      <polygon points="31,31 27,38 35,38" fill="#e8a820"/>
      <polygon points="31,34 28,37 34,37" fill="#c88010" opacity="0.6"/>
      <polygon points="31,32 29,35 33,35" fill="#f0b830" opacity="0.4"/>
      {/* Talons with detail */}
      <path d="M16,70 Q18,67 20,69" stroke="#5a3010" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M20,70 Q22,67 24,69" stroke="#5a3010" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M38,70 Q40,67 42,69" stroke="#5a3010" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M42,70 Q44,67 46,69" stroke="#5a3010" strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

/* ── DEER ── */
function DeerSVG({ alert, clicked }) {
  return (
    <svg viewBox="0 0 80 96" width="80" height="96" style={{ display:'block' }}>
      {/* Antlers */}
      <g opacity="0.9">
        <path d="M28,18 C24,10 20,4 16,0" stroke="#7a6040" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M22,8 C18,6 14,4 12,6" stroke="#7a6040" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M26,14 C22,12 18,14 16,12" stroke="#7a6040" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        <path d="M52,18 C56,10 60,4 64,0" stroke="#7a6040" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M58,8 C62,6 66,4 68,6" stroke="#7a6040" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M54,14 C58,12 62,14 64,12" stroke="#7a6040" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      </g>
      {/* Ears */}
      <ellipse cx="22" cy="24" rx="6" ry="10" fill="#b08858" transform="rotate(-20 22 24)"/>
      <ellipse cx="22" cy="24" rx="3.5" ry="7" fill="#d8a878" opacity="0.6" transform="rotate(-20 22 24)"/>
      <ellipse cx="58" cy="24" rx="6" ry="10" fill="#b08858" transform="rotate(20 58 24)"/>
      <ellipse cx="58" cy="24" rx="3.5" ry="7" fill="#d8a878" opacity="0.6" transform="rotate(20 58 24)"/>
      {/* Neck */}
      <path d="M34,44 C34,52 32,58 34,64" stroke="#b08858" strokeWidth="14" fill="none" strokeLinecap="round"/>
      <path d="M46,44 C46,52 48,58 46,64" stroke="#b08858" strokeWidth="14" fill="none" strokeLinecap="round"/>
      {/* Body */}
      <ellipse cx="40" cy="72" rx="24" ry="16" fill="#b08858"/>
      <ellipse cx="40" cy="74" rx="18" ry="12" fill="#c8a878" opacity="0.5"/>
      {/* White belly */}
      <ellipse cx="40" cy="78" rx="14" ry="7" fill="#f0e8d8" opacity="0.5"/>
      {/* Legs */}
      <rect x="20" y="82" width="6" height="12" rx="2" fill="#8a6838"/>
      <rect x="54" y="82" width="6" height="12" rx="2" fill="#8a6838"/>
      <rect x="28" y="84" width="5" height="10" rx="2" fill="#8a6838"/>
      <rect x="48" y="84" width="5" height="10" rx="2" fill="#8a6838"/>
      {/* Hooves */}
      <rect x="20" y="92" width="6" height="3" rx="1" fill="#3a2010"/>
      <rect x="54" y="92" width="6" height="3" rx="1" fill="#3a2010"/>
      <rect x="28" y="92" width="5" height="3" rx="1" fill="#3a2010"/>
      <rect x="48" y="92" width="5" height="3" rx="1" fill="#3a2010"/>
      {/* Tail */}
      <ellipse cx="64" cy="70" rx="4" ry="6" fill="#c8a878"/>
      <ellipse cx="65" cy="69" rx="2.5" ry="4" fill="#f0e8d8" opacity="0.7"/>
      {/* Head */}
      <ellipse cx="40" cy="32" rx="14" ry="16" fill="#b08858"/>
      {/* Forehead light patch */}
      <ellipse cx="40" cy="26" rx="6" ry="4" fill="#c8a878" opacity="0.4"/>
      {/* Muzzle */}
      <ellipse cx="40" cy="40" rx="8" ry="6" fill="#c8a878"/>
      {/* Eyes — large and gentle */}
      <ellipse cx="32" cy="30" rx={alert?5:4} ry={alert?5.5:4.5} fill="#1a0808"/>
      <circle cx="33" cy={alert?'28':'28.5'} r={alert?2:1.5} fill="white" opacity="0.6"/>
      <circle cx="31.5" cy="30" r="0.6" fill="white" opacity="0.3"/>
      <ellipse cx="48" cy="30" rx={alert?5:4} ry={alert?5.5:4.5} fill="#1a0808"/>
      <circle cx="49" cy={alert?'28':'28.5'} r={alert?2:1.5} fill="white" opacity="0.6"/>
      <circle cx="47.5" cy="30" r="0.6" fill="white" opacity="0.3"/>
      {/* Eyelashes */}
      <path d="M28,28 Q30,26 32,27" stroke="#6a4828" strokeWidth="0.7" fill="none" opacity="0.5"/>
      <path d="M48,27 Q50,26 52,28" stroke="#6a4828" strokeWidth="0.7" fill="none" opacity="0.5"/>
      {/* Nose */}
      <ellipse cx="40" cy="42" rx="4" ry="2.5" fill="#3a2010"/>
      <ellipse cx="39" cy="41.5" rx="1.2" ry="0.7" fill="white" opacity="0.25"/>
      {/* Spots */}
      <circle cx="30" cy="74" r="2" fill="#c8a878" opacity="0.5"/>
      <circle cx="46" cy="70" r="1.8" fill="#c8a878" opacity="0.5"/>
      <circle cx="52" cy="76" r="1.5" fill="#c8a878" opacity="0.5"/>
      <circle cx="36" cy="68" r="1.3" fill="#c8a878" opacity="0.4"/>
      {/* Alert brows */}
      {alert && <>
        <path d="M28,26 Q32,24 36,26" stroke="#1a0808" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <path d="M44,26 Q48,24 52,26" stroke="#1a0808" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      </>}
    </svg>
  );
}

/* ── BEAR ── */
function BearSVG({ alert, clicked }) {
  return (
    <svg viewBox="0 0 84 100" width="84" height="100" style={{ display:'block' }}>
      {/* Back legs */}
      <ellipse cx="18" cy="90" rx="15" ry="9" fill="#3a1a04" transform="rotate(-8 18 90)"/>
      <ellipse cx="66" cy="90" rx="15" ry="9" fill="#3a1a04" transform="rotate(8 66 90)"/>
      {/* Body with fur texture */}
      <ellipse cx="42" cy="72" rx="30" ry="26" fill="#4a2808"/>
      <ellipse cx="42" cy="78" rx="18" ry="17" fill="#7a4828" opacity="0.65"/>
      {/* Fur highlights */}
      <path d="M20,65 Q22,60 20,55" stroke="#5a3818" strokeWidth="1.2" fill="none" opacity="0.4"/>
      <path d="M64,65 Q62,60 64,55" stroke="#5a3818" strokeWidth="1.2" fill="none" opacity="0.4"/>
      <path d="M42,50 Q44,55 42,60" stroke="#5a3818" strokeWidth="1" fill="none" opacity="0.3"/>
      {/* Arms */}
      <ellipse cx="12" cy="68" rx="10" ry="8" fill="#4a2808"/>
      <ellipse cx="72" cy="68" rx="10" ry="8" fill="#4a2808"/>
      {/* Front paws with pads */}
      <ellipse cx="11" cy="76" rx="9" ry="5.5" fill="#2a1004"/>
      <circle cx="8" cy="74" r="1.5" fill="#3a2010" opacity="0.5"/>
      <circle cx="11" cy="73" r="1.5" fill="#3a2010" opacity="0.5"/>
      <circle cx="14" cy="74" r="1.5" fill="#3a2010" opacity="0.5"/>
      <ellipse cx="73" cy="76" rx="9" ry="5.5" fill="#2a1004"/>
      <circle cx="70" cy="74" r="1.5" fill="#3a2010" opacity="0.5"/>
      <circle cx="73" cy="73" r="1.5" fill="#3a2010" opacity="0.5"/>
      <circle cx="76" cy="74" r="1.5" fill="#3a2010" opacity="0.5"/>
      {/* Head */}
      <ellipse cx="42" cy="38" rx="25" ry="22" fill="#4a2808"/>
      {/* Head fur texture */}
      <path d="M24,28 Q26,24 24,20" stroke="#5a3818" strokeWidth="0.8" fill="none" opacity="0.3"/>
      <path d="M60,28 Q58,24 60,20" stroke="#5a3818" strokeWidth="0.8" fill="none" opacity="0.3"/>
      {/* Ears with inner detail */}
      <circle cx="21" cy="20" r="11" fill="#4a2808"/>
      <circle cx="21" cy="20" r="7" fill="#2a1004"/>
      <circle cx="21" cy="20" r="4.5" fill="#3a1808" opacity="0.5"/>
      <circle cx="63" cy="20" r="11" fill="#4a2808"/>
      <circle cx="63" cy="20" r="7" fill="#2a1004"/>
      <circle cx="63" cy="20" r="4.5" fill="#3a1808" opacity="0.5"/>
      {/* Muzzle — more detailed */}
      <ellipse cx="42" cy="48" rx="13" ry="10" fill="#7a4828"/>
      <ellipse cx="42" cy="50" rx="9" ry="6" fill="#8a5838" opacity="0.5"/>
      <ellipse cx="42" cy="43" rx="5.5" ry="4.5" fill="#1a0808"/>
      <ellipse cx="41" cy="42" rx="1.8" ry="1" fill="white" opacity="0.25"/>
      {/* Eyebrow lines (alert) */}
      {alert && <>
        <path d="M29,26 Q35,22 41,26" stroke="#1a0808" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M43,26 Q49,22 55,26" stroke="#1a0808" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      </>}
      {/* Eyes with more depth */}
      <circle cx="32" cy="31" r={alert?5.5:4.5} fill="#1a0808"/>
      <circle cx="33.5" cy={alert?'29':'29.5'} r={alert?2:1.8} fill="white" opacity="0.55"/>
      <circle cx="31.5" cy="31.5" r="0.7" fill="white" opacity="0.25"/>
      <circle cx="52" cy="31" r={alert?5.5:4.5} fill="#1a0808"/>
      <circle cx="53.5" cy={alert?'29':'29.5'} r={alert?2:1.8} fill="white" opacity="0.55"/>
      <circle cx="51.5" cy="31.5" r="0.7" fill="white" opacity="0.25"/>
      {/* Mouth */}
      <path d={alert?"M36,52 Q42,57 48,52":"M37,52 Q42,56 47,52"} stroke="#1a0808" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {alert && <circle cx="42" cy="53" r="2.5" fill="#c85858" opacity="0.6"/>}
      {/* Cheek ruff */}
      <path d="M18,42 Q16,46 18,50" stroke="#5a3818" strokeWidth="1" fill="none" opacity="0.3"/>
      <path d="M66,42 Q68,46 66,50" stroke="#5a3818" strokeWidth="1" fill="none" opacity="0.3"/>
    </svg>
  );
}

/* ── CAT (LEGENDARY) ── */
function CatSVG({ alert, clicked }) {
  const pupilW = alert ? 3.5 : 2.2;
  return (
    <svg viewBox="0 0 68 84" width="68" height="84" style={{ display:'block' }}>
      {/* Branch with knots */}
      <path d="M0,74 Q34,68 68,72" stroke="#5a3a1f" strokeWidth="6" fill="none" strokeLinecap="round"/>
      <path d="M0,74 Q34,70 68,72" stroke="#7a5838" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.4"/>
      <circle cx="20" cy="72" r="2" fill="#4a2a10" opacity="0.4"/>
      <circle cx="48" cy="71" r="1.5" fill="#4a2a10" opacity="0.3"/>
      {/* Tail curled — animated feel with stripes */}
      <path d="M50,70 C66,58 70,44 64,30 C60,22 52,26 50,36 C48,46 50,58 50,70" fill="#c0a888"/>
      <path d="M64,30 C68,26 70,28 68,34 C66,38 62,36 60,32" fill="#e8d8c0"/>
      <path d="M52,62 Q56,58 54,54" stroke="#a89070" strokeWidth="1.2" fill="none" opacity="0.4"/>
      <path d="M54,50 Q58,46 56,42" stroke="#a89070" strokeWidth="1.2" fill="none" opacity="0.4"/>
      <path d="M58,38 Q62,34 60,30" stroke="#a89070" strokeWidth="1" fill="none" opacity="0.35"/>
      {/* Body */}
      <ellipse cx="30" cy="60" rx="18" ry="14" fill="#c8b898"/>
      <ellipse cx="30" cy="62" rx="12" ry="9" fill="#d4c4a8" opacity="0.4"/>
      {/* Belly */}
      <ellipse cx="30" cy="66" rx="8" ry="5" fill="#e0d4c0" opacity="0.4"/>
      {/* Head */}
      <circle cx="30" cy="32" r="18" fill="#c8b898"/>
      {/* Ears with pink inner */}
      <polygon points="13,20 7,2 22,14" fill="#c8b898"/>
      <polygon points="14,19 9,5 21,14" fill="#e8b0b8" opacity="0.85"/>
      <polygon points="14.5,18 10,7 20,14" fill="#d0a0a8" opacity="0.4"/>
      <polygon points="47,20 53,2 38,14" fill="#c8b898"/>
      <polygon points="46,19 51,5 39,14" fill="#e8b0b8" opacity="0.85"/>
      <polygon points="46.5,18 50,7 40,14" fill="#d0a0a8" opacity="0.4"/>
      {/* Tabby marks — more defined */}
      <path d="M16,26 Q21,28 21,33" stroke="#a89070" strokeWidth="1.2" fill="none" opacity="0.45"/>
      <path d="M14,30 Q18,31 19,35" stroke="#a89070" strokeWidth="0.8" fill="none" opacity="0.3"/>
      <path d="M44,26 Q39,28 39,33" stroke="#a89070" strokeWidth="1.2" fill="none" opacity="0.45"/>
      <path d="M46,30 Q42,31 41,35" stroke="#a89070" strokeWidth="0.8" fill="none" opacity="0.3"/>
      {/* Forehead M mark */}
      <path d="M24,22 L27,20 L30,24 L33,20 L36,22" stroke="#a89070" strokeWidth="0.8" fill="none" opacity="0.35" strokeLinecap="round"/>
      {/* Eyes — legendary blue with depth */}
      <circle cx="21" cy="30" r="7" fill="#1a0808"/>
      <circle cx="21" cy="30" r="5.8" fill="#4a98e0"/>
      <circle cx="21" cy="30" r="5" fill="#5aa8f0" opacity="0.5"/>
      <ellipse cx="21" cy="30" rx={pupilW} ry="4.5" fill="#1a0808"/>
      <circle cx="22.5" cy="28.5" r="1.6" fill="white" opacity="0.85"/>
      <circle cx="20" cy="31" r="0.6" fill="white" opacity="0.35"/>
      <circle cx="39" cy="30" r="7" fill="#1a0808"/>
      <circle cx="39" cy="30" r="5.8" fill="#4a98e0"/>
      <circle cx="39" cy="30" r="5" fill="#5aa8f0" opacity="0.5"/>
      <ellipse cx="39" cy="30" rx={pupilW} ry="4.5" fill="#1a0808"/>
      <circle cx="40.5" cy="28.5" r="1.6" fill="white" opacity="0.85"/>
      <circle cx="38" cy="31" r="0.6" fill="white" opacity="0.35"/>
      {/* Alert — wide round pupils */}
      {alert && <>
        <circle cx="21" cy="30" r="4.2" fill="#1a0808"/>
        <circle cx="39" cy="30" r="4.2" fill="#1a0808"/>
        <circle cx="22.5" cy="28.5" r="1.6" fill="white" opacity="0.85"/>
        <circle cx="40.5" cy="28.5" r="1.6" fill="white" opacity="0.85"/>
      </>}
      {/* Nose */}
      <path d="M27,38 L30,35 L33,38 Z" fill="#f0a0b0"/>
      <path d="M28.5,37 L30,36 L31.5,37" fill="#e8909a" opacity="0.6"/>
      <path d="M30,38 L30,42 M30,42 Q27,44 26,45 M30,42 Q33,44 34,45" stroke="#a07888" strokeWidth="0.9" fill="none" strokeLinecap="round"/>
      {/* Whiskers — longer, more delicate */}
      <line x1="24" y1="39" x2="2"  y2="34" stroke="#b0a090" strokeWidth="0.6" opacity="0.55"/>
      <line x1="24" y1="41" x2="2"  y2="46" stroke="#b0a090" strokeWidth="0.6" opacity="0.55"/>
      <line x1="24" y1="40" x2="4"  y2="40" stroke="#b0a090" strokeWidth="0.5" opacity="0.4"/>
      <line x1="36" y1="39" x2="58" y2="34" stroke="#b0a090" strokeWidth="0.6" opacity="0.55"/>
      <line x1="36" y1="41" x2="58" y2="46" stroke="#b0a090" strokeWidth="0.6" opacity="0.55"/>
      <line x1="36" y1="40" x2="56" y2="40" stroke="#b0a090" strokeWidth="0.5" opacity="0.4"/>
      {/* Front paws with toe beans */}
      <ellipse cx="18" cy="72" rx="8" ry="5" fill="#b8a888"/>
      <circle cx="15" cy="71" r="1.2" fill="#c8b898" opacity="0.5"/>
      <circle cx="18" cy="70" r="1.2" fill="#c8b898" opacity="0.5"/>
      <circle cx="21" cy="71" r="1.2" fill="#c8b898" opacity="0.5"/>
      <ellipse cx="38" cy="72" rx="8" ry="5" fill="#b8a888"/>
      <circle cx="35" cy="71" r="1.2" fill="#c8b898" opacity="0.5"/>
      <circle cx="38" cy="70" r="1.2" fill="#c8b898" opacity="0.5"/>
      <circle cx="41" cy="71" r="1.2" fill="#c8b898" opacity="0.5"/>
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
              {type==='fox'?'Still there?':type==='owl'?'Who...?':type==='bear'?'Hmm?':type==='deer'?'*looks up*':type==='rabbit'?'*wiggles nose*':'...'}
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
        {type==='rabbit' && <RabbitSVG alert={isAlert} clicked={isClicked}/>}
        {type==='fox'    && <FoxSVG  alert={isAlert} clicked={isClicked}/>}
        {type==='owl'    && <OwlSVG  alert={isAlert} clicked={isClicked}/>}
        {type==='deer'   && <DeerSVG alert={isAlert} clicked={isClicked}/>}
        {type==='bear'   && <BearSVG alert={isAlert} clicked={isClicked}/>}
        {type==='cat'    && <CatSVG  alert={isAlert} clicked={isClicked}/>}
      </div>

      <style>{`
        @keyframes guestEnter {
          0%   { transform: scale(0) translateY(16px); opacity: 0; }
          65%  { transform: scale(1.1) translateY(-4px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }

        /* ── Fox: tail wag + breathing ── */
        @keyframes foxIdle {
          0%,100% { transform: translateY(0) rotate(0deg) scaleY(1); }
          20%     { transform: translateY(-3px) rotate(-1.5deg) scaleY(1.01); }
          40%     { transform: translateY(-5px) rotate(0.5deg) scaleY(1); }
          60%     { transform: translateY(-3px) rotate(-0.8deg) scaleY(1.01); }
          80%     { transform: translateY(-1px) rotate(1deg) scaleY(1); }
        }

        /* ── Owl: head tilt + blink ── */
        @keyframes owlIdle {
          0%,100% { transform: translateY(0) rotate(0deg); }
          15%     { transform: translateY(-2px) rotate(-3deg); }
          30%     { transform: translateY(-4px) rotate(0deg); }
          50%     { transform: translateY(-3px) rotate(3deg); }
          70%     { transform: translateY(-1px) rotate(-1deg); }
          88%     { transform: translateY(0) scaleY(1); }
          91%     { transform: scaleY(0.92); }
          94%     { transform: scaleY(1); }
          96%     { transform: scaleY(0.94); }
          98%     { transform: scaleY(1); }
        }

        /* ── Deer: gentle sway + ear flick ── */
        @keyframes deerIdle {
          0%,100% { transform: translateY(0) rotate(0deg); }
          25%     { transform: translateY(-4px) rotate(-1deg); }
          50%     { transform: translateY(-6px) rotate(0.5deg); }
          75%     { transform: translateY(-3px) rotate(-0.5deg); }
        }

        /* ── Bear: heavy breathing + sway ── */
        @keyframes bearIdle {
          0%,100% { transform: translateY(0) scaleY(1) rotate(0deg); }
          30%     { transform: translateY(-3px) scaleY(1.015) rotate(-0.5deg); }
          60%     { transform: translateY(-5px) scaleY(1) rotate(0.5deg); }
          80%     { transform: translateY(-2px) scaleY(1.01) rotate(0deg); }
        }

        /* ── Rabbit: nibble + nose wiggle ── */
        @keyframes rabbitNibble {
          0%,100% { transform: translateY(0) rotate(0deg) scaleX(1); }
          15%     { transform: translateY(-2px) rotate(-1deg) scaleX(1); }
          25%     { transform: translateY(-4px) rotate(0deg) scaleX(0.98); }
          35%     { transform: translateY(-3px) rotate(1deg) scaleX(1.02); }
          50%     { transform: translateY(-5px) rotate(-0.5deg) scaleX(0.98); }
          65%     { transform: translateY(-3px) rotate(0.5deg) scaleX(1.02); }
          80%     { transform: translateY(-1px) rotate(0deg) scaleX(1); }
        }

        @keyframes catShimmer {
          0%,100% { transform: translateY(0) rotate(0.5deg); filter: drop-shadow(0 2px 6px rgba(0,0,0,0.25)); }
          30%     { transform: translateY(-3px) rotate(-0.5deg); filter: drop-shadow(0 3px 10px rgba(200,160,20,0.2)) drop-shadow(0 2px 6px rgba(0,0,0,0.25)); }
          50%     { transform: translateY(-5px) rotate(0deg); filter: drop-shadow(0 4px 12px rgba(200,160,20,0.35)) drop-shadow(0 2px 6px rgba(0,0,0,0.25)); }
          70%     { transform: translateY(-3px) rotate(0.3deg); filter: drop-shadow(0 3px 10px rgba(200,160,20,0.2)) drop-shadow(0 2px 6px rgba(0,0,0,0.25)); }
        }
        @keyframes catStar {
          0%,100% { opacity: 0.15; transform: scale(0.6); }
          50%     { opacity: 0.9; transform: scale(1.5); }
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
          30%  { transform: translateX(-30px) scaleX(1) translateY(-10px); opacity: 1; }
          60%  { transform: translateX(-120px) scaleX(-1) translateY(-5px) rotate(-5deg); opacity: 0.7; }
          100% { transform: translateX(-260px) scaleX(-1) translateY(0); opacity: 0; }
        }
        @keyframes owlFly {
          0%   { transform: scale(1) translateY(0); opacity: 1; }
          20%  { transform: scale(1.05) translateY(-10px) rotate(-5deg); opacity: 1; }
          50%  { transform: scale(1.1) translateY(-60px) rotate(-15deg); opacity: 0.8; }
          100% { transform: scale(0.3) translateY(-200px) rotate(20deg); opacity: 0; }
        }
        @keyframes bearLeave {
          0%   { transform: translateX(0) rotate(0deg); opacity: 1; }
          40%  { transform: translateX(40px) rotate(2deg); opacity: 0.9; }
          100% { transform: translateX(200px) rotate(5deg); opacity: 0; }
        }
        @keyframes deerLeap {
          0%   { transform: translateX(0) translateY(0); opacity: 1; }
          30%  { transform: translateX(40px) translateY(-40px) rotate(-5deg); opacity: 1; }
          60%  { transform: translateX(120px) translateY(-20px) rotate(0deg); opacity: 0.7; }
          100% { transform: translateX(260px) translateY(0) rotate(5deg); opacity: 0; }
        }
        @keyframes rabbitHop {
          0%   { transform: translateX(0) translateY(0); opacity: 1; }
          20%  { transform: translateX(-20px) translateY(-30px); opacity: 1; }
          35%  { transform: translateX(-50px) translateY(0); opacity: 1; }
          55%  { transform: translateX(-80px) translateY(-25px); opacity: 0.8; }
          70%  { transform: translateX(-120px) translateY(0); opacity: 0.6; }
          100% { transform: translateX(-200px) translateY(-20px); opacity: 0; }
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
