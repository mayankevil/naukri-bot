from passlib.context import CryptContext

# Set up the password hashing context, specifying bcrypt as the scheme.
# This is a standard and secure way to handle password hashing.
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies a plain-text password against a hashed password.
    
    Args:
        plain_password: The password entered by the user.
        hashed_password: The password stored in the database.
        
    Returns:
        True if the passwords match, False otherwise.
    """
    return pwd_context.verify(plain_password, hashed_password)

def hash_password(password: str) -> str:
    """
    Hashes a plain-text password using the bcrypt algorithm.
    
    Args:
        password: The plain-text password to hash.
        
    Returns:
        The hashed password string.
    """
    return pwd_context.hash(password)
