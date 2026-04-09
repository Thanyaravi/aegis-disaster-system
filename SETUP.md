# 🚀 AEGIS System Setup Guide

## Step 1: Clone/Extract Project

```bash
cd AEGIS-DISASTER-SYSTEM
```

## Step 2: Backend Setup

### 2.1 Create Virtual Environment

**Windows:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
```

### 2.2 Install Dependencies

```bash
pip install -r requirements.txt
```

This installs:
- FastAPI & Uvicorn (REST API framework)
- PyTorch & YOLO (AI/Computer Vision)
- OpenCV (Image processing)
- Requests (HTTP client)

### 2.3 Start Backend Server

```bash
uvicorn api.server:app --reload --host 0.0.0.0 --port 8000
```

Expected output:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

✅ Backend Status: http://localhost:8000/health

## Step 3: Frontend Setup

### 3.1 Install Node Dependencies

```bash
cd frontend/aegis-ui
npm install
```

### 3.2 Start Development Server

```bash
npm run dev
```

Expected output:
```
  VITE v8.0.4  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Press q to quit
```

✅ Frontend Access: http://localhost:5173

## Step 4: Run Simulation

### 4.1 Start Simulation Loop

In a new terminal:

```bash
cd backend
python main.py
```

Expected output:
```
[INFO] Starting AEGIS Disaster Response Simulation...
[INFO] Ensure FastAPI server is running on http://localhost:8000
[INFO] Simulation running...
```

## Step 5: Verify System

### 5.1 Open Dashboard

Navigate to: http://localhost:5173

You should see:
- ⚡ AEGIS header
- Real-time radar display
- Telemetry panel
- Alert system
- Event log

### 5.2 Test Interactions

1. **Radar Click**: Click on the radar to trigger SOS
2. **Watch Drones**: Should see real-time movement
3. **Monitor Events**: Check event log for updates
4. **Check Connection**: Badge should show 🔵 LIVE

## ✅ Full System Checklist

- [ ] Backend running on port 8000
- [ ] Frontend running on port 5173
- [ ] WebSocket connected (green LIVE badge)
- [ ] Simulation loop started
- [ ] Radar displays 3 drones
- [ ] Random disasters appear
- [ ] Drones respond to disasters
- [ ] SOS button works
- [ ] Alert system triggers
- [ ] Event log updates
- [ ] Telemetry shows accurate data

## 🔧 Troubleshooting

### Port Already in Use

If port 8000 is busy:
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :8000
kill -9 <PID>
```

Then start backend on different port:
```bash
uvicorn api.server:app --host 0.0.0.0 --port 8001
```

### YOLO Model Download Issues

First run attempts to download yolov8n.pt (~50MB):
- Ensure stable internet connection
- ~100MB free disk space required
- If fails, download manually:

```bash
python -c "from ultralytics import YOLO; YOLO('yolov8n.pt')"
```

### WebSocket Connection Failing

1. Check backend is running: `http://localhost:8000/health`
2. Check firewall allows port 8000
3. Frontend will fallback to HTTP polling automatically

### npm install fails

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

## 📱 System Requirements

### Minimum
- CPU: Intel i5 or equivalent
- RAM: 8GB
- Disk: 500MB free space
- Network: Stable connection

### Recommended
- CPU: Intel i7 or equivalent
- RAM: 16GB+
- Disk: 2GB free space (for YOLO models)
- GPU: NVIDIA (for faster AI inference)

## 🎓 Understanding the System

### Startup Sequence

1. **Backend Server** (port 8000)
   - Loads FastAPI framework
   - Initializes WebSocket manager
   - Waits for connections

2. **Frontend** (port 5173)
   - Loads React application
   - Attempts WebSocket connection
   - Falls back to HTTP polling if needed

3. **Simulation** (backend/main.py)
   - Creates 3 drones
   - Starts continuous simulation loop
   - Injects random disasters
   - Pushes state to backend every 300ms

4. **UI Updates**
   - Receives state via WebSocket or HTTP
   - Renders radar with drone positions
   - Updates telemetry panel
   - Triggers alerts based on disasters

### Data Flow

```
Simulation Loop
     ↓
  main.py (300ms ticks)
     ↓
  POST /update
     ↓
FastAPI Server
     ↓
  WebSocket Broadcast
     ↓
Frontend React App
     ↓
Radar Visualization
```

## 📊 Monitoring

### Backend Logs

Check backend terminal for:
- Connection events
- Simulation steps
- WebSocket broadcasts
- Error messages

### Frontend Console

Press F12 in browser to see:
- JavaScript logs
- Network requests
- WebSocket messages
- Error traces

### Health Endpoint

Check system status:
```bash
curl http://localhost:8000/health
```

Response:
```json
{
  "status": "ok",
  "simulation": "running",
  "drones_active": 3,
  "targets": 2
}
```

## 🚀 Performance Tuning

### Reduce Latency

```python
# In backend/main.py
SIMULATION_STEP_TIME = 0.2  # 200ms (was 300ms)
```

### Increase Disaster Frequency

```python
if random.random() < 0.25:  # 25% chance per step (was 15%)
```

### Reduce Update Frequency

```python
# In frontend/src/App.jsx - polling interval
}, 300);  // 300ms (was 200ms)
```

## 🐳 Docker Deployment

### Create Dockerfile

```dockerfile
FROM python:3.11-slim
WORKDIR /app

# Backend setup
COPY backend/requirements.txt .
RUN pip install -r requirements.txt

# Frontend setup
COPY frontend/aegis-ui /frontend
WORKDIR /frontend
RUN npm install && npm run build

WORKDIR /app
COPY . .

CMD ["uvicorn", "api.server:app", "--host", "0.0.0.0"]
```

### Build & Run

```bash
docker build -t aegis .
docker run -p 8000:8000 aegis
```

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [A* Algorithm](https://en.wikipedia.org/wiki/A*_search_algorithm)
- [YOLOv8](https://github.com/ultralytics/ultralytics)

---

**Need help? Check logs and error messages first!**
