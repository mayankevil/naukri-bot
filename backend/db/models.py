from sqlalchemy import Boolean, Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    profile = relationship("Profile", back_populates="owner", uselist=False, cascade="all, delete-orphan")
    applied_jobs = relationship("AppliedJob", back_populates="owner", cascade="all, delete-orphan")
    recommended_jobs = relationship("RecommendedJob", back_populates="owner", cascade="all, delete-orphan")

class Profile(Base):
    __tablename__ = "profiles"
    id = Column(Integer, primary_key=True, index=True)
    naukri_username = Column(String, index=True)
    naukri_password = Column(String)
    keywords = Column(String)
    locations = Column(String)
    notice_period = Column(String)
    ctc = Column(String)
    resume_path = Column(String)
    blacklisted_companies = Column(String)
    blacklisted_keywords = Column(String)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    owner = relationship("User", back_populates="profile")

class AppliedJob(Base):
    __tablename__ = "applied_jobs"
    id = Column(Integer, primary_key=True, index=True)
    job_title = Column(String, index=True)
    company_name = Column(String, index=True)
    job_link = Column(String)
    applied_date = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    owner = relationship("User", back_populates="applied_jobs")

class RecommendedJob(Base):
    __tablename__ = "recommended_jobs"
    id = Column(Integer, primary_key=True, index=True)
    job_title = Column(String, index=True)
    company_name = Column(String, index=True)
    job_link = Column(String, unique=True)
    matched_keyword = Column(String, index=True)
    recommended_date = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    owner = relationship("User", back_populates="recommended_jobs")
