# GOD-T1-F

This project consists of a **YOLOv8 object detection API** running in a **Docker container**, along with a **frontend (React + Vite)** and a **backend (Node.js + Express)** to interact with it.

## 🚀 Getting Started

Follow these steps to set up and run the project.

### 1️. Running YOLOv8 API in Docker

First, build and run the **YOLOv8 model** inside a Docker container:

```sh
docker build -t yolov8-api .
docker run --rm -p 8000:8000 yolov8-api
```

This starts the YOLOv8 API on http://localhost:8000.

### 2️. Cloning This Project

Clone the repository to your local machine:

```sh
git clone https://github.com/thecrusader25225/GOD-T1-F.git
cd GOD-T1-F
```

### 3️. Installing Dependencies

```sh
npm i
```


## For Development

### 4. Running Node.js backend server

```sh
cd backend
node server.cjs
```

This will run the backend at http://localhost:5000 and as well as serve static frontend at http://localhost:5000

## For Production:

### 4. Start Node.js server using PM2

```sh
cd backend
pm2 start server.cjs --name server
```

This will run PM2 process manager for the application keeping application running in production.

### 5. Use ngrok to expose the server for public use

Install ngrok and open its terminal and expose port 5000

```sh
ngrok http 5000
```

You can access then access the application from the URL it will generate.
