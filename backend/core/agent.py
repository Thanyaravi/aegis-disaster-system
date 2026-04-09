import math
from .grid_engine import create_grid, update_grid
from .path_planning import plan_path

class DisasterAgent:

    def create_empty_grid(self):
        return create_grid()

    def decide(self, detections, drones, grid=None):
        if grid is None:
            grid = create_grid()

        update_grid(grid, detections)

        if not detections:
            return grid

        assigned_targets = set()

        for drone in drones:
            # Ensure drone position is tuple
            drone_pos = tuple(drone["pos"]) if isinstance(drone["pos"], list) else drone["pos"]

            # 🔥 Select nearest UNASSIGNED target
            available = [
                d for d in detections
                if tuple(d["pos"]) not in assigned_targets
            ]

            if not available:
                continue

            target = min(
                available,
                key=lambda d: math.dist(drone_pos, tuple(d["pos"]))
            )

            assigned_targets.add(tuple(target["pos"]))

            # 🔥 REAL A* PATH
            target_pos = tuple(target["pos"]) if isinstance(target["pos"], list) else target["pos"]
            path = plan_path(drone_pos, target_pos, grid)
            drone["path"] = path if path else []

        return grid