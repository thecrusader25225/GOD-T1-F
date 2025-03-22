# app/model.py
import torch
from ultralytics import YOLO

MODEL_PATH = "models/best.pt"
model = YOLO(MODEL_PATH)

def get_model():
    return model