"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import InputField from "./InputField";
import SocialButtons from "./SocialButtons";
import { api } from "@/lib/api";

const SignInForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const data = await api.post("/auth/login", {
        username: formData.email,
        password: formData.password,
      }, true);
      
      localStorage.setItem("token", data.access_token);
      router.push("/workspace");
    } catch (err) {
      setError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-[22px] sm:text-2xl font-semibold text-white tracking-tight">
          Sign in to FLINT
        </h1>
        <p className="mt-1.5 text-[13px] text-gray-500">
          Welcome back. Enter your credentials to continue.
        </p>
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

          {/* Social */}
          <SocialButtons />

          {/* Divider */}
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

          {/* Form */}
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
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
              }
              label="Email"
              name="email"
              type="email"
              placeholder="name@company.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
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
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
              }
              label="Password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              showPasswordToggle
              autoComplete="current-password"
              labelRight={
                <Link
                  href="/forgot-password"
                  className="text-[12px] text-violet-400/70 hover:text-violet-400 transition-colors"
                >
                  Forgot password?
                </Link>
              }
            />

            {/* Remember */}
            <label className="flex items-center gap-2.5 cursor-pointer group pt-0.5">
              <div className="relative">
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-[16px] h-[16px] rounded-[4px] border border-white/[0.1] bg-white/[0.03] peer-checked:bg-violet-600 peer-checked:border-violet-500 transition-all duration-200 flex items-center justify-center group-hover:border-white/20">
                  <svg
                    className={`w-2.5 h-2.5 text-white transition-all duration-150 ${
                      formData.remember
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
              <span className="text-[12px] text-gray-400 group-hover:text-gray-300 transition-colors select-none">
                Remember this device
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-[10px] bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-[13px] font-medium text-white transition-all duration-200 shadow-md shadow-violet-600/15 hover:shadow-lg hover:shadow-violet-600/25 active:scale-[0.99]"
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
                  <span>Signing in…</span>
                </>
              ) : (
                <span>Continue</span>
              )}
            </button>
          </form>

          {/* Switch */}
          <p className="mt-5 text-center text-[12px] text-gray-500">
            No account?{" "}
            <Link
              href="/signup"
              className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>

      {/* Trust */}
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
        <span>SOC 2 Type II Certified</span>
        <span className="text-gray-700">·</span>
        <span>256-bit TLS Encryption</span>
        <span className="text-gray-700">·</span>
        <span>99.99% Uptime</span>
      </div>
    </div>
  );
};

export default SignInForm;