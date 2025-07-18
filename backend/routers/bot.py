from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List

# Import all the necessary components from our redesigned structure
from ..db import crud, schemas
from ..db.database import get_db
from ..auth.dependencies import get_current_active_user
from ..tasks import run_bot_task

router = APIRouter()

@router.post("/run")
def run_bot(
    background_tasks: BackgroundTasks, 
    current_user: schemas.User = Depends(get_current_active_user)
):
    """
    Endpoint to start the bot for the currently logged-in user.
    It uses BackgroundTasks to run the bot asynchronously, so the API
    can return an immediate response to the frontend.
    """
    # The actual bot logic is now a Celery task, which is added to the background.
    background_tasks.add_task(run_bot_task.run_naukri_bot_for_user, user_id=current_user.id)
    return {"message": "Naukri bot task has been started in the background."}

@router.get("/applied-jobs", response_model=List[schemas.AppliedJob])
def get_applied_jobs(
    db: Session = Depends(get_db), 
    current_user: schemas.User = Depends(get_current_active_user)
):
    """
    Endpoint to retrieve the list of jobs the bot has applied to
    for the currently logged-in user.
    """
    return crud.get_applied_jobs(db=db, user_id=current_user.id)

@router.get("/recommend", response_model=List[schemas.RecommendedJob])
def get_recommendations(
    db: Session = Depends(get_db), 
    current_user: schemas.User = Depends(get_current_active_user)
):
    """
    Endpoint to retrieve the list of jobs recommended for the
    currently logged-in user.
    """
    # Note: The actual process of finding recommendations should be a
    # separate background task. This endpoint simply retrieves the
    # results that have been saved to the database.
    return crud.get_recommended_jobs(db=db, user_id=current_user.id)
