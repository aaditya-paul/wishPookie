"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getOccasionConfig } from "@/lib/occasion-config";
import BirthdayTemplate from "@/components/templates/BirthdayTemplate";
import AnniversaryTemplate from "@/components/templates/AnniversaryTemplate";
import CustomTemplate from "@/components/templates/CustomTemplate";
import ConstellationTemplate from "@/components/templates/ConstellationTemplate";
import SoundtrackTemplate from "@/components/templates/SoundtrackTemplate";
import TimeCapsuleTemplate from "@/components/templates/TimeCapsuleTemplate";
import PlayableWishTemplate from "@/components/templates/PlayableWishTemplate";
import FoundFootageTemplate from "@/components/templates/FoundFootageTemplate";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ViewPage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchWish() {
      if (!id) return;
      try {
        const docRef = doc(db, "wishes", id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setData(docSnap.data());
        } else {
          setError(true);
        }
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchWish();
  }, [id]);

  if (loading) {
    // Cycle through fun occasion emojis while loading
    const loadingEmojis = ["✨", "🎂", "💖", "💍", "🎉", "🌟"];
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFFdf7] gap-3">
        <div className="animate-spin text-4xl">
          {loadingEmojis[Math.floor(Date.now() / 500) % loadingEmojis.length]}
        </div>
        <p className="text-sm text-gray-400 animate-pulse">
          Unwrapping something special…
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFFdf7] gap-4 px-6 text-center">
        <div className="text-5xl mb-2">🦋</div>
        <h1 className="text-2xl font-bold text-gray-500">
          This wish has flown away…
        </h1>
        <p className="text-sm text-gray-400 max-w-xs">
          It might have expired, or the link is incorrect. Try creating a new
          one!
        </p>
        <Link href="/">
          <Button variant="pookie">Create a new wish ✨</Button>
        </Link>
      </div>
    );
  }

  // Render template based on data.templateId and data.occasion
  const templateId = data.templateId || "";
  const occasion = data.occasion || "";

  // Cross-occasion templates — these are selected explicitly by templateId
  if (templateId === "constellation") {
    return <ConstellationTemplate data={data} />;
  }
  if (templateId === "soundtrack") {
    return <SoundtrackTemplate data={data} />;
  }
  if (templateId === "time-capsule") {
    return <TimeCapsuleTemplate data={data} />;
  }
  if (templateId === "playable-wish") {
    return <PlayableWishTemplate data={data} />;
  }
  if (templateId === "found-footage") {
    return <FoundFootageTemplate data={data} />;
  }

  // Occasion-based default templates — route by occasion
  if (occasion === "birthday") {
    return <BirthdayTemplate data={data} />;
  }
  if (occasion === "anniversary") {
    return <AnniversaryTemplate data={data} />;
  }
  if (occasion === "wedding") {
    // Wedding uses the Anniversary template's romantic aesthetic
    return <AnniversaryTemplate data={data} />;
  }

  // Fallback: custom occasion or unknown
  return <CustomTemplate data={data} />;
}
