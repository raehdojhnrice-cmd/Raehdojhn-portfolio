#!/bin/bash
# CareerOps — start everything with one command
set -e

echo "⚡ CareerOps Startup"
echo "===================="

# Check Python
if ! command -v python3 &>/dev/null; then
  echo "❌ Python 3 required. Install from python.org"
  exit 1
fi

# Check Node
if ! command -v node &>/dev/null; then
  echo "❌ Node.js required. Install from nodejs.org"
  exit 1
fi

# Install Python deps
if [ ! -d "backend/.venv" ]; then
  echo "📦 Setting up Python virtualenv..."
  python3 -m venv backend/.venv
  source backend/.venv/bin/activate
  pip install -q -r backend/requirements.txt
  playwright install chromium
else
  source backend/.venv/bin/activate
fi

# Install Node deps
if [ ! -d "node_modules" ]; then
  echo "📦 Installing Node dependencies..."
  npm install --silent
fi

# Start backend in background
echo "🐍 Starting Python backend on http://localhost:8000 ..."
cd backend
python main.py &
BACKEND_PID=$!
cd ..

# Wait for backend to be ready
sleep 2

# Start Next.js
echo "⚡ Starting Next.js on http://localhost:3000 ..."
echo ""
echo "Open http://localhost:3000 in your browser"
echo "Mobile: open http://$(ipconfig getifaddr en0 2>/dev/null || hostname -I | awk '{print $1}'):3000"
echo ""
npm run dev &
FRONTEND_PID=$!

# Cleanup on exit
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT
wait $FRONTEND_PID
