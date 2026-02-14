"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getOccasionConfig } from "@/lib/occasion-config";
import {
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Heart,
  Stars,
  Music,
  Hourglass,
  Gamepad2,
  Video,
} from "lucide-react";

export default function CreatePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    recipientName: "",
    occasion: "birthday",
    message: "",
    templateId: "birthday-1",
    customThemePrompt: "",
    memories: [] as string[],
    tracks: [] as string[],
    unlockDate: "",
    teaserMessage: "",
    gameTarget: 10,
    clips: [] as { caption: string; date: string }[],
  });
  const [isPublishing, setIsPublishing] = useState(false);

  // Occasion-reactive config
  const occasionConfig = useMemo(
    () => getOccasionConfig(formData.occasion),
    [formData.occasion],
  );

  // Protected Route Check
  if (loading) return null;
  if (!user) {
    router.push("/login");
    return null;
  }

  const handleNext = () => setStep((p) => p + 1);
  const handleBack = () => setStep((p) => p - 1);

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const docRef = await addDoc(collection(db, "wishes"), {
        ...formData,
        userId: user.uid,
        createdAt: new Date(),
        status: "published",
      });
      router.push(`/view/${docRef.id}`);
    } catch (error) {
      console.error("Error publishing:", error);
      setIsPublishing(false);
    }
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.5 },
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Occasion-reactive background decorations */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`blob1-${formData.occasion}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.8 }}
          className={`absolute top-10 right-10 w-64 h-64 ${occasionConfig.blobColors[0]} rounded-full blur-3xl animate-float`}
        />
      </AnimatePresence>
      <AnimatePresence mode="wait">
        <motion.div
          key={`blob2-${formData.occasion}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className={`absolute bottom-10 left-10 w-80 h-80 ${occasionConfig.blobColors[1]} rounded-full blur-3xl animate-pulse-soft`}
        />
      </AnimatePresence>

      {/* Floating occasion emojis */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={`emojis-${formData.occasion}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {occasionConfig.emojis.slice(0, 6).map((emoji, i) => (
              <span
                key={`${formData.occasion}-${i}`}
                className="absolute text-2xl select-none"
                style={{
                  left: `${10 + i * 15}%`,
                  bottom: `-20px`,
                  animation: `emoji-float ${12 + i * 2}s linear ${i * 1.5}s infinite`,
                  opacity: 0.5,
                }}
              >
                {emoji}
              </span>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <main className="w-full max-w-2xl bg-white/60  backdrop-blur-xl border border-white/50 rounded-4xl shadow-xl p-8 md:p-12 z-10 transition-all">
        <div className="mb-8 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/")}
            className="text-muted-foreground"
          >
            Cancel
          </Button>
          <div className="flex gap-2">
            {[
              1,
              2,
              3,
              ...([
                "constellation",
                "soundtrack",
                "time-capsule",
                "playable-wish",
                "found-footage",
              ].includes(formData.templateId)
                ? [4]
                : []),
            ].map((i) => (
              <div
                key={i}
                className={`h-2 w-2 rounded-full transition-all ${step >= i ? "bg-primary w-6" : "bg-muted"}`}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" {...fadeIn} className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary mb-4">
                  <Heart className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-display font-bold text-safe">
                  {occasionConfig.microcopy.heading}
                </h2>
                <p className="text-muted-foreground text-safe">
                  {occasionConfig.microcopy.subtitle}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 ml-1">
                    Their Name
                  </label>
                  <input
                    type="text"
                    value={formData.recipientName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        recipientName: e.target.value,
                      })
                    }
                    className="w-full p-4 rounded-xl bg-white/50 border border-input focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                    placeholder={occasionConfig.microcopy.namePlaceholder}
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 ml-1">
                    Occasion
                  </label>
                  <select
                    value={formData.occasion}
                    onChange={(e) =>
                      setFormData({ ...formData, occasion: e.target.value })
                    }
                    className="w-full p-4 rounded-xl bg-white/50 border border-input focus:ring-2 focus:ring-primary/50 outline-none appearance-none"
                  >
                    <option value="birthday">Birthday 🎂</option>
                    <option value="anniversary">Anniversary 💖</option>
                    <option value="wedding">Wedding 💍</option>
                    <option value="custom">Just Because ✨</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleNext}
                  disabled={!formData.recipientName}
                  className="rounded-xl px-8"
                  variant="pookie"
                >
                  Next <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" {...fadeIn} className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-display font-bold text-safe">
                  Write a Message
                </h2>
                <p className="text-muted-foreground text-safe mb-6">
                  Pour your heart out (or keep it short & sweet).
                </p>

                {/* Vibe Starters */}
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {occasionConfig.vibeStarters?.map((starter, i) => (
                    <button
                      key={i}
                      onClick={() =>
                        setFormData({ ...formData, message: starter.text })
                      }
                      className="px-4 py-2 rounded-full bg-white/40 border border-white/20 hover:bg-white/70 text-sm font-medium text-foreground/80 transition-all hover:scale-105 active:scale-95"
                      title={starter.text}
                    >
                      ✨ {starter.label}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="w-full p-4 rounded-xl bg-white/50 border border-input focus:ring-2 focus:ring-primary/50 outline-none min-h-[150px] resize-none"
                placeholder={occasionConfig.microcopy.messagePlaceholder}
              />

              <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={handleBack}>
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!formData.message}
                  className="rounded-xl px-8"
                  variant="pookie"
                >
                  Pick a Vibe <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" {...fadeIn} className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-display font-bold">
                  Pick the Vibe
                </h2>
                <p className="text-muted-foreground">How should it look?</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {[
                  {
                    id: "birthday-1",
                    name: "Soft Birthday",
                    desc: "Pastels & Balloons",
                    icon: <Heart className="w-8 h-8 text-white" />,
                    gradient: "from-pink-200 to-rose-300",
                  },
                  {
                    id: "anniversary-1",
                    name: "Deep Love",
                    desc: "Elegant & Moody",
                    icon: <Heart className="w-8 h-8 text-white" />,
                    gradient: "from-indigo-200 to-purple-300",
                  },
                  {
                    id: "constellation",
                    name: "Memory Constellation",
                    desc: "Emotionally Nuclear",
                    icon: <Stars className="w-8 h-8 text-white" />,
                    gradient: "from-slate-800 to-indigo-900",
                  },
                  {
                    id: "soundtrack",
                    name: "Soundtrack of You",
                    desc: "Spotify Wrapped Energy",
                    icon: <Music className="w-8 h-8 text-white" />,
                    gradient: "from-green-400 to-emerald-600",
                  },
                  {
                    id: "time-capsule",
                    name: "Time Capsule",
                    desc: "Delayed Reveal",
                    icon: <Hourglass className="w-8 h-8 text-white" />,
                    gradient: "from-amber-200 to-orange-400",
                  },
                  {
                    id: "playable-wish",
                    name: "Playable Wish",
                    desc: "Mini Game Greeting",
                    icon: <Gamepad2 className="w-8 h-8 text-white" />,
                    gradient: "from-purple-400 to-pink-400",
                  },
                  {
                    id: "found-footage",
                    name: "Found Footage",
                    desc: "Cinematic / VHS",
                    icon: <Video className="w-8 h-8 text-white" />,
                    gradient: "from-stone-400 to-stone-600",
                  },
                ].map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => {
                      // For specific templates, we clear the prompt. For new ones, we use CustomTemplate as fallback for now
                      // and set the prompt so it shows something relevant.
                      const isImplemented = [
                        "birthday-1",
                        "anniversary-1",
                      ].includes(theme.id);
                      setFormData({
                        ...formData,
                        templateId: theme.id,
                        customThemePrompt: isImplemented
                          ? ""
                          : `${theme.name}: ${theme.desc}`,
                      });
                    }}
                    className={`p-4 rounded-2xl border-2 transition-all text-left group hover:scale-[1.02] ${formData.templateId === theme.id ? "border-primary bg-primary/5" : "border-transparent bg-white/50 hover:bg-white/80"}`}
                  >
                    <div
                      className={`h-24 bg-linear-to-br ${theme.gradient} rounded-xl mb-3 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all`}
                    >
                      {theme.icon}
                    </div>
                    <div className="font-bold text-sm md:text-base">
                      {theme.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {theme.desc}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={handleBack}>
                  Back
                </Button>
                <Button
                  onClick={() => {
                    if (
                      [
                        "constellation",
                        "soundtrack",
                        "time-capsule",
                        "playable-wish",
                        "found-footage",
                      ].includes(formData.templateId)
                    ) {
                      handleNext();
                    } else {
                      handlePublish();
                    }
                  }}
                  disabled={isPublishing}
                  className="rounded-xl px-8 shadow-xl"
                  variant="pookie"
                >
                  {isPublishing ? (
                    <span className="animate-spin mr-2">✨</span>
                  ) : formData.templateId === "constellation" ? (
                    <>
                      Add Memories <ChevronRight className="w-4 h-4 ml-2" />
                    </>
                  ) : formData.templateId === "soundtrack" ? (
                    <>
                      Add Tracks <ChevronRight className="w-4 h-4 ml-2" />
                    </>
                  ) : formData.templateId === "time-capsule" ? (
                    <>
                      Set Timer <ChevronRight className="w-4 h-4 ml-2" />
                    </>
                  ) : formData.templateId === "playable-wish" ? (
                    <>
                      Game Settings <ChevronRight className="w-4 h-4 ml-2" />
                    </>
                  ) : formData.templateId === "found-footage" ? (
                    <>
                      Add Clips <ChevronRight className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Create Wish
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {step === 4 && formData.templateId === "constellation" && (
            <motion.div key="step4" {...fadeIn} className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-display font-bold">
                  ✦ Star Memories
                </h2>
                <p className="text-muted-foreground mt-1">
                  Each moment you add becomes a star in their sky.
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  {formData.memories.filter((m) => m.trim()).length} of 5–20
                  memories
                </p>
              </div>

              <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                {formData.memories.map((memory, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex gap-2 items-start group"
                  >
                    <span className="text-xs text-muted-foreground/40 pt-3.5 font-mono w-5 text-right shrink-0">
                      {index + 1}
                    </span>
                    <input
                      value={memory}
                      onChange={(e) => {
                        const newMemories = [...formData.memories];
                        newMemories[index] = e.target.value;
                        setFormData({ ...formData, memories: newMemories });
                      }}
                      className="flex-1 p-3 rounded-xl bg-white/50 border border-input focus:ring-2 focus:ring-primary/50 outline-none text-sm"
                      placeholder={
                        [
                          "The day we first met…",
                          "That late-night conversation…",
                          "When you made me laugh so hard…",
                          "Our favourite inside joke…",
                          "The song that reminds me of you…",
                        ][index % 5]
                      }
                      maxLength={120}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                      onClick={() => {
                        const newMemories = formData.memories.filter(
                          (_, i) => i !== index,
                        );
                        setFormData({ ...formData, memories: newMemories });
                      }}
                    >
                      ✕
                    </Button>
                  </motion.div>
                ))}

                {formData.memories.length < 20 && (
                  <Button
                    variant="outline"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        memories: [...formData.memories, ""],
                      })
                    }
                    className="w-full rounded-xl border-dashed hover:bg-primary/5 transition-colors"
                  >
                    + Add another memory
                  </Button>
                )}
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={handleBack}>
                  Back
                </Button>
                <Button
                  onClick={handlePublish}
                  disabled={
                    isPublishing ||
                    formData.memories.filter((m) => m.trim()).length < 3
                  }
                  className="rounded-xl px-8 shadow-xl"
                  variant="pookie"
                >
                  {isPublishing ? (
                    <span className="animate-spin mr-2">✨</span>
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                  )}
                  Launch Constellation
                </Button>
              </div>
            </motion.div>
          )}

          {step === 4 && formData.templateId === "soundtrack" && (
            <motion.div
              key="step4-soundtrack"
              {...fadeIn}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-3xl font-display font-bold">
                  🎧 Your Tracklist
                </h2>
                <p className="text-muted-foreground mt-1">
                  Each track is a chapter of your story together.
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  {formData.tracks.filter((t) => t.trim()).length} of 5–10
                  tracks
                </p>
              </div>

              <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                {formData.tracks.map((track, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex gap-2 items-start group"
                  >
                    <span className="text-xs text-muted-foreground/40 pt-3.5 font-mono w-5 text-right shrink-0">
                      {index + 1}
                    </span>
                    <input
                      value={track}
                      onChange={(e) => {
                        const newTracks = [...formData.tracks];
                        newTracks[index] = e.target.value;
                        setFormData({ ...formData, tracks: newTracks });
                      }}
                      className="flex-1 p-3 rounded-xl bg-white/50 border border-input focus:ring-2 focus:ring-primary/50 outline-none text-sm"
                      placeholder={
                        [
                          '"The Early Days (2018)"',
                          '"Met You Mode Activated"',
                          '"Main Character Era"',
                          '"The Chaos Chapter"',
                          '"Unwritten — ft. The Future"',
                        ][index % 5]
                      }
                      maxLength={80}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                      onClick={() => {
                        const newTracks = formData.tracks.filter(
                          (_, i) => i !== index,
                        );
                        setFormData({ ...formData, tracks: newTracks });
                      }}
                    >
                      ✕
                    </Button>
                  </motion.div>
                ))}

                {formData.tracks.length < 10 && (
                  <Button
                    variant="outline"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        tracks: [...formData.tracks, ""],
                      })
                    }
                    className="w-full rounded-xl border-dashed hover:bg-primary/5 transition-colors"
                  >
                    + Add another track
                  </Button>
                )}
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={handleBack}>
                  Back
                </Button>
                <Button
                  onClick={handlePublish}
                  disabled={
                    isPublishing ||
                    formData.tracks.filter((t) => t.trim()).length < 3
                  }
                  className="rounded-xl px-8 shadow-xl"
                  variant="pookie"
                >
                  {isPublishing ? (
                    <span className="animate-spin mr-2">✨</span>
                  ) : (
                    <Music className="w-4 h-4 mr-2" />
                  )}
                  Drop the Album
                </Button>
              </div>
            </motion.div>
          )}

          {step === 4 && formData.templateId === "time-capsule" && (
            <motion.div key="step4-capsule" {...fadeIn} className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-display font-bold">
                  🔒 Set the Timer
                </h2>
                <p className="text-muted-foreground mt-1">
                  The wish stays locked until the moment you choose.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">
                    Unlock Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.unlockDate}
                    onChange={(e) =>
                      setFormData({ ...formData, unlockDate: e.target.value })
                    }
                    className="w-full p-3 rounded-xl bg-white/50 border border-input focus:ring-2 focus:ring-primary/50 outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">
                    Teaser Message
                  </label>
                  <textarea
                    value={formData.teaserMessage}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        teaserMessage: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full p-3 rounded-xl bg-white/50 border border-input focus:ring-2 focus:ring-primary/50 outline-none text-sm resize-none"
                    placeholder="Something special is on its way… 👀"
                    maxLength={200}
                  />
                  <p className="text-[10px] text-muted-foreground/50 mt-1 text-right">
                    {formData.teaserMessage.length}/200
                  </p>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={handleBack}>
                  Back
                </Button>
                <Button
                  onClick={handlePublish}
                  disabled={isPublishing || !formData.unlockDate}
                  className="rounded-xl px-8 shadow-xl"
                  variant="pookie"
                >
                  {isPublishing ? (
                    <span className="animate-spin mr-2">✨</span>
                  ) : (
                    <Hourglass className="w-4 h-4 mr-2" />
                  )}
                  Seal the Capsule
                </Button>
              </div>
            </motion.div>
          )}

          {step === 4 && formData.templateId === "playable-wish" && (
            <motion.div key="step4-game" {...fadeIn} className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-display font-bold">
                  🎮 Game Settings
                </h2>
                <p className="text-muted-foreground mt-1">
                  They play a mini-game to unlock your wish.
                </p>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-3 block">
                  How many hearts to catch?
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {[5, 10, 15, 20].map((n) => (
                    <button
                      key={n}
                      onClick={() =>
                        setFormData({ ...formData, gameTarget: n })
                      }
                      className={`p-4 rounded-xl border-2 transition-all text-center ${
                        formData.gameTarget === n
                          ? "border-primary bg-primary/10 text-primary font-bold"
                          : "border-input bg-white/50 text-muted-foreground hover:border-primary/30"
                      }`}
                    >
                      <div className="text-2xl mb-1">💖</div>
                      <div className="text-lg font-bold">{n}</div>
                      <div className="text-[10px] text-muted-foreground/60">
                        {n <= 5
                          ? "Easy"
                          : n <= 10
                            ? "Medium"
                            : n <= 15
                              ? "Hard"
                              : "Insane"}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={handleBack}>
                  Back
                </Button>
                <Button
                  onClick={handlePublish}
                  disabled={isPublishing}
                  className="rounded-xl px-8 shadow-xl"
                  variant="pookie"
                >
                  {isPublishing ? (
                    <span className="animate-spin mr-2">✨</span>
                  ) : (
                    <Gamepad2 className="w-4 h-4 mr-2" />
                  )}
                  Launch Game
                </Button>
              </div>
            </motion.div>
          )}

          {step === 4 && formData.templateId === "found-footage" && (
            <motion.div key="step4-footage" {...fadeIn} className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-display font-bold">
                  📼 Your Tapes
                </h2>
                <p className="text-muted-foreground mt-1">
                  Each clip is a recovered memory. Add a date to make it hit
                  harder.
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  {formData.clips.filter((c) => c.caption.trim()).length} of
                  3–10 clips
                </p>
              </div>

              <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                {formData.clips.map((clip, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex gap-2 items-start group"
                  >
                    <span className="text-xs text-muted-foreground/40 pt-3.5 font-mono w-5 text-right shrink-0">
                      {index + 1}
                    </span>
                    <div className="flex-1 flex gap-2">
                      <input
                        value={clip.caption}
                        onChange={(e) => {
                          const newClips = [...formData.clips];
                          newClips[index] = {
                            ...newClips[index],
                            caption: e.target.value,
                          };
                          setFormData({ ...formData, clips: newClips });
                        }}
                        className="flex-1 p-3 rounded-xl bg-white/50 border border-input focus:ring-2 focus:ring-primary/50 outline-none text-sm"
                        placeholder={
                          [
                            '"The day it all started"',
                            '"A random Tuesday that changed everything"',
                            '"That one inside joke"',
                          ][index % 3]
                        }
                        maxLength={100}
                      />
                      <input
                        type="date"
                        value={clip.date}
                        onChange={(e) => {
                          const newClips = [...formData.clips];
                          newClips[index] = {
                            ...newClips[index],
                            date: e.target.value,
                          };
                          setFormData({ ...formData, clips: newClips });
                        }}
                        className="w-36 p-3 rounded-xl bg-white/50 border border-input focus:ring-2 focus:ring-primary/50 outline-none text-sm shrink-0"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                      onClick={() => {
                        const newClips = formData.clips.filter(
                          (_, i) => i !== index,
                        );
                        setFormData({ ...formData, clips: newClips });
                      }}
                    >
                      ✕
                    </Button>
                  </motion.div>
                ))}

                {formData.clips.length < 10 && (
                  <Button
                    variant="outline"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        clips: [...formData.clips, { caption: "", date: "" }],
                      })
                    }
                    className="w-full rounded-xl border-dashed hover:bg-primary/5 transition-colors"
                  >
                    + Add another tape
                  </Button>
                )}
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={handleBack}>
                  Back
                </Button>
                <Button
                  onClick={handlePublish}
                  disabled={
                    isPublishing ||
                    formData.clips.filter((c) => c.caption.trim()).length < 2
                  }
                  className="rounded-xl px-8 shadow-xl"
                  variant="pookie"
                >
                  {isPublishing ? (
                    <span className="animate-spin mr-2">✨</span>
                  ) : (
                    <Video className="w-4 h-4 mr-2" />
                  )}
                  Record to Tape
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
