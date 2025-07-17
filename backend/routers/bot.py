import os
from fastapi import APIRouter, Depends
from backend.auth.dependencies import get_current_user, get_db
from bot_engine.run_for_user import run_bot_for_user
from backend.tasks.run_bot_task import run_naukri_bot_async
from backend.db.models import AppliedJob
from backend.utils.email_sender import send_email
from fastapi.responses import FileResponse
from backend.utils.export_excel import export_applied_jobs_excel
from backend.utils.export_pdf import export_applied_jobs_pdf
from backend.utils.job_recommender import generate_recommendations_for_user
from backend.db.models import RecommendedJob

router = APIRouter()



@router.get("/recommended-jobs")
def get_recommended_jobs(user=Depends(get_current_user), db=Depends(get_db)):
    generate_recommendations_for_user(user.id)
    jobs = db.query(RecommendedJob).filter_by(user_id=user.id).all()
    return [{
        "title": j.job_title,
        "company": j.company,
        "location": j.location,
        "url": j.job_url,
        "match": j.matched_keyword,
        "experience": j.experience
    } for j in jobs]


@router.get("/download-pdf")
def download_pdf(user=Depends(get_current_user)):
    filepath = export_applied_jobs_pdf(user)
    return FileResponse(filepath, filename=os.path.basename(filepath), media_type="application/pdf")


@router.get("/download-excel")
def download_excel(user=Depends(get_current_user)):
    filepath = export_applied_jobs_excel(user.id)
    return FileResponse(filepath, filename=os.path.basename(filepath), media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")


@router.post("/email-report")
async def email_applied_jobs(user=Depends(get_current_user), db=Depends(get_db)):
    jobs = db.query(AppliedJob).filter_by(user_id=user.id).all()

    if not jobs:
        return {"msg": "No jobs to report."}

    body = f"📝 Job Application Report for {user.username}:\n\n"
    for job in jobs:
        body += f"• {job.job_title} at {job.company_name}\n  {job.job_url}\n  Applied: {job.applied_at.strftime('%Y-%m-%d %H:%M')}\n\n"

    await send_email(user.email, "NaukriBot - Job Application Report", body)
    return {"msg": "📧 Email sent successfully!"}


@router.get("/applied-jobs")
def get_applied_jobs(user=Depends(get_current_user), db=Depends(get_db)):
    jobs = db.query(AppliedJob).filter_by(user_id=user.id).all()
    return [{
        "job_title": j.job_title,
        "company": j.company_name,
        "url": j.job_url,
        "applied_at": j.applied_at
    } for j in jobs]


@router.post("/run-bot")
def run_bot(user=Depends(get_current_user)):
    run_bot_for_user(user.id)
    return {"msg": "Bot triggered successfully"}
def trigger_bot(user=Depends(get_current_user)):
    run_naukri_bot_async.delay(user.id)
    return {"msg": "Bot is now running in background"}
