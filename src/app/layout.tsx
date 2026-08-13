import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

/** Default reading font for the whole site — see SKILL.md mục 2 for the
 * font-vl/font-bmx/font-p22 usage rule. */
const vlTypewriter = localFont({
  src: "../assets/VL TypewriterBasiX-Regular.ttf",
  variable: "--vl-typewriter",
  display: "swap",
});

/** Game name/brand + large "impact" text only. */
const bmxRadical = localFont({
  src: "../assets/BMXRadical-Bold.ttf",
  variable: "--bmx-radical",
  display: "swap",
});

/** Short notification/prompt titles only. */
const p22Slogan = localFont({
  src: "../assets/P22 Slogan W00 Regular.ttf",
  variable: "--p22-slogan",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wulin.io — Hành Tẩu Giang Hồ",
  description: "Game idle khám phá võ lâm, góc nhìn top-down kiểu .io",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${vlTypewriter.variable} ${bmxRadical.variable} ${p22Slogan.variable} h-dvh overflow-hidden antialiased`}
    >
      <body className="h-dvh overflow-hidden flex flex-col">{children}</body>
    </html>
  );
}
