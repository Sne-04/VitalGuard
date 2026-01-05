#!/bin/bash

echo "🚀 Setting up VitalGuard AI..."
echo ""

# 1. Setup ML Models
echo "📊 Setting up ML models..."
cd ml-models
pip3 install -r requirements.txt
echo "✅ ML dependencies installed"
echo ""

# Generate sample dataset
echo "📁 Generating sample dataset..."
python3 src/create_dataset.py
echo "✅ Dataset created"
echo ""

# 2. Setup Backend
echo "⚙️ Setting up backend..."
cd ../backend
npm install
echo "✅ Backend dependencies installed"
echo ""

# 3. Setup Frontend
echo "🎨 Setting up frontend..."
cd ../frontend
npm install
echo "✅ Frontend dependencies installed"
echo ""

# 4. Setup Flask ML API
echo "🧠 Setting up ML API..."
cd ../backend/services
pip3 install flask flask-cors axios
echo "✅ ML API dependencies installed"
echo ""

cd ../../

echo ""
echo "✨ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Start backend:     cd backend && npm run dev"
echo "2. Start ML API:      cd backend/services && python3 ml_api.py"
echo "3. Start frontend:    cd frontend && npm run dev"
echo ""
echo "🌐 Access the app at: http://localhost:5173"
echo ""
