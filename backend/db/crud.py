from sqlalchemy.orm import Session
from . import models, schemas
from ..auth.password_utils import hash_password

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = hash_password(user.password.get_secret_value())
    db_user = models.User(email=user.email, username=user.username, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_applied_jobs(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.AppliedJob).filter(models.AppliedJob.user_id == user_id).offset(skip).limit(limit).all()

def create_applied_job(db: Session, job: schemas.AppliedJobCreate, user_id: int):
    db_job = models.AppliedJob(**job.model_dump(), user_id=user_id)
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

def get_recommended_jobs(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.RecommendedJob).filter(models.RecommendedJob.user_id == user_id).offset(skip).limit(limit).all()

def create_recommended_job(db: Session, job: schemas.RecommendedJobCreate, user_id: int):
    existing_job = db.query(models.RecommendedJob).filter(models.RecommendedJob.job_link == job.job_link, models.RecommendedJob.user_id == user_id).first()
    if existing_job:
        return existing_job
    db_job = models.RecommendedJob(**job.model_dump(), user_id=user_id)
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job
