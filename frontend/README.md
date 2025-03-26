# GOD-T1-F

This project consists of a **YOLOv8 object detection API** running in a **Docker container**, along with a **frontend (React + Vite)** and a **backend (Node.js + Express)** to interact with it.

## 🚀 Getting Started

Follow these steps to set up and run the project.

### 1️⃣ Running YOLOv8 API in Docker

First, build and run the **YOLOv8 model** inside a Docker container:

```sh
docker build -t yolov8-api .
docker run --rm -p 8000:8000 yolov8-api
```

This starts the YOLOv8 API on http://localhost:8000.

### 2️⃣ Cloning This Project

Clone the repository to your local machine:

```sh
git clone https://github.com/thecrusader25225/GOD-T1-F.git
cd GOD-T1-F
```

### 3️. Installing Dependencies

Navigate to both the frontend and backend folders separately and install dependencies:

```sh
cd backend
npm i
```
```sh
cd frontend
npm i
```

### 4. Running Node.js backend server

```sh
cd backend
node server.js
```

This will run the backend at http://localhost:5000.

### 5. Running the Vite Development Server

```sh
cd frontend
npm run dev
```

This will run the frontend at http://localhost:5173.

## 🔮 Future Goals

- **Expose the backend API** so that a remote PC can access it.
