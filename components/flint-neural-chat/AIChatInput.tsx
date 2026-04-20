"use client" 

import * as React from "react"
import { useState, useEffect, useRef } from "react";
import { Mic, Paperclip, Send } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
 
const PLACEHOLDERS = [
  "Analyze my pricing schema...",
  "Deploy agent to production...",
  "Book a demo session...",
  "Initialize agent on domain...",
  "Update knowledge base context...",
  "Check system latency...",
];

interface AIChatInputProps {
  onMicClick?: () => void;
  onSend?: (value: string) => void;
  isRecording?: boolean;
}
 
const AIChatInput = ({ onMicClick, onSend, isRecording }: AIChatInputProps) => {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
 
  // Cycle placeholder text when input is inactive
  useEffect(() => {
    if (isActive || inputValue) return;
 
    const interval = setInterval(() => {
      setShowPlaceholder(false);
      setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
        setShowPlaceholder(true);
      }, 400);
    }, 3000);
 
    return () => clearInterval(interval);
  }, [isActive, inputValue]);
 
  // Close input when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        if (!inputValue) setIsActive(false);
      }
    };
 
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [inputValue]);
 
  const handleActivate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsActive(true);
  };

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (inputValue.trim()) {
      onSend?.(inputValue);
      setInputValue("");
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSend();
    }
  };
 
  return (
    <div className="w-full flex justify-center items-center text-black">
      <motion.div
        ref={wrapperRef}
        className="w-full h-[68px]"
        initial={false}
        style={{ overflow: "hidden", borderRadius: 24, background: "#fff" }}
        onClick={handleActivate}
      >
        <div className="flex flex-col items-stretch w-full h-full">
          {/* Input Row */}
          <div className="flex items-center gap-2 p-3 rounded-full bg-white w-full h-full">
            <button
              className="p-3 rounded-full hover:bg-gray-100 transition"
              title="Attach file"
              type="button"
              tabIndex={-1}
            >
              <Paperclip size={20} />
            </button>
 
            {/* Text Input & Placeholder */}
            <div className="relative flex-1 h-full">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={onKeyDown}
                className="flex-1 border-0 outline-0 rounded-md py-2 text-base bg-transparent w-full font-normal h-full"
                style={{ position: "relative", zIndex: 1 }}
                onFocus={() => setIsActive(true)}
              />
              <div className="absolute left-0 top-0 w-full h-full pointer-events-none flex items-center px-3 py-2">
                <AnimatePresence mode="wait">
                  {showPlaceholder && !isActive && !inputValue && (
                    <motion.span
                      key={placeholderIndex}
                      className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 select-none pointer-events-none"
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        zIndex: 0,
                      }}
                      initial={{ opacity: 0, filter: "blur(12px)", y: 10 }}
                      animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                      exit={{ opacity: 0, filter: "blur(12px)", y: -10 }}
                    >
                      {PLACEHOLDERS[placeholderIndex]
                        .split("")
                        .map((char, i) => (
                          <motion.span
                            key={i}
                            style={{ display: "inline-block" }}
                          >
                            {char === " " ? "\u00A0" : char}
                          </motion.span>
                        ))}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>
 
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMicClick?.();
              }}
              className={cn(
                "p-3 rounded-full transition-all",
                isRecording ? "bg-red-500 text-white hover:bg-red-600 scale-110 shadow-lg" : "hover:bg-gray-100"
              )}
              title={isRecording ? "Stop recording" : "Voice input"}
              type="button"
              tabIndex={-1}
            >
              <Mic size={20} className={isRecording ? "animate-pulse" : ""} />
            </button>
            <button
              onClick={handleSend}
              className="flex items-center gap-1 bg-black hover:bg-zinc-700 text-white p-3 rounded-full font-medium justify-center"
              title="Send"
              type="button"
              tabIndex={-1}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
 
export { AIChatInput };
