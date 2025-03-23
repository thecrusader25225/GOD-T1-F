#!/bin/bash
set -x
IMAGE_PATH="../uploads/8ca4174bbb87a0c010ec2c35d2e12ac6.jpg"
FILENAME=$(basename -- "$IMAGE_PATH")
NAME="${FILENAME%.*}"

OUTPUT_JSON="../output/jsons/${NAME}.json"
OUTPUT_IMAGE="../output/images/${NAME}.jpg"

echo "Processing: $IMAGE_PATH"
echo "Saving JSON to: $OUTPUT_JSON"
echo "Saving processed image to: $OUTPUT_IMAGE"


# 🔹 Run curl command
curl -X POST "http://host.docker.internal:8000/predict/" \
    -H "accept: application/json" \
    -H "Content-Type: multipart/form-data" \
    -F "image=@$IMAGE_PATH" > "$OUTPUT_JSON"

echo "✅ Prediction complete. Output saved to $OUTPUT_JSON"

# # Run Python script for bounding boxes
# echo "Running boxes.py..."
# python3 ../app/boxes.py "$OUTPUT_JSON" "$OUTPUT_IMAGE"

# echo "✅ boxes.py execution completed. Processed image saved to $OUTPUT_IMAGE"
set +x