import type { Metadata } from "next";
import { Quicksand } from "next/font/google"; // Using a rounded, friendly font
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/lib/auth-context";

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
});

export const metadata: Metadata = {
  title: {
    default: "WishPookie — The Cutest Way to Send Wishes 💌",
    template: "%s | WishPookie",
  },
  description:
    "Create immersive, personalized wishing experiences for birthdays, anniversaries, or just because. Beautiful interactive templates, mini-games, time capsules & more — all free.",
  keywords: [
    "wish",
    "birthday wish",
    "anniversary wish",
    "online greeting card",
    "personalized wish",
    "digital card",
    "wishpookie",
    "cute wish",
    "interactive greeting",
    "free greeting card",
  ],
  authors: [{ name: "Aaditya Paul", url: "https://aaditya-paul.in" }],
  creator: "Aaditya Paul",
  metadataBase: new URL("https://wish-pookie.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "WishPookie",
    title: "WishPookie — The Cutest Way to Send Wishes 💌",
    description:
      "Create immersive, personalized wishing experiences for birthdays, anniversaries, or just because. Free, cute, and digital.",
  },
  twitter: {
    card: "summary_large_image",
    title: "WishPookie — The Cutest Way to Send Wishes 💌",
    description:
      "Create immersive, personalized wishing experiences for birthdays, anniversaries, or just because.",
    creator: "@aadityapaul",
  },
  other: {
    "theme-color": "#FF6B9D",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          quicksand.className,
        )}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
