import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #FDFBFF 0%, #F5F0FF 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontWeight: 600,
            letterSpacing: "-0.04em",
            fontFamily: "Georgia, serif",
          }}
        >
          <span style={{ color: "#E8748A" }}>G</span>
          <span style={{ color: "#8B64C8" }}>W</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
