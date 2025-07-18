#!/bin/bash

# Function to kill processes on a given port
kill_process_on_port() {
    PORT=$1
    # Find the PID of the process using the specified port
    PID=$(lsof -t -i:$PORT)

    if [ -n "$PID" ]; then
        echo "Killing process $PID on port $PORT"
        kill -9 $PID
    else
        echo "No process found on port $PORT"
    fi
}

# Stop all services
echo "🧹 Stopping all related services..."
kill_process_on_port 8000 # FastAPI backend
kill_process_on_port 5173 # Vite frontend
pkill -f "celery" # Kill Celery workers
echo "✅ Services stopped."

# Backend setup
echo "📦 Setting up backend virtual environment and dependencies..."
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
echo "✅ Backend setup complete."

# ----------------- ADDITION -----------------
# Install system dependencies for Playwright
echo "⚙️ Installing system dependencies for Playwright..."
sudo apt-get install -y libgstcodecparsers-1.0-0 gstreamer1.0-libav libavif13 libx264-163 libflite1
echo "✅ System dependencies installed."
# --------------------------------------------

# Playwright setup
echo "🧠 Installing Playwright browser..."
playwright install
echo "✅ Playwright setup complete."

# Ensure migrations directory exists before running alembic
echo "📁 Checking for migrations directory..."
if [ ! -d "backend/db/migrations" ]; then
    echo "Directory not found. Creating backend/db/migrations..."
    mkdir -p backend/db/migrations
fi
echo "✅ Migrations directory check complete."


# Database migrations
echo "🔧 Running database migrations..."
alembic upgrade head
echo "✅ Database is up to date."

# Frontend setup
echo "🎨 Setting up frontend dependencies..."
(cd frontend && npm install)
echo "✅ Frontend setup complete."

# Start services in the background
echo "🚀 Starting all services..."

# Start Celery worker in a new terminal or as a background process
echo "Starting Celery worker..."
celery -A backend.core.celery_app worker --loglevel=info &
CELERY_PID=$!
sleep 5 # Give celery a moment to start up

# Start FastAPI server in the background
echo "Starting FastAPI backend..."
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
sleep 5 # Give backend a moment to start up

# Start Frontend dev server
echo "Starting frontend..."
(cd frontend && npm run dev) &
FRONTEND_PID=$!

echo "🎉 All services are up and running!"
echo "Backend available at http://localhost:8000"
echo "Frontend available at http://localhost:5173"

# Keep the script running to see logs, or remove this to let them run in the background
wait