# This file defines scheduled tasks that run automatically.

from ..core.celery_app import celery_app
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

