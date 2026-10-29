# =========================================================
# ACUVISION - VOICE ENGINE
# CONFIGURABLE VOICE ALERTS
# =========================================================

import pyttsx3
import threading


class VoiceEngine:

    def __init__(self):

        self.voice_speed = 100
        self.voice_volume = 100
        self.enabled = True

        self.speech_lock = threading.Lock()


    # =====================================================
    # SETTINGS
    # =====================================================

    def set_settings(
        self,
        voice_volume=None,
        voice_speed=None,
        enabled=None
    ):

        if voice_volume is not None:

            self.voice_volume = max(
                0,
                min(
                    100,
                    float(voice_volume)
                )
            )

        if voice_speed is not None:

            self.voice_speed = max(
                50,
                min(
                    150,
                    float(voice_speed)
                )
            )

        if enabled is not None:

            self.enabled = bool(enabled)


    # =====================================================
    # SPEAK
    # =====================================================

    def speak(self, message):

        if not message:
            return

        if not self.enabled:
            return

        with self.speech_lock:

            engine = None

            try:

                # Create a fresh speech engine for every message.
                engine = pyttsx3.init()

                rate = (
                    165
                    * self.voice_speed
                    / 100
                )

                engine.setProperty(
                    "rate",
                    int(rate)
                )

                engine.setProperty(
                    "volume",
                    self.voice_volume / 100
                )

                print(
                    f"VOICE → {message}"
                )

                engine.say(
                    message
                )

                engine.runAndWait()

            except Exception as error:

                print(
                    f"Voice playback error: {error}"
                )

            finally:

                if engine is not None:

                    try:

                        engine.stop()

                    except Exception:
                        pass


    # =====================================================
    # BUILD ALERT MESSAGE
    # =====================================================

    def build_alert_message(
        self,
        object_name,
        direction,
        proximity
    ):

        object_name = str(
            object_name
        ).strip()

        direction = str(
            direction
        ).strip().upper()

        proximity = str(
            proximity
        ).strip().upper()


        # -------------------------------------------------
        # DIRECTION
        # -------------------------------------------------

        if direction == "LEFT":

            position_phrase = "on the left"

        elif direction == "RIGHT":

            position_phrase = "on the right"

        else:

            position_phrase = "in the center"


        # -------------------------------------------------
        # PROXIMITY
        # -------------------------------------------------

        if proximity == "VERY CLOSE":

            distance_phrase = "very close"

        elif proximity == "CLOSE":

            distance_phrase = "close"

        else:

            distance_phrase = "far"


        # -------------------------------------------------
        # FINAL MESSAGE
        # -------------------------------------------------

        return (
            f"{object_name} "
            f"{position_phrase}, "
            f"{distance_phrase}."
        )


    # =====================================================
    # SPEAK ALERT
    # =====================================================

    def speak_alert(
        self,
        object_name,
        direction,
        proximity
    ):

        message = self.build_alert_message(
            object_name,
            direction,
            proximity
        )

        self.speak(
            message
        )