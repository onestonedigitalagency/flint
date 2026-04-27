// src/components/SignUpForm.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import InputField from "./InputField";
import SocialButtons from "./SocialButtons";
import PasswordStrength from "./PasswordStrength";
import { api } from "@/lib/api";

const SignUpForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error) setError("");
  };

  const passwordsMatch =
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;

  const passwordsMismatch =
    formData.confirmPassword.length > 0 &&
    formData.password !== formData.confirmPassword;

  const canProceedStep1 = formData.fullName.trim() && formData.email.trim();
  const canSubmit =
    formData.password.length >= 8 &&
    passwordsMatch &&
    formData.agreeTerms &&
    !isLoading;

  const handleNext = () => {
    if (canProceedStep1) setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsLoading(true);
    setError("");
    try {
      await api.post("/auth/signup", {
        email: formData.email,
        password: formData.password,
        full_name: formData.fullName,
      });
      // After signup, redirect to signin
      router.push("/signin");
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-[22px] sm:text-2xl font-semibold text-white tracking-tight">
          Create your account
        </h1>
        <p className="mt-1.5 text-[13px] text-gray-500">
          Get started with FLINT — free for individuals.
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-3 mb-8">
        {["Details", "Security"].map((label, i) => {
          const stepNum = i + 1;
          const isActive = step === stepNum;
          const isComplete = step > stepNum;

          return (
            <div key={label} className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => stepNum < step && setStep(stepNum)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-violet-600/15 text-violet-400 border border-violet-500/20"
                    : isComplete
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 cursor-pointer"
                    : "bg-white/[0.02] text-gray-600 border border-white/[0.06]"
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                    isActive
                      ? "bg-violet-600 text-white"
                      : isComplete
                      ? "bg-emerald-500 text-white"
                      : "bg-white/[0.06] text-gray-600"
                  }`}
                >
                  {isComplete ? (
                    <svg
                      className="w-2.5 h-2.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    stepNum
                  )}
                </span>
                {label}
              </button>
              {i === 0 && (
                <div
                  className={`w-8 h-px transition-colors duration-500 ${
                    step > 1 ? "bg-violet-500/30" : "bg-white/[0.06]"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Card */}
      <div className="relative">
        <div className="absolute -inset-px rounded-xl card-border" />

        <div className="relative glass-card rounded-xl border border-white/[0.06] p-6 sm:p-7">
          {/* Error */}
          {error && (
            <div className="mb-5 flex items-start gap-2.5 p-3 rounded-lg bg-red-500/[0.06] border border-red-500/15 animate-fade-in">
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

          {/* Step 1 */}
          {step === 1 && (
            <div className="animate-fade-in" key="step1">
              <SocialButtons />

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/[0.06]" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-3 text-[11px] text-gray-600 bg-[#0f0f18] uppercase tracking-wider font-medium">
                    Or
                  </span>
                </div>
              </div>

              <div className="space-y-4">
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
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                      />
                    </svg>
                  }
                  label="Full name"
                  name="fullName"
                  placeholder="Jane Smith"
                  value={formData.fullName}
                  onChange={handleChange}
                  autoComplete="name"
                />

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
                  label="Work email"
                  name="email"
                  type="email"
                  placeholder="jane@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                />

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canProceedStep1}
                  className="btn-primary w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-[10px] bg-violet-600 hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed text-[13px] font-medium text-white transition-all duration-200 shadow-md shadow-violet-600/15 hover:shadow-lg hover:shadow-violet-600/25 active:scale-[0.99] mt-1"
                >
                  <span>Continue</span>
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
                </button>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="animate-slide-right" key="step2">
              {/* User Preview */}
              <div className="flex items-center gap-3 p-3 rounded-[10px] bg-white/[0.02] border border-white/[0.06] mb-5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0">
                  {formData.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium text-white truncate">
                    {formData.fullName}
                  </p>
                  <p className="text-[11px] text-gray-500 truncate">
                    {formData.email}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-gray-500 hover:text-gray-300 transition-colors p-1 rounded hover:bg-white/[0.06]"
                  aria-label="Edit"
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
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
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
                  label="Password"
                  name="password"
                  placeholder="Minimum 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  showPasswordToggle
                  autoComplete="new-password"
                />

                <PasswordStrength password={formData.password} />

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
                  label="Confirm password"
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  showPasswordToggle
                  autoComplete="new-password"
                  error={passwordsMismatch ? "Passwords do not match" : ""}
                  rightElement={
                    !passwordsMismatch && formData.confirmPassword ? (
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

                {/* Terms */}
                <label className="flex items-start gap-2.5 cursor-pointer group pt-1">
                  <div className="relative mt-0.5">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-[16px] h-[16px] rounded-[4px] border border-white/[0.1] bg-white/[0.03] peer-checked:bg-violet-600 peer-checked:border-violet-500 transition-all duration-200 flex items-center justify-center flex-shrink-0 group-hover:border-white/20">
                      <svg
                        className={`w-2.5 h-2.5 text-white transition-all duration-150 ${
                          formData.agreeTerms
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-75"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>
                  <span className="text-[12px] text-gray-400 leading-relaxed select-none">
                    I agree to the{" "}
                    <Link
                      href="#"
                      className="text-violet-400/80 hover:text-violet-400 underline underline-offset-2 decoration-violet-400/20 hover:decoration-violet-400/50 transition-all"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="#"
                      className="text-violet-400/80 hover:text-violet-400 underline underline-offset-2 decoration-violet-400/20 hover:decoration-violet-400/50 transition-all"
                    >
                      Privacy Policy
                    </Link>
                  </span>
                </label>

                {/* Actions */}
                <div className="flex gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2.5 rounded-[10px] bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.06] hover:border-white/[0.12] text-[13px] font-medium text-gray-400 hover:text-white transition-all duration-200"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={!canSubmit}
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
                        <span>Creating account…</span>
                      </>
                    ) : (
                      <span>Create account</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Switch */}
          <p className="mt-5 text-center text-[12px] text-gray-500">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="mt-8 grid grid-cols-3 gap-2.5">
        {[
          {
            icon: (
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
                  d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                />
              </svg>
            ),
            label: "Instant setup",
          },
          {
            icon: (
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
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
              </svg>
            ),
            label: "Enterprise security",
          },
          {
            icon: (
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
                  d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                />
              </svg>
            ),
            label: "Free forever",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center gap-1.5 py-3 rounded-lg bg-white/[0.01] border border-white/[0.04]"
          >
            <span className="text-violet-400/50">{item.icon}</span>
            <span className="text-[10px] font-medium text-gray-500 text-center leading-tight">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SignUpForm;