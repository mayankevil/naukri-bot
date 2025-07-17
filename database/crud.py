from backend.db.models import AppliedJob
from backend.db.database import SessionLocal

def log_applied_job(user_id, job_title, company, url):
    db = SessionLocal()
    exists = db.query(AppliedJob).filter_by(user_id=user_id, job_url=url).first()
    if exists:
        return  # Already applied, skip
    job = AppliedJob(
        user_id=user_id,
        job_title=job_title,
        company_name=company,
        job_url=url
    )
    db.add(job)
    db.commit()
    db.close()
