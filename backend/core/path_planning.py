import heapq

# 🔹 Heuristic (Manhattan distance)
def heuristic(a, b):
    return abs(a[0] - b[0]) + abs(a[1] - b[1])

# 🔹 Get neighbors (4-directional)
def get_neighbors(node, grid):
    x, y = node
    neighbors = []

    directions = [(1,0), (-1,0), (0,1), (0,-1)]

    for dx, dy in directions:
        nx, ny = x + dx, y + dy

        if 0 <= nx < len(grid) and 0 <= ny < len(grid[0]):
            # 0 = free, 1 = obstacle
            if grid[nx][ny] == 0:
                neighbors.append((nx, ny))

    return neighbors


def plan_path(start, goal, grid=None):

    # if no grid passed → create empty grid
    if grid is None:
        grid = [[0]*10 for _ in range(10)]

    open_set = []
    heapq.heappush(open_set, (0, start))

    came_from = {}

    g_score = {start: 0}
    f_score = {start: heuristic(start, goal)}

    while open_set:

        _, current = heapq.heappop(open_set)

        if current == goal:
            # 🔁 reconstruct path
            path = []
            while current in came_from:
                path.append(current)
                current = came_from[current]
            path.reverse()
            return path

        for neighbor in get_neighbors(current, grid):

            tentative_g = g_score[current] + 1

            if neighbor not in g_score or tentative_g < g_score[neighbor]:

                came_from[neighbor] = current
                g_score[neighbor] = tentative_g
                f_score[neighbor] = tentative_g + heuristic(neighbor, goal)

                heapq.heappush(open_set, (f_score[neighbor], neighbor))

    return []  # no path found