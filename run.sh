#!/bin/bash

# This command ensures that the script will exit immediately if any command fails.
set -e

# --- Function to kill old processes for a clean start ---
cleanup() {
    echo "🧹 Stopping all related services..."
    # The '|| true' is added to each command. This ensures that if a command fails
    # (e.g., because no process was found to kill), the script will not exit.
    lsof -t -i:8000 | xargs -r kill -9 || true
    lsof -t -i:5173 | xargs -r kill -9 || true
    pkill -f "celery -A backend.core.celery_app" || true
    pkill -f "vite" || true
    echo "✅ Services stopped."
}

# This "trap" ensures that the cleanup function is called when you stop the script with Ctrl+C.
trap 'cleanup; exit 130' INT

# --- Main Script ---

# Run cleanup at the start to ensure no old processes are running
cleanup

# --- Backend Setup ---
echo "📦 Setting up backend virtual environment and dependencies..."
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
echo "🧠 Installing Playwright browser..."
playwright install chromium

# --- Database Migration ---
echo "🔧 Running database migrations..."
# This command will create or update your database tables to match your models.
alembic upgrade head

# --- Redis Server ---
echo "🚀 Starting Redis server in the background..."
redis-server --daemonize yes
echo "🟢 Redis is running."

# --- Celery Services ---
echo "🎯 Launching Celery worker in the background..."
# The app path is updated to point to our new core directory.
# The -n flag gives the worker a unique name to prevent warnings.
celery -A backend.core.celery_app worker --loglevel=info -n worker1@%h &

echo "📅 Launching Celery Beat (scheduler) in the background..."
# Remove the old schedule file to prevent issues on restart
rm -f celerybeat-schedule
celery -A backend.core.celery_app beat --loglevel=info &

# --- Frontend Setup ---
echo "🛠 Setting up frontend dependencies..."
# Use a subshell to run commands in the frontend directory
(cd frontend && npm install)

# --- Start Development Servers ---
echo "🔥 Starting FastAPI backend server..."
# The --reload-dir flag is crucial to prevent the server from watching
# the frontend/node_modules directory, which causes instability.
uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload --reload-dir backend &

echo "🌐 Starting Frontend Dev Server..."
(cd frontend && npm run dev) &

echo -e "\n\n✅ All services are starting up. Please wait a moment for them to initialize."
echo "---------------------------------------------"
echo "🔹 Frontend:   http://127.0.0.1:5173"
echo "🔹 FastAPI:     http://127.0.0.1:8000"
echo "🔹 Redis:      Running"
echo "🔹 Celery:     Worker + Beat started"
echo "---------------------------------------------"

# The 'wait' command will pause the script here, keeping it alive.
# When you press Ctrl+C, the trap above will trigger the cleanup function.
wait
