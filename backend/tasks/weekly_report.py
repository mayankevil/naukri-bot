from backend.celery_app import celery_app
from backend.db.database import SessionLocal
from backend.db.models import User, AppliedJob
from backend.utils.email_sender import send_email

@celery_app.task
def send_weekly_reports():
    db = SessionLocal()
    users = db.query(User).all()

    for user in users:
        jobs = db.query(AppliedJob).filter(AppliedJob.user_id == user.id).all()
        if not jobs:
            continue

        body = f"📝 Job Application Report for {user.username}:\n\n"
        for job in jobs:
            body += f"• {job.job_title} at {job.company_name}\n  {job.job_url}\n  Applied: {job.applied_at.strftime('%Y-%m-%d %H:%M')}\n\n"

        send_email(user.email, "NaukriBot - Weekly Report", body)

    db.close()
