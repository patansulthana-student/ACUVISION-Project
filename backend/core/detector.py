from ultralytics import YOLO


class ObjectDetector:

    def __init__(self, model_name="yolo11n.pt"):
        self.model = YOLO(model_name)
        print("Original YOLO11n model loaded.")

    def detect(self, frame, confidence=0.40):

        results = self.model(
            frame,
            verbose=False,
            conf=confidence
        )

        detections = []

        for result in results:
            if result.boxes is None:
                continue

            for box in result.boxes:
                class_id = int(box.cls[0].item())
                score = float(box.conf[0].item())

                x1, y1, x2, y2 = map(
                    int,
                    box.xyxy[0].tolist()
                )

                detections.append({
                    "object": result.names[class_id],
                    "confidence": round(score * 100, 2),
                    "bbox": [x1, y1, x2, y2]
                })

        return detections