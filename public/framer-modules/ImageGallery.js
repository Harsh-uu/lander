"use client";
import "./chunk-ORMEWXMH.js";

// app/component/ImageGallery.tsx
import { useEffect, useRef } from "react";
import { addPropertyControls, ControlType } from "framer";
import { jsx } from "react/jsx-runtime";
var ZONES = [
  { cx: 18, cy: 18 },
  { cx: 82, cy: 18 },
  { cx: 18, cy: 82 },
  { cx: 82, cy: 82 },
  { cx: 32, cy: 14 },
  { cx: 50, cy: 12 },
  { cx: 68, cy: 14 },
  { cx: 32, cy: 86 },
  { cx: 50, cy: 88 },
  { cx: 68, cy: 86 },
  { cx: 14, cy: 35 },
  { cx: 14, cy: 55 },
  { cx: 14, cy: 72 },
  { cx: 86, cy: 35 },
  { cx: 86, cy: 55 },
  { cx: 86, cy: 72 },
  { cx: 28, cy: 28 },
  { cx: 72, cy: 28 },
  { cx: 28, cy: 72 },
  { cx: 72, cy: 72 },
  { cx: 42, cy: 16 },
  { cx: 58, cy: 16 },
  { cx: 42, cy: 84 },
  { cx: 58, cy: 84 },
  { cx: 16, cy: 45 },
  { cx: 84, cy: 45 }
];
var ASPECT_RATIOS = [
  { w: 200, h: 200 },
  { w: 240, h: 240 },
  { w: 280, h: 280 },
  { w: 160, h: 250 },
  { w: 180, h: 280 },
  { w: 280, h: 165 },
  { w: 340, h: 195 },
  { w: 220, h: 150 }
];
var SPIRAL_PATHS = Array.from({ length: 20 }, () => ({
  startAngle: Math.random() * Math.PI * 2,
  spinDir: Math.random() < 0.5 ? 1 : -1,
  turns: 1.2 + Math.random() * 0.8
}));
function rand(min, max) {
  return min + Math.random() * (max - min);
}
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function framerEaseToGsap(ease) {
  var _a;
  if (!ease || ease === "linear") return "none";
  if (Array.isArray(ease))
    return `cubic-bezier(${ease[0]},${ease[1]},${ease[2]},${ease[3]})`;
  const map = {
    easeIn: "power2.in",
    easeOut: "power2.out",
    easeInOut: "power2.inOut",
    circIn: "circ.in",
    circOut: "circ.out",
    circInOut: "circ.inOut",
    backIn: "back.in",
    backOut: "back.out",
    backInOut: "back.inOut",
    anticipate: "back.inOut(1.7)",
    bounceIn: "bounce.in",
    bounceOut: "bounce.out"
  };
  return (_a = map[ease]) != null ? _a : "power2.out";
}
function extractUrl(item) {
  var _a, _b, _c;
  if (!item) return null;
  if (typeof item === "string") return item.trim() || null;
  if (typeof item === "object") {
    const url = item.src || item.url || ((_c = (_b = (_a = item.srcSet) == null ? void 0 : _a.split) == null ? void 0 : _b.call(_a, " ")) == null ? void 0 : _c[0]) || null;
    return typeof url === "string" ? url.trim() || null : null;
  }
  return null;
}
function ImageGallery(props) {
  const {
    background,
    images,
    imageScale,
    blankArea,
    crowdDensity,
    crowdDelay,
    type,
    direction,
    appear,
    disappear
  } = props;
  const animType = type != null ? type : "straight";
  const spiralDir = direction != null ? direction : "both";
  const containerRef = useRef(null);
  const zoneIdxRef = useRef(0);
  const zIndexRef = useRef(1);
  const timerRef = useRef(null);
  const pausedRef = useRef(false);
  const activeCountRef = useRef(0);
  const recentImgsRef = useRef([]);
  const imagePoolRef = useRef([]);
  const backgroundRef = useRef(background != null ? background : "#000000");
  const imageScaleRef = useRef(imageScale != null ? imageScale : 5);
  const blankAreaRef = useRef(blankArea != null ? blankArea : 1);
  const crowdDensityRef = useRef(crowdDensity != null ? crowdDensity : 10);
  const crowdDelayRef = useRef(crowdDelay != null ? crowdDelay : 0);
  const typeRef = useRef(animType);
  const dirRef = useRef(spiralDir);
  const appearRef = useRef(
    appear != null ? appear : { style: "inToOut", ease: { duration: 0.5, ease: "easeOut" } }
  );
  const disappearRef = useRef(
    disappear != null ? disappear : {
      style: "inToOut",
      ease: { duration: 0.67, ease: "easeIn" }
    }
  );
  backgroundRef.current = background != null ? background : "#000000";
  imageScaleRef.current = imageScale != null ? imageScale : 5;
  blankAreaRef.current = blankArea != null ? blankArea : 1;
  crowdDensityRef.current = crowdDensity != null ? crowdDensity : 10;
  crowdDelayRef.current = crowdDelay != null ? crowdDelay : 0;
  typeRef.current = animType;
  dirRef.current = spiralDir;
  appearRef.current = appear != null ? appear : {
    style: "inToOut",
    ease: { duration: 0.5, ease: "easeOut" }
  };
  disappearRef.current = disappear != null ? disappear : {
    style: "inToOut",
    ease: { duration: 0.67, ease: "easeIn" }
  };
  const FALLBACK_IMAGES = [
    // Digital / abstract art
    "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=600&q=80",
    "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=600&q=80",
    // Indian designs / textile
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80",
    "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=600&q=80",
    // Drawing / sketch
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    "https://images.unsplash.com/photo-1502945015378-0e284ca1a5be?w=600&q=80",
    // Color / paint
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80"
  ];
  const userInput = Array.isArray(images) ? images.map(extractUrl).filter(Boolean) : [];
  const userUrls = userInput.length > 0 ? userInput : FALLBACK_IMAGES;
  imagePoolRef.current = userUrls;
  function getUniqueImage() {
    const pool = imagePoolRef.current;
    if (pool.length === 0) return null;
    const recent = recentImgsRef.current;
    let available = pool.filter((img) => !recent.includes(img));
    if (available.length === 0) {
      recentImgsRef.current = [];
      available = pool;
    }
    const selected = pick(available);
    recentImgsRef.current.push(selected);
    if (recentImgsRef.current.length > Math.max(3, pool.length - 1))
      recentImgsRef.current.shift();
    return selected;
  }
  useEffect(() => {
    recentImgsRef.current = [];
  }, [images]);
  useEffect(() => {
    userUrls.forEach((src) => {
      const i = new Image();
      i.src = src;
    });
  }, [images]);
  useEffect(() => {
    let gsapScript = document.getElementById("ma-gsap");
    if (!gsapScript) {
      gsapScript = document.createElement("script");
      gsapScript.id = "ma-gsap";
      gsapScript.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";
      gsapScript.async = true;
      document.head.appendChild(gsapScript);
    }
    function init() {
      const gsap = window.gsap;
      function handleVisibilityChange() {
        var _a;
        if (document.hidden) {
          pausedRef.current = true;
          gsap.globalTimeline.pause();
          (_a = containerRef.current) == null ? void 0 : _a.querySelectorAll("[data-tile]").forEach((el) => el.remove());
        } else {
          pausedRef.current = false;
          gsap.globalTimeline.resume();
        }
      }
      document.addEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
      function spawnTile() {
        var _a, _b;
        if (pausedRef.current) return;
        const container = containerRef.current;
        if (!container) return;
        const imgSrc = getUniqueImage();
        if (!imgSrc) return;
        const zone = ZONES[zoneIdxRef.current % ZONES.length];
        zoneIdxRef.current++;
        const shape = pick(ASPECT_RATIOS);
        const containerW = ((_a = containerRef.current) == null ? void 0 : _a.offsetWidth) || 800;
        const containerH = ((_b = containerRef.current) == null ? void 0 : _b.offsetHeight) || 600;
        const userScale = 0.125 + (imageScaleRef.current - 1) / 19 * 4.875;
        const maxByWidth = containerW / shape.w;
        const maxByHeight = containerH / shape.h;
        const effectiveScale = Math.min(
          userScale,
          maxByWidth,
          maxByHeight
        );
        const tileW = Math.round(shape.w * effectiveScale);
        const tileH = Math.round(shape.h * effectiveScale);
        const s0 = rand(0.1, 0.4);
        const s2 = rand(0.7, 1.1);
        const s3 = rand(3, 4.5);
        const centerX = containerW / 2;
        const centerY = containerH / 2;
        const zoneAngle = Math.atan2(zone.cy - 50, zone.cx - 50);
        const angleJitter = rand(-0.25, 0.25);
        const angle = zoneAngle + angleJitter + rand(-0.3, 0.3);
        const isSpiralModeForSpawn = typeRef.current === "spiral";
        const spawnRadius = isSpiralModeForSpawn ? 0 : blankAreaRef.current / 100 * Math.hypot(containerW / 2, containerH / 2);
        const spawnX_px = centerX + Math.cos(angle) * spawnRadius;
        const spawnY_px = centerY + Math.sin(angle) * spawnRadius;
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
        const el = document.createElement("div");
        el.setAttribute("data-tile", "1");
        el.style.cssText = `
                    position: absolute;
                    width: ${tileW}px;
                    height: ${tileH}px;
                    left: ${spawnX_px}px;
                    top: ${spawnY_px}px;
                    transform-origin: center center;
                    border-radius: 0;
                    overflow: hidden;
                    box-shadow: none;
                    z-index: ${zIndexRef.current++};
                    pointer-events: none;
                    will-change: transform, opacity;
                    translate: -50% -50%;
                    background: ${backgroundRef.current};
                    opacity: 0;
                `;
        const imgEl = document.createElement("img");
        imgEl.alt = "";
        imgEl.loading = "eager";
        imgEl.decoding = "async";
        imgEl.referrerPolicy = "no-referrer";
        imgEl.style.cssText = "width:100%;height:100%;object-fit:contain;display:block;";
        el.appendChild(imgEl);
        container.appendChild(el);
        activeCountRef.current++;
        function startAnimation() {
          var _a2, _b2, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u;
          if (pausedRef.current) {
            activeCountRef.current--;
            el.remove();
            return;
          }
          const appearDir = (_b2 = (_a2 = appearRef.current) == null ? void 0 : _a2.style) != null ? _b2 : "inToOut";
          const disappearDir = (_d = (_c = disappearRef.current) == null ? void 0 : _c.style) != null ? _d : "inToOut";
          const entryDur = (_g = (_f = (_e = appearRef.current) == null ? void 0 : _e.ease) == null ? void 0 : _f.duration) != null ? _g : 0.5;
          const holdDur = (_j = (_i = (_h = appearRef.current) == null ? void 0 : _h.ease) == null ? void 0 : _i.delay) != null ? _j : 0;
          const zoopDur = (_m = (_l = (_k = disappearRef.current) == null ? void 0 : _k.ease) == null ? void 0 : _l.duration) != null ? _m : 0.67;
          const entryEase = framerEaseToGsap(
            (_p = (_o = (_n = appearRef.current) == null ? void 0 : _n.ease) == null ? void 0 : _o.ease) != null ? _p : "easeOut"
          );
          const exitEase = framerEaseToGsap(
            (_s = (_r = (_q = disappearRef.current) == null ? void 0 : _q.ease) == null ? void 0 : _r.ease) != null ? _s : "easeIn"
          );
          const exitSign = disappearDir === "inToOut" ? 1 : -1;
          const exitScale = disappearDir === "inToOut" ? s3 : 0.08;
          const fadeOutPct = (_u = (_t = disappearRef.current) == null ? void 0 : _t.fadeOut) != null ? _u : 100;
          const fadeDur = zoopDur * (fadeOutPct / 100);
          const entryD = rand(80, 140);
          const exitD = rand(160, 260);
          const onDone = () => {
            gsap.set(el, { opacity: 0 });
            el.remove();
            activeCountRef.current--;
          };
          const isSpiral = typeRef.current === "spiral";
          if (isSpiral) {
            const path = SPIRAL_PATHS[Math.floor(Math.random() * SPIRAL_PATHS.length)];
            const R = Math.hypot(containerW / 2, containerH / 2) * 1.1;
            const startA = path.startAngle;
            const dirSetting = dirRef.current;
            const spinDir = dirSetting === "clockwise" ? 1 : dirSetting === "anticlockwise" ? -1 : path.spinDir;
            const turns = path.turns;
            const startR = appearDir === "inToOut" ? 0 : R;
            const endR = disappearDir === "inToOut" ? R : 0;
            const midR = R * (blankAreaRef.current / 100);
            const mid = pick([0.45, 0.5, 0.55]);
            const pathPos = (u) => {
              const r = u <= mid ? startR + (midR - startR) * (u / mid) : midR + (endR - midR) * ((u - mid) / (1 - mid));
              const a = startA + spinDir * u * turns * Math.PI * 2;
              return [Math.cos(a) * r, Math.sin(a) * r];
            };
            const scaleAt = (u) => appearDir === "inToOut" ? s2 * u : s2 * (1 - u);
            const [sx, sy] = pathPos(0);
            const tl = gsap.timeline({ onComplete: onDone });
            tl.set(el, {
              scale: scaleAt(0),
              opacity: 0,
              x: sx,
              y: sy,
              rotation: 0
            });
            const totalDur = entryDur + holdDur + zoopDur;
            const appearEnd = entryDur;
            const driftEnd = entryDur + holdDur;
            const big = { t: 0 };
            tl.to(big, {
              t: 1,
              duration: totalDur,
              ease: "none",
              onUpdate: () => {
                const t = big.t;
                const realT = t * totalDur;
                const u = Math.max(
                  0,
                  Math.min(
                    1,
                    t + Math.sin(t * Math.PI * 2) * 0.12
                  )
                );
                let op;
                if (realT < appearEnd) {
                  op = entryDur > 0 ? realT / entryDur : 1;
                } else if (realT < driftEnd) {
                  op = 1;
                } else {
                  const since = realT - driftEnd;
                  op = fadeDur > 0 ? Math.max(0, 1 - since / fadeDur) : 0;
                }
                const [x, y] = pathPos(u);
                gsap.set(el, {
                  x,
                  y,
                  opacity: op,
                  scale: scaleAt(u)
                });
              }
            });
          } else if (appearDir === "inToOut") {
            const x1 = cosA * entryD;
            const y1 = sinA * entryD;
            const x2 = x1 + exitSign * cosA * exitD;
            const y2 = y1 + exitSign * sinA * exitD;
            const driftF = 0.15;
            const xD = x1 + (x2 - x1) * driftF;
            const yD = y1 + (y2 - y1) * driftF;
            const scaleD = s2 + (exitScale - s2) * driftF;
            const tl = gsap.timeline({ onComplete: onDone }).set(el, {
              scale: s0,
              opacity: 1,
              x: 0,
              y: 0,
              rotation: 0
            }).to(el, {
              scale: s2,
              x: x1,
              y: y1,
              duration: entryDur,
              ease: entryEase
            });
            if (holdDur > 0) {
              tl.to(el, {
                scale: scaleD,
                x: xD,
                y: yD,
                duration: holdDur,
                ease: "none"
              });
            }
            tl.to(el, {
              scale: exitScale,
              x: x2,
              y: y2,
              duration: zoopDur,
              ease: exitEase
            }).to(
              el,
              {
                opacity: 0,
                duration: fadeDur,
                ease: exitEase
              },
              "<"
            );
          } else {
            const startX = cosA * entryD * 2.5;
            const startY = sinA * entryD * 2.5;
            const exitX = exitSign * cosA * exitD;
            const exitY = exitSign * sinA * exitD;
            const driftF = 0.15;
            const xD = (exitX - 0) * driftF;
            const yD = (exitY - 0) * driftF;
            const scaleD = s2 + (exitScale - s2) * driftF;
            const tl = gsap.timeline({ onComplete: onDone }).set(el, {
              scale: s3,
              opacity: 0,
              x: startX,
              y: startY,
              rotation: 0
            }).to(el, {
              scale: s2,
              opacity: 1,
              x: 0,
              y: 0,
              duration: entryDur,
              ease: entryEase
            });
            if (holdDur > 0) {
              tl.to(el, {
                scale: scaleD,
                x: xD,
                y: yD,
                duration: holdDur,
                ease: "none"
              });
            }
            tl.to(el, {
              scale: exitScale,
              x: exitX,
              y: exitY,
              duration: zoopDur,
              ease: exitEase
            }).to(
              el,
              {
                opacity: 0,
                duration: fadeDur,
                ease: exitEase
              },
              "<"
            );
          }
        }
        imgEl.onerror = () => {
          activeCountRef.current--;
          el.remove();
        };
        imgEl.src = imgSrc;
        if (typeof imgEl.decode === "function") {
          imgEl.decode().then(startAnimation).catch(() => {
            activeCountRef.current--;
            el.remove();
          });
        } else {
          imgEl.complete && imgEl.naturalWidth > 0 ? startAnimation() : imgEl.onload = startAnimation;
        }
      }
      let lastSpawn = 0;
      let batchCount = 0;
      let nextBatchAt = 0;
      timerRef.current = setInterval(() => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i;
        if (pausedRef.current) return;
        const target = Math.max(1, Math.round(crowdDensityRef.current));
        const delaySec = Math.max(0, crowdDelayRef.current);
        const now = performance.now();
        if (delaySec === 0) {
          const entryDur = (_c = (_b = (_a = appearRef.current) == null ? void 0 : _a.ease) == null ? void 0 : _b.duration) != null ? _c : 0.5;
          const holdDur = (_f = (_e = (_d = appearRef.current) == null ? void 0 : _d.ease) == null ? void 0 : _e.delay) != null ? _f : 0;
          const zoopDur = (_i = (_h = (_g = disappearRef.current) == null ? void 0 : _g.ease) == null ? void 0 : _h.duration) != null ? _i : 0.67;
          const lifetimeMs = (entryDur + holdDur + zoopDur) * 1e3;
          const spawnInterval = Math.max(20, lifetimeMs / target);
          if (now - lastSpawn >= spawnInterval) {
            spawnTile();
            lastSpawn = now;
          }
          return;
        }
        if (now < nextBatchAt) return;
        if (batchCount < target) {
          if (now - lastSpawn >= 50) {
            spawnTile();
            batchCount++;
            lastSpawn = now;
            if (batchCount >= target) {
              nextBatchAt = now + delaySec * 1e3;
              batchCount = 0;
            }
          }
        }
      }, 20);
      gsapScript._visCleanup = () => document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    }
    if (window.gsap) {
      init();
    } else {
      gsapScript.addEventListener("load", init);
    }
    return () => {
      var _a, _b;
      if (timerRef.current) clearInterval(timerRef.current);
      (_a = gsapScript._visCleanup) == null ? void 0 : _a.call(gsapScript);
      const w = window;
      if (w.gsap) {
        try {
          w.gsap.globalTimeline.clear();
        } catch (e) {
        }
      }
      (_b = containerRef.current) == null ? void 0 : _b.querySelectorAll("[data-tile]").forEach((el) => el.remove());
      activeCountRef.current = 0;
      zoneIdxRef.current = 0;
      zIndexRef.current = 1;
      recentImgsRef.current = [];
    };
  }, [
    images,
    background,
    imageScale,
    blankArea,
    crowdDensity,
    crowdDelay,
    animType,
    spiralDir,
    appear,
    disappear
  ]);
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: containerRef,
      style: {
        position: "relative",
        width: "100%",
        height: "100%",
        background: background != null ? background : "#000000",
        overflow: "hidden"
      },
      children: /* @__PURE__ */ jsx(
        "div",
        {
          style: {
            position: "absolute",
            inset: 0,
            opacity: 0.06,
            pointerEvents: "none",
            backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.5) 1px,transparent 1px)",
            backgroundSize: "40px 40px"
          }
        }
      )
    }
  );
}
addPropertyControls(ImageGallery, {
  images: {
    title: "Images",
    type: ControlType.Array,
    control: { type: ControlType.ResponsiveImage },
    defaultValue: [
      {
        src: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=600&q=80"
      },
      {
        src: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=600&q=80"
      },
      {
        src: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80"
      },
      {
        src: "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=600&q=80"
      },
      {
        src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80"
      },
      {
        src: "https://images.unsplash.com/photo-1502945015378-0e284ca1a5be?w=600&q=80"
      },
      {
        src: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80"
      }
    ]
  },
  type: {
    title: "Type",
    type: ControlType.Enum,
    defaultValue: "straight",
    options: ["straight", "spiral"],
    optionTitles: ["Straight", "Spiral"],
    displaySegmentedControl: false
  },
  direction: {
    title: "Direction",
    type: ControlType.Enum,
    defaultValue: "both",
    options: ["clockwise", "anticlockwise", "both"],
    optionTitles: ["Clockwise", "Anticlockwise", "Both"],
    displaySegmentedControl: false,
    hidden: (props) => props.type !== "spiral"
  },
  appear: {
    title: "Appear",
    type: ControlType.Object,
    controls: {
      style: {
        title: "Style",
        type: ControlType.Enum,
        options: ["inToOut", "outToIn"],
        optionTitles: ["In to Out", "Out to In"],
        defaultValue: "inToOut"
      },
      ease: {
        title: "Ease",
        type: ControlType.Transition,
        defaultValue: {
          type: "tween",
          duration: 2,
          delay: 2,
          ease: "linear"
        }
      }
    }
  },
  disappear: {
    title: "Disappear",
    type: ControlType.Object,
    controls: {
      style: {
        title: "Style",
        type: ControlType.Enum,
        options: ["inToOut", "outToIn"],
        optionTitles: ["In to Out", "Out to In"],
        defaultValue: "inToOut"
      },
      ease: {
        title: "Ease",
        type: ControlType.Transition,
        defaultValue: { type: "tween", duration: 1, ease: "linear" }
      },
      fadeOut: {
        title: "Fade Out",
        type: ControlType.Number,
        defaultValue: 100,
        min: 1,
        max: 100,
        step: 1,
        unit: "%",
        displayStepper: true,
        description: "Images fade from 100 \u2192 0 opacity over this percent of the disappear duration."
      }
    }
  },
  blankArea: {
    title: "Blank Area",
    type: ControlType.Number,
    defaultValue: 5,
    min: 0,
    max: 100,
    step: 1,
    unit: "%"
  },
  imageScale: {
    title: "Image Scale",
    type: ControlType.Number,
    defaultValue: 2,
    min: 1,
    max: 20,
    step: 1
  },
  crowdDensity: {
    title: "Crowd Density",
    type: ControlType.Number,
    defaultValue: 10,
    min: 1,
    max: 50,
    step: 1
  },
  crowdDelay: {
    title: "Crowd Delay",
    type: ControlType.Number,
    defaultValue: 0,
    min: 0,
    max: 10,
    step: 0.1,
    unit: "s"
  },
  background: {
    title: "Background",
    type: ControlType.Color,
    defaultValue: "#000000"
  }
});
export {
  ImageGallery as default
};
