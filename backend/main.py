import os
import time
import requests
import random
import json

from core.yolo_engine import detect_environment
from core.agent import DisasterAgent

API_URL = "http://localhost:8000/update"

# ============= STATE =============
EVENT_LOG = []
DISASTER_TYPES = ["fire", "flood", "collapse"]
GRID_SIZE = 10
SIMULATION_STEP_TIME = 0.3

# ============= DRONES =============
drones = [
    {"id": 1, "pos": [0, 0], "path": [], "status": "idle", "target": None},
    {"id": 2, "pos": [9, 9], "path": [], "status": "idle", "target": None},
    {"id": 3, "pos": [0, 9], "path": [], "status": "idle", "target": None},
]

agent = DisasterAgent()
detections = []
grid = agent.create_empty_grid()
step_count = 0
simulation_active = True


def get_alert_level(detections):
    """Determine highest priority alert"""
    priority = {"fire": 3, "collapse": 2, "flood": 1, "person": 0}
    if not detections:
        return None
    max_alert = max(detections, key=lambda d: priority.get(d["type"], -1))
    return max_alert["type"].upper()


def push_state(drones, detections, grid, event_log, step, alert):
    """Send state to FastAPI backend"""
    state = {
        "grid": grid,
        "detections": [
            {"type": d["type"], "pos": d["pos"], "id": i}
            for i, d in enumerate(detections)
        ],
        "drones": [
            {
                "id": d["id"],
                "pos": d["pos"],
                "path": d["path"],
                "status": d["status"],
                "target": d["target"]
            }
            for d in drones
        ],
        "events": event_log[-30:],
        "step": step,
        "alert": alert,
        "timestamp": time.time()
    }

    try:
        response = requests.post(API_URL, json=state, timeout=2)
        return response.ok
    except Exception as e:
        print(f"[ERROR] Failed to push state: {e}")
        return False


def simulation_loop():
    """Main simulation loop - runs continuously"""
    global detections, grid, step_count, EVENT_LOG

    while simulation_active:
        step_count += 1

        # ========== RANDOM DISASTER INJECTION ==========
        if random.random() < 0.15:  # 15% chance per step
            new_disaster = {
                "type": random.choice(DISASTER_TYPES),
                "pos": [random.randint(0, GRID_SIZE - 1), random.randint(0, GRID_SIZE - 1)]
            }
            detections.append(new_disaster)
            EVENT_LOG.append(
                f"🚨 NEW {new_disaster['type'].upper()} detected at {new_disaster['pos']}"
            )

        # ========== AI DECISION MAKING ==========
        grid = agent.decide(detections, drones)

        # Assign targets to idle drones
        for drone in drones:
            if drone["status"] == "idle" and detections:
                # Find nearest unassigned detection
                available = [
                    d for d in detections
                    if d not in [dr.get("_assigned_to") for dr in drones]
                ]
                if available:
                    target = min(available, key=lambda d:
                        abs(d["pos"][0] - drone["pos"][0]) + abs(d["pos"][1] - drone["pos"][1])
                    )
                    drone["target"] = detections.index(target)
                    drone["status"] = "enroute"
                    EVENT_LOG.append(
                        f"🚁 Drone {drone['id']} assigned to {target['type']} at {target['pos']}"
                    )

        # ========== DRONE MOVEMENT ==========
        for drone in drones:
            if drone["path"]:
                drone["pos"] = drone["path"].pop(0)
            elif drone["status"] == "enroute" and drone["target"] is not None:
                if drone["target"] < len(detections):
                    target_pos = detections[drone["target"]]["pos"]
                    # Simple movement toward target
                    if drone["pos"][0] < target_pos[0]:
                        drone["pos"][0] += 1
                    elif drone["pos"][0] > target_pos[0]:
                        drone["pos"][0] -= 1

                    if drone["pos"][1] < target_pos[1]:
                        drone["pos"][1] += 1
                    elif drone["pos"][1] > target_pos[1]:
                        drone["pos"][1] -= 1

                    # Check if reached target
                    if drone["pos"] == target_pos:
                        EVENT_LOG.append(f"✅ Drone {drone['id']} reached target")
                        drone["status"] = "idle"
                        drone["target"] = None

        # ========== REMOVE HANDLED DETECTIONS ==========
        detections = [
            d for d in detections
            if not any(tuple(d["pos"]) == tuple(drone["pos"]) for drone in drones)
        ]

        # ========== ALERT GENERATION ==========
        alert = get_alert_level(detections)

        # ========== PUSH STATE TO API ==========
        push_state(drones, detections, grid, EVENT_LOG, step_count, alert)

        time.sleep(SIMULATION_STEP_TIME)


if __name__ == "__main__":
    EVENT_LOG.append("🟢 AEGIS Simulation Started")
    print("[INFO] Starting AEGIS Disaster Response Simulation...")
    print("[INFO] Ensure FastAPI server is running on http://localhost:8000")

    try:
        simulation_loop()
    except KeyboardInterrupt:
        print("\n[INFO] Simulation stopped by user")
        simulation_active = False
    except Exception as e:
        print(f"[ERROR] Simulation failed: {e}")
        simulation_active = False