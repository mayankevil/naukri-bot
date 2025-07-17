from backend.db.database import SessionLocal
from backend.db.models import User, UserProfile, RecommendedJob
import random

def generate_recommendations_for_user(user_id):
    db = SessionLocal()
    user = db.query(User).filter(User.id == user_id).first()
    profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()

    keywords = profile.keywords.split(",")
    blacklist = profile.blacklisted_keywords.split(",") if profile.blacklisted_keywords else []

    sample_jobs = [
        {"title": "Python Developer", "company": "Infosys", "location": "Noida", "url": "https://naukri.com/view-job/123"},
        {"title": "Data Analyst", "company": "TCS", "location": "Remote", "url": "https://naukri.com/view-job/456"},
        {"title": "React Developer", "company": "Wipro", "location": "Delhi", "url": "https://naukri.com/view-job/789"},
        {"title": "ML Engineer", "company": "Accenture", "location": "Remote", "url": "https://naukri.com/view-job/999"}
    ]

    db.query(RecommendedJob).filter_by(user_id=user.id).delete()

    for job in sample_jobs:
        if any(k.lower() in job["title"].lower() for k in keywords) and \
           not any(b.lower() in job["title"].lower() for b in blacklist):
            match = next((k for k in keywords if k.lower() in job["title"].lower()), "")
            db.add(RecommendedJob(
                user_id=user.id,
                job_title=job["title"],
                company=job["company"],
                location=job["location"],
                job_url=job["url"],
                experience="2-4 yrs",
                matched_keyword=match
            ))

    db.commit()
    db.close()
