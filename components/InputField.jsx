// src/components/InputField.jsx
"use client";

import { useState } from "react";

const InputField = ({
  icon,
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  required = true,
  showPasswordToggle = false,
  rightElement,
  labelRight,
  autoComplete,
  error,
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const inputType = showPasswordToggle
    ? showPassword
      ? "text"
      : "password"
    : type;

  return (
    <div className="space-y-1.5">
      {/* Label Row */}
      <div className="flex items-center justify-between px-0.5">
        <label
          htmlFor={name}
          className="text-[13px] font-medium text-gray-300/90"
        >
          {label}
        </label>
        {labelRight}
      </div>

      {/* Input Container */}
      <div className="relative input-field rounded-[10px]">
        {/* Focus Ring */}
        <div
          className={`absolute -inset-px rounded-[11px] bg-gradient-to-b from-violet-500/30 to-violet-500/5 transition-opacity duration-300 ${
            focused ? "opacity-100" : "opacity-0"
          }`}
        />

        <div className="relative flex items-center">
          {/* Icon */}
          <div
            className={`absolute left-3.5 transition-colors duration-200 ${
              focused ? "text-violet-400" : "text-gray-500"
            }`}
          >
            {icon}
          </div>

          {/* Input */}
          <input
            id={name}
            type={inputType}
            name={name}
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={`w-full pl-10 ${
              showPasswordToggle || rightElement ? "pr-11" : "pr-4"
            } py-2.5 rounded-[10px] bg-white/[0.03] border text-[13px] text-gray-200 placeholder:text-gray-600 focus:outline-none focus:bg-white/[0.05] transition-all duration-200 ${
              error
                ? "border-red-500/40"
                : "border-white/[0.07] focus:border-violet-500/30"
            }`}
            placeholder={placeholder}
            required={required}
            autoComplete={autoComplete || "off"}
          />

          {/* Password Toggle */}
          {showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 text-gray-500 hover:text-gray-300 transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
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
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              ) : (
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
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              )}
            </button>
          )}

          {/* Custom Right Element */}
          {!showPasswordToggle && rightElement && (
            <div className="absolute right-3.5">{rightElement}</div>
          )}
        </div>
      </div>

      {/* Error Text */}
      {error && (
        <p className="text-[11px] text-red-400 px-0.5 animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
};

export default InputField;