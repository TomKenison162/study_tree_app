import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../api.js';
import TreeScene from '../components/TreeScene.jsx';
import RareGuest from '../components/RareGuest.jsx';
import { TREE_THEMES, TinyTreeIcon } from '../components/treeTypes.jsx';

/* ── AUDIO ── */
function playTone(ctx, freq, dur=0.5, type='sine', vol=0.18, when=0) {
  const t=ctx.currentTime+when;
  const osc=ctx.createOscillator(); const gain=ctx.createGain();
  osc.type=type; osc.frequency.value=freq;
  gain.gain.setValueAtTime(0,t);
  gain.gain.linearRampToValueAtTime(vol,t+0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001,t+dur);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t); osc.stop(t+dur);
}
const sounds = {
  done:      ctx => { playTone(ctx,880,0.18,'sine',0.10,0); playTone(ctx,1318.5,0.32,'sine',0.08,0.04); },
  redo:      ctx => playTone(ctx,587.3,0.22,'triangle',0.07,0),
  milestone: ctx => [523.25,659.25,783.99,1046.5].forEach((f,i)=>playTone(ctx,f,0.6,'triangle',0.09,i*0.08)),
  complete:  ctx => [523.25,659.25,783.99,1046.5,1318.5].forEach((f,i)=>playTone(ctx,f,0.9,'triangle',0.12,i*0.10)),
};

const FOCUS_CHECK_INTERVAL  = 8*60;
const FOCUS_RESPONSE_WINDOW = 20;
const IDLE_BASE_SECONDS     = 90;
const c01 = (v,a,b) => Math.max(0,Math.min(1,(v-a)/(b-a)));

/* ── RAIN AUDIO ── */
function startRainAudio(ctx) {
  const sr  = ctx.sampleRate;
  const len = sr * 4;
  const buf = ctx.createBuffer(2, len, sr);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
    for (let i = 0; i < len; i++) {
      const w = Math.random()*2-1;
      b0=0.99886*b0+w*0.0555179; b1=0.99332*b1+w*0.0750759;
      b2=0.96900*b2+w*0.1538520; b3=0.86650*b3+w*0.3104856;
      b4=0.55000*b4+w*0.5329522; b5=-0.7616*b5-w*0.0168980;
      d[i]=(b0+b1+b2+b3+b4+b5+b6+w*0.5362)*0.10;
      b6=w*0.115926;
    }
  }
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.loop   = true;
  const lp = ctx.createBiquadFilter(); lp.type='lowpass';  lp.frequency.value=950; lp.Q.value=0.3;
  const hp = ctx.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=130;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.30, ctx.currentTime+1.4);
  src.connect(lp); lp.connect(hp); hp.connect(gain); gain.connect(ctx.destination);
  src.start();
  return { src, gain };
}
function stopRainAudio(ctx, rain) {
  if (!rain) return;
  try {
    rain.gain.gain.setValueAtTime(rain.gain.gain.value, ctx.currentTime);
    rain.gain.gain.linearRampToValueAtTime(0, ctx.currentTime+0.9);
    setTimeout(() => { try { rain.src.stop(); } catch(e){} }, 1100);
  } catch(e) {}
}

/* ── RAIN DROP + RIPPLE CONSTANTS ── */
const RAIN_DROPS = Array.from({length:30}, (_,i) => ({
  id:i, x:2+(i*3.47)%96, delay:(i*0.097)%0.85,
  dur:0.38+(i%4)*0.07, op:0.38+(i%3)*0.12, len:11+(i%4)*3,
}));
const RIPPLES = Array.from({length:8}, (_,i) => ({
  id:i, x:4+i*5.5, delay:i*0.19, dur:0.9+(i%3)*0.28, rx:13+(i%3)*5, ry:3+(i%2)*2,
}));

/* ── DYNAMIC WEATHER PARTICLES ── */
const SNOW_FLAKES = Array.from({length:45}, (_,i) => ({
  id:i, x:(i*2.27)%50, delay:(i*0.14)%3,
  dur:4+(i%5)*0.8, size:1.5+(i%4), drift:((i%9)-4)*6,
  op:0.5+(i%3)*0.15,
}));
const MIST_LAYERS = [
  { top:'25%', h:'22%', blur:28, dur:22, delay:0, op:0.25 },
  { top:'42%', h:'18%', blur:32, dur:28, delay:6, op:0.2 },
  { top:'58%', h:'15%', blur:24, dur:18, delay:3, op:0.18 },
];
const WIND_STREAKS = Array.from({length:14}, (_,i) => ({
  id:i, y:15+(i*4.7)%55, dur:1.2+(i%4)*0.3,
  delay:i*0.25, w:15+(i%3)*12, op:0.12+(i%3)*0.06,
}));
const WEATHER_TYPES = ['clear','snow','mist','windy'];

const serif = "'Fraunces', Georgia, serif";
const sans  = "system-ui,-apple-system,'Helvetica Neue',sans-serif";
const ink   = '#2d2418';
const ink2  = '#6b5a3e';
const ink3  = '#9b8a6e';
const cream = '#faf6ed';
const line  = 'rgba(45,36,24,0.12)';

