GRID_SIZE = 10

def create_grid():
    """Create empty 10x10 grid"""
    return [[{"type": "empty"} for _ in range(GRID_SIZE)] for _ in range(GRID_SIZE)]

def update_grid(grid, detections):
    """Update grid with detection markers"""
    if not grid or not detections:
        return

    for d in detections:
        try:
            x, y = d["pos"]
            x, y = int(x), int(y)
            # Clamp to grid bounds
            if 0 <= x < GRID_SIZE and 0 <= y < GRID_SIZE:
                grid[y][x]["type"] = d.get("type", "unknown")
        except (ValueError, TypeError, KeyError, IndexError):
            # Skip invalid detections
            pass