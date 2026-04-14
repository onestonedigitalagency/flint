// src/components/Navbar.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const Navbar = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Features", href: "#" },
    { name: "Documentation", href: "#" },
    { name: "Pricing", href: "#" },
    { name: "Changelog", href: "#" },
  ];

  const isSignIn = pathname === "/signin";

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/[0.06] bg-[#09090f]/90 backdrop-blur-2xl shadow-lg shadow-black/20"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[60px]">
          <Link href="/" className="flex items-center gap-2.5 group">
            
            <span className="text-[20px] font-semibold tracking-wide text-white/90">
              FLINT
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-3.5 py-1.5 text-[13px] text-gray-400 hover:text-white/90 rounded-md hover:bg-white/[0.04] transition-all duration-200"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Link
              href={isSignIn ? "/signup" : "/signin"}
              className="px-4 py-1.5 text-[13px] text-gray-400 hover:text-white/90 transition-colors duration-200"
            >
              {isSignIn ? "Sign up" : "Sign in"}
            </Link>
            <Link
              href="/signup"
              className="btn-primary px-4 py-2 text-[13px] font-medium rounded-lg bg-violet-600 hover:bg-violet-500 text-white transition-all duration-200 shadow-sm shadow-violet-600/20"
            >
              Get started free
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 -mr-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all"
            aria-label="Toggle menu"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
            >
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
              )}
            </svg>
          </button>
        </div>

        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            mobileOpen ? "max-h-[400px] pb-4" : "max-h-0"
          }`}
        >
          <div className="pt-1 space-y-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block px-3 py-2.5 text-[13px] text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-lg transition-all"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-3 mt-2 border-t border-white/[0.06] space-y-2">
              <Link href="/signin" className="block px-3 py-2.5 text-[13px] text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-lg transition-all">
                Sign in
              </Link>
              <Link href="/signup" className="block px-3 py-2.5 text-[13px] font-medium text-center rounded-lg bg-violet-600 text-white">
                Get started free
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;