"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Sparkles, Heart, Star, Trophy } from "lucide-react";
import { getOccasionEmojis } from "@/lib/occasion-config";

interface PlayableWishTemplateProps {
  data: {
    recipientName: string;
    message: string;
    occasion?: string;
    gameTarget?: number; // hearts to collect (default 10)
    from?: string;
  };
}

interface FallingItem {
  id: number;
  x: number;
  emoji: string;
  speed: number;
  y: number;
  size: number;
  caught: boolean;
}

const DEFAULT_EMOJIS = [
  "💖",
  "💝",
  "💗",
  "✨",
  "⭐",
  "🌟",
  "💫",
  "🎀",
  "🎁",
  "💌",
];

export default function PlayableWishTemplate({
  data,
}: PlayableWishTemplateProps) {
  const target = data.gameTarget || 10;

  // Occasion-specific emojis for falling items
  const EMOJIS = useMemo(
    () => (data.occasion ? getOccasionEmojis(data.occasion) : DEFAULT_EMOJIS),
    [data.occasion],
  );

  const [gameState, setGameState] = useState<"intro" | "playing" | "won">(
    "intro",
  );
  const [score, setScore] = useState(0);
  const [items, setItems] = useState<FallingItem[]>([]);
  const [catchEffects, setCatchEffects] = useState<
    { id: number; x: number; y: number }[]
  >([]);
  const [combo, setCombo] = useState(0);

  const nextId = useRef(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);
  const lastSpawnRef = useRef(0);

  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setItems([]);
    setCombo(0);
  };

  // Spawn items
  const spawnItem = useCallback(() => {
    const item: FallingItem = {
      id: nextId.current++,
      x: 8 + Math.random() * 84,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      speed: 0.2 + Math.random() * 0.5,
      y: -8,
      size: 28 + Math.random() * 16,
      caught: false,
    };
    setItems((prev) => [...prev.slice(-20), item]); // Cap at 20 items
  }, []);

  // Game loop
  useEffect(() => {
    if (gameState !== "playing") return;

    const loop = (timestamp: number) => {
      // Spawn every ~600ms
      if (timestamp - lastSpawnRef.current > 600) {
        spawnItem();
        lastSpawnRef.current = timestamp;
      }

      // Move items down
      setItems((prev) =>
        prev
          .map((item) => ({
            ...item,
            y: item.y + item.speed,
          }))
          .filter((item) => item.y < 110 && !item.caught),
      );

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, [gameState, spawnItem]);

  // Catch an item
  const catchItem = useCallback(
    (item: FallingItem, clientX: number, clientY: number) => {
      if (item.caught) return;

      setItems((prev) => prev.filter((i) => i.id !== item.id));
      setScore((prev) => {
        const next = prev + 1;
        if (next >= target) {
          setGameState("won");
          cancelAnimationFrame(frameRef.current);
        }
        return next;
      });
      setCombo((prev) => prev + 1);

      // Burst effect
      const rect = gameAreaRef.current?.getBoundingClientRect();
      if (rect) {
        setCatchEffects((prev) => [
          ...prev.slice(-8),
          { id: Date.now(), x: clientX - rect.left, y: clientY - rect.top },
        ]);
      }

      // Reset combo after 1.5s of no catches
      setTimeout(() => setCombo(0), 1500);
    },
    [target],
  );

  const progress = Math.min((score / target) * 100, 100);

  /* ═══════ INTRO ═══════ */
  if (gameState === "intro") {
    return (
      <div className="fixed inset-0 bg-[#0f0326] text-white font-display overflow-hidden flex flex-col items-center justify-center p-8">
        {/* Background glow */}
        <div className="absolute w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(236,72,153,0.1)_0%,transparent_70%)]" />

        {/* Floating emojis */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl"
            style={{
              top: `${10 + Math.random() * 80}%`,
              left: `${5 + Math.random() * 90}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: Math.random() * 3,
              repeat: Infinity,
            }}
          >
            {EMOJIS[i % EMOJIS.length]}
          </motion.div>
        ))}

        {/* Game icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="w-28 h-28 rounded-3xl bg-linear-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-[0_0_60px_rgba(236,72,153,0.3)] mb-8 z-10"
        >
          <span className="text-5xl">🎮</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.5, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xs uppercase tracking-[0.35em] text-white/40 mb-3 z-10"
        >
          A playable wish for
        </motion.p>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-linear-to-r from-pink-200 via-purple-200 to-fuchsia-200 mb-4 z-10 text-center text-safe max-w-full px-4"
        >
          {data.recipientName}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.6, y: 0 }}
          transition={{ delay: 1 }}
          className="text-white/50 text-sm mb-10 z-10 text-center max-w-xs"
        >
          Catch{" "}
          <span className="text-pink-300 font-semibold">{target} hearts</span>{" "}
          to unlock your surprise
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.4, type: "spring" }}
          whileTap={{ scale: 0.95 }}
          onClick={startGame}
          className="px-10 py-4 rounded-2xl bg-linear-to-r from-pink-500 to-purple-600 text-white font-bold text-lg shadow-[0_8px_30px_rgba(236,72,153,0.4)] hover:shadow-[0_8px_40px_rgba(236,72,153,0.6)] transition-shadow z-10"
        >
          Play →
        </motion.button>
      </div>
    );
  }

  /* ═══════ WIN / REVEAL ═══════ */
  if (gameState === "won") {
    return (
      <div className="fixed inset-0 bg-[#0f0326] text-white font-display overflow-hidden flex flex-col items-center justify-center p-8">
        {/* Burst of emojis */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl"
            initial={{
              x: "50%",
              y: "50%",
              opacity: 1,
              scale: 0,
            }}
            animate={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              opacity: [1, 0],
              scale: [0, 1.5],
            }}
            transition={{ duration: 2, delay: i * 0.08 }}
          >
            {EMOJIS[i % EMOJIS.length]}
          </motion.div>
        ))}

        {/* Glow */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2 }}
          className="absolute w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(168,85,247,0.15)_0%,transparent_70%)]"
        />

        {/* Trophy */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", bounce: 0.45, delay: 0.5 }}
          className="w-24 h-24 rounded-full bg-linear-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-[0_0_60px_rgba(251,191,36,0.4)] mb-10 z-10"
        >
          <Trophy className="w-10 h-10 text-white" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1 }}
          className="text-xs uppercase tracking-[0.35em] text-white/40 mb-3 z-10"
        >
          You did it!
        </motion.p>

        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="text-4xl md:text-8xl font-bold bg-clip-text text-transparent bg-linear-to-r from-pink-100 via-purple-100 to-fuchsia-100 mb-6 md:mb-8 z-10 leading-tight text-center text-safe max-w-full"
        >
          {data.recipientName}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="max-w-xl z-10"
        >
          <p className="text-base md:text-2xl text-white/80 leading-relaxed text-center font-light text-safe">
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

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.25 }}
          transition={{ delay: 5 }}
          className="mt-14 text-[11px] uppercase tracking-[0.4em] text-white/20 z-10"
        >
          {score} hearts collected · Wish unlocked ✦
        </motion.p>
      </div>
    );
  }

  /* ═══════ PLAYING ═══════ */
  return (
    <div
      ref={gameAreaRef}
      className="fixed inset-0 bg-[#0f0326] text-white font-display overflow-hidden select-none touch-none"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(168,85,247,0.12)_0%,transparent_60%)]" />

      {/* ── HUD ── */}
      <div className="absolute top-0 inset-x-0 z-20 px-5 py-4 flex items-center justify-between">
        {/* Score */}
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-pink-400 fill-pink-400" />
          <span className="text-lg font-bold font-mono">
            {score}
            <span className="text-white/30 text-sm"> / {target}</span>
          </span>
        </div>

        {/* Combo */}
        <AnimatePresence>
          {combo > 2 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold"
            >
              🔥 x{combo}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Progress bar ── */}
      <div className="absolute top-16 inset-x-5 z-20">
        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-linear-to-r from-pink-500 to-purple-500 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", damping: 15 }}
          />
        </div>
      </div>

      {/* ── Falling items ── */}
      {items.map((item) => (
        <motion.button
          key={item.id}
          className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 active:scale-125 transition-transform"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            fontSize: item.size,
          }}
          onClick={(e) => catchItem(item, e.clientX, e.clientY)}
          onTouchStart={(e) => {
            const touch = e.touches[0];
            catchItem(item, touch.clientX, touch.clientY);
          }}
          whileHover={{ scale: 1.3 }}
        >
          {item.emoji}
        </motion.button>
      ))}

      {/* ── Catch burst effects ── */}
      <AnimatePresence>
        {catchEffects.map((effect) => (
          <motion.div
            key={effect.id}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onAnimationComplete={() =>
              setCatchEffects((prev) => prev.filter((e) => e.id !== effect.id))
            }
            className="absolute w-10 h-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-400/30 pointer-events-none z-30"
            style={{ left: effect.x, top: effect.y }}
          />
        ))}
      </AnimatePresence>

      {/* ── Bottom gradient fade ── */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-linear-to-t from-[#0f0326] to-transparent pointer-events-none" />

      {/* ── Bottom hint ── */}
      <motion.p
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute bottom-6 inset-x-0 text-center text-[11px] uppercase tracking-[0.3em] text-white/20 pointer-events-none z-20"
      >
        tap the falling hearts!
      </motion.p>
    </div>
  );
}
