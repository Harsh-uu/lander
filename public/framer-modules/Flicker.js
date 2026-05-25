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
function OutlineFillText(props) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u;
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
    flicker,
    flickerImage
  } = props;
  const isImage = (contentType != null ? contentType : "text") === "image";
  const animConfig = isImage ? flickerImage : flicker;
  const flickerCount = (_a = animConfig == null ? void 0 : animConfig.flickerCount) != null ? _a : 4;
  const ease = animConfig == null ? void 0 : animConfig.ease;
  const duration = (_b = ease == null ? void 0 : ease.duration) != null ? _b : 5;
  const easeCurve = (_c = ease == null ? void 0 : ease.ease) != null ? _c : "linear";
  const showStroke = !isImage && ((_d = flicker == null ? void 0 : flicker.showStroke) != null ? _d : true);
  const strokePosition = (_e = flicker == null ? void 0 : flicker.strokePosition) != null ? _e : "start";
  const strokeCount = (_f = flicker == null ? void 0 : flicker.strokeCount) != null ? _f : 1;
  const strokeColor = (_g = flicker == null ? void 0 : flicker.strokeColor) != null ? _g : "#ffffff";
  const strokeWidth = (_h = flicker == null ? void 0 : flicker.strokeWidth) != null ? _h : 1.5;
  const triggerMode = (_i = animConfig == null ? void 0 : animConfig.triggerMode) != null ? _i : "enter";
  const replay = (_j = animConfig == null ? void 0 : animConfig.replay) != null ? _j : "no";
  const amount = (_k = animConfig == null ? void 0 : animConfig.position) != null ? _k : "above";
  const restState = (_l = animConfig == null ? void 0 : animConfig.restState) != null ? _l : "filled";
  const delay = (_m = animConfig == null ? void 0 : animConfig.delay) != null ? _m : 0;
  const shakeEnabled = (_n = animConfig == null ? void 0 : animConfig.shakeEnabled) != null ? _n : false;
  const shakeWidth = (_o = animConfig == null ? void 0 : animConfig.shakeWidth) != null ? _o : 10;
  const shakeSpeed = (_p = animConfig == null ? void 0 : animConfig.shakeSpeed) != null ? _p : 10;
  const wordFlickerEnabled = isImage ? true : (_q = flicker == null ? void 0 : flicker.wordFlickerEnabled) != null ? _q : true;
  const letterFlickerEnabled = !isImage && ((_r = flicker == null ? void 0 : flicker.letterFlickerEnabled) != null ? _r : false);
  const letterFlickerMode = (_s = flicker == null ? void 0 : flicker.letterFlickerMode) != null ? _s : "stroke";
  const letterFlickerIntensity = (_t = flicker == null ? void 0 : flicker.letterFlickerIntensity) != null ? _t : 10;
  const letterFlickerOpacity = (_u = flicker == null ? void 0 : flicker.letterFlickerOpacity) != null ? _u : 30;
  const [currentPhase, setCurrentPhase] = useState(restState);
  const [moveX, setMoveX] = useState(0);
  const [flickerLetters, setFlickerLetters] = useState(/* @__PURE__ */ new Set());
  const timersRef = useRef([]);
  const elementRef = useRef(null);
  const hasPlayedRef = useRef(false);
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
  function generateTimings(count, totalMs, easeCurve2) {
    const slots = count;
    const fn = makeEaseFn(easeCurve2);
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
  function buildVisibleItems() {
    const sc = Math.min(strokeCount != null ? strokeCount : 1, flickerCount);
    if (!showStroke) {
      return Array(flickerCount).fill("filled");
    }
    const fillCount = Math.max(1, flickerCount - sc);
    const strokes = Array(sc).fill("outline");
    const pos = strokePosition != null ? strokePosition : "start";
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
  function runAnimation() {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setFlickerLetters(/* @__PURE__ */ new Set());
    if (!wordFlickerEnabled && !letterFlickerEnabled) return;
    const totalMs = duration * 1e3;
    const chars = (text != null ? text : "").split("");
    const nonSpaceIndices = chars.reduce((acc, c, i) => {
      if (c.trim() !== "") acc.push(i);
      return acc;
    }, []);
    const scheduleTicks = (windowStart, windowDuration) => {
      if (!letterFlickerEnabled || nonSpaceIndices.length === 0) return;
      const cycleDuration = Math.round(
        1e3 * Math.pow(50 / 1e3, (letterFlickerIntensity - 1) / 19)
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
    if (wordFlickerEnabled) {
      setCurrentPhase("invisible");
      setMoveX(0);
      const visibleItems = buildVisibleItems();
      const sequence = [];
      visibleItems.forEach((item) => {
        sequence.push("invisible");
        sequence.push(item);
      });
      const intervals = generateTimings(
        sequence.length,
        totalMs,
        easeCurve
      );
      const phaseSlots = [];
      let cursor = delay * 1e3;
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
          setCurrentPhase(restState);
          setMoveX(0);
          setFlickerLetters(/* @__PURE__ */ new Set());
        }, cursor)
      );
      if (shakeEnabled) {
        const flipMs = Math.round(
          500 * Math.pow(30 / 500, (shakeSpeed - 1) / 19)
        );
        const animStart = delay * 1e3;
        const animEnd = cursor;
        let flipCursor = animStart;
        let dir = 1;
        while (flipCursor < animEnd) {
          const t = flipCursor;
          const d = dir;
          timersRef.current.push(
            setTimeout(() => setMoveX(d * shakeWidth), t)
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
      scheduleTicks(delay * 1e3, totalMs);
    }
  }
  useEffect(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    hasPlayedRef.current = false;
    setFlickerLetters(/* @__PURE__ */ new Set());
    setCurrentPhase(restState);
    setMoveX(0);
  }, [
    delay,
    flickerCount,
    duration,
    easeCurve,
    strokeColor,
    fontColor,
    gradientStart,
    gradientEnd,
    gradientAngle,
    colorMode,
    strokeWidth,
    triggerMode,
    replay,
    amount,
    restState,
    shakeEnabled,
    shakeWidth,
    shakeSpeed,
    contentType,
    showStroke,
    strokePosition,
    strokeCount,
    wordFlickerEnabled,
    letterFlickerEnabled,
    letterFlickerMode,
    letterFlickerIntensity,
    letterFlickerOpacity
  ]);
  useEffect(() => {
    if (triggerMode !== "enter") return;
    if (!elementRef.current) return;
    const threshold = getThreshold();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!hasPlayedRef.current) {
              hasPlayedRef.current = true;
              runAnimation();
            }
          } else {
            if (replay === "yes") {
              hasPlayedRef.current = false;
              timersRef.current.forEach(clearTimeout);
              timersRef.current = [];
              setFlickerLetters(/* @__PURE__ */ new Set());
              setCurrentPhase(restState);
              setMoveX(0);
            }
          }
        });
      },
      { threshold }
    );
    observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [
    triggerMode,
    replay,
    amount,
    restState,
    delay,
    flickerCount,
    duration,
    easeCurve,
    strokeColor,
    fontColor,
    gradientStart,
    gradientEnd,
    gradientAngle,
    colorMode,
    strokeWidth,
    shakeEnabled,
    shakeWidth,
    shakeSpeed,
    showStroke,
    strokePosition,
    strokeCount,
    wordFlickerEnabled,
    letterFlickerEnabled,
    letterFlickerMode,
    letterFlickerIntensity,
    letterFlickerOpacity
  ]);
  const handleMouseEnter = () => {
    if (triggerMode !== "hover") return;
    runAnimation();
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
          WebkitTextStroke: `${strokeWidth}px ${strokeColor}`,
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
    cursor: triggerMode === "hover" ? "default" : void 0
  };
  const getFlickerLetterStyle = () => {
    if (letterFlickerMode === "stroke") {
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
        WebkitTextStroke: `${strokeWidth}px ${strokeColor}`,
        background: "none",
        WebkitBackgroundClip: "unset",
        backgroundClip: "unset"
      };
    }
    return { opacity: letterFlickerOpacity / 100 };
  };
  const renderText = () => {
    if (!letterFlickerEnabled || currentPhase !== "filled" && currentPhase !== "outline" || flickerLetters.size === 0) {
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
    defaultValue: "Flicker",
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
      variant: "Bold",
      letterSpacing: "-0.02em",
      lineHeight: "1em"
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
    defaultValue: "#ffffff",
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
  flicker: {
    title: "Flicker",
    type: ControlType.Object,
    hidden: (props) => props.contentType === "image",
    controls: {
      triggerMode: {
        title: "Trigger",
        type: ControlType.Enum,
        defaultValue: "enter",
        options: ["enter", "hover"],
        optionTitles: ["On Enter", "On Hover"],
        displaySegmentedControl: false
      },
      replay: {
        title: "Replay",
        type: ControlType.Enum,
        defaultValue: "no",
        options: ["yes", "no"],
        optionTitles: ["Yes", "No"],
        displaySegmentedControl: true,
        hidden: (props) => props.triggerMode !== "enter"
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
        hidden: (props) => props.triggerMode !== "enter"
      },
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
      },
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
      showStroke: {
        title: "Show Stroke",
        type: ControlType.Boolean,
        defaultValue: true,
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
        description: "Stroke count greater than flicker count will not be considered.",
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
        displayStepper: false,
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
        displayStepper: false,
        hidden: (props) => !props.wordFlickerEnabled || !props.shakeEnabled
      },
      letterFlickerEnabled: {
        title: "Letter Flicker",
        type: ControlType.Boolean,
        defaultValue: false,
        enabledTitle: "On",
        disabledTitle: "Off"
      },
      letterFlickerMode: {
        title: "Flicker Style",
        type: ControlType.Enum,
        defaultValue: "stroke",
        options: ["stroke", "opacity"],
        optionTitles: ["Stroke", "Opacity"],
        displaySegmentedControl: false,
        hidden: (props) => !props.letterFlickerEnabled
      },
      letterFlickerOpacity: {
        title: "Opacity",
        type: ControlType.Number,
        defaultValue: 30,
        min: 0,
        max: 100,
        step: 1,
        displayStepper: false,
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
        displayStepper: false,
        hidden: (props) => !props.letterFlickerEnabled
      }
    }
  },
  flickerImage: {
    title: "Flicker",
    type: ControlType.Object,
    hidden: (props) => props.contentType !== "image",
    controls: {
      triggerMode: {
        title: "Trigger",
        type: ControlType.Enum,
        defaultValue: "enter",
        options: ["enter", "hover"],
        optionTitles: ["On Enter", "On Hover"],
        displaySegmentedControl: false
      },
      replay: {
        title: "Replay",
        type: ControlType.Enum,
        defaultValue: "no",
        options: ["yes", "no"],
        optionTitles: ["Yes", "No"],
        displaySegmentedControl: true,
        hidden: (props) => props.triggerMode !== "enter"
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
        hidden: (props) => props.triggerMode !== "enter"
      },
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
      },
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
        displayStepper: false,
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
        displayStepper: false,
        hidden: (props) => !props.shakeEnabled
      }
    }
  },
  tag: {
    title: "Tag",
    type: ControlType.Enum,
    defaultValue: "h1",
    options: ["h1", "h2", "h3", "h4", "h5", "h6", "p"],
    optionTitles: ["H1", "H2", "H3", "H4", "H5", "H6", "P"],
    displaySegmentedControl: false,
    hidden: (props) => props.contentType === "image"
  }
});
export {
  OutlineFillText as default
};
