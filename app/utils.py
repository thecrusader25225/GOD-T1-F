# app/utils.py
import cv2
from fastapi import UploadFile
import numpy as np

def load_image(image: UploadFile):
    """Load image from UploadFile"""
    contents = image.file.read()
    np_arr = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    if image is None:
        raise ValueError("Invalid image file")
    return image
