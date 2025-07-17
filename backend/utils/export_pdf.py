from jinja2 import Environment, FileSystemLoader
from xhtml2pdf import pisa
from backend.db.models import AppliedJob
from backend.db.database import SessionLocal
from datetime import datetime
import os

def export_applied_jobs_pdf(user):
    db = SessionLocal()
    jobs = db.query(AppliedJob).filter_by(user_id=user.id).all()
    db.close()

    env = Environment(loader=FileSystemLoader("backend/templates"))
    template = env.get_template("applied_jobs_template.html")

    html = template.render(
        username=user.username,
        jobs=[{
            "job_title": j.job_title,
            "company_name": j.company_name,
            "job_url": j.job_url,
            "applied_at": j.applied_at.strftime("%Y-%m-%d %H:%M")
        } for j in jobs]
    )

    filename = f"applied_jobs_{user.id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
    filepath = f"./exports/{filename}"
    os.makedirs("exports", exist_ok=True)

    with open(filepath, "wb") as f:
        pisa.CreatePDF(html, dest=f)

    return filepath
