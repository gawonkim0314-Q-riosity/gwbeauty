import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "GW Beauty — Premium Plastic Surgery Clinic";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(135deg, #FDFBFF 0%, #F5F0FF 45%, #FFF4F8 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -80,
            top: -80,
            width: 520,
            height: 520,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(232,116,138,0.35) 0%, rgba(139,100,200,0.08) 70%, transparent 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 120,
            bottom: -120,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(139,100,200,0.28) 0%, transparent 70%)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "72px 80px",
            flex: 1,
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: 22,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#A895C0",
              marginBottom: 20,
            }}
          >
            Premium Aesthetic Clinic
          </div>
          <div
            style={{
              fontSize: 92,
              fontWeight: 600,
              color: "#2D1B4E",
              lineHeight: 1.05,
              fontFamily: "Georgia, serif",
            }}
          >
            GW Beauty
          </div>
          <div
            style={{
              marginTop: 24,
              width: 96,
              height: 4,
              borderRadius: 999,
              background: "linear-gradient(90deg, #E8748A, #8B64C8)",
            }}
          />
          <div
            style={{
              marginTop: 28,
              fontSize: 30,
              color: "#5A4070",
              fontStyle: "italic",
              maxWidth: 640,
              lineHeight: 1.4,
            }}
          >
            Aesthetic Intelligence. Surgical Precision.
          </div>
          <div
            style={{
              marginTop: 36,
              fontSize: 20,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#A895C0",
            }}
          >
            Seoul, Korea
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 360,
            marginRight: 72,
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: 280,
              height: 280,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "linear-gradient(135deg, rgba(232,116,138,0.18) 0%, rgba(139,100,200,0.22) 100%)",
              border: "2px solid rgba(139,100,200,0.25)",
            }}
          >
            <div
              style={{
                fontSize: 112,
                fontWeight: 600,
                background: "linear-gradient(135deg, #E8748A 0%, #8B64C8 100%)",
                backgroundClip: "text",
                color: "transparent",
                fontFamily: "Georgia, serif",
              }}
            >
              GW
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
