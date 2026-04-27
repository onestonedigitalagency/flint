from sqlmodel import Session, select
from app.core.db import engine, init_db
from app.models.business import Business
import uuid

def seed_data():
    print("Initializing database...")
    init_db()
    
    with Session(engine) as session:
        # Check if we already have a business
        existing = session.exec(select(Business)).first()
        if existing:
            print(f"Database already seeded. Existing business ID: {existing.id}")
            return

        print("Seeding test business...")
        test_business = Business(
            name="Flint Digital",
            description="A premium AI-first digital agency focused on seamless integrations.",
            plans_data=[
                {"name": "Starter", "price": "$99/mo", "features": ["Text AI", "Email Support"]},
                {"name": "Pro", "price": "$299/mo", "features": ["Voice AI", "24/7 Support", "Custom Branding"]}
            ],
            faq_data=[
                {"q": "How do I integrate the widget?", "a": "Copy the single-line script from your dashboard settings."},
                {"q": "Does it support voice?", "a": "Yes, the Pro plan includes real-time voice capabilities."}
            ],
            ai_config={"model": "gemini", "tone": "professional"}
        )
        
        session.add(test_business)
        session.commit()
        session.refresh(test_business)
        
        print(f"Successfully seeded!")
        print(f"BUSINESS_ID: {test_business.id}")
        print("Use this ID in your frontend requests.")

if __name__ == "__main__":
    seed_data()
