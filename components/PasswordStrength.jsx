// src/components/PasswordStrength.jsx
"use client";

import { useMemo } from "react";

const PasswordStrength = ({ password }) => {
  const analysis = useMemo(() => {
    if (!password) return null;

    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };

    const score = Object.values(checks).filter(Boolean).length;

    const levels = {
      0: { label: "Very weak", color: "bg-red-500", text: "text-red-400" },
      1: { label: "Weak", color: "bg-red-500", text: "text-red-400" },
      2: { label: "Fair", color: "bg-orange-500", text: "text-orange-400" },
      3: { label: "Good", color: "bg-yellow-500", text: "text-yellow-400" },
      4: { label: "Strong", color: "bg-emerald-500", text: "text-emerald-400" },
      5: { label: "Excellent", color: "bg-emerald-400", text: "text-emerald-400" },
    };

    return { score, checks, ...levels[score] };
  }, [password]);

  if (!analysis) return null;

  const requirements = [
    { key: "length", label: "8+ chars" },
    { key: "uppercase", label: "Uppercase" },
    { key: "lowercase", label: "Lowercase" },
    { key: "numbers", label: "Number" },
    { key: "special", label: "Symbol" },
  ];

  return (
    <div className="space-y-2.5 animate-fade-in">
      {/* Progress Bar */}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-[3px] flex-1 rounded-full overflow-hidden bg-white/[0.06]"
          >
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                i <= analysis.score ? analysis.color : "bg-transparent"
              }`}
              style={{
                width: i <= analysis.score ? "100%" : "0%",
                transitionDelay: `${i * 60}ms`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Requirements */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-gray-500">
          Strength:{" "}
          <span className={`font-medium ${analysis.text}`}>
            {analysis.label}
          </span>
        </span>
        <div className="flex items-center gap-1.5">
          {requirements.slice(0, 3).map(({ key, label }) => (
            <span
              key={key}
              className={`px-1.5 py-0.5 rounded text-[9px] font-medium tracking-wide transition-all duration-300 ${
                analysis.checks[key]
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                  : "bg-white/[0.02] text-gray-600 border border-white/[0.06]"
              }`}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PasswordStrength;