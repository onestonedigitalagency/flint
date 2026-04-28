"use client";

import { useState } from "react";
import { api } from "@/lib/api";

const CATEGORIES = [
  "Education & Tutoring",
  "Health & Wellness",
  "E-Commerce & Retail",
  "Professional Services",
  "SaaS & Technology",
  "Hospitality & Travel",
  "Real Estate",
  "Finance & Insurance",
  "Other",
];

interface BusinessResult {
  id: string;
  name: string;
  agent_id: string;
  agent_status: string;
  website_url?: string;
  bot_name?: string;
  category?: string;
  onboarding_step: number;
  onboarding_completed: boolean;
}

export default function CreateBusinessModal({ onCreated }: { onCreated: (biz: BusinessResult) => void }) {
  const [name, setName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [botName, setBotName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = name.trim().length >= 2;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;
    setIsLoading(true);
    setError("");
    try {
      const business = await api.post("/businesses", {
        name: name.trim(),
        website_url: websiteUrl.trim() || null,
        category,
        bot_name: botName.trim() || `${name.trim()} Assistant`,
        bot_color: "#4d44e3",
      });
      onCreated(business);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create business. Please try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(42,52,57,0.55)",
      backdropFilter: "blur(6px)",
    }}>
      <div style={{
        background: "var(--ds-surface-white)",
        borderRadius: "var(--ds-radius-xl)",
        boxShadow: "0 24px 64px rgba(42,52,57,0.18)",
        width: "100%", maxWidth: "480px",
        padding: "36px",
        fontFamily: "'Inter', sans-serif",
      }}>
        {/* Header */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{
            width: "48px", height: "48px",
            borderRadius: "var(--ds-radius-md)",
            background: "var(--ds-primary-container)",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: "16px",
          }}>
            <span className="material-symbols-outlined" style={{ color: "var(--ds-primary)", fontSize: "24px", fontVariationSettings: "'FILL' 1" }}>
              storefront
            </span>
          </div>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "22px", fontWeight: 800,
            color: "var(--ds-on-surface)",
            margin: 0,
          }}>Set up your business</h2>
          <p style={{ fontSize: "13px", color: "var(--ds-on-surface-var)", marginTop: "6px", lineHeight: 1.6 }}>
            Tell us about your business so we can configure your AI agent.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            padding: "12px 16px",
            background: "rgba(239,68,68,0.07)",
            border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: "var(--ds-radius-md)",
            color: "#dc2626",
            fontSize: "13px",
            marginBottom: "20px",
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Business Name */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--ds-on-surface)" }}>
              Business Name <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Acme Corp"
              autoFocus
              style={{
                background: "var(--ds-surface-low)",
                border: "1.5px solid var(--ds-surface-cnt-high2)",
                borderRadius: "var(--ds-radius-md)",
                padding: "10px 14px",
                fontSize: "13px",
                fontFamily: "'Inter', sans-serif",
                color: "var(--ds-on-surface)",
                outline: "none",
              }}
            />
          </div>

          {/* Category */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--ds-on-surface)" }}>
              Business Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                background: "var(--ds-surface-low)",
                border: "1.5px solid var(--ds-surface-cnt-high2)",
                borderRadius: "var(--ds-radius-md)",
                padding: "10px 14px",
                fontSize: "13px",
                fontFamily: "'Inter', sans-serif",
                color: "var(--ds-on-surface)",
                outline: "none",
              }}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Bot Name */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--ds-on-surface)" }}>
              AI Agent Name <span style={{ fontSize: "11px", color: "var(--ds-outline)", fontWeight: 400 }}>(optional)</span>
            </label>
            <input
              value={botName}
              onChange={(e) => setBotName(e.target.value)}
              placeholder={name ? `${name} Assistant` : "My Assistant"}
              style={{
                background: "var(--ds-surface-low)",
                border: "1.5px solid var(--ds-surface-cnt-high2)",
                borderRadius: "var(--ds-radius-md)",
                padding: "10px 14px",
                fontSize: "13px",
                fontFamily: "'Inter', sans-serif",
                color: "var(--ds-on-surface)",
                outline: "none",
              }}
            />
          </div>

          {/* Website */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--ds-on-surface)" }}>
              Website URL <span style={{ fontSize: "11px", color: "var(--ds-outline)", fontWeight: 400 }}>(optional)</span>
            </label>
            <input
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://yourwebsite.com"
              type="url"
              style={{
                background: "var(--ds-surface-low)",
                border: "1.5px solid var(--ds-surface-cnt-high2)",
                borderRadius: "var(--ds-radius-md)",
                padding: "10px 14px",
                fontSize: "13px",
                fontFamily: "'Inter', sans-serif",
                color: "var(--ds-on-surface)",
                outline: "none",
              }}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!canSubmit || isLoading}
            style={{
              marginTop: "8px",
              padding: "12px 20px",
              borderRadius: "var(--ds-radius-md)",
              background: canSubmit && !isLoading
                ? "linear-gradient(145deg, var(--ds-primary) 0%, var(--ds-primary-dim) 100%)"
                : "var(--ds-surface-cnt-high)",
              color: canSubmit && !isLoading ? "var(--ds-on-primary)" : "var(--ds-outline)",
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700, fontSize: "14px",
              border: "none", cursor: canSubmit && !isLoading ? "pointer" : "not-allowed",
              boxShadow: canSubmit && !isLoading ? "0 4px 12px rgba(77,68,227,0.25)" : "none",
              transition: "all 0.2s",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            }}
          >
            {isLoading ? (
              <>
                <span style={{
                  width: "16px", height: "16px",
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTopColor: "white",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                  display: "inline-block",
                }} />
                Creating…
              </>
            ) : (
              <>
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>rocket_launch</span>
                Create Business & Continue
              </>
            )}
          </button>
        </form>

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    </div>
  );
}
