#!/bin/bash

IMAGE_PATH="$1"
OUTPUT_JSON="../output/jsons/output.json"

curl -X POST "http://127.0.0.1:8000/predict/" \
    -H "accept: application/json" \
    -H "Content-Type: multipart/form-data" \
    -F "image=@$IMAGE_PATH" > "$OUTPUT_JSON"

echo " Prediction complete. Output saved to $OUTPUT_JSON"

echo "Running boxes.py..."
python ../app/boxes.py "$IMAGE_PATH"

echo "boxes.py execution completed."