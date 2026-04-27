"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import InputField from "./InputField";
import { api } from "@/lib/api";

const SignInForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
      setError(err.message || "Access denied. Check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const canSubmit = formData.email.trim() && formData.password.length > 0;

  return (
    <div className="animate-fade-in space-y-12">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/40">
          Authentication
        </h2>
        <h1 className="text-3xl font-black tracking-tight text-white uppercase">
          Sign In
        </h1>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-500/10 border-l-2 border-red-500 text-[11px] font-bold uppercase tracking-widest text-red-500 animate-shake">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <InputField
          label="Email Address"
          name="email"
          type="email"
          placeholder="ENTER YOUR EMAIL"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
        />

        <div className="space-y-4">
          <InputField
            label="Password"
            name="password"
            placeholder="ENTER YOUR PASSWORD"
            value={formData.password}
            onChange={handleChange}
            showPasswordToggle
            autoComplete="current-password"
          />
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !canSubmit}
          className="group relative w-full overflow-hidden bg-white py-6 text-xs font-black uppercase tracking-[0.3em] text-black transition-all hover:bg-white/90 active:scale-[0.98] disabled:opacity-20 disabled:cursor-not-allowed"
        >
          <span className={isLoading ? "opacity-0" : "opacity-100"}>
            Authorize Access
          </span>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent" />
            </div>
          )}
        </button>
      </form>

      {/* Switch */}
      <div className="text-center pt-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">
          No account?{" "}
          <Link
            href="/signup"
            className="text-white hover:opacity-70 transition-opacity"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignInForm;