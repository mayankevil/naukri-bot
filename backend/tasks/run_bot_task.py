from backend.celery_app import celery_app
from bot_engine.run_for_user import run_bot_for_user

@celery_app.task
def run_naukri_bot_async(user_id):
    run_bot_for_user(user_id)
    return {"msg": f"Bot executed for user {user_id}"}
