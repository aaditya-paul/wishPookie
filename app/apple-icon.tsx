import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #FF6B9D 0%, #C084FC 50%, #818CF8 100%)",
        borderRadius: "40px",
      }}
    >
      <span style={{ fontSize: 100, lineHeight: 1 }}>💌</span>
    </div>,
    { ...size },
  );
}
