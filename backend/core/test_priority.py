
# =========================================================
# ACUVISION — THREAT PRIORITY TEST
# =========================================================

from priority import ThreatPriority


def main():

    priority_engine = ThreatPriority()

    detections = [

        {
            "object": "Person",
            "confidence": 94,
            "direction": "LEFT",
            "proximity": "CLOSE"
        },

        {
            "object": "Chair",
            "confidence": 91,
            "direction": "CENTER",
            "proximity": "VERY CLOSE"
        },

        {
            "object": "Bottle",
            "confidence": 87,
            "direction": "RIGHT",
            "proximity": "FAR"
        }

    ]

    result = priority_engine.evaluate(
        detections
    )

    print("\n=== EVALUATED OBJECTS ===")

    for item in result["detections"]:

        print(
            f'{item["object"]}: '
            f'score={item["threat_score"]}, '
            f'priority={item["priority"]}'
        )

    print("\n=== PRIMARY HAZARD ===")

    primary = result["primary_hazard"]

    if primary:

        print(
            f'Object: {primary["object"]}'
        )

        print(
            f'Direction: {primary["direction"]}'
        )

        print(
            f'Proximity: {primary["proximity"]}'
        )

        print(
            f'Threat Score: '
            f'{primary["threat_score"]}'
        )

        print(
            f'Priority: {primary["priority"]}'
        )

    else:

        print("No active hazard.")


if __name__ == "__main__":
    main()