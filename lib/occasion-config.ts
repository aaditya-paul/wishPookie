export type OccasionType = "birthday" | "anniversary" | "wedding" | "custom";

export interface OccasionConfig {
  label: string;
  emojis: string[];
  gradient: string;
  blobColors: [string, string];
  primaryHue: number;
  microcopy: {
    heading: string;
    subtitle: string;
    namePlaceholder: string;
    messagePlaceholder: string;
    ctaPublish: string;
    loadingEmoji: string;
    footer: string;
    errorEmoji: string;
    errorMessage: string;
  };
  easterEgg: {
    type: "confetti" | "confetti-gold" | "emoji-rain" | "sparkle";
    trigger: "onOpen" | "onReveal";
  };
  vibeStarters: { label: string; text: string }[];
}

const OCCASION_CONFIGS: Record<OccasionType, OccasionConfig> = {
  birthday: {
    label: "Birthday 🎂",
    emojis: ["🎂", "🎈", "🎉", "🎁", "🥳", "🎊", "🧁", "🕯️"],
    gradient: "from-pink-200 via-rose-100 to-amber-100",
    blobColors: ["bg-pink-300/30", "bg-amber-200/30"],
    primaryHue: 350,
    microcopy: {
      heading: "Let's throw a party 🎉",
      subtitle: "Who's the birthday star?",
      namePlaceholder: "e.g. Pookie, Bestie, Mom",
      messagePlaceholder: "Blow out the candles and make a wish…",
      ctaPublish: "Send Birthday Love 🎂",
      loadingEmoji: "🎂",
      footer: "Make a wish! 🌠",
      errorEmoji: "🎂",
      errorMessage: "This birthday wish got lost in the confetti 🎊",
    },
    easterEgg: { type: "confetti", trigger: "onOpen" },
    vibeStarters: [
      {
        label: "Short & Hype",
        text: "HBD!!! Hope you have the best day ever! 🎂🎉",
      },
      {
        label: "Sentimental",
        text: "Happy Birthday to one of my favorite humans. So grateful for another year of you! ❤️",
      },
      {
        label: "Roast",
        text: "Happy Birthday! I was going to get you a gift, but then I remembered my presence is enough. 🎁",
      },
      {
        label: "Memory Lane",
        text: "Remember when we... wait, maybe we shouldn't talk about that. Happy Birthday! 😂",
      },
    ],
  },
  anniversary: {
    label: "Anniversary 💖",
    emojis: ["💖", "💗", "💝", "💕", "🥂", "🌹", "💫", "✨"],
    gradient: "from-rose-200 via-pink-100 to-purple-100",
    blobColors: ["bg-rose-300/30", "bg-purple-200/30"],
    primaryHue: 330,
    microcopy: {
      heading: "Celebrate your love story 💕",
      subtitle: "Who's the lucky one?",
      namePlaceholder: "e.g. My Love, Babe, Partner",
      messagePlaceholder: "From the day we met until forever…",
      ctaPublish: "Send Anniversary Love 💖",
      loadingEmoji: "💖",
      footer: "Forever & always 💫",
      errorEmoji: "💔",
      errorMessage: "This love letter got lost in the stars 🌌",
    },
    easterEgg: { type: "confetti", trigger: "onOpen" },
    vibeStarters: [
      {
        label: "Timeline",
        text: "From [Year] to forever. Happy Anniversary! 💑",
      },
      {
        label: "Inside Joke",
        text: "I love you more than [Coffee/Pizza/Gaming]. And you know that's a lot. 😉",
      },
      {
        label: "First Sight",
        text: "I still remember the first time I saw you...",
      },
      {
        label: "Short & Sweet",
        text: "Happy Anniversary to my better half. Here's to us! 🥂",
      },
    ],
  },
  wedding: {
    label: "Wedding 💍",
    emojis: ["💍", "💒", "🥂", "🤍", "💐", "🎊", "👰", "🤵"],
    gradient: "from-amber-50 via-white to-rose-50",
    blobColors: ["bg-amber-200/30", "bg-rose-100/30"],
    primaryHue: 30,
    microcopy: {
      heading: "Aisle be there for you 💒",
      subtitle: "Who are the lovebirds?",
      namePlaceholder: "e.g. The Happy Couple, Sarah & John",
      messagePlaceholder: "Dear newlyweds, wishing you a lifetime of…",
      ctaPublish: "Send Wedding Wishes 💍",
      loadingEmoji: "💍",
      footer: "Happily ever after 💫",
      errorEmoji: "💍",
      errorMessage: "This wedding wish took a wrong turn down the aisle 💒",
    },
    easterEgg: { type: "confetti-gold", trigger: "onOpen" },
    vibeStarters: [
      {
        label: "Classic",
        text: "Wishing you a lifetime of love and happiness! 🥂",
      },
      {
        label: "Fun",
        text: "Congrats on finding the one person you want to annoy for the rest of your life! 💍",
      },
      {
        label: "Heartfelt",
        text: "May your love grow stronger with each passing year. So happy for you both! ❤️",
      },
    ],
  },
  custom: {
    label: "Just Because ✨",
    emojis: ["✨", "💫", "⭐", "🌟", "🎀", "💌", "🦋", "🌈"],
    gradient: "from-violet-100 via-indigo-50 to-sky-100",
    blobColors: ["bg-violet-200/30", "bg-sky-200/30"],
    primaryHue: 270,
    microcopy: {
      heading: "Spread some magic ✨",
      subtitle: "Who deserves a little sunshine?",
      namePlaceholder: "e.g. Bestie, Fam, My Person",
      messagePlaceholder: "Just wanted to say…",
      ctaPublish: "Send the Vibes ✨",
      loadingEmoji: "✨",
      footer: "Sent with sparkles 💖",
      errorEmoji: "🦋",
      errorMessage: "This magical moment flew away 🦋",
    },
    easterEgg: { type: "sparkle", trigger: "onReveal" },
    vibeStarters: [
      {
        label: "Support",
        text: "Just wanted to remind you that you're doing great. 💪",
      },
      { label: "Miss You", text: "Thinking of you and missing your face! 👋" },
      {
        label: "Gratitude",
        text: "Thank you for being you. That's it. That's the message. ✨",
      },
      { label: "Just Because", text: "Sending some good vibes your way! 🌈" },
    ],
  },
};

export function getOccasionConfig(occasion: string): OccasionConfig {
  return OCCASION_CONFIGS[occasion as OccasionType] || OCCASION_CONFIGS.custom;
}

export function getOccasionEmojis(occasion: string): string[] {
  return getOccasionConfig(occasion).emojis;
}
