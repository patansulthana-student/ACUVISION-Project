# =========================================================
# ACUVISION — DETECTION TRACKER
# PHASE 7: PERSISTENCE + REPEATING ALERTS
# =========================================================

import time


class DetectionTracker:

    def __init__(
        self,
        required_frames=3,
        cooldown_seconds=1.0,
        max_missing_frames=15
    ):

        self.required_frames = required_frames

        # Time between repeated alerts for the same
        # object and direction.
        self.cooldown_seconds = cooldown_seconds

        self.max_missing_frames = max_missing_frames

        # Consecutive detections.
        self.detection_counts = {}

        # Objects that are currently active hazards.
        self.active_alerts = set()

        # Consecutive frames in which an object is missing.
        self.missing_counts = {}

        # Time when the last alert was generated.
        self.last_alert_times = {}


    # =====================================================
    # OBJECT IDENTITY
    # =====================================================

    def _key(self, detection):

        object_name = str(
            detection.get(
                "object",
                "unknown"
            )
        ).lower().strip()

        direction = str(
            detection.get(
                "direction",
                "CENTER"
            )
        ).upper().strip()

        return f"{object_name}:{direction}"


    # =====================================================
    # UPDATE ONE DETECTION
    # =====================================================

    def update(self, detection):

        key = self._key(detection)

        # Object is visible.
        self.missing_counts[key] = 0

        # Increase persistence count.
        self.detection_counts[key] = (
            self.detection_counts.get(
                key,
                0
            ) + 1
        )

        confirmed = (
            self.detection_counts[key]
            >= self.required_frames
        )

        alert_allowed = False

        if confirmed:

            # First alert for this object/direction.
            if key not in self.active_alerts:

                alert_allowed = True

            else:

                # Object is still active.
                # Allow another alert after cooldown.
                last_alert = (
                    self.last_alert_times.get(
                        key,
                        0.0
                    )
                )

                elapsed = (
                    time.monotonic()
                    - last_alert
                )

                if elapsed >= self.cooldown_seconds:

                    alert_allowed = True

        return {
            "confirmed":
                confirmed,

            "alert_allowed":
                alert_allowed,

            "count":
                self.detection_counts[key]
        }


    # =====================================================
    # MARK ALERT AS GENERATED
    # =====================================================

    def mark_alerted(self, detection):

        key = self._key(detection)

        self.active_alerts.add(
            key
        )

        self.last_alert_times[key] = (
            time.monotonic()
        )


    # =====================================================
    # UPDATE ALL CURRENTLY VISIBLE OBJECTS
    # =====================================================

    def update_active_detections(
        self,
        detections
    ):

        current_keys = {

            self._key(detection)

            for detection in detections

        }


        # -------------------------------------------------
        # HANDLE ACTIVE OBJECTS
        # -------------------------------------------------

        for key in list(
            self.active_alerts
        ):

            if key in current_keys:

                # Object is still visible.
                self.missing_counts[key] = 0

            else:

                # Object is temporarily missing.
                self.missing_counts[key] = (
                    self.missing_counts.get(
                        key,
                        0
                    ) + 1
                )


                # Remove only after enough missing frames.
                if (
                    self.missing_counts[key]
                    >= self.max_missing_frames
                ):

                    self.active_alerts.discard(
                        key
                    )

                    self.detection_counts.pop(
                        key,
                        None
                    )

                    self.missing_counts.pop(
                        key,
                        None
                    )

                    self.last_alert_times.pop(
                        key,
                        None
                    )


        # -------------------------------------------------
        # RESET MISSING COUNTERS
        # -------------------------------------------------

        for key in current_keys:

            self.missing_counts[key] = 0


    # =====================================================
    # RESET
    # =====================================================

    def reset(
        self,
        detection=None
    ):

        if detection is None:

            self.detection_counts.clear()

            self.active_alerts.clear()

            self.missing_counts.clear()

            self.last_alert_times.clear()

            return


        key = self._key(
            detection
        )

        self.detection_counts.pop(
            key,
            None
        )

        self.active_alerts.discard(
            key
        )

        self.missing_counts.pop(
            key,
            None
        )

        self.last_alert_times.pop(
            key,
            None
        )