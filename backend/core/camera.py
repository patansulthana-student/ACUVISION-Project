
# =========================================================
# ACUVISION — CAMERA MANAGER
# PHASE 2: ESP32-CAM + WEBCAM FALLBACK
# =========================================================

import cv2

from .camera_config import (
    USE_ESP32,
    USE_WEBCAM_FALLBACK,
    WEBCAM_INDEX,
    ESP32_STREAM_URL,
)

class CameraManager:

    def __init__(self):
        self.capture = None
        self.camera_source = None

    def start_esp32(self):
        """Try to open the ESP32-CAM stream."""

        print("Trying ESP32-CAM...")

        capture = cv2.VideoCapture(
            ESP32_STREAM_URL
        )

        if capture.isOpened():

            self.capture = capture
            self.camera_source = "ESP32-CAM"

            print("ESP32-CAM connected.")
            return True

        capture.release()

        print("ESP32-CAM unavailable.")
        return False

    def start_webcam(self):
        """Start the laptop webcam fallback."""

        print("Trying laptop webcam...")

        capture = cv2.VideoCapture(
            WEBCAM_INDEX
        )

        if capture.isOpened():

            self.capture = capture
            self.camera_source = "WEBCAM"

            print("Laptop webcam connected.")
            return True

        capture.release()

        print("Laptop webcam unavailable.")
        return False

    def start(self):
        """
        Start the preferred camera.
        If ESP32-CAM fails, use the laptop webcam.
        """

        if USE_ESP32:

            if self.start_esp32():
                return True

        if USE_WEBCAM_FALLBACK:

            if self.start_webcam():
                return True

        raise RuntimeError(
            "No available camera source."
        )

    def read_frame(self):
        """Read one frame from the active camera."""

        if self.capture is None:

            raise RuntimeError(
                "Camera is not started."
            )

        success, frame = self.capture.read()

        if not success:

            raise RuntimeError(
                "Could not read frame from camera."
            )

        return frame

    def get_source(self):
        """Return the currently active camera source."""

        return self.camera_source

    def stop(self):
        """Release the active camera."""

        if self.capture is not None:

            self.capture.release()

            self.capture = None
            self.camera_source = None