# backend/main.py
# PASTE THIS ENTIRE CODE BLOCK INTO THE FILE

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db import models
from .db.database import engine
from .routers import auth, admin, bot # Import your router files

# This ensures all database tables are created on startup
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Naukri Bot API",
    version="1.0.0",
)

# Set up CORS to allow your frontend to communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows all origins for simplicity
    allow_credentials=True,
    allow_methods=["*"], # Allows all methods (GET, POST, etc.)
    allow_headers=["*"], # Allows all headers
)

# Include the routers into the main application.
# Notice there are no 'prefix' arguments here.
app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(bot.router)

@app.get("/", tags=["Root"])
def read_root():
    """A simple endpoint to confirm the API is running."""
    return {"message": "Welcome to the Naukri Bot API!"}