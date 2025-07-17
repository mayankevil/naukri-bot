from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from backend.db.database import Base

# ... your User and UserProfile models here ...

class RecommendedJob(Base):
    __tablename__ = "recommended_jobs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    job_title = Column(String)
    company = Column(String)
    location = Column(String)
    experience = Column(String)
    job_url = Column(String)
    matched_keyword = Column(String)

    user = relationship("User", back_populates="recommended_jobs")


# And in your User model, make sure this is added:
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    profile = relationship("UserProfile", uselist=False, back_populates="user")
    recommended_jobs = relationship("RecommendedJob", back_populates="user")  # ✅ This line
    applied_jobs = relationship("AppliedJob", back_populates="user")
