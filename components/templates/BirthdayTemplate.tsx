"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { Sparkles, Gift } from "lucide-react";
import confetti from "canvas-confetti";

interface BirthdayTemplateProps {
  data: {
    recipientName: string;
    message: string;
    from?: string;
  };
}

export default function BirthdayTemplate({ data }: BirthdayTemplateProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [candleLit, setCandleLit] = useState(true);
  const [showSmoke, setShowSmoke] = useState(false);
  const [wishMade, setWishMade] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) =>
        Math.random() * (max - min) + min;

      const interval: any = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const blowCandle = useCallback(() => {
    setCandleLit(false);
    setShowSmoke(true);
    setTimeout(() => {
      setWishMade(true);
      // Second confetti wave for the wish!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#FFB7B2", "#FFDAC1", "#FF6F61", "#ffe66d", "#fff"],
      });
    }, 800);
    setTimeout(() => setShowSmoke(false), 2000);
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF0F5] flex items-center justify-center relative overflow-hidden font-display text-[#5D5D5D]">
      {/* Background Balls */}
      <motion.div
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-20 w-32 h-32 bg-[#FFB7B2]/40 rounded-full blur-2xl"
      />
      <motion.div
        animate={{ y: [0, 30, 0], x: [0, -20, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 right-20 w-48 h-48 bg-[#A0E7E5]/40 rounded-full blur-3xl"
      />

      {/* Floating birthday emojis */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {["🎈", "🎂", "🎉", "🥳", "🎁"].map((emoji, i) => (
          <span
            key={i}
            className="absolute text-2xl select-none"
            style={{
              left: `${10 + i * 18}%`,
              bottom: "-20px",
              animation: `emoji-float ${14 + i * 2}s linear ${i * 2}s infinite`,
              opacity: 0.4,
            }}
          >
            {emoji}
          </span>
        ))}
      </div>

      {!isOpen ? (
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="z-10 flex flex-col items-center gap-4 group"
        >
          <div className="w-32 h-32 bg-white rounded-3xl shadow-xl flex items-center justify-center text-4xl shadow-pink-200/50 group-hover:shadow-pink-300/60 transition-all">
            🎁
          </div>
          <span className="text-xl font-medium text-[#FFB7B2] bg-white/50 px-6 py-2 rounded-full backdrop-blur-sm">
            Tap to open
          </span>
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="z-10 max-w-md md:max-w-lg w-full p-6 md:p-12 mx-4 bg-white/60 backdrop-blur-xl rounded-4xl md:rounded-[3rem] shadow-2xl border border-white/60 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="w-16 h-16 md:w-20 md:h-20 bg-linear-to-tr from-[#FFB7B2] to-[#FFDAC1] rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg"
          >
            <Sparkles className="text-white w-8 h-8 md:w-10 md:h-10" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-3xl md:text-5xl font-bold mb-2 text-[#FF6F61] text-safe"
          >
            Happy Birthday!
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-2xl md:text-3xl font-semibold mb-8 text-[#4A4A4A] text-safe max-w-full overflow-hidden"
          >
            {data.recipientName}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-base md:text-lg leading-relaxed text-[#7D7D7D] mb-8 font-body text-safe"
          >
            {data.message}
          </motion.p>

          {/* 🕯️ Candle Easter Egg */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="relative flex flex-col items-center gap-2 mb-6"
          >
            {!wishMade ? (
              <>
                <button
                  onClick={blowCandle}
                  disabled={!candleLit}
                  className="relative group cursor-pointer transition-all hover:scale-105 active:scale-95"
                  title="Blow the candle to make a wish!"
                >
                  <div className="text-5xl relative">
                    🎂
                    {/* Flame */}
                    <AnimatePresence>
                      {candleLit && (
                        <motion.span
                          className="absolute -top-3 left-1/2 -translate-x-1/2 text-xl"
                          style={{
                            animation: "candle-flicker 1s ease-in-out infinite",
                          }}
                          exit={{
                            scale: [1, 1.5, 0],
                            opacity: [1, 0.5, 0],
                            transition: { duration: 0.5 },
                          }}
                        >
                          🔥
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {/* Smoke */}
                    <AnimatePresence>
                      {showSmoke && (
                        <motion.span
                          className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm"
                          initial={{ opacity: 0, y: 0, scale: 0.5 }}
                          animate={{ opacity: [0, 0.7, 0], y: -30, scale: 1.5 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1.5 }}
                        >
                          💨
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </button>
                <p className="text-xs text-[#FFB7B2] font-medium mt-1">
                  {candleLit ? "Tap the cake to blow the candle 🕯️" : "Whoosh…"}
                </p>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring" }}
                className="bg-linear-to-r from-pink-100 to-amber-100 px-6 py-3 rounded-2xl border border-pink-200/50"
              >
                <p className="text-base font-medium text-[#FF6F61]">
                  Wish made! ✨🌠
                </p>
                <p className="text-xs text-[#FFB7B2] mt-1">
                  (We won't tell anyone what you wished for)
                </p>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="text-sm text-gray-400 mt-4"
          >
            Sent with 💖 via Rizzlet
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
