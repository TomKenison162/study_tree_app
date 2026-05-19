/* All CSS keyframes used by tree components. Rendered once by TreeScene. */
const KEYFRAMES = `
  @keyframes grassSway {
    0%        { transform: rotate(0deg) scaleY(1); }
    15%       { transform: rotate(3.5deg) scaleY(1.01); }
    38%       { transform: rotate(-2.5deg) scaleY(0.99); }
    60%       { transform: rotate(2.8deg) scaleY(1.01); }
    80%       { transform: rotate(-1.5deg) scaleY(1); }
    100%      { transform: rotate(0deg) scaleY(1); }
  }
  @keyframes canopySway {
    0%, 100% { transform: translateX(0px) rotate(0deg) scale(1); }
    25%      { transform: translateX(1.8px) rotate(0.35deg) scale(1.004); }
    55%      { transform: translateX(-1.2px) rotate(-0.25deg) scale(0.997); }
    78%      { transform: translateX(1.0px) rotate(0.15deg) scale(1.002); }
  }
  @keyframes wisteriaChainSway {
    0%, 100% { transform: scaleY(1) translateX(0px) rotate(0deg); }
    18%      { transform: scaleY(1.01) translateX(3.5px) rotate(0.9deg); }
    42%      { transform: scaleY(0.99) translateX(-2.5px) rotate(-0.6deg); }
    68%      { transform: scaleY(1.01) translateX(2.8px) rotate(0.5deg); }
    85%      { transform: scaleY(1) translateX(-1px) rotate(-0.2deg); }
  }
  @keyframes crystalShimmer {
    0%, 100% { filter: brightness(1) saturate(1); }
    20%      { filter: brightness(1.25) saturate(1.2); }
    45%      { filter: brightness(0.92) saturate(1.08); }
    70%      { filter: brightness(1.18) saturate(1.14); }
    88%      { filter: brightness(1.05) saturate(1.03); }
  }
  @keyframes twinkle {
    0%, 100% { opacity: 0.25; transform: scale(1); }
    40%      { opacity: 1;    transform: scale(1.15); }
    65%      { opacity: 0.6;  transform: scale(0.95); }
  }
  @keyframes pineTierShiver {
    0%, 100% { transform: translateX(0) scaleX(1); }
    20%      { transform: translateX(0.8px) scaleX(1.003); }
    50%      { transform: translateX(-0.5px) scaleX(0.998); }
    75%      { transform: translateX(0.6px) scaleX(1.002); }
  }
  @keyframes crownStarSpin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes fogWisp {
    0%, 100% { transform: translateX(0) scaleX(1); opacity: 0.18; }
    30%      { transform: translateX(6px) scaleX(1.06); opacity: 0.25; }
    65%      { transform: translateX(-4px) scaleX(0.95); opacity: 0.14; }
  }
  @keyframes mossBreath {
    0%, 100% { opacity: 0.55; }
    50%      { opacity: 0.38; }
  }
  @keyframes bonsaiPuffBreathe {
    0%, 100% { transform: scale(1); }
    40%      { transform: scale(1.018); }
    70%      { transform: scale(0.985); }
  }
  @keyframes birchShimmer {
    0%, 100% { opacity: 0.55; filter: brightness(1); }
    35%      { opacity: 0.75; filter: brightness(1.12); }
    70%      { opacity: 0.45; filter: brightness(0.95); }
  }
  @keyframes chainBob {
    0%, 100% { transform: scaleY(1) translateY(0px); }
    30%      { transform: scaleY(1.015) translateY(1.5px); }
    60%      { transform: scaleY(0.99) translateY(-0.8px); }
  }
  @keyframes baobabCreak {
    0%, 100% { transform: rotate(0deg) translateX(0px); }
    25%      { transform: rotate(0.6deg) translateX(1.2px); }
    60%      { transform: rotate(-0.4deg) translateX(-0.8px); }
    85%      { transform: rotate(0.25deg) translateX(0.5px); }
  }
  @keyframes crystalFloat {
    0%, 100% { transform: translateY(0px); }
    40%      { transform: translateY(-1.5px); }
    70%      { transform: translateY(0.8px); }
  }
  @keyframes crystalPulse {
    0%, 100% { filter: brightness(1) saturate(1) drop-shadow(0 0 2px rgba(100,200,255,0.3)); }
    35%      { filter: brightness(1.3) saturate(1.25) drop-shadow(0 0 6px rgba(150,220,255,0.7)); }
    65%      { filter: brightness(0.88) saturate(1.1) drop-shadow(0 0 1px rgba(100,200,255,0.2)); }
  }
  @keyframes bambooLean {
    0%, 100% { transform: rotate(0deg) skewX(0deg); }
    30%      { transform: rotate(1.2deg) skewX(0.4deg); }
    65%      { transform: rotate(-0.8deg) skewX(-0.3deg); }
  }
  @keyframes bambooLeafFlutter {
    0%, 100% { transform: rotate(0deg) scaleX(1); }
    20%      { transform: rotate(4deg) scaleX(1.04); }
    55%      { transform: rotate(-3deg) scaleX(0.97); }
    80%      { transform: rotate(2deg) scaleX(1.02); }
  }
  @keyframes frondFlex {
    0%, 100% { transform: rotate(0deg) scaleY(1); }
    25%      { transform: rotate(1.5deg) scaleY(1.02); }
    55%      { transform: rotate(-1deg) scaleY(0.98); }
    80%      { transform: rotate(0.8deg) scaleY(1.01); }
  }
  @keyframes cypressWave {
    0%, 100% { transform: translateX(0px) scaleX(1); }
    30%      { transform: translateX(1px) scaleX(1.006); }
    65%      { transform: translateX(-0.8px) scaleX(0.995); }
  }
`;

export default KEYFRAMES;
