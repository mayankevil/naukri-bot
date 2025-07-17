import asyncio
from bot_engine.apply_bot import apply_to_jobs_naukri
from backend.db.database import SessionLocal
from backend.db.models import User, UserProfile

def run_bot_for_user(user_id):
    db = SessionLocal()
    user = db.query(User).filter(User.id == user_id).first()
    profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()

    if not profile:
        print(f"❌ No profile found for user {user.username}")
        return

    asyncio.run(apply_to_jobs_naukri(
        username=profile.naukri_email,
        password=profile.naukri_password,
        keywords=profile.keywords,
        location=profile.preferred_locations,
        user_id=user.id
    ))
