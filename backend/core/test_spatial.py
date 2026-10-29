
# =========================================================
# ACUVISION — SPATIAL POSITION TEST
# =========================================================

from spatial import SpatialPosition


def main():

    spatial = SpatialPosition()

    frame_width = 640

    test_boxes = [

        {
            "name": "LEFT OBJECT",
            "bbox": [40, 100, 180, 300]
        },

        {
            "name": "CENTER OBJECT",
            "bbox": [260, 100, 380, 300]
        },

        {
            "name": "RIGHT OBJECT",
            "bbox": [470, 100, 610, 300]
        }

    ]


    for test in test_boxes:

        result = spatial.calculate(
            test["bbox"],
            frame_width
        )

        print(
            f'{test["name"]}: '
            f'{result["direction"]} '
            f'(center_x={result["center_x"]}, '
            f'normalized={result["normalized_x"]})'
        )


if __name__ == "__main__":
    main()