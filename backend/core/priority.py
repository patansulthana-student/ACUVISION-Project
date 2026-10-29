
# =========================================================
# ACUVISION — THREAT PRIORITY ENGINE
# PHASE 6: PRIMARY HAZARD SELECTION
# =========================================================

class ThreatPriority:

    def __init__(self):
        # Higher values mean greater urgency.
        self.proximity_weight = {
            "FAR": 10,
            "CLOSE": 40,
            "VERY CLOSE": 70
        }

        # Direction weighting.
        # Center is treated as more urgent because it is
        # more directly aligned with the user's path.
        self.direction_weight = {
            "LEFT": 10,
            "CENTER": 30,
            "RIGHT": 10
        }

    def calculate_score(self, detection):
        """
        Calculate a demo threat score from:
        - object class
        - proximity
        - direction
        - confidence
        """

        confidence = float(
            detection.get("confidence", 0)
        )

        proximity = detection.get(
            "proximity",
            "FAR"
        )

        direction = detection.get(
            "direction",
            "CENTER"
        )

        score = (
            (confidence * 0.4)
            + self.proximity_weight.get(
                proximity,
                0
            )
            + self.direction_weight.get(
                direction,
                0
            )
        )

        return round(
            min(score, 100),
            2
        )

    def classify_priority(self, score):
        """
        Convert numeric threat score into:
        LOW / MEDIUM / HIGH / CRITICAL
        """

        if score >= 85:
            return "CRITICAL"

        if score >= 65:
            return "HIGH"

        if score >= 40:
            return "MEDIUM"

        return "LOW"

    def evaluate(self, detections):
        """
        Add threat score and priority to every
        detection, then return the primary hazard.
        """

        if not detections:
            return {
                "detections": [],
                "primary_hazard": None
            }

        evaluated = []

        for detection in detections:

            item = detection.copy()

            score = self.calculate_score(
                item
            )

            item["threat_score"] = score

            item["priority"] = (
                self.classify_priority(score)
            )

            evaluated.append(item)

        evaluated.sort(
            key=lambda item:
                item["threat_score"],
            reverse=True
        )

        return {
            "detections": evaluated,
            "primary_hazard": evaluated[0]
        }