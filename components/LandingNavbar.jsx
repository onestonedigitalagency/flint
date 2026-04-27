"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const LandingNavbar = ({ onTalkClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 font-barlow ${
        scrolled ? "bg-black/80 py-4 backdrop-blur-xl" : "bg-transparent py-6 md:py-8"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 md:px-16">
        <div className="flex items-center gap-12">
          <Link href="/" className="text-xl font-black tracking-tighter md:text-2xl uppercase text-white hover:opacity-70 transition-opacity">
            FLINT
          </Link>
        </div>

        <div className="flex items-center gap-4 md:gap-8">
          {pathname !== "/signin" && (
            <Link 
              href="/signin" 
              className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 transition-all hover:text-white"
            >
              Sign In
            </Link>
          )}
          
          <button 
            onClick={onTalkClick}
            className="rounded-[2px] bg-white px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-black transition-all hover:scale-105 active:scale-95 md:px-8 md:py-3.5 md:text-[11px]"
          >
            Let's Talk
          </button>
        </div>
      </div>
    </nav>
  );
};
