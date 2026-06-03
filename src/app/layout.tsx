import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";

const display = Cormorant_Garamond({
  variable: "--font-display-var",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const bodyFont = Montserrat({
  variable: "--font-body-var",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      className={`${display.variable} ${bodyFont.variable} h-full`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col antialiased bg-bg text-text">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
