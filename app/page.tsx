"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { FlintChatOverlay, FlintChatTrigger, Message } from "@/components/flint-neural-chat";
import { ContactModal } from "@/components/ContactModal";

export default function Home() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", text: "Hello! I'm Flint. How can I assist you today?", sender: "ai" }
  ]);
  const [voiceDetected, setVoiceDetected] = useState(false);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const handleSend = (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "user"
    };
    
    setMessages((prev) => [...prev, userMessage]);

    // Mock AI Response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm analyzing your request. Flint is ready to transform your business workflow. What specific systems should we automate first?",
        sender: "ai"
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-black font-barlow">
      {/* Background Video */}
      <div className="absolute inset-0 z-0 text-white">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover opacity-60"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260306_074215_04640ca7-042c-45d6-bb56-58b1e8a42489.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* Branding Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 md:px-16 md:py-6 text-white">
        <div className="text-xl font-bold tracking-tighter md:text-2xl uppercase">
          FLINT
        </div>
        <div className="flex items-center gap-4">
          <Link 
            href="/signin" 
            className="text-[11px] font-medium uppercase tracking-widest text-white/70 transition-all hover:text-white md:text-xs"
          >
            Sign In
          </Link>
          <button 
            onClick={() => setIsContactOpen(true)}
            className="rounded-[2px] bg-white px-5 py-2 text-[11px] font-black uppercase tracking-widest text-black transition-all hover:bg-white/90 md:px-7 md:py-3 md:text-xs"
          >
            Let's Talk
          </button>
        </div>
      </nav>

      {/* Welcome Experience */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pt-12 pb-10 md:pt-16 md:pb-12 lg:pb-[80px] xl:pb-[250px] text-center text-white">
        <div className="relative w-full max-w-4xl py-4 px-4 md:px-8">
          <div className="mb-3 flex flex-col items-center">
            <h1 className="flex flex-col">
              <span className="text-[28px] font-light leading-[1] tracking-tight md:text-[38px] lg:text-[48px] xl:text-[64px]">
                Meet
              </span>
              <span className="font-instrument text-[34px] italic leading-[1] md:text-[42px] lg:text-[52px] xl:text-[64px]">
                Flint
              </span>
            </h1>
          </div>
          <div className="mx-auto mb-6 max-w-lg md:mb-8">
            <p className="text-[11px] leading-[1.6] text-white/75 md:text-xs lg:text-sm xl:text-lg">
              Convert your business into an AI agent
            </p>
          </div>
          <Link 
            href="/signup" 
            className="inline-block rounded-[2px] border border-white/20 bg-white/5 px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-white transition-all hover:bg-white hover:text-black"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Neural Interface Trigger */}
      {!isChatOpen && <FlintChatTrigger onClick={() => setIsChatOpen(true)} />}

      {/* Immersive Neural Chat System */}
      <FlintChatOverlay 
        isOpen={isChatOpen}
        messages={messages}
        onClose={() => setIsChatOpen(false)}
        isRecording={isRecording}
        onToggleRecording={toggleRecording}
        onSendMessage={handleSend}
        onVoiceDetected={setVoiceDetected}
      />

      {/* Contact Bottom Sheet */}
      <ContactModal 
        isOpen={isContactOpen} 
        onClose={() => setIsContactOpen(false)} 
      />
    </main>
  );
}
