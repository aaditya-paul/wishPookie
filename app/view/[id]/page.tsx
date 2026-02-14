"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFdf7]">
        <div className="animate-spin text-4xl">✨</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFFdf7] gap-4">
        <h1 className="text-2xl font-bold text-gray-400">Wish not found 😢</h1>
        <Link href="/">
          <Button variant="pookie">Create a new one</Button>
        </Link>
      </div>
    );
  }

  // Render template based on data.occasion or data.templateId
  const templateId = data.templateId || "";
  const occasion = data.occasion || "";

  if (occasion === "anniversary" || templateId.includes("anniversary")) {
    return <AnniversaryTemplate data={data} />;
  }

  if (templateId === "birthday-1") {
    return <BirthdayTemplate data={data} />;
  }

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

  // Fallback for new themes or custom
  return <CustomTemplate data={data} />;
}
