# 🚁 AEGIS - Autonomous Emergency Grid Intelligence System

**Premier Disaster Response Drone Network with AI Coordination**

![Status](https://img.shields.io/badge/Status-Production-brightgreen)
![Python](https://img.shields.io/badge/Python-3.9+-blue)
![React](https://img.shields.io/badge/React-19.2+-61dafb)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1+-009485)

## 🎯 Overview

AEGIS is a real-time AI-driven disaster response simulation integrating:
- **🖥️ Computer Vision**: YOLO-based perception for detecting disasters (fire, flood, collapse, persons)
- **🤖 Multi-Agent Coordination**: Intelligent drone agents for optimal task assignment
- **🛣️ Path Planning**: A* algorithm for obstacle-aware route planning
- **📡 Real-time Communication**: WebSocket + HTTP APIs for live state management
- **✨ Premium UI**: Iron Man-inspired futuristic dashboard with advanced visualizations

## 🏗️ Architecture

```
AEGIS-DISASTER-SYSTEM/
├── backend/
│   ├── api/
│   │   └── server.py           # FastAPI + WebSocket server
│   ├── core/
│   │   ├── agent.py            # Disaster agent decision logic
│   │   ├── path_planning.py     # A* pathfinding algorithm
│   │   ├── grid_engine.py       # Grid state management
│   │   └── yolo_engine.py       # YOLO detection engine
│   ├── main.py                 # Simulation loop
│   └── requirements.txt
|
└──docs/
|   └── index.html
└── frontend/
    └── aegis-ui/
        ├── src/
        │   ├── App.jsx                    # Main React component
        │   ├── App.css                    # Premium styling
        │   ├── index.css                  # Global styles
        │   ├── main.jsx                   # Entry point
        │   └── components/
        │       ├── RadarComponent.jsx     # Interactive radar visualization
        │       ├── RadarComponent.css
        │       ├── TelemetryPanel.jsx     # Drone telemetry dashboard
        │       ├── TelemetryPanel.css
        │       ├── AlertSystem.jsx        # Alert + event log system
        │       └── AlertSystem.css
        ├── package.json
        └── vite.config.js
```

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 18+
- npm or yarn

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start server (in one terminal)
uvicorn api.server:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

```bash
cd frontend/aegis-ui

# Install dependencies
npm install

# Start development server (in another terminal)
npm run dev
```

### Run Simulation

```bash
cd backend

# Start simulation in a third terminal
python main.py
```

### Access Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **WebSocket**: ws://localhost:8000/ws
- **Health Check**: http://localhost:8000/health

## 🎮 Features

### Core Capabilities

✅ **Real-Time Drone Coordination**
- 3 autonomous drones with dynamic assignment
- Adaptive path planning using A* algorithm
- Real-time status tracking (idle, en-route, active)

✅ **Disaster Detection & Response**
- Fire detection and response
- Flood detection and response
- Structure collapse detection
- Manual SOS triggering via UI

✅ **Advanced Visualization**
- Interactive radar with heat zone rendering
- Real-time drone tracking and path visualization
- Animated scan effects
- Alert animations and visual feedback

✅ **Live Telemetry Dashboard**
- Active drone status
- Target priority metrics
- Distance calculations
- Event logging (30 events max)

✅ **Alert System**
- Priority-based alerts (FIRE > COLLAPSE > FLOOD)
- Emergency state management
- Blinking indicators for critical states
- Comprehensive event log with timestamps

### Communication

✅ **WebSocket Support**
- Real-time bidirectional updates
- Automatic reconnection with exponential backoff
- SOS alert transmission
- State broadcasting to all clients

✅ **REST API**
- `/state` - Get current simulation state
- `/health` - System health check
- `/update` - Simulation state updates
- `/sos` - Manual SOS trigger

## 🤖 Simulation Details

### Disaster Types
- **🔥 Fire**: Priority 3 (highest)
- **⚠️ Collapse**: Priority 2
- **💧 Flood**: Priority 1
- **👤 Person**: Priority 0 (manual SOS)

### Drone Behavior
1. **Detection**: Random 15% chance per step for new disasters
2. **Assignment**: Nearest available drone assigned to each target
3. **Planning**: A* pathfinding with obstacle awareness
4. **Movement**: Step-by-step movement toward targets
5. **Resolution**: Disaster cleared when drone reaches target

### Update Cycle
- Step interval: 300ms
- Event log: Last 30 events
- Path recalculation: Per assignment
- Alert evaluation: Per detection update

## 🎨 UI/UX Highlights

### Iron Man Theme
- Dark sleek background (cyberpunk aesthetic)
- Neon cyan/turquoise accent colors
- Glowing effects and animations
- Premium gradient overlays
- Smooth transitions and hover states

### Interactive Elements
- **Radar**: Click to deploy SOS at any grid location
- **Telemetry**: Hover for drone status details
- **Alerts**: Real-time alert updates with animations
- **Status Badges**: Live connection status indicator

### Responsive Design
- Adapts to different screen sizes
- Collapsible panels on mobile
- Touch-friendly click targets
- Optimized for 1920x1080+ displays

## 📊 API Endpoints

### GET /state
Returns current simulation state including drones, detections, events, and alerts.

```json
{
  "drones": [...],
  "detections": [...],
  "events": [...],
  "alert": "FIRE",
  "step": 42,
  "timestamp": "2026-04-08T15:30:45.123456",
  "simulation_status": "running"
}
```

### POST /update
Updates simulation state (called by simulation backend).

### POST /sos
Manually trigger SOS alert at grid coordinates.

```json
{
  "pos": [5, 7]
}
```

### GET /health
System health check endpoint.

## 🔧 Configuration

### Environment Variables (Optional)
```bash
# Backend
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000

# Frontend
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/ws
```

### Simulation Parameters (in backend/main.py)
```python
SIMULATION_STEP_TIME = 0.3      # 300ms per step
DISASTER_TYPES = ["fire", "flood", "collapse"]
GRID_SIZE = 10                  # 10x10 grid
```

## 📝 Development

### Code Structure

**Backend**
- `main.py`: Main simulation loop with disaster injection
- `api/server.py`: FastAPI server with WebSocket support
- `core/agent.py`: AI agent decision logic
- `core/path_planning.py`: A* pathfinding
- `core/grid_engine.py`: Grid state management
- `core/yolo_engine.py`: YOLO vision engine

**Frontend**
- Modular React components
- CSS-in-module styling
- Real-time WebSocket connection
- Canvas-based radar visualization
- Responsive grid layout

### Building for Production

**Backend**
```bash
pip install gunicorn
gunicorn api.server:app --workers 4 --worker-class uvicorn.workers.UvicornWorker
```

**Frontend**
```bash
npm run build
# Deploy dist/ folder to static hosting
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] Backend starts without errors
- [ ] Frontend loads with boot animation
- [ ] WebSocket connects successfully
- [ ] Radar displays 3 drones at startup positions
- [ ] Random disasters appear on radar
- [ ] Drones move toward targets
- [ ] Click radar to trigger SOS
- [ ] Alert system updates correctly
- [ ] Telemetry panel shows accurate drone stats
- [ ] Event log updates in real-time
- [ ] Page survives WebSocket disconnection (HTTP polling fallback)

### Performance Metrics

- **Radar Update**: <16ms per frame (60 FPS)
- **State Broadcasting**: <50ms for all clients
- **Path Planning**: <10ms per calculation
- **Simulation Loop**: 300ms step interval

## 🐛 Troubleshooting

### WebSocket Connection Failed
- Ensure backend is running: `http://localhost:8000/health`
- Check firewall settings for port 8000
- Try HTTP polling fallback (automatic)

### Frontend Not Loading
- Check Node.js version: `node --version` (should be 18+)
- Clear venv and reinstall: `npm install`
- Rebuild: `npm run build`

### YOLO Model Not Found
- First run downloads yolov8n.pt automatically (~50MB)
- Ensure internet connection for download
- Check disk space (minimum 100MB)

### Simulation Not Starting
- Verify backend is running
- Check /health endpoint
- Ensure main.py has permissions

## 📄 License

MIT License - see LICENSE file

## 👥 Contributors

- **Design & Implementation**: AEGIS Development Team
- **AI Framework**: FastAPI, PyTorch
- **Frontend Framework**: React + Vite

## 🎓 Educational Value

AEGIS demonstrates:
- ✅ Real-time system architecture
- ✅ WebSocket communication patterns
- ✅ AI agent coordination
- ✅ Path planning algorithms
- ✅ Modern frontend architecture
- ✅ Responsive UI/UX design
- ✅ Computer vision integration

---

**Built with ⚡ for intelligent disaster response**
