from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import jwt
# Import the settings object from our new core config file
from ..core.config import settings

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Generates a new JWT access token.
    
    Args:
        data: The data to encode in the token (typically the user's identifier).
        expires_delta: An optional timedelta object to override the default expiration time.
        
    Returns:
        The encoded JWT string.
    """
    to_encode = data.copy()
    
    # Set the token's expiration time
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        # Use the expiration time from our settings file for consistency
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    
    # Encode the token using the secret key and algorithm from our settings
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt
