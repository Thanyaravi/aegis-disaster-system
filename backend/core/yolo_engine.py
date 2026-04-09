from ultralytics import YOLO
import cv2
import random

GRID_SIZE = 10
CONF_THRESHOLD = 0.3

model = YOLO("yolov8n.pt")

def detect_environment(image_path):
    image = cv2.imread(image_path)

    if image is None:
        return []

    height, width, _ = image.shape
    results = model(image)

    detections = []

    for r in results:
        for box in r.boxes:
            cls = int(box.cls[0])
            label = model.names[cls]
            conf = float(box.conf[0])

            if label == "person" and conf > CONF_THRESHOLD:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                cx = (x1 + x2) // 2
                cy = (y1 + y2) // 2

                grid_x = int((cx / width) * GRID_SIZE)
                grid_y = int((cy / height) * GRID_SIZE)

                detections.append({
                    "type": "person",
                    "pos": (grid_x, grid_y)
                })

    if not detections:
        detections.append({
            "type": "person",
            "pos": (random.randint(0, 9), random.randint(0, 9))
        })

    for _ in range(3):
        detections.append({
            "type": "fire",
            "pos": (random.randint(0, 9), random.randint(0, 9))
        })

    return detections