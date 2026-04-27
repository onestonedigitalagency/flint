"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LandingNavbar } from "./LandingNavbar";
import { ContactModal } from "./ContactModal";

const AuthLayout = ({ children }) => {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black font-barlow text-white selection:bg-white selection:text-black">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover opacity-20 grayscale"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260306_074215_04640ca7-042c-45d6-bb56-58b1e8a42489.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Navigation */}
      <LandingNavbar onTalkClick={() => setIsContactOpen(true)} />

      {/* Main Content (Centered) */}
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pb-12">
        <div className="w-full max-w-[400px]">
          {children}
        </div>
      </main>

      {/* Contact Modal */}
      <ContactModal 
        isOpen={isContactOpen} 
        onClose={() => setIsContactOpen(false)} 
      />

      {/* Subtle Footer */}
      <footer className="fixed bottom-12 left-0 right-0 z-10 text-center">
        <p className="text-[10px] uppercase tracking-[0.8em] text-white/10">
          ESTABLISHED 2024 • THE ANTI-HALLUCINATION PROTOCOL
        </p>
      </footer>
    </div>
  );
};

export default AuthLayout;