export default function TimerPage() {
  const { user, logout } = useAuth();

  const [totalMins,  setTotalMins]  = useState(60);
  const [totalCards, setTotalCards] = useState(30);
  const [themeKey,   setThemeKey]   = useState('orchard');
  const [soundOn,    setSoundOn]    = useState(true);
  const [intention,  setIntention]  = useState('');

  const theme       = TREE_THEMES[themeKey];
  const totalSeconds = totalMins * 60;

  const [timeLeft,   setTimeLeft]   = useState(totalSeconds);
  const [isActive,   setIsActive]   = useState(false);
  const [cardsDone,  setCardsDone]  = useState(0);
  const [redos,      setRedos]      = useState(0);
  const [freshDone,  setFreshDone]  = useState(0);
  const [reviewDone, setReviewDone] = useState(0);
  const [currentCardRedos, setCurrentCardRedos] = useState(0);
  const [cardStartElapsed, setCardStartElapsed] = useState(0);
  const [milestonesHit,    setMilestonesHit]    = useState({q1:false,q2:false,q3:false});
  const [activeMilestone,  setActiveMilestone]  = useState(null);
  const [showCelebration,  setShowCelebration]  = useState(false);
  const [treeShake,        setTreeShake]        = useState(false);
  const [sessionsToday,    setSessionsToday]    = useState([]);
  const [doneSparkles,     setDoneSparkles]     = useState([]);
  const [redoSparkles,     setRedoSparkles]     = useState([]);
  const [floaters,         setFloaters]         = useState([]);
  const [petals,           setPetals]           = useState([]);
  const [shimmer,          setShimmer]          = useState(false);
  const [focusRespCountdown, setFocusRespCountdown] = useState(null);
  const [birdFlying,  setBirdFlying]  = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [draftMins,  setDraftMins]  = useState(60);
  const [draftCards, setDraftCards] = useState(30);
  const [draftTheme, setDraftTheme] = useState('orchard');
  const [savingSession, setSavingSession] = useState(false);
  const [guest, setGuest] = useState(null); // { type, state, id }

  const audioCtxRef    = useRef(null);
  const completedRef   = useRef(false);
  const fxIdRef        = useRef(0);
  const videoRef       = useRef(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const focusCheckRef  = useRef(FOCUS_CHECK_INTERVAL);
  const lastInteractionRef = useRef(Date.now());
  const birdTimerRef   = useRef(null);
  const guestLeaveRef  = useRef(null);
  const guestSpawnRef  = useRef(null);
  const rainRef        = useRef(null);
  const [rainOn, setRainOn] = useState(false);
  const [weather, setWeather] = useState('clear');
  const weatherTimerRef = useRef(null);
  const [shootingStars, setShootingStars] = useState([]);
  const shootingStarRef = useRef(null);

  const markInteraction = useCallback(() => { lastInteractionRef.current = Date.now(); }, []);

  function rollGuestType() {
    const r = Math.random();
    return r < 0.10 ? 'cat' : r < 0.30 ? 'bear' : r < 0.60 ? 'owl' : 'fox';
  }

  const departGuest = useCallback((scared = false) => {
    clearTimeout(guestLeaveRef.current);
    setGuest(g => g ? { ...g, state: scared ? 'leaving' : 'leaving' } : null);
    guestLeaveRef.current = setTimeout(() => setGuest(null), scared ? 700 : 1300);
  }, []);

  const spawnGuest = useCallback((forceAlert = false) => {
    clearTimeout(guestLeaveRef.current);
    const type = rollGuestType();
    const id   = Date.now();
    setGuest({ type, state: forceAlert ? 'alert' : 'entering', id });
    if (!forceAlert) {
      const stayMs = 32000 + Math.random() * 18000;
      guestLeaveRef.current = setTimeout(() => departGuest(false), stayMs);
    }
  }, [departGuest]);

  /* Periodic idle-session guest appearances */
  useEffect(() => {
    if (!isActive) {
      clearTimeout(guestSpawnRef.current);
      return;
    }
    const schedule = () => {
      const delay = 110000 + Math.random() * 90000;
      guestSpawnRef.current = setTimeout(() => {
        setGuest(g => {
          if (!g) { spawnGuest(false); }
          return g;
        });
        schedule();
      }, delay);
    };
    schedule();
    return () => clearTimeout(guestSpawnRef.current);
  }, [isActive, spawnGuest]);

  const playSound = useCallback((kind) => {
    if (!soundOn) return;
    try {
      if (!audioCtxRef.current) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        audioCtxRef.current = new Ctx();
      }
      if (audioCtxRef.current.state==='suspended') audioCtxRef.current.resume();
      sounds[kind]?.(audioCtxRef.current);
    } catch(e) {}
  }, [soundOn]);

  const ensureAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) audioCtxRef.current = new Ctx();
    }
    if (audioCtxRef.current?.state === 'suspended') audioCtxRef.current.resume();
    return audioCtxRef.current;
  }, []);

  const toggleRain = useCallback(() => {
    setRainOn(on => {
      const next = !on;
      if (next) {
        const ctx = ensureAudioCtx();
        if (ctx && soundOn) rainRef.current = startRainAudio(ctx);
      } else {
        if (rainRef.current && audioCtxRef.current) {
          stopRainAudio(audioCtxRef.current, rainRef.current);
          rainRef.current = null;
        }
      }
      return next;
    });
  }, [soundOn, ensureAudioCtx]);

  /* Sync rain audio when soundOn changes */
  useEffect(() => {
    if (!rainOn) return;
    if (soundOn && !rainRef.current) {
      const ctx = ensureAudioCtx();
      if (ctx) rainRef.current = startRainAudio(ctx);
    } else if (!soundOn && rainRef.current && audioCtxRef.current) {
      stopRainAudio(audioCtxRef.current, rainRef.current);
      rainRef.current = null;
    }
  }, [soundOn, rainOn, ensureAudioCtx]);

  /* Dynamic weather cycling */
  useEffect(() => {
    if (!isActive) { clearTimeout(weatherTimerRef.current); return; }
    const cycle = () => {
      const delay = 80000 + Math.random() * 100000;
      weatherTimerRef.current = setTimeout(() => {
        setWeather(w => {
          const others = WEATHER_TYPES.filter(t => t !== w);
          return others[Math.floor(Math.random() * others.length)];
        });
        cycle();
      }, delay);
    };
    cycle();
    return () => clearTimeout(weatherTimerRef.current);
  }, [isActive]);

  /* Shooting stars — spawn randomly during active sessions */
  useEffect(() => {
    if (!isActive) { clearTimeout(shootingStarRef.current); return; }
    const spawn = () => {
      const delay = 14000 + Math.random() * 28000;
      shootingStarRef.current = setTimeout(() => {
        const id = Date.now();
        const startX = 4 + Math.random() * 38;
        const startY = 1 + Math.random() * 14;
        setShootingStars(s => [...s, { id, startX, startY }]);
        setTimeout(() => setShootingStars(s => s.filter(x => x.id !== id)), 1800);
        spawn();
      }, delay);
    };
    spawn();
    return () => clearTimeout(shootingStarRef.current);
  }, [isActive]);

  /* Timer tick */
  useEffect(() => {
    if (!isActive) return;
    if (timeLeft <= 0) return;
    const id = setInterval(() => {
      setTimeLeft(t => Math.max(0,t-1));
      const idle = (Date.now()-lastInteractionRef.current)/1000;
      const perCard = totalSeconds/Math.max(1,totalCards);
      const threshold = Math.max(45,Math.min(IDLE_BASE_SECONDS,perCard*1.6));
      if (idle > threshold && focusRespCountdown===null) {
        // Animal-based focus check: alert existing guest or spawn one
        setGuest(g => {
          if (g && (g.state==='entering'||g.state==='idle')) {
            clearTimeout(guestLeaveRef.current);
            return { ...g, state:'alert' };
          }
          if (!g) return { type:rollGuestType(), state:'alert', id:Date.now() };
          return g;
        });
        setFocusRespCountdown(FOCUS_RESPONSE_WINDOW);
        lastInteractionRef.current = Date.now();
      }
    }, 1000);
    return () => clearInterval(id);
  }, [isActive, timeLeft, totalSeconds, totalCards, focusRespCountdown]);

  /* Session completion */
  const saveSession = useCallback(async (data) => {
    if (!user) return;
    setSavingSession(true);
    try {
      await api.saveSession(data);
    } catch(e) {} finally {
      setSavingSession(false);
    }
  }, [user]);

  useEffect(() => {
    if (timeLeft===0 && isActive && !completedRef.current) {
      completedRef.current = true;
      setIsActive(false);
      setShowCelebration(true);
      setSessionsToday(s => [...s, themeKey]);
      setTreeShake(true);
      setTimeout(() => setTreeShake(false), 1200);
      playSound('complete');
      saveSession({ treeType:themeKey, durationMins:totalMins, cardsTotal:totalCards,
        cardsDone, cardsFresh:freshDone, cardsReview:reviewDone, redos, intention });
    }
  }, [timeLeft, isActive, themeKey, totalMins, totalCards, cardsDone, freshDone, reviewDone, redos, intention, playSound, saveSession]);

  /* Focus check countdown + guest fleeing on timeout */
  useEffect(() => {
    if (focusRespCountdown===null) return;
    if (focusRespCountdown<=0) {
      setIsActive(false);
      setFocusRespCountdown(null);
      // Scare the guest away
      clearTimeout(guestLeaveRef.current);
      setGuest(g => g ? { ...g, state:'leaving' } : null);
      guestLeaveRef.current = setTimeout(() => setGuest(null), 700);
      return;
    }
    const id = setTimeout(() => setFocusRespCountdown(n=>n-1), 1000);
    return () => clearTimeout(id);
  }, [focusRespCountdown]);

  /* Click the animal = pass the focus check */
  const handleGuestClick = useCallback(() => {
    if (!guest || guest.state !== 'alert') return;
    setFocusRespCountdown(null);
    focusCheckRef.current = FOCUS_CHECK_INTERVAL;
    markInteraction();
    setGuest(g => g ? { ...g, state:'clicked' } : null);
    clearTimeout(guestLeaveRef.current);
    guestLeaveRef.current = setTimeout(() => {
      setGuest(g => g ? { ...g, state:'leaving' } : null);
      setTimeout(() => setGuest(null), 1300);
    }, 1100);
  }, [guest, markInteraction]);

  const dismissFocusCheck = () => {
    setFocusRespCountdown(null); focusCheckRef.current=FOCUS_CHECK_INTERVAL; markInteraction();
  };

  /* Video scrub */
  useEffect(() => {
    const video = videoRef.current;
    if (video && videoDuration>0) {
      const progress = totalSeconds>0?(totalSeconds-Math.max(0,timeLeft))/totalSeconds:0;
      video.currentTime = Math.min(videoDuration, progress*videoDuration+0.4);
    }
  }, [timeLeft, totalSeconds, videoDuration]);

  /* Bird */
  useEffect(() => {
    if (!isActive) { if (birdTimerRef.current) clearTimeout(birdTimerRef.current); return; }
    const schedule = () => {
      const delay = 50000+Math.random()*40000;
      birdTimerRef.current = setTimeout(() => {
        setBirdFlying(true); setTimeout(()=>setBirdFlying(false),8000); schedule();
      }, delay);
    };
    schedule();
    return () => { if (birdTimerRef.current) clearTimeout(birdTimerRef.current); };
  }, [isActive]);

  const safeTimeLeft = Math.max(0, timeLeft);
  const mins   = Math.floor(safeTimeLeft/60);
  const secs   = safeTimeLeft%60;
  const progress = totalSeconds>0?(totalSeconds-safeTimeLeft)/totalSeconds:0;
  const elapsed  = totalSeconds-safeTimeLeft;
  const nearlyDone  = progress>=0.75;
  const finalStretch = c01(progress,0.75,1.0);

  const secsPerCard  = totalSeconds/Math.max(1,totalCards);
  const cardElapsed  = Math.max(0,elapsed-cardStartElapsed);
  const cardLeft     = Math.max(0,Math.ceil(secsPerCard-cardElapsed));
  const cardMins     = Math.floor(cardLeft/60);
  const cardSecs     = cardLeft%60;
  const cardPct      = Math.min(1,cardElapsed/secsPerCard);
  const cardUrgent   = cardLeft<=30 && isActive && cardsDone<totalCards;
  const expectedCards   = Math.floor(progress*totalCards);
  const cardsProgress   = totalCards>0?cardsDone/totalCards:0;
  const cardsLeft       = Math.max(0,totalCards-cardsDone);
  const reviewLeft      = currentCardRedos>0&&cardsLeft>0?1:0;
  const freshLeft       = Math.max(0,cardsLeft-reviewLeft);
  const paceDelta       = cardsDone-expectedCards;
  const paceLabel       = paceDelta>0?`${paceDelta} ahead`:paceDelta<0?`${-paceDelta} behind`:'On rhythm';
  const pace            = paceDelta>=2?'ahead':paceDelta<=-2?'behind':'onpace';
  const paceConfig = {
    ahead:  { label:paceLabel, col:'#3a6a8a', bg:'rgba(58,106,138,0.10)' },
    onpace: { label:paceLabel, col:theme.accentDeep, bg:`${theme.accent}1a` },
    behind: { label:paceLabel, col:'#a8542a', bg:'rgba(168,84,42,0.12)' },
  }[pace];

  /* Milestones */
  useEffect(() => {
    if (!isActive) return;
    const check = (key,threshold) => {
      if (!milestonesHit[key] && progress>=threshold) {
        setMilestonesHit(m=>({...m,[key]:true}));
        setActiveMilestone(key);
        playSound('milestone');
        setTimeout(()=>setActiveMilestone(null),4500);
      }
    };
    check('q1',0.25); check('q2',0.50); check('q3',0.75);
  }, [progress,isActive,milestonesHit,playSound]);

  /* Actions */
  const toggle = () => {
    if (timeLeft<=0) return;
    if (!isActive && timeLeft===totalSeconds) setShowCelebration(false);
    markInteraction(); setIsActive(a=>!a);
  };

  const reset = useCallback(() => {
    setIsActive(false); setTimeLeft(totalSeconds);
    setCardsDone(0); setRedos(0); setFreshDone(0); setReviewDone(0);
    setCurrentCardRedos(0); setCardStartElapsed(0);
    completedRef.current=false; focusCheckRef.current=FOCUS_CHECK_INTERVAL;
    lastInteractionRef.current=Date.now(); setFocusRespCountdown(null);
    setMilestonesHit({q1:false,q2:false,q3:false}); setActiveMilestone(null);
    setShowCelebration(false); setBirdFlying(false);
    setDoneSparkles([]); setRedoSparkles([]); setFloaters([]); setPetals([]);
    clearTimeout(guestLeaveRef.current); clearTimeout(guestSpawnRef.current);
    clearTimeout(weatherTimerRef.current); clearTimeout(shootingStarRef.current);
    setGuest(null); setWeather('clear'); setShootingStars([]);
  }, [totalSeconds]);

  const fireFloater = (kind) => {
    const id=++fxIdRef.current;
    setFloaters(f=>[...f,{id,kind}]);
    setTimeout(()=>setFloaters(f=>f.filter(x=>x.id!==id)),1600);
  };
  const firePetals = () => {
    const base=++fxIdRef.current;
    const newP=Array.from({length:8},(_,i)=>({
      id:base*100+i, x:30+Math.random()*30, delay:i*0.05,
      drift:(Math.random()-0.5)*60, rot:Math.random()*360,
    }));
    setPetals(p=>[...p,...newP]);
    setTimeout(()=>setPetals(p=>p.filter(x=>!newP.find(np=>np.id===x.id))),3000);
  };
  const triggerShimmer = () => { setShimmer(true); setTimeout(()=>setShimmer(false),700); };

  const completeCard = useCallback(() => {
    if (!isActive||cardsDone>=totalCards||timeLeft<=0) return;
    markInteraction();
    const newCount=cardsDone+1;
    setCardsDone(newCount);
    if (currentCardRedos>0) setReviewDone(r=>r+1); else setFreshDone(f=>f+1);
    setCurrentCardRedos(0); setCardStartElapsed(elapsed);
    playSound('done');
    const sid=++fxIdRef.current;
    setDoneSparkles(s=>[...s,{id:sid}]);
    setTimeout(()=>setDoneSparkles(s=>s.filter(x=>x.id!==sid)),1400);
    fireFloater('done'); firePetals(); triggerShimmer();
    if (newCount===totalCards) {
      setTimeout(()=>{
        setShowCelebration(true); setSessionsToday(s=>[...s,themeKey]);
        setTreeShake(true); setTimeout(()=>setTreeShake(false),1200);
        playSound('complete');
        saveSession({ treeType:themeKey, durationMins:totalMins, cardsTotal:totalCards,
          cardsDone:newCount, cardsFresh:freshDone+(currentCardRedos===0?1:0),
          cardsReview:reviewDone+(currentCardRedos>0?1:0), redos, intention });
      },400);
    }
  },[cardsDone,totalCards,isActive,timeLeft,elapsed,themeKey,currentCardRedos,
     freshDone,reviewDone,redos,intention,totalMins,playSound,markInteraction,saveSession]);

  const redoCard = useCallback(() => {
    if (!isActive||timeLeft<=0) return;
    markInteraction(); setRedos(r=>r+1); setCurrentCardRedos(c=>c+1); setCardStartElapsed(elapsed);
    playSound('redo');
    const sid=++fxIdRef.current;
    setRedoSparkles(s=>[...s,{id:sid}]);
    setTimeout(()=>setRedoSparkles(s=>s.filter(x=>x.id!==sid)),1100);
    fireFloater('redo');
  },[isActive,timeLeft,elapsed,playSound,markInteraction]);

  const applySettings = () => {
    const m=Math.max(1,Math.min(180,draftMins));
    const c=Math.max(1,Math.min(120,draftCards));
    setTotalMins(m); setTotalCards(c); setThemeKey(draftTheme);
    setTimeLeft(m*60); setIsActive(false);
    setCardsDone(0); setRedos(0); setFreshDone(0); setReviewDone(0);
    setCurrentCardRedos(0); setCardStartElapsed(0);
    completedRef.current=false; focusCheckRef.current=FOCUS_CHECK_INTERVAL;
    setFocusRespCountdown(null); setMilestonesHit({q1:false,q2:false,q3:false});
    setActiveMilestone(null); setShowCelebration(false); setShowSettings(false);
  };

  /* Keyboard */
  useEffect(() => {
    const handler=(e) => {
      if (e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA') return;
      if (showSettings||focusRespCountdown!==null) return;
      if (['Space','KeyR','KeyD','KeyF','KeyS'].includes(e.code)) markInteraction();
      if (e.code==='Space') { e.preventDefault(); toggle(); }
      else if (e.key==='r'||e.key==='R') reset();
      else if (e.key==='d'||e.key==='D') completeCard();
      else if (e.key==='f'||e.key==='F') redoCard();
      else if (e.key==='s'||e.key==='S') { setDraftMins(totalMins);setDraftCards(totalCards);setDraftTheme(themeKey);setShowSettings(true); }
    };
    window.addEventListener('keydown',handler);
    return ()=>window.removeEventListener('keydown',handler);
  },[completeCard,redoCard,reset,showSettings,focusRespCountdown,totalMins,totalCards,themeKey,isActive,timeLeft,markInteraction]);

  const cardStyle = {
    background:cream, border:`0.5px solid ${line}`, borderRadius:14,
    padding:'14px 16px',
    boxShadow:'0 1px 0 rgba(255,255,255,0.6) inset, 0 2px 12px rgba(45,36,24,0.04)',
  };

  /* Sky gradients */
  const dawnOp  = Math.max(0,1-progress*2);
  const dayOp   = Math.max(0,1-Math.abs(progress-0.5)*2);
  const duskOp  = Math.max(0,progress*2-1);
  const sunPct  = progress*88+4;
  const sunArcY = 5+Math.pow(progress*2-1,2)*28;
  const halo1   = duskOp>0.5?'rgba(245,140,60,0.50)':'rgba(248,200,72,0.50)';
  const halo2   = duskOp>0.5?'rgba(238,107,51,0.22)':'rgba(248,180,40,0.20)';
  const sunMid  = duskOp>0.5?'#ffb380':'#fff1a8';
  const sunOuter= duskOp>0.5?'#ee6b33':'#f8c548';
  const rayCol  = duskOp>0.5?'rgba(245,160,80,0.50)':'rgba(248,210,90,0.50)';
  const nightOp = Math.max(0,progress*2-1.4);
  const RAYS    = Array.from({length:20},(_,i)=>i*(360/20));
  const STARS   = Array.from({length:42},(_,i)=>({ id:i, x:3+(i*17.3)%95, y:1+(i*11.7)%38, size:i%4===0?2.6:i%4===1?1.6:1.2, delay:(i*0.3)%4 }));
  const LEAVES  = Array.from({length:14},(_,i)=>({ id:i, x:5+i*6.5, delay:i*0.7, dur:5+i*0.4, size:i%3===0?8:i%3===1?5:6, col:['#7a9d6a','#c4965a','#e5b899','#9bb38a','#d8c19a'][i%5] }));
  const GLOW_ORBS = Array.from({length:22},(_,i)=>({ id:i, x:8+(i*31.7)%84, delay:(i*0.7)%8, dur:6+(i%5), size:i%3===0?5:i%3===1?3.5:4 }));
  const BUTTERFLIES = [{id:0,delay:0,dur:14,yStart:35,col:'#e9a8c0'},{id:1,delay:3.2,dur:16,yStart:43,col:'#fde68a'},{id:2,delay:6.4,dur:18,yStart:51,col:'#c4b5fd'},{id:3,delay:9.6,dur:20,yStart:59,col:'#a8d4d4'}];
  const DRIFT_LEAVES = Array.from({length:8},(_,i)=>({ id:i, delay:i*4+(i%3), dur:14+(i%5), startY:5+(i*9)%25, size:6+(i%3)*2, col:['#7a9d6a','#c4965a','#e89548','#9bb38a'][i%4] }));
  const FIREFLIES   = Array.from({length:14},(_,i)=>({ id:i, x:8+(i*13.7)%84, y:35+(i*7.3)%35, delay:(i*0.5)%6, dur:5+(i%4) }));


  return (
    <div style={{
      width:'100%', height:'100vh', display:'flex', overflow:'hidden',
      fontFamily:serif, position:'relative', color:ink,
    }}>
      {/* Video background */}
      <video ref={videoRef}
        src="https://cdn.jsdelivr.net/gh/TomKenison162/cautious-dollop@main/start_from_stratch_make_it_pro.mp4"
        muted playsInline preload="auto"
        onLoadedMetadata={e=>setVideoDuration(e.target.duration)}
        style={{ position:'absolute', left:0, top:0, width:'61%', height:'100%',
          objectFit:'cover', zIndex:0, pointerEvents:'none' }}/>


      {/* Stars */}
      {duskOp>0.3 && (
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
        width:88, height:88, transition:'left 4s ease-out, top 4s ease-out',
        pointerEvents:'none', filter:!isActive?'saturate(0.85) brightness(0.97)':'none',
      }}>
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:220, height:220, borderRadius:'50%', background:`radial-gradient(circle,${halo2} 0%,transparent 70%)`, transition:'background 4s' }}/>
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:140, height:140, borderRadius:'50%', background:`radial-gradient(circle,${halo1} 0%,transparent 70%)`, transition:'background 4s' }}/>
        <svg width="240" height="240" viewBox="0 0 240 240" style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', animation:isActive?'spinRays 22s linear infinite':'none', overflow:'visible' }}>
          {RAYS.map((deg,i) => {
            const rad=deg*Math.PI/180, r0=50, r1=r0+(i%2===0?32:18);
            return <line key={i} x1={120+Math.cos(rad)*r0} y1={120+Math.sin(rad)*r0} x2={120+Math.cos(rad)*r1} y2={120+Math.sin(rad)*r1} stroke={rayCol} strokeWidth={i%2===0?3.5:2} strokeLinecap="round" style={{ transition:'stroke 4s' }}/>;
          })}
        </svg>
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:88, height:88, borderRadius:'50%', background:`radial-gradient(circle at 38% 36%,#ffffff 0%,${sunMid} 40%,${sunOuter} 100%)`, boxShadow:`0 0 0 5px rgba(255,255,255,0.16),0 0 22px 7px ${halo1}`, transition:'background 4s' }}/>
      </div>

      {/* Clouds */}
      <div style={{ position:'absolute', zIndex:2, pointerEvents:'none', left:'5%', top:'7%', width:180, height:64,
        background:`radial-gradient(ellipse 50% 70% at 30% 70%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 35%, transparent 70%), radial-gradient(ellipse 60% 80% at 60% 80%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.78) 40%, transparent 75%), radial-gradient(ellipse 100% 50% at 50% 100%, rgba(220,225,235,0.7) 0%, transparent 70%)`,
        opacity:0.75*dayOp+0.45*dawnOp+0.55*duskOp+0.15, filter:`blur(0.5px)`, animation:'cloudDriftSlow 90s linear infinite' }}/>
      <div style={{ position:'absolute', zIndex:2, pointerEvents:'none', left:'38%', top:'4%', width:130, height:48,
        background:`radial-gradient(ellipse 55% 75% at 35% 75%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.78) 40%, transparent 75%), radial-gradient(ellipse 100% 50% at 50% 100%, rgba(215,222,232,0.65) 0%, transparent 70%)`,
        opacity:0.65*dayOp+0.4*dawnOp+0.5*duskOp+0.12, filter:'blur(0.5px)', animation:'cloudDriftSlow 110s linear infinite', animationDelay:'-30s' }}/>

      {/* Cards-driven ambient halo */}
      {cardsProgress>0 && (
        <div style={{ position:'absolute', left:'25%', top:'50%', transform:'translate(-50%,-50%)', width:500, height:500, zIndex:2, borderRadius:'50%',
          background:`radial-gradient(circle, ${theme.glow}${(0.18*cardsProgress).toFixed(3)}) 0%, transparent 65%)`,
          pointerEvents:'none', transition:'background 1.2s', mixBlendMode:'screen' }}/>
      )}

      {/* Bird */}
      {birdFlying && isActive && (
        <svg width="40" height="20" viewBox="0 0 40 20" style={{ position:'absolute', zIndex:3, top:'18%', left:'-50px', animation:'birdFly 8s linear forwards', pointerEvents:'none' }}>
          <path d="M2,10 Q8,3 14,10 Q20,3 26,10 Q32,3 38,10" stroke={ink} strokeWidth="1.8" fill="none" strokeLinecap="round" style={{ animation:'wingFlap 0.4s ease-in-out infinite' }}/>
        </svg>
      )}

      {/* Butterflies */}
      {isActive && dayOp>0.5 && BUTTERFLIES.map(b => (
        <div key={b.id} style={{ position:'absolute', zIndex:5, left:'-20px', top:`${b.yStart}%`, animation:`butterflyFly ${b.dur}s linear ${b.delay}s infinite`, pointerEvents:'none' }}>
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
      {duskOp>0.4 && isActive && FIREFLIES.map(f => (
        <div key={f.id} style={{ position:'absolute', zIndex:5, left:`${f.x}%`, top:`${f.y}%`, width:5, height:5, borderRadius:'50%', background:'#fef0a0', boxShadow:'0 0 12px 3px rgba(254,240,160,0.9),0 0 24px 6px rgba(254,240,160,0.4)', animation:`fireflyFloat ${f.dur}s ease-in-out ${f.delay}s infinite`, pointerEvents:'none', opacity:duskOp }}/>
      ))}

      {/* Drifting leaves */}
      {isActive && LEAVES.map(p => (
        <div key={p.id} style={{ position:'absolute', zIndex:3, pointerEvents:'none', width:p.size, height:p.size*0.68, borderRadius:p.id%2===0?'60% 0 60% 0':'0 60% 0 60%', background:p.col, left:`${p.x}%`, bottom:'20%', opacity:0, animation:`floatUp ${p.dur}s ease-out ${p.delay}s infinite` }}/>
      ))}
      {isActive && DRIFT_LEAVES.map(d => (
        <div key={`dl${d.id}`} style={{ position:'absolute', zIndex:3, pointerEvents:'none', left:'-3%', top:`${d.startY}%`, width:d.size, height:d.size*0.68, borderRadius:d.id%2===0?'60% 0 60% 0':'0 60% 0 60%', background:d.col, animation:`leafDrift ${d.dur}s linear ${d.delay}s infinite` }}/>
      ))}

      {/* Glow orbs */}
      {isActive && nearlyDone && GLOW_ORBS.map(o => (
        <div key={o.id} style={{ position:'absolute', zIndex:6, pointerEvents:'none', left:`${o.x}%`, bottom:'18%', width:o.size, height:o.size, borderRadius:'50%', background:`${theme.glow}1)`, boxShadow:`0 0 ${o.size*3}px ${o.size*0.7}px ${theme.glow}0.85),0 0 ${o.size*7}px ${o.size*1.5}px ${theme.glow}0.35)`, opacity:0, animation:`glowOrbRise ${o.dur}s ease-out ${o.delay}s infinite`, filter:`brightness(${1+finalStretch*0.5})` }}/>
      ))}

      {/* Done sparkles */}
      {doneSparkles.map(s => (
        <div key={s.id} style={{ position:'absolute', zIndex:30, top:'46%', left:'25%', pointerEvents:'none', animation:'sparkBurst 1.4s ease-out forwards' }}>
          {[0,45,90,135,180,225,270,315].map(a => (
            <div key={a} style={{ position:'absolute', width:8, height:8, borderRadius:'50%', background:a%90===0?theme.accent:theme.leafLight, top:0, left:0, transform:`rotate(${a}deg) translateY(-36px)`, boxShadow:`0 0 6px ${theme.glow}0.8)` }}/>
          ))}
        </div>
      ))}

      {/* Redo sparkles */}
      {redoSparkles.map(s => (
        <div key={s.id} style={{ position:'absolute', zIndex:30, top:'46%', left:'25%', pointerEvents:'none', animation:'sparkBurst 1s ease-out forwards' }}>
          {[0,72,144,216,288].map(a => (
            <div key={a} style={{ position:'absolute', width:6, height:6, borderRadius:'50%', background:'#c4965a', top:0, left:0, transform:`rotate(${a}deg) translateY(-22px)`, opacity:0.8 }}/>
          ))}
        </div>
      ))}

      {/* Petals */}
      {petals.map(p => (
        <div key={p.id} style={{ position:'absolute', zIndex:8, pointerEvents:'none', left:`${p.x}%`, top:'30%', width:9, height:6, borderRadius:'60% 0 60% 0', background:theme.petal, boxShadow:`0 0 4px ${theme.glow}0.5)`, opacity:0, animation:`petalFall 2.6s ease-out ${p.delay}s forwards`, ['--drift']:`${p.drift}px`, ['--rot']:`${p.rot}deg` }}/>
      ))}

      {/* Floaters */}
      {floaters.map(f => (
        <div key={f.id} style={{ position:'absolute', zIndex:50, pointerEvents:'none', right:'33%', top:'58%', fontSize:f.kind==='done'?26:20, fontFamily:serif, fontWeight:400, fontStyle:'italic', color:f.kind==='done'?theme.accentDeep:'#a87a3a', animation:'floaterRise 1.5s ease-out forwards', letterSpacing:'-0.02em', textShadow:`0 2px 8px ${theme.glow}0.4)` }}>
          {f.kind==='done'?'+1':'redo'}
        </div>
      ))}

      {/* Milestones */}
      {activeMilestone==='q1' && (
        <div style={{ position:'absolute', inset:0, zIndex:6, pointerEvents:'none' }}>
          {Array.from({length:8}).map((_,i)=>{
            const a=(i/8)*Math.PI*2;
            return (
              <svg key={i} width="22" height="18" viewBox="0 0 18 14" style={{ position:'absolute', top:'42%', left:'25%', animation:'butterflyBurst 4s ease-out forwards', animationDelay:`${i*0.08}s`, ['--tx']:`${Math.cos(a)*200}px`, ['--ty']:`${Math.sin(a)*200-40}px` }}>
                <ellipse cx="6" cy="6" rx="5" ry="4" fill={['#e9a8c0','#fde68a','#c4b5fd','#a8d4d4'][i%4]} opacity="0.85"/>
                <ellipse cx="12" cy="6" rx="5" ry="4" fill={['#e9a8c0','#fde68a','#c4b5fd','#a8d4d4'][i%4]} opacity="0.85"/>
              </svg>
            );
          })}
        </div>
      )}
      {activeMilestone==='q2' && (
        <div style={{ position:'absolute', inset:0, zIndex:6, pointerEvents:'none', animation:'rainbowFade 4.5s ease-out forwards' }}>
          <svg width="50%" height="60%" viewBox="0 0 400 300" style={{ position:'absolute', top:'10%', left:'0' }}>
            {['#c45838','#e88848','#f5c870','#7ba66a','#7ab8e0','#9d4e8a'].map((col,i) => (
              <path key={i} d={`M40,260 A${160-i*8},${160-i*8} 0 0,1 360,260`} stroke={col} strokeWidth="5" fill="none" opacity="0.55" strokeLinecap="round"/>
            ))}
          </svg>
        </div>
      )}
      {activeMilestone==='q3' && (
        <div style={{ position:'absolute', inset:0, zIndex:6, pointerEvents:'none' }}>
          <div style={{ position:'absolute', top:'15%', left:'10%', width:80, height:3, background:'linear-gradient(90deg,transparent,#fff8e0,#f5c870)', borderRadius:2, transform:'rotate(20deg)', boxShadow:'0 0 18px 4px rgba(245,200,112,0.7)', animation:'shootingStar 1.6s ease-out forwards' }}/>
        </div>
      )}

      {/* ══ RAIN DROPS ══ */}
      {rainOn && RAIN_DROPS.map(d => (
        <div key={d.id} style={{
          position:'absolute', zIndex:4, pointerEvents:'none',
          left:`${d.x}%`, top:'-20px',
          width:'1.5px', height:`${d.len}px`,
          background:`rgba(168,210,255,${d.op})`,
          borderRadius:'1px',
          animation:`rainFall ${d.dur}s linear ${d.delay}s infinite`,
          boxShadow:`0 0 2px rgba(168,210,255,${d.op*0.6})`,
        }}/>
      ))}

      {/* ══ POND RIPPLES (ground left panel) ══ */}
      {rainOn && RIPPLES.map(r => (
        <div key={r.id} style={{
          position:'absolute', zIndex:5, pointerEvents:'none',
          left:`${r.x}%`, bottom:`${18 + (r.id%3)*1.2}%`,
          width:`${r.rx*2}px`, height:`${r.ry*2}px`,
          borderRadius:'50%',
          border:'1px solid rgba(168,210,255,0.65)',
          animation:`rainRipple ${r.dur}s ease-out ${r.delay}s infinite`,
        }}/>
      ))}

      {/* Wet-ground sheen */}
      {rainOn && (
        <div style={{
          position:'absolute', zIndex:4, pointerEvents:'none',
          left:0, bottom:'14%', width:'50%', height:'10%',
          background:'linear-gradient(to bottom, transparent, rgba(100,170,230,0.10))',
          animation:'wetSheen 4s ease-in-out infinite',
        }}/>
      )}

      {/* ══ DYNAMIC WEATHER: SNOW ══ */}
      {weather === 'snow' && isActive && SNOW_FLAKES.map(s => (
        <div key={`snow${s.id}`} style={{
          position:'absolute', zIndex:4, pointerEvents:'none',
          left:`${s.x}%`, top:'-10px',
          width:s.size, height:s.size,
          borderRadius:'50%', background:'white',
          opacity:s.op,
          boxShadow:'0 0 3px rgba(255,255,255,0.8)',
          animation:`snowFall ${s.dur}s linear ${s.delay}s infinite`,
          '--drift':`${s.drift}px`,
        }}/>
      ))}

      {/* ══ DYNAMIC WEATHER: MIST ══ */}
      {weather === 'mist' && isActive && MIST_LAYERS.map((m, i) => (
        <div key={`mist${i}`} style={{
          position:'absolute', zIndex:4, pointerEvents:'none',
          left:'-10%', top:m.top, width:'60%', height:m.h,
          background:'linear-gradient(90deg, transparent, rgba(200,210,225,0.3), rgba(190,200,215,0.2), transparent)',
          filter:`blur(${m.blur}px)`,
          opacity:m.op,
          animation:`mistDrift ${m.dur}s ease-in-out ${m.delay}s infinite`,
          borderRadius:'40%',
        }}/>
      ))}

      {/* ══ DYNAMIC WEATHER: WIND ══ */}
      {weather === 'windy' && isActive && WIND_STREAKS.map(w => (
        <div key={`wind${w.id}`} style={{
          position:'absolute', zIndex:4, pointerEvents:'none',
          left:'-5%', top:`${w.y}%`,
          width:w.w, height:1.5,
          background:`rgba(200,215,190,${w.op})`,
          borderRadius:1,
          animation:`windGust ${w.dur}s linear ${w.delay}s infinite`,
        }}/>
      ))}

      {/* ══ AURORA BOREALIS (night phase) ══ */}
      {nightOp > 0.3 && isActive && (
        <>
          <div style={{
            position:'absolute', zIndex:3, pointerEvents:'none',
            left:'-5%', top:'2%', width:'55%', height:'22%',
            background:'linear-gradient(180deg, transparent, rgba(80,255,140,0.12), rgba(40,200,255,0.08), transparent)',
            animation:'auroraWave1 12s ease-in-out infinite',
            opacity:nightOp*0.7, filter:'blur(30px)', borderRadius:'50%',
          }}/>
          <div style={{
            position:'absolute', zIndex:3, pointerEvents:'none',
            left:'8%', top:'5%', width:'42%', height:'18%',
            background:'linear-gradient(180deg, transparent, rgba(160,80,255,0.10), rgba(80,200,200,0.06), transparent)',
            animation:'auroraWave2 15s ease-in-out 2s infinite',
            opacity:nightOp*0.5, filter:'blur(25px)', borderRadius:'50%',
          }}/>
          <div style={{
            position:'absolute', zIndex:3, pointerEvents:'none',
            left:'15%', top:'0%', width:'35%', height:'15%',
            background:'linear-gradient(180deg, transparent, rgba(80,255,200,0.08), transparent)',
            animation:'auroraWave3 10s ease-in-out 1s infinite',
            opacity:nightOp*0.4, filter:'blur(35px)', borderRadius:'50%',
          }}/>
        </>
      )}

      {/* ══ SHOOTING STARS (night sky) ══ */}
      {nightOp > 0.2 && shootingStars.map(s => (
        <div key={s.id} style={{
          position:'absolute', zIndex:3, pointerEvents:'none',
          left:`${s.startX}%`, top:`${s.startY}%`,
          width:70, height:2.5,
          background:'linear-gradient(90deg, transparent 0%, rgba(255,248,220,0.15) 20%, #fff8e0 60%, #f5c870 85%, transparent 100%)',
          borderRadius:1.5, transform:'rotate(25deg)',
          boxShadow:'0 0 10px 3px rgba(255,248,200,0.5)',
          animation:'shootingStarStreak 1.5s ease-out forwards',
          opacity: nightOp,
        }}/>
      ))}

      {/* ══ COZY CAMPFIRE (dusk/night) ══ */}
      {duskOp > 0.3 && isActive && (
        <div style={{
          position:'absolute', zIndex:7, pointerEvents:'none',
          left:'7%', bottom:'17%',
        }}>
          <div style={{
            position:'absolute', bottom:5, left:'50%', transform:'translateX(-50%)',
            width:70, height:70, borderRadius:'50%',
            background:'radial-gradient(circle, rgba(255,160,40,0.35), rgba(255,100,20,0.12), transparent)',
            filter:'blur(12px)',
            animation:'campfireGlow 2s ease-in-out infinite',
            opacity:duskOp * 0.8,
          }}/>
          <svg width="32" height="36" viewBox="0 0 32 36" style={{ display:'block' }}>
            <ellipse cx="8" cy="34" rx="10" ry="2.2" fill="#5a3018" transform="rotate(-12 8 34)"/>
            <ellipse cx="24" cy="34" rx="10" ry="2.2" fill="#4a2810" transform="rotate(12 24 34)"/>
            <ellipse cx="16" cy="33" rx="3" ry="1.2" fill="#6a4020"/>
            <path d="M16,32 Q12,25 14,18 Q16,12 16,8 Q16,12 18,18 Q20,25 16,32"
              fill="#ff8020" opacity="0.9" style={{animation:'flameSway1 0.8s ease-in-out infinite', transformOrigin:'16px 32px'}}/>
            <path d="M14,32 Q10,27 12,22 Q14,16 14,12 Q15,16 16,22 Q18,27 14,32"
              fill="#ffaa30" opacity="0.7" style={{animation:'flameSway2 1.1s ease-in-out infinite', transformOrigin:'14px 32px'}}/>
            <path d="M18,32 Q20,27 19,22 Q18,18 18,14 Q17,18 16,22 Q15,27 18,32"
              fill="#ffd060" opacity="0.6" style={{animation:'flameSway3 0.9s ease-in-out infinite', transformOrigin:'18px 32px'}}/>
            <path d="M16,32 Q14.5,28 15.5,25 Q16,22 16,20 Q16,22 16.5,25 Q17.5,28 16,32"
              fill="#fff0a0" opacity="0.8" style={{animation:'flameSway1 0.7s ease-in-out infinite', transformOrigin:'16px 32px'}}/>
            <circle cx="13" cy="28" r="1" fill="#ff6020" opacity="0.6" style={{animation:'emberFloat 2s ease-out infinite'}}/>
            <circle cx="19" cy="26" r="0.7" fill="#ffa040" opacity="0.5" style={{animation:'emberFloat 2.5s ease-out 0.5s infinite'}}/>
            <circle cx="16" cy="24" r="0.5" fill="#ffcc60" opacity="0.4" style={{animation:'emberFloat 3s ease-out 1s infinite'}}/>
          </svg>
          {[0,1,2].map(i => (
            <div key={`smoke${i}`} style={{
              position:'absolute', bottom:28, left:12+i*4,
              width:4+i*2, height:4+i*2, borderRadius:'50%',
              background:'rgba(160,150,140,0.2)',
              filter:'blur(3px)',
              animation:`smokeRise ${3+i*0.8}s ease-out ${i*0.6}s infinite`,
            }}/>
          ))}
        </div>
      )}

      {/* ══ TINY SNAIL (crawls up trunk with progress) ══ */}
      {isActive && progress > 0.05 && (
        <div style={{
          position:'absolute', zIndex:8, pointerEvents:'none',
          left:'23.5%',
          bottom:`${19 + progress * 50}%`,
          transition:'bottom 3s ease-out',
          animation:'snailBob 3.5s ease-in-out infinite',
        }}>
          <svg width="18" height="15" viewBox="0 0 18 15" style={{ display:'block', transform:'scaleX(-1)' }}>
            <ellipse cx="11" cy="5.5" rx="5.5" ry="5" fill="#c49060"/>
            <ellipse cx="11" cy="5.5" rx="4.2" ry="3.8" fill="#d4a878"/>
            <path d="M11,5.5 Q13.5,3.5 12,2.5 Q10,1.8 9.5,3.5 Q9,5 10.5,5.5 Q12,6.5 12.5,5" stroke="#a07040" strokeWidth="0.6" fill="none"/>
            <ellipse cx="6.5" cy="11.5" rx="7" ry="2.8" fill="#8a9a6a"/>
            <ellipse cx="6.5" cy="11" rx="5" ry="1.8" fill="#9aaa7a" opacity="0.5"/>
            <ellipse cx="1.8" cy="9.5" rx="2.5" ry="2" fill="#8a9a6a"/>
            <line x1="1.2" y1="9" x2="-0.5" y2="5.5" stroke="#7a8a5a" strokeWidth="0.7" strokeLinecap="round"/>
            <circle cx="-0.5" cy="5.5" r="0.9" fill="#2a2a2a"/>
            <circle cx="-0.2" cy="5.2" r="0.35" fill="white" opacity="0.8"/>
            <line x1="2.8" y1="8.5" x2="1.5" y2="6" stroke="#7a8a5a" strokeWidth="0.7" strokeLinecap="round"/>
            <circle cx="1.5" cy="6" r="0.9" fill="#2a2a2a"/>
            <circle cx="1.8" cy="5.7" r="0.35" fill="white" opacity="0.8"/>
            <circle cx="1" cy="10.5" r="1.2" fill="#ffb0b0" opacity="0.35"/>
          </svg>
          <div style={{
            position:'absolute', top:12, left:10, width:20, height:1,
            background:'linear-gradient(90deg, rgba(180,200,160,0.35), transparent)',
            borderRadius:1, filter:'blur(0.5px)',
          }}/>
        </div>
      )}

      {/* ══ PAPER LANTERN (dusk/night, hangs from branch) ══ */}
      {duskOp > 0.25 && isActive && (
        <div style={{
          position:'absolute', zIndex:7, pointerEvents:'none',
          left:'37%', top:'30%',
          animation:'lanternSway 4.5s ease-in-out infinite',
          transformOrigin:'center top',
          opacity: Math.min(1, duskOp * 1.5),
        }}>
          <div style={{
            position:'absolute', top:'35%', left:'50%', transform:'translate(-50%,-50%)',
            width:50, height:50, borderRadius:'50%',
            background:'radial-gradient(circle, rgba(255,180,60,0.4), rgba(255,140,30,0.12), transparent)',
            filter:'blur(10px)',
            animation:'lanternFlicker 2.2s ease-in-out infinite',
          }}/>
          <svg width="16" height="26" viewBox="0 0 16 26" style={{ display:'block' }}>
            <line x1="8" y1="0" x2="8" y2="5" stroke="#5a4030" strokeWidth="0.8"/>
            <rect x="5" y="5" width="6" height="2" rx="0.5" fill="#7a6050"/>
            <rect x="3.5" y="7" width="9" height="12" rx="2.5" fill="rgba(255,200,100,0.75)" stroke="#9a8070" strokeWidth="0.4"/>
            <rect x="5" y="8.5" width="6" height="9" rx="1.8" fill="#ffd060" opacity="0.5"/>
            <circle cx="8" cy="13" r="1.8" fill="#fff0a0" opacity="0.7"
              style={{animation:'lanternFlicker 1.8s ease-in-out 0.3s infinite'}}/>
            <rect x="5" y="19" width="6" height="1.5" rx="0.5" fill="#7a6050"/>
            <path d="M6.5,20.5 Q8,22 9.5,20.5" stroke="#9a7050" strokeWidth="0.5" fill="none"/>
            <line x1="7" y1="22" x2="7" y2="24" stroke="#c8585a" strokeWidth="0.5"/>
            <circle cx="7" cy="24.5" r="0.8" fill="#c8585a" opacity="0.7"/>
            <line x1="9" y1="22" x2="9" y2="23.5" stroke="#c8585a" strokeWidth="0.5"/>
            <circle cx="9" cy="24" r="0.6" fill="#c8585a" opacity="0.6"/>
          </svg>
        </div>
      )}

      {/* ══ TREE SCENE ══ */}
      <TreeScene
        progress={progress} theme={theme}
        treeShake={treeShake} shimmer={shimmer}
      />

      {/* Intention banner */}
      {intention && isActive && (
        <div style={{ position:'absolute', top:28, left:28, background:'rgba(250,246,237,0.86)', border:`0.5px solid ${line}`, borderRadius:10, padding:'7px 14px 7px 16px', maxWidth:'70%', zIndex:5, backdropFilter:'blur(6px)', display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:18, height:1, background:theme.accentDeep }}/>
          <span style={{ fontSize:13, fontWeight:400, color:ink, fontFamily:serif, fontStyle:'italic', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', letterSpacing:'0.01em' }}>{intention}</span>
        </div>
      )}

      {/* ══ RIGHT PANEL ══ */}
      <div style={{
        position:'relative', flex:'1 1 50%', zIndex:4,
        display:'flex', alignItems:'center', justifyContent:'center',
        background:'linear-gradient(180deg, rgba(250,246,237,0.72) 0%, rgba(240,230,210,0.78) 100%)',
        backdropFilter:'blur(14px) saturate(1.15)',
        WebkitBackdropFilter:'blur(14px) saturate(1.15)',
        borderLeft:`0.5px solid ${line}`,
        boxShadow:'-8px 0 40px rgba(45,36,24,0.06)', overflow:'hidden',
      }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.5), transparent 50%)', pointerEvents:'none' }}/>

        {/* Top-right icons */}
        <div style={{ position:'absolute', top:18, right:18, display:'flex', gap:8, zIndex:10 }}>
          {user ? (
            <div style={{ position:'relative' }}>
              <button onClick={() => setShowUserMenu(m=>!m)} title={user.username} style={{
                width:34, height:34, borderRadius:'50%',
                background:user.avatar_color||'#4a7a45',
                border:'none', cursor:'pointer', color:'white',
                fontSize:14, fontWeight:500, fontFamily:sans,
                boxShadow:`0 2px 8px ${user.avatar_color||'#4a7a45'}55`,
              }}>
                {(user.username||'U')[0].toUpperCase()}
              </button>
              {showUserMenu && (
                <div style={{ position:'absolute', top:42, right:0, background:cream, border:`0.5px solid ${line}`, borderRadius:12, padding:'8px 0', minWidth:160, boxShadow:'0 8px 28px rgba(45,36,24,0.15)', zIndex:20 }}>
                  <div style={{ padding:'8px 16px 4px', fontSize:12, fontWeight:500, color:ink, fontFamily:sans }}>{user.username}</div>
                  <div style={{ height:'0.5px', background:line, margin:'6px 0' }}/>
                  {[['Stats', '/dashboard'], ['Grove', '/grove']].map(([label, to]) => (
                    <a key={to} href={to} style={{ display:'block', padding:'8px 16px', fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', fontFamily:sans, color:ink2, textDecoration:'none' }}>{label}</a>
                  ))}
                  <div style={{ height:'0.5px', background:line, margin:'6px 0' }}/>
                  <button onClick={()=>{logout();setShowUserMenu(false);}} style={{ display:'block', width:'100%', padding:'8px 16px', textAlign:'left', background:'none', border:'none', cursor:'pointer', fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', fontFamily:sans, color:ink3 }}>Sign out</button>
                </div>
              )}
            </div>
          ) : (
            <a href="/login" style={{ display:'flex', alignItems:'center', height:34, padding:'0 12px', borderRadius:17, border:`0.5px solid ${line}`, background:cream, fontSize:10, fontWeight:500, letterSpacing:'0.16em', textTransform:'uppercase', fontFamily:sans, color:ink2, textDecoration:'none', boxShadow:'0 1px 0 rgba(255,255,255,0.6) inset' }}>Sign in</a>
          )}
          {/* Rain toggle */}
          <button onClick={toggleRain} title={rainOn?'Rain on — click to stop':'Gentle rain'} style={{
            width:34, height:34, borderRadius:'50%',
            border: rainOn ? '1.5px solid rgba(100,168,230,0.75)' : `0.5px solid ${line}`,
            background: rainOn ? 'rgba(100,168,230,0.14)' : cream,
            cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
            color: rainOn ? '#3a78b8' : ink2,
            boxShadow: rainOn
              ? '0 0 14px rgba(100,168,230,0.35), 0 1px 0 rgba(255,255,255,0.4) inset'
              : '0 1px 0 rgba(255,255,255,0.6) inset',
            transition:'all 0.3s',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"/>
              <line x1="8" y1="19" x2="8" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="23"/>
              <line x1="16" y1="19" x2="16" y2="21"/>
            </svg>
          </button>

          {/* Weather indicator */}
          {weather !== 'clear' && isActive && (
            <div style={{
              height:34, padding:'0 10px', borderRadius:17,
              border:`0.5px solid ${line}`, background:cream,
              display:'flex', alignItems:'center', gap:5,
              fontSize:9, fontWeight:500, letterSpacing:'0.14em',
              textTransform:'uppercase', fontFamily:sans, color:ink3,
              boxShadow:'0 1px 0 rgba(255,255,255,0.6) inset',
              animation:'fadeIn 0.6s ease-out',
            }}>
              {weather==='snow' && <span style={{fontSize:12}}>*</span>}
              {weather==='mist' && <span style={{fontSize:12, opacity:0.6}}>~</span>}
              {weather==='windy' && <span style={{fontSize:12}}>~</span>}
              {weather}
            </div>
          )}
          <button onClick={()=>setSoundOn(s=>!s)} title={soundOn?'Sound on':'Sound off'} style={{ width:34, height:34, borderRadius:'50%', border:`0.5px solid ${line}`, background:cream, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 1px 0 rgba(255,255,255,0.6) inset', color:ink2 }}>
            {soundOn?(
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
            ):(
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
            )}
          </button>
          <button onClick={()=>{setDraftMins(totalMins);setDraftCards(totalCards);setDraftTheme(themeKey);setShowSettings(true);}} title="Settings" style={{ width:34, height:34, borderRadius:'50%', border:`0.5px solid ${line}`, background:cream, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 1px 0 rgba(255,255,255,0.6) inset', color:ink2 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          </button>
        </div>

        {/* Control area */}
        <div style={{ width:'88%', maxWidth:380, display:'flex', flexDirection:'column', alignItems:'stretch', position:'relative', zIndex:1 }}>

          <div style={{ textAlign:'center', marginBottom:14 }}>
            <div style={{ fontSize:10, fontWeight:600, color:ink3, letterSpacing:'0.32em', textTransform:'uppercase', marginBottom:8, fontFamily:sans }}>
              {isActive?'In Session':timeLeft===totalSeconds?'A new session':timeLeft<=0?'Complete':'Paused'}
            </div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}>
              <div style={{ width:30, height:1, background:line }}/>
              <TinyTreeIcon themeKey={themeKey} size={14}/>
              <div style={{ width:30, height:1, background:line }}/>
            </div>
          </div>

          {!isActive && timeLeft===totalSeconds && (
            <input type="text" placeholder="What are you focusing on?" value={intention}
              onChange={e=>setIntention(e.target.value.slice(0,60))}
              style={{ width:'100%', padding:'10px 16px', fontSize:13, fontStyle:'italic', fontFamily:serif, border:`0.5px solid ${line}`, background:'rgba(255,255,255,0.5)', borderRadius:10, color:ink, outline:'none', marginBottom:14, textAlign:'center', boxSizing:'border-box' }}/>
          )}

          {/* Main timer */}
          <div style={{ display:'flex', alignItems:'baseline', justifyContent:'center', gap:2, marginBottom:2, position:'relative' }}>
            <span style={{ fontSize:88, fontWeight:400, color:ink, letterSpacing:'-0.04em', lineHeight:0.95, fontFamily:serif }}>{mins}</span>
            <span style={{ fontSize:44, fontWeight:300, color:ink3, fontFamily:serif }}>:{secs<10?`0${secs}`:secs}</span>
            <svg width="130" height="130" viewBox="0 0 130 130" style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', pointerEvents:'none', opacity:0.16 }}>
              <circle cx="65" cy="65" r="60" fill="none" stroke={ink3} strokeWidth="1.5"/>
              <circle cx="65" cy="65" r="60" fill="none" stroke={theme.accentDeep} strokeWidth="1.5"
                strokeDasharray={`${2*Math.PI*60}`} strokeDashoffset={2*Math.PI*60*(1-progress)}
                strokeLinecap="round" transform="rotate(-90 65 65)" style={{ transition:'stroke-dashoffset 1s linear' }}/>
            </svg>
          </div>
          <p style={{ fontSize:9, color:ink3, marginBottom:14, marginTop:0, letterSpacing:'0.32em', textTransform:'uppercase', textAlign:'center', fontFamily:sans }}>remaining</p>

          {/* Per-card timer */}
          <div style={{ ...cardStyle, marginBottom:12 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
              <span style={{ fontSize:9, fontWeight:600, letterSpacing:'0.22em', color:ink3, textTransform:'uppercase', fontFamily:sans }}>
                {cardsDone>=totalCards?'All cards done':`Card ${Math.min(cardsDone+1,totalCards)} timer`}
              </span>
              <span style={{ fontSize:20, fontWeight:400, fontFamily:serif, color:cardUrgent?'#b03020':ink, animation:cardUrgent?'urgentPulse 0.8s ease-in-out infinite':'none', letterSpacing:'-0.02em' }}>
                {cardMins>0?`${cardMins}:`:''}
                {cardMins>0?(cardSecs<10?`0${cardSecs}`:cardSecs):cardSecs}
                <span style={{ fontSize:10, fontWeight:300, color:ink3, marginLeft:2, fontStyle:'italic' }}>s</span>
              </span>
            </div>
            <div style={{ height:3, background:'rgba(45,36,24,0.08)', borderRadius:2, overflow:'hidden' }}>
              <div style={{ height:'100%', borderRadius:2, background:cardUrgent?'#b03020':theme.accent, width:`${cardPct*100}%`, transition:'width 1s linear,background 0.5s' }}/>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', marginTop:6 }}>
              <span style={{ fontSize:9, color:ink3, letterSpacing:'0.06em', fontFamily:sans }}>{Math.floor(secsPerCard/60)}m {Math.round(secsPerCard%60)}s allotted</span>
              {cardUrgent && <span style={{ fontSize:9, color:'#b03020', fontWeight:600, letterSpacing:'0.1em', animation:'urgentPulse 0.8s ease-in-out infinite', fontFamily:sans, textTransform:'uppercase' }}>move on</span>}
            </div>
          </div>

          {/* Done / Redo */}
          <div style={{ display:'flex', gap:8, marginBottom:12 }}>
            <button onClick={completeCard} disabled={!isActive||cardsDone>=totalCards||timeLeft<=0} style={{ flex:'2 1 0', padding:'12px 14px', borderRadius:12, border:'none', cursor:(!isActive||cardsDone>=totalCards||timeLeft<=0)?'not-allowed':'pointer', background:(!isActive||cardsDone>=totalCards||timeLeft<=0)?'rgba(45,36,24,0.06)':theme.accentDeep, color:(!isActive||cardsDone>=totalCards||timeLeft<=0)?ink3:cream, fontSize:11, fontWeight:500, letterSpacing:'0.16em', textTransform:'uppercase', fontFamily:sans, boxShadow:(!isActive||cardsDone>=totalCards||timeLeft<=0)?'none':`0 6px 18px ${theme.accentDeep}33`, transition:'all 0.2s', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2,7.5 L5.5,11 L12,3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Done
              {isActive && <span style={{ fontSize:9, opacity:0.6, letterSpacing:'0.2em', fontFamily:sans }}>D</span>}
            </button>
            <button onClick={redoCard} disabled={!isActive||timeLeft<=0} style={{ flex:'1 1 0', padding:'12px 10px', borderRadius:12, border:`0.5px solid ${line}`, cursor:(!isActive||timeLeft<=0)?'not-allowed':'pointer', background:(!isActive||timeLeft<=0)?'rgba(45,36,24,0.04)':cream, color:(!isActive||timeLeft<=0)?ink3:ink2, fontSize:10, fontWeight:500, letterSpacing:'0.16em', textTransform:'uppercase', fontFamily:sans, transition:'all 0.2s', display:'flex', alignItems:'center', justifyContent:'center', gap:6, boxShadow:'0 1px 0 rgba(255,255,255,0.6) inset' }}>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M11,5 A4.5,4.5 0 1,0 11,9 M11,3 L11,5 L9,5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
              Redo
              {isActive && <span style={{ fontSize:9, opacity:0.55, letterSpacing:'0.2em', fontFamily:sans }}>F</span>}
            </button>
          </div>

          {/* Play / reset */}
          <div style={{ display:'flex', gap:12, marginBottom:14, justifyContent:'center' }}>
            <button onClick={toggle} disabled={timeLeft<=0} style={{ width:48, height:48, borderRadius:'50%', border:'none', cursor:timeLeft<=0?'not-allowed':'pointer', background:timeLeft<=0?'rgba(45,36,24,0.15)':isActive?'#c4965a':theme.accent, color:cream, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:timeLeft<=0?'none':isActive?'0 6px 18px rgba(196,150,90,0.4)':`0 6px 18px ${theme.accent}66`, transition:'all 0.25s' }}>
              {isActive?(
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
              ):(
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4l13 8-13 8z"/></svg>
              )}
            </button>
            <button onClick={reset} style={{ width:48, height:48, borderRadius:'50%', border:`0.5px solid ${line}`, background:cream, cursor:'pointer', color:ink2, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 1px 0 rgba(255,255,255,0.6) inset', transition:'all 0.25s' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            </button>
          </div>

          {/* Cards left */}
          <div style={{ ...cardStyle, marginBottom:10 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:10 }}>
              <span style={{ fontSize:9, fontWeight:600, letterSpacing:'0.22em', color:ink3, textTransform:'uppercase', fontFamily:sans }}>Cards left</span>
              <div style={{ display:'flex', alignItems:'baseline', gap:5 }}>
                <span style={{ fontSize:24, fontWeight:400, lineHeight:1, fontFamily:serif, letterSpacing:'-0.02em', color:cardsLeft===0?theme.accentDeep:ink }}>{cardsLeft}</span>
                <span style={{ fontSize:11, color:ink3, fontFamily:serif, fontStyle:'italic' }}>of {totalCards}</span>
              </div>
            </div>
            {cardsLeft>0 && (
              <div style={{ display:'flex', gap:14, marginBottom:10, fontSize:10, fontFamily:sans, color:ink2, letterSpacing:'0.02em' }}>
                <span style={{ display:'inline-flex', alignItems:'center', gap:5 }}>
                  <div style={{ width:7, height:7, borderRadius:'50%', background:theme.accent }}/><span>{freshLeft}</span><span style={{ color:ink3 }}>fresh</span>
                </span>
                {reviewLeft>0 && (
                  <span style={{ display:'inline-flex', alignItems:'center', gap:5 }}>
                    <div style={{ width:7, height:7, borderRadius:'50%', background:'#c4965a' }}/><span>{reviewLeft}</span><span style={{ color:ink3 }}>review</span>
                  </span>
                )}
              </div>
            )}
            {isActive && cardsLeft>0 && (
              <div style={{ display:'flex', alignItems:'center', gap:7, padding:'6px 10px', marginBottom:10, background:paceConfig.bg, border:`0.5px solid ${paceConfig.col}33`, borderRadius:8, fontSize:10, fontFamily:sans, color:paceConfig.col, letterSpacing:'0.04em', fontWeight:500 }}>
                {pace==='ahead' && <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M5.5,2 L5.5,9 M2.5,5 L5.5,2 L8.5,5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                {pace==='behind' && <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M5.5,9 L5.5,2 M2.5,6 L5.5,9 L8.5,6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                {pace==='onpace' && <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><circle cx="5.5" cy="5.5" r="3" fill="currentColor"/></svg>}
                <span>{paceConfig.label}</span>
              </div>
            )}
            <div style={{ height:2, background:'rgba(45,36,24,0.08)', borderRadius:2, marginBottom:10, overflow:'hidden' }}>
              <div style={{ height:'100%', background:theme.accent, borderRadius:2, width:`${cardsProgress*100}%`, transition:'width 0.6s cubic-bezier(0.34,1.56,0.64,1)', boxShadow:cardsProgress>0?`0 0 6px ${theme.glow}0.6)`:'none' }}/>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:totalCards<=30?'repeat(10,1fr)':totalCards<=60?'repeat(15,1fr)':'repeat(20,1fr)', gap:totalCards<=30?'5px 3px':totalCards<=60?'4px 2px':'3px 1.5px' }}>
              {Array.from({length:totalCards}).map((_,i) => {
                const harvested=i<cardsDone, isNext=i===cardsDone&&cardsDone<totalCards, expected=i<expectedCards&&i>=cardsDone;
                const size=totalCards<=30?(isNext?9:harvested?7:5):totalCards<=60?(isNext?7:harvested?5:4):(isNext?5:harvested?4:3);
                return (
                  <div key={i} style={{ display:'flex', justifyContent:'center', alignItems:'center', height:totalCards<=30?10:totalCards<=60?8:6 }}>
                    <div style={{ width:size, height:size, borderRadius:'50%', background:harvested?theme.accent:isNext?theme.accentDeep:expected?'rgba(176,48,32,0.3)':'rgba(45,36,24,0.14)', boxShadow:harvested?`0 0 4px ${theme.glow}0.6)`:'none', transition:'all 0.5s cubic-bezier(0.34,1.56,0.64,1)', animation:isNext?'breathe 1.6s ease-in-out infinite':'none' }}/>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Today's grove */}
          {sessionsToday.length>0 && (
            <div style={{ ...cardStyle, marginBottom:10, padding:'10px 16px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:7 }}>
                <span style={{ fontSize:9, fontWeight:600, letterSpacing:'0.22em', color:ink3, textTransform:'uppercase', fontFamily:sans }}>Today's grove</span>
                <span style={{ fontSize:11, fontWeight:400, color:theme.accentDeep, fontFamily:serif, fontStyle:'italic' }}>{sessionsToday.length} {sessionsToday.length===1?'tree':'trees'}</span>
              </div>
              <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                {sessionsToday.map((tk,i) => (
                  <div key={i} style={{ animation:`treePop 0.5s cubic-bezier(0.34,1.56,0.64,1) ${i*0.05}s both` }}>
                    <TinyTreeIcon themeKey={tk} size={22}/>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div style={{ textAlign:'center', marginTop:4 }}>
            <span style={{ fontSize:10, color:ink3, letterSpacing:'0.18em', fontFamily:sans, textTransform:'uppercase', display:'inline-flex', alignItems:'center', gap:8 }}>
              <div style={{ width:5, height:5, borderRadius:'50%', background:isActive?theme.accent:'rgba(45,36,24,0.2)', transition:'background 0.5s' }}/>
              {totalMins}m · {totalCards} cards · {theme.name}
            </span>
            <div style={{ fontSize:9, color:ink3, marginTop:5, letterSpacing:'0.12em', fontFamily:sans, opacity:0.7 }}>
              Space · D · F · R · S
            </div>
          </div>
        </div>
      </div>

      {/* Rare Guest — clickable during focus check */}
      {guest && (
        <RareGuest
          type={guest.type}
          state={guest.state}
          countdown={focusRespCountdown ?? 20}
          onClick={handleGuestClick}
        />
      )}

      {/* Completion modal */}
      {showCelebration && (
        <div style={{ position:'fixed', inset:0, zIndex:99, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(45,36,24,0.45)', backdropFilter:'blur(8px)', animation:'fadeIn 0.4s ease-out' }}>
          {Array.from({length:50}).map((_,i) => (
            <div key={i} style={{ position:'absolute', top:'-20px', left:`${(i*1.97)%100}%`, width:i%3===0?7:5, height:i%3===0?11:7, background:[theme.leafLight,theme.leafMid,'#fde68a',theme.accent,'#e9a8c0'][i%5], borderRadius:i%2===0?1.5:'50%', animation:`confettiFall ${3+(i%4)*0.5}s linear ${(i%10)*0.1}s forwards` }}/>
          ))}
          <div style={{ background:cream, border:`0.5px solid ${line}`, borderRadius:20, padding:'34px 38px', maxWidth:360, width:'90%', display:'flex', flexDirection:'column', alignItems:'center', gap:14, boxShadow:'0 24px 80px rgba(45,36,24,0.25)', animation:'celebrationPop 0.6s cubic-bezier(0.34,1.56,0.64,1)', textAlign:'center', zIndex:1 }}>
            <div style={{ animation:'treePop 0.6s cubic-bezier(0.34,1.56,0.64,1)' }}>
              <TinyTreeIcon themeKey={themeKey} size={52}/>
            </div>
            <div style={{ fontSize:26, fontWeight:400, color:ink, letterSpacing:'-0.02em', fontFamily:serif }}>
              {cardsDone>=totalCards?'All cards done':'Session complete'}
            </div>
            <p style={{ fontSize:13, color:ink2, margin:0, lineHeight:1.55, fontStyle:'italic', fontFamily:serif }}>
              {cardsDone} of {totalCards} cards{freshDone>0||reviewDone>0?` — ${freshDone} fresh, ${reviewDone} reviewed`:''}.
              {timeLeft<=0&&` Full ${totalMins} minutes.`}
            </p>
            {intention && (
              <div style={{ background:`${theme.accent}10`, padding:'8px 14px', borderRadius:8, fontSize:12, color:theme.accentDeep, fontStyle:'italic', fontFamily:serif, border:`0.5px solid ${theme.accent}33` }}>{intention}</div>
            )}
            {!user && (
              <div style={{ background:'rgba(90,122,74,0.08)', padding:'10px 14px', borderRadius:10, fontSize:12, color:ink2, fontFamily:sans, border:`0.5px solid rgba(90,122,74,0.2)`, letterSpacing:'0.04em' }}>
                <Link to="/register" style={{ color:'#3d5a3a', fontWeight:500 }}>Create an account</Link> to save your grove
              </div>
            )}
            {savingSession && <div style={{ fontSize:10, color:ink3, fontFamily:sans, letterSpacing:'0.12em' }}>Saving to grove…</div>}
            <div style={{ display:'flex', gap:10, marginTop:6 }}>
              <button onClick={()=>{setShowCelebration(false);reset();}} style={{ background:theme.accentDeep, color:cream, border:'none', borderRadius:10, padding:'10px 22px', fontSize:11, fontWeight:500, cursor:'pointer', letterSpacing:'0.18em', textTransform:'uppercase', fontFamily:sans, boxShadow:`0 5px 14px ${theme.accentDeep}55` }}>Plant another</button>
              <button onClick={()=>setShowCelebration(false)} style={{ background:'rgba(45,36,24,0.06)', border:'none', borderRadius:10, padding:'10px 22px', fontSize:11, fontWeight:500, cursor:'pointer', color:ink2, letterSpacing:'0.18em', textTransform:'uppercase', fontFamily:sans }}>
                {timeLeft>0?'Keep going':'Admire it'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings modal */}
      {showSettings && (
        <div style={{ position:'fixed', inset:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(45,36,24,0.4)', backdropFilter:'blur(6px)' }}>
          <div style={{ background:cream, border:`0.5px solid ${line}`, borderRadius:18, padding:'24px 28px 22px', maxWidth:420, width:'90%', display:'flex', flexDirection:'column', gap:18, boxShadow:'0 24px 80px rgba(45,36,24,0.25)', maxHeight:'90vh', overflowY:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontSize:20, fontWeight:400, color:ink, fontFamily:serif, letterSpacing:'-0.02em' }}>Session</span>
              <button onClick={()=>setShowSettings(false)} style={{ background:'none', border:'none', cursor:'pointer', color:ink3, fontSize:20, lineHeight:1, padding:4 }}>×</button>
            </div>

            {/* Duration */}
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                <span style={{ fontSize:10, fontWeight:600, color:ink3, letterSpacing:'0.18em', textTransform:'uppercase', fontFamily:sans }}>Duration</span>
                <span style={{ fontSize:14, color:TREE_THEMES[draftTheme].accentDeep, fontFamily:serif }}>{draftMins} min</span>
              </div>
              <input type="range" min={5} max={180} step={5} value={draftMins} onChange={e=>setDraftMins(+e.target.value)} style={{ width:'100%', accentColor:TREE_THEMES[draftTheme].accentDeep, cursor:'pointer' }}/>
            </div>

            {/* Cards */}
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                <span style={{ fontSize:10, fontWeight:600, color:ink3, letterSpacing:'0.18em', textTransform:'uppercase', fontFamily:sans }}>Cards</span>
                <span style={{ fontSize:14, color:TREE_THEMES[draftTheme].accentDeep, fontFamily:serif }}>{draftCards}</span>
              </div>
              <input type="range" min={1} max={120} step={1} value={draftCards} onChange={e=>setDraftCards(+e.target.value)} style={{ width:'100%', accentColor:TREE_THEMES[draftTheme].accentDeep, cursor:'pointer' }}/>
            </div>

            {/* Tree type */}
            <div>
              <div style={{ fontSize:10, fontWeight:600, color:ink3, marginBottom:9, letterSpacing:'0.18em', textTransform:'uppercase', fontFamily:sans }}>Tree species</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
                {Object.entries(TREE_THEMES).map(([k,t]) => (
                  <button key={k} onClick={()=>setDraftTheme(k)} style={{ border:draftTheme===k?`1.5px solid ${t.accentDeep}`:`0.5px solid ${line}`, background:draftTheme===k?`${t.accent}15`:'rgba(255,255,255,0.5)', borderRadius:10, cursor:'pointer', padding:'10px 6px', display:'flex', flexDirection:'column', alignItems:'center', gap:6, transition:'all 0.2s' }}>
                    <TinyTreeIcon themeKey={k} size={32}/>
                    <span style={{ fontSize:11, fontWeight:400, fontFamily:serif, color:draftTheme===k?t.accentDeep:ink2, fontStyle:draftTheme===k?'normal':'italic' }}>{t.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div style={{ background:`${TREE_THEMES[draftTheme].accent}10`, borderRadius:10, padding:'10px 14px', border:`0.5px solid ${TREE_THEMES[draftTheme].accent}33` }}>
              <div style={{ fontSize:9, color:ink3, marginBottom:3, letterSpacing:'0.18em', textTransform:'uppercase', fontFamily:sans }}>Preview</div>
              <div style={{ fontSize:13, color:ink, fontFamily:serif, fontStyle:'italic' }}>
                {draftMins} min · {draftCards} cards · <span style={{ color:TREE_THEMES[draftTheme].accentDeep, fontStyle:'normal' }}>{Math.floor((draftMins*60/draftCards)/60)}m {Math.round((draftMins*60/draftCards)%60)}s</span> per card
              </div>
            </div>

            <button onClick={applySettings} style={{ background:TREE_THEMES[draftTheme].accentDeep, color:cream, border:'none', borderRadius:10, padding:'12px', fontSize:11, fontWeight:500, cursor:'pointer', letterSpacing:'0.18em', textTransform:'uppercase', fontFamily:sans, boxShadow:`0 6px 18px ${TREE_THEMES[draftTheme].accentDeep}55` }}>Apply</button>
            <div style={{ fontSize:9, color:ink3, textAlign:'center', letterSpacing:'0.12em', fontFamily:sans, textTransform:'uppercase', opacity:0.7 }}>Space play · D done · F redo · R reset · S settings</div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes breathe{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.4);opacity:0.45}}
        @keyframes spinRays{from{transform:translate(-50%,-50%) rotate(0deg)}to{transform:translate(-50%,-50%) rotate(360deg)}}
        @keyframes floatUp{0%{transform:translateY(0) rotate(0deg);opacity:0.7}100%{transform:translateY(-280px) translateX(40px) rotate(320deg);opacity:0}}
        @keyframes glowOrbRise{0%{transform:translateY(0) scale(0.6);opacity:0}15%{opacity:1;transform:translateY(-30px) scale(1)}85%{opacity:0.9;transform:translateY(-260px) scale(1.15)}100%{transform:translateY(-340px) scale(0.9);opacity:0}}
        @keyframes sparkBurst{0%{opacity:1;transform:scale(0)}100%{opacity:0;transform:scale(1)}}
        @keyframes urgentPulse{0%,100%{opacity:1}50%{opacity:0.5}}
        @keyframes twinkle{0%,100%{opacity:0.3}50%{opacity:1}}
        @keyframes birdFly{0%{left:-50px;transform:translateY(0)}50%{transform:translateY(-30px)}100%{left:60%;transform:translateY(-10px)}}
        @keyframes wingFlap{0%,100%{transform:scaleY(1)}50%{transform:scaleY(0.6)}}
        @keyframes butterflyFly{0%{left:-20px;transform:translateY(0) rotate(0deg)}25%{transform:translateY(-25px) rotate(5deg)}50%{transform:translateY(15px) rotate(-3deg)}75%{transform:translateY(-15px) rotate(8deg)}100%{left:55%;transform:translateY(0)}}
        @keyframes butterflyFlap{0%,100%{transform:scaleX(1)}50%{transform:scaleX(0.4)}}
        @keyframes butterflyBurst{0%{transform:translate(0,0) scale(0);opacity:0}20%{opacity:1;transform:translate(0,0) scale(1)}100%{transform:translate(var(--tx,80px),var(--ty,-120px)) scale(1) rotate(180deg);opacity:0}}
        @keyframes fireflyFloat{0%,100%{transform:translate(0,0);opacity:0.4}25%{transform:translate(20px,-15px);opacity:1}50%{transform:translate(-10px,-30px);opacity:0.6}75%{transform:translate(15px,-20px);opacity:0.9}}
        @keyframes rainbowFade{0%{opacity:0;transform:translateY(20px)}25%{opacity:1;transform:translateY(0)}80%{opacity:1}100%{opacity:0}}
        @keyframes shootingStar{0%{transform:rotate(20deg) translateX(0);opacity:0}10%{opacity:1}100%{transform:rotate(20deg) translateX(500px);opacity:0}}
        @keyframes treeShake{0%,100%{transform:translateX(0)}15%{transform:translateX(-3px) rotate(-0.5deg)}30%{transform:translateX(3px) rotate(0.5deg)}45%{transform:translateX(-2px)}60%{transform:translateX(2px)}75%{transform:translateX(-1px)}}
        @keyframes treePop{0%{transform:scale(0);opacity:0}100%{transform:scale(1);opacity:1}}
        @keyframes confettiFall{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(110vh) rotate(720deg);opacity:0.6}}
        @keyframes celebrationPop{0%{transform:scale(0.6);opacity:0}60%{transform:scale(1.05);opacity:1}100%{transform:scale(1)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes petalFall{0%{opacity:0;transform:translate(0,0) rotate(var(--rot))}15%{opacity:0.95}100%{opacity:0;transform:translate(var(--drift),200px) rotate(calc(var(--rot)+540deg))}}
        @keyframes floaterRise{0%{opacity:0;transform:translateY(0) scale(0.7)}20%{opacity:1;transform:translateY(-10px) scale(1)}100%{opacity:0;transform:translateY(-60px) scale(1.05)}}
        @keyframes leafDrift{0%{left:-3%;transform:translateY(0) rotate(0deg);opacity:0}8%{opacity:0.85}50%{transform:translateY(40px) rotate(180deg)}92%{opacity:0.75}100%{left:55%;transform:translateY(80px) rotate(540deg);opacity:0}}
        @keyframes cloudDriftSlow{0%{transform:translateX(0)}100%{transform:translateX(60px)}}
        @keyframes foxPeek{0%{transform:translateY(120px) scale(0.85);opacity:0}60%{transform:translateY(-8px) scale(1.03)}100%{transform:translateY(0) scale(1);opacity:1}}
        @keyframes dustDrift{0%,100%{transform:translate(0,0);opacity:0.4}25%{transform:translate(8px,-12px);opacity:0.85}50%{transform:translate(-6px,-22px);opacity:0.6}75%{transform:translate(10px,-14px);opacity:0.8}}
        input[type=range]{height:4px;border-radius:2px;}
        *{-webkit-font-smoothing:antialiased;}
        @keyframes rainFall{
          0%  {transform:translateY(-22px) rotate(10deg);opacity:0}
          6%  {opacity:var(--ro,0.5)}
          94% {opacity:var(--ro,0.5)}
          100%{transform:translateY(102vh) rotate(10deg);opacity:0}
        }
        @keyframes rainRipple{
          0%  {transform:scale(0);opacity:0.75;border-width:1.5px}
          55% {opacity:0.25;border-width:0.8px}
          100%{transform:scale(1);opacity:0;border-width:0.3px}
        }
        @keyframes wetSheen{
          0%,100%{opacity:0.6} 50%{opacity:1}
        }
        @keyframes snowFall{
          0%{transform:translateY(-10px) translateX(0);opacity:0}
          8%{opacity:var(--so,0.7)}
          50%{transform:translateY(50vh) translateX(var(--drift,10px))}
          92%{opacity:var(--so,0.5)}
          100%{transform:translateY(100vh) translateX(calc(var(--drift,10px)*-0.5));opacity:0}
        }
        @keyframes mistDrift{
          0%,100%{transform:translateX(-8%) scaleX(1);opacity:0.15}
          30%{transform:translateX(5%) scaleX(1.1);opacity:0.3}
          60%{transform:translateX(-3%) scaleX(0.95);opacity:0.2}
          80%{transform:translateX(8%) scaleX(1.05);opacity:0.25}
        }
        @keyframes windGust{
          0%{transform:translateX(-100%) translateY(0);opacity:0}
          8%{opacity:1}
          92%{opacity:0.7}
          100%{transform:translateX(55vw) translateY(15px);opacity:0}
        }
        @keyframes auroraWave1{
          0%,100%{transform:translateX(-8%) scaleY(1);opacity:0.4}
          25%{transform:translateX(5%) scaleY(1.3);opacity:0.8}
          50%{transform:translateX(-3%) scaleY(0.8);opacity:0.5}
          75%{transform:translateX(8%) scaleY(1.1);opacity:0.9}
        }
        @keyframes auroraWave2{
          0%,100%{transform:translateX(5%) scaleY(0.9);opacity:0.3}
          33%{transform:translateX(-8%) scaleY(1.3);opacity:0.7}
          66%{transform:translateX(3%) scaleY(1.4);opacity:0.5}
        }
        @keyframes auroraWave3{
          0%,100%{transform:translateX(0%) scaleY(1);opacity:0.2}
          50%{transform:translateX(-5%) scaleY(1.5);opacity:0.7}
        }
        @keyframes shootingStarStreak{
          0%{transform:rotate(25deg) translateX(0) scaleX(0.3);opacity:0}
          8%{opacity:1;transform:rotate(25deg) translateX(20px) scaleX(1)}
          100%{transform:rotate(25deg) translateX(420px) scaleX(0.6);opacity:0}
        }
        @keyframes campfireGlow{
          0%,100%{opacity:0.6;transform:translateX(-50%) scale(1)}
          50%{opacity:0.95;transform:translateX(-50%) scale(1.15)}
        }
        @keyframes flameSway1{
          0%,100%{transform:scaleX(1) skewX(0deg)}
          30%{transform:scaleX(0.88) skewX(3deg)}
          70%{transform:scaleX(1.05) skewX(-2deg)}
        }
        @keyframes flameSway2{
          0%,100%{transform:scaleX(1) skewX(0deg)}
          40%{transform:scaleX(1.08) skewX(-3deg)}
          80%{transform:scaleX(0.9) skewX(2deg)}
        }
        @keyframes flameSway3{
          0%,100%{transform:scaleX(1) skewX(0deg)}
          50%{transform:scaleX(0.92) skewX(4deg)}
        }
        @keyframes emberFloat{
          0%{transform:translateY(0) translateX(0);opacity:0.7}
          50%{opacity:0.4}
          100%{transform:translateY(-22px) translateX(6px);opacity:0}
        }
        @keyframes smokeRise{
          0%{transform:translateY(0) scale(1);opacity:0.2}
          50%{transform:translateY(-28px) scale(2);opacity:0.1}
          100%{transform:translateY(-55px) scale(3);opacity:0}
        }
        @keyframes snailBob{
          0%,100%{transform:translateY(0) rotate(0deg)}
          50%{transform:translateY(-1.5px) rotate(0.5deg)}
        }
        @keyframes lanternSway{
          0%,100%{transform:rotate(-2.5deg)}
          50%{transform:rotate(2.5deg)}
        }
        @keyframes lanternFlicker{
          0%,100%{opacity:0.65;transform:translate(-50%,-50%) scale(1)}
          20%{opacity:0.9;transform:translate(-50%,-50%) scale(1.06)}
          45%{opacity:0.7;transform:translate(-50%,-50%) scale(0.94)}
          70%{opacity:0.85;transform:translate(-50%,-50%) scale(1.08)}
        }
      `}</style>
    </div>
  );
}
