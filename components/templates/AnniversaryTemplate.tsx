"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Heart, Stars } from "lucide-react";

interface AnniversaryTemplateProps {
  data: {
    recipientName: string;
    message: string;
    from?: string;
  };
}

export default function AnniversaryTemplate({
  data,
}: AnniversaryTemplateProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Generate random hearts for background
  const hearts = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="min-h-screen bg-linear-to-br from-[#1A1A2E] via-[#16213E] to-[#0F3460] flex items-center justify-center relative overflow-hidden font-display text-white">
      {/* Background Floating Hearts */}
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          initial={{ y: "110vh", x: `${heart.x}vw`, opacity: 0 }}
          animate={{ y: "-10vh", opacity: [0, 0.5, 0] }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute text-pink-500/20"
        >
          <Heart size={Math.random() * 30 + 10} fill="currentColor" />
        </motion.div>
      ))}

      {!isOpen ? (
        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 30px rgba(233, 69, 96, 0.4)",
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="z-10 bg-white/5 backdrop-blur-lg border border-pink-500/30 p-8 rounded-full shadow-2xl flex flex-col items-center gap-4 transition-all"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Heart className="w-16 h-16 text-pink-500" fill="currentColor" />
          </motion.div>
          <span className="text-xl font-light tracking-widest uppercase text-pink-200">
            Open with Love
          </span>
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="z-10 max-w-2xl w-full p-10 md:p-16 text-center space-y-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative inline-block"
          >
            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-linear-to-r from-pink-400 to-purple-600 pb-2">
              Happy Anniversary
            </h1>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, delay: 1 }}
              className="h-1 bg-pink-500/50 absolute bottom-0 left-0"
            />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="text-3xl md:text-4xl font-light text-pink-100/90"
          >
            Dearest {data.recipientName},
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 1 }}
            className="relative p-8 rounded-4xl bg-white/5 backdrop-blur-md border border-white/10"
          >
            <Stars className="absolute top-4 left-4 text-yellow-200/50 w-6 h-6" />
            <p className="text-xl leading-8 text-indigo-100 font-light italic">
              "{data.message}"
            </p>
            <Stars className="absolute bottom-4 right-4 text-yellow-200/50 w-6 h-6" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4 }}
            className="pt-8"
          >
            <p className="text-sm text-pink-300/50 uppercase tracking-widest">
              Forever & Always
            </p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
