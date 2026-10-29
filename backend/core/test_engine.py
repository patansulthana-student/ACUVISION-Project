# =========================================================
# ACUVISION — CENTRAL ENGINE TEST
# PHASE 10
# =========================================================

import cv2

from engine import AcuVisionEngine


def main():

    engine = AcuVisionEngine()


    try:

        # ---------------------------------------------
        # START ENGINE
        # ---------------------------------------------

        engine.start()

        print("Central engine is running.")
        print("Press Q to stop.")


        # ---------------------------------------------
        # PROCESS VIDEO
        # ---------------------------------------------

        while True:

            result = engine.process_frame()


            # IMPORTANT:
            # Use the SAME frame processed by the engine.

            frame = result["frame"]


            # -----------------------------------------
            # DRAW DETECTIONS
            # -----------------------------------------

            for detection in result["detections"]:

                x1, y1, x2, y2 = (
                    detection["bbox"]
                )


                label = (
                    f'{detection["object"]} '
                    f'{detection["confidence"]}% '
                    f'{detection["direction"]} '
                    f'{detection["proximity"]}'
                )


                cv2.rectangle(
                    frame,

                    (x1, y1),

                    (x2, y2),

                    (0, 255, 0),

                    2
                )


                cv2.putText(
                    frame,

                    label,

                    (
                        x1,
                        max(y1 - 10, 20)
                    ),

                    cv2.FONT_HERSHEY_SIMPLEX,

                    0.55,

                    (0, 255, 0),

                    2
                )


            # -----------------------------------------
            # PRIMARY HAZARD
            # -----------------------------------------

            primary = (
                result["primary_hazard"]
            )


            if primary:

                primary_text = (

                    f'PRIMARY: '

                    f'{primary["object"]} | '

                    f'{primary["direction"]} | '

                    f'{primary["proximity"]} | '

                    f'{primary["priority"]} | '

                    f'{primary["threat_score"]}'
                )


                cv2.putText(
                    frame,

                    primary_text,

                    (20, 35),

                    cv2.FONT_HERSHEY_SIMPLEX,

                    0.65,

                    (0, 255, 255),

                    2
                )


            # -----------------------------------------
            # ALERT STATUS
            # -----------------------------------------

            if result["alert_generated"]:

                cv2.putText(
                    frame,

                    "ALERT GENERATED",

                    (20, 65),

                    cv2.FONT_HERSHEY_SIMPLEX,

                    0.65,

                    (0, 0, 255),

                    2
                )


            # -----------------------------------------
            # DISPLAY
            # -----------------------------------------

            cv2.imshow(
                "ACUVISION Central Engine",
                frame
            )


            # -----------------------------------------
            # QUIT
            # -----------------------------------------

            key = (
                cv2.waitKey(1)
                & 0xFF
            )


            if key == ord("q"):

                break


    except Exception as error:

        print(
            f"Engine error: {error}"
        )


    finally:

        engine.stop()

        cv2.destroyAllWindows()


        print(
            "Central engine test finished."
        )


if __name__ == "__main__":

    main()