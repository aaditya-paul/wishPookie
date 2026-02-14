import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
        borderRadius: "8px",
      }}
    >
      <span style={{ fontSize: 22, lineHeight: 1 }}>💌</span>
    </div>,
    { ...size },
  );
}
