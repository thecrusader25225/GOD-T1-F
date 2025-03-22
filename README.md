# YOLOv8 API Deployment

## Overview
This project provides an API for running YOLOv8 inference. The API is containerized using Docker and deployed on Azure for seamless access by the web development team.

## Project Structure
```
.
├── Dockerfile          # Defines the container setup
├── main.py            # FastAPI application
├── model.py           # Model loading and inference logic
├── util.py            # Helper functions
├── requirements.txt   # Dependencies
└── README.md          # This documentation
```

## Prerequisites
Before deploying, ensure you have:
- **Azure CLI** installed and logged in
- **Docker** installed and running
- An **Azure Container Registry (ACR)**

## Local Setup
To build and run the API locally:
```sh
docker build -t yolov8-api .
docker run --rm -p 8000:8000 yolov8-api
```
The API will be accessible at `http://localhost:8000`.

## Deploying to Azure
### 1. Create an Azure Container Registry (ACR)
```sh
az acr create --resource-group <your-resource-group> --name <your-acr-name> --sku Basic
az acr login --name <your-acr-name>
```

### 2. Build and Push Docker Image to ACR
```sh
docker tag yolov8-api <your-acr-name>.azurecr.io/yolov8-api:v1
docker push <your-acr-name>.azurecr.io/yolov8-api:v1
```

### 3. Deploy to Azure App Service
```sh
az appservice plan create --name yolov8-plan --resource-group <your-resource-group> --sku B1 --is-linux
az webapp create --resource-group <your-resource-group> --plan yolov8-plan --name <your-app-name> --deployment-container-image-name <your-acr-name>.azurecr.io/yolov8-api:v1
```

### 4. Get the Public API URL
```sh
az webapp show --resource-group <your-resource-group> --name <your-app-name> --query defaultHostName -o tsv
```
This will return a URL like:
```
yolov8-api.azurewebsites.net
```
Share this URL with the web development team.

## API Endpoints
### 1. Health Check
```http
GET /
```
Response:
```json
{"message": "API is running"}
```

### 2. Run Inference
```http
POST /predict
```
Request (multipart form-data):
- `file`: Image file for prediction

Response:
```json
{
  "predictions": [
    {"class": "gauge", "confidence": 0.92, "bbox": [x, y, w, h]}
  ]
}
```

## Future Improvements
- Implement authentication for secure access
- Enable automatic model updates
- Set up CI/CD for automated deployments