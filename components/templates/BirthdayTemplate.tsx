"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Sparkles, Gift } from "lucide-react";
import confetti from "canvas-confetti";

interface BirthdayTemplateProps {
  data: {
    recipientName: string;
    message: string;
    from?: string; // Optional for now
  };
}

export default function BirthdayTemplate({ data }: BirthdayTemplateProps) {
  const [isOpen, setIsOpen] = useState(false);

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
          className="z-10 max-w-lg w-full p-8 md:p-12 mx-4 bg-white/60 backdrop-blur-xl rounded-[3rem] shadow-2xl border border-white/60 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="w-20 h-20 bg-linear-to-tr from-[#FFB7B2] to-[#FFDAC1] rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg"
          >
            <Sparkles className="text-white w-10 h-10" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-2 text-[#FF6F61]"
          >
            Happy Birthday!
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-2xl md:text-3xl font-semibold mb-8 text-[#4A4A4A]"
          >
            {data.recipientName}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-lg leading-relaxed text-[#7D7D7D] mb-8 font-body"
          >
            {data.message}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="text-sm text-gray-400 mt-8"
          >
            Sent with 💖 via WishPookie
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
