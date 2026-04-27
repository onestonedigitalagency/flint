"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Mock submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(onClose, 2000);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container (Bottom Sheet) */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-[70] flex justify-center p-4 md:p-8"
          >
            <div className="w-full max-w-4xl overflow-hidden rounded-[32px] border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl">
              <div className="flex h-full min-h-[500px]">
                {/* Left Vertical Sidebar */}
                <div className="hidden w-20 flex-col items-center justify-between border-r border-white/10 py-12 md:flex">
                  <div className="flex flex-col gap-8">
                    <a href="#" className="text-white/40 transition-colors hover:text-white">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12.004 2c-5.523 0-10 4.477-10 10 0 1.767.461 3.427 1.267 4.873l-1.271 4.639 4.747-1.246c1.402.739 2.99 1.157 4.675 1.157a9.993 9.993 0 0010-10c0-5.523-4.477-10-10-10zm0 18.004c-1.579 0-3.056-.43-4.327-1.18l-.31-.183-2.812.738.751-2.738-.201-.32a8.005 8.005 0 01-1.105-4.321c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8zM15.93 13.05c-.26-.13-1.53-.76-1.77-.84-.24-.09-.41-.13-.58.13-.17.26-.66.84-.81 1.01-.15.17-.3.19-.56.06-.26-.13-1.1-.41-2.1-1.3-.77-.69-1.29-1.54-1.44-1.8-.15-.26-.02-.4.11-.53.12-.11.26-.3.39-.45.13-.15.17-.26.26-.43.09-.17.04-.32-.02-.45-.06-.13-.58-1.39-.79-1.9-.21-.5-.41-.43-.58-.43h-.49c-.17 0-.45.06-.69.31-.24.25-.91.89-.91 2.17 0 1.28.93 2.51 1.06 2.68.13.17 1.83 2.79 4.43 3.91.62.27 1.1.43 1.48.55.62.2 1.19.17 1.63.1.5-.07 1.53-.63 1.74-1.23.21-.61.21-1.13.15-1.23-.06-.1-.22-.16-.48-.29z"/></svg>
                    </a>
                    <a href="#" className="text-white/40 transition-colors hover:text-white">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                    </a>
                  </div>
                  <div className="mb-12 rotate-[-90deg] whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.5em] text-white/20">
                    CONTACT US
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="relative flex-1 p-6 md:p-10">
                  {/* Close Button */}
                  <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/40 transition-all hover:bg-white/10 hover:text-white"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>

                  <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-white/10 md:hidden" />
                  
                  {isSubmitted ? (
                    <div className="flex h-full flex-col items-center justify-center text-center">
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white">
                        <span className="material-symbols-outlined text-2xl">check_circle</span>
                      </div>
                      <h2 className="text-2xl font-semibold text-white">Message Sent!</h2>
                      <p className="mt-2 text-white/60 text-sm">Flint will get back to you shortly.</p>
                    </div>
                  ) : (
                    <div className="h-full space-y-6">
                      <div>
                        <h2 className="text-3xl font-bold tracking-tighter text-white md:text-5xl">GET IN TOUCH</h2>
                        <p className="mt-3 text-base text-white/40">Ready to automate your vision? Let's build the future together.</p>
                      </div>

                      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          <div className="space-y-2">
                            <label className="text-[10px] font-medium uppercase tracking-widest text-white/40">Full Name</label>
                            <input
                              required
                              type="text"
                              placeholder="Your name"
                              className="w-full rounded-xl border border-white/10 bg-white/5 p-5 text-sm text-white placeholder:text-white/20 outline-none transition-all focus:border-white/30 focus:bg-white/10"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-medium uppercase tracking-widest text-white/40">Email Address</label>
                            <input
                              required
                              type="email"
                              placeholder="hello@company.com"
                              className="w-full rounded-xl border border-white/10 bg-white/5 p-5 text-sm text-white placeholder:text-white/20 outline-none transition-all focus:border-white/30 focus:bg-white/10"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-medium uppercase tracking-widest text-white/40">Message</label>
                          <textarea
                            required
                            rows={4}
                            placeholder="Tell us about your project or business needs..."
                            className="w-full resize-none rounded-xl border border-white/10 bg-white/5 p-5 text-sm text-white placeholder:text-white/20 outline-none transition-all focus:border-white/30 focus:bg-white/10"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="group relative w-full overflow-hidden rounded-2xl bg-white py-6 text-sm font-bold uppercase tracking-[0.2em] text-black transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                        >
                          <span className={isSubmitting ? "opacity-0" : "opacity-100"}>
                            Launch Inquiry
                          </span>
                          {isSubmitting && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent" />
                            </div>
                          )}
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
