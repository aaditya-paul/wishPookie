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
  title: "WishPookie - Send Cute Wishes",
  description: "Create immersive, adorable wishes for your favorite people.",
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
