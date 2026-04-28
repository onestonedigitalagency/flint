"""
AgentDeploy API — Production Entry Point

Registers all routers, middleware, and lifecycle events.
Uses FastAPI lifespan context for clean startup/shutdown.
"""
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.db import init_db

# ── Routers ────────────────────────────────────────────────────────────────
from app.routers import (
    auth,
    business,
    onboarding,
    plans,
    coupons,
    payment_config,
    capabilities,
    rules,
    vault,
    chat,
    voice,
    proxy,
    logs,
    versions,
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s — %(message)s",
)
logger = logging.getLogger(__name__)


# ── Lifespan ───────────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / shutdown lifecycle."""
    logger.info("⚡ AgentDeploy API starting up…")
    init_db()
    logger.info("✅ Database tables ready.")
    yield
    logger.info("🛑 AgentDeploy API shutting down.")


# ── App Instance ───────────────────────────────────────────────────────────
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "AgentDeploy: Deploy secure, grounded AI agents for any business. "
        "Full API documentation available below."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)


# ── CORS ───────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Register Routers ───────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(business.router)
app.include_router(onboarding.router)
app.include_router(plans.router)
app.include_router(coupons.router)
app.include_router(payment_config.router)
app.include_router(capabilities.router)
app.include_router(rules.router)
app.include_router(vault.router)
app.include_router(chat.router)
app.include_router(voice.router)
app.include_router(proxy.router)
app.include_router(logs.router)
app.include_router(versions.router)


# ── Health & Root ──────────────────────────────────────────────────────────
@app.get("/", tags=["Root"])
async def root():
    return {
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
        "docs": "/docs",
    }


@app.get("/health", tags=["Root"])
async def health():
    return {"status": "healthy", "version": settings.APP_VERSION}


# ── Global Exception Handler ───────────────────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.exception("Unhandled exception: %s", exc)
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred."},
    )
