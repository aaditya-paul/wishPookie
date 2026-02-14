"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import { Play, ChevronDown } from "lucide-react";

interface FoundFootageTemplateProps {
  data: {
    recipientName: string;
    message: string;
    clips?: { caption: string; date?: string }[];
    from?: string;
  };
}

function formatVHSDate(dateStr?: string) {
  if (!dateStr) return "██/██/████";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function FoundFootageTemplate({
  data,
}: FoundFootageTemplateProps) {
  const clips =
    data.clips && data.clips.length > 0
      ? data.clips
      : [
          { caption: "A recovered memory…", date: "2020-01-01" },
          { caption: "Something we found…", date: "2021-06-15" },
          { caption: "The final tape…", date: "2023-12-25" },
        ];

  const [currentClip, setCurrentClip] = useState(0);
  const [showFinal, setShowFinal] = useState(false);
  const [isBooting, setIsBooting] = useState(true);

  // VHS boot sequence
  useEffect(() => {
    const t = setTimeout(() => setIsBooting(false), 2800);
    return () => clearTimeout(t);
  }, []);

  const nextClip = () => {
    if (currentClip < clips.length - 1) {
      setCurrentClip((p) => p + 1);
    } else {
      setShowFinal(true);
    }
  };

  // Scanline noise
  const scanlines = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, i) => ({
        y: Math.random() * 100,
        speed: 2 + Math.random() * 4,
        opacity: 0.03 + Math.random() * 0.05,
      })),
    [],
  );

  const clip = clips[currentClip];

  /* ═══════ VHS BOOT ═══════ */
  if (isBooting) {
    return (
      <div className="fixed inset-0 bg-black text-white font-mono overflow-hidden flex flex-col items-center justify-center">
        {/* Static noise overlay */}
        <div className="absolute inset-0 opacity-[0.04] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')]" />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0.3, 1] }}
          transition={{ duration: 1.5, times: [0, 0.2, 0.5, 0.6, 1] }}
          className="text-xs text-blue-300/80 mb-2"
        >
          ▶ PLAY
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.8, 0.4, 1] }}
          transition={{ duration: 2, delay: 0.5 }}
          className="text-center"
        >
          <p className="text-sm text-white/40 tracking-widest mb-1">
            RECOVERED FOOTAGE
          </p>
          <p className="text-lg text-white/70">
            <span className="text-amber-300/80">{data.recipientName}</span>
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0.2, 0.5] }}
          transition={{ duration: 1.5, delay: 1.5 }}
          className="mt-6 text-[10px] text-white/20 tracking-[0.3em]"
        >
          {clips.length} TAPE{clips.length > 1 ? "S" : ""} FOUND
        </motion.p>

        {/* Flicker line */}
        <motion.div
          animate={{ y: ["-100%", "200%"] }}
          transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 2 }}
          className="absolute w-full h-[2px] bg-white/10"
        />
      </div>
    );
  }

  /* ═══════ FINAL REVEAL ═══════ */
  if (showFinal) {
    return (
      <div className="fixed inset-0 bg-black text-white font-mono overflow-hidden flex flex-col items-center justify-center p-8">
        {/* Scanlines */}
        {scanlines.map((s, i) => (
          <motion.div
            key={i}
            className="absolute w-full h-[1px] bg-white pointer-events-none"
            style={{ opacity: s.opacity }}
            animate={{ y: [`${s.y}vh`, `${s.y + 100}vh`] }}
            transition={{ duration: s.speed, repeat: Infinity, ease: "linear" }}
          />
        ))}

        {/* Noise */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')]" />

        {/* VHS overlay top-left */}
        <div className="absolute top-5 left-5 z-20">
          <motion.p
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-[10px] text-red-400/60 font-mono"
          >
            ● REC
          </motion.p>
        </div>

        {/* Warm glow */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2 }}
          className="absolute w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(251,191,36,0.06)_0%,transparent_70%)]"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.5 }}
          className="text-xs text-amber-300/50 tracking-[0.35em] uppercase mb-6 z-10"
        >
          End of tape
        </motion.p>

        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="text-4xl md:text-7xl font-bold text-white/90 mb-8 z-10 text-center leading-tight font-display text-safe max-w-full"
        >
          {data.recipientName}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="max-w-lg z-10"
        >
          <p className="text-base md:text-xl text-white/60 leading-relaxed text-center text-safe">
            {data.message.split(" ").map((word, wi) => (
              <motion.span
                key={wi}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 + wi * 0.1 }}
                className="inline-block mr-[0.3em]"
              >
                {word}
              </motion.span>
            ))}
          </p>
        </motion.div>

        {data.from && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 4.5 }}
            className="mt-8 text-sm text-white/30 z-10"
          >
            — {data.from}
          </motion.p>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ delay: 5.5 }}
          className="mt-12 text-[10px] text-white/15 tracking-[0.3em] z-10 font-mono"
        >
          ■ STOP · {clips.length} TAPES RECOVERED
        </motion.p>
      </div>
    );
  }

  /* ═══════ TAPE PLAYBACK ═══════ */
  return (
    <div className="fixed inset-0 bg-black text-white font-mono overflow-hidden flex flex-col">
      {/* ── Scanlines ── */}
      {scanlines.map((s, i) => (
        <motion.div
          key={i}
          className="absolute w-full h-[1px] bg-white pointer-events-none z-30"
          style={{ opacity: s.opacity }}
          animate={{ y: [`${s.y}vh`, `${s.y + 100}vh`] }}
          transition={{ duration: s.speed, repeat: Infinity, ease: "linear" }}
        />
      ))}

      {/* ── Noise texture ── */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] z-20 pointer-events-none" />

      {/* ── Chromatic aberration edges ── */}
      <div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          boxShadow:
            "inset 0 0 60px rgba(0,0,0,0.6), inset 2px 0 0 rgba(255,0,0,0.05), inset -2px 0 0 rgba(0,0,255,0.05)",
        }}
      />

      {/* ── VHS HUD ── */}
      <div className="absolute top-0 inset-x-0 z-30 px-5 py-4 flex items-center justify-between">
        <div>
          <motion.p
            animate={{ opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-[10px] text-red-400/70"
          >
            ● REC
          </motion.p>
        </div>
        <p className="text-[10px] text-white/25 tracking-widest">
          TAPE {currentClip + 1}/{clips.length}
        </p>
        <p className="text-[10px] text-white/25 font-mono">
          {formatVHSDate(clip.date)}
        </p>
      </div>

      {/* ═══════ MAIN CONTENT ═══════ */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentClip}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-lg"
          >
            {/* Tape number */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 0.2 }}
              className="text-[10px] text-amber-300/50 tracking-[0.4em] uppercase mb-4"
            >
              Tape {currentClip + 1}
            </motion.p>

            {/* Date stamp */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 0.5, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-white/40 mb-6 tracking-wider"
            >
              {formatVHSDate(clip.date)}
            </motion.p>

            {/* The caption / memory */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="relative"
            >
              {/* Subtle glitch frame */}
              <div className="absolute -inset-4 border border-white/5 rounded-lg" />
              <p className="text-xl md:text-3xl text-white/80 leading-relaxed font-display font-light px-4 text-safe">
                &ldquo;{clip.caption}&rdquo;
              </p>
            </motion.div>

            {/* Timestamp bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 1 }}
              className="mt-8 flex items-center gap-2 justify-center"
            >
              <div className="w-2 h-2 bg-red-400/50 rounded-full" />
              <div className="w-32 h-[2px] bg-white/10 rounded relative overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-white/30 rounded"
                  animate={{
                    width: `${((currentClip + 1) / clips.length) * 100}%`,
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-[9px] text-white/20 font-mono">
                {String(Math.floor((currentClip + 1) * 3.45)).padStart(2, "0")}:
                {String(Math.floor(Math.random() * 59)).padStart(2, "0")}
              </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Bottom controls ── */}
      <div className="relative z-30 px-6 pb-8 flex flex-col items-center gap-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={nextClip}
          className="flex items-center gap-2 px-8 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm text-white/60"
        >
          {currentClip < clips.length - 1 ? (
            <>
              Next tape <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
            </>
          ) : (
            <>
              <Play className="w-4 h-4" /> Final message
            </>
          )}
        </motion.button>

        <p className="text-[9px] text-white/15 tracking-[0.25em] uppercase">
          {data.recipientName}&apos;s recovered footage
        </p>
      </div>

      {/* ── Occasional glitch flash ── */}
      <motion.div
        animate={{ opacity: [0, 0, 0.15, 0, 0, 0, 0.1, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute inset-0 bg-white pointer-events-none z-40"
      />
    </div>
  );
}
