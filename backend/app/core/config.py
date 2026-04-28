"""
Central application settings using pydantic-settings.
All environment variables are defined here — single source of truth.
"""
from functools import lru_cache
from typing import Literal
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── Application ───────────────────────────────────────────────
    APP_NAME: str = "AgentDeploy API"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: Literal["development", "staging", "production"] = "development"
    DEBUG: bool = True

    # ── Security ──────────────────────────────────────────────────
    SECRET_KEY: str = "change-this-secret-key-in-production-min-32-chars"
    # AES-256 key: must be exactly 32 bytes (base64-encoded)
    AES_ENCRYPTION_KEY: str = "base64_encoded_32_byte_key_here="
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60       # 1 hour
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # ── Database (MySQL) ──────────────────────────────────────────
    DATABASE_URL: str = "mysql+pymysql://flint_user:flint_password@localhost:3306/agent_deploy"

    # ── Redis (rate limiting) ─────────────────────────────────────
    REDIS_URL: str = "redis://localhost:6379/0"

    # ── AI Providers ──────────────────────────────────────────────
    # Primary provider config (platform default)
    AI_PRIMARY_PROVIDER: Literal["google", "anthropic", "openai"] = "google"
    AI_PRIMARY_MODEL: str = "gemini-1.5-flash"
    AI_FALLBACK_PROVIDER: Literal["google", "anthropic", "openai"] = "anthropic"
    AI_FALLBACK_MODEL: str = "claude-3-5-sonnet-20241022"

    GEMINI_API_KEY: str = ""
    ANTHROPIC_API_KEY: str = ""
    OPENAI_API_KEY: str = ""

    # ── Voice Providers ───────────────────────────────────────────
    DEEPGRAM_API_KEY: str = ""
    ELEVENLABS_API_KEY: str = ""
    GOOGLE_CLOUD_TTS_KEY: str = ""

    # ── Email (Resend) ────────────────────────────────────────────
    RESEND_API_KEY: str = ""
    EMAIL_FROM: str = "noreply@agentdeploy.io"
    EMAIL_FROM_NAME: str = "AgentDeploy"

    # ── Platform Owner ────────────────────────────────────────────
    PLATFORM_OWNER_EMAIL: str = "admin@agentdeploy.io"

    # ── Rate Limiting ─────────────────────────────────────────────
    WIDGET_RATE_LIMIT: str = "60/minute"   # End-user widget endpoints
    DASHBOARD_RATE_LIMIT: str = "200/minute"  # Dashboard API endpoints

    # ── CORS ──────────────────────────────────────────────────────
    # Comma-separated list of allowed origins
    CORS_ORIGINS: str = "*"

    @property
    def cors_origins_list(self) -> list[str]:
        if self.CORS_ORIGINS == "*":
            return ["*"]
        return [o.strip() for o in self.CORS_ORIGINS.split(",")]


@lru_cache
def get_settings() -> Settings:
    """Cached settings instance — call this everywhere."""
    return Settings()


# Convenience singleton
settings = get_settings()
