# =========================================================
# ACUVISION — AI DETECTOR TEST
# =========================================================

import cv2

from camera import CameraManager
from detector import ObjectDetector


def main():

    camera = CameraManager()

    try:

        camera.start()

        print(
            f"Active camera: {camera.get_source()}"
        )

        detector = ObjectDetector()

        print("AI detector loaded.")
        print("Press Q to stop.")

        while True:

            frame = camera.read_frame()

            detections = detector.detect(frame)

            for detection in detections:

                x1, y1, x2, y2 = detection["bbox"]

                label = (
                    f'{detection["object"]} '
                    f'{detection["confidence"]}%'
                )

                cv2.rectangle(
                    frame,
                    (x1, y1),
                    (x2, y2),
                    (0, 255, 0),
                    2
                )

                cv2.putText(
                    frame,
                    label,
                    (x1, max(y1 - 10, 20)),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.6,
                    (0, 255, 0),
                    2
                )

            cv2.imshow(
                "ACUVISION AI Detection",
                frame
            )

            key = cv2.waitKey(1) & 0xFF

            if key == ord("q"):
                break

    except Exception as error:

        print(
            f"AI detection error: {error}"
        )

    finally:

        camera.stop()
        cv2.destroyAllWindows()

        print("AI detector stopped.")


if __name__ == "__main__":
    main()