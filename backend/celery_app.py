from celery import Celery
from celery.schedules import crontab

celery_app = Celery(
    "naukri_bot",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/0"
)

celery_app.conf.beat_schedule = {
    "send-weekly-report": {
        "task": "backend.tasks.weekly_report.send_weekly_reports",
        "schedule": crontab(minute=0, hour=9, day_of_week=0),  # Sunday 9:00 AM
    }
}

celery_app.conf.timezone = "Asia/Kolkata"
