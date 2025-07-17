from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from backend.db.database import SessionLocal
from backend.db import models
from backend.auth import password_utils, jwt_handler
from backend.auth.dependencies import get_current_user
from backend.utils.job_recommender import generate_recommendations_for_user

router = APIRouter()



class RegisterSchema(BaseModel):
    username: str
    email: str
    password: str
    is_admin: bool = False

class LoginSchema(BaseModel):
    username: str
    password: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



@router.get("/me")
def get_my_profile(user=Depends(get_current_user)):
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "is_admin": user.is_admin
    }


@router.post("/register")
def register_user(user: RegisterSchema, db: Session = Depends(get_db)):
    if db.query(models.User).filter_by(username=user.username).first():
        raise HTTPException(status_code=400, detail="Username exists")
    new_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=password_utils.hash_password(user.password),
        is_admin=user.is_admin
    )
    db.add(new_user)
    db.commit()
    return {"msg": "User registered"}

@router.post("/login")
def login_user(user: LoginSchema, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter_by(username=user.username).first()
    if not db_user or not password_utils.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = jwt_handler.create_access_token({"sub": user.username, "is_admin": db_user.is_admin})
    return {"access_token": token, "token_type": "bearer"}

class ProfileSchema(BaseModel):
    resume_path: str = None
    keywords: str
    notice_period: str
    current_ctc: str
    expected_ctc: str
    experience: str
    preferred_locations: str
    security_answers: str
    blacklisted_keywords: str = ''
    blacklisted_companies: str = ''


@router.post("/update-profile")
def update_user_profile(data: ProfileSchema, db=Depends(get_db), user=Depends(get_current_user)):
    existing = db.query(models.UserProfile).filter_by(user_id=user.id).first()
    if existing:
        for field, value in data.dict().items():
            setattr(existing, field, value)
    else:
        new_profile = models.UserProfile(user_id=user.id, **data.dict())
        db.add(new_profile)
    db.commit()

    # ✅ Trigger recommendation refresh
    generate_recommendations_for_user(user.id)

    return {"msg": "Profile updated and recommendations refreshed."}


@router.get("/profile")
def get_user_profile(user=Depends(get_current_user), db=Depends(get_db)):
    profile = db.query(models.UserProfile).filter_by(user_id=user.id).first()
    
    if not profile:
        raise HTTPException(404, "Profile not found")
    return {
        "resume_path": profile.resume_path,
        "keywords": profile.keywords,
        "notice_period": profile.notice_period,
        "current_ctc": profile.current_ctc,
        "expected_ctc": profile.expected_ctc,
        "experience": profile.experience,
        "preferred_locations": profile.preferred_locations,
        "security_answers": profile.security_answers,
        # In GET response
        "blacklisted_keywords": profile.blacklisted_keywords,
        "blacklisted_companies": profile.blacklisted_companies,

    }

@router.get("/admin/users")
def list_users(user=Depends(get_current_user), db=Depends(get_db)):
    if not user.is_admin:
        raise HTTPException(403, "Access denied")

    users = db.query(models.User).all()
    return [
        {
            "id": u.id,
            "username": u.username,
            "email": u.email,
            "is_admin": u.is_admin
        } for u in users
    ]
@router.post("/admin/create-user")
def admin_create_user(new_user: RegisterSchema, user=Depends(get_current_user), db=Depends(get_db)):
    if not user.is_admin:
        raise HTTPException(403, "Admins only")
    
    if db.query(models.User).filter_by(username=new_user.username).first():
        raise HTTPException(status_code=400, detail="Username already exists")
    
    u = models.User(
        username=new_user.username,
        email=new_user.email,
        hashed_password=password_utils.hash_password(new_user.password),
        is_admin=new_user.is_admin
    )
    db.add(u)
    db.commit()
    return {"msg": "User created"}




