# #!/bin/bash

# echo "♻️ Cleaning old virtual environment..."
# if [ -d "venv" ]; then
#     rm -rf venv
# fi

# echo "📦 Creating new virtual environment..."
# python3 -m venv venv
# source venv/bin/activate

# echo "⬇️ Installing Python dependencies..."
# pip install --upgrade pip

# if [ ! -f "requirements.txt" ]; then
#     echo "❌ requirements.txt not found! Exiting."
#     exit 1
# fi

# pip install -r requirements.txt

# echo "🧠 Installing Playwright Chromium..."
# if ! command -v playwright &> /dev/null; then
#     pip install playwright
# fi
# playwright install chromium

# echo "🔧 Creating database tables..."
# python3 -c "from backend.db.database import create_db; create_db()"

# echo "🧪 Checking for Redis installation..."
# if ! command -v redis-server &> /dev/null; then
#     echo "❌ Redis not found. Installing Redis..."
#     sudo apt update
#     sudo apt install redis-server -y
# else
#     echo "✅ Redis is already installed."
# fi

# echo "🚀 Starting Redis server..."
# sudo service redis-server start

# echo "📦 Checking Celery install..."
# if ! pip show celery &> /dev/null; then
#     pip install celery
# fi

# echo "📦 Checking Uvicorn install..."
# if ! pip show uvicorn &> /dev/null; then
#     pip install uvicorn
# fi

# # Frontend setup
# FRONTEND_DIR="frontend"
# if [ -d "$FRONTEND_DIR" ]; then
#     echo "💻 Setting up frontend dependencies..."
#     cd "$FRONTEND_DIR"

#     if [ ! -d "node_modules" ]; then
#         npm install
#     fi

#     # Ensure Tailwind CSS + Vite setup
#     npm install -D tailwindcss postcss autoprefixer vite

#     if [ ! -f "tailwind.config.js" ]; then
#         npx tailwindcss init -p
#     fi

#     cd ..
# else
#     echo "⚠️ Frontend directory not found at '$FRONTEND_DIR'. Skipping frontend setup."
# fi

# # 1. Install Vite locally in the project
# npm install vite --save-dev


# echo "🎯 Launching Celery worker..."
# celery -A backend.utils.celery_app.celery_app worker --loglevel=info &

# echo "📅 Launching Celery Beat..."
# celery -A backend.utils.celery_app.celery_app beat --loglevel=info &

# echo "🔥 Starting FastAPI server..."
# uvicorn backend.main:app --reload



#####################

###############

#!/bin/bash

echo "♻️ Cleaning old virtual environment..."
if [ -d "venv" ]; then
    rm -rf venv
fi

echo "📦 Creating new virtual environment..."
python3 -m venv venv
source venv/bin/activate

echo "⬇️ Installing Python dependencies..."
pip install --upgrade pip

if [ ! -f "requirements.txt" ]; then
    echo "❌ requirements.txt not found! Exiting."
    exit 1
fi

pip install -r requirements.txt

echo "🧠 Installing Playwright Chromium..."
if ! command -v playwright &> /dev/null; then
    pip install playwright
fi
playwright install chromium

echo "🔧 Creating database tables..."
python3 -c "from backend.db.database import create_db; create_db()"

echo "🧪 Checking for Redis installation..."
if ! command -v redis-server &> /dev/null; then
    echo "❌ Redis not found. Installing Redis..."
    sudo apt update
    sudo apt install redis-server -y
else
    echo "✅ Redis is already installed."
fi

echo "🚀 Starting Redis server..."
sudo service redis-server start
echo "🟢 Redis is running on: http://localhost:6379"

echo "📦 Checking and installing Celery..."
if ! pip show celery &> /dev/null; then
    pip install celery
fi

echo "📦 Checking and installing Uvicorn..."
if ! pip show uvicorn &> /dev/null; then
    pip install uvicorn
fi

# ======== Frontend Setup ========
echo "🛠 Setting up frontend..."
cd frontend

echo "📦 Installing React + Router + Axios + Tailwind + Vite..."
npm install react react-dom react-router-dom axios
npm install -D vite @vitejs/plugin-react tailwindcss postcss autoprefixer

# Init Tailwind config if not exists
if [ ! -f "tailwind.config.js" ]; then
    npx tailwindcss init -p
fi

# Force Tailwind content paths
echo "✅ Configuring Tailwind content paths..."
sed -i 's|content: .*|content: ["./index.html", "./src/**/*.{js,jsx}"],|' tailwind.config.js

# Ensure Tailwind directives in CSS
if ! grep -q "@tailwind base;" src/index.css; then
    echo -e "@tailwind base;\n@tailwind components;\n@tailwind utilities;" > src/index.css
fi

# Start Vite dev server
echo "🌐 Starting Frontend Dev Server..."
npm run dev &
echo "🟢 Frontend running at: http://localhost:5173"

cd ..

echo "🧹 Cleaning up old celerybeat schedule if exists..."
if [ -f "celerybeat-schedule" ]; then
    rm -f celerybeat-schedule
    echo "✅ Old celerybeat-schedule removed."
fi


# ======== Backend Services ========
echo "🎯 Launching Celery worker..."
celery -A backend.utils.celery_app.celery_app worker --loglevel=info &
echo "🟢 Celery Worker running"

echo "📅 Launching Celery Beat..."
celery -A backend.utils.celery_app.celery_app beat --loglevel=info &
echo "🟢 Celery Beat running"

# Start FastAPI
echo "🔥 Starting FastAPI server..."
uvicorn backend.main:app --reload &
echo "🟢 FastAPI running at: http://127.0.0.1:8000"

echo ""
echo "✅ All services are running:"
echo "---------------------------------------------"
echo "🔹 Frontend:   http://127.0.0.1:5173"
echo "🔹 FastAPI:    http://127.0.0.1:8000"
echo "🔹 Redis:      http://127.0.0.1:6379"
echo "🔹 Celery:     Worker + Beat started"
echo "---------------------------------------------"
