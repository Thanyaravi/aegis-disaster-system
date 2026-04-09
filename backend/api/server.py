from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import json
import asyncio
from datetime import datetime
import logging
import os

app = FastAPI()

# ============= LOGGING =============
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ============= CORS SETUP =============
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============= STATE =============
state = {
    "grid": [],
    "detections": [],
    "drones": [],
    "events": [],
    "alert": None,
    "step": 0,
    "timestamp": None,
    "simulation_status": "stopped"
}

# ============= WEBSOCKET CONNECTIONS =============
class ConnectionManager:
    def __init__(self):
        self.active_connections = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"Client connected. Active connections: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        logger.info(f"Client disconnected. Active connections: {len(self.active_connections)}")

    async def broadcast(self, data: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(data)
            except Exception as e:
                logger.error(f"Error broadcasting to client: {e}")

manager = ConnectionManager()

# ============= REST ENDPOINTS =============

@app.get("/state")
async def get_state():
    """Get current simulation state"""
    return state


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "ok",
        "simulation": state.get("simulation_status", "unknown"),
        "drones_active": len(state.get("drones", [])),
        "targets": len(state.get("detections", []))
    }


@app.post("/update")
async def update(data: dict):
    """Update state from simulation backend"""
    global state
    state.update(data)
    state["timestamp"] = datetime.now().isoformat()
    state["simulation_status"] = "running"

    # Determine alert level
    alert = None
    priority = {"fire": 3, "collapse": 2, "flood": 1, "person": 0}

    for d in state.get("detections", []):
        detection_type = d.get("type", "")
        if detection_type in priority:
            if alert is None or priority[detection_type] > priority.get(alert, -1):
                alert = detection_type.upper()

    state["alert"] = alert

    # Broadcast to all WebSocket clients
    await manager.broadcast(state)

    return {"status": "ok", "alert": alert}


@app.post("/sos")
async def sos_alert(data: dict):
    """Handle manual SOS alert"""
    try:
        x, y = data.get("pos", [0, 0])

        new_detection = {
            "type": "person",
            "pos": [x, y]
        }

        state["detections"].append(new_detection)
        state["events"].append(f"🚨 SOS TRIGGERED at Grid [{x}, {y}]")
        state["alert"] = "EMERGENCY"
        state["timestamp"] = datetime.now().isoformat()

        # Broadcast SOS event to all clients
        await manager.broadcast(state)

        logger.warning(f"SOS Alert triggered at [{x}, {y}]")
        return {"status": "ok", "message": "SOS received and broadcast"}

    except Exception as e:
        logger.error(f"Error handling SOS: {e}")
        return {"status": "error", "message": str(e)}


# ============= WEBSOCKET ENDPOINT =============

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time state updates"""
    await manager.connect(websocket)

    try:
        while True:
            data = await websocket.receive_text()

            if data == "ping":
                await websocket.send_json({"type": "pong"})
            elif data == "state":
                await websocket.send_json(state)
            else:
                try:
                    msg = json.loads(data)
                    if msg.get("type") == "sos":
                        pos = msg.get("pos", [0, 0])
                        await sos_alert({"pos": pos})
                except:
                    pass

    except WebSocketDisconnect:
        manager.disconnect(websocket)
        logger.info("WebSocket client disconnected")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        manager.disconnect(websocket)