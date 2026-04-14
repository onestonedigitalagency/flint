// src/app/layout.js
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "FLINT — Build Faster, Ship Smarter",
  description:
    "The next-generation development platform. Build, deploy, and scale your applications with confidence.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} font-sans antialiased bg-[#09090f] text-white`}
      >
        {children}
      </body>
    </html>
  );
}