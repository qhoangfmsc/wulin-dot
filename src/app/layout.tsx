import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

/** Regular game text — HUD, panels, body copy. */
const bmxRadical = localFont({
  src: "../assets/BMXRadical-Bold.ttf",
  variable: "--font-bmx",
  display: "swap",
});

/** Titles and cutscene/introduction screens only — see AGENTS.md font rule. */
const p22Slogan = localFont({
  src: "../assets/P22 Slogan W00 Regular.ttf",
  variable: "--font-p22",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wulin.io — Hành Tẩu Giang Hồ",
  description: "Game idle khám phá võ lâm, góc nhìn top-down kiểu .io",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bmxRadical.variable} ${p22Slogan.variable} h-dvh overflow-hidden antialiased`}
    >
      <body className="h-dvh overflow-hidden flex flex-col">{children}</body>
    </html>
  );
}
