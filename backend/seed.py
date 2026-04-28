from sqlmodel import Session, select
from app.core.db import engine, init_db
from app.models.business import Business
from app.models.user import User
from app.services.auth_service import get_password_hash
import uuid

def seed_data():
    print("Initializing database...")
    init_db()
    
    with Session(engine) as session:
        # 1. Create a test user
        existing_user = session.exec(select(User).where(User.email == "test@flint.digital")).first()
        if not existing_user:
            print("Creating test user...")
            existing_user = User(
                email="test@flint.digital",
                full_name="Test Owner",
                hashed_password=get_password_hash("password123"),
                email_verified=True
            )
            session.add(existing_user)
            session.commit()
            session.refresh(existing_user)
        else:
            print(f"Test user already exists: {existing_user.id}")

        # 2. Check if we already have a business for this user
        existing_business = session.exec(select(Business).where(Business.owner_id == existing_user.id)).first()
        if existing_business:
            print(f"Database already seeded. Existing business ID: {existing_business.id}")
            return

        print("Seeding test business...")
        test_business = Business(
            owner_id=existing_user.id,
            name="Flint Digital",
            description="A premium AI-first digital agency focused on seamless integrations.",
            agent_id="flint-agent-" + str(uuid.uuid4())[:8],
            ai_config={
                "provider": "google",
                "model": "gemini-1.5-flash",
                "api_key_source": "platform"
            },
            onboarding_step=9,
            onboarding_completed=True,
            agent_status="sandbox"
        )
        
        session.add(test_business)
        session.commit()
        session.refresh(test_business)
        
        print(f"Successfully seeded!")
        print(f"USER_EMAIL: test@flint.digital")
        print(f"PASSWORD: password123")
        print(f"BUSINESS_ID: {test_business.id}")
        print(f"AGENT_ID: {test_business.agent_id}")

if __name__ == "__main__":
    seed_data()
