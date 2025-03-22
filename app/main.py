# app/main.py
from fastapi import FastAPI, File, UploadFile
from app.inference import run_inference

app = FastAPI()

@app.post("/predict/")
def predict(image: UploadFile = File(...)):
    """Endpoint for image upload and inference"""
    try:
        results = run_inference(image)
        return {"status": "success", "results": results}
    except Exception as e:
        return {"status": "error", "message": str(e)}

