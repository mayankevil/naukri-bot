from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

# Import all the necessary components from our redesigned structure
from ..db import crud, schemas
from ..db.database import get_db
from ..auth import jwt_handler, password_utils
from ..auth.dependencies import get_current_active_user
from ..core.config import settings

router = APIRouter()

@router.post("/register", response_model=schemas.User, status_code=status.HTTP_201_CREATED)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """
    Endpoint to register a new user.
    It checks if a user with the same username already exists to prevent duplicates.
    """
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Username already registered"
        )
    return crud.create_user(db=db, user=user)

@router.post("/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    Endpoint to handle user login.
    It verifies the username and password and returns a JWT access token if successful.
    """
    user = crud.get_user_by_username(db, username=form_data.username)
    # Verify the user exists and the password is correct
    if not user or not password_utils.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create the access token with an expiration time from our settings
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = jwt_handler.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/profile", response_model=schemas.User)
def read_users_me(current_user: schemas.User = Depends(get_current_active_user)):
    """
    Endpoint to get the profile of the currently logged-in user.
    It's protected by the get_current_active_user dependency.
    """
    return current_user
