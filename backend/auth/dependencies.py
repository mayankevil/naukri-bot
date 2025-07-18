from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from pydantic import ValidationError

# Import all the necessary components from our redesigned structure
from ..db.database import get_db
from ..db import models, schemas, crud
from ..core.config import settings

# This tells FastAPI how to find the token in requests.
# The tokenUrl points to the login endpoint in our auth router.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """
    Decodes the JWT token from the request to get the current user.
    This is the primary dependency for user authentication.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Decode the token using the secret key and algorithm from our settings
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        # Validate the token's data structure
        token_data = schemas.TokenData(username=username)
    except (JWTError, ValidationError):
        raise credentials_exception
    
    # Fetch the user from the database
    user = crud.get_user_by_username(db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

def get_current_active_user(current_user: models.User = Depends(get_current_user)):
    """
    A dependency that builds on get_current_user to also check if the user is active.
    """
    if not current_user.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user")
    return current_user

def get_current_admin_user(current_user: models.User = Depends(get_current_active_user)):
    """
    A dependency to protect admin-only routes. It checks if the user is a superuser.
    """
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges"
        )
    return current_user
