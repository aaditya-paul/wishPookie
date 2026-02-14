"use client";

import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useState, useCallback, useMemo } from "react";
import { Play, Pause, SkipForward, SkipBack, Music, Heart } from "lucide-react";

interface SoundtrackTemplateProps {
  data: {
    recipientName: string;
    message: string;
    tracks?: string[];
    from?: string;
  };
}

const TRACK_GRADIENTS = [
  "from-emerald-500 to-green-600",
  "from-fuchsia-500 to-pink-600",
  "from-amber-400 to-orange-500",
  "from-cyan-400 to-blue-500",
  "from-violet-500 to-purple-600",
  "from-rose-400 to-red-500",
  "from-teal-400 to-emerald-500",
  "from-indigo-400 to-blue-600",
  "from-pink-400 to-rose-500",
  "from-lime-400 to-green-500",
];

const VISUALIZER_BARS = 24;

export default function SoundtrackTemplate({ data }: SoundtrackTemplateProps) {
  const tracks =
    data.tracks && data.tracks.length > 0
      ? data.tracks
      : ["Track 1", "Track 2", "Track 3"];

  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showFinale, setShowFinale] = useState(false);
  const [liked, setLiked] = useState<Set<number>>(new Set());

  // Mouse parallax for album art
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const rotX = useTransform(mouseY, [0, 1], [4, -4]);
  const rotY = useTransform(mouseX, [0, 1], [-4, 4]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    },
    [mouseX, mouseY],
  );

  const nextTrack = () => {
    if (currentTrack < tracks.length - 1) {
      setCurrentTrack((p) => p + 1);
    } else {
      setShowFinale(true);
    }
  };

  const prevTrack = () => {
    if (currentTrack > 0) setCurrentTrack((p) => p - 1);
  };

  const toggleLike = (i: number) => {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  // Randomized visualizer heights
  const bars = useMemo(
    () =>
      Array.from({ length: VISUALIZER_BARS }).map(() => ({
        height: Math.random() * 60 + 10,
        delay: Math.random() * 0.5,
      })),
    [],
  );

  const gradient = TRACK_GRADIENTS[currentTrack % TRACK_GRADIENTS.length];
  const progress = ((currentTrack + 1) / tracks.length) * 100;

  if (showFinale) {
    return (
      <div
        className="fixed inset-0 bg-black flex flex-col items-center justify-center p-8 text-white font-display"
        onMouseMove={handleMouseMove}
      >
        {/* Background pulse */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2 }}
          className="absolute w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.15)_0%,transparent_70%)]"
        />

        {/* Album cover — final */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotateY: 180 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          transition={{ type: "spring", bounce: 0.4, delay: 0.3 }}
          className="w-48 h-48 md:w-64 md:h-64 rounded-3xl bg-linear-to-br from-green-400 via-emerald-500 to-teal-600 shadow-[0_0_80px_rgba(34,197,94,0.3)] flex items-center justify-center mb-10 z-10"
        >
          <Music className="w-20 h-20 text-white/80" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.5, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-xs uppercase tracking-[0.4em] text-white/40 mb-3 z-10"
        >
          A soundtrack made for
        </motion.p>

        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="text-5xl md:text-8xl font-bold bg-clip-text text-transparent bg-linear-to-r from-green-200 via-emerald-100 to-teal-200 mb-8 z-10 leading-tight text-center"
        >
          {data.recipientName}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="max-w-lg z-10"
        >
          <p className="text-lg md:text-xl text-white/70 leading-relaxed text-center font-light">
            {data.message.split(" ").map((word, wi) => (
              <motion.span
                key={wi}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 + wi * 0.07 }}
                className="inline-block mr-[0.3em]"
              >
                {word}
              </motion.span>
            ))}
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 5 }}
          className="mt-14 text-[11px] uppercase tracking-[0.4em] text-white/25 z-10"
        >
          {tracks.length} tracks · Your story on repeat ♪
        </motion.p>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-[#0a0a0a] text-white font-display select-none overflow-hidden flex flex-col"
      onMouseMove={handleMouseMove}
    >
      {/* ── Background gradient that shifts per track ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTrack}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className={`absolute inset-0 bg-linear-to-b ${gradient} opacity-[0.08]`}
        />
      </AnimatePresence>

      {/* ── Subtle noise texture ── */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')]" />

      {/* ═══════════ TOP BAR ═══════════ */}
      <div className="relative z-10 flex items-center justify-between px-6 py-4">
        <div className="text-xs uppercase tracking-[0.25em] text-white/30">
          {data.recipientName}&apos;s soundtrack
        </div>
        <div className="text-xs text-white/30 font-mono">
          {currentTrack + 1} / {tracks.length}
        </div>
      </div>

      {/* ═══════════ MAIN CONTENT ═══════════ */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        {/* Album Cover */}
        <motion.div
          style={{ rotateX: rotX, rotateY: rotY }}
          className="perspective-1000 mb-10"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTrack}
              initial={{ scale: 0.85, opacity: 0, rotateY: -30 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.85, opacity: 0, rotateY: 30 }}
              transition={{ type: "spring", damping: 20 }}
              className={`w-64 h-64 md:w-80 md:h-80 rounded-2xl bg-linear-to-br ${gradient} shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center p-6 relative overflow-hidden`}
            >
              {/* Disc lines */}
              <div className="absolute inset-0 flex items-center justify-center">
                {[1, 2, 3, 4].map((r) => (
                  <div
                    key={r}
                    className="absolute rounded-full border border-white/10"
                    style={{ width: `${r * 25}%`, height: `${r * 25}%` }}
                  />
                ))}
              </div>

              {/* Track number */}
              <div className="relative z-10 text-white/30 text-sm uppercase tracking-[0.3em] mb-2">
                Track {currentTrack + 1}
              </div>
              <div className="relative z-10 text-white font-bold text-xl md:text-2xl text-center leading-snug px-4">
                {tracks[currentTrack]}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Track Title (below album) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTrack}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-1">
              {tracks[currentTrack]}
            </h2>
            <p className="text-white/40 text-sm">ft. {data.recipientName}</p>
          </motion.div>
        </AnimatePresence>

        {/* ── Audio Visualizer ── */}
        <div className="flex items-end gap-[3px] h-16 mb-8">
          {bars.map((bar, i) => (
            <motion.div
              key={i}
              className={`w-[3px] rounded-full bg-linear-to-t ${gradient}`}
              animate={
                isPlaying
                  ? {
                      height: [
                        bar.height * 0.3,
                        bar.height,
                        bar.height * 0.5,
                        bar.height * 0.8,
                        bar.height * 0.3,
                      ],
                    }
                  : { height: 4 }
              }
              transition={
                isPlaying
                  ? {
                      duration: 0.8 + Math.random() * 0.4,
                      repeat: Infinity,
                      delay: bar.delay,
                      ease: "easeInOut",
                    }
                  : { duration: 0.3 }
              }
            />
          ))}
        </div>

        {/* ── Progress Bar ── */}
        <div className="w-full max-w-sm mb-6">
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-linear-to-r ${gradient} rounded-full`}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between mt-1.5 text-[10px] text-white/25 font-mono">
            <span>0:00</span>
            <span>3:45</span>
          </div>
        </div>

        {/* ── Controls ── */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => toggleLike(currentTrack)}
            className="transition-transform hover:scale-110 active:scale-95"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                liked.has(currentTrack)
                  ? "text-green-400 fill-green-400"
                  : "text-white/30"
              }`}
            />
          </button>
          <button
            onClick={prevTrack}
            disabled={currentTrack === 0}
            className="text-white/50 hover:text-white transition-colors disabled:opacity-20"
          >
            <SkipBack className="w-6 h-6" />
          </button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsPlaying(!isPlaying)}
            className={`w-14 h-14 rounded-full bg-linear-to-br ${gradient} flex items-center justify-center shadow-lg`}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white ml-0.5" />
            )}
          </motion.button>
          <button
            onClick={nextTrack}
            className="text-white/50 hover:text-white transition-colors"
          >
            <SkipForward className="w-6 h-6" />
          </button>
          <div className="w-5" /> {/* Spacer for symmetry */}
        </div>
      </div>

      {/* ═══════════ TRACK LIST (bottom drawer) ═══════════ */}
      <div className="relative z-10 px-6 pb-6">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 max-h-[180px] overflow-y-auto custom-scrollbar">
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/25 mb-3">
            Up Next
          </p>
          {tracks.map((track, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentTrack(i);
                setIsPlaying(true);
              }}
              className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all text-left ${
                i === currentTrack ? "bg-white/10" : "hover:bg-white/5"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                  i === currentTrack
                    ? `bg-linear-to-br ${gradient} text-white`
                    : "bg-white/5 text-white/30"
                }`}
              >
                {i < currentTrack ? "✓" : i + 1}
              </div>
              <span
                className={`text-sm truncate ${
                  i === currentTrack
                    ? "text-white font-medium"
                    : "text-white/40"
                }`}
              >
                {track}
              </span>
              {i === currentTrack && isPlaying && (
                <div className="ml-auto flex items-end gap-[2px] h-3">
                  {[1, 2, 3].map((b) => (
                    <motion.div
                      key={b}
                      className="w-[2px] bg-green-400 rounded-full"
                      animate={{ height: [3, 12, 5, 10, 3] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: b * 0.1,
                      }}
                    />
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
