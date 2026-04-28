"""
Database engine configuration — supports SQLite (dev) and MySQL (production).
"""
import logging
from sqlmodel import create_engine, SQLModel, Session
from app.core.config import settings

logger = logging.getLogger(__name__)

# SQLite doesn't support connection pool options
_is_sqlite = settings.DATABASE_URL.startswith("sqlite")

if _is_sqlite:
    # check_same_thread=False is required for SQLite with FastAPI
    engine = create_engine(
        settings.DATABASE_URL,
        echo=settings.DEBUG,
        connect_args={"check_same_thread": False},
    )
else:
    engine = create_engine(
        settings.DATABASE_URL,
        echo=settings.DEBUG,
        pool_pre_ping=True,   # Re-check connections before use
        pool_recycle=3600,    # Recycle connections every hour
        pool_size=10,
        max_overflow=20,
    )


def init_db() -> None:
    """Create all tables on startup (idempotent)."""
    # Import all models so SQLModel registers their metadata
    from app.models.user import User  # noqa: F401
    from app.models.business import Business  # noqa: F401
    from app.models.plan import Plan  # noqa: F401
    from app.models.coupon import Coupon  # noqa: F401
    from app.models.payment_config import PaymentConfig  # noqa: F401
    from app.models.rule import ConversationRule  # noqa: F401
    from app.models.capability import Capability  # noqa: F401
    from app.models.api_key_vault import ApiKeyVault  # noqa: F401
    from app.models.agent_version import AgentVersion  # noqa: F401
    from app.models.session import ChatSession  # noqa: F401
    from app.models.log_entry import LogEntry  # noqa: F401

    SQLModel.metadata.create_all(engine)
    logger.info("Database tables initialised.")


def get_session():
    """FastAPI dependency that yields a SQLModel session."""
    with Session(engine) as session:
        yield session
