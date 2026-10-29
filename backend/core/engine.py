# =========================================================
# ACUVISION — CENTRAL PROCESSING ENGINE
# CONTINUOUS VISION PIPELINE
# =========================================================

from .camera import CameraManager
from .detector import ObjectDetector
from .spatial import SpatialPosition
from .distance import ProximityEstimator
from .priority import ThreatPriority
from .tracker import DetectionTracker


class AcuVisionEngine:

    def __init__(self):

        self.camera = CameraManager()

        self.detector = ObjectDetector()

        self.spatial = SpatialPosition()

        self.proximity = ProximityEstimator()

        self.priority = ThreatPriority()

        # Require 3 consistent frames before an alert.
        self.tracker = DetectionTracker(
            required_frames=3,
            cooldown_seconds=1.0,
            max_missing_frames=15
        )

        self.running = False


    # =====================================================
    # START
    # =====================================================

    def start(self):

        self.camera.start()

        self.running = True

        print(
            f"ACUVISION engine started using "
            f"{self.camera.get_source()}"
        )


    # =====================================================
    # PROCESS ONE FRAME
    # =====================================================

    def process_frame(self):

        if not self.running:

            raise RuntimeError(
                "Engine is not running."
            )


        # -------------------------------------------------
        # 1. CAMERA
        # -------------------------------------------------

        frame = self.camera.read_frame()

        height, width = frame.shape[:2]


        # -------------------------------------------------
        # 2. AI DETECTION
        # -------------------------------------------------

        detections = self.detector.detect(
            frame
        )

        processed = []


        # -------------------------------------------------
        # 3. SPATIAL POSITION + PROXIMITY
        # -------------------------------------------------

        for detection in detections:

            spatial_result = (
                self.spatial.calculate(
                    detection["bbox"],
                    width
                )
            )


            proximity_result = (
                self.proximity.calculate(
                    detection["bbox"],
                    width,
                    height
                )
            )


            item = detection.copy()


            item["direction"] = (
                spatial_result["direction"]
            )


            item["proximity"] = (
                proximity_result["proximity"]
            )


            item["area_ratio"] = (
                proximity_result["area_ratio"]
            )


            processed.append(
                item
            )


        # -------------------------------------------------
        # UPDATE ACTIVE DETECTIONS
        # -------------------------------------------------

        self.tracker.update_active_detections(
            processed
        )


        # -------------------------------------------------
        # 4. THREAT PRIORITY
        # -------------------------------------------------

        priority_result = (
            self.priority.evaluate(
                processed
            )
        )


        evaluated_detections = (
            priority_result.get(
                "detections",
                processed
            )
        )


        primary_hazard = (
            priority_result.get(
                "primary_hazard"
            )
        )


        # -------------------------------------------------
        # 5. ALERT DECISION
        # -------------------------------------------------

        alert_generated = False


        if primary_hazard:

            priority_level = (
                primary_hazard.get(
                    "priority",
                    "LOW"
                )
            )


            # Only HIGH and CRITICAL hazards
            # are allowed to generate alerts.

            if priority_level in (
                "HIGH",
                "CRITICAL"
            ):

                tracking_result = (
                    self.tracker.update(
                        primary_hazard
                    )
                )


                if tracking_result.get(
                    "alert_allowed",
                    False
                ):

                    print(
                        "--------------------------------------"
                    )

                    print(
                        "SAFETY ALERT GENERATED"
                    )

                    print(
                        f'Object: '
                        f'{primary_hazard.get("object", "Unknown")}'
                    )

                    print(
                        f'Direction: '
                        f'{primary_hazard.get("direction", "CENTER")}'
                    )

                    print(
                        f'Proximity: '
                        f'{primary_hazard.get("proximity", "FAR")}'
                    )

                    print(
                        f'Priority: '
                        f'{primary_hazard.get("priority", "LOW")}'
                    )

                    print(
                        f'Threat Score: '
                        f'{primary_hazard.get("threat_score", 0)}'
                    )

                    print(
                        "--------------------------------------"
                    )


                    self.tracker.mark_alerted(
                        primary_hazard
                    )


                    alert_generated = True


        # -------------------------------------------------
        # 6. RETURN RESULT
        # -------------------------------------------------

        return {

            "frame":
                frame,

            # All detections after spatial/proximity
            # processing.

            "detections":
                evaluated_detections,

            # Original processed detections are also
            # returned for debugging/telemetry.

            "processed_detections":
                processed,

            "primary_hazard":
                primary_hazard,

            "alert_generated":
                alert_generated

        }


    # =====================================================
    # STOP
    # =====================================================

    def stop(self):

        self.camera.stop()

        self.running = False

        print(
            "ACUVISION engine stopped."
        )