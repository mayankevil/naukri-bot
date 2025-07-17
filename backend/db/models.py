from sqlalchemy import Column, Integer, String, Boolean
from backend.db.database import Base
from .database import Base
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy import DateTime, Text
from datetime import datetime

naukri_email = Column(String)
naukri_password = Column(String)  # store encrypted in future



class AppliedJob(Base):
    __tablename__ = "applied_jobs"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    job_title = Column(String)
    company_name = Column(String)
    job_url = Column(String)
    applied_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", backref="applied_jobs")


class UserProfile(Base):
    __tablename__ = "user_profiles"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    resume_path = Column(String, nullable=True)
    keywords = Column(String)
    notice_period = Column(String)
    current_ctc = Column(String)
    expected_ctc = Column(String)
    experience = Column(String)
    preferred_locations = Column(String)
    security_answers = Column(String)

    user = relationship("User", backref="profile")


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True)
    hashed_password = Column(String)
    is_admin = Column(Boolean, default=False)
    recommended_jobs = relationship("RecommendedJob", back_populates="user")

class RecommendedJob(Base):
    __tablename__ = "recommended_jobs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    job_title = Column(String)
    company = Column(String)
    location = Column(String)
    url = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="recommended_jobs")
