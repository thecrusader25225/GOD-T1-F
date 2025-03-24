import cv2
import json
import math
import sys
import os

# Ensure correct arguments
if len(sys.argv) < 3:
    print("Usage: python boxes.py <input_json> <input_image>")
    sys.exit(1)

input_json = sys.argv[1]
input_image = sys.argv[2]

print("input image: ",input_image,"input json:",input_json)
# Extract base filename without extension
base_name = os.path.splitext(os.path.basename(input_json))[0]
print("basename: ", base_name)
# Output paths
processed_json_path = f"../output/jsons/{base_name}_processed.json"
output_image_path = f"../output/images/{base_name}.jpg"

print(f"🔍 Debug: Loading JSON from {input_json}")

# Read the JSON response
try:
    with open(input_json, "r") as file:
        response = json.load(file)
except Exception as e:
    print(f"❌ Error: Failed to load JSON - {e}")
    sys.exit(1)

# Ensure results exist
if "results" not in response or "detections" not in response["results"]:
    print(f"❌ Error: No detections found in {input_json}")
    sys.exit(1)

# Class mapping
class_map = {0: "gauges", 1: "numbers"}

# Convert response format
detections = []
for d in response["results"]["detections"]:
    if "class" not in d or "bbox" not in d or len(d["bbox"]) != 4:
        print(f"⚠️ Skipping invalid detection: {d}")
        continue
    
    detections.append({
        "label": class_map.get(d["class"], "unknown"),
        "confidence": d["confidence"],
        "bbox": [math.floor(d["bbox"][0]), math.floor(d["bbox"][1]), math.floor(d["bbox"][2]), math.floor(d["bbox"][3])]
    })

print(f"✅ Detections processed: {len(detections)}")

# Save processed JSON
with open(processed_json_path, "w") as file:
    json.dump(detections, file, indent=4)

print(f"✅ Processed JSON saved: {processed_json_path}")

# Load the image
print(f"🔍 Debug: Trying to load image from {input_image}")
image = cv2.imread(input_image)
if image is None:
    print(f"❌ Error: Unable to load image {input_image}")
    sys.exit(1)

print(f"✅ Image loaded successfully: {input_image}")

# Draw bounding boxes
for det in detections:
    x1, y1, x2, y2 = det["bbox"]
    label = f"{det['label']} {det['confidence']:.2f}"

    # Draw rectangle
    cv2.rectangle(image, (x1, y1), (x2, y2), (0, 255, 0), 2)
    
    # Put label
    cv2.putText(image, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

# Save the processed image
cv2.imwrite(output_image_path, image)
print(f"✅ Processed image saved: {output_image_path}")