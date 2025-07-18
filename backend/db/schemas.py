from pydantic import BaseModel, ConfigDict, EmailStr, SecretStr
from typing import List, Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    username: str

class UserCreate(UserBase):
    password: SecretStr

class User(UserBase):
    id: int
    is_active: bool
    is_superuser: bool
    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class Profile(BaseModel):
    naukri_username: Optional[str] = None
    naukri_password: Optional[str] = None
    keywords: Optional[str] = None
    locations: Optional[str] = None
    notice_period: Optional[str] = None
    ctc: Optional[str] = None
    resume_path: Optional[str] = None
    blacklisted_companies: Optional[str] = None
    blacklisted_keywords: Optional[str] = None

class AppliedJobBase(BaseModel):
    job_title: str
    company_name: str
    job_link: str

class AppliedJobCreate(AppliedJobBase):
    applied_date: datetime

class AppliedJob(AppliedJobBase):
    id: int
    user_id: int
    applied_date: datetime
    model_config = ConfigDict(from_attributes=True)

class RecommendedJobBase(BaseModel):
    job_title: str
    company_name: str
    job_link: str
    matched_keyword: str

class RecommendedJobCreate(RecommendedJobBase):
    pass

class RecommendedJob(RecommendedJobBase):
    id: int
    user_id: int
    recommended_date: datetime
    model_config = ConfigDict(from_attributes=True)
