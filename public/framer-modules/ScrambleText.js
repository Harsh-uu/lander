"use client";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-ORMEWXMH.js";

// app/component/ScrambleText.tsx
import { addPropertyControls, ControlType } from "framer";
import { useState, useEffect, useRef, useLayoutEffect, Fragment } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var GLITCH_CHARS_UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var GLITCH_CHARS_LOWER = "abcdefghijklmnopqrstuvwxyz";
var WAVE_CURSOR_CHARS = "\u2591\u2592\u2593\u2588";
function cubicBezier(x1, y1, x2, y2) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sampleX = (t) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t) => ((ay * t + by) * t + cy) * t;
  const sampleDX = (t) => (3 * ax * t + 2 * bx) * t + cx;
  return (x) => {
    let t = x;
    for (let i = 0; i < 8; i++) {
      const dx = sampleX(t) - x;
      const d = sampleDX(t);
      if (Math.abs(dx) < 1e-6) break;
      if (d === 0) break;
      t -= dx / d;
    }
    return sampleY(Math.max(0, Math.min(1, t)));
  };
}
function makeEaseFn(ease) {
  if (Array.isArray(ease) && ease.length === 4)
    return cubicBezier(ease[0], ease[1], ease[2], ease[3]);
  switch (ease) {
    case "linear":
      return (t) => t;
    case "easeIn":
      return (t) => t * t;
    case "easeOut":
      return (t) => 1 - (1 - t) * (1 - t);
    case "easeInOut":
      return (t) => t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t);
    case "circIn":
      return (t) => 1 - Math.sqrt(1 - t * t);
    case "circOut":
      return (t) => Math.sqrt(1 - (t - 1) * (t - 1));
    case "circInOut":
      return (t) => t < 0.5 ? (1 - Math.sqrt(1 - 4 * t * t)) / 2 : (Math.sqrt(1 - (-2 * t + 2) * (-2 * t + 2)) + 1) / 2;
    case "backIn":
      return (t) => 2.70158 * t * t * t - 1.70158 * t * t;
    case "backOut":
      return (t) => 1 + 2.70158 * (t - 1) ** 3 + 1.70158 * (t - 1) ** 2;
    default:
      return (t) => 1 - (1 - t) * (1 - t);
  }
}
function GlitchCharReveal(props) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C;
  const { words, enterAnimation, hoverAnimation, color, font, tag } = props;
  const Tag = tag != null ? tag : "p";
  const glitchColor = color;
  const enterMode = (_a = enterAnimation == null ? void 0 : enterAnimation.mode) != null ? _a : "oneLine";
  const enterEase = (_b = enterAnimation == null ? void 0 : enterAnimation.ease) != null ? _b : {
    type: "tween",
    duration: 2,
    ease: "easeOut"
  };
  const enterDuration = (_c = enterEase == null ? void 0 : enterEase.duration) != null ? _c : 2;
  const enterEaseCurve = (_d = enterEase == null ? void 0 : enterEase.ease) != null ? _d : "easeOut";
  const enterScrambleIntensity = (_e = enterAnimation == null ? void 0 : enterAnimation.scrambleIntensity) != null ? _e : 50;
  const enterReplay = (_f = enterAnimation == null ? void 0 : enterAnimation.replay) != null ? _f : false;
  const enterPosition = (_g = enterAnimation == null ? void 0 : enterAnimation.position) != null ? _g : "above";
  const enterRestState = (_h = enterAnimation == null ? void 0 : enterAnimation.restState) != null ? _h : "hidden";
  const enterFlickerEnabled = (_i = enterAnimation == null ? void 0 : enterAnimation.flickerEnabled) != null ? _i : false;
  const enterFlickerColor = (_j = enterAnimation == null ? void 0 : enterAnimation.flickerColor) != null ? _j : "#ff4400";
  const enterFlickerIntensity = (_k = enterAnimation == null ? void 0 : enterAnimation.flickerIntensity) != null ? _k : 50;
  const enterFlickerSpeed = (_l = enterAnimation == null ? void 0 : enterAnimation.flickerSpeed) != null ? _l : 10;
  const hoverType = (_m = hoverAnimation == null ? void 0 : hoverAnimation.type) != null ? _m : "none";
  const hoverLines = (_n = hoverAnimation == null ? void 0 : hoverAnimation.lines) != null ? _n : "oneLine";
  const hoverMode = hoverType === "diffusion" ? hoverLines === "oneLine" ? "diffusionOneLine" : "diffusionMultiLine" : hoverType === "wave" ? hoverLines === "oneLine" ? "waveOneLine" : "waveMultiLine" : "none";
  const hoverRadius = (_o = hoverAnimation == null ? void 0 : hoverAnimation.radius) != null ? _o : 5;
  const hoverCollapse = (_p = hoverAnimation == null ? void 0 : hoverAnimation.collapse) != null ? _p : false;
  const hoverCollapseTime = (_q = hoverAnimation == null ? void 0 : hoverAnimation.collapseTime) != null ? _q : 1;
  const hoverGlitchChars = (_r = hoverAnimation == null ? void 0 : hoverAnimation.glitchChars) != null ? _r : "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const hoverGlitchShuffle = (_s = hoverAnimation == null ? void 0 : hoverAnimation.glitchShuffle) != null ? _s : true;
  const hoverFlickerEnabled = (_t = hoverAnimation == null ? void 0 : hoverAnimation.flickerEnabled) != null ? _t : false;
  const hoverFlickerColor = (_u = hoverAnimation == null ? void 0 : hoverAnimation.flickerColor) != null ? _u : "#ff4400";
  const hoverFlickerIntensity = (_v = hoverAnimation == null ? void 0 : hoverAnimation.flickerIntensity) != null ? _v : 50;
  const hoverFlickerSpeed = (_w = hoverAnimation == null ? void 0 : hoverAnimation.flickerSpeed) != null ? _w : 10;
  const waveEase = (_x = hoverAnimation == null ? void 0 : hoverAnimation.waveEase) != null ? _x : {
    type: "tween",
    duration: 1.5,
    ease: "linear"
  };
  const waveDuration = (_y = waveEase == null ? void 0 : waveEase.duration) != null ? _y : 1.5;
  const waveEaseCurve = (_z = waveEase == null ? void 0 : waveEase.ease) != null ? _z : "linear";
  const waveShuffleLimitEnabled = (_A = hoverAnimation == null ? void 0 : hoverAnimation.waveShuffleLimitEnabled) != null ? _A : false;
  const waveShuffleLimitValue = (_B = hoverAnimation == null ? void 0 : hoverAnimation.waveShuffleLimitValue) != null ? _B : 10;
  const typeface = font;
  const textAlign = (_C = typeface == null ? void 0 : typeface.textAlign) != null ? _C : "left";
  const spanStyle = typeface ? Object.fromEntries(
    Object.entries(typeface).filter(([k]) => k !== "textAlign")
  ) : {};
  const paragraphs = words.split("\n").map((line) => line.trim().split(/\s+/).filter(Boolean)).filter((p) => p.length > 0);
  const allWords = [];
  paragraphs.forEach((paraWords, pi) => {
    paraWords.forEach((text, wiInPara) => {
      allWords.push({ text, pi, wiInPara, globalWi: allWords.length });
    });
  });
  const containerRef = useRef(null);
  const ghostRefs = useRef([]);
  const charRefs = useRef({});
  const hoverModeRef = useRef(hoverMode);
  const hoverRadiusRef = useRef(hoverRadius);
  const hoverCollapseRef = useRef(hoverCollapse);
  const hoverCollapseTimeRef = useRef(hoverCollapseTime);
  const hoverFlickerEnabledRef = useRef(hoverFlickerEnabled);
  const hoverFlickerIntensityRef = useRef(hoverFlickerIntensity);
  const hoverFlickerSpeedRef = useRef(hoverFlickerSpeed);
  const hoverGlitchCharsRef = useRef(hoverGlitchChars);
  const hoverGlitchShuffleRef = useRef(hoverGlitchShuffle);
  const waveDurationRef = useRef(waveDuration);
  const waveEaseCurveRef = useRef(waveEaseCurve);
  const waveShuffleLimitEnabledRef = useRef(waveShuffleLimitEnabled);
  const waveShuffleLimitValueRef = useRef(waveShuffleLimitValue);
  useEffect(() => {
    hoverModeRef.current = hoverMode;
  }, [hoverMode]);
  useEffect(() => {
    hoverRadiusRef.current = hoverRadius;
  }, [hoverRadius]);
  useEffect(() => {
    hoverCollapseRef.current = hoverCollapse;
  }, [hoverCollapse]);
  useEffect(() => {
    hoverCollapseTimeRef.current = hoverCollapseTime;
  }, [hoverCollapseTime]);
  useEffect(() => {
    hoverFlickerEnabledRef.current = hoverFlickerEnabled;
  }, [hoverFlickerEnabled]);
  useEffect(() => {
    hoverFlickerIntensityRef.current = hoverFlickerIntensity;
  }, [hoverFlickerIntensity]);
  useEffect(() => {
    hoverFlickerSpeedRef.current = hoverFlickerSpeed;
  }, [hoverFlickerSpeed]);
  useEffect(() => {
    hoverGlitchCharsRef.current = hoverGlitchChars;
  }, [hoverGlitchChars]);
  useEffect(() => {
    hoverGlitchShuffleRef.current = hoverGlitchShuffle;
  }, [hoverGlitchShuffle]);
  useEffect(() => {
    waveDurationRef.current = waveDuration;
  }, [waveDuration]);
  useEffect(() => {
    waveEaseCurveRef.current = waveEaseCurve;
  }, [waveEaseCurve]);
  useEffect(() => {
    waveShuffleLimitEnabledRef.current = waveShuffleLimitEnabled;
  }, [waveShuffleLimitEnabled]);
  useEffect(() => {
    waveShuffleLimitValueRef.current = waveShuffleLimitValue;
  }, [waveShuffleLimitValue]);
  const [lineGroups, setLineGroups] = useState([]);
  const [displays, setDisplays] = useState({});
  const [placedChars, setPlacedChars] = useState({});
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [enterAnimComplete, setEnterAnimComplete] = useState(false);
  const [hoverDisplays, setHoverDisplays] = useState(
    {}
  );
  const [hoverFlickerSet, setHoverFlickerSet] = useState(
    /* @__PURE__ */ new Set()
  );
  const hoverTimerRef = useRef(null);
  const hoverFlickerTimersRef = useRef([]);
  const lastMidIdRef = useRef("");
  const multiWaveTriggeredRef = useRef(false);
  const oneWaveTriggeredLinesRef = useRef(/* @__PURE__ */ new Set());
  const lastOneWaveLineRef = useRef(null);
  const hasPlayedRef = useRef(false);
  const hoverRandomCharsRef = useRef({});
  const hoverSceneRef = useRef(null);
  const waveRafRef = useRef(null);
  const waveCancelRef = useRef(false);
  const wavePlayingRef = useRef(false);
  const lineWaveRafsRef = useRef(/* @__PURE__ */ new Map());
  const lineWavePlayingRef = useRef(/* @__PURE__ */ new Set());
  const detectLines = () => {
    const allLines = [];
    paragraphs.forEach((_, pi) => {
      const paraEntries = allWords.filter((w) => w.pi === pi);
      const measured = paraEntries.map((w) => ({
        globalWi: w.globalWi,
        top: ghostRefs.current[w.globalWi] ? Math.round(
          ghostRefs.current[w.globalWi].getBoundingClientRect().top
        ) : -1
      })).filter((m) => m.top >= 0);
      const tops = [...new Set(measured.map((m) => m.top))].sort(
        (a, b) => a - b
      );
      tops.forEach(
        (top) => allLines.push(
          measured.filter((m) => m.top === top).map((m) => m.globalWi)
        )
      );
    });
    setLineGroups(allLines);
  };
  useLayoutEffect(() => {
    detectLines();
  }, [words, font]);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(() => detectLines());
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    setShouldAnimate(false);
    setDisplays({});
    setPlacedChars({});
    setEnterAnimComplete(false);
  }, [enterMode, words]);
  useEffect(() => {
    waveCancelRef.current = true;
    wavePlayingRef.current = false;
    if (waveRafRef.current) {
      cancelAnimationFrame(waveRafRef.current);
      waveRafRef.current = null;
    }
    lineWaveRafsRef.current.forEach((id) => cancelAnimationFrame(id));
    lineWaveRafsRef.current.clear();
    lineWavePlayingRef.current.clear();
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverFlickerTimersRef.current.forEach(clearTimeout);
    hoverFlickerTimersRef.current = [];
    lastMidIdRef.current = "";
    hoverRandomCharsRef.current = {};
    hoverSceneRef.current = null;
    setHoverDisplays({});
    setHoverFlickerSet(/* @__PURE__ */ new Set());
  }, [hoverMode, words]);
  useEffect(() => {
    if (enterMode === "none") return;
    const el = containerRef.current;
    if (!el) return;
    let threshold = 0;
    if (enterPosition === "middle") threshold = 0.5;
    else if (enterPosition === "below") threshold = 1;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!hasPlayedRef.current) {
            hasPlayedRef.current = true;
            setShouldAnimate(true);
            if (!enterReplay) obs.disconnect();
          }
        } else if (enterReplay) {
          hasPlayedRef.current = false;
          setShouldAnimate(false);
          setDisplays({});
          setPlacedChars({});
          setEnterAnimComplete(false);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [enterMode, lineGroups, enterReplay, enterPosition, enterRestState]);
  useEffect(() => {
    if (enterMode === "none" || !shouldAnimate || lineGroups.length === 0)
      return;
    let cancelled = false;
    setDisplays({});
    setPlacedChars({});
    setEnterAnimComplete(false);
    const durationMs = enterDuration * 1e3;
    const sequentialSteps = Math.max(
      1,
      allWords.reduce((s, w) => s + w.text.length, 0)
    );
    const animStart = performance.now();
    const animEndTime = animStart + durationMs;
    const easeFn = makeEaseFn(enterEaseCurve);
    const targetAt = (step) => animStart + durationMs * easeFn(step / sequentialSteps);
    const targetAtScaled = (step, total) => animStart + durationMs * easeFn(step / Math.max(1, total));
    const speedMult = 10 / Math.max(1, Math.min(20, enterFlickerSpeed));
    const wordToLine = /* @__PURE__ */ new Map();
    lineGroups.forEach(
      (g, li) => g.forEach((gWi) => wordToLine.set(gWi, li))
    );
    const lineEndTimes = [];
    if (enterMode === "oneLine") {
      let cum = 0;
      for (const group of lineGroups) {
        cum += group.reduce(
          (s, gWi) => s + allWords[gWi].text.length,
          0
        );
        lineEndTimes.push(targetAt(cum));
      }
    }
    const lineEndForChar = (gWi) => {
      var _a2, _b2;
      return enterMode === "oneLine" ? (_b2 = lineEndTimes[(_a2 = wordToLine.get(gWi)) != null ? _a2 : 0]) != null ? _b2 : animEndTime : animEndTime;
    };
    const sleep = (ms) => new Promise((r) => setTimeout(r, Math.max(0, ms)));
    const nextGlitchChar = (char) => {
      const isLower = char === char.toLowerCase() && char !== char.toUpperCase();
      const pool = isLower ? GLITCH_CHARS_LOWER : GLITCH_CHARS_UPPER;
      return pool[Math.floor(Math.random() * pool.length)];
    };
    const maybeFlicker = async (id, endTime) => {
      const intensity = Math.max(0, Math.min(100, enterFlickerIntensity));
      if (!enterFlickerEnabled || intensity === 0) return;
      if (Math.random() > intensity / 100) return;
      if (performance.now() >= endTime) return;
      const maxFlickers = Math.max(1, Math.round(intensity / 8));
      const flickers = Math.max(
        1,
        Math.round(maxFlickers / 2) + Math.floor(Math.random() * (maxFlickers / 2 + 1))
      );
      for (let i = 0; i < flickers; i++) {
        await sleep((40 + Math.random() * 80) * speedMult);
        if (cancelled) return;
        if (performance.now() >= endTime) {
          setDisplays(
            (p) => p[id] ? __spreadProps(__spreadValues({}, p), { [id]: __spreadProps(__spreadValues({}, p[id]), { flickering: false }) }) : p
          );
          return;
        }
        setDisplays(
          (p) => p[id] ? __spreadProps(__spreadValues({}, p), { [id]: __spreadProps(__spreadValues({}, p[id]), { flickering: true }) }) : p
        );
        await sleep((30 + Math.random() * 60) * speedMult);
        if (cancelled) return;
        setDisplays(
          (p) => p[id] ? __spreadProps(__spreadValues({}, p), { [id]: __spreadProps(__spreadValues({}, p[id]), { flickering: false }) }) : p
        );
      }
    };
    const animateChar = async (globalWi, ci, char, targetEnd) => {
      if (cancelled) return;
      const id = `${globalWi}-${ci}`;
      const flickerEndTime = lineEndForChar(globalWi);
      if (char === "." || char === " ") {
        setDisplays((p) => __spreadProps(__spreadValues({}, p), {
          [id]: { char, locked: true, flickering: false }
        }));
        await sleep(targetEnd - performance.now());
        maybeFlicker(id, flickerEndTime);
        return;
      }
      const scrambleIntensity = Math.max(
        0,
        Math.min(100, enterScrambleIntensity)
      );
      const desiredFrames = scrambleIntensity === 0 ? 0 : 1 + Math.floor(
        Math.random() * Math.round(scrambleIntensity / 7)
      );
      const window = targetEnd - performance.now();
      const minDelay = 15;
      const maxFitFrames = Math.max(
        1,
        Math.floor(window * 0.8 / minDelay)
      );
      const glitchFrames = Math.min(desiredFrames, maxFitFrames);
      const glitchDelay = glitchFrames > 0 ? Math.max(
        minDelay,
        Math.floor(window * 0.8 / glitchFrames)
      ) : minDelay;
      if (glitchFrames > 0) {
        for (let i = 0; i < glitchFrames; i++) {
          if (cancelled) return;
          setDisplays((p) => __spreadProps(__spreadValues({}, p), {
            [id]: {
              char: nextGlitchChar(char),
              locked: false,
              flickering: false
            }
          }));
          await sleep(glitchDelay);
          if (cancelled) return;
        }
      }
      setDisplays((p) => __spreadProps(__spreadValues({}, p), {
        [id]: { char, locked: true, flickering: false }
      }));
      await sleep(targetEnd - performance.now());
      maybeFlicker(id, flickerEndTime);
    };
    const shuffle = (arr) => {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };
    const animateWordInsert = async (gWi, getTargetEnd) => {
      const word = allWords[gWi].text;
      for (const ci of shuffle(word.split("").map((_, ci2) => ci2))) {
        if (cancelled) return;
        setPlacedChars((p) => {
          var _a2;
          const cur = (_a2 = p[gWi]) != null ? _a2 : [];
          return __spreadProps(__spreadValues({}, p), { [gWi]: [...cur, ci].sort((a, b) => a - b) });
        });
        await animateChar(gWi, ci, word[ci], getTargetEnd());
      }
    };
    const run = async () => {
      if (enterMode === "oneLine") {
        let idx = 0;
        for (const group of lineGroups)
          for (const gWi of group) {
            if (cancelled) return;
            await animateWordInsert(
              gWi,
              () => targetAt(++idx)
            );
          }
      } else if (enterMode === "multiLine") {
        await Promise.all(
          lineGroups.map(async (group) => {
            const lineSteps = group.reduce(
              (s, gWi) => s + allWords[gWi].text.length,
              0
            );
            let li = 0;
            for (const gWi of group) {
              if (cancelled) return;
              await animateWordInsert(
                gWi,
                () => targetAtScaled(++li, lineSteps)
              );
            }
          })
        );
      } else {
        const all = [];
        allWords.forEach(
          (w) => w.text.split("").forEach(
            (char, ci) => all.push({ globalWi: w.globalWi, ci, char })
          )
        );
        for (let i = all.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [all[i], all[j]] = [all[j], all[i]];
        }
        let idx = 0;
        for (const { globalWi, ci, char } of all) {
          if (cancelled) return;
          await animateChar(globalWi, ci, char, targetAt(++idx));
        }
      }
    };
    (async () => {
      await run();
      if (!cancelled) setEnterAnimComplete(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [
    lineGroups,
    enterMode,
    enterFlickerEnabled,
    enterFlickerIntensity,
    enterFlickerSpeed,
    enterScrambleIntensity,
    enterDuration,
    enterEaseCurve,
    shouldAnimate
  ]);
  useEffect(
    () => () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
      if (waveRafRef.current) cancelAnimationFrame(waveRafRef.current);
      lineWaveRafsRef.current.forEach((id) => cancelAnimationFrame(id));
      hoverFlickerTimersRef.current.forEach(clearTimeout);
    },
    []
  );
  const getOrSetHoverChar = (id, offset) => {
    if (hoverRandomCharsRef.current[id] === void 0) {
      const pool = hoverGlitchCharsRef.current.trim();
      if (pool.length === 0) {
        hoverRandomCharsRef.current[id] = Math.random() < 0.5 ? "0" : "1";
      } else if (hoverGlitchShuffleRef.current) {
        hoverRandomCharsRef.current[id] = pool[Math.floor(Math.random() * pool.length)];
      } else {
        const len = pool.length;
        hoverRandomCharsRef.current[id] = pool[(offset % len + len) % len];
      }
    }
    return hoverRandomCharsRef.current[id];
  };
  const buildHoverDisplays = (radius) => {
    const scene = hoverSceneRef.current;
    if (!scene) return {};
    const {
      lineMap,
      lineTopValues,
      closestLineIdx,
      midCx,
      closestLineTop
    } = scene;
    const out = {};
    const applyLine = (lineTop, r) => {
      const chars = lineMap.get(lineTop);
      if (!chars || chars.length === 0 || r < 0) return;
      const firstChar = chars[0];
      const lastChar = chars[chars.length - 1];
      const avgSpacing = chars.length > 1 ? (lastChar.cx - firstChar.cx) / (chars.length - 1) : 20;
      let pivotIdx = 0, minD = Infinity;
      chars.forEach((c, i) => {
        const d = Math.abs(c.cx - midCx);
        if (d < minD) {
          minD = d;
          pivotIdx = i;
        }
      });
      if (minD > (r + 0.5) * avgSpacing) return;
      for (let idx = Math.max(0, pivotIdx - r); idx <= Math.min(chars.length - 1, pivotIdx + r); idx++)
        out[chars[idx].id] = getOrSetHoverChar(
          chars[idx].id,
          idx - pivotIdx
        );
    };
    if (hoverModeRef.current === "diffusionOneLine") {
      applyLine(closestLineTop, radius);
    } else {
      lineTopValues.forEach(
        (lt, li) => applyLine(lt, radius - Math.abs(li - closestLineIdx))
      );
    }
    return out;
  };
  const clearFlickerTimers = () => {
    hoverFlickerTimersRef.current.forEach(clearTimeout);
    hoverFlickerTimersRef.current = [];
  };
  const clearHoverState = () => {
    waveCancelRef.current = true;
    wavePlayingRef.current = false;
    if (waveRafRef.current) {
      cancelAnimationFrame(waveRafRef.current);
      waveRafRef.current = null;
    }
    lineWaveRafsRef.current.forEach((id) => cancelAnimationFrame(id));
    lineWaveRafsRef.current.clear();
    lineWavePlayingRef.current.clear();
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    clearFlickerTimers();
    lastMidIdRef.current = "";
    hoverRandomCharsRef.current = {};
    hoverSceneRef.current = null;
    setHoverDisplays({});
    setHoverFlickerSet(/* @__PURE__ */ new Set());
  };
  const flickerChar = (id) => {
    const intensity = Math.max(
      0,
      Math.min(100, hoverFlickerIntensityRef.current)
    );
    const speedMult = 10 / Math.max(1, Math.min(20, hoverFlickerSpeedRef.current));
    const maxFlickers = Math.max(1, Math.round(intensity / 8));
    const flickers = Math.max(
      1,
      Math.round(maxFlickers / 2) + Math.floor(Math.random() * (maxFlickers / 2 + 1))
    );
    let delay = 0;
    for (let i = 0; i < flickers; i++) {
      const onAt = delay + Math.floor((15 + Math.random() * 50) * speedMult);
      const offAt = onAt + Math.floor((25 + Math.random() * 55) * speedMult);
      hoverFlickerTimersRef.current.push(
        setTimeout(
          () => setHoverFlickerSet((p) => {
            const s = new Set(p);
            s.add(id);
            return s;
          }),
          onAt
        )
      );
      hoverFlickerTimersRef.current.push(
        setTimeout(
          () => setHoverFlickerSet((p) => {
            const s = new Set(p);
            s.delete(id);
            return s;
          }),
          offAt
        )
      );
      delay = offAt;
    }
  };
  const applyDiffusion = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    clearFlickerTimers();
    const newDisplays = buildHoverDisplays(hoverRadiusRef.current);
    setHoverDisplays(newDisplays);
    setHoverFlickerSet(/* @__PURE__ */ new Set());
    if (hoverFlickerEnabledRef.current) {
      const intensity = Math.max(
        0,
        Math.min(100, hoverFlickerIntensityRef.current)
      );
      if (intensity > 0) {
        Object.keys(newDisplays).forEach((id) => {
          if (Math.random() > intensity / 100) return;
          hoverFlickerTimersRef.current.push(
            setTimeout(
              () => flickerChar(id),
              Math.floor(Math.random() * 60)
            )
          );
        });
      }
    }
    if (hoverCollapseRef.current) {
      let r = hoverRadiusRef.current;
      const stepMs = hoverCollapseTimeRef.current * 1e3 / Math.max(1, r);
      const collapseStep = () => {
        r--;
        setHoverDisplays(buildHoverDisplays(r));
        if (r > 0) {
          hoverTimerRef.current = setTimeout(collapseStep, stepMs);
        } else {
          setHoverDisplays({});
          setHoverFlickerSet(/* @__PURE__ */ new Set());
          clearFlickerTimers();
          hoverRandomCharsRef.current = {};
          lastMidIdRef.current = "";
        }
      };
      hoverTimerRef.current = setTimeout(collapseStep, stepMs);
    }
  };
  const buildWaveTick = (orderedChars, fi, glitchState, GLITCH_RATE) => {
    const limitEnabled = waveShuffleLimitEnabledRef.current;
    const limitValue = waveShuffleLimitValueRef.current;
    const frontierIdx = Math.floor(fi);
    const frac = fi - frontierIdx;
    const n = orderedChars.length;
    const rndGlitch = () => GLITCH_CHARS_UPPER[Math.floor(Math.random() * GLITCH_CHARS_UPPER.length)];
    const rndCursor = () => WAVE_CURSOR_CHARS[Math.floor(Math.random() * WAVE_CURSOR_CHARS.length)];
    const toAdd = {};
    const toRemove = [];
    for (let i = 0; i < n; i++) {
      const { id } = orderedChars[i];
      if (i === frontierIdx) {
        glitchState[id] = rndCursor();
        toAdd[id] = glitchState[id];
      } else if (i === frontierIdx + 1 && i < n && Math.random() < frac) {
        toAdd[id] = rndCursor();
      } else if (i > fi) {
        delete glitchState[id];
        toRemove.push(id);
      } else if (limitEnabled && fi - i > limitValue) {
        delete glitchState[id];
        toRemove.push(id);
      } else {
        if (!glitchState[id] || Math.random() < GLITCH_RATE) {
          glitchState[id] = rndGlitch();
        }
        toAdd[id] = glitchState[id];
      }
    }
    return { toAdd, toRemove };
  };
  const startLineWave = (lineTop, orderedChars) => {
    if (lineWaveRafsRef.current.has(lineTop)) {
      cancelAnimationFrame(lineWaveRafsRef.current.get(lineTop));
      lineWaveRafsRef.current.delete(lineTop);
    }
    lineWavePlayingRef.current.add(lineTop);
    const n = orderedChars.length;
    if (n === 0) {
      lineWavePlayingRef.current.delete(lineTop);
      return;
    }
    const durMs = waveDurationRef.current * 1e3;
    const limitEnabled = waveShuffleLimitEnabledRef.current;
    const limitValue = waveShuffleLimitValueRef.current;
    const totalSteps = limitEnabled ? n + limitValue : n;
    const GLITCH_RATE = 0.4;
    const glitchState = {};
    const waveStart = performance.now();
    const easeFn = makeEaseFn(waveEaseCurveRef.current);
    const tick = () => {
      if (!lineWavePlayingRef.current.has(lineTop)) return;
      const t = Math.min(1, (performance.now() - waveStart) / durMs);
      const fi = easeFn(t) * totalSteps;
      const { toAdd, toRemove } = buildWaveTick(
        orderedChars,
        fi,
        glitchState,
        GLITCH_RATE
      );
      setHoverDisplays((prev) => {
        const u = __spreadValues({}, prev);
        toRemove.forEach((id) => delete u[id]);
        return Object.assign(u, toAdd);
      });
      if (fi < totalSteps) {
        const rafId2 = requestAnimationFrame(tick);
        lineWaveRafsRef.current.set(lineTop, rafId2);
      } else {
        lineWavePlayingRef.current.delete(lineTop);
        lineWaveRafsRef.current.delete(lineTop);
        setHoverDisplays((prev) => {
          const u = __spreadValues({}, prev);
          orderedChars.forEach(({ id }) => delete u[id]);
          return u;
        });
      }
    };
    const rafId = requestAnimationFrame(tick);
    lineWaveRafsRef.current.set(lineTop, rafId);
  };
  const handleMouseMove = (e) => {
    var _a2, _b2;
    if (hoverMode === "none") return;
    if (hoverMode === "waveMultiLine" && (lineWavePlayingRef.current.size > 0 || multiWaveTriggeredRef.current))
      return;
    const chars = [];
    for (const [id, el] of Object.entries(charRefs.current)) {
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) continue;
      chars.push({
        id,
        cx: rect.left + rect.width / 2,
        lineTop: Math.round(rect.top)
      });
    }
    if (chars.length === 0) return;
    const lineTopValues = [...new Set(chars.map((c) => c.lineTop))].sort(
      (a, b) => a - b
    );
    const lineMap = /* @__PURE__ */ new Map();
    for (const lt of lineTopValues)
      lineMap.set(
        lt,
        chars.filter((c) => c.lineTop === lt).sort((a, b) => a.cx - b.cx)
      );
    const { clientX, clientY } = e;
    let targetLineTop = null;
    for (const lt of lineTopValues) {
      const lc = lineMap.get(lt);
      const sampleEl = charRefs.current[lc[0].id];
      if (!sampleEl) continue;
      const rect = sampleEl.getBoundingClientRect();
      if (clientY >= rect.top && clientY <= rect.bottom) {
        targetLineTop = lt;
        break;
      }
    }
    if (hoverMode === "waveOneLine") {
      if (lastOneWaveLineRef.current !== null && lastOneWaveLineRef.current !== targetLineTop) {
        oneWaveTriggeredLinesRef.current.delete(
          lastOneWaveLineRef.current
        );
      }
      lastOneWaveLineRef.current = targetLineTop;
      if (targetLineTop === null) return;
      if (lineWavePlayingRef.current.has(targetLineTop)) return;
      if (oneWaveTriggeredLinesRef.current.has(targetLineTop)) return;
      oneWaveTriggeredLinesRef.current.add(targetLineTop);
      const lineChars = ((_a2 = lineMap.get(targetLineTop)) != null ? _a2 : []).slice().sort((a, b) => a.cx - b.cx);
      startLineWave(targetLineTop, lineChars);
      return;
    }
    if (hoverMode === "waveMultiLine") {
      if (targetLineTop === null) return;
      multiWaveTriggeredRef.current = true;
      for (const lt of lineTopValues) {
        const lineChars = ((_b2 = lineMap.get(lt)) != null ? _b2 : []).slice().sort((a, b) => a.cx - b.cx);
        startLineWave(lt, lineChars);
      }
      return;
    }
    if (targetLineTop === null) {
      if (lastMidIdRef.current !== "") clearHoverState();
      return;
    }
    const closestLineChars = lineMap.get(targetLineTop);
    const closestLineIdx = lineTopValues.indexOf(targetLineTop);
    let midIdx = 0, minXDist = Infinity;
    closestLineChars.forEach((c, i) => {
      const d = Math.abs(c.cx - clientX);
      if (d < minXDist) {
        minXDist = d;
        midIdx = i;
      }
    });
    const midId = closestLineChars[midIdx].id;
    if (midId === lastMidIdRef.current) return;
    lastMidIdRef.current = midId;
    hoverRandomCharsRef.current = {};
    hoverSceneRef.current = {
      lineMap,
      lineTopValues,
      closestLineIdx,
      midCx: closestLineChars[midIdx].cx,
      closestLineTop: targetLineTop
    };
    applyDiffusion();
  };
  const handleMouseLeave = () => {
    multiWaveTriggeredRef.current = false;
    oneWaveTriggeredLinesRef.current.clear();
    lastOneWaveLineRef.current = null;
    if ((hoverMode === "waveMultiLine" || hoverMode === "waveOneLine") && lineWavePlayingRef.current.size > 0)
      return;
    clearHoverState();
  };
  const isInsertEnter = enterMode === "oneLine" || enterMode === "multiLine";
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: containerRef,
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
      style: {
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "0.1em",
        background: "transparent",
        overflow: "hidden"
      },
      children: paragraphs.map((_, pi) => {
        const paraEntries = allWords.filter((w) => w.pi === pi);
        return /* @__PURE__ */ jsxs(
          Tag,
          {
            onMouseLeave: () => {
              multiWaveTriggeredRef.current = false;
            },
            style: {
              position: "relative",
              width: "100%",
              margin: 0,
              padding: 0,
              fontWeight: "inherit",
              fontSize: "inherit",
              lineHeight: "inherit"
            },
            children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  style: {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    visibility: "hidden",
                    pointerEvents: "none",
                    textAlign
                  },
                  children: paraEntries.map((wordEntry, i) => /* @__PURE__ */ jsxs(Fragment, { children: [
                    i > 0 && /* @__PURE__ */ jsx(
                      "span",
                      {
                        style: __spreadProps(__spreadValues({}, spanStyle), {
                          letterSpacing: "0.05em"
                        }),
                        children: " "
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        ref: (el) => {
                          ghostRefs.current[wordEntry.globalWi] = el;
                        },
                        style: __spreadProps(__spreadValues({}, spanStyle), {
                          letterSpacing: "0.05em",
                          display: "inline-block",
                          whiteSpace: "nowrap"
                        }),
                        children: wordEntry.text
                      }
                    )
                  ] }, wordEntry.globalWi))
                }
              ),
              /* @__PURE__ */ jsx(
                "div",
                {
                  style: {
                    width: "100%",
                    textAlign
                  },
                  children: paraEntries.map((wordEntry, i) => {
                    var _a2;
                    if (isInsertEnter) {
                      const placed = (_a2 = placedChars[wordEntry.globalWi]) != null ? _a2 : [];
                      return /* @__PURE__ */ jsxs(Fragment, { children: [
                        i > 0 && /* @__PURE__ */ jsx(
                          "span",
                          {
                            style: __spreadProps(__spreadValues({}, spanStyle), {
                              letterSpacing: "0.05em"
                            }),
                            children: " "
                          }
                        ),
                        /* @__PURE__ */ jsxs(
                          "span",
                          {
                            style: {
                              display: "inline-block",
                              whiteSpace: "nowrap",
                              position: "relative"
                            },
                            children: [
                              /* @__PURE__ */ jsx(
                                "span",
                                {
                                  style: __spreadProps(__spreadValues({}, spanStyle), {
                                    letterSpacing: "0.05em",
                                    visibility: "hidden",
                                    whiteSpace: "nowrap"
                                  }),
                                  children: wordEntry.text
                                }
                              ),
                              /* @__PURE__ */ jsx(
                                "span",
                                {
                                  style: {
                                    position: "absolute",
                                    inset: 0,
                                    overflow: "hidden",
                                    whiteSpace: "nowrap"
                                  },
                                  children: !enterAnimComplete && !(!shouldAnimate && enterRestState === "solid") ? (
                                    // ── During animation: placed chars only ──────────────────
                                    placed.map((ci) => {
                                      var _a3;
                                      const char = wordEntry.text[ci];
                                      const id = `${wordEntry.globalWi}-${ci}`;
                                      const state = displays[id];
                                      const displayColor = state ? state.flickering ? enterFlickerEnabled ? enterFlickerColor : color : state.locked ? color : glitchColor : "transparent";
                                      return /* @__PURE__ */ jsx(
                                        "span",
                                        {
                                          style: __spreadProps(__spreadValues({}, spanStyle), {
                                            letterSpacing: "0.05em",
                                            color: displayColor
                                          }),
                                          children: (_a3 = state == null ? void 0 : state.char) != null ? _a3 : char
                                        },
                                        ci
                                      );
                                    })
                                  ) : (
                                    // ── Post-animation: all chars with charRefs for hover ────
                                    // Same natural text flow → no width change on transition.
                                    wordEntry.text.split("").map(
                                      (char, ci) => {
                                        const id = `${wordEntry.globalWi}-${ci}`;
                                        const hoverChar = hoverDisplays[id];
                                        const isHF = hoverFlickerSet.has(
                                          id
                                        );
                                        let displayChar = char, charColor = color;
                                        if (hoverChar !== void 0) {
                                          displayChar = hoverChar;
                                          charColor = isHF && hoverFlickerEnabled ? hoverFlickerColor : glitchColor;
                                        } else if (isHF && hoverFlickerEnabled) {
                                          charColor = hoverFlickerColor;
                                        }
                                        return /* @__PURE__ */ jsx(
                                          "span",
                                          {
                                            ref: (el) => {
                                              charRefs.current[id] = el;
                                            },
                                            style: __spreadProps(__spreadValues({}, spanStyle), {
                                              letterSpacing: "0.05em",
                                              color: charColor
                                            }),
                                            children: displayChar
                                          },
                                          ci
                                        );
                                      }
                                    )
                                  )
                                }
                              )
                            ]
                          }
                        )
                      ] }, wordEntry.globalWi);
                    }
                    return /* @__PURE__ */ jsxs(Fragment, { children: [
                      i > 0 && /* @__PURE__ */ jsx(
                        "span",
                        {
                          style: __spreadProps(__spreadValues({}, spanStyle), {
                            letterSpacing: "0.05em",
                            color
                          }),
                          children: " "
                        }
                      ),
                      /* @__PURE__ */ jsxs(
                        "span",
                        {
                          style: {
                            display: "inline-block",
                            whiteSpace: "nowrap",
                            position: "relative"
                          },
                          children: [
                            /* @__PURE__ */ jsx(
                              "span",
                              {
                                style: __spreadProps(__spreadValues({}, spanStyle), {
                                  letterSpacing: "0.05em",
                                  visibility: "hidden",
                                  whiteSpace: "nowrap"
                                }),
                                children: wordEntry.text
                              }
                            ),
                            /* @__PURE__ */ jsx(
                              "span",
                              {
                                style: {
                                  position: "absolute",
                                  inset: 0,
                                  overflow: "hidden",
                                  whiteSpace: "nowrap"
                                },
                                children: wordEntry.text.split("").map((char, ci) => {
                                  const id = `${wordEntry.globalWi}-${ci}`;
                                  const hoverChar = hoverDisplays[id];
                                  const enterState = displays[id];
                                  const isHF = hoverFlickerSet.has(
                                    id
                                  );
                                  let displayChar = char, charColor = color;
                                  if (hoverChar !== void 0) {
                                    displayChar = hoverChar;
                                    charColor = isHF && hoverFlickerEnabled ? hoverFlickerColor : glitchColor;
                                  } else if (isHF && hoverFlickerEnabled) {
                                    charColor = hoverFlickerColor;
                                  } else if (enterMode !== "none") {
                                    if (!enterState) {
                                      charColor = !shouldAnimate && enterRestState === "solid" ? color : "transparent";
                                    } else {
                                      displayChar = enterState.char;
                                      charColor = enterState.flickering ? enterFlickerEnabled ? enterFlickerColor : color : enterState.locked ? color : glitchColor;
                                    }
                                  }
                                  return /* @__PURE__ */ jsx(
                                    "span",
                                    {
                                      ref: (el) => {
                                        charRefs.current[id] = el;
                                      },
                                      style: __spreadProps(__spreadValues({}, spanStyle), {
                                        letterSpacing: "0.05em",
                                        color: charColor
                                      }),
                                      children: displayChar
                                    },
                                    ci
                                  );
                                })
                              }
                            )
                          ]
                        }
                      )
                    ] }, wordEntry.globalWi);
                  })
                }
              )
            ]
          },
          pi
        );
      })
    }
  );
}
addPropertyControls(GlitchCharReveal, {
  words: {
    title: "Words",
    type: ControlType.String,
    defaultValue: "DATA.\nDECIPHERED.\nDEPLOYED.",
    displayTextArea: true
  },
  enterAnimation: {
    title: "Enter Animation",
    type: ControlType.Object,
    controls: {
      mode: {
        title: "Mode",
        type: ControlType.Enum,
        defaultValue: "oneLine",
        options: ["none", "oneLine", "multiLine", "random"],
        optionTitles: ["None", "One Line", "Multi Line", "Random"],
        displaySegmentedControl: false
      },
      restState: {
        title: "Rest State",
        type: ControlType.Enum,
        defaultValue: "hidden",
        options: ["hidden", "solid"],
        optionTitles: ["Hidden", "Solid"],
        displaySegmentedControl: true,
        hidden: (props) => props.mode === "none"
      },
      replay: {
        title: "Replay",
        type: ControlType.Boolean,
        defaultValue: false,
        enabledTitle: "Yes",
        disabledTitle: "No",
        hidden: (props) => props.mode === "none"
      },
      position: {
        title: "Position",
        type: ControlType.Enum,
        defaultValue: "above",
        options: ["above", "middle", "below"],
        optionTitles: ["Top", "Middle", "Bottom"],
        optionIcons: [
          "text-align-top",
          "text-align-middle",
          "text-align-bottom"
        ],
        displaySegmentedControl: true,
        hidden: (props) => props.mode === "none"
      },
      scrambleIntensity: {
        title: "Scramble Intensity",
        type: ControlType.Number,
        defaultValue: 50,
        min: 0,
        max: 100,
        step: 1,
        unit: "%",
        hidden: (props) => props.mode === "none"
      },
      ease: {
        title: "Ease",
        type: ControlType.Transition,
        defaultValue: { type: "tween", duration: 2, ease: "easeOut" },
        hidden: (props) => props.mode === "none"
      },
      flickerEnabled: {
        title: "Flicker",
        type: ControlType.Boolean,
        defaultValue: false,
        enabledTitle: "On",
        disabledTitle: "Off",
        hidden: (props) => props.mode === "none"
      },
      flickerColor: {
        title: "Flicker Color",
        type: ControlType.Color,
        defaultValue: "#ff4400",
        hidden: (props) => props.mode === "none" || !props.flickerEnabled
      },
      flickerIntensity: {
        title: "Flicker Intensity",
        type: ControlType.Number,
        defaultValue: 50,
        min: 0,
        max: 100,
        step: 1,
        unit: "%",
        hidden: (props) => props.mode === "none" || !props.flickerEnabled
      },
      flickerSpeed: {
        title: "Flicker Speed",
        type: ControlType.Number,
        defaultValue: 10,
        min: 1,
        max: 20,
        step: 1,
        hidden: (props) => props.mode === "none" || !props.flickerEnabled
      }
    }
  },
  hoverAnimation: {
    title: "Hover Animation",
    type: ControlType.Object,
    controls: {
      type: {
        title: "Mode",
        type: ControlType.Enum,
        defaultValue: "none",
        options: ["none", "diffusion", "wave"],
        optionTitles: ["None", "Diffusion", "Wave"],
        displaySegmentedControl: false
      },
      lines: {
        title: "Lines",
        type: ControlType.Enum,
        defaultValue: "oneLine",
        options: ["oneLine", "multiLine"],
        optionTitles: ["Single", "Multiple"],
        displaySegmentedControl: true,
        hidden: (props) => props.type === "none"
      },
      // ── Diffusion ──────────────────────────────────────────────────────
      radius: {
        title: "Radius",
        type: ControlType.Number,
        defaultValue: 5,
        min: 1,
        max: 50,
        step: 1,
        displayStepper: true,
        unit: "ch",
        hidden: (props) => props.type !== "diffusion"
      },
      collapse: {
        title: "Collapse",
        type: ControlType.Boolean,
        defaultValue: false,
        enabledTitle: "On",
        disabledTitle: "Off",
        hidden: (props) => props.type !== "diffusion"
      },
      collapseTime: {
        title: "Collapse Time",
        type: ControlType.Number,
        defaultValue: 1,
        min: 0.5,
        max: 15,
        step: 0.1,
        displayStepper: true,
        unit: "s",
        hidden: (props) => props.type !== "diffusion" || !props.collapse
      },
      glitchChars: {
        title: "Glitch Chars",
        type: ControlType.String,
        defaultValue: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        placeholder: "Characters to show on hover",
        hidden: (props) => props.type !== "diffusion"
      },
      glitchShuffle: {
        title: "Shuffle",
        type: ControlType.Boolean,
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
        hidden: (props) => props.type !== "diffusion"
      },
      flickerEnabled: {
        title: "Flicker",
        type: ControlType.Boolean,
        defaultValue: false,
        enabledTitle: "On",
        disabledTitle: "Off",
        hidden: (props) => props.type !== "diffusion"
      },
      flickerColor: {
        title: "Flicker Color",
        type: ControlType.Color,
        defaultValue: "#ff4400",
        hidden: (props) => props.type !== "diffusion" || !props.flickerEnabled
      },
      flickerIntensity: {
        title: "Flicker Intensity",
        type: ControlType.Number,
        defaultValue: 50,
        min: 0,
        max: 100,
        step: 1,
        unit: "%",
        hidden: (props) => props.type !== "diffusion" || !props.flickerEnabled
      },
      flickerSpeed: {
        title: "Flicker Speed",
        type: ControlType.Number,
        defaultValue: 10,
        min: 1,
        max: 20,
        step: 1,
        hidden: (props) => props.type !== "diffusion" || !props.flickerEnabled
      },
      // ── Wave ──────────────────────────────────────────────────────────
      waveEase: {
        title: "Ease",
        type: ControlType.Transition,
        defaultValue: { type: "tween", duration: 1.5, ease: "linear" },
        hidden: (props) => props.type !== "wave"
      },
      waveShuffleLimitEnabled: {
        title: "Shuffle Limit",
        type: ControlType.Boolean,
        defaultValue: false,
        enabledTitle: "On",
        disabledTitle: "Off",
        hidden: (props) => props.type !== "wave"
      },
      waveShuffleLimitValue: {
        title: "Limit",
        type: ControlType.Number,
        defaultValue: 10,
        min: 1,
        max: 100,
        step: 1,
        displayStepper: true,
        unit: "ch",
        hidden: (props) => props.type !== "wave" || !props.waveShuffleLimitEnabled
      }
    }
  },
  color: {
    title: "Text Color",
    type: ControlType.Color,
    defaultValue: "#ffffff"
  },
  font: {
    type: ControlType.Font,
    title: "Font",
    defaultValue: {
      variant: "Bold",
      letterSpacing: "0.05em",
      lineHeight: "1em"
    },
    controls: "extended",
    defaultFontType: "sans-serif"
  },
  tag: {
    title: "Tag",
    type: ControlType.Enum,
    defaultValue: "p",
    options: ["h1", "h2", "h3", "h4", "h5", "h6", "p"],
    optionTitles: ["h1", "h2", "h3", "h4", "h5", "h6", "p"],
    displaySegmentedControl: false
  }
});
export {
  GlitchCharReveal as default
};
