import numpy as np
import sounddevice as sd
import time


SAMPLE_RATE = 48000
DURATION = 2.0
FREQUENCY = 600

# IMPORTANT:
# 13 = Headphones (2- M19), Windows WASAPI
OUTPUT_DEVICE = 13


def play_stereo(left_volume, right_volume):

    t = np.linspace(
        0,
        DURATION,
        int(SAMPLE_RATE * DURATION),
        endpoint=False
    )

    tone = np.sin(
        2 * np.pi * FREQUENCY * t
    )

    audio = np.column_stack(
        (
            tone * left_volume,
            tone * right_volume
        )
    ).astype(np.float32)

    print(
        f"Playing device {OUTPUT_DEVICE}"
    )

    sd.play(
        audio,
        samplerate=SAMPLE_RATE,
        device=OUTPUT_DEVICE
    )

    sd.wait()

    time.sleep(1)


print()
print("========================================")
print("ACUVISION TRUE STEREO TEST")
print("========================================")
print()

print("LEFT TEST")
print("LEFT ear should sound.")
print("RIGHT ear should be silent.")
play_stereo(1.0, 0.0)

print()

print("RIGHT TEST")
print("RIGHT ear should sound.")
print("LEFT ear should be silent.")
play_stereo(0.0, 1.0)

print()

print("CENTER TEST")
print("BOTH ears should sound.")
play_stereo(1.0, 1.0)

print()
print("TEST COMPLETE")