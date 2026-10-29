
# =========================================================
# ACUVISION — PROXIMITY ENGINE
# PHASE 5: FAR / CLOSE / VERY CLOSE
# =========================================================

class ProximityEstimator:

    def __init__(
        self,
        close_threshold=0.12,
        very_close_threshold=0.25
    ):
        """
        Thresholds are bounding-box area ratios.

        Example:
        0.12 = object occupies about 12% of frame area.
        0.25 = object occupies about 25% of frame area.

        These are demo thresholds and should be calibrated later.
        """

        self.close_threshold = close_threshold
        self.very_close_threshold = very_close_threshold

    def calculate(self, bbox, frame_width, frame_height):
        """
        Estimate approximate proximity from bounding-box area.

        Returns:
            FAR
            CLOSE
            VERY CLOSE
        """

        if frame_width <= 0 or frame_height <= 0:
            raise ValueError(
                "Frame dimensions must be greater than zero."
            )

        if len(bbox) != 4:
            raise ValueError(
                "Bounding box must contain [x1, y1, x2, y2]."
            )

        x1, y1, x2, y2 = bbox

        box_width = max(0, x2 - x1)
        box_height = max(0, y2 - y1)

        box_area = box_width * box_height

        frame_area = frame_width * frame_height

        area_ratio = box_area / frame_area

        if area_ratio >= self.very_close_threshold:
            proximity = "VERY CLOSE"

        elif area_ratio >= self.close_threshold:
            proximity = "CLOSE"

        else:
            proximity = "FAR"

        return {
            "proximity": proximity,
            "area_ratio": round(area_ratio, 4),
            "box_area": box_area
        }