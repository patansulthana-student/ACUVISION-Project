# =========================================================
# ACUVISION — SPATIAL AUDIO OUTPUT TEST
# =========================================================

from audio import SpatialAudioEngine


def main():

    audio = SpatialAudioEngine()

    print("======================================")
    print("   ACUVISION SPATIAL AUDIO TEST")
    print("======================================")

    print("\nPlaying LEFT cue...")
    audio.play_directional_tone("LEFT")

    input(
        "\nPress ENTER to play CENTER cue..."
    )

    audio.play_directional_tone("CENTER")

    input(
        "\nPress ENTER to play RIGHT cue..."
    )

    audio.play_directional_tone("RIGHT")

    print(
        "\nSpatial audio test completed."
    )


if __name__ == "__main__":
    main()