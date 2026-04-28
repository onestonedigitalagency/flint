// src/components/ForgotPasswordForm.jsx
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import InputField from "./InputField";
import PasswordStrength from "./PasswordStrength";
import { api } from "@/lib/api";

const RESEND_COOLDOWN = 60;
const OTP_LENGTH = 6;

const ForgotPasswordForm = () => {
  const router = useRouter();

  // Steps: 1 = email, 2 = OTP, 3 = new password, 4 = success
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [otpError, setOtpError] = useState(false);

  const otpRefs = useRef([]);
  const timerRef = useRef(null);

  // Resend countdown
  useEffect(() => {
    if (resendTimer > 0) {
      timerRef.current = setTimeout(
        () => setResendTimer((t) => t - 1),
        1000
      );
    }
    return () => clearTimeout(timerRef.current);
  }, [resendTimer]);

  // Auto-focus first OTP input
  useEffect(() => {
    if (step === 2 && otpRefs.current[0]) {
      setTimeout(() => otpRefs.current[0]?.focus(), 300);
    }
  }, [step]);

  const maskedEmail = email
    ? email.replace(/(.{2})(.*)(@.*)/, "$1***$3")
    : "";

  // Step 1: Send reset email
  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setError("");
    try {
      await api.post("/auth/forgot-password", { email: email.trim() });
      // Backend always returns 200 to prevent email enumeration
      setStep(2);
      setResendTimer(RESEND_COOLDOWN);
    } catch (err) {
      setError(err.message || "Failed to send reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // OTP input handler
  const handleOtpChange = useCallback(
    (index, value) => {
      if (otpError) setOtpError(false);
      if (error) setError("");

      // Only allow digits
      const digit = value.replace(/\D/g, "").slice(-1);

      setOtp((prev) => {
        const next = [...prev];
        next[index] = digit;
        return next;
      });

      // Auto-advance
      if (digit && index < OTP_LENGTH - 1) {
        otpRefs.current[index + 1]?.focus();
      }
    },
    [otpError, error]
  );

  const handleOtpKeyDown = useCallback(
    (index, e) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
        otpRefs.current[index - 1]?.focus();
        setOtp((prev) => {
          const next = [...prev];
          next[index - 1] = "";
          return next;
        });
      }
      if (e.key === "ArrowLeft" && index > 0) {
        otpRefs.current[index - 1]?.focus();
      }
      if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
        otpRefs.current[index + 1]?.focus();
      }
    },
    [otp]
  );

  const handleOtpPaste = useCallback((e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (pasted) {
      const digits = pasted.split("");
      setOtp((prev) => {
        const next = [...prev];
        digits.forEach((d, i) => {
          next[i] = d;
        });
        return next;
      });

      const focusIndex = Math.min(digits.length, OTP_LENGTH - 1);
      otpRefs.current[focusIndex]?.focus();
    }
  }, []);

  // Step 2: Collect OTP — actual verification happens at Step 3 with reset
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== OTP_LENGTH) return;
    // Move to password step; OTP is verified together with new password
    setStep(3);
  };

  // Resend OTP
  const handleResend = async () => {
    if (resendTimer > 0) return;
    setIsLoading(true);
    setError("");
    setOtpError(false);
    try {
      await api.post("/auth/forgot-password", { email: email.trim() });
      setOtp(Array(OTP_LENGTH).fill(""));
      setResendTimer(RESEND_COOLDOWN);
      otpRefs.current[0]?.focus();
    } catch (err) {
      setError(err.message || "Failed to resend code.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset password
  const passwordsMatch =
    confirmPassword.length > 0 && newPassword === confirmPassword;
  const passwordsMismatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;
  const canReset =
    newPassword.length >= 8 && passwordsMatch && !isLoading;

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!canReset) return;

    setIsLoading(true);
    setError("");
    try {
      await api.post("/auth/reset-password", {
        email: email.trim(),
        otp: otp.join(""),
        new_password: newPassword,
      });
      setStep(4);
    } catch (err) {
      // If OTP was wrong, push back to OTP step
      const msg = err.message || "Failed to reset password. Please try again.";
      if (msg.toLowerCase().includes("otp") || msg.toLowerCase().includes("invalid")) {
        setOtpError(true);
        setOtp(Array(OTP_LENGTH).fill(""));
        setStep(2);
      }
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Step indicators
  const steps = [
    { num: 1, label: "Email" },
    { num: 2, label: "Verify" },
    { num: 3, label: "Reset" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        {step < 4 ? (
          <>
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-violet-500/[0.08] border border-violet-500/[0.1] mb-5 relative group cursor-default">
              {step === 1 && (
                <svg
                  className="w-6 h-6 text-violet-400 transition-transform duration-500 group-hover:scale-110"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
              )}
              {step === 2 && (
                <svg
                  className="w-6 h-6 text-violet-400 transition-transform duration-500 group-hover:scale-110"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                  />
                </svg>
              )}
              {step === 3 && (
                <svg
                  className="w-6 h-6 text-violet-400 transition-transform duration-500 group-hover:scale-110"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
              )}
            </div>
            <h1 className="text-[22px] sm:text-2xl font-semibold text-white tracking-tight">
              {step === 1 && "Reset your password"}
              {step === 2 && "Check your email"}
              {step === 3 && "Set new password"}
            </h1>
            <p className="mt-1.5 text-[13px] text-gray-500 max-w-[300px] mx-auto leading-relaxed">
              {step === 1 &&
                "Enter your email address and we'll send you a verification code."}
              {step === 2 && (
                <>
                  We sent a 6-digit code to{" "}
                  <span className="text-gray-300 font-medium">
                    {maskedEmail}
                  </span>
                </>
              )}
              {step === 3 &&
                "Choose a strong password that you haven't used before."}
            </p>
          </>
        ) : (
          /* Step 4: Success */
          <div className="animate-scale-in">
            <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/[0.1] border border-emerald-500/[0.15] mb-5">
              {/* Ripple */}
              <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-[ripple_1.5s_ease-out_infinite]" />
              <svg
                className="w-7 h-7 text-emerald-400 animate-checkmark"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-[22px] sm:text-2xl font-semibold text-white tracking-tight">
              Password updated
            </h1>
            <p className="mt-1.5 text-[13px] text-gray-500 max-w-[280px] mx-auto leading-relaxed">
              Your password has been successfully reset. You can now sign in
              with your new credentials.
            </p>
          </div>
        )}
      </div>

      {/* Step Indicator (steps 1-3) */}
      {step < 4 && (
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => {
            const isActive = step === s.num;
            const isComplete = step > s.num;

            return (
              <div key={s.num} className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-violet-600/15 text-violet-400 border border-violet-500/20"
                      : isComplete
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15"
                      : "bg-white/[0.02] text-gray-600 border border-white/[0.06]"
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold ${
                      isActive
                        ? "bg-violet-600 text-white"
                        : isComplete
                        ? "bg-emerald-500 text-white"
                        : "bg-white/[0.06] text-gray-600"
                    }`}
                  >
                    {isComplete ? (
                      <svg
                        className="w-2 h-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="3.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      s.num
                    )}
                  </span>
                  {s.label}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`w-6 h-px transition-colors duration-500 ${
                      step > s.num ? "bg-violet-500/30" : "bg-white/[0.06]"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Card */}
      <div className="relative">
        <div className="absolute -inset-px rounded-xl card-border" />

        <div className="relative glass-card rounded-xl border border-white/[0.06] p-6 sm:p-7">
          {/* Error */}
          {error && (
            <div
              className={`mb-5 flex items-start gap-2.5 p-3 rounded-lg bg-red-500/[0.06] border border-red-500/15 ${
                otpError ? "animate-shake" : "animate-fade-in"
              }`}
            >
              <svg
                className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
              <p className="text-[12px] text-red-400/90 leading-relaxed">
                {error}
              </p>
            </div>
          )}

          {/* ========== STEP 1: EMAIL ========== */}
          {step === 1 && (
            <form
              onSubmit={handleSendEmail}
              className="space-y-4 animate-fade-in"
              key="step1"
            >
              <InputField
                icon={
                  <svg
                    className="w-[15px] h-[15px]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    />
                  </svg>
                }
                label="Email address"
                name="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                autoComplete="email"
              />

              <button
                type="submit"
                disabled={isLoading || !email.trim()}
                className="btn-primary w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-[10px] bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-[13px] font-medium text-white transition-all duration-200 shadow-md shadow-violet-600/15 hover:shadow-lg hover:shadow-violet-600/25 active:scale-[0.99]"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-3.5 w-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    <span>Sending code…</span>
                  </>
                ) : (
                  <>
                    <span>Send verification code</span>
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </>
                )}
              </button>
            </form>
          )}

          {/* ========== STEP 2: OTP ========== */}
          {step === 2 && (
            <form
              onSubmit={handleVerifyOtp}
              className="animate-slide-right"
              key="step2"
            >
              {/* OTP Inputs */}
              <div className="flex justify-center gap-2.5 sm:gap-3 mb-5">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={index === 0 ? handleOtpPaste : undefined}
                    className={`otp-input w-11 h-12 sm:w-12 sm:h-14 rounded-[10px] bg-white/[0.03] border text-center text-lg sm:text-xl font-semibold text-white focus:outline-none transition-all duration-200 ${
                      otpError
                        ? "border-red-500/40 bg-red-500/[0.03]"
                        : digit
                        ? "border-violet-500/30 bg-violet-500/[0.03]"
                        : "border-white/[0.07]"
                    }`}
                    autoComplete="one-time-code"
                  />
                ))}
              </div>

              {/* Resend */}
              <div className="flex items-center justify-center mb-5">
                {resendTimer > 0 ? (
                  <p className="text-[12px] text-gray-500 flex items-center gap-1.5">
                    <svg
                      className="w-3.5 h-3.5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Resend code in{" "}
                    <span className="text-violet-400 font-medium tabular-nums">
                      {resendTimer}s
                    </span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isLoading}
                    className="text-[12px] text-violet-400 hover:text-violet-300 font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"
                      />
                    </svg>
                    Resend code
                  </button>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setError("");
                    setOtp(Array(OTP_LENGTH).fill(""));
                    setOtpError(false);
                  }}
                  className="px-4 py-2.5 rounded-[10px] bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.06] hover:border-white/[0.12] text-[13px] font-medium text-gray-400 hover:text-white transition-all duration-200"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading || otp.join("").length !== OTP_LENGTH}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-[10px] bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-[13px] font-medium text-white transition-all duration-200 shadow-md shadow-violet-600/15 hover:shadow-lg hover:shadow-violet-600/25 active:scale-[0.99]"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-3.5 w-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      <span>Verifying…</span>
                    </>
                  ) : (
                    <span>Verify code</span>
                  )}
                </button>
              </div>

              {/* Help */}
              <div className="mt-5 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  <span className="text-gray-400 font-medium">
                    Can&apos;t find the email?
                  </span>{" "}
                  Check your spam folder or verify that{" "}
                  <span className="text-gray-300">{maskedEmail}</span> is
                  correct.
                </p>
              </div>
            </form>
          )}

          {/* ========== STEP 3: NEW PASSWORD ========== */}
          {step === 3 && (
            <form
              onSubmit={handleResetPassword}
              className="space-y-4 animate-slide-right"
              key="step3"
            >
              {/* Requirements Info */}
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-violet-500/[0.04] border border-violet-500/[0.08] mb-1">
                <svg
                  className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                  />
                </svg>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Password must be at least 8 characters and include uppercase,
                  lowercase, numbers, and symbols.
                </p>
              </div>

              <InputField
                icon={
                  <svg
                    className="w-[15px] h-[15px]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                    />
                  </svg>
                }
                label="New password"
                name="newPassword"
                placeholder="Minimum 8 characters"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (error) setError("");
                }}
                showPasswordToggle
                autoComplete="new-password"
              />

              <PasswordStrength password={newPassword} />

              <InputField
                icon={
                  <svg
                    className="w-[15px] h-[15px]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                    />
                  </svg>
                }
                label="Confirm new password"
                name="confirmPassword"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (error) setError("");
                }}
                showPasswordToggle
                autoComplete="new-password"
                error={passwordsMismatch ? "Passwords do not match" : ""}
                rightElement={
                  !passwordsMismatch && confirmPassword ? (
                    passwordsMatch ? (
                      <svg
                        className="w-3.5 h-3.5 text-emerald-400 animate-fade-in"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="2.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : null
                  ) : null
                }
              />

              {/* Actions */}
              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setStep(2);
                    setError("");
                  }}
                  className="px-4 py-2.5 rounded-[10px] bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.06] hover:border-white/[0.12] text-[13px] font-medium text-gray-400 hover:text-white transition-all duration-200"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={!canReset}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-[10px] bg-violet-600 hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed text-[13px] font-medium text-white transition-all duration-200 shadow-md shadow-violet-600/15 hover:shadow-lg hover:shadow-violet-600/25 active:scale-[0.99]"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-3.5 w-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      <span>Resetting…</span>
                    </>
                  ) : (
                    <span>Reset password</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ========== STEP 4: SUCCESS ========== */}
          {step === 4 && (
            <div className="animate-fade-in text-center" key="step4">
              <Link
                href="/signin"
                className="btn-primary w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-[10px] bg-violet-600 hover:bg-violet-500 text-[13px] font-medium text-white transition-all duration-200 shadow-md shadow-violet-600/15 hover:shadow-lg hover:shadow-violet-600/25 active:scale-[0.99]"
              >
                <span>Continue to sign in</span>
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </Link>

              {/* Security Note */}
              <div className="mt-5 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <div className="flex items-start gap-2.5">
                  <svg
                    className="w-4 h-4 text-violet-400/60 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                    />
                  </svg>
                  <p className="text-[11px] text-gray-500 text-left leading-relaxed">
                    For security, all other active sessions have been signed
                    out. You&apos;ll need to sign in again on your other
                    devices.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Back to sign in (steps 1-3) */}
          {step < 4 && (
            <p className="mt-5 text-center text-[12px] text-gray-500">
              Remember your password?{" "}
              <Link
                href="/signin"
                className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          )}
        </div>
      </div>

      {/* Security badge */}
      <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-gray-600">
        <svg
          className="w-3 h-3 text-emerald-500/70"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
          />
        </svg>
        <span>Secured with 256-bit encryption</span>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;