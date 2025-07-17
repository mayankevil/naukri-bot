from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, FileResponse

from backend.db.database import create_db
from backend.routers import auth, bot

app = FastAPI(title="Naukri Auto Apply Bot API")

# ✅ Routers
app.include_router(auth.router)
app.include_router(bot.router)

# ✅ Create DB on startup
@app.on_event("startup")
async def startup():
    create_db()

# ✅ Root endpoint to avoid 404
@app.get("/", response_class=HTMLResponse)
async def root():
    return "<h2>🚀 Naukri Auto Apply Bot is Running</h2><p>Visit <code>/docs</code> for API docs.</p>"

# ✅ (Optional) Favicon handler
@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return FileResponse("static/favicon.ico")  # Ensure this file exists

# ✅ CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Change to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
