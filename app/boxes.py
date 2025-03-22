import cv2
import json
import json
import math
import sys

# Read the response from output.json
with open("../output/jsons/output.json", "r") as file:
    response = json.load(file)

#Get the IMAGE_PATH from bash
if len(sys.argv) > 1:
    image_path = sys.argv[1]

# Class mapping
class_map = {0: "gauges", 1: "numbers"}

# Convert response format
detections = [
    {
        "label": class_map[d["class"]],
        "confidence": d["confidence"],  # Keep original confidence value
        "bbox": [math.floor(d["bbox"][0]), math.floor(d["bbox"][1]), math.floor(d["bbox"][2]), math.floor(d["bbox"][3])]
    }
    for d in response["results"]["detections"]
]
# Save the file
with open("../output/jsons/processed_output.json", "w") as file:
    json.dump(detections, file, indent=4)



# Load the image
image = cv2.imread(image_path)

# Iterate through detections and draw bounding boxes
for det in detections:
    x1, y1, x2, y2 = det["bbox"]
    label = f"{det['label']} {det['confidence']:.2f}"
    
    # Draw rectangle (bounding box)
    cv2.rectangle(image, (x1, y1), (x2, y2), (0, 255, 0), 2)
    
    # Put label
    cv2.putText(image, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

# Save or display the image
cv2.imwrite("../output/images/output.jpg", image)  # Save image
cv2.imshow("Detected Image", image)  # Show image
cv2.waitKey(0)
cv2.destroyAllWindows()