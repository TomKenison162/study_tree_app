import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ════════════════════════════════════════════════════════════════════
   HELPERS
   ════════════════════════════════════════════════════════════════════ */

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

const c01 = (v, a, b) => Math.max(0, Math.min(1, (v - a) / (b - a)));

/* ════════════════════════════════════════════════════════════════════
   FOLIAGE
   ════════════════════════════════════════════════════════════════════ */

const FOLIAGE = [
  { cx:155, cy:195, r:70, v:[8,-10,14,-6,10,-14,8,-10,12],     ph:0 },
  { cx:445, cy:210, r:76, v:[-8,12,-6,16,-8,6,14,-7,10],         ph:0 },
  { cx:238, cy:78,  r:84, v:[12,-10,16,-12,10,-16,14,-10,12,-6], ph:0 },
  { cx:360, cy:80,  r:72, v:[-8,12,-6,15,-8,6,12,-7,8,-10],      ph:0 },
  { cx:178, cy:248, r:54, v:[8,-6,10,-8,6,-10,8],                ph:0 },
  { cx:390, cy:255, r:58, v:[-6,10,-8,14,-6,8,-12,7],            ph:0 },
  { cx:298, cy:160, r:90, v:[10,-12,14,-10,12,-14,10,-8,12,-10], ph:0 },
  { cx:112, cy:178, r:64, v:[8,-6,12,-8,6,-10,8,-6,10],          ph:1 },
  { cx:468, cy:200, r:67, v:[-6,12,-8,10,-6,14,-8,6,10],         ph:1 },
  { cx:215, cy:62,  r:78, v:[12,-8,16,-10,8,-15,12,-8,10,-6],    ph:1 },
  { cx:375, cy:64,  r:70, v:[-8,12,-6,15,-8,6,12,-7,8,-10],      ph:1 },
  { cx:158, cy:238, r:50, v:[6,-8,10,-6,8,-10,6],                ph:1 },
  { cx:414, cy:248, r:54, v:[-6,10,-8,12,-6,8,-10],              ph:1 },
  { cx:56,  cy:268, r:48, v:[8,-6,10,-8,6],                      ph:1 },
  { cx:510, cy:148, r:52, v:[-6,10,-8,12,-6,8],                  ph:1 },
  { cx:140, cy:105, r:60, v:[10,-8,14,-10,8,-15,12],             ph:1 },
  { cx:290, cy:236, r:46, v:[6,-8,10,-6,8,-10],                  ph:1 },
  { cx:298, cy:128, r:62, v:[8,-10,12,-8,10,-12,8,-6,10],        ph:1 },
  { cx:92,  cy:155, r:55, v:[8,-6,10,-8,6,-10,8],                ph:2 },
  { cx:490, cy:184, r:58, v:[-6,10,-8,12,-6,8,-10],              ph:2 },
  { cx:182, cy:44,  r:64, v:[10,-8,15,-10,8,-15,12,-6],          ph:2 },
  { cx:350, cy:44,  r:60, v:[-8,12,-6,15,-8,6,12,-7],            ph:2 },
  { cx:42,  cy:256, r:42, v:[6,-6,10,-8,6],                      ph:2 },
  { cx:524, cy:132, r:45, v:[-6,8,-6,10,-6],                     ph:2 },
  { cx:118, cy:90,  r:52, v:[8,-8,12,-10,8,-12,8],               ph:2 },
  { cx:386, cy:42,  r:50, v:[-6,10,-8,12,-6,8],                  ph:2 },
  { cx:278, cy:226, r:38, v:[6,-8,8,-6,8,-8],                    ph:2 },
  { cx:314, cy:260, r:35, v:[-6,8,-6,10,-6],                     ph:2 },
  { cx:248, cy:108, r:48, v:[8,-6,10,-8,6,-10,8],                ph:2 },
  { cx:340, cy:200, r:46, v:[-6,10,-8,8,-6,10,-6],               ph:2 },
];
const BLOBS_BASE = FOLIAGE.map(f => ({ ...f, path: makeBlob(f.cx, f.cy, f.r, f.v) }));

const TWIG_DASH = 90;
const TWIGS = [
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

const FINE_TWIG_DASH = 50;
const FINE_TWIGS = [
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

const RAYS = Array.from({ length: 20 }, (_, i) => i * (360 / 20));

const LEAVES = Array.from({ length: 14 }, (_, i) => ({
  id: i, x: 5 + i * 6.5, delay: i * 0.7, dur: 5 + i * 0.4,
  size: i % 3 === 0 ? 8 : i % 3 === 1 ? 5 : 6,
  col: ['#7a9d6a', '#c4965a', '#e5b899', '#9bb38a', '#d8c19a'][i % 5],
}));

const GLOW_ORBS = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  x: 8 + (i * 31.7) % 84,
  delay: (i * 0.7) % 8,
  dur: 6 + (i % 5),
  size: i % 3 === 0 ? 5 : i % 3 === 1 ? 3.5 : 4,
}));

/* ════════════════════════════════════════════════════════════════════
   THEMES — now with Willow and Jacaranda added
   ════════════════════════════════════════════════════════════════════ */

const THEMES = {
  orchard: {
    name: 'Orchard',
    leafDark: '#2d4a2a', leafMid: '#4a7a45', leafLight: '#7ba66a',
    accent: '#5a7a4a', accentDeep: '#3d5a3a',
    glow: 'rgba(245,200,112,',
    petal: '#7ba66a',
  },
  sakura: {
    name: 'Sakura',
    leafDark: '#7a2d4a', leafMid: '#b85278', leafLight: '#e9a8c0',
    accent: '#b85278', accentDeep: '#7a2d4a',
    glow: 'rgba(253,228,236,',
    petal: '#f5b8c8',
  },
  maple: {
    name: 'Maple',
    leafDark: '#7a2e0a', leafMid: '#c4521e', leafLight: '#e89548',
    accent: '#b86134', accentDeep: '#7a3e1a',
    glow: 'rgba(248,180,80,',
    petal: '#e89548',
  },
  willow: {
    name: 'Willow',
    leafDark: '#3e4e30', leafMid: '#7a9268', leafLight: '#bccfa0',
    accent: '#7a9268', accentDeep: '#4a5e38',
    glow: 'rgba(220,232,180,',
    petal: '#c4d4a8',
  },
  jacaranda: {
    name: 'Jacaranda',
    leafDark: '#3a2858', leafMid: '#6a4e9c', leafLight: '#b09cdc',
    accent: '#7858a8', accentDeep: '#4a327a',
    glow: 'rgba(208,180,240,',
    petal: '#c8b0e8',
  },
};

/* ════════════════════════════════════════════════════════════════════
   AUDIO
   ════════════════════════════════════════════════════════════════════ */

function playTone(ctx, freq, dur = 0.5, type = 'sine', vol = 0.18, when = 0) {
  const t = ctx.currentTime + when;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(vol, t + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + dur);
}

const sounds = {
  done: ctx => {
    playTone(ctx, 880, 0.18, 'sine', 0.10, 0);
    playTone(ctx, 1318.5, 0.32, 'sine', 0.08, 0.04);
  },
  redo: ctx => {
    playTone(ctx, 587.3, 0.22, 'triangle', 0.07, 0);
  },
  milestone: ctx => {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
      playTone(ctx, f, 0.6, 'triangle', 0.09, i * 0.08)
    );
  },
  complete: ctx => {
    [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) =>
      playTone(ctx, f, 0.9, 'triangle', 0.12, i * 0.10)
    );
  },
};

/* ════════════════════════════════════════════════════════════════════
   SCENE BASELINE
   ════════════════════════════════════════════════════════════════════ */

const WILDFLOWERS = [
  { x: 50,  y: 542, c: '#ffffff' }, { x: 78,  y: 548, c: '#fde68a' }, { x: 112, y: 540, c: '#f9a8d4' },
  { x: 138, y: 549, c: '#ffffff' }, { x: 168, y: 542, c: '#c4b5fd' }, { x: 195, y: 550, c: '#fde68a' },
  { x: 392, y: 549, c: '#f9a8d4' }, { x: 420, y: 543, c: '#ffffff' }, { x: 446, y: 550, c: '#fde68a' },
  { x: 478, y: 544, c: '#c4b5fd' }, { x: 506, y: 548, c: '#ffffff' }, { x: 542, y: 542, c: '#f9a8d4' },
  { x: 25,  y: 548, c: '#fde68a' }, { x: 568, y: 545, c: '#ffffff' }, { x: 218, y: 552, c: '#f9a8d4' },
  { x: 376, y: 552, c: '#ffffff' },
];

const DRIFT_LEAVES = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  delay: i * 4 + (i % 3),
  dur: 14 + (i % 5),
  startY: 5 + (i * 9) % 25,
  size: 6 + (i % 3) * 2,
  col: ['#7a9d6a', '#c4965a', '#e89548', '#9bb38a'][i % 4],
}));

const STARS = Array.from({ length: 42 }, (_, i) => ({
  id: i,
  x: 3 + (i * 17.3) % 95,
  y: 1 + (i * 11.7) % 38,
  size: i % 4 === 0 ? 2.6 : i % 4 === 1 ? 1.6 : 1.2,
  delay: (i * 0.3) % 4,
}));

const FIREFLIES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  x: 8 + (i * 13.7) % 84,
  y: 35 + (i * 7.3) % 35,
  delay: (i * 0.5) % 6,
  dur: 5 + (i % 4),
}));

const BUTTERFLIES = Array.from({ length: 4 }, (_, i) => ({
  id: i,
  delay: i * 3.2,
  dur: 14 + i * 2,
  yStart: 35 + i * 8,
  col: ['#e9a8c0', '#fde68a', '#c4b5fd', '#a8d4d4'][i],
}));

const FOCUS_CHECK_INTERVAL = 8 * 60;
const FOCUS_RESPONSE_WINDOW = 20;
const IDLE_BASE_SECONDS = 90;

/* ════════════════════════════════════════════════════════════════════
   COMPONENT
   ════════════════════════════════════════════════════════════════════ */

