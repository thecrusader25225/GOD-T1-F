import cv2
import json
import math
import sys
import os
import sys
sys.stdout.reconfigure(encoding='utf-8')

# Ensure correct argument count
if len(sys.argv) != 3:
    print("❌ Usage: python boxes.py <json_file> <image_file>")
    sys.exit(1)

json_path = sys.argv[1]
image_path = sys.argv[2]

# Validate file existence
if not os.path.exists(json_path):
    print(f"❌ JSON file not found: {json_path}")
    sys.exit(1)

if not os.path.exists(image_path):
    print(f"❌ Image file not found: {image_path}")
    sys.exit(1)

# Read the response from JSON
with open(json_path, "r") as file:
    response = json.load(file)

# Extract filename for processed output
base_name = os.path.splitext(os.path.basename(json_path))[0]
processed_json_path = f"../prod/output/jsons/{base_name}_processed.json"
output_image_path = f"../prod/output/images/{base_name}.jpg"

# Class mapping
class_map = {0: "gauges", 1: "numbers"}

# Convert response format
detections = []
for d in response.get("results", {}).get("detections", []):
    if "class" in d and "confidence" in d and "bbox" in d:
        detections.append({
            "label": class_map.get(d["class"], "unknown"),
            "confidence": d["confidence"],
            "bbox": [
                math.floor(d["bbox"][0]),
                math.floor(d["bbox"][1]),
                math.floor(d["bbox"][2]),
                math.floor(d["bbox"][3])
            ]
        })

# Save the processed JSON
with open(processed_json_path, "w") as file:
    json.dump(detections, file, indent=4)
print(f"✅ Processed JSON saved: {processed_json_path}")

# Load the image
image = cv2.imread(image_path)
if image is None:
    print(f"❌ Failed to load image: {image_path}")
    sys.exit(1)

# Draw bounding boxes
for det in detections:
    x1, y1, x2, y2 = det["bbox"]
    label = f"{det['label']} {det['confidence']:.2f}"

    cv2.rectangle(image, (x1, y1), (x2, y2), (0, 255, 0), 2)
    cv2.putText(image, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

# Save the processed image
cv2.imwrite(output_image_path, image)
print(f"✅ Processed image saved: {output_image_path}")
