"use client";

import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Sparkles } from "lucide-react";

interface ConstellationTemplateProps {
  data: {
    recipientName: string;
    message: string;
    memories?: string[];
    from?: string;
  };
}

interface StarNode {
  id: number;
  x: number;
  y: number;
  memory: string;
  isRevealed: boolean;
  size: number;
  glowColor: string;
}

// Deterministic-ish layout: a golden-angle spiral that fills the screen beautifully
function generateSpiralPositions(count: number) {
  const positions: { x: number; y: number }[] = [];
  const goldenAngle = 137.508; // degrees
  const maxRadius = Math.min(35, 12 + count * 2); // % of viewport, scales with count

  for (let i = 0; i < count; i++) {
    const angle = (i * goldenAngle * Math.PI) / 180;
    const radius = maxRadius * Math.sqrt((i + 1) / count);
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);
    positions.push({
      x: Math.max(8, Math.min(92, x)),
      y: Math.max(8, Math.min(92, y)),
    });
  }
  return positions;
}

const GLOW_PALETTES = [
  "rgba(167,139,250,0.6)", // violet
  "rgba(129,140,248,0.6)", // indigo
  "rgba(96,165,250,0.6)", // blue
  "rgba(56,189,248,0.5)", // sky
  "rgba(192,132,252,0.6)", // purple
  "rgba(244,114,182,0.5)", // pink
  "rgba(251,191,36,0.5)", // amber
];

