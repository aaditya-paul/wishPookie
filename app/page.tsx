import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sparkles, Heart } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-background">
      {/* Background Gradient Base */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10 pointer-events-none" />

      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse-soft opacity-70" />
      <div className="absolute bottom-0 right-0 w-[520px] h-[520px] bg-secondary/30 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 animate-float opacity-70" />

      {/* Accent Glow Dot */}
      <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-primary/20 blur-2xl rounded-full animate-float" />

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center relative z-10">
        <div className="space-y-6 max-w-3xl">
          {/* Tag Pill */}
          <div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full 
          bg-white/60 backdrop-blur-md 
          border border-primary/30 
          shadow-[0_0_20px_rgba(0,0,0,0.05)]
          text-primary text-sm font-medium animate-float"
          >
            <Sparkles className="w-4 h-4" />
            <span>The cutest way to say I love you</span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground leading-tight tracking-tight">
            Make their day{" "}
            <span className="text-primary italic drop-shadow-[0_2px_10px_rgba(0,0,0,0.15)]">
              extra special
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground/90 max-w-xl mx-auto leading-relaxed">
            Create immersive, personalized wishing experiences for birthdays,
            anniversaries, or just because. It's free, cute, and digital.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10">
            <Link href="/create">
              <Button
                size="lg"
                variant="pookie"
                className="rounded-full px-10 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
              >
                Create a Wish
                <Heart className="w-5 h-5 ml-2 fill-current" />
              </Button>
            </Link>

            <Link href="#templates">
              <Button
                size="lg"
                variant="ghost"
                className="rounded-full border border-primary/20 hover:bg-primary/5"
              >
                View Templates
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-muted-foreground/80 text-sm relative z-10">
        <p className="tracking-wide">
          Made with 💖 by{" "}
          <span className="text-primary font-bold">Aaditya Paul</span> © 2026
        </p>
        <p className="tracking-wide">
          visit{" "}
          <a
            href="https://aaditya-paul.in"
            className="text-primary font-bold"
            target="_blank"
          >
            aaditya-paul.in
          </a>{" "}
          for more
        </p>
      </footer>
    </div>
  );
}
