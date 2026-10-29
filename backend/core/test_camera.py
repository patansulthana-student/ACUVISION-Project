# =========================================================
# ACUVISION — CAMERA SOURCE TEST
# =========================================================

import cv2

from camera import CameraManager


def main():

    camera = CameraManager()

    try:

        camera.start()

        print(
            f"Active camera: {camera.get_source()}"
        )

        print("Press Q to stop.")

        while True:

            frame = camera.read_frame()

            cv2.imshow(
                "ACUVISION Camera Test",
                frame
            )

            key = cv2.waitKey(1) & 0xFF

            if key == ord("q"):
                break

    except RuntimeError as error:

        print(f"Camera error: {error}")

    finally:

        camera.stop()

        cv2.destroyAllWindows()

        print("Camera stopped.")


if __name__ == "__main__":
    main()