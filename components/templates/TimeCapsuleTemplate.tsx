"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { Lock, Unlock, Sparkles, Clock } from "lucide-react";

interface TimeCapsuleTemplateProps {
  data: {
    recipientName: string;
    message: string;
    unlockDate?: string; // ISO string
    teaserMessage?: string;
    from?: string;
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function TimeCapsuleTemplate({
  data,
}: TimeCapsuleTemplateProps) {
  const unlockTime = data.unlockDate
    ? new Date(data.unlockDate).getTime()
    : Date.now() - 1000; // Default: already unlocked

  const [now, setNow] = useState(Date.now());
  const [vaultOpening, setVaultOpening] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  const isUnlocked = now >= unlockTime;

  useEffect(() => {
    if (isUnlocked) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [isUnlocked]);

  // When unlock time arrives, trigger the vault animation
  useEffect(() => {
    if (isUnlocked && !vaultOpening && !isRevealed) {
      setVaultOpening(true);
      setTimeout(() => {
        setVaultOpening(false);
        setIsRevealed(true);
      }, 3500);
    }
  }, [isUnlocked, vaultOpening, isRevealed]);

  const remaining = Math.max(0, unlockTime - now);
  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((remaining / (1000 * 60)) % 60);
  const seconds = Math.floor((remaining / 1000) % 60);

  const teaser = data.teaserMessage || "Something special is waiting for you…";

  // Decorative particles
  const particles = useMemo(
    () =>
      Array.from({ length: 40 }).map((_, i) => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        delay: Math.random() * 5,
        dur: Math.random() * 3 + 3,
      })),
    [],
  );

  /* ═══════ LOCKED STATE ═══════ */
  if (!isUnlocked) {
    return (
      <div className="fixed inset-0 bg-[#0c0a09] text-white font-display overflow-hidden flex flex-col items-center justify-center">
        {/* Subtle warm particles */}
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-amber-400/30"
            style={{
              top: `${p.y}%`,
              left: `${p.x}%`,
              width: p.size,
              height: p.size,
            }}
            animate={{ opacity: [0.1, 0.4, 0.1] }}
            transition={{ duration: p.dur, delay: p.delay, repeat: Infinity }}
          />
        ))}

        {/* Radial glow behind vault */}
        <div className="absolute w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(251,191,36,0.08)_0%,transparent_70%)]" />

        {/* Vault Door Icon */}
        <motion.div
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="relative mb-12"
        >
          {/* Outer ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="w-40 h-40 md:w-52 md:h-52 rounded-full border-2 border-dashed border-amber-500/20 flex items-center justify-center"
          >
            {/* Inner circle */}
            <div className="w-20 h-20 md:w-36 md:h-36 rounded-full bg-linear-to-br from-amber-900/40 to-stone-900/60 border border-amber-500/30 flex items-center justify-center shadow-[0_0_40px_rgba(251,191,36,0.1)]">
              <Lock className="w-8 h-8 md:w-14 md:h-14 text-amber-400/70" />
            </div>
          </motion.div>
          {/* Subtle pulsing glow */}
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-amber-500/5 blur-xl -z-10"
          />
        </motion.div>

