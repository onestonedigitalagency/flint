"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { VoicePoweredOrb } from "./VoicePoweredOrb";
import { AIChatInput } from "./AIChatInput";
import { Bot, X } from "lucide-react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";
import "./styles.css";

export interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
}

export interface FlintChatProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  onSendMessage: (text: string) => void;
  isRecording: boolean;
  onToggleRecording: () => void;
  onVoiceDetected?: (detected: boolean) => void;
}

// Inner component to handle scroll logic safely only when mounted
const ChatContent = ({ 
  onClose, 
  messages,
  onSendMessage,
  isRecording, 
  onToggleRecording, 
  onVoiceDetected
}: Omit<FlintChatProps, "isOpen">) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  // useScroll is now safely contained within a component that only mounts when open
  const { scrollYProgress } = useScroll({
    container: containerRef,
  });

  const historyOpacity = useTransform(scrollYProgress, [0.95, 0.99], [1, 0]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleScroll = () => {
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    setIsScrolling(true);
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 1500);
  };

  const isChatActive = messages.length > 1;

  const lastUserIdx = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].sender === "user") return i;
    }
    return -1;
  }, [messages]);

  const lastAIIdx = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].sender === "ai") return i;
    }
    return -1;
  }, [messages]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-3xl overflow-hidden font-barlow text-white"
    >
      <div className="absolute top-8 right-8 z-[120]">
        <button
          onClick={onClose}
          className="rounded-full bg-white/5 p-3 text-white/30 transition-all hover:bg-white/10 hover:text-white"
        >
          <X className="h-8 w-8" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center relative px-6 w-full h-full">
        <motion.div 
          initial={false}
          animate={{ 
            y: isChatActive ? "-25vh" : "0vh",
            scale: 1.0, 
            opacity: 1
          }}
          transition={{ type: "spring", stiffness: 80, damping: 25 }}
          className="z-[110] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[45vh] w-[45vh] pointer-events-none drop-shadow-[0_0_80px_rgba(255,255,255,0.1)] flex items-center justify-center"
        >
          <VoicePoweredOrb
            enableVoiceControl={isRecording}
            onVoiceDetected={onVoiceDetected}
          />
        </motion.div>

        <div className="z-[105] w-full max-w-3xl flex flex-col h-full pt-[20vh] pb-[120px]">
          <div 
            ref={containerRef}
            onScroll={handleScroll}
            className={cn(
              "flex-1 overflow-y-auto px-4 py-8 modern-floating-scrollbar chat-fade-mask transition-all duration-300",
              isScrolling ? "is-scrolling" : ""
            )}
          >
            <div className="flex flex-col space-y-8 min-h-full justify-end">
              <AnimatePresence initial={false}>
                {messages.map((msg, index) => {
                  const isFocused = index === lastUserIdx || index === lastAIIdx;
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 30, filter: "blur(20px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                      style={{ 
                        opacity: isFocused ? 1 : historyOpacity 
                      }}
                    >
                      <div 
                        className={`max-w-[85%] rounded-[32px] px-6 py-4 text-base leading-relaxed transition-all shadow-2xl ${
                          msg.sender === "user"
                            ? "bg-white text-black rounded-tr-none font-medium"
                            : "bg-white/5 text-white/90 border border-white/10 rounded-tl-none backdrop-blur-3xl"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-8 z-[120] bg-gradient-to-t from-black via-black/80 to-transparent">
        <div className="mx-auto max-w-2xl">
          <AIChatInput onMicClick={onToggleRecording} onSend={onSendMessage} isRecording={isRecording} />
        </div>
      </div>
    </motion.div>
  );
};

export const FlintChatOverlay = (props: FlintChatProps) => {
  return (
    <AnimatePresence>
      {props.isOpen && <ChatContent {...props} />}
    </AnimatePresence>
  );
};

export const FlintChatTrigger = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="fixed right-8 bottom-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-[0_8px_32px_rgba(255,255,255,0.1)] transition-all hover:scale-110 active:scale-95"
    >
      <Bot className="h-6 w-6" />
    </button>
  );
};
