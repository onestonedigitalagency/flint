import os
from sqlmodel import create_engine, SQLModel, Session
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./agent_deploy.db")

engine = create_engine(DATABASE_URL, echo=True)

def init_db():
    from app.models.business import Business
    from app.models.user import User
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
