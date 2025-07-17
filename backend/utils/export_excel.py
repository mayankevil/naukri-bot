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


def export_applied_jobs_excel(user_id: int, db):
    from openpyxl import Workbook
    wb = Workbook()
    ws = wb.active
    ws.title = "Applied Jobs"
    ws.append(["Job Title", "Company", "Applied At"])

    # Sample DB logic — replace with real DB query if needed
    # jobs = db.query(AppliedJobs).filter(AppliedJobs.user_id == user_id).all()
    jobs = [
        {"title": "Python Developer", "company": "Tech Co.", "applied_at": "2025-07-16 10:00:00"},
        {"title": "Data Analyst", "company": "Biz Inc.", "applied_at": "2025-07-16 11:00:00"}
    ]

    for job in jobs:
        ws.append([job["title"], job["company"], job["applied_at"]])

    file_path = f"exported_jobs_user_{user_id}.xlsx"
    wb.save(file_path)
    return file_path
