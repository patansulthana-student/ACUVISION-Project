# =========================================================
# ACUVISION - SPATIAL AUDIO ENGINE
# =========================================================

import math
import struct
import tempfile
import wave
try:
    import winsound
except ImportError:
    winsound = None
import os


class SpatialAudioEngine:

    def __init__(self):

        # -------------------------------------------------
        # ACUVISION LOGICAL DIRECTIONS
        #
        # LEFT   -> left channel
        # CENTER -> both channels
        # RIGHT  -> right channel
        #
        # Your M19 headset was observed in the YouTube
        # stereo test to have LEFT and RIGHT physically
        # reversed, so we compensate when creating output.
        # -------------------------------------------------

        self.position_balance = {
            "LEFT": (1.0, 0.0),
            "CENTER": (1.0, 1.0),
            "RIGHT": (0.0, 1.0)
        }

        self.master_volume = 100
        self.spatial_intensity = 100
        self.enabled = True

    # =====================================================
    # SETTINGS
    # =====================================================

    def set_settings(
        self,
        master_volume=None,
        spatial_intensity=None,
        enabled=None
    ):

        if master_volume is not None:

            self.master_volume = max(
                0.0,
                min(100.0, float(master_volume))
            )

        if spatial_intensity is not None:

            self.spatial_intensity = max(
                0.0,
                min(100.0, float(spatial_intensity))
            )

        if enabled is not None:

            self.enabled = bool(enabled)

    # =====================================================
    # BALANCE
    # =====================================================

    def calculate_balance(self, direction):

        direction = direction.upper().strip()

        if direction not in self.position_balance:

            raise ValueError(
                "Direction must be LEFT, CENTER, or RIGHT."
            )

        left_level, right_level = (
            self.position_balance[direction]
        )

        return {
            "direction": direction,
            "left_level": left_level,
            "right_level": right_level
        }

    # =====================================================
    # PERCENTAGES
    # =====================================================

    def calculate_percentages(self, direction):

        balance = self.calculate_balance(
            direction
        )

        master = (
            self.master_volume / 100.0
        )

        intensity = (
            self.spatial_intensity / 100.0
        )

        return {
            "direction":
                balance["direction"],

            "left_percent":
                round(
                    balance["left_level"]
                    * master
                    * intensity
                    * 100
                ),

            "right_percent":
                round(
                    balance["right_level"]
                    * master
                    * intensity
                    * 100
                )
        }

    # =====================================================
    # GENERATE STEREO TONE
    # =====================================================

    def generate_tone(
        self,
        direction,
        filename,
        duration=0.5,
        frequency=600,
        sample_rate=44100
    ):

        balance = self.calculate_balance(
            direction
        )

        master = (
            self.master_volume / 100.0
        )

        intensity = (
            self.spatial_intensity / 100.0
        )

        logical_left_level = (
            balance["left_level"]
            * master
            * intensity
        )

        logical_right_level = (
            balance["right_level"]
            * master
            * intensity
        )

        total_samples = int(
            sample_rate * duration
        )

        amplitude = 12000

        with wave.open(
            filename,
            "wb"
        ) as wav_file:

            # 2-channel stereo
            wav_file.setnchannels(2)

            # 16-bit audio
            wav_file.setsampwidth(2)

            wav_file.setframerate(
                sample_rate
            )

            frames = bytearray()

            for i in range(
                total_samples
            ):

                time_value = (
                    i / sample_rate
                )

                sample = (
                    math.sin(
                        2
                        * math.pi
                        * frequency
                        * time_value
                    )
                    * amplitude
                )

                # -----------------------------------------
                # LOGICAL ACUVISION CHANNELS
                # -----------------------------------------

                logical_left = int(
                    sample
                    * logical_left_level
                )

                logical_right = int(
                    sample
                    * logical_right_level
                )

                # -----------------------------------------
                # M19 CHANNEL COMPENSATION
                #
                # Physical headset result:
                #
                # software LEFT  -> physical RIGHT
                # software RIGHT -> physical LEFT
                #
                # Therefore swap them.
                # -----------------------------------------

                physical_left = (
                    logical_right
                )

                physical_right = (
                    logical_left
                )

                frames.extend(
                    struct.pack(
                        "<hh",
                        physical_left,
                        physical_right
                    )
                )

            wav_file.writeframes(
                frames
            )

    # =====================================================
    # PLAY DIRECTIONAL TONE
    # =====================================================

    def play_directional_tone(
        self,
        direction
    ):

        if not self.enabled:

            return

        with tempfile.NamedTemporaryFile(
            suffix=".wav",
            delete=False
        ) as temp_file:

            filename = temp_file.name

        try:

            self.generate_tone(
                direction,
                filename
            )

            if winsound is not None:
                winsound.PlaySound(
                    filename,
                    winsound.SND_FILENAME
                )

        finally:

            try:

                os.remove(
                    filename
                )

            except OSError:

                pass

