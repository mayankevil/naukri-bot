from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

# Import all the necessary components from our redesigned structure
from ..db import crud, schemas
from ..db.database import get_db
from ..auth.dependencies import get_current_admin_user

router = APIRouter()

@router.get("/users", response_model=List[schemas.User])
def read_users(
    db: Session = Depends(get_db), 
    current_user: schemas.User = Depends(get_current_admin_user)
):
    """
    Endpoint to retrieve a list of all users in the system.
    
    This endpoint is protected by the `get_current_admin_user` dependency,
    which ensures that only authenticated users with 'is_superuser' set to True
    can access it.
    """
    users = crud.get_users(db=db)
    return users

# In the future, you can add more admin-only endpoints here, such as:
# - An endpoint to update a user's details (e.g., make another user an admin).
# - An endpoint to delete a user.
# - An endpoint to view detailed activity for a specific user.
