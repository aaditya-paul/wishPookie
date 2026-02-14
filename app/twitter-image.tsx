import { ImageResponse } from "next/og";

export const alt = "WishPookie — Create immersive, adorable wishes";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #FFF5F7 0%, #F5E6FF 40%, #EEF0FF 100%)",
        fontFamily: "sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative blobs */}
      <div
        style={{
          position: "absolute",
          top: -120,
          left: -80,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "rgba(255, 107, 157, 0.15)",
          filter: "blur(80px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -100,
          right: -60,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "rgba(129, 140, 248, 0.12)",
          filter: "blur(80px)",
        }}
      />

      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 120,
          height: 120,
          borderRadius: 30,
          background:
            "linear-gradient(135deg, #FF6B9D 0%, #C084FC 50%, #818CF8 100%)",
          marginBottom: 32,
          boxShadow: "0 20px 60px rgba(192, 132, 252, 0.3)",
        }}
      >
        <span style={{ fontSize: 64, lineHeight: 1 }}>💌</span>
      </div>

      {/* Title */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 16,
        }}
      >
        <span
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: "#1a1a2e",
            letterSpacing: "-2px",
          }}
        >
          Wish
        </span>
        <span
          style={{
            fontSize: 64,
            fontWeight: 800,
            background: "linear-gradient(135deg, #FF6B9D, #C084FC)",
            backgroundClip: "text",
            color: "transparent",
            letterSpacing: "-2px",
          }}
        >
          Pookie
        </span>
      </div>

      {/* Tagline */}
      <p
        style={{
          fontSize: 26,
          color: "#6b7280",
          marginTop: 0,
          fontWeight: 500,
        }}
      >
        Create immersive, adorable wishes for your favorite people ✨
      </p>

      {/* Bottom accent */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 6,
          background: "linear-gradient(90deg, #FF6B9D, #C084FC, #818CF8)",
        }}
      />
    </div>,
    { ...size },
  );
}
