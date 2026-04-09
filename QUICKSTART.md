# 🚀 AEGIS Quick Launch Guide

## ⚡ Super Quick Start (5 minutes)

### Windows Users - One Click Start

1. **Double-click**: `run_all.bat`
2. **Wait 10 seconds** for all windows to open
3. **Open browser**: http://localhost:5173
4. **Done!** 🎉

### Manual Start (If batch fails)

**Terminal 1 - Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn api.server:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend/aegis-ui
npm install
npm run dev
```

**Terminal 3 - Simulation:**
```bash
cd backend
python main.py
```

Then open: http://localhost:5173

---

## 📋 System Checklist

After launch, verify:
- ✅ Backend server running (port 8000)
- ✅ Frontend loaded (port 5173)
- ✅ Status badge shows 🔵 LIVE (WebSocket connected)
- ✅ 3 drones visible on radar
- ✅ Events appearing in log
- ✅ Drones moving toward disasters

---

## 🎮 How to Use

### Radar Interaction
- **Click anywhere** on the radar to deploy SOS signal
- **Watch** drones respond and move to location
- **Monitor** telemetry panel for drone status

### Understanding the UI
- **Header**: Live connection status & drone/target count
- **Left Panel**: Alert system with event log
- **Center**: Interactive radar visualization
- **Right Panel**: Real-time telemetry data
- **Bottom**: System status & timestamp

---

## 🔴 Troubleshooting

### "Connection Error" appears
```
Solution: Make sure backend is running
Run: http://localhost:8000/health in browser
Should return: {"status": "ok", ...}
```

### "Port 8000 already in use"
```bash
# Find process using port 8000
netstat -ano | findstr :8000

# Kill it
taskkill /PID <PID> /F

# Or use different port
uvicorn api.server:app --port 8001
```

### Frontend won't load
```bash
cd frontend/aegis-ui
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### No npm found
```
Download Node.js from nodejs.org
Install it
Restart terminals
```

---

## 📱 What Happens

1. **System boots** with loading screen
2. **Drones spawn** at corners of grid
3. **Random disasters** appear (fire, flood, collapse)
4. **AI makes decisions** - assigns drones to nearest targets
5. **Drones move** step-by-step toward targets
6. **Disaster resolves** when drone reaches it
7. **Click radar** to manually trigger SOS
8. **All events logged** in real-time

---

## 🌐 Network Connections

- **Frontend → Backend**: WebSocket (real-time) + HTTP polling (fallback)
- **Simulation → Backend**: HTTP POST (state updates every 300ms)
- **Backend → WebSocket Clients**: Broadcast (all connected browsers)

---

## ⚙️ Default Configuration

- Grid Size: 10×10
- Drones: 3
- Update Interval: 300ms
- Disaster Chance: 15% per step
- Max Event Log: 30 events

---

## 🎓 Learning Resources Included

- `README.md`: Full system documentation
- `SETUP.md`: Detailed setup guide
- `backend/`: AI/path-planning logic
- `frontend/`: React components & styling
- All code fully commented

---

## 📞 Support

If something breaks:
1. Check terminal output for errors
2. Verify all three services running (backend, frontend, simulation)
3. Check http://localhost:8000/health
4. Read README.md for detailed info

---

**Enjoy AEGIS! 🚁⚡**