        {/* Teaser */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-white/50 text-sm md:text-base text-center max-w-sm mb-8 px-6 leading-relaxed text-safe"
        >
          {teaser}
        </motion.p>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-3 md:gap-5"
        >
          {[
            { label: "days", value: days },
            { label: "hrs", value: hours },
            { label: "min", value: minutes },
            { label: "sec", value: seconds },
          ].map((unit) => (
            <div key={unit.label} className="flex flex-col items-center">
              <div className="w-14 h-14 md:w-20 md:h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-sm">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={unit.value}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 10, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-2xl md:text-3xl font-bold text-amber-100 font-mono"
                  >
                    {pad(unit.value)}
                  </motion.span>
                </AnimatePresence>
              </div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-white/25 mt-2">
                {unit.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* For line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 1.5 }}
          className="mt-10 text-[11px] uppercase tracking-[0.35em] text-white/20"
        >
          For {data.recipientName}
        </motion.p>
      </div>
    );
  }

  /* ═══════ VAULT OPENING ANIMATION ═══════ */
  if (vaultOpening) {
    return (
      <div className="fixed inset-0 bg-[#0c0a09] text-white font-display overflow-hidden flex items-center justify-center">
        {/* Flash of light */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0.8, 0], scale: [0, 1.5, 2, 3] }}
          transition={{ duration: 3.5, times: [0, 0.3, 0.6, 1] }}
          className="absolute w-40 h-40 rounded-full bg-amber-400/40 blur-3xl"
        />

        {/* Vault door splits open */}
        <div className="relative w-40 h-40 md:w-64 md:h-64">
          {/* Left half */}
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: "-120%", opacity: 0 }}
            transition={{ duration: 1.8, delay: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 w-1/2 overflow-hidden"
          >
            <div className="w-40 h-40 md:w-64 md:h-64 rounded-full bg-linear-to-br from-amber-900/50 to-stone-900/60 border border-amber-500/30 flex items-center justify-center">
              <Lock className="w-8 h-8 md:w-12 md:h-12 text-amber-400/50" />
            </div>
          </motion.div>
          {/* Right half */}
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: "120%", opacity: 0 }}
            transition={{ duration: 1.8, delay: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 left-1/2 w-1/2 overflow-hidden"
          >
            <div className="w-40 h-40 md:w-64 md:h-64 rounded-full bg-linear-to-br from-amber-900/50 to-stone-900/60 border border-amber-500/30 -ml-[100%]" />
          </motion.div>

          {/* Center reveal glow */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1, 8], opacity: [0, 1, 0] }}
            transition={{ duration: 2.5, delay: 1.5 }}
            className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-amber-300"
          />
        </div>

        {/* Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 3, delay: 0.3 }}
          className="absolute bottom-20 text-sm uppercase tracking-[0.35em] text-amber-200/50"
        >
          Unlocking…
        </motion.p>
      </div>
    );
  }

  /* ═══════ REVEALED STATE ═══════ */
  return (
    <div className="fixed inset-0 bg-[#0c0a09] text-white font-display overflow-hidden flex flex-col items-center justify-center p-8">
      {/* Warm ambient particles */}
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-amber-300/20"
          style={{
            top: `${p.y}%`,
            left: `${p.x}%`,
            width: p.size * 1.5,
            height: p.size * 1.5,
          }}
          animate={{ opacity: [0.05, 0.3, 0.05] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity }}
        />
      ))}

      {/* Radial glow */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2 }}
        className="absolute w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(251,191,36,0.1)_0%,transparent_70%)]"
      />

      {/* Unlocked icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", bounce: 0.45, delay: 0.3 }}
        className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-[0_0_60px_rgba(251,191,36,0.3)] mb-8 md:mb-10 z-10"
      >
        <Unlock className="w-8 h-8 md:w-10 md:h-10 text-white" />
      </motion.div>

      {/* Name */}
      <motion.h1
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="text-4xl md:text-8xl font-bold bg-clip-text text-transparent bg-linear-to-r from-amber-100 via-yellow-100 to-orange-100 mb-6 md:mb-8 z-10 leading-tight text-center text-safe max-w-full"
      >
        {data.recipientName}
      </motion.h1>

      {/* Message — word by word */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="max-w-xl z-10"
      >
        <p className="text-base md:text-2xl text-white/80 leading-relaxed text-center font-light text-safe">
          {data.message.split(" ").map((word, wi) => (
            <motion.span
              key={wi}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 + wi * 0.08 }}
              className="inline-block mr-[0.3em]"
            >
              {word}
            </motion.span>
          ))}
        </p>
      </motion.div>

      {/* From line */}
      {data.from && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 4 }}
          className="mt-8 text-sm text-white/40 z-10"
        >
          — {data.from}
        </motion.p>
      )}

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ delay: 5 }}
        className="mt-14 text-[11px] uppercase tracking-[0.4em] text-white/20 z-10"
      >
        Your time capsule has been opened ✦
      </motion.p>
    </div>
  );
}
