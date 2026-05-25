"use client";
import {
  __spreadValues
} from "./chunk-ORMEWXMH.js";

// app/component/Flicker.tsx
import { addPropertyControls, ControlType } from "framer";
import { useState, useEffect, useRef } from "react";
import { jsx } from "react/jsx-runtime";
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
      return (t) => t;
  }
}
function buildTextCfg(m) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t;
  return {
    duration: (_b = (_a = m == null ? void 0 : m.ease) == null ? void 0 : _a.duration) != null ? _b : 5,
    easeCurve: (_d = (_c = m == null ? void 0 : m.ease) == null ? void 0 : _c.ease) != null ? _d : "linear",
    flickerCount: (_e = m == null ? void 0 : m.flickerCount) != null ? _e : 4,
    showStroke: (_f = m == null ? void 0 : m.showStroke) != null ? _f : true,
    strokePosition: (_g = m == null ? void 0 : m.strokePosition) != null ? _g : "start",
    strokeCount: (_h = m == null ? void 0 : m.strokeCount) != null ? _h : 1,
    strokeColor: (_i = m == null ? void 0 : m.strokeColor) != null ? _i : "#ffffff",
    strokeWidth: (_j = m == null ? void 0 : m.strokeWidth) != null ? _j : 1.5,
    restState: (_k = m == null ? void 0 : m.restState) != null ? _k : "filled",
    delay: (_l = m == null ? void 0 : m.delay) != null ? _l : 0,
    shakeEnabled: (_m = m == null ? void 0 : m.shakeEnabled) != null ? _m : false,
    shakeWidth: (_n = m == null ? void 0 : m.shakeWidth) != null ? _n : 10,
    shakeSpeed: (_o = m == null ? void 0 : m.shakeSpeed) != null ? _o : 10,
    wordFlickerEnabled: (_p = m == null ? void 0 : m.wordFlickerEnabled) != null ? _p : true,
    letterFlickerEnabled: (_q = m == null ? void 0 : m.letterFlickerEnabled) != null ? _q : false,
    letterFlickerMode: (_r = m == null ? void 0 : m.letterFlickerMode) != null ? _r : "stroke",
    letterFlickerIntensity: (_s = m == null ? void 0 : m.letterFlickerIntensity) != null ? _s : 10,
    letterFlickerOpacity: (_t = m == null ? void 0 : m.letterFlickerOpacity) != null ? _t : 30
  };
}
function buildImageCfg(m) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
  return {
    duration: (_b = (_a = m == null ? void 0 : m.ease) == null ? void 0 : _a.duration) != null ? _b : 5,
    easeCurve: (_d = (_c = m == null ? void 0 : m.ease) == null ? void 0 : _c.ease) != null ? _d : "linear",
    flickerCount: (_e = m == null ? void 0 : m.flickerCount) != null ? _e : 4,
    showStroke: false,
    strokePosition: "start",
    strokeCount: 1,
    strokeColor: "#ffffff",
    strokeWidth: 1.5,
    restState: (_f = m == null ? void 0 : m.restState) != null ? _f : "filled",
    delay: (_g = m == null ? void 0 : m.delay) != null ? _g : 0,
    shakeEnabled: (_h = m == null ? void 0 : m.shakeEnabled) != null ? _h : false,
    shakeWidth: (_i = m == null ? void 0 : m.shakeWidth) != null ? _i : 10,
    shakeSpeed: (_j = m == null ? void 0 : m.shakeSpeed) != null ? _j : 10,
    wordFlickerEnabled: true,
    letterFlickerEnabled: false,
    letterFlickerMode: "stroke",
    letterFlickerIntensity: 10,
    letterFlickerOpacity: 30
  };
}
var DEFAULT_TEXT_CFG = buildTextCfg(void 0);
function OutlineFillText(props) {
  var _a, _b;
  const {
    contentType,
    text,
    image,
    font,
    colorMode,
    fontColor,
    gradientStart,
    gradientEnd,
    gradientAngle,
    tag,
    // Text
    textEnterFlickerEnabled,
    flicker,
    textHoverFlickerEnabled,
    flickerHover,
    // Image
    imageEnterFlickerEnabled,
    flickerImage,
    imageHoverFlickerEnabled,
    flickerImageHover
  } = props;
  const isImage = (contentType != null ? contentType : "text") === "image";
  const enterCfg = isImage ? buildImageCfg(flickerImage) : buildTextCfg(flicker);
  const hoverCfg = isImage ? buildImageCfg(flickerImageHover) : buildTextCfg(flickerHover);
  const enterEnabled = isImage ? imageEnterFlickerEnabled != null ? imageEnterFlickerEnabled : true : textEnterFlickerEnabled != null ? textEnterFlickerEnabled : true;
  const hoverEnabled = isImage ? imageHoverFlickerEnabled != null ? imageHoverFlickerEnabled : false : textHoverFlickerEnabled != null ? textHoverFlickerEnabled : false;
  const enterModal = isImage ? flickerImage : flicker;
  const replay = (_a = enterModal == null ? void 0 : enterModal.replay) != null ? _a : "no";
  const amount = (_b = enterModal == null ? void 0 : enterModal.position) != null ? _b : "above";
  const initialCfg = enterEnabled ? enterCfg : hoverEnabled ? hoverCfg : enterCfg;
  const [activeCfg, setActiveCfg] = useState(initialCfg);
  const [currentPhase, setCurrentPhase] = useState(initialCfg.restState);
  const [moveX, setMoveX] = useState(0);
  const [flickerLetters, setFlickerLetters] = useState(/* @__PURE__ */ new Set());
  const timersRef = useRef([]);
  const elementRef = useRef(null);
  const hasPlayedRef = useRef(false);
  const enterDoneRef = useRef(!enterEnabled);
  const getThreshold = () => {
    switch (amount) {
      case "above":
        return 0;
      case "middle":
        return 0.5;
      case "below":
        return 1;
      default:
        return 0;
    }
  };
  function generateTimings(count, totalMs, easeCurve) {
    const slots = count;
    const fn = makeEaseFn(easeCurve);
    const intervals = [];
    let prev = 0;
    for (let i = 1; i <= slots; i++) {
      const t = i / slots;
      const cur = fn(t) * totalMs;
      intervals.push(Math.max(0, cur - prev));
      prev = cur;
    }
    return intervals;
  }
  function buildVisibleItems(cfg) {
    var _a2, _b2;
    const sc = Math.min((_a2 = cfg.strokeCount) != null ? _a2 : 1, cfg.flickerCount);
    if (!cfg.showStroke) {
      return Array(cfg.flickerCount).fill("filled");
    }
    const fillCount = Math.max(1, cfg.flickerCount - sc);
    const strokes = Array(sc).fill("outline");
    const pos = (_b2 = cfg.strokePosition) != null ? _b2 : "start";
    if (pos === "start") {
      return [...strokes, ...Array(fillCount).fill("filled")];
    }
    if (pos === "end") {
      return [
        ...Array(fillCount - 1).fill("filled"),
        ...strokes,
        "filled"
      ];
    }
    const before = Math.floor(fillCount / 2);
    const after = fillCount - before;
    return [
      ...Array(before).fill("filled"),
      ...strokes,
      ...Array(after).fill("filled")
    ];
  }
  function runAnimation(cfg) {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setFlickerLetters(/* @__PURE__ */ new Set());
    setActiveCfg(cfg);
    if (!cfg.wordFlickerEnabled && !cfg.letterFlickerEnabled) return;
    const totalMs = cfg.duration * 1e3;
    const chars = (text != null ? text : "").split("");
    const nonSpaceIndices = chars.reduce((acc, c, i) => {
      if (c.trim() !== "") acc.push(i);
      return acc;
    }, []);
    const scheduleTicks = (windowStart, windowDuration) => {
      if (!cfg.letterFlickerEnabled || nonSpaceIndices.length === 0)
        return;
      const cycleDuration = Math.round(
        1e3 * Math.pow(50 / 1e3, (cfg.letterFlickerIntensity - 1) / 19)
      );
      const sub1 = Math.round(cycleDuration / 3);
      const sub2 = Math.round(2 * cycleDuration / 3);
      const windowEnd = windowStart + windowDuration;
      let tickCursor = windowStart;
      while (tickCursor < windowEnd) {
        const tFlicker1 = tickCursor;
        const tFill = tickCursor + sub1;
        const tFlicker2 = tickCursor + sub2;
        const slot = { sel: /* @__PURE__ */ new Set() };
        timersRef.current.push(
          setTimeout(() => {
            const count = Math.min(
              nonSpaceIndices.length,
              Math.floor(Math.random() * 2) + 1
            );
            const shuffled = [...nonSpaceIndices].sort(
              () => Math.random() - 0.5
            );
            slot.sel = new Set(shuffled.slice(0, count));
            setFlickerLetters(slot.sel);
          }, tFlicker1)
        );
        if (tFill < windowEnd) {
          timersRef.current.push(
            setTimeout(() => setFlickerLetters(/* @__PURE__ */ new Set()), tFill)
          );
        }
        if (tFlicker2 < windowEnd) {
          timersRef.current.push(
            setTimeout(() => setFlickerLetters(slot.sel), tFlicker2)
          );
        }
        tickCursor += cycleDuration;
      }
      timersRef.current.push(
        setTimeout(() => setFlickerLetters(/* @__PURE__ */ new Set()), windowEnd)
      );
    };
    if (cfg.wordFlickerEnabled) {
      setCurrentPhase(cfg.restState);
      setMoveX(0);
      const visibleItems = buildVisibleItems(cfg);
      const sequence = [];
      visibleItems.forEach((item) => {
        sequence.push("invisible");
        sequence.push(item);
      });
      const intervals = generateTimings(
        sequence.length,
        totalMs,
        cfg.easeCurve
      );
      const phaseSlots = [];
      let cursor = cfg.delay * 1e3;
      sequence.forEach((phase, i) => {
        var _a2;
        const startMs = cursor;
        const durationMs = (_a2 = intervals[i]) != null ? _a2 : 0;
        phaseSlots.push({ phase, startMs, durationMs });
        timersRef.current.push(
          setTimeout(() => setCurrentPhase(phase), startMs)
        );
        cursor += durationMs;
      });
      timersRef.current.push(
        setTimeout(() => {
          setCurrentPhase(cfg.restState);
          setMoveX(0);
          setFlickerLetters(/* @__PURE__ */ new Set());
        }, cursor)
      );
      if (cfg.shakeEnabled) {
        const flipMs = Math.round(
          500 * Math.pow(30 / 500, (cfg.shakeSpeed - 1) / 19)
        );
        const animStart = cfg.delay * 1e3;
        const animEnd = cursor;
        let flipCursor = animStart;
        let dir = 1;
        while (flipCursor < animEnd) {
          const t = flipCursor;
          const d = dir;
          timersRef.current.push(
            setTimeout(() => setMoveX(d * cfg.shakeWidth), t)
          );
          dir *= -1;
          flipCursor += flipMs;
        }
      }
      phaseSlots.forEach(({ phase, startMs, durationMs }) => {
        if (phase !== "filled" && phase !== "outline") return;
        scheduleTicks(startMs, durationMs);
      });
    } else {
      scheduleTicks(cfg.delay * 1e3, totalMs);
    }
  }
  const sig = JSON.stringify({
    contentType,
    enterEnabled,
    hoverEnabled,
    enterCfg,
    hoverCfg,
    replay,
    amount,
    colorMode,
    fontColor,
    gradientStart,
    gradientEnd,
    gradientAngle
  });
  useEffect(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    hasPlayedRef.current = false;
    enterDoneRef.current = !enterEnabled;
    setFlickerLetters(/* @__PURE__ */ new Set());
    const baseCfg = enterEnabled ? enterCfg : hoverEnabled ? hoverCfg : enterCfg;
    setActiveCfg(baseCfg);
    setCurrentPhase(baseCfg.restState);
    setMoveX(0);
  }, [sig]);
  useEffect(() => {
    if (!enterEnabled) return;
    if (!elementRef.current) return;
    const threshold = getThreshold();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!hasPlayedRef.current) {
              hasPlayedRef.current = true;
              enterDoneRef.current = false;
              runAnimation(enterCfg);
              const totalMs = (enterCfg.delay + enterCfg.duration) * 1e3;
              timersRef.current.push(
                setTimeout(() => {
                  enterDoneRef.current = true;
                }, totalMs)
              );
            }
          } else {
            if (replay === "yes") {
              hasPlayedRef.current = false;
              enterDoneRef.current = false;
              timersRef.current.forEach(clearTimeout);
              timersRef.current = [];
              setFlickerLetters(/* @__PURE__ */ new Set());
              setCurrentPhase(enterCfg.restState);
              setMoveX(0);
            }
          }
        });
      },
      { threshold }
    );
    observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [sig]);
  const handleMouseEnter = () => {
    if (!hoverEnabled) return;
    if (enterEnabled && !enterDoneRef.current) return;
    runAnimation(hoverCfg);
  };
  const getFilledStyle = () => {
    if (colorMode === "gradient") {
      return {
        background: `linear-gradient(${gradientAngle}deg, ${gradientStart}, ${gradientEnd})`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        WebkitTextStroke: "0px transparent",
        color: "transparent"
      };
    }
    return {
      color: fontColor,
      WebkitTextFillColor: fontColor,
      WebkitTextStroke: "0px transparent",
      background: "none"
    };
  };
  const getTextStyle = () => {
    switch (currentPhase) {
      case "invisible":
        return {
          color: "transparent",
          WebkitTextFillColor: "transparent",
          WebkitTextStroke: "0px transparent",
          background: "none"
        };
      case "outline":
        return {
          color: "transparent",
          WebkitTextFillColor: "transparent",
          WebkitTextStroke: `${activeCfg.strokeWidth}px ${activeCfg.strokeColor}`,
          background: "none"
        };
      case "filled":
        return getFilledStyle();
      default:
        return {
          color: "transparent",
          WebkitTextFillColor: "transparent",
          WebkitTextStroke: "0px transparent",
          background: "none"
        };
    }
  };
  const getImageStyle = () => {
    switch (currentPhase) {
      case "invisible":
        return { opacity: 0 };
      case "outline":
        return { opacity: 0.15 };
      case "filled":
        return { opacity: 1 };
      default:
        return { opacity: 0 };
    }
  };
  const sharedContainerStyle = {
    transform: `translateX(${moveX}px)`,
    transition: "none",
    cursor: hoverEnabled ? "default" : void 0
  };
  const getFlickerLetterStyle = () => {
    if (activeCfg.letterFlickerMode === "stroke") {
      if (currentPhase === "outline") {
        return {
          opacity: 0,
          WebkitTextFillColor: "transparent",
          color: "transparent",
          WebkitTextStroke: "0px transparent",
          background: "none"
        };
      }
      return {
        WebkitTextFillColor: "transparent",
        color: "transparent",
        WebkitTextStroke: `${activeCfg.strokeWidth}px ${activeCfg.strokeColor}`,
        background: "none",
        WebkitBackgroundClip: "unset",
        backgroundClip: "unset"
      };
    }
    return { opacity: activeCfg.letterFlickerOpacity / 100 };
  };
  const renderText = () => {
    if (!activeCfg.letterFlickerEnabled || currentPhase !== "filled" && currentPhase !== "outline" || flickerLetters.size === 0) {
      return text;
    }
    return (text != null ? text : "").split("").map((char, i) => {
      if (char.trim() === "" || !flickerLetters.has(i)) {
        return /* @__PURE__ */ jsx("span", { children: char }, i);
      }
      return /* @__PURE__ */ jsx("span", { style: getFlickerLetterStyle(), children: char }, i);
    });
  };
  if (isImage) {
    return /* @__PURE__ */ jsx(
      "div",
      {
        ref: elementRef,
        onMouseEnter: handleMouseEnter,
        style: __spreadValues(__spreadValues({
          width: "100%",
          height: "100%"
        }, sharedContainerStyle), getImageStyle()),
        children: image ? /* @__PURE__ */ jsx(
          "img",
          {
            src: image,
            style: {
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block"
            }
          }
        ) : null
      }
    );
  }
  const Tag = tag;
  return /* @__PURE__ */ jsx(
    Tag,
    {
      ref: elementRef,
      onMouseEnter: handleMouseEnter,
      style: __spreadValues(__spreadValues(__spreadValues({
        margin: 0,
        padding: 0,
        letterSpacing: "-0.02em",
        lineHeight: 1
      }, sharedContainerStyle), font), getTextStyle()),
      children: renderText()
    }
  );
}
var enterTriggerFields = {
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
    displaySegmentedControl: true
  },
  replay: {
    title: "Replay",
    type: ControlType.Enum,
    defaultValue: "yes",
    options: ["yes", "no"],
    optionTitles: ["Yes", "No"],
    displaySegmentedControl: true
  }
};
var enterOnlyFields = {
  restState: {
    title: "Rest State",
    type: ControlType.Enum,
    defaultValue: "filled",
    options: ["filled", "outline", "invisible"],
    optionTitles: ["Filled", "Outline", "Empty"],
    displaySegmentedControl: false
  },
  delay: {
    title: "Start Delay",
    type: ControlType.Number,
    defaultValue: 0,
    min: 0,
    max: 10,
    step: 0.1,
    displayStepper: true,
    unit: "s"
  }
};
var textFlickerControls = {
  ease: {
    title: "Ease",
    type: ControlType.Transition,
    defaultValue: { type: "tween", duration: 5, ease: "linear" }
  },
  flickerCount: {
    title: "Flicker Count",
    type: ControlType.Number,
    defaultValue: 3,
    min: 1,
    max: 1e3,
    step: 1,
    displayStepper: true
  },
  showStroke: {
    title: "Show Stroke",
    type: ControlType.Boolean,
    defaultValue: false,
    enabledTitle: "Yes",
    disabledTitle: "No"
  },
  strokePosition: {
    title: "Stroke Position",
    type: ControlType.Enum,
    defaultValue: "start",
    options: ["start", "middle", "end"],
    optionTitles: ["Start", "Middle", "End"],
    optionIcons: [
      "direction-left",
      "direction-horizontal",
      "direction-right"
    ],
    displaySegmentedControl: true,
    hidden: (props) => !props.showStroke
  },
  strokeCount: {
    title: "Stroke Count",
    type: ControlType.Number,
    defaultValue: 1,
    min: 1,
    max: 1e3,
    step: 1,
    displayStepper: true,
    hidden: (props) => !props.showStroke
  },
  strokeColor: {
    title: "Stroke Color",
    type: ControlType.Color,
    defaultValue: "#ffffff",
    hidden: (props) => !props.showStroke
  },
  strokeWidth: {
    title: "Stroke Width",
    type: ControlType.Number,
    defaultValue: 1.5,
    min: 0.5,
    max: 5,
    step: 0.5,
    displayStepper: true,
    hidden: (props) => !props.showStroke
  },
  wordFlickerEnabled: {
    title: "Word Flicker",
    type: ControlType.Boolean,
    defaultValue: true,
    enabledTitle: "On",
    disabledTitle: "Off"
  },
  shakeEnabled: {
    title: "Shake",
    type: ControlType.Boolean,
    defaultValue: false,
    enabledTitle: "On",
    disabledTitle: "Off",
    hidden: (props) => !props.wordFlickerEnabled
  },
  shakeWidth: {
    title: "Width",
    type: ControlType.Number,
    defaultValue: 10,
    min: 1,
    max: 100,
    step: 1,
    unit: "px",
    hidden: (props) => !props.wordFlickerEnabled || !props.shakeEnabled
  },
  shakeSpeed: {
    title: "Intensity",
    type: ControlType.Number,
    defaultValue: 10,
    min: 1,
    max: 20,
    step: 1,
    hidden: (props) => !props.wordFlickerEnabled || !props.shakeEnabled
  },
  letterFlickerEnabled: {
    title: "Letter Flicker",
    type: ControlType.Boolean,
    defaultValue: true,
    enabledTitle: "On",
    disabledTitle: "Off"
  },
  letterFlickerMode: {
    title: "Flicker Style",
    type: ControlType.Enum,
    defaultValue: "opacity",
    options: ["stroke", "opacity"],
    optionTitles: ["Stroke", "Opacity"],
    hidden: (props) => !props.letterFlickerEnabled
  },
  letterFlickerOpacity: {
    title: "Opacity",
    type: ControlType.Number,
    defaultValue: 30,
    min: 0,
    max: 100,
    step: 1,
    unit: "%",
    hidden: (props) => !props.letterFlickerEnabled || props.letterFlickerMode !== "opacity"
  },
  letterFlickerIntensity: {
    title: "Speed",
    type: ControlType.Number,
    defaultValue: 10,
    min: 1,
    max: 20,
    step: 1,
    hidden: (props) => !props.letterFlickerEnabled
  }
};
var imageFlickerControls = {
  ease: {
    title: "Ease",
    type: ControlType.Transition,
    defaultValue: { type: "tween", duration: 5, ease: "linear" }
  },
  flickerCount: {
    title: "Flicker Count",
    type: ControlType.Number,
    defaultValue: 4,
    min: 1,
    max: 1e3,
    step: 1,
    displayStepper: true
  },
  shakeEnabled: {
    title: "Shake",
    type: ControlType.Boolean,
    defaultValue: false,
    enabledTitle: "On",
    disabledTitle: "Off"
  },
  shakeWidth: {
    title: "Width",
    type: ControlType.Number,
    defaultValue: 10,
    min: 1,
    max: 100,
    step: 1,
    unit: "px",
    hidden: (props) => !props.shakeEnabled
  },
  shakeSpeed: {
    title: "Intensity",
    type: ControlType.Number,
    defaultValue: 10,
    min: 1,
    max: 20,
    step: 1,
    hidden: (props) => !props.shakeEnabled
  }
};
addPropertyControls(OutlineFillText, {
  contentType: {
    title: "Content",
    type: ControlType.Enum,
    defaultValue: "text",
    options: ["text", "image"],
    optionTitles: ["Text", "Image"],
    displaySegmentedControl: true
  },
  text: {
    title: "Text",
    type: ControlType.String,
    defaultValue: "Lander Studio",
    hidden: (props) => props.contentType === "image"
  },
  image: {
    title: "Image",
    type: ControlType.Image,
    hidden: (props) => props.contentType !== "image"
  },
  font: {
    type: ControlType.Font,
    title: "Font",
    defaultValue: {
      fontFamily: "League Spartan",
      variant: "Medium",
      fontSize: 120,
      lineHeight: "1em",
      letterSpacing: "0em"
    },
    controls: "extended",
    defaultFontType: "sans-serif",
    hidden: (props) => props.contentType === "image"
  },
  colorMode: {
    title: "Color Mode",
    type: ControlType.Enum,
    defaultValue: "solid",
    options: ["solid", "gradient"],
    optionTitles: ["Solid", "Gradient"],
    displaySegmentedControl: true,
    hidden: (props) => props.contentType === "image"
  },
  fontColor: {
    title: "Color",
    type: ControlType.Color,
    defaultValue: "#57FF1F",
    hidden: (props) => props.contentType === "image" || props.colorMode === "gradient"
  },
  gradientAngle: {
    title: "Angle",
    type: ControlType.Number,
    defaultValue: 90,
    min: 0,
    max: 360,
    step: 1,
    unit: "\xB0",
    hidden: (props) => props.contentType === "image" || props.colorMode !== "gradient"
  },
  gradientStart: {
    title: "From",
    type: ControlType.Color,
    defaultValue: "#ffffff",
    hidden: (props) => props.contentType === "image" || props.colorMode !== "gradient"
  },
  gradientEnd: {
    title: "To",
    type: ControlType.Color,
    defaultValue: "#888888",
    hidden: (props) => props.contentType === "image" || props.colorMode !== "gradient"
  },
  // ── Text: Enter Flicker ───────────────────────────────────────────────
  textEnterFlickerEnabled: {
    title: "Enter Flicker",
    type: ControlType.Boolean,
    defaultValue: true,
    enabledTitle: "On",
    disabledTitle: "Off",
    hidden: (props) => props.contentType === "image"
  },
  flicker: {
    title: "Enter Flicker",
    type: ControlType.Object,
    hidden: (props) => props.contentType === "image" || !props.textEnterFlickerEnabled,
    controls: __spreadValues(__spreadValues(__spreadValues({}, enterTriggerFields), enterOnlyFields), textFlickerControls)
  },
  // ── Text: Hover Flicker ───────────────────────────────────────────────
  textHoverFlickerEnabled: {
    title: "Hover Flicker",
    type: ControlType.Boolean,
    defaultValue: true,
    enabledTitle: "On",
    disabledTitle: "Off",
    hidden: (props) => props.contentType === "image"
  },
  flickerHover: {
    title: "Hover Flicker",
    type: ControlType.Object,
    hidden: (props) => props.contentType === "image" || !props.textHoverFlickerEnabled,
    controls: textFlickerControls
  },
  // ── Image: Enter Flicker ──────────────────────────────────────────────
  imageEnterFlickerEnabled: {
    title: "Enter Flicker",
    type: ControlType.Boolean,
    defaultValue: true,
    enabledTitle: "On",
    disabledTitle: "Off",
    hidden: (props) => props.contentType !== "image"
  },
  flickerImage: {
    title: "Enter Flicker",
    type: ControlType.Object,
    hidden: (props) => props.contentType !== "image" || !props.imageEnterFlickerEnabled,
    controls: __spreadValues(__spreadValues(__spreadValues({}, enterTriggerFields), enterOnlyFields), imageFlickerControls)
  },
  // ── Image: Hover Flicker ──────────────────────────────────────────────
  imageHoverFlickerEnabled: {
    title: "Hover Flicker",
    type: ControlType.Boolean,
    defaultValue: false,
    enabledTitle: "On",
    disabledTitle: "Off",
    hidden: (props) => props.contentType !== "image"
  },
  flickerImageHover: {
    title: "Hover Flicker",
    type: ControlType.Object,
    hidden: (props) => props.contentType !== "image" || !props.imageHoverFlickerEnabled,
    controls: imageFlickerControls
  },
  tag: {
    title: "Tag",
    type: ControlType.Enum,
    defaultValue: "h1",
    options: ["h1", "h2", "h3", "h4", "h5", "h6", "p"],
    optionTitles: ["H1", "H2", "H3", "H4", "H5", "H6", "P"],
    hidden: (props) => props.contentType === "image"
  }
});
export {
  OutlineFillText as default
};
