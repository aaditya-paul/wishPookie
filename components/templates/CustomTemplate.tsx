"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { Sparkles, Wand2 } from "lucide-react";
import { getOccasionConfig } from "@/lib/occasion-config";

interface CustomTemplateProps {
  data: {
    recipientName: string;
    message: string;
    occasion?: string;
    customThemePrompt?: string;
    from?: string;
  };
}

export default function CustomTemplate({ data }: CustomTemplateProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [emojiRain, setEmojiRain] = useState(false);

  const occasionConfig = useMemo(
    () => getOccasionConfig(data.occasion || "custom"),
    [data.occasion],
  );

  const handleReveal = () => {
    setIsOpen(true);
    setEmojiRain(true);
    setTimeout(() => setEmojiRain(false), 3000);
  };

  // Dynamic gradient based on occasion
  const bgGradient =
    data.occasion === "birthday"
      ? "from-pink-400 via-rose-400 to-amber-400"
      : data.occasion === "anniversary"
        ? "from-rose-500 via-pink-500 to-purple-600"
        : data.occasion === "wedding"
          ? "from-amber-300 via-rose-300 to-pink-400"
          : "from-indigo-500 via-purple-500 to-pink-500";

  return (
    <div
      className={`min-h-screen bg-linear-to-br ${bgGradient} flex items-center justify-center relative overflow-hidden font-display text-white`}
    >
      {/* Background Animation */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>

      {/* Emoji Rain Easter Egg */}
      <AnimatePresence>
        {emojiRain && (
          <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
            {Array.from({ length: 25 }).map((_, i) => (
              <motion.span
                key={i}
                className="absolute text-2xl select-none"
                style={{
                  left: `${Math.random() * 95}%`,
                  top: "-30px",
                }}
                initial={{ y: -30, opacity: 1, rotate: 0 }}
                animate={{
                  y: "110vh",
                  opacity: [1, 1, 0.5, 0],
                  rotate: 360 + Math.random() * 360,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 2.5 + Math.random() * 2,
                  delay: i * 0.08,
                  ease: "easeIn",
                }}
              >
                {occasionConfig.emojis[i % occasionConfig.emojis.length]}
              </motion.span>
            ))}
          </div>
        )}
      </AnimatePresence>

      {!isOpen ? (
        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReveal}
          className="z-10 bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-full shadow-2xl flex flex-col items-center gap-4 transition-all hover:bg-white/20"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Wand2 className="w-16 h-16 text-yellow-300" />
          </motion.div>
          <span className="text-xl font-bold tracking-widest uppercase">
            Reveal the Magic
          </span>
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="z-10 max-w-2xl w-full p-10 md:p-12 m-4 bg-black/30 backdrop-blur-xl rounded-4xl border border-white/10 text-center shadow-2xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-flex items-center justify-center p-4 bg-linear-to-br from-yellow-400 to-orange-500 rounded-full mb-6 shadow-lg"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-linear-to-r from-yellow-200 to-pink-200 text-safe"
          >
            For {data.recipientName}
          </motion.h1>

          {data.customThemePrompt && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="my-8 p-6 bg-white/5 rounded-2xl border border-white/5"
            >
              <p className="text-xs uppercase tracking-widest text-white/50 mb-2">
                The Vibe
              </p>
              <p className="text-lg italic text-yellow-100/90 text-safe">
                &ldquo;{data.customThemePrompt}&rdquo;
              </p>
            </motion.div>
          )}

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-xl md:text-2xl leading-relaxed text-white/90 font-light text-safe"
          >
            {data.message}
          </motion.p>

          {/* Occasion-specific footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-sm text-white/30 mt-10"
          >
            {occasionConfig.microcopy.footer}
          </motion.p>
        </motion.div>
      )}
    </div>
  );
}
