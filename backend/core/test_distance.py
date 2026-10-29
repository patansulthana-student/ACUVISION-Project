
# =========================================================
# ACUVISION — PROXIMITY TEST
# =========================================================

from distance import ProximityEstimator


def main():

    estimator = ProximityEstimator()

    frame_width = 640
    frame_height = 480

    test_objects = [

        {
            "name": "FAR OBJECT",
            "bbox": [280, 200, 340, 260]
        },

        {
            "name": "CLOSE OBJECT",
            "bbox": [220, 140, 430, 340]
        },

        {
            "name": "VERY CLOSE OBJECT",
            "bbox": [80, 60, 560, 420]
        }

    ]

    for test in test_objects:

        result = estimator.calculate(
            test["bbox"],
            frame_width,
            frame_height
        )

        print(
            f'{test["name"]}: '
            f'{result["proximity"]} '
            f'(area_ratio={result["area_ratio"]})'
        )


if __name__ == "__main__":
    main()