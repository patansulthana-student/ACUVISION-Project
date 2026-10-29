# =========================================================
# ACUVISION — VOICE ENGINE TEST
# =========================================================

from voice import VoiceEngine


def main():

    voice = VoiceEngine()

    print("======================================")
    print("   ACUVISION VOICE ENGINE TEST")
    print("======================================")

    tests = [

        {
            "object": "Chair",
            "direction": "CENTER",
            "proximity": "VERY CLOSE"
        },

        {
            "object": "Person",
            "direction": "LEFT",
            "proximity": "CLOSE"
        },

        {
            "object": "Bottle",
            "direction": "RIGHT",
            "proximity": "FAR"
        }

    ]


    for test in tests:

        message = voice.build_alert_message(
            test["object"],
            test["direction"],
            test["proximity"]
        )

        print(f"Speaking: {message}")

        voice.speak(message)


if __name__ == "__main__":
    main()