export default function StudyTimer() {
  const [totalMins,  setTotalMins]  = useState(60);
  const [totalCards, setTotalCards] = useState(30);
  const [themeKey,   setThemeKey]   = useState('orchard');
  const [soundOn,    setSoundOn]    = useState(true);
  const [intention,  setIntention]  = useState('');

  const theme = THEMES[themeKey];
  const totalSeconds = totalMins * 60;

  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [isActive, setIsActive] = useState(false);

  const [cardsDone, setCardsDone] = useState(0);
  const [redos, setRedos]         = useState(0);
  const [freshDone, setFreshDone] = useState(0);
  const [reviewDone, setReviewDone] = useState(0);
  const [currentCardRedos, setCurrentCardRedos] = useState(0);
  const [cardStartElapsed, setCardStartElapsed] = useState(0);

  const [milestonesHit, setMilestonesHit] = useState({ q1:false, q2:false, q3:false });
  const [activeMilestone, setActiveMilestone] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [treeShake, setTreeShake] = useState(false);
  const [sessionsToday, setSessionsToday] = useState([]);

  const [doneSparkles, setDoneSparkles] = useState([]);
  const [redoSparkles, setRedoSparkles] = useState([]);
  const [floaters, setFloaters] = useState([]);
  const [petals, setPetals] = useState([]);
  const [shimmer, setShimmer] = useState(false);

  const audioCtxRef = useRef(null);
  const completedRef = useRef(false);
  const fxIdRef = useRef(0);

  const videoRef = useRef(null);
  const [videoDuration, setVideoDuration] = useState(0);

  const [showSettings, setShowSettings] = useState(false);
  const [draftMins,  setDraftMins]  = useState(60);
  const [draftCards, setDraftCards] = useState(30);
  const [draftTheme, setDraftTheme] = useState('orchard');

  const [focusRespCountdown, setFocusRespCountdown] = useState(null);
  const focusCheckRef = useRef(FOCUS_CHECK_INTERVAL);
  const lastInteractionRef = useRef(Date.now());

  const markInteraction = useCallback(() => {
    lastInteractionRef.current = Date.now();
  }, []);

  const [birdFlying, setBirdFlying] = useState(false);
  const birdTimerRef = useRef(null);

  const playSound = useCallback((kind) => {
    if (!soundOn) return;
    try {
      if (!audioCtxRef.current) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        audioCtxRef.current = new Ctx();
      }
      if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
      sounds[kind]?.(audioCtxRef.current);
    } catch (e) { /* ignore */ }
  }, [soundOn]);

  useEffect(() => {
    if (!isActive) return;
    if (timeLeft <= 0) return;
    const id = setInterval(() => {
      setTimeLeft(t => Math.max(0, t - 1));
      const idleSecs = (Date.now() - lastInteractionRef.current) / 1000;
      const perCardSecs = totalSeconds / Math.max(1, totalCards);
      const dynamicThreshold = Math.max(45, Math.min(IDLE_BASE_SECONDS, perCardSecs * 1.6));
      if (idleSecs > dynamicThreshold && focusRespCountdown === null) {
        setFocusRespCountdown(FOCUS_RESPONSE_WINDOW);
        lastInteractionRef.current = Date.now();
      }
    }, 1000);
    return () => clearInterval(id);
  }, [isActive, timeLeft, totalSeconds, totalCards, focusRespCountdown]);

  useEffect(() => {
    if (timeLeft === 0 && isActive && !completedRef.current) {
      completedRef.current = true;
      setIsActive(false);
      setShowCelebration(true);
      setSessionsToday(s => [...s, themeKey]);
      setTreeShake(true);
      setTimeout(() => setTreeShake(false), 1200);
      playSound('complete');
    }
  }, [timeLeft, isActive, themeKey, playSound]);

  useEffect(() => {
    if (focusRespCountdown === null) return;
    if (focusRespCountdown <= 0) {
      setIsActive(false);
      setFocusRespCountdown(null);
      return;
    }
    const id = setTimeout(() => setFocusRespCountdown(n => n - 1), 1000);
    return () => clearTimeout(id);
  }, [focusRespCountdown]);

  const dismissFocusCheck = () => {
    setFocusRespCountdown(null);
    focusCheckRef.current = FOCUS_CHECK_INTERVAL;
    markInteraction();
  };

  const safeTimeLeft = Math.max(0, timeLeft);
  const mins = Math.floor(safeTimeLeft / 60);
  const secs = safeTimeLeft % 60;
  const progress = totalSeconds > 0 ? (totalSeconds - safeTimeLeft) / totalSeconds : 0;
  const elapsed = totalSeconds - safeTimeLeft;
  const nearlyDone = progress >= 0.75;
  const finalStretch = c01(progress, 0.75, 1.0);

  useEffect(() => {
    const video = videoRef.current;
    if (video && videoDuration > 0) {
      const normalScrub = progress * videoDuration;
      video.currentTime = Math.min(videoDuration, normalScrub + 0.4);
    }
  }, [progress, videoDuration]);

  const safeTotalCards = Math.max(1, totalCards);
  const secsPerCard = totalSeconds / safeTotalCards;
  const cardElapsed = Math.max(0, elapsed - cardStartElapsed);
  const cardLeft = Math.max(0, Math.ceil(secsPerCard - cardElapsed));
  const cardMins = Math.floor(cardLeft / 60);
  const cardSecs = cardLeft % 60;
  const cardPct = Math.min(1, cardElapsed / secsPerCard);
  const cardUrgent = cardLeft <= 30 && isActive && cardsDone < totalCards;

  const expectedCards = Math.floor(progress * totalCards);
  const cardsProgress = totalCards > 0 ? cardsDone / totalCards : 0;

  const cardsLeft = Math.max(0, totalCards - cardsDone);
  const reviewLeft = currentCardRedos > 0 && cardsLeft > 0 ? 1 : 0;
  const freshLeft = Math.max(0, cardsLeft - reviewLeft);

  const paceDelta = cardsDone - expectedCards;
  const paceLabel = paceDelta > 0
    ? `${paceDelta} card${paceDelta !== 1 ? 's' : ''} ahead`
    : paceDelta < 0
    ? `${-paceDelta} card${-paceDelta !== 1 ? 's' : ''} behind`
    : 'On rhythm';
  const pace = paceDelta >= 2 ? 'ahead' : paceDelta <= -2 ? 'behind' : 'onpace';
  const paceConfig = {
    ahead:  { label: paceLabel, col: '#3a6a8a', bg: 'rgba(58,106,138,0.10)' },
    onpace: { label: paceLabel, col: theme.accentDeep, bg: `${theme.accent}1a` },
    behind: { label: paceLabel, col: '#a8542a', bg: 'rgba(168,84,42,0.12)' },
  }[pace];

  useEffect(() => {
    if (!isActive) return;
    const checkAndFire = (key, threshold) => {
      if (!milestonesHit[key] && progress >= threshold) {
        setMilestonesHit(m => ({ ...m, [key]: true }));
        setActiveMilestone(key);
        playSound('milestone');
        setTimeout(() => setActiveMilestone(null), 4500);
      }
    };
    checkAndFire('q1', 0.25);
    checkAndFire('q2', 0.50);
    checkAndFire('q3', 0.75);
  }, [progress, isActive, milestonesHit, playSound]);

  useEffect(() => {
    if (!isActive) {
      if (birdTimerRef.current) clearTimeout(birdTimerRef.current);
      return;
    }
    const schedule = () => {
      const delay = 50000 + Math.random() * 40000;
      birdTimerRef.current = setTimeout(() => {
        setBirdFlying(true);
        setTimeout(() => setBirdFlying(false), 8000);
        schedule();
      }, delay);
    };
    schedule();
    return () => { if (birdTimerRef.current) clearTimeout(birdTimerRef.current); };
  }, [isActive]);

  const toggle = () => {
    if (timeLeft <= 0) return;
    if (!isActive && timeLeft === totalSeconds) setShowCelebration(false);
    markInteraction();
    setIsActive(a => !a);
  };

  const reset = () => {
    setIsActive(false);
    setTimeLeft(totalSeconds);
    setCardsDone(0);
    setRedos(0);
    setFreshDone(0);
    setReviewDone(0);
    setCurrentCardRedos(0);
    setCardStartElapsed(0);
    completedRef.current = false;
    focusCheckRef.current = FOCUS_CHECK_INTERVAL;
    lastInteractionRef.current = Date.now();
    setFocusRespCountdown(null);
    setMilestonesHit({ q1:false, q2:false, q3:false });
    setActiveMilestone(null);
    setShowCelebration(false);
    setBirdFlying(false);
    setDoneSparkles([]); setRedoSparkles([]); setFloaters([]); setPetals([]);
  };

  const fireFloater = (kind) => {
    const id = ++fxIdRef.current;
    setFloaters(f => [...f, { id, kind }]);
    setTimeout(() => setFloaters(f => f.filter(x => x.id !== id)), 1600);
  };

  const firePetals = () => {
    const baseId = ++fxIdRef.current;
    const newPetals = Array.from({ length: 8 }, (_, i) => ({
      id: baseId * 100 + i,
      x: 30 + Math.random() * 30,
      delay: i * 0.05,
      drift: (Math.random() - 0.5) * 60,
      rot: Math.random() * 360,
    }));
    setPetals(p => [...p, ...newPetals]);
    setTimeout(() => {
      setPetals(p => p.filter(x => !newPetals.find(np => np.id === x.id)));
    }, 3000);
  };

  const triggerShimmer = () => {
    setShimmer(true);
    setTimeout(() => setShimmer(false), 700);
  };

  const completeCard = useCallback(() => {
    if (!isActive || cardsDone >= totalCards || timeLeft <= 0) return;
    markInteraction();
    const newCount = cardsDone + 1;
    setCardsDone(newCount);
    if (currentCardRedos > 0) setReviewDone(r => r + 1);
    else setFreshDone(f => f + 1);
    setCurrentCardRedos(0);
    setCardStartElapsed(elapsed);
    playSound('done');

    const sid = ++fxIdRef.current;
    setDoneSparkles(s => [...s, { id: sid }]);
    setTimeout(() => setDoneSparkles(s => s.filter(x => x.id !== sid)), 1400);

    fireFloater('done');
    firePetals();
    triggerShimmer();

    if (newCount === totalCards) {
      setTimeout(() => {
        setShowCelebration(true);
        setSessionsToday(s => [...s, themeKey]);
        setTreeShake(true);
        setTimeout(() => setTreeShake(false), 1200);
        playSound('complete');
      }, 400);
    }
  }, [cardsDone, totalCards, isActive, timeLeft, elapsed, themeKey, currentCardRedos, playSound, markInteraction]);

  const redoCard = useCallback(() => {
    if (!isActive || timeLeft <= 0) return;
    markInteraction();
    setRedos(r => r + 1);
    setCurrentCardRedos(c => c + 1);
    setCardStartElapsed(elapsed);
    playSound('redo');

    const sid = ++fxIdRef.current;
    setRedoSparkles(s => [...s, { id: sid }]);
    setTimeout(() => setRedoSparkles(s => s.filter(x => x.id !== sid)), 1100);

    fireFloater('redo');
  }, [isActive, timeLeft, elapsed, playSound, markInteraction]);

  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (showSettings || focusRespCountdown !== null) return;
      if (['Space','KeyR','KeyD','KeyF','KeyS'].includes(e.code) || ['r','R','d','D','f','F','s','S'].includes(e.key)) {
        markInteraction();
      }
      if (e.code === 'Space') { e.preventDefault(); toggle(); }
      else if (e.key === 'r' || e.key === 'R') reset();
      else if (e.key === 'd' || e.key === 'D') completeCard();
      else if (e.key === 'f' || e.key === 'F') redoCard();
      else if (e.key === 's' || e.key === 'S') {
        setDraftMins(totalMins); setDraftCards(totalCards); setDraftTheme(themeKey);
        setShowSettings(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line
  }, [completeCard, redoCard, showSettings, focusRespCountdown, totalMins, totalCards, themeKey, isActive, timeLeft, markInteraction]);

  const applySettings = () => {
    const m = Math.max(1, Math.min(180, draftMins));
    const c = Math.max(1, Math.min(120, draftCards));
    setTotalMins(m); setTotalCards(c);
    setThemeKey(draftTheme);
    setTimeLeft(m * 60); setIsActive(false);
    setCardsDone(0); setRedos(0); setFreshDone(0); setReviewDone(0); setCurrentCardRedos(0); setCardStartElapsed(0);
    completedRef.current = false;
    focusCheckRef.current = FOCUS_CHECK_INTERVAL;
    setFocusRespCountdown(null);
    setMilestonesHit({ q1:false, q2:false, q3:false });
    setActiveMilestone(null);
    setShowCelebration(false);
    setShowSettings(false);
  };

  /* ── TREE GROWTH ── */
  const tP        = c01(progress, 0.00, 0.10);
  const brP       = c01(progress, 0.06, 0.22);
  const sbP       = c01(progress, 0.16, 0.32);
  const twigP     = c01(progress, 0.26, 0.42);
  const fineTwigP = c01(progress, 0.34, 0.50);
  const l1P       = c01(progress, 0.36, 0.52);
  const l2P       = c01(progress, 0.42, 0.58);
  const l3P       = c01(progress, 0.48, 0.65);
  const detailP   = c01(progress, 0.20, 0.40);
  const scaleOf = (ph) => ph === 0 ? l1P : ph === 1 ? l2P : l3P;
  const tr     = 'transform 1.2s cubic-bezier(0.34,1.4,0.64,1)';
  const trSlow = 'transform 1.5s cubic-bezier(0.34,1.2,0.64,1)';

  /* ── SKY ── */
  const dawnOp = Math.max(0, 1 - progress * 2);
  const dayOp  = Math.max(0, 1 - Math.abs(progress - 0.5) * 2);
  const duskOp = Math.max(0, progress * 2 - 1);
  const nightOp = Math.max(0, progress * 2 - 1.4);

  const sunPct  = progress * 88 + 4;
  const sunArcY = 5 + Math.pow(progress * 2 - 1, 2) * 28;
  const sunMid   = duskOp > 0.5 ? '#ffb380' : '#fff1a8';
  const sunOuter = duskOp > 0.5 ? '#ee6b33' : '#f8c548';
  const halo1    = duskOp > 0.5 ? 'rgba(245,140,60,0.50)' : 'rgba(248,200,72,0.50)';
  const halo2    = duskOp > 0.5 ? 'rgba(238,107,51,0.22)' : 'rgba(248,180,40,0.20)';
  const rayCol   = duskOp > 0.5 ? 'rgba(245,160,80,0.50)' : 'rgba(248,210,90,0.50)';

  /* ════════════════════════════════════════════════════════════════
     DYNAMIC FOREGROUND LIGHTING
     Sun position drives:
       • tree shadow length, direction, and softness
       • golden-hour warm wash at dawn/dusk
       • cool blue wash at night
       • rim light on sun-facing side of canopy
       • grass-color tint shifting through the day
     ════════════════════════════════════════════════════════════════ */

  // Sun angle normalized: -1 (far left/sunrise) → 0 (overhead) → +1 (far right/sunset)
  const sunAngleNorm = (sunPct - 48) / 44;
  // Sun height: 0 (lowest, on horizon) → 1 (highest, overhead)
  const sunHeight = 1 - c01(sunArcY, 5, 33);

  // Tree shadow shifts opposite to sun and stretches when sun is low
  const shadowDx = -sunAngleNorm * 38;
  const shadowStretchX = 1 + Math.abs(sunAngleNorm) * 0.5;
  const shadowOp = 0.10 + (1 - sunHeight) * 0.04;
  const shadowBlur = 1.2 + (1 - sunHeight) * 1.8;

  // Golden hour intensity: peaks at dawn/dusk, fades at midday and night
  const goldenHourOp = Math.max(dawnOp, duskOp) * 0.85 * (1 - nightOp);
  const goldenColor = duskOp > 0.5
    ? 'rgba(255,140,72,0.55)'
    : 'rgba(255,200,120,0.45)';

  // Night cool blue wash
  const nightWashOp = nightOp * 0.7;

  // Midday clarity — slight cool/clean wash when sun is highest
  const middayOp = dayOp * 0.25 * (1 - Math.max(dawnOp, duskOp) * 0.6);

  // Rim light on canopy — sun-facing side glows
  const rimLightOp = sunHeight * (1 - nightOp) * 0.6;
  const rimLightX = sunAngleNorm; // -1 left, +1 right

  // Grass tint shifts with sun: warm at dawn/dusk, cool at night
  const grassWarmth = Math.max(dawnOp, duskOp);
  const grassDarken = nightOp;

  const BLOBS = BLOBS_BASE.map(b => ({
    ...b,
    col: b.ph === 0 ? theme.leafDark : b.ph === 1 ? theme.leafMid : theme.leafLight,
    op: b.ph === 0 ? 0.85 : b.ph === 1 ? 0.92 : 0.88,
  }));

  /* ── PALETTE ── */
  const ink   = '#2d2418';
  const ink2  = '#6b5a3e';
  const ink3  = '#9b8a6e';
  const cream = '#faf6ed';
  const line  = 'rgba(45,36,24,0.12)';

  const cardStyle = {
    background: cream,
    border: `0.5px solid ${line}`,
    borderRadius: 14,
    padding: '14px 16px',
    boxShadow: '0 1px 0 rgba(255,255,255,0.6) inset, 0 2px 12px rgba(45,36,24,0.04)',
  };

  const serif = "'Fraunces', Georgia, 'Times New Roman', serif";
  const sans  = "system-ui, -apple-system, 'Helvetica Neue', sans-serif";

  const cardsGlowIntensity = cardsProgress;

  return (
    <div style={{
      width:'100%', height:'100vh', display:'flex', overflow:'hidden',
      fontFamily: serif, position:'relative', color: ink,
    }}>

      {/* SCALED VIDEO BACKGROUND */}
      <video
        ref={videoRef}
        src="https://cdn.jsdelivr.net/gh/TomKenison162/cautious-dollop@main/start_from_stratch_make_it_pro.mp4"
        muted
        playsInline
        preload="auto"
        onLoadedMetadata={(e) => setVideoDuration(e.target.duration)}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '61%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Stars */}
      {duskOp > 0.3 && (
        <div style={{ position:'absolute', inset:0, zIndex:1, pointerEvents:'none' }}>
          {STARS.map(s => (
            <div key={s.id} style={{
              position:'absolute', left:`${s.x}%`, top:`${s.y}%`,
              width:s.size, height:s.size, borderRadius:'50%',
              background:'#fff8e0', opacity:duskOp*0.85,
              boxShadow:`0 0 ${s.size*2.5}px rgba(255,248,200,0.7)`,
              animation:`twinkle 3s ease-in-out ${s.delay}s infinite`,
            }}/>
          ))}
        </div>
      )}

      {/* Sun */}
      <div style={{
        position:'absolute', zIndex:1,
        left:`calc(${sunPct}% - 44px)`, top:`${sunArcY}%`,
        width:88, height:88,
        transition:'left 4s ease-out, top 4s ease-out',
        pointerEvents:'none',
        filter: !isActive ? 'saturate(0.85) brightness(0.97)' : 'none',
      }}>
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:220, height:220, borderRadius:'50%', background:`radial-gradient(circle,${halo2} 0%,transparent 70%)`, transition:'background 4s' }}/>
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:140, height:140, borderRadius:'50%', background:`radial-gradient(circle,${halo1} 0%,transparent 70%)`, transition:'background 4s' }}/>
        <svg width="240" height="240" viewBox="0 0 240 240" style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', animation: isActive ? 'spinRays 22s linear infinite' : 'none', overflow:'visible' }}>
          {RAYS.map((deg, i) => {
            const rad = deg * Math.PI / 180, r0 = 50, r1 = r0 + (i % 2 === 0 ? 32 : 18);
            return (<line key={i} x1={120 + Math.cos(rad)*r0} y1={120 + Math.sin(rad)*r0} x2={120 + Math.cos(rad)*r1} y2={120 + Math.sin(rad)*r1} stroke={rayCol} strokeWidth={i%2===0?3.5:2} strokeLinecap="round" style={{ transition:'stroke 4s' }}/>);
          })}
        </svg>
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:88, height:88, borderRadius:'50%', background:`radial-gradient(circle at 38% 36%,#ffffff 0%,${sunMid} 40%,${sunOuter} 100%)`, boxShadow:`0 0 0 5px rgba(255,255,255,0.16),0 0 22px 7px ${halo1}`, transition:'background 4s' }}/>
        <div style={{ position:'absolute', top:'calc(50% - 19px)', left:'calc(50% - 15px)', width:26, height:15, borderRadius:'50%', background:'rgba(255,255,255,0.55)', transform:'rotate(-35deg)' }}/>
      </div>

      {/* Sun scatter */}
      <div style={{
        position:'absolute', zIndex:1, pointerEvents:'none',
        left: 0, top: 0, width:'50%', height:'100%',
        background: `radial-gradient(ellipse 60% 45% at ${sunPct}% ${5 + sunArcY}%,
          ${duskOp > 0.5 ? 'rgba(255,160,80,0.35)' : 'rgba(255,225,140,0.30)'} 0%,
          ${duskOp > 0.5 ? 'rgba(255,140,90,0.18)' : 'rgba(255,220,160,0.18)'} 22%,
          transparent 55%)`,
        transition:'background 4s ease-out',
        mixBlendMode:'screen',
      }}/>

      {/* Volumetric clouds */}
      <div style={{
        position:'absolute', zIndex:2, pointerEvents:'none',
        left: '5%', top: '7%', width: 180, height: 64,
        background: `
          radial-gradient(ellipse 50% 70% at 30% 70%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 35%, transparent 70%),
          radial-gradient(ellipse 60% 80% at 60% 80%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.78) 40%, transparent 75%),
          radial-gradient(ellipse 45% 70% at 80% 75%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.7) 40%, transparent 70%),
          radial-gradient(ellipse 100% 50% at 50% 100%, rgba(220,225,235,0.7) 0%, transparent 70%)
        `,
        opacity: 0.75 * dayOp + 0.45 * dawnOp + 0.55 * duskOp + 0.15,
        filter: `blur(0.5px) ${duskOp > 0.5 ? 'hue-rotate(-12deg) saturate(1.4) brightness(1.05)' : ''}`,
        transition: 'opacity 4s, filter 4s',
        animation: 'cloudDriftSlow 90s linear infinite',
      }}/>
      <div style={{
        position:'absolute', zIndex:2, pointerEvents:'none',
        left: '38%', top: '4%', width: 130, height: 48,
        background: `
          radial-gradient(ellipse 55% 75% at 35% 75%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.78) 40%, transparent 75%),
          radial-gradient(ellipse 50% 70% at 70% 75%, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.72) 45%, transparent 75%),
          radial-gradient(ellipse 100% 50% at 50% 100%, rgba(215,222,232,0.65) 0%, transparent 70%)
        `,
        opacity: 0.65 * dayOp + 0.4 * dawnOp + 0.5 * duskOp + 0.12,
        filter: `blur(0.5px) ${duskOp > 0.5 ? 'hue-rotate(-12deg) saturate(1.3) brightness(1.05)' : ''}`,
        transition: 'opacity 4s, filter 4s',
        animation: 'cloudDriftSlow 110s linear infinite',
        animationDelay: '-30s',
      }}/>

      {/* Cirrus */}
      <div style={{
        position:'absolute', zIndex:2, pointerEvents:'none',
        left: '10%', top: '2%', width: '30%', height: 8,
        background: 'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.55) 30%, rgba(255,255,255,0.65) 50%, rgba(255,255,255,0.45) 70%, transparent 100%)',
        opacity: 0.6 * dayOp + 0.3 * duskOp + 0.4 * dawnOp,
        filter: 'blur(2px)',
        transform: 'rotate(-1deg)',
        transition: 'opacity 4s',
      }}/>
      <div style={{
        position:'absolute', zIndex:2, pointerEvents:'none',
        left: '40%', top: '1%', width: '28%', height: 6,
        background: 'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.45) 35%, rgba(255,255,255,0.6) 55%, transparent 100%)',
        opacity: 0.55 * dayOp + 0.3 * duskOp + 0.4 * dawnOp,
        filter: 'blur(2px)',
        transform: 'rotate(0.8deg)',
        transition: 'opacity 4s',
      }}/>

      {/* Cards-driven ambient halo */}
      {cardsGlowIntensity > 0 && (
        <div style={{
          position:'absolute', left:'25%', top:'50%',
          transform:'translate(-50%,-50%)',
          width: 500, height: 500, zIndex:2,
          borderRadius:'50%',
          background:`radial-gradient(circle, ${theme.glow}${(0.18*cardsGlowIntensity).toFixed(3)}) 0%, transparent 65%)`,
          pointerEvents:'none',
          transition: 'background 1.2s ease',
          mixBlendMode: 'screen',
        }}/>
      )}

      {/* Bird */}
      {birdFlying && isActive && (
        <svg width="40" height="20" viewBox="0 0 40 20" style={{
          position:'absolute', zIndex:3, top:'18%', left:'-50px',
          animation:'birdFly 8s linear forwards', pointerEvents:'none',
        }}>
          <path d="M2,10 Q8,3 14,10 Q20,3 26,10 Q32,3 38,10" stroke={ink} strokeWidth="1.8" fill="none" strokeLinecap="round" style={{ animation:'wingFlap 0.4s ease-in-out infinite' }}/>
        </svg>
      )}

      {/* Butterflies */}
      {isActive && dayOp > 0.5 && BUTTERFLIES.map(b => (
        <div key={b.id} style={{
          position:'absolute', zIndex:5, left:'-20px',
          top:`${b.yStart}%`,
          animation:`butterflyFly ${b.dur}s linear ${b.delay}s infinite`,
          pointerEvents:'none',
        }}>
          <svg width="18" height="14" viewBox="0 0 18 14" style={{ animation:'butterflyFlap 0.3s ease-in-out infinite' }}>
            <ellipse cx="6" cy="6" rx="5" ry="4" fill={b.col} opacity="0.85"/>
            <ellipse cx="12" cy="6" rx="5" ry="4" fill={b.col} opacity="0.85"/>
            <ellipse cx="6" cy="9" rx="3" ry="2.5" fill={b.col} opacity="0.7"/>
            <ellipse cx="12" cy="9" rx="3" ry="2.5" fill={b.col} opacity="0.7"/>
            <line x1="9" y1="3" x2="9" y2="11" stroke={ink} strokeWidth="1"/>
          </svg>
        </div>
      ))}

      {/* Fireflies */}
      {duskOp > 0.4 && isActive && FIREFLIES.map(f => (
        <div key={f.id} style={{
          position:'absolute', zIndex:5,
          left:`${f.x}%`, top:`${f.y}%`,
          width:5, height:5, borderRadius:'50%',
          background:'#fef0a0',
          boxShadow:'0 0 12px 3px rgba(254,240,160,0.9), 0 0 24px 6px rgba(254,240,160,0.4)',
          animation:`fireflyFloat ${f.dur}s ease-in-out ${f.delay}s infinite`,
          pointerEvents:'none',
          opacity:duskOp,
        }}/>
      ))}

      {/* Drifting leaves (canopy) */}
      {isActive && LEAVES.map(p => (
        <div key={p.id} style={{
          position:'absolute', zIndex:3, pointerEvents:'none',
          width:p.size, height:p.size*0.68,
          borderRadius:p.id%2===0?'60% 0 60% 0':'0 60% 0 60%',
          background:p.col, left:`${p.x}%`, bottom:'20%',
          opacity:0, animation:`floatUp ${p.dur}s ease-out ${p.delay}s infinite`,
        }}/>
      ))}

      {/* Cross-sky drifting leaves */}
      {isActive && DRIFT_LEAVES.map(d => (
        <div key={`dl${d.id}`} style={{
          position:'absolute', zIndex:3, pointerEvents:'none',
          left:'-3%', top:`${d.startY}%`,
          width:d.size, height:d.size*0.68,
          borderRadius:d.id % 2 === 0 ? '60% 0 60% 0' : '0 60% 0 60%',
          background:d.col,
          animation:`leafDrift ${d.dur}s linear ${d.delay}s infinite`,
        }}/>
      ))}

      {/* Glow orbs */}
      {isActive && nearlyDone && GLOW_ORBS.map(o => (
        <div key={o.id} style={{
          position:'absolute', zIndex:6, pointerEvents:'none',
          left:`${o.x}%`, bottom:'18%',
          width:o.size, height:o.size, borderRadius:'50%',
          background:`${theme.glow}1)`,
          boxShadow:`0 0 ${o.size*3}px ${o.size*0.7}px ${theme.glow}0.85), 0 0 ${o.size*7}px ${o.size*1.5}px ${theme.glow}0.35)`,
          opacity: 0,
          animation: `glowOrbRise ${o.dur}s ease-out ${o.delay}s infinite`,
          filter: `brightness(${1 + finalStretch * 0.5})`,
        }}/>
      ))}

      {/* DONE sparkle bursts */}
      {doneSparkles.map(s => (
        <div key={s.id} style={{ position:'absolute', zIndex:30, top:'46%', left:'25%', pointerEvents:'none', animation:'sparkBurst 1.4s ease-out forwards' }}>
          {[0,45,90,135,180,225,270,315].map(a => (
            <div key={a} style={{
              position:'absolute', width:8, height:8, borderRadius:'50%',
              background: a%90===0 ? theme.accent : theme.leafLight,
              top:0, left:0, transform:`rotate(${a}deg) translateY(-36px)`,
              boxShadow:`0 0 6px ${theme.glow}0.8)`,
            }}/>
          ))}
        </div>
      ))}

      {/* REDO sparkle bursts */}
      {redoSparkles.map(s => (
        <div key={s.id} style={{ position:'absolute', zIndex:30, top:'46%', left:'25%', pointerEvents:'none', animation:'sparkBurst 1s ease-out forwards' }}>
          {[0,72,144,216,288].map(a => (
            <div key={a} style={{
              position:'absolute', width:6, height:6, borderRadius:'50%',
              background:'#c4965a',
              top:0, left:0, transform:`rotate(${a}deg) translateY(-22px)`,
              opacity:0.8,
            }}/>
          ))}
        </div>
      ))}

      {/* Petals shower on Done */}
      {petals.map(p => (
        <div key={p.id} style={{
          position:'absolute', zIndex:8, pointerEvents:'none',
          left:`${p.x}%`, top:'30%',
          width:9, height:6,
          borderRadius:'60% 0 60% 0',
          background: theme.petal,
          boxShadow:`0 0 4px ${theme.glow}0.5)`,
          opacity:0,
          animation:`petalFall 2.6s ease-out ${p.delay}s forwards`,
          ['--drift']:`${p.drift}px`,
          ['--rot']:`${p.rot}deg`,
        }}/>
      ))}

      {/* Floaters */}
      {floaters.map(f => (
        <div key={f.id} style={{
          position:'absolute', zIndex:50, pointerEvents:'none',
          right:'33%', top:'58%',
          fontSize: f.kind === 'done' ? 26 : 20,
          fontFamily: serif,
          fontWeight: 400,
          fontStyle: 'italic',
          color: f.kind === 'done' ? theme.accentDeep : '#a87a3a',
          animation:'floaterRise 1.5s ease-out forwards',
          letterSpacing:'-0.02em',
          textShadow:`0 2px 8px ${theme.glow}0.4)`,
        }}>
          {f.kind === 'done' ? '+1' : 'redo'}
        </div>
      ))}

      {/* Milestone q1 */}
      {activeMilestone === 'q1' && (
        <div style={{ position:'absolute', inset:0, zIndex:6, pointerEvents:'none' }}>
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const tx = Math.cos(angle) * 200;
            const ty = Math.sin(angle) * 200 - 40;
            return (
              <svg key={i} width="22" height="18" viewBox="0 0 18 14" style={{
                position:'absolute', top:'42%', left:'25%',
                animation:`butterflyBurst 4s ease-out forwards`,
                animationDelay:`${i*0.08}s`,
                ['--tx']: `${tx}px`, ['--ty']: `${ty}px`,
              }}>
                <ellipse cx="6" cy="6" rx="5" ry="4" fill={['#e9a8c0','#fde68a','#c4b5fd','#a8d4d4'][i%4]} opacity="0.85"/>
                <ellipse cx="12" cy="6" rx="5" ry="4" fill={['#e9a8c0','#fde68a','#c4b5fd','#a8d4d4'][i%4]} opacity="0.85"/>
              </svg>
            );
          })}
        </div>
      )}

      {/* Milestone q2 */}
      {activeMilestone === 'q2' && (
        <div style={{ position:'absolute', inset:0, zIndex:6, pointerEvents:'none', animation:'rainbowFade 4.5s ease-out forwards' }}>
          <svg width="50%" height="60%" viewBox="0 0 400 300" style={{ position:'absolute', top:'10%', left:'0' }}>
            {['#c45838','#e88848','#f5c870','#7ba66a','#7ab8e0','#9d4e8a'].map((col, i) => (
              <path key={i} d={`M40,260 A${160-i*8},${160-i*8} 0 0,1 360,260`}
                stroke={col} strokeWidth="5" fill="none" opacity="0.55" strokeLinecap="round"/>
            ))}
          </svg>
        </div>
      )}

      {/* Milestone q3 */}
      {activeMilestone === 'q3' && (
        <div style={{ position:'absolute', inset:0, zIndex:6, pointerEvents:'none' }}>
          <div style={{
            position:'absolute', top:'15%', left:'10%',
            width:80, height:3, background:'linear-gradient(90deg, transparent, #fff8e0, #f5c870)',
            borderRadius:2, transform:'rotate(20deg)',
            boxShadow:'0 0 18px 4px rgba(245,200,112,0.7)',
            animation:'shootingStar 1.6s ease-out forwards',
          }}/>
        </div>
      )}

      {/* ══ LEFT: TREE SCENE ══ */}
      <div style={{ position:'relative', flex:'1 1 50%', overflow:'hidden', zIndex:3 }}>

        {/* ════════════════════════════════════════════════════════════
            DYNAMIC FOREGROUND LIGHTING LAYERS
            Sit above the scene base, below interactive elements.
            mix-blend-mode lets them tint the underlying SVG.
            ════════════════════════════════════════════════════════════ */}

        {/* Layer 1: Golden hour wash — radial warmth originating from sun position */}
        {goldenHourOp > 0.01 && (
          <div style={{
            position:'absolute', inset:0, pointerEvents:'none', zIndex:2,
            background: `radial-gradient(ellipse 110% 70% at ${sunPct * 2}% 100%,
              ${goldenColor} 0%,
              ${goldenColor.replace(/[\d.]+\)$/, '0.25)')} 30%,
              transparent 65%)`,
            mixBlendMode: 'soft-light',
            opacity: goldenHourOp,
            transition: 'background 4s ease-out, opacity 4s ease-out',
          }}/>
        )}

        {/* Layer 2: Directional sun-side gradient — brightens the half of the ground facing the sun */}
        {dayOp > 0.1 && !nightOp && (
          <div style={{
            position:'absolute', inset:'40% 0 0 0', pointerEvents:'none', zIndex:2,
            background: `linear-gradient(${90 + sunAngleNorm * 60}deg,
              rgba(255,240,200,0.18) 0%,
              transparent 50%,
              rgba(45,36,60,0.12) 100%)`,
            mixBlendMode: 'soft-light',
            opacity: dayOp,
            transition: 'background 4s ease-out, opacity 4s',
          }}/>
        )}

        {/* Layer 3: Midday cool clarity */}
        {middayOp > 0.01 && (
          <div style={{
            position:'absolute', inset:'45% 0 0 0', pointerEvents:'none', zIndex:2,
            background: 'radial-gradient(ellipse 100% 100% at 50% 100%, rgba(180,210,220,0.18) 0%, transparent 70%)',
            mixBlendMode: 'screen',
            opacity: middayOp,
            transition: 'opacity 4s',
          }}/>
        )}

        {/* Layer 4: Night cool blue wash */}
        {nightWashOp > 0.01 && (
          <div style={{
            position:'absolute', inset:'30% 0 0 0', pointerEvents:'none', zIndex:2,
            background: 'linear-gradient(to bottom, transparent 0%, rgba(30,45,90,0.5) 70%, rgba(15,25,55,0.7) 100%)',
            mixBlendMode: 'multiply',
            opacity: nightWashOp,
            transition: 'opacity 4s',
          }}/>
        )}

        {/* Layer 5: Atmospheric dust motes — visible in golden hour light */}
        {goldenHourOp > 0.3 && isActive && (
          <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:2 }}>
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={`dust${i}`} style={{
                position:'absolute',
                left: `${10 + (i * 5.2) % 70}%`,
                top: `${40 + (i * 7.3) % 35}%`,
                width: 2 + (i % 2),
                height: 2 + (i % 2),
                borderRadius: '50%',
                background: duskOp > 0.5 ? 'rgba(255,200,150,0.7)' : 'rgba(255,230,180,0.7)',
                boxShadow: `0 0 4px ${duskOp > 0.5 ? 'rgba(255,180,120,0.6)' : 'rgba(255,220,160,0.5)'}`,
                opacity: goldenHourOp * 0.7,
                animation: `dustDrift ${8 + (i%4)*2}s ease-in-out ${(i*0.4)%5}s infinite`,
              }}/>
            ))}
          </div>
        )}

        <div style={{
          position:'absolute', bottom:0, left:0, right:0,
          display:'flex', justifyContent:'center',
          animation: treeShake ? 'treeShake 1.2s ease-out' : 'none',
          filter: shimmer ? 'brightness(1.18) saturate(1.12)' : 'none',
          transition: 'filter 0.7s ease-out',
        }}>
          <svg viewBox="0 -180 600 740" xmlns="http://www.w3.org/2000/svg" style={{ width:'100%', height:'auto', maxHeight:'96vh', display:'block' }}>

            <defs>
              {/* Sun-side rim light gradient on canopy */}
              <radialGradient id="rimLight" cx={rimLightX > 0 ? '85%' : '15%'} cy="30%" r="50%">
                <stop offset="0%" stopColor={duskOp > 0.5 ? '#ffd09a' : '#fff8d8'} stopOpacity={rimLightOp}/>
                <stop offset="60%" stopColor="#ffffff" stopOpacity="0"/>
              </radialGradient>
            </defs>

            {/* Ground — with dynamic tint overlay */}
            <path d="M-10,520 Q150,506 300,512 Q450,518 620,504 L620,562 L-10,562 Z" fill="#7ba66a"/>
            <path d="M-10,540 Q150,530 300,533 Q450,535 620,530 L620,562 L-10,562 Z" fill="#5a8a4a" opacity="0.6"/>

            {/* Dynamic grass tint — warm at golden hour, dark at night */}
            <path d="M-10,520 Q150,506 300,512 Q450,518 620,504 L620,562 L-10,562 Z"
              fill={duskOp > 0.5 ? '#c4682a' : '#fdb87a'}
              opacity={grassWarmth * 0.25}
              style={{ transition: 'fill 4s, opacity 4s' }}/>
            <path d="M-10,520 Q150,506 300,512 Q450,518 620,504 L620,562 L-10,562 Z"
              fill="#1a2a4a"
              opacity={grassDarken * 0.55}
              style={{ transition: 'opacity 4s' }}/>

            {/* Grass tufts */}
            <path d="M80,520 C78,510 75,504 82,501 C79,505 85,499 88,503 C85,501 90,497 93,501" stroke="#5a8a4a" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7"/>
            <path d="M180,522 C178,512 177,508 182,505 C180,508 185,503 187,507" stroke="#5a8a4a" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7"/>
            <path d="M380,518 C378,508 377,504 382,501 C380,504 385,500 387,504" stroke="#5a8a4a" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7"/>
            <path d="M490,515 C488,505 485,499 492,496 C489,500 495,495 498,499 C495,497 500,493 503,497" stroke="#5a8a4a" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7"/>
            <path d="M40,532 C38,524 36,520 41,518" stroke="#5a8a4a" strokeWidth="1.3" fill="none" strokeLinecap="round" opacity="0.6"/>
            <path d="M260,524 C258,516 256,512 261,510" stroke="#5a8a4a" strokeWidth="1.3" fill="none" strokeLinecap="round" opacity="0.6"/>
            <path d="M540,528 C538,520 536,516 541,514" stroke="#5a8a4a" strokeWidth="1.3" fill="none" strokeLinecap="round" opacity="0.6"/>

            {/* Stones at pond edge */}
            <ellipse cx="430" cy="544" rx="5" ry="2" fill="#9a8e7a"/>
            <ellipse cx="430" cy="543" rx="3.5" ry="1.3" fill="#bab09e"/>
            <ellipse cx="572" cy="546" rx="6" ry="2.3" fill="#9a8e7a"/>
            <ellipse cx="572" cy="545" rx="4" ry="1.5" fill="#bab09e"/>
            <ellipse cx="500" cy="552" rx="4" ry="1.6" fill="#a89c88"/>

            {/* Wildflowers */}
            {WILDFLOWERS.map((f, i) => (
              <g key={i}>
                <circle cx={f.x} cy={f.y} r="1.6" fill={f.c} opacity="0.95"/>
                <circle cx={f.x} cy={f.y} r="0.7" fill="#fde68a" opacity="0.9"/>
                <line x1={f.x} y1={f.y+1.6} x2={f.x} y2={f.y+5} stroke="#5a8a4a" strokeWidth="0.8" opacity="0.5"/>
                {/* Tiny directional shadow from each flower, follows sun */}
                {dayOp > 0.2 && (
                  <ellipse
                    cx={f.x + sunAngleNorm * -3}
                    cy={f.y + 5}
                    rx={1.5 + Math.abs(sunAngleNorm) * 1.5}
                    ry="0.7"
                    fill="rgba(45,36,24,0.18)"
                    style={{ transition: 'cx 4s, rx 4s' }}
                  />
                )}
              </g>
            ))}

            {/* Stones */}
            <ellipse cx="218" cy="524" rx="11" ry="4.5" fill="#9a8e7a"/>
            <ellipse cx="218" cy="522.5" rx="9" ry="3" fill="#bab09e"/>
            <ellipse cx="382" cy="528" rx="9" ry="3.8" fill="#9a8e7a"/>
            <ellipse cx="382" cy="526.7" rx="7" ry="2.5" fill="#bab09e"/>
            <ellipse cx="248" cy="532" rx="6" ry="2.5" fill="#a89c88"/>

            {/* Stone directional shadows — stretch with low sun */}
            {dayOp > 0.1 && (
              <g style={{ transition: 'transform 4s' }}>
                <ellipse
                  cx={218 + sunAngleNorm * -6}
                  cy={528}
                  rx={11 * shadowStretchX * 0.7}
                  ry="2"
                  fill={`rgba(45,36,24,${shadowOp * 0.7})`}
                  style={{ transition: 'cx 4s, rx 4s, fill 4s' }}
                />
                <ellipse
                  cx={382 + sunAngleNorm * -5}
                  cy={531}
                  rx={9 * shadowStretchX * 0.7}
                  ry="1.8"
                  fill={`rgba(45,36,24,${shadowOp * 0.7})`}
                  style={{ transition: 'cx 4s, rx 4s, fill 4s' }}
                />
              </g>
            )}

            {/* Toadstools */}
            <g>
              <ellipse cx="160" cy="528" rx="3" ry="6" fill="#f0e8d8"/>
              <path d="M152,524 Q160,514 168,524 Q165,527 160,527 Q155,527 152,524 Z" fill="#c64a3a"/>
              <circle cx="156" cy="521" r="1" fill="#fff8e0"/>
              <circle cx="161" cy="519" r="0.8" fill="#fff8e0"/>
              <circle cx="164" cy="522" r="0.9" fill="#fff8e0"/>
            </g>
            <g>
              <ellipse cx="172" cy="532" rx="2" ry="4" fill="#f0e8d8"/>
              <path d="M167,529 Q172,523 178,529 Q175,531 172,531 Q169,531 167,529 Z" fill="#c64a3a"/>
              <circle cx="170" cy="527" r="0.6" fill="#fff8e0"/>
              <circle cx="174" cy="526" r="0.6" fill="#fff8e0"/>
            </g>
            <g>
              <ellipse cx="430" cy="530" rx="2.2" ry="4.5" fill="#f0e8d8"/>
              <path d="M424,527 Q430,520 436,527 Q433,529 430,529 Q427,529 424,527 Z" fill="#c64a3a"/>
              <circle cx="427" cy="525" r="0.7" fill="#fff8e0"/>
              <circle cx="432" cy="524" r="0.7" fill="#fff8e0"/>
            </g>

            {/* ═══════════ DYNAMIC TREE SHADOW ═══════════
                Stretches, shifts direction, and softens with sun position. */}
            <ellipse
              cx={300 + shadowDx}
              cy="524"
              rx={92 * shadowStretchX}
              ry={9 - sunHeight * 1.5}
              fill={`rgba(45,36,24,${shadowOp})`}
              style={{
                transition: 'cx 4s ease-out, rx 4s ease-out, ry 4s, fill 4s',
                filter: `blur(${shadowBlur}px)`,
              }}
            />

            {/* Roots */}
            <path d="M294,520 C272,508 250,518 230,528" stroke="#4a3018" strokeWidth="11" strokeLinecap="round" fill="none" strokeDasharray="72" strokeDashoffset={72*(1-tP)} style={{ transition:tr }}/>
            <path d="M306,522 C330,510 354,520 372,528" stroke="#4a3018" strokeWidth="11" strokeLinecap="round" fill="none" strokeDasharray="72" strokeDashoffset={72*(1-tP)} style={{ transition:tr }}/>
            <path d="M298,522 C295,528 289,536 281,542" stroke="#4a3018" strokeWidth="7" strokeLinecap="round" fill="none" strokeDasharray="30" strokeDashoffset={30*(1-tP)} style={{ transition:tr }}/>
            <path d="M302,522 C307,528 313,536 320,541" stroke="#4a3018" strokeWidth="7" strokeLinecap="round" fill="none" strokeDasharray="30" strokeDashoffset={30*(1-tP)} style={{ transition:tr }}/>
            <path d="M286,522 Q300,517 314,522" stroke="#6a4830" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.5" strokeDasharray="32" strokeDashoffset={32*(1-tP)} style={{ transition:tr }}/>

            {/* Trunk */}
            <path d="M292,524 C290,462 294,398 286,330 C282,270 288,214 284,150" stroke="#3a2005" strokeWidth="9" strokeLinecap="round" fill="none" opacity="0.22" strokeDasharray="394" strokeDashoffset={394*(1-tP)} style={{ transition:tr }}/>
            <path d="M300,524 C298,462 305,398 296,330 C290,269 298,214 294,152 C290,116 298,96 298,72" stroke="#5a3a1f" strokeWidth="28" strokeLinecap="round" fill="none" strokeDasharray="552" strokeDashoffset={552*(1-tP)} style={{ transition:tr }}/>
            <path d="M308,524 C307,462 310,398 306,330 C304,269 308,214 306,152 C305,122 307,102 307,80" stroke="#a07248" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.45" strokeDasharray="450" strokeDashoffset={450*(1-tP)} style={{ transition:tr }}/>
            <path d="M286,524 C284,462 288,398 282,330 C280,269 284,214 282,152 C280,122 284,102 284,80" stroke="#2a1808" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.35" strokeDasharray="450" strokeDashoffset={450*(1-tP)} style={{ transition:tr }}/>

            {/* Trunk dynamic side-light — warm rim on sun-facing side */}
            {rimLightOp > 0.1 && (
              <path
                d="M300,524 C298,462 305,398 296,330 C290,269 298,214 294,152 C290,116 298,96 298,72"
                stroke={duskOp > 0.5 ? '#ffb070' : '#ffe8a8'}
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
                opacity={rimLightOp * 0.5}
                transform={`translate(${rimLightX * 8}, 0)`}
                style={{ transition: 'opacity 4s, transform 4s, stroke 4s' }}
                strokeDasharray="552"
                strokeDashoffset={552*(1-tP)}
              />
            )}

            {/* Trunk shadow side — opposite the sun */}
            {dayOp > 0.2 && (
              <path
                d="M300,524 C298,462 305,398 296,330 C290,269 298,214 294,152 C290,116 298,96 298,72"
                stroke="rgba(20,12,4,0.6)"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
                opacity={dayOp * 0.4}
                transform={`translate(${-rimLightX * 10}, 0)`}
                style={{ transition: 'opacity 4s, transform 4s' }}
                strokeDasharray="552"
                strokeDashoffset={552*(1-tP)}
              />
            )}

            {/* Bark grain */}
            <g opacity={0.35 * detailP} style={{ transition:'opacity 1.5s' }}>
              <path d="M292,440 Q290,400 293,360" stroke="#3a2005" strokeWidth="1" fill="none" strokeLinecap="round"/>
              <path d="M298,470 Q296,420 299,370 Q301,320 297,270" stroke="#3a2005" strokeWidth="1" fill="none" strokeLinecap="round"/>
              <path d="M304,440 Q303,390 305,340" stroke="#3a2005" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
              <path d="M295,250 Q297,210 295,170 Q294,130 296,100" stroke="#3a2005" strokeWidth="1" fill="none" strokeLinecap="round"/>
              <path d="M302,260 Q303,220 301,180 Q302,140 303,110" stroke="#3a2005" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
              <path d="M289,495 Q288,475 290,455" stroke="#3a2005" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
              <path d="M306,395 Q304,375 307,355" stroke="#3a2005" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
            </g>

            {/* Bark mottling */}
            <g opacity={0.55 * detailP} style={{ transition:'opacity 1.5s' }}>
              <ellipse cx="291" cy="480" rx="4" ry="2" fill="#2a1808" opacity="0.5"/>
              <ellipse cx="299" cy="455" rx="3.5" ry="1.8" fill="#2a1808" opacity="0.4"/>
              <ellipse cx="293" cy="425" rx="3" ry="1.5" fill="#2a1808" opacity="0.5"/>
              <ellipse cx="301" cy="385" rx="4" ry="2" fill="#2a1808" opacity="0.45"/>
              <ellipse cx="288" cy="365" rx="3" ry="1.5" fill="#2a1808" opacity="0.4"/>
              <ellipse cx="297" cy="305" rx="3.5" ry="1.8" fill="#2a1808" opacity="0.5"/>
              <ellipse cx="294" cy="275" rx="3" ry="1.6" fill="#2a1808" opacity="0.4"/>
              <ellipse cx="300" cy="200" rx="2.5" ry="1.4" fill="#2a1808" opacity="0.45"/>
              <ellipse cx="295" cy="180" rx="2.8" ry="1.5" fill="#2a1808" opacity="0.4"/>
              <ellipse cx="298" cy="145" rx="2.5" ry="1.3" fill="#2a1808" opacity="0.5"/>
              <ellipse cx="296" cy="115" rx="2.2" ry="1.2" fill="#2a1808" opacity="0.4"/>
            </g>

            {/* Bark highlights */}
            <g opacity={0.6 * detailP} style={{ transition:'opacity 1.5s' }}>
              <ellipse cx="310" cy="465" rx="2" ry="1" fill="#c4946a" opacity="0.5"/>
              <ellipse cx="311" cy="420" rx="2.5" ry="1.2" fill="#c4946a" opacity="0.55"/>
              <ellipse cx="312" cy="370" rx="2" ry="1" fill="#c4946a" opacity="0.5"/>
              <ellipse cx="310" cy="320" rx="2" ry="1" fill="#c4946a" opacity="0.45"/>
              <ellipse cx="311" cy="260" rx="1.8" ry="0.9" fill="#c4946a" opacity="0.55"/>
              <ellipse cx="309" cy="210" rx="1.6" ry="0.8" fill="#c4946a" opacity="0.5"/>
              <ellipse cx="310" cy="160" rx="1.4" ry="0.7" fill="#c4946a" opacity="0.45"/>
              <ellipse cx="309" cy="120" rx="1.3" ry="0.7" fill="#c4946a" opacity="0.4"/>
            </g>

            {/* Moss */}
            <g opacity={detailP * 0.85} style={{ transition:'opacity 1.5s' }}>
              <ellipse cx="289" cy="510" rx="9" ry="3" fill="#5a7a3a" opacity="0.7"/>
              <ellipse cx="290" cy="508" rx="6" ry="2" fill="#7a9a4a" opacity="0.55"/>
              <ellipse cx="310" cy="513" rx="7" ry="2.5" fill="#5a7a3a" opacity="0.65"/>
              <ellipse cx="310" cy="511" rx="4.5" ry="1.5" fill="#7a9a4a" opacity="0.5"/>
              <ellipse cx="285" cy="490" rx="5" ry="2" fill="#5a7a3a" opacity="0.55"/>
              <circle cx="216" cy="521" r="2" fill="#5a7a3a" opacity="0.6"/>
              <circle cx="218" cy="521" r="1.2" fill="#7a9a4a" opacity="0.5"/>
              <circle cx="384" cy="525" r="2" fill="#5a7a3a" opacity="0.55"/>
              <circle cx="386" cy="525" r="1.2" fill="#7a9a4a" opacity="0.45"/>
            </g>

            {/* Bark fissures */}
            <g opacity={detailP * 0.45} style={{ transition:'opacity 1.5s' }}>
              <path d="M292,510 Q291,460 293,410 Q295,360 292,310 Q291,260 293,210 Q295,160 293,110" stroke="#1a0e02" strokeWidth="0.6" fill="none" strokeLinecap="round"/>
              <path d="M300,510 Q299,460 301,410 Q303,360 300,310 Q299,260 301,210 Q303,160 301,110" stroke="#1a0e02" strokeWidth="0.6" fill="none" strokeLinecap="round"/>
              <path d="M306,510 Q305,460 307,410 Q309,360 306,310 Q305,260 307,210 Q309,160 307,110" stroke="#1a0e02" strokeWidth="0.5" fill="none" strokeLinecap="round"/>
            </g>

            {/* Knots */}
            <g opacity={detailP} style={{ transition:'opacity 1.5s' }}>
              <ellipse cx="295" cy="340" rx="5" ry="3" fill="#2a1808"/>
              <ellipse cx="295" cy="340" rx="3" ry="1.5" fill="#5a3a1f"/>
              <ellipse cx="304" cy="220" rx="3.5" ry="2.2" fill="#2a1808"/>
              <ellipse cx="304" cy="220" rx="2" ry="1" fill="#5a3a1f"/>
            </g>

            {/* Hollow */}
            <g opacity={detailP * 0.8} style={{ transition:'opacity 1.5s' }}>
              <ellipse cx="290" cy="400" rx="6" ry="9" fill="#1a0e02"/>
              <ellipse cx="290" cy="402" rx="4" ry="7" fill="#0a0500"/>
            </g>

            {/* Main branches */}
            <path d="M296,332 C264,309 220,276 170,246 C144,229 108,214 74,202" stroke="#5a3818" strokeWidth="15" strokeLinecap="round" fill="none" strokeDasharray="305" strokeDashoffset={305*(1-brP)} style={{ transition:tr }}/>
            <path d="M304,346 C342,324 383,291 422,266 C454,244 492,232 526,222" stroke="#5a3818" strokeWidth="15" strokeLinecap="round" fill="none" strokeDasharray="305" strokeDashoffset={305*(1-brP)} style={{ transition:tr }}/>
            <path d="M296,254 C278,220 258,182 240,144 C224,110 218,80 216,50" stroke="#5a3818" strokeWidth="13" strokeLinecap="round" fill="none" strokeDasharray="290" strokeDashoffset={290*(1-brP)} style={{ transition:tr }}/>
            <path d="M302,244 C320,211 344,174 364,142 C380,114 400,88 420,60" stroke="#5a3818" strokeWidth="13" strokeLinecap="round" fill="none" strokeDasharray="290" strokeDashoffset={290*(1-brP)} style={{ transition:tr }}/>
            <path d="M298,330 C268,308 224,276 174,246" stroke="#a07248" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.4" strokeDasharray="180" strokeDashoffset={180*(1-brP)} style={{ transition:tr }}/>
            <path d="M306,344 C346,322 388,290 430,266" stroke="#a07248" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.4" strokeDasharray="180" strokeDashoffset={180*(1-brP)} style={{ transition:tr }}/>

            {/* Sub-branches */}
            <path d="M198,274 C175,242 152,212 104,170" stroke="#6a4828" strokeWidth="9" strokeLinecap="round" fill="none" strokeDasharray="188" strokeDashoffset={188*(1-sbP)} style={{ transition:tr }}/>
            <path d="M144,240 C124,264 96,280 50,290" stroke="#6a4828" strokeWidth="8" strokeLinecap="round" fill="none" strokeDasharray="162" strokeDashoffset={162*(1-sbP)} style={{ transition:tr }}/>
            <path d="M384,298 C418,264 452,234 498,194" stroke="#6a4828" strokeWidth="9" strokeLinecap="round" fill="none" strokeDasharray="188" strokeDashoffset={188*(1-sbP)} style={{ transition:tr }}/>
            <path d="M434,262 C452,221 470,182 524,150" stroke="#6a4828" strokeWidth="8" strokeLinecap="round" fill="none" strokeDasharray="184" strokeDashoffset={184*(1-sbP)} style={{ transition:tr }}/>
            <path d="M266,184 C236,160 190,132 146,110" stroke="#6a4828" strokeWidth="9" strokeLinecap="round" fill="none" strokeDasharray="165" strokeDashoffset={165*(1-sbP)} style={{ transition:tr }}/>
            <path d="M247,134 C272,104 320,84 370,62" stroke="#6a4828" strokeWidth="8" strokeLinecap="round" fill="none" strokeDasharray="165" strokeDashoffset={165*(1-sbP)} style={{ transition:tr }}/>
            <path d="M120,188 C102,164 86,147 62,132" stroke="#6a4828" strokeWidth="7" strokeLinecap="round" fill="none" strokeDasharray="104" strokeDashoffset={104*(1-sbP)} style={{ transition:tr }}/>
            <path d="M462,240 C476,216 494,196 518,178" stroke="#6a4828" strokeWidth="7" strokeLinecap="round" fill="none" strokeDasharray="104" strokeDashoffset={104*(1-sbP)} style={{ transition:tr }}/>

            {/* Tertiary twigs */}
            {TWIGS.map((d, i) => (
              <path key={`tw${i}`} d={d} stroke="#7a5638" strokeWidth="2.5" strokeLinecap="round" fill="none"
                strokeDasharray={TWIG_DASH} strokeDashoffset={TWIG_DASH*(1-twigP)} style={{ transition:tr }}/>
            ))}

            {/* Quaternary twigs */}
            {FINE_TWIGS.map((d, i) => (
              <path key={`ft${i}`} d={d} stroke="#8a6850" strokeWidth="1.4" strokeLinecap="round" fill="none"
                strokeDasharray={FINE_TWIG_DASH} strokeDashoffset={FINE_TWIG_DASH*(1-fineTwigP)} style={{ transition:tr }} opacity="0.85"/>
            ))}

            {/* Vine */}
            <g opacity={detailP * 0.85} style={{ transition:'opacity 1.5s' }}>
              <path d="M180,250 Q176,290 178,330 Q180,360 178,388" stroke={theme.leafMid} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.65"/>
              <ellipse cx="174" cy="270" rx="3" ry="2" fill={theme.leafLight} opacity="0.8" transform="rotate(-30 174 270)"/>
              <ellipse cx="180" cy="295" rx="3" ry="2" fill={theme.leafLight} opacity="0.8" transform="rotate(20 180 295)"/>
              <ellipse cx="174" cy="320" rx="3" ry="2" fill={theme.leafLight} opacity="0.8" transform="rotate(-20 174 320)"/>
              <ellipse cx="180" cy="345" rx="3" ry="2" fill={theme.leafLight} opacity="0.8" transform="rotate(30 180 345)"/>
              <ellipse cx="176" cy="372" rx="3" ry="2" fill={theme.leafLight} opacity="0.8" transform="rotate(-15 176 372)"/>
            </g>

            {/* Foliage */}
            {BLOBS.map((b, i) => (
              <path key={i} d={b.path} fill={b.col} opacity={b.op}
                style={{ transform:`scale(${scaleOf(b.ph)})`, transformOrigin:`${b.cx}px ${b.cy}px`, transition:trSlow }}/>
            ))}
            {BLOBS.filter(b => b.ph === 2).slice(0, 9).map((b, i) => (
              <ellipse key={`sp${i}`} cx={b.cx - b.r*0.26} cy={b.cy - b.r*0.32} rx={b.r*0.2} ry={b.r*0.13} fill="rgba(255,255,255,0.18)"
                style={{ transform:`scale(${l3P})`, transformOrigin:`${b.cx}px ${b.cy}px`, transition:trSlow }}/>
            ))}

            {/* ═══════ DYNAMIC CANOPY RIM LIGHT ═══════
                Warm/cool highlight on the sun-facing side of each foliage blob. */}
            {rimLightOp > 0.1 && BLOBS.filter(b => b.ph === 2).map((b, i) => {
              // Offset toward the sun side
              const lx = b.cx + rimLightX * b.r * 0.55;
              const ly = b.cy - sunHeight * b.r * 0.3 - 4;
              return (
                <ellipse
                  key={`rim${i}`}
                  cx={lx}
                  cy={ly}
                  rx={b.r * 0.45}
                  ry={b.r * 0.25}
                  fill={duskOp > 0.5 ? '#ffd49a' : '#fff4c4'}
                  opacity={rimLightOp * l3P * 0.45}
                  style={{
                    transform: `scale(${l3P})`,
                    transformOrigin: `${b.cx}px ${b.cy}px`,
                    transition: 'cx 4s, cy 4s, opacity 4s, fill 4s',
                    filter: 'blur(2px)',
                  }}
                />
              );
            })}

            {/* ═══════ DYNAMIC CANOPY SHADOW SIDE ═══════
                Darker tint on the side away from the sun, for volume. */}
            {dayOp > 0.2 && BLOBS.filter(b => b.ph === 1 || b.ph === 0).map((b, i) => {
              const sx = b.cx - rimLightX * b.r * 0.5;
              const sy = b.cy + b.r * 0.2;
              return (
                <ellipse
                  key={`shd${i}`}
                  cx={sx}
                  cy={sy}
                  rx={b.r * 0.5}
                  ry={b.r * 0.35}
                  fill={nightOp > 0.3 ? 'rgba(20,20,60,0.5)' : 'rgba(30,20,10,0.32)'}
                  opacity={dayOp * scaleOf(b.ph) * 0.4}
                  style={{
                    transform: `scale(${scaleOf(b.ph)})`,
                    transformOrigin: `${b.cx}px ${b.cy}px`,
                    transition: 'cx 4s, opacity 4s, fill 4s',
                    filter: 'blur(3px)',
                  }}
                />
              );
            })}

            {/* Tiny leaf accents */}
            {l3P > 0.5 && BLOBS.filter(b => b.ph === 2).map((b, i) => (
              <g key={`leaf${i}`} opacity={l3P}>
                <ellipse cx={b.cx + b.r*0.7} cy={b.cy - b.r*0.2} rx="3.5" ry="2" fill={theme.leafLight} transform={`rotate(${30 + i*22} ${b.cx + b.r*0.7} ${b.cy - b.r*0.2})`}/>
                <ellipse cx={b.cx - b.r*0.6} cy={b.cy + b.r*0.3} rx="3" ry="1.8" fill={theme.leafLight} transform={`rotate(${-20 + i*15} ${b.cx - b.r*0.6} ${b.cy + b.r*0.3})`}/>
              </g>
            ))}
          </svg>
        </div>

        {/* Intention banner */}
        {intention && isActive && (
          <div style={{
            position:'absolute', top:28, left:28,
            background: 'rgba(250,246,237,0.86)',
            border: `0.5px solid ${line}`,
            borderRadius:10,
            padding:'7px 14px 7px 16px',
            maxWidth:'70%',
            zIndex:5,
            backdropFilter:'blur(6px)',
            display:'flex', alignItems:'center', gap:10,
          }}>
            <div style={{ width:18, height:1, background: theme.accentDeep }}/>
            <span style={{
              fontSize:13, fontWeight:400, color: ink,
              fontFamily: serif,
              fontStyle:'italic',
              overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
              letterSpacing:'0.01em',
            }}>
              {intention}
            </span>
          </div>
        )}
      </div>

      {/* ══ RIGHT PANEL ══ */}
      <div style={{
        position:'relative', flex:'1 1 50%', zIndex:4,
        display:'flex', alignItems:'center', justifyContent:'center',
        background: `linear-gradient(180deg, rgba(250,246,237,0.72) 0%, rgba(240,230,210,0.78) 100%)`,
        backdropFilter:'blur(14px) saturate(1.15)',
        WebkitBackdropFilter:'blur(14px) saturate(1.15)',
        borderLeft: `0.5px solid ${line}`,
        boxShadow:'-8px 0 40px rgba(45,36,24,0.06)',
        overflow:'hidden',
      }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.5), transparent 50%)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle at 70% 80%, rgba(184,97,52,0.04), transparent 50%)', pointerEvents:'none' }}/>

        {/* Top-right buttons */}
        <div style={{ position:'absolute', top:18, right:18, display:'flex', gap:8, zIndex:10 }}>
          <button onClick={() => setSoundOn(s => !s)} title={soundOn ? 'Sound on' : 'Sound off'} style={{
            width:34, height:34, borderRadius:'50%',
            border:`0.5px solid ${line}`,
            background: cream, cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:'0 1px 0 rgba(255,255,255,0.6) inset',
            color: ink2,
          }}>
            {soundOn ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
              </svg>
            )}
          </button>
          <button onClick={() => { setDraftMins(totalMins); setDraftCards(totalCards); setDraftTheme(themeKey); setShowSettings(true); }} title="Settings" style={{
            width:34, height:34, borderRadius:'50%',
            border:`0.5px solid ${line}`,
            background: cream, cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:'0 1px 0 rgba(255,255,255,0.6) inset',
            color: ink2,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </button>
        </div>

        <div style={{ width:'88%', maxWidth:380, display:'flex', flexDirection:'column', alignItems:'stretch', position:'relative', zIndex:1 }}>

          {/* Header */}
          <div style={{ textAlign:'center', marginBottom:14 }}>
            <div style={{ fontSize:10, fontWeight:600, color: ink3, letterSpacing:'0.32em', textTransform:'uppercase', marginBottom:8, fontFamily: sans }}>
              {isActive ? 'In Session' : timeLeft === totalSeconds ? 'A new session' : timeLeft <= 0 ? 'Complete' : 'Paused'}
            </div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}>
              <div style={{ width:30, height:1, background: line }}/>
              <svg width="14" height="14" viewBox="0 0 14 14">
                <circle cx="7" cy="7" r="2.5" fill={theme.accent}/>
                <circle cx="7" cy="7" r="5.5" fill="none" stroke={theme.accent} strokeWidth="0.6" opacity="0.5"/>
              </svg>
              <div style={{ width:30, height:1, background: line }}/>
            </div>
          </div>

          {!isActive && timeLeft === totalSeconds && (
            <input
              type="text"
              placeholder="What are you focusing on?"
              value={intention}
              onChange={e => setIntention(e.target.value.slice(0, 60))}
              style={{
                width:'100%',
                padding:'10px 16px',
                fontSize:13,
                fontStyle:'italic',
                fontFamily: serif,
                border:`0.5px solid ${line}`,
                background: 'rgba(255,255,255,0.5)',
                borderRadius:10,
                color: ink,
                outline:'none',
                marginBottom:14,
                textAlign:'center',
                boxSizing:'border-box',
              }}
            />
          )}

          {/* Main timer */}
          <div style={{ display:'flex', alignItems:'baseline', justifyContent:'center', gap:2, marginBottom:2, position:'relative' }}>
            <span style={{
              fontSize:88, fontWeight:400, color: ink,
              letterSpacing:'-0.04em', lineHeight:0.95,
              fontFamily: serif, fontVariationSettings:'"opsz" 144',
            }}>
              {mins}
            </span>
            <span style={{ fontSize:44, fontWeight:300, color: ink3, fontFamily: serif }}>
              :{secs<10?`0${secs}`:secs}
            </span>
            <svg width="130" height="130" viewBox="0 0 130 130" style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', pointerEvents:'none', opacity:0.16 }}>
              <circle cx="65" cy="65" r="60" fill="none" stroke={ink3} strokeWidth="1.5"/>
              <circle cx="65" cy="65" r="60" fill="none" stroke={theme.accentDeep} strokeWidth="1.5"
                strokeDasharray={`${2*Math.PI*60}`} strokeDashoffset={2*Math.PI*60*(1-progress)}
                strokeLinecap="round" transform="rotate(-90 65 65)" style={{ transition:'stroke-dashoffset 1s linear' }}/>
            </svg>
          </div>
          <p style={{ fontSize:9, color: ink3, marginBottom:14, marginTop:0, letterSpacing:'0.32em', textTransform:'uppercase', textAlign:'center', fontFamily: sans }}>remaining</p>

          {/* Per-card timer */}
          <div style={{ ...cardStyle, marginBottom:12 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
              <span style={{ fontSize:9, fontWeight:600, letterSpacing:'0.22em', color: ink3, textTransform:'uppercase', fontFamily: sans }}>
                {cardsDone >= totalCards ? 'All cards done' : `Card ${Math.min(cardsDone+1, totalCards)} timer`}
              </span>
              <span style={{
                fontSize:20, fontWeight:400, fontFamily: serif,
                color: cardUrgent ? '#b03020' : ink,
                animation: cardUrgent ? 'urgentPulse 0.8s ease-in-out infinite' : 'none',
                letterSpacing:'-0.02em',
              }}>
                {cardMins>0?`${cardMins}:`:''}
                {cardMins>0?(cardSecs<10?`0${cardSecs}`:cardSecs):cardSecs}
                <span style={{ fontSize:10, fontWeight:300, color: ink3, marginLeft:2, fontStyle:'italic' }}>s</span>
              </span>
            </div>
            <div style={{ height:3, background:'rgba(45,36,24,0.08)', borderRadius:2, overflow:'hidden' }}>
              <div style={{
                height:'100%', borderRadius:2,
                background: cardUrgent ? '#b03020' : theme.accent,
                width:`${cardPct*100}%`,
                transition:'width 1s linear, background 0.5s',
              }}/>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', marginTop:6 }}>
              <span style={{ fontSize:9, color: ink3, letterSpacing:'0.06em', fontFamily: sans }}>
                {Math.floor(secsPerCard/60)}m {Math.round(secsPerCard%60)}s allotted
              </span>
              {cardUrgent && <span style={{ fontSize:9, color:'#b03020', fontWeight:600, letterSpacing:'0.1em', animation:'urgentPulse 0.8s ease-in-out infinite', fontFamily: sans, textTransform:'uppercase' }}>move on</span>}
            </div>
          </div>

          {/* Done / Redo */}
          <div style={{ display:'flex', gap:8, marginBottom:12 }}>
            <button
              onClick={completeCard}
              disabled={!isActive || cardsDone >= totalCards || timeLeft <= 0}
              style={{
                flex:'2 1 0',
                padding:'12px 14px',
                borderRadius:12,
                border: 'none',
                cursor: (!isActive || cardsDone >= totalCards || timeLeft <= 0) ? 'not-allowed' : 'pointer',
                background: (!isActive || cardsDone >= totalCards || timeLeft <= 0) ? 'rgba(45,36,24,0.06)' : theme.accentDeep,
                color: (!isActive || cardsDone >= totalCards || timeLeft <= 0) ? ink3 : cream,
                fontSize:11, fontWeight:500, letterSpacing:'0.16em',
                textTransform:'uppercase',
                fontFamily: sans,
                boxShadow: (!isActive || cardsDone >= totalCards || timeLeft <= 0) ? 'none' : `0 6px 18px ${theme.accentDeep}33`,
                transition:'all 0.2s ease',
                display:'flex', alignItems:'center', justifyContent:'center', gap:8,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2,7.5 L5.5,11 L12,3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Done
              {isActive && <span style={{ fontSize:9, opacity:0.6, letterSpacing:'0.2em', fontFamily: sans }}>D</span>}
            </button>
            <button
              onClick={redoCard}
              disabled={!isActive || timeLeft <= 0}
              style={{
                flex:'1 1 0',
                padding:'12px 10px',
                borderRadius:12,
                border: `0.5px solid ${line}`,
                cursor: (!isActive || timeLeft <= 0) ? 'not-allowed' : 'pointer',
                background: (!isActive || timeLeft <= 0) ? 'rgba(45,36,24,0.04)' : cream,
                color: (!isActive || timeLeft <= 0) ? ink3 : ink2,
                fontSize:10, fontWeight:500, letterSpacing:'0.16em',
                textTransform:'uppercase',
                fontFamily: sans,
                transition:'all 0.2s ease',
                display:'flex', alignItems:'center', justifyContent:'center', gap:6,
                boxShadow:'0 1px 0 rgba(255,255,255,0.6) inset',
              }}
            >
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M11,5 A4.5,4.5 0 1,0 11,9 M11,3 L11,5 L9,5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
              Redo
              {isActive && <span style={{ fontSize:9, opacity:0.55, letterSpacing:'0.2em', fontFamily: sans }}>F</span>}
            </button>
          </div>

          {/* Play / reset */}
          <div style={{ display:'flex', gap:12, marginBottom:14, justifyContent:'center' }}>
            <button onClick={toggle} disabled={timeLeft <= 0} style={{
              width:48, height:48, borderRadius:'50%', border:'none',
              cursor: timeLeft <= 0 ? 'not-allowed' : 'pointer',
              background: timeLeft <= 0 ? 'rgba(45,36,24,0.15)' : isActive ? '#c4965a' : theme.accent,
              color: cream, display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow: timeLeft <= 0 ? 'none' : isActive ? '0 6px 18px rgba(196,150,90,0.4)' : `0 6px 18px ${theme.accent}66`,
              transition:'all 0.25s ease',
            }}>
              {isActive
                ? <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
                : <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4l13 8-13 8z"/></svg>
              }
            </button>
            <button onClick={reset} style={{
              width:48, height:48, borderRadius:'50%',
              border:`0.5px solid ${line}`,
              background: cream, cursor:'pointer', color: ink2,
              display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow:'0 1px 0 rgba(255,255,255,0.6) inset', transition:'all 0.25s ease',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
              </svg>
            </button>
          </div>

          {/* Cards left */}
          <div style={{ ...cardStyle, marginBottom:10 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:10 }}>
              <span style={{ fontSize:9, fontWeight:600, letterSpacing:'0.22em', color: ink3, textTransform:'uppercase', fontFamily: sans }}>
                Cards left
              </span>
              <div style={{ display:'flex', alignItems:'baseline', gap:5 }}>
                <span style={{
                  fontSize:24, fontWeight:400, lineHeight:1, fontFamily: serif,
                  letterSpacing:'-0.02em',
                  color: cardsLeft === 0 ? theme.accentDeep : ink,
                }}>{cardsLeft}</span>
                <span style={{ fontSize:11, color: ink3, fontFamily: serif, fontStyle:'italic' }}>of {totalCards}</span>
              </div>
            </div>

            {cardsLeft > 0 && (
              <div style={{ display:'flex', gap:14, marginBottom:10, fontSize:10, fontFamily: sans, color: ink2, letterSpacing:'0.02em' }}>
                <span style={{ display:'inline-flex', alignItems:'center', gap:5 }}>
                  <div style={{ width:7, height:7, borderRadius:'50%', background: theme.accent }}/>
                  <span style={{ fontVariantNumeric:'tabular-nums' }}>{freshLeft}</span>
                  <span style={{ color: ink3 }}>fresh</span>
                </span>
                {reviewLeft > 0 && (
                  <span style={{ display:'inline-flex', alignItems:'center', gap:5 }}>
                    <div style={{ width:7, height:7, borderRadius:'50%', background: '#c4965a' }}/>
                    <span style={{ fontVariantNumeric:'tabular-nums' }}>{reviewLeft}</span>
                    <span style={{ color: ink3 }}>review</span>
                  </span>
                )}
              </div>
            )}

            {isActive && cardsLeft > 0 && (
              <div style={{
                display:'flex', alignItems:'center', gap:7,
                padding:'6px 10px', marginBottom:10,
                background: paceConfig.bg,
                border:`0.5px solid ${paceConfig.col}33`,
                borderRadius:8,
                fontSize:10, fontFamily: sans, color: paceConfig.col,
                letterSpacing:'0.04em', fontWeight:500,
              }}>
                {pace === 'ahead' && (
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path d="M5.5,2 L5.5,9 M2.5,5 L5.5,2 L8.5,5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
                {pace === 'behind' && (
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path d="M5.5,9 L5.5,2 M2.5,6 L5.5,9 L8.5,6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
                {pace === 'onpace' && (
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <circle cx="5.5" cy="5.5" r="3" fill="currentColor"/>
                  </svg>
                )}
                <span>{paceConfig.label}</span>
              </div>
            )}

            <div style={{ height:2, background:'rgba(45,36,24,0.08)', borderRadius:2, marginBottom:10, overflow:'hidden' }}>
              <div style={{ height:'100%', background: theme.accent, borderRadius:2, width:`${cardsProgress*100}%`, transition:'width 0.6s cubic-bezier(0.34,1.56,0.64,1)', boxShadow: cardsProgress > 0 ? `0 0 6px ${theme.glow}0.6)` : 'none' }}/>
            </div>

            <div style={{
              display:'grid',
              gridTemplateColumns: totalCards <= 30 ? 'repeat(10,1fr)' : totalCards <= 60 ? 'repeat(15,1fr)' : 'repeat(20,1fr)',
              gap: totalCards <= 30 ? '5px 3px' : totalCards <= 60 ? '4px 2px' : '3px 1.5px',
            }}>
              {Array.from({ length: totalCards }).map((_, i) => {
                const harvested = i < cardsDone;
                const isNext = i === cardsDone && cardsDone < totalCards;
                const expectedDot = i < expectedCards && i >= cardsDone;
                const dotSize = totalCards <= 30 ? (isNext?9:harvested?7:5) : totalCards <= 60 ? (isNext?7:harvested?5:4) : (isNext?5:harvested?4:3);
                return (
                  <div key={i} style={{ display:'flex', justifyContent:'center', alignItems:'center', height: totalCards <= 30 ? 10 : totalCards <= 60 ? 8 : 6 }}>
                    <div style={{
                      width: dotSize, height: dotSize, borderRadius:'50%',
                      background: harvested ? theme.accent : isNext ? theme.accentDeep : expectedDot ? 'rgba(176,48,32,0.3)' : 'rgba(45,36,24,0.14)',
                      boxShadow: harvested ? `0 0 4px ${theme.glow}0.6)` : 'none',
                      transition:'all 0.5s cubic-bezier(0.34,1.56,0.64,1)',
                      animation: isNext ? 'breathe 1.6s ease-in-out infinite' : 'none',
                    }}/>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Today's grove */}
          {sessionsToday.length > 0 && (
            <div style={{ ...cardStyle, marginBottom:10, padding:'10px 16px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:7 }}>
                <span style={{ fontSize:9, fontWeight:600, letterSpacing:'0.22em', color: ink3, textTransform:'uppercase', fontFamily: sans }}>
                  Today's grove
                </span>
                <span style={{ fontSize:11, fontWeight:400, color: theme.accentDeep, fontFamily: serif, fontStyle:'italic' }}>
                  {sessionsToday.length} {sessionsToday.length === 1 ? 'tree' : 'trees'}
                </span>
              </div>
              <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                {sessionsToday.map((th, i) => {
                  const t = THEMES[th];
                  return (
                    <svg key={i} width="22" height="26" viewBox="0 0 22 26" style={{ animation:`treePop 0.5s cubic-bezier(0.34,1.56,0.64,1) ${i*0.05}s both` }}>
                      <rect x="9" y="14" width="4" height="10" fill="#5a3a1f" rx="0.5"/>
                      <circle cx="11" cy="10" r="8" fill={t.leafMid}/>
                      <circle cx="7" cy="8" r="5" fill={t.leafLight}/>
                      <circle cx="14" cy="9" r="4" fill={t.leafLight}/>
                    </svg>
                  );
                })}
              </div>
            </div>
          )}

          {/* Footer */}
          <div style={{ textAlign:'center', marginTop:4 }}>
            <span style={{
              fontSize:10, color: ink3, letterSpacing:'0.18em',
              fontFamily: sans, textTransform:'uppercase',
              display:'inline-flex', alignItems:'center', gap:8,
            }}>
              <div style={{ width:5, height:5, borderRadius:'50%', background: isActive ? theme.accent : 'rgba(45,36,24,0.2)', transition:'background 0.5s' }}/>
              {totalMins} min · {totalCards} cards · {theme.name}
            </span>
            <div style={{ fontSize:9, color: ink3, marginTop:5, letterSpacing:'0.12em', fontFamily: sans, opacity:0.7 }}>
              Space · D · F · R · S
            </div>
          </div>
        </div>
      </div>

      {/* Focus check */}
      {focusRespCountdown !== null && (
        <div style={{ position:'fixed', inset:0, zIndex:100, pointerEvents:'auto' }}>
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle at 25% 65%, transparent 0%, rgba(45,36,24,0.25) 70%)', pointerEvents:'none' }}/>
          <div style={{
            position:'absolute', bottom:'8%', left:'4%',
            display:'flex', alignItems:'flex-end', gap:14,
            animation:'foxPeek 0.5s cubic-bezier(0.34,1.56,0.64,1)',
          }}>
            <svg width="92" height="100" viewBox="0 0 92 100" style={{ flexShrink:0 }}>
              <path d="M14,72 Q4,60 6,46 Q10,38 18,42 Q24,52 22,66 Z" fill="#c4521e"/>
              <path d="M8,52 Q12,46 16,48" stroke="#fef0d8" strokeWidth="2" fill="none" strokeLinecap="round"/>
              <ellipse cx="46" cy="68" rx="28" ry="22" fill="#d4621e"/>
              <ellipse cx="46" cy="78" rx="20" ry="10" fill="#fef0d8" opacity="0.9"/>
              <rect x="32" y="80" width="6" height="14" rx="2" fill="#a04210"/>
              <rect x="56" y="80" width="6" height="14" rx="2" fill="#a04210"/>
              <ellipse cx="62" cy="44" rx="22" ry="20" fill="#d4621e"/>
              <path d="M48,30 L42,12 L56,24 Z" fill="#d4621e"/>
              <path d="M48,28 L46,18 L52,24 Z" fill="#1a0e02"/>
              <path d="M76,30 L82,12 L68,24 Z" fill="#d4621e"/>
              <path d="M76,28 L78,18 L72,24 Z" fill="#1a0e02"/>
              <path d="M48,48 Q56,58 62,52 Q68,58 76,48 Q72,40 62,42 Q52,40 48,48 Z" fill="#fef0d8"/>
              <ellipse cx="54" cy="42" rx="2.2" ry={focusRespCountdown <= 5 ? 0.4 : 2.5} fill="#1a0e02">
                <animate attributeName="ry" values={`2.5;0.4;2.5`} dur="2s" repeatCount="indefinite"/>
              </ellipse>
              <ellipse cx="70" cy="42" rx="2.2" ry={focusRespCountdown <= 5 ? 0.4 : 2.5} fill="#1a0e02">
                <animate attributeName="ry" values={`2.5;0.4;2.5`} dur="2s" repeatCount="indefinite" begin="0.1s"/>
              </ellipse>
              <ellipse cx="62" cy="51" rx="2" ry="1.5" fill="#1a0e02"/>
              <path d="M62,52 L62,55 M62,55 Q60,57 58,57 M62,55 Q64,57 66,57" stroke="#1a0e02" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
              <line x1="50" y1="52" x2="40" y2="50" stroke="#1a0e02" strokeWidth="0.5"/>
              <line x1="50" y1="54" x2="40" y2="55" stroke="#1a0e02" strokeWidth="0.5"/>
              <line x1="74" y1="52" x2="84" y2="50" stroke="#1a0e02" strokeWidth="0.5"/>
              <line x1="74" y1="54" x2="84" y2="55" stroke="#1a0e02" strokeWidth="0.5"/>
            </svg>

            <div style={{
              position:'relative',
              background: cream,
              border:`0.5px solid ${line}`,
              borderRadius:16,
              padding:'14px 18px',
              maxWidth:280,
              boxShadow:'0 8px 28px rgba(45,36,24,0.18)',
              marginBottom:24,
            }}>
              <div style={{
                position:'absolute', bottom:8, left:-9,
                width:0, height:0,
                borderTop:'6px solid transparent',
                borderBottom:'6px solid transparent',
                borderRight:`10px solid ${cream}`,
              }}/>
              <div style={{
                fontSize:15, fontWeight:400, color: ink,
                fontFamily: serif, lineHeight:1.35, letterSpacing:'-0.01em',
              }}>
                Still focused?
              </div>
              <p style={{
                fontSize:11, color: ink2, margin:'4px 0 10px 0', lineHeight:1.5,
                fontStyle:'italic', fontFamily: serif,
              }}>
                I'll wait {focusRespCountdown}s, then tuck in for a nap.
              </p>
              <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                <button onClick={dismissFocusCheck} style={{
                  background: theme.accentDeep, color: cream, border:'none', borderRadius:8,
                  padding:'7px 14px', fontSize:10, fontWeight:500, cursor:'pointer',
                  letterSpacing:'0.16em', textTransform:'uppercase', fontFamily: sans,
                }}>
                  Yes, I'm here
                </button>
                <button onClick={() => { setFocusRespCountdown(null); setIsActive(false); }} style={{
                  background:'transparent', border:'none', color: ink3,
                  fontSize:11, cursor:'pointer', padding:'4px 6px',
                  fontStyle:'italic', fontFamily: serif,
                }}>break</button>
                <div style={{ marginLeft:'auto', position:'relative', width:24, height:24 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" style={{ transform:'rotate(-90deg)' }}>
                    <circle cx="12" cy="12" r="10" fill="none" stroke={line} strokeWidth="1.5"/>
                    <circle cx="12" cy="12" r="10" fill="none"
                      stroke={focusRespCountdown<=8?'#b03020':'#c4965a'}
                      strokeWidth="1.5" strokeLinecap="round"
                      strokeDasharray={`${2*Math.PI*10}`}
                      strokeDashoffset={2*Math.PI*10*(1-focusRespCountdown/FOCUS_RESPONSE_WINDOW)}
                      style={{ transition:'stroke-dashoffset 1s linear, stroke 0.5s' }}/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Completion modal */}
      {showCelebration && (
        <div style={{ position:'fixed', inset:0, zIndex:99, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(45,36,24,0.45)', backdropFilter:'blur(8px)', animation:'fadeIn 0.4s ease-out' }}>
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={i} style={{
              position:'absolute', top:'-20px',
              left:`${(i*1.97)%100}%`,
              width: i%3===0 ? 7 : 5, height: i%3===0 ? 11 : 7,
              background: [theme.leafLight, theme.leafMid, '#fde68a', theme.accent, '#e9a8c0'][i%5],
              borderRadius: i%2===0 ? 1.5 : '50%',
              animation:`confettiFall ${3+(i%4)*0.5}s linear ${(i%10)*0.1}s forwards`,
            }}/>
          ))}
          <div style={{
            background: cream, border:`0.5px solid ${line}`,
            borderRadius:20, padding:'34px 38px',
            maxWidth:340, width:'90%',
            display:'flex', flexDirection:'column', alignItems:'center', gap:14,
            boxShadow:'0 24px 80px rgba(45,36,24,0.25)',
            animation:'celebrationPop 0.6s cubic-bezier(0.34,1.56,0.64,1)',
            textAlign:'center', zIndex:1,
          }}>
            <svg width="62" height="72" viewBox="0 0 22 26">
              <rect x="9" y="14" width="4" height="10" fill="#5a3a1f" rx="0.5"/>
              <circle cx="11" cy="10" r="8" fill={theme.leafMid}/>
              <circle cx="7" cy="8" r="5" fill={theme.leafLight}/>
              <circle cx="14" cy="9" r="4" fill={theme.leafLight}/>
            </svg>
            <div style={{ fontSize:26, fontWeight:400, color: ink, letterSpacing:'-0.02em', fontFamily: serif }}>
              {cardsDone >= totalCards ? 'All cards done' : 'Session complete'}
            </div>
            <p style={{ fontSize:13, color: ink2, margin:0, lineHeight:1.55, fontStyle:'italic', fontFamily: serif }}>
              {cardsDone} of {totalCards} cards{freshDone > 0 || reviewDone > 0 ? ` — ${freshDone} fresh, ${reviewDone} reviewed` : ''}.
              {timeLeft <= 0 && ' Full ' + totalMins + ' minutes.'}
            </p>
            {intention && (
              <div style={{ background:`${theme.accent}10`, padding:'8px 14px', borderRadius:8, fontSize:12, color: theme.accentDeep, fontStyle:'italic', fontFamily: serif, border:`0.5px solid ${theme.accent}33` }}>
                {intention}
              </div>
            )}
            <div style={{ display:'flex', gap:10, marginTop:6 }}>
              <button onClick={() => { setShowCelebration(false); reset(); }} style={{
                background: theme.accentDeep, color: cream, border:'none', borderRadius:10,
                padding:'10px 22px', fontSize:11, fontWeight:500, cursor:'pointer',
                letterSpacing:'0.18em', textTransform:'uppercase', fontFamily: sans,
                boxShadow:`0 5px 14px ${theme.accentDeep}55`,
              }}>
                Plant another
              </button>
              <button onClick={() => setShowCelebration(false)} style={{
                background: 'rgba(45,36,24,0.06)', border:'none', borderRadius:10,
                padding:'10px 22px', fontSize:11, fontWeight:500, cursor:'pointer', color: ink2,
                letterSpacing:'0.18em', textTransform:'uppercase', fontFamily: sans,
              }}>
                {timeLeft > 0 ? 'Keep going' : 'Admire it'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings */}
      {showSettings && (
        <div style={{ position:'fixed', inset:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(45,36,24,0.4)', backdropFilter:'blur(6px)' }}>
          <div style={{
            background: cream, border:`0.5px solid ${line}`,
            borderRadius:18, padding:'24px 28px 22px',
            maxWidth:380, width:'90%',
            display:'flex', flexDirection:'column', gap:18,
            boxShadow:'0 24px 80px rgba(45,36,24,0.25)',
            maxHeight:'90vh', overflowY:'auto',
          }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontSize:20, fontWeight:400, color: ink, fontFamily: serif, letterSpacing:'-0.02em' }}>Session</span>
              <button onClick={() => setShowSettings(false)} style={{ background:'none', border:'none', cursor:'pointer', color: ink3, fontSize:20, lineHeight:1, padding:4 }}>×</button>
            </div>

            <div>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                <span style={{ fontSize:10, fontWeight:600, color: ink3, letterSpacing:'0.18em', textTransform:'uppercase', fontFamily: sans }}>Duration</span>
                <span style={{ fontSize:14, fontWeight:400, color: THEMES[draftTheme].accentDeep, fontFamily: serif }}>{draftMins} min</span>
              </div>
              <input type="range" min={5} max={120} step={5} value={draftMins} onChange={e => setDraftMins(+e.target.value)} style={{ width:'100%', accentColor: THEMES[draftTheme].accentDeep, cursor:'pointer' }}/>
              <div style={{ display:'flex', justifyContent:'space-between', marginTop:4 }}>
                <span style={{ fontSize:10, color: ink3, fontFamily: sans }}>5</span>
                <span style={{ fontSize:10, color: ink3, fontFamily: sans }}>120</span>
              </div>
            </div>

            <div>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                <span style={{ fontSize:10, fontWeight:600, color: ink3, letterSpacing:'0.18em', textTransform:'uppercase', fontFamily: sans }}>Cards</span>
                <span style={{ fontSize:14, fontWeight:400, color: THEMES[draftTheme].accentDeep, fontFamily: serif }}>{draftCards}</span>
              </div>
              <input type="range" min={1} max={120} step={1} value={draftCards} onChange={e => setDraftCards(+e.target.value)} style={{ width:'100%', accentColor: THEMES[draftTheme].accentDeep, cursor:'pointer' }}/>
              <div style={{ display:'flex', justifyContent:'space-between', marginTop:4 }}>
                <span style={{ fontSize:10, color: ink3, fontFamily: sans }}>1</span>
                <span style={{ fontSize:10, color: ink3, fontFamily: sans }}>120</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize:10, fontWeight:600, color: ink3, marginBottom:9, letterSpacing:'0.18em', textTransform:'uppercase', fontFamily: sans }}>Tree</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
                {Object.entries(THEMES).map(([k, t]) => (
                  <button key={k} onClick={() => setDraftTheme(k)} style={{
                    border: draftTheme === k ? `1.5px solid ${t.accentDeep}` : `0.5px solid ${line}`,
                    background: draftTheme === k ? `${t.accent}15` : 'rgba(255,255,255,0.5)',
                    borderRadius:10, cursor:'pointer', padding:'10px 6px',
                    display:'flex', flexDirection:'column', alignItems:'center', gap:6,
                    transition:'all 0.2s',
                  }}>
                    <svg width="32" height="38" viewBox="0 0 22 26">
                      <rect x="9" y="14" width="4" height="10" fill="#5a3a1f" rx="0.5"/>
                      <circle cx="11" cy="10" r="8" fill={t.leafMid}/>
                      <circle cx="7" cy="8" r="5" fill={t.leafLight}/>
                      <circle cx="14" cy="9" r="4" fill={t.leafLight}/>
                    </svg>
                    <span style={{ fontSize:12, fontWeight:400, fontFamily: serif, color: draftTheme === k ? t.accentDeep : ink2, fontStyle: draftTheme === k ? 'normal' : 'italic' }}>{t.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ background: `${THEMES[draftTheme].accent}10`, borderRadius:10, padding:'10px 14px', border: `0.5px solid ${THEMES[draftTheme].accent}33` }}>
              <div style={{ fontSize:9, color: ink3, marginBottom:3, letterSpacing:'0.18em', textTransform:'uppercase', fontFamily: sans }}>Preview</div>
              <div style={{ fontSize:13, color: ink, fontFamily: serif, fontStyle:'italic' }}>
                {draftMins} min · {draftCards} cards · <span style={{ color: THEMES[draftTheme].accentDeep, fontStyle:'normal' }}>{Math.floor((draftMins*60/draftCards)/60)}m {Math.round((draftMins*60/draftCards)%60)}s</span> per card
              </div>
            </div>

            <button onClick={applySettings} style={{
              background: THEMES[draftTheme].accentDeep, color: cream, border:'none', borderRadius:10,
              padding:'12px', fontSize:11, fontWeight:500, cursor:'pointer',
              letterSpacing:'0.18em', textTransform:'uppercase', fontFamily: sans,
              boxShadow:`0 6px 18px ${THEMES[draftTheme].accentDeep}55`,
            }}>
              Apply
            </button>

            <div style={{ fontSize:9, color: ink3, textAlign:'center', letterSpacing:'0.12em', fontFamily: sans, textTransform:'uppercase', opacity:0.7 }}>
              Space play · D done · F redo · R reset · S settings
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,700;1,9..144,400;1,9..144,500&display=swap');
        @keyframes breathe { 0%,100% { transform:scale(1); opacity:1 } 50% { transform:scale(1.4); opacity:0.45 } }
        @keyframes spinRays { from { transform:translate(-50%,-50%) rotate(0deg) } to { transform:translate(-50%,-50%) rotate(360deg) } }
        @keyframes floatUp { 0% { transform:translateY(0) rotate(0deg); opacity:0.7 } 100% { transform:translateY(-280px) translateX(40px) rotate(320deg); opacity:0 } }
        @keyframes glowOrbRise { 0% { transform:translateY(0) scale(0.6); opacity:0 } 15% { opacity:1; transform:translateY(-30px) scale(1) } 85% { opacity:0.9; transform:translateY(-260px) scale(1.15) } 100% { transform:translateY(-340px) scale(0.9); opacity:0 } }
        @keyframes sparkBurst { 0% { opacity:1; transform:scale(0) } 100% { opacity:0; transform:scale(1) } }
        @keyframes urgentPulse { 0%,100% { opacity:1 } 50% { opacity:0.5 } }
        @keyframes twinkle { 0%,100% { opacity:0.3 } 50% { opacity:1 } }
        @keyframes birdFly { 0% { left:-50px; transform:translateY(0) } 50% { transform:translateY(-30px) } 100% { left:60%; transform:translateY(-10px) } }
        @keyframes wingFlap { 0%,100% { transform:scaleY(1) } 50% { transform:scaleY(0.6) } }
        @keyframes butterflyFly { 0% { left:-20px; transform:translateY(0) rotate(0deg) } 25% { transform:translateY(-25px) rotate(5deg) } 50% { transform:translateY(15px) rotate(-3deg) } 75% { transform:translateY(-15px) rotate(8deg) } 100% { left:55%; transform:translateY(0) } }
        @keyframes butterflyFlap { 0%,100% { transform:scaleX(1) } 50% { transform:scaleX(0.4) } }
        @keyframes butterflyBurst { 0% { transform:translate(0,0) scale(0); opacity:0 } 20% { opacity:1; transform:translate(0,0) scale(1) } 100% { transform:translate(var(--tx,80px), var(--ty,-120px)) scale(1) rotate(180deg); opacity:0 } }
        @keyframes fireflyFloat { 0%,100% { transform:translate(0,0); opacity:0.4 } 25% { transform:translate(20px,-15px); opacity:1 } 50% { transform:translate(-10px,-30px); opacity:0.6 } 75% { transform:translate(15px,-20px); opacity:0.9 } }
        @keyframes rainbowFade { 0% { opacity:0; transform:translateY(20px) } 25% { opacity:1; transform:translateY(0) } 80% { opacity:1 } 100% { opacity:0 } }
        @keyframes shootingStar { 0% { transform:rotate(20deg) translateX(0); opacity:0 } 10% { opacity:1 } 100% { transform:rotate(20deg) translateX(500px); opacity:0 } }
        @keyframes treeShake { 0%,100% { transform:translateX(0) } 15% { transform:translateX(-3px) rotate(-0.5deg) } 30% { transform:translateX(3px) rotate(0.5deg) } 45% { transform:translateX(-2px) } 60% { transform:translateX(2px) } 75% { transform:translateX(-1px) } }
        @keyframes treePop { 0% { transform:scale(0); opacity:0 } 100% { transform:scale(1); opacity:1 } }
        @keyframes confettiFall { 0% { transform:translateY(0) rotate(0); opacity:1 } 100% { transform:translateY(110vh) rotate(720deg); opacity:0.6 } }
        @keyframes celebrationPop { 0% { transform:scale(0.6); opacity:0 } 60% { transform:scale(1.05); opacity:1 } 100% { transform:scale(1) } }
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes petalFall { 0% { opacity:0; transform:translate(0,0) rotate(var(--rot)) } 15% { opacity:0.95 } 100% { opacity:0; transform:translate(var(--drift), 200px) rotate(calc(var(--rot) + 540deg)) } }
        @keyframes floaterRise { 0% { opacity:0; transform:translateY(0) scale(0.7) } 20% { opacity:1; transform:translateY(-10px) scale(1) } 100% { opacity:0; transform:translateY(-60px) scale(1.05) } }
        @keyframes leafDrift { 0% { left:-3%; transform:translateY(0) rotate(0deg); opacity:0 } 8% { opacity:0.85 } 50% { transform:translateY(40px) rotate(180deg) } 92% { opacity:0.75 } 100% { left:55%; transform:translateY(80px) rotate(540deg); opacity:0 } }
        @keyframes cloudDriftSlow { 0% { transform:translateX(0) } 100% { transform:translateX(60px) } }
        @keyframes foxPeek { 0% { transform:translateY(120px) scale(0.85); opacity:0 } 60% { transform:translateY(-8px) scale(1.03) } 100% { transform:translateY(0) scale(1); opacity:1 } }
        @keyframes dustDrift { 0%,100% { transform:translate(0,0); opacity:0.4 } 25% { transform:translate(8px,-12px); opacity:0.85 } 50% { transform:translate(-6px,-22px); opacity:0.6 } 75% { transform:translate(10px,-14px); opacity:0.8 } }
        input[type=range] { height:4px; border-radius:2px; }
      `}</style>
    </div>
  );
}
