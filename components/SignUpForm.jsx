"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import InputField from "./InputField";
import { api } from "@/lib/api";

const SignUpForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const canProceedStep1 = formData.fullName.trim() && formData.email.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await api.post("/auth/signup", {
        email: formData.email,
        password: formData.password,
        full_name: formData.fullName,
      });
      router.push("/signin");
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-12">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/40">
          Registration
        </h2>
        <h1 className="text-3xl font-black tracking-tight text-white uppercase">
          {step === 1 ? "Your Identity" : "Security"}
        </h1>
      </div>

      {/* Step Indicator */}
      <div className="flex justify-center gap-2">
        <div className={`h-1 w-12 rounded-full transition-all duration-500 ${step === 1 ? "bg-white" : "bg-white/10"}`} />
        <div className={`h-1 w-12 rounded-full transition-all duration-500 ${step === 2 ? "bg-white" : "bg-white/10"}`} />
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-500/10 border-l-2 border-red-500 text-[11px] font-bold uppercase tracking-widest text-red-500">
          {error}
        </div>
      )}

      {step === 1 ? (
        <div className="space-y-8 animate-fade-in">
          <InputField
            label="Full Name"
            name="fullName"
            placeholder="ENTER YOUR NAME"
            value={formData.fullName}
            onChange={handleChange}
            autoComplete="name"
          />
          <InputField
            label="Work Email"
            name="email"
            type="email"
            placeholder="ENTER YOUR EMAIL"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
          />
          <button
            type="button"
            onClick={() => setStep(2)}
            disabled={!canProceedStep1}
            className="w-full bg-white py-6 text-xs font-black uppercase tracking-[0.3em] text-black transition-all hover:bg-white/90 disabled:opacity-30"
          >
            Continue
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8 animate-slide-right">
          <InputField
            label="Create Password"
            name="password"
            placeholder="MINIMUM 8 CHARACTERS"
            value={formData.password}
            onChange={handleChange}
            showPasswordToggle
            autoComplete="new-password"
          />
          
          <div className="space-y-4">
            <button
              type="submit"
              disabled={isLoading || formData.password.length < 8}
              className="w-full bg-white py-6 text-xs font-black uppercase tracking-[0.3em] text-black transition-all hover:bg-white/90 disabled:opacity-30"
            >
              {isLoading ? "Creating..." : "Finalize Account"}
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors"
            >
              Back to Details
            </button>
          </div>
        </form>
      )}

      {/* Switch */}
      <div className="text-center pt-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">
          Have an account?{" "}
          <Link
            href="/signin"
            className="text-white hover:opacity-70 transition-opacity"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;