
import math
import struct
import tempfile
import wave
import winsound
import os


SAMPLE_RATE = 44100
DURATION = 1.0
FREQUENCY = 600
AMPLITUDE = 12000


def make_tone(filename, left_level, right_level):

    total_samples = int(
        SAMPLE_RATE * DURATION
    )

    with wave.open(filename, "wb") as wav:

        wav.setnchannels(2)
        wav.setsampwidth(2)
        wav.setframerate(SAMPLE_RATE)

        frames = bytearray()

        for i in range(total_samples):

            t = i / SAMPLE_RATE

            sample = (
                math.sin(
                    2 * math.pi * FREQUENCY * t
                )
                * AMPLITUDE
            )

            left = int(
                sample * left_level
            )

            right = int(
                sample * right_level
            )

            frames.extend(
                struct.pack(
                    "<hh",
                    left,
                    right
                )
            )

        wav.writeframes(frames)


def play(left_level, right_level):

    with tempfile.NamedTemporaryFile(
        suffix=".wav",
        delete=False
    ) as temp:

        filename = temp.name

    try:

        make_tone(
            filename,
            left_level,
            right_level
        )

        winsound.PlaySound(
            filename,
            winsound.SND_FILENAME
        )

    finally:

        try:
            os.remove(filename)
        except OSError:
            pass


print("LEFT TEST")
play(1.0, 0.0)

print("RIGHT TEST")
play(0.0, 1.0)

print("CENTER TEST")
play(1.0, 1.0)

print("TEST COMPLETE")