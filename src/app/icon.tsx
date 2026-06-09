import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 96,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 168,
            fontWeight: 600,
            letterSpacing: "-0.04em",
            fontFamily: "Georgia, serif",
            lineHeight: 1,
          }}
        >
          <span style={{ color: "#E8748A" }}>G</span>
          <span style={{ color: "#8B64C8" }}>W</span>
        </div>
        <div
          style={{
            marginTop: 12,
            width: 120,
            height: 6,
            borderRadius: 999,
            background: "linear-gradient(90deg, #E8748A, #8B64C8)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
