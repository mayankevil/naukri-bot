from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import os

# Import all the necessary components from our redesigned structure
from .core.config import settings
from .db.database import engine, SessionLocal
from .db import models, schemas, crud
from .routers import auth as auth_router, bot as bot_router, admin as admin_router

# Check if the database file exists. If not, create all tables.
# This is safer than just creating them on every run.
db_file = settings.DATABASE_URL.split("///")[-1]
if not os.path.exists(db_file):
    print("INFO: Database not found, creating all tables...")
    models.Base.metadata.create_all(bind=engine)
    print("INFO: Tables created successfully.")

app = FastAPI(
    title="Naukri Auto Apply Bot API",
    description="API for automating job applications on Naukri.com",
    version="1.0.0",
)

@app.on_event("startup")
def create_first_admin_user():
    """
    This function runs once when the FastAPI application starts.
    It checks if any users exist in the database. If not, it creates
    a default admin user based on the credentials in your settings.
    """
    db = SessionLocal()
    try:
        user = crud.get_user_by_username(db, username=settings.FIRST_ADMIN_USER)
        if not user:
            print("--- No users found. Creating default admin user. ---")
            user_in = schemas.UserCreate(
                email=settings.FIRST_ADMIN_EMAIL,
                username=settings.FIRST_ADMIN_USER,
                password=settings.FIRST_ADMIN_PASSWORD
            )
            user = crud.create_user(db=db, user=user_in)
            user.is_superuser = True
            db.add(user)
            db.commit()
            print("✅ Default admin user created successfully.")
            print(f"   - Username: {settings.FIRST_ADMIN_USER}")
            print(f"   - Password: {settings.FIRST_ADMIN_PASSWORD}")
            print("--------------------------------------------------")
    finally:
        db.close()

# This is a crucial security feature that allows your frontend (on a different port)
# to make requests to your backend.
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# This file defines scheduled tasks that run automatically.

# This is correct
from .core.celery_app import celery_app
from celery.schedules import crontab

# This is a special Celery signal that runs after the app is configured.
# It's the standard place to define your periodic task schedule.
@celery_app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    """
    Sets up the schedule for periodic tasks.
    """
    # This schedules the 'send_weekly_report' task to run every Monday at 7:30 AM.
    # You can customize the schedule by changing the crontab values.
    sender.add_periodic_task(
        crontab(hour=7, minute=30, day_of_week=1),
        send_weekly_report.s(),
        name='send weekly user reports',
    )

@celery_app.task
def send_weekly_report():
    """
    This is the actual task that will be run on the schedule.
    It should contain the logic to generate and email reports to users.
    """
    # --- Placeholder Logic ---
    # In a real application, you would:
    # 1. Create a database session.
    # 2. Get a list of all users.
    # 3. For each user, get their applied jobs for the last week.
    # 4. Generate an HTML report from a template.
    # 5. Use an email utility to send the report.
    
    print("--------------------------------------------------")
    print("INFO: Running scheduled task: Sending weekly reports...")
    # Add your report generation and sending logic here.
    print("INFO: Weekly reports task finished.")
    print("--------------------------------------------------")


# Include all the API routers for your application
app.include_router(auth_router.router, prefix="/auth", tags=["Authentication"])
app.include_router(bot_router.router, prefix="/bot", tags=["Bot Actions"])
app.include_router(admin_router.router, prefix="/admin", tags=["Admin"])


@app.get("/", tags=["Root"])
def read_root():
    """
    A simple root endpoint to confirm that the API is running.
    """
    return {"message": "Welcome to the Naukri Auto Apply Bot API"}
