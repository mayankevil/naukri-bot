from celery import Celery
from .config import settings

celery_app = Celery(
    "tasks",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
    include=["backend.tasks.run_bot_task", "backend.tasks.weekly_report"]
)
celery_app.conf.update(task_track_started=True)
