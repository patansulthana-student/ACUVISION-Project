
# =========================================================
# ACUVISION — SPATIAL POSITION ENGINE
# PHASE 4: LEFT / CENTER / RIGHT
# =========================================================

class SpatialPosition:

    def __init__(self, left_threshold=0.33, right_threshold=0.66):
        self.left_threshold = left_threshold
        self.right_threshold = right_threshold

    def calculate(self, bbox, frame_width):
        """
        Convert a bounding-box center into:
        LEFT / CENTER / RIGHT
        """

        if frame_width <= 0:
            raise ValueError("Frame width must be greater than zero.")

        if len(bbox) != 4:
            raise ValueError(
                "Bounding box must contain [x1, y1, x2, y2]."
            )

        x1, _, x2, _ = bbox

        center_x = (x1 + x2) / 2

        normalized_x = center_x / frame_width

        if normalized_x < self.left_threshold:
            direction = "LEFT"

        elif normalized_x > self.right_threshold:
            direction = "RIGHT"

        else:
            direction = "CENTER"

        return {
            "direction": direction,
            "center_x": round(center_x, 2),
            "normalized_x": round(normalized_x, 3)
        }