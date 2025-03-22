# app/inference.py
from app.model import get_model
from app.utils import load_image

model = get_model()

def run_inference(image):
    """Runs YOLOv8 inference on an image"""
    image = load_image(image)
    results = model(image)
    detections = []
    for result in results:
        for box in result.boxes:
            detections.append({
                "class": int(box.cls),
                "confidence": float(box.conf),
                "bbox": box.xyxy[0].tolist()
            })
    
    return {"detections": detections}