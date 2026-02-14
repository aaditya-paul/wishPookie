"use client";

import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sparkles } from "lucide-react";

export default function LoginPage() {
  const { user, signInWithGoogle, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/create");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute top-40 right-10 w-40 h-40 bg-accent/30 rounded-full blur-xl animate-pulse-soft" />

      <div className="z-10 bg-white/50 backdrop-blur-xl p-8 rounded-4xl shadow-xl border border-white/40 max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2">Welcome Back! ✨</h1>
        <p className="text-muted-foreground mb-8">
          Sign in to start creating magical moments for your loved ones.
        </p>

        <Button
          onClick={signInWithGoogle}
          className="w-full h-12 rounded-xl text-lg font-medium shadow-md transition-transform hover:scale-[1.02]"
          variant="default"
        >
          Sign in with Google
        </Button>

        <p className="mt-6 text-xs text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
