
# =========================================================
# ACUVISION — TRACKER TEST
# =========================================================

import time

from tracker import DetectionTracker


def main():

    tracker = DetectionTracker(
        required_frames=3,
        cooldown_seconds=1
    )

    detection = {
        "object": "Person",
        "direction": "LEFT"
    }

    print("=== PERSISTENCE TEST ===")

    for frame_number in range(1, 5):

        result = tracker.update(
            detection
        )

        print(
            f"Frame {frame_number}: "
            f"count={result['count']}, "
            f"confirmed={result['confirmed']}, "
            f"alert_allowed={result['alert_allowed']}"
        )

        if result["alert_allowed"]:

            print("ALERT GENERATED")

            tracker.mark_alerted(
                detection
            )


    print("\n=== COOLDOWN TEST ===")

    result = tracker.update(
        detection
    )

    print(
        "Immediately after alert:",
        result
    )


    print("\nWaiting for cooldown...")

    time.sleep(3.1)

    result = tracker.update(
        detection
    )

    print(
        "After cooldown:",
        result
    )


if __name__ == "__main__":
    main()