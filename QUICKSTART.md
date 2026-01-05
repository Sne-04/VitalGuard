# VitalGuard AI - Quick Start Guide

## 🚀 Quick Setup (5 Minutes)

### Option 1: Automated Setup

```bash
chmod +x setup.sh
./setup.sh
```

### Option 2: Manual Setup

**1. ML Models**

```bash
cd ml-models
pip install -r requirements.txt
python src/create_dataset.py
```

**2. Backend**

```bash
cd backend
npm install
```

**3. Frontend**

```bash
cd frontend
npm install
```

**4. ML API Dependencies**

```bash
pip install flask flask-cors
```

---

## ▶️ Running the Application

You need to run 3 servers simultaneously:

### Terminal 1: Backend API

```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

### Terminal 2: ML API

```bash
cd backend/services
python ml_api.py
# Runs on http://localhost:5001
```

### Terminal 3: Frontend

```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

### Access the App

Open browser: **<http://localhost:5173>**

---

## 🧪 Quick Test

1. **Register** a new account
   - Email: <test@example.com>
   - Password: test123
   - Age: 30
   - Gender: Male

2. **Check Symptoms**
   - Click "Start Health Check"
   - Enter symptoms: fever, cough, fatigue
   - Duration: 3 days
   - Submit

3. **View Results**
   - See disease prediction
   - Check severity level
   - View 7-day risk timeline
   - See triage recommendation
   - Explore explanation

---

## 📊 Training ML Models (Optional)

For better accuracy, train with real datasets:

```bash
cd ml-models
jupyter notebook

# Open and run:
# - notebooks/01_data_exploration.ipynb
# - notebooks/02_disease_prediction.ipynb
# - notebooks/03_severity_classification.ipynb
```

Models will be saved to `ml-models/models/` directory.

---

## 🔧 Environment Variables

Backend `.env` is already configured with:

- ✅ MongoDB connection (your cluster)
- ✅ Gemini API key
- ✅ JWT secret

No additional configuration needed!

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process on port
lsof -ti:5000 | xargs kill
lsof -ti:5001 | xargs kill
lsof -ti:5173 | xargs kill
```

### MongoDB Connection Error

- Check internet connection
- Verify MongoDB Atlas whitelist includes your IP

### ML API Not Responding

- Ensure Flask is installed: `pip install flask flask-cors`
- Check port 5001 is available

---

## 📱 PWA Installation

Once frontend is running:

1. Open in Chrome/Edge
2. Click install icon in address bar
3. App will install on your device
4. Works offline!

---

## 🚀 Deployment

### Backend → Render

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect repository
4. Set environment variables
5. Deploy!

### Frontend → Vercel

```bash
cd frontend
vercel
```

### ML API → Render (Python)

1. Create new Python service
2. Set build command: `pip install -r requirements.txt`
3. Set start command: `python ml_api.py`

---

## 📞 Need Help?

Check the comprehensive walkthrough in:
`/Users/sauravkumar/.gemini/antigravity/brain/5da1145d-5f4a-48c6-a842-3f4d7663bd5e/walkthrough.md`

---

**Built with ❤️ using AI & Machine Learning**