export default function ConstellationTemplate({
  data,
}: ConstellationTemplateProps) {
  const memories =
    data.memories && data.memories.length > 0
      ? data.memories
      : [
          "A memory we shared…",
          "That time we laughed…",
          "Something beautiful…",
        ];

  // Mouse parallax
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const bgX = useTransform(mouseX, [0, 1], [2, -2]);
  const bgY = useTransform(mouseY, [0, 1], [2, -2]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    },
    [mouseX, mouseY],
  );

  // Center star data = the main message
  const centerStar = { x: 50, y: 50 };

  // Build star nodes once
  const positions = useMemo(
    () => generateSpiralPositions(memories.length),
    [memories.length],
  );

  const [stars, setStars] = useState<StarNode[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeMemory, setActiveMemory] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const nodes: StarNode[] = memories.map((m, i) => ({
      id: i,
      x: positions[i].x,
      y: positions[i].y,
      memory: m,
      isRevealed: false,
      size: 10 + Math.random() * 8,
      glowColor: GLOW_PALETTES[i % GLOW_PALETTES.length],
    }));
    setStars(nodes);
  }, [memories, positions]);

  // Dismiss intro after a few seconds
  useEffect(() => {
    const t = setTimeout(() => setShowIntro(false), 3500);
    return () => clearTimeout(t);
  }, []);

  const handleStarClick = (index: number) => {
    if (index !== currentIndex) return;
    setActiveMemory(index);

    const updated = [...stars];
    updated[index].isRevealed = true;
    setStars(updated);

    // Auto-advance after reading
    setTimeout(() => {
      setActiveMemory(null);
      if (index === stars.length - 1) {
        setTimeout(() => setIsComplete(true), 800);
      } else {
        setCurrentIndex(index + 1);
      }
    }, 2800);
  };

  /* ---------- BACKGROUND PARTICLES ---------- */
  const bgStars = useMemo(
    () =>
      Array.from({ length: 120 }).map((_, i) => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        r: Math.random() * 1.8 + 0.4,
        delay: Math.random() * 6,
        dur: Math.random() * 3 + 2,
      })),
    [],
  );

  /* ---------- RENDER ---------- */
  return (
    <div
      className="fixed inset-0 bg-[#070714] overflow-hidden font-display text-white select-none"
      onMouseMove={handleMouseMove}
    >
      {/* ── deep-space radial gradient ── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(30,27,75,0.55)_0%,rgba(7,7,20,1)_70%)]" />

      {/* ── parallax star field ── */}
      <motion.div className="absolute inset-0" style={{ x: bgX, y: bgY }}>
        {bgStars.map((s, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              top: `${s.y}%`,
              left: `${s.x}%`,
              width: s.r,
              height: s.r,
            }}
            animate={{ opacity: [0.15, 0.8, 0.15] }}
            transition={{
              duration: s.dur,
              delay: s.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>

      {/* ── Slow-moving nebula glows ── */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full opacity-[0.07] blur-3xl bg-purple-500"
        animate={{ x: ["-10%", "10%"], y: ["-5%", "5%"] }}
        transition={{ duration: 30, repeat: Infinity, repeatType: "reverse" }}
        style={{ top: "10%", left: "20%" }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full opacity-[0.06] blur-3xl bg-blue-400"
        animate={{ x: ["8%", "-8%"], y: ["5%", "-5%"] }}
        transition={{ duration: 25, repeat: Infinity, repeatType: "reverse" }}
        style={{ bottom: "15%", right: "15%" }}
      />

      {/* ═══════════════════════ INTRO OVERLAY ═══════════════════════ */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-6"
          >
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm uppercase tracking-[0.35em] text-white/40"
            >
              A constellation for
            </motion.p>
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-linear-to-r from-violet-200 via-pink-100 to-indigo-200 text-safe max-w-full"
            >
              {data.recipientName}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 2.2 }}
              className="text-xs uppercase tracking-[0.4em] text-white/30"
            >
              tap the stars to begin
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════ CONSTELLATION ═══════════════════════ */}
      <AnimatePresence>
        {!isComplete && !showIntro && (
          <motion.div
            key="constellation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.3 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            {/* ── SVG connection lines ── */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {stars.map((star, i) => {
                if (i === 0 || !star.isRevealed) return null;
                const prev = stars[i - 1];
                return (
                  <motion.line
                    key={`line-${i}`}
                    x1={`${prev.x}%`}
                    y1={`${prev.y}%`}
                    x2={`${star.x}%`}
                    y2={`${star.y}%`}
                    stroke="url(#lineGrad)"
                    strokeWidth="1.5"
                    filter="url(#glow)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                );
              })}

              {/* Line from last revealed star to center (when complete) */}
              {stars.length > 0 &&
                stars[stars.length - 1]?.isRevealed &&
                (() => {
                  const last = stars[stars.length - 1];
                  return (
                    <motion.line
                      x1={`${last.x}%`}
                      y1={`${last.y}%`}
                      x2={`${centerStar.x}%`}
                      y2={`${centerStar.y}%`}
                      stroke="rgba(255,255,255,0.15)"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                      filter="url(#glow)"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1 }}
                    />
                  );
                })()}

              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="rgba(167,139,250,0.7)" />
                  <stop offset="100%" stopColor="rgba(129,140,248,0.3)" />
                </linearGradient>
              </defs>
            </svg>

            {/* ── Interactive Stars ── */}
            {stars.map((star, i) => {
              const isNext = i === currentIndex;
              const isPast = star.isRevealed;
              const isActive = activeMemory === i;

              return (
                <div
                  key={star.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ top: `${star.y}%`, left: `${star.x}%` }}
                >
                  {/* Outer glow ring for next-clickable star */}
                  {isNext && (
                    <motion.div
                      className="absolute inset-0 -m-4 rounded-full"
                      style={{
                        background: `radial-gradient(circle, ${star.glowColor} 0%, transparent 70%)`,
                      }}
                      animate={{
                        scale: [1, 1.6, 1],
                        opacity: [0.4, 0.15, 0.4],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                  )}

                  {/* Star body */}
                  <motion.button
                    onClick={() => handleStarClick(i)}
                    disabled={!isNext}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: isActive ? 1.5 : 1,
                      opacity: isNext ? 1 : isPast ? 0.8 : 0.2,
                    }}
                    transition={{
                      delay: i * 0.08,
                      type: "spring",
                      stiffness: 200,
                    }}
                    className="relative z-10 flex items-center justify-center rounded-full transition-shadow duration-700"
                    style={{
                      width: star.size,
                      height: star.size,
                      background: isPast
                        ? `radial-gradient(circle, white 20%, ${star.glowColor} 100%)`
                        : isNext
                          ? `radial-gradient(circle, rgba(255,255,255,0.9) 10%, ${star.glowColor} 100%)`
                          : "rgba(255,255,255,0.15)",
                      boxShadow: isPast
                        ? `0 0 20px 4px ${star.glowColor}`
                        : isNext
                          ? `0 0 12px 2px ${star.glowColor}`
                          : "none",
                    }}
                  />

                  {/* Memory reveal pop-up */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.85 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.9 }}
                        transition={{ type: "spring", damping: 20 }}
                        className="absolute z-30 w-56 md:w-64 left-1/2 -translate-x-1/2"
                        style={{
                          top: star.y > 60 ? "auto" : star.size + 16,
                          bottom: star.y > 60 ? star.size + 16 : "auto",
                        }}
                      >
                        <div className="relative bg-white/8 backdrop-blur-xl border border-white/12 rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                          {/* Little notch */}
                          <div
                            className="absolute w-3 h-3 bg-white/8 border border-white/12 rotate-45"
                            style={
                              star.y > 60
                                ? {
                                    bottom: -6,
                                    left: "calc(50% - 6px)",
                                    borderTop: "none",
                                    borderLeft: "none",
                                  }
                                : {
                                    top: -6,
                                    left: "calc(50% - 6px)",
                                    borderBottom: "none",
                                    borderRight: "none",
                                  }
                            }
                          />
                          <p className="text-[13px] leading-relaxed text-white/90 text-center font-light text-safe">
                            {star.memory}
                          </p>
                          <p className="text-[10px] text-white/30 text-center mt-2 uppercase tracking-widest">
                            memory {i + 1} of {stars.length}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            {/* ── Floating helper CTA ── */}
            <div className="absolute bottom-8 inset-x-0 text-center pointer-events-none">
              <motion.p
                animate={{ opacity: [0.25, 0.5, 0.25] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="text-[11px] uppercase tracking-[0.3em] text-white/30"
              >
                {currentIndex < stars.length
                  ? `star ${currentIndex + 1} of ${stars.length} — tap the glowing star`
                  : ""}
              </motion.p>
            </div>

            {/* ── Progress ring (subtle) ── */}
            <div className="absolute top-6 right-6">
              <svg width="36" height="36" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="2"
                />
                <motion.circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="rgba(167,139,250,0.5)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 15}
                  animate={{
                    strokeDashoffset:
                      2 *
                      Math.PI *
                      15 *
                      (1 -
                        stars.filter((s) => s.isRevealed).length /
                          stars.length),
                  }}
                  transition={{ duration: 0.6 }}
                  style={{
                    transform: "rotate(-90deg)",
                    transformOrigin: "50% 50%",
                  }}
                />
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════ FINAL REVEAL ═══════════════════════ */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.5 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-40"
          >
            {/* Radial burst behind */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute w-[min(90vw,600px)] h-[min(90vw,600px)] rounded-full bg-[radial-gradient(circle,rgba(167,139,250,0.15)_0%,transparent_70%)]"
            />

            {/* Center orb */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.45, delay: 0.6 }}
              className="relative w-28 h-28 rounded-full flex items-center justify-center mb-10 z-10"
            >
              <div className="absolute inset-0 rounded-full bg-linear-to-br from-violet-500 via-purple-500 to-pink-500 shadow-[0_0_60px_rgba(168,85,247,0.5)]" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-4 rounded-full border border-dashed border-white/10"
              />
              <Sparkles className="w-12 h-12 text-white relative z-10" />
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="text-5xl md:text-8xl font-bold bg-clip-text text-transparent bg-linear-to-r from-violet-100 via-pink-100 to-indigo-100 mb-8 z-10 leading-tight text-safe max-w-full"
            >
              {data.recipientName}
            </motion.h1>

            {/* Message — word-by-word reveal */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="max-w-xl z-10"
            >
              <p className="text-lg md:text-2xl text-white/80 leading-relaxed font-light text-safe">
                {data.message.split(" ").map((word, wi) => (
                  <motion.span
                    key={wi}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2 + wi * 0.08 }}
                    className="inline-block mr-[0.3em]"
                  >
                    {word}
                  </motion.span>
                ))}
              </p>
            </motion.div>

            {/* Footer tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 4.5 }}
              className="mt-16 text-[11px] uppercase tracking-[0.4em] text-white/30 z-10"
            >
              Your constellation is complete ✦
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
