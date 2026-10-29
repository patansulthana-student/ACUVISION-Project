# =========================================================
# ACUVISION — FLASK API
# CONTINUOUS AI PROCESSING + VIDEO + TELEMETRY
# ALERTS + EVENTS + AUDIO + VOICE
# =========================================================

from flask import Flask, jsonify, Response, request
from flask_cors import CORS

from core.engine import AcuVisionEngine
from core.audio import SpatialAudioEngine
from core.voice import VoiceEngine

import config
import threading
import time
import cv2
import json
import os
import subprocess


app = Flask(__name__)
CORS(app)


# =========================================================
# GLOBAL ENGINE STATE
# =========================================================

engine = AcuVisionEngine()

audio_engine = SpatialAudioEngine()

voice_engine = VoiceEngine()

processing_thread = None

data_lock = threading.Lock()


latest_result = {
    "status": "NO_DATA",
    "camera": "OFFLINE",
    "detections": [],
    "primary_hazard": None,
    "alert_generated": False
}


latest_jpeg = None


# =========================================================
# ALERT + EVENT STORAGE
# =========================================================

latest_alert = None

event_lock = threading.Lock()


# =========================================================
# AUDIO ALERT COOLDOWN
# =========================================================

audio_playback_lock = threading.Lock()

last_audio_alert_time = 0.0

AUDIO_ALERT_COOLDOWN = 5.0


# =========================================================
# AUDIO SETTINGS
# =========================================================

audio_settings = {

    "masterVolume": 70,

    "spatialIntensity": 80,

    "voiceVolume": 65,

    "voiceSpeed": 100,

    "spatialAudio": True,

    "voiceAlerts": True,

    "criticalAlerts": True,

    "sensitivity": "HIGH"

}


# =========================================================
# EVENT FILE
# =========================================================

EVENTS_FILE = os.path.join(
    os.path.dirname(__file__),
    "events.json"
)


# =========================================================
# LOAD SAVED EVENTS
# =========================================================

def load_events():

    if not os.path.exists(EVENTS_FILE):
        return []

    try:

        with open(
            EVENTS_FILE,
            "r",
            encoding="utf-8"
        ) as file:

            data = json.load(file)

        return data.get(
            "events",
            []
        )

    except (
        json.JSONDecodeError,
        OSError
    ):

        return []


# =========================================================
# SAVE EVENTS
# =========================================================

def save_events(events):

    try:

        with open(
            EVENTS_FILE,
            "w",
            encoding="utf-8"
        ) as file:

            json.dump(
                {
                    "events": events
                },
                file,
                indent=4
            )

    except OSError as error:

        print(
            f"Could not save events: {error}"
        )


# =========================================================
# LOAD EVENT HISTORY
# =========================================================

event_history = load_events()


# =========================================================
# APPLY AUDIO SETTINGS
# =========================================================

def apply_audio_settings():

    audio_engine.set_settings(

        master_volume=
            audio_settings["masterVolume"],

        spatial_intensity=
            audio_settings["spatialIntensity"],

        enabled=
            audio_settings["spatialAudio"]

    )

    voice_engine.set_settings(

        voice_volume=
            audio_settings["voiceVolume"],

        voice_speed=
            audio_settings["voiceSpeed"],

        enabled=
            audio_settings["voiceAlerts"]

    )


# Apply default settings when backend starts.
apply_audio_settings()


# =========================================================
# PLAY ALERT AUDIO
# =========================================================

def play_alert_audio(primary):

    global last_audio_alert_time


    if not primary:
        return


    # -----------------------------------------------------
    # Only one alert can use the audio system at a time.
    # -----------------------------------------------------

    with audio_playback_lock:

        current_time = time.monotonic()


        # -------------------------------------------------
        # Global cooldown
        # -------------------------------------------------

        if (
            current_time
            - last_audio_alert_time
            <
            AUDIO_ALERT_COOLDOWN
        ):

            print(
                "AUDIO ALERT SKIPPED - cooldown active."
            )

            return


        last_audio_alert_time = current_time


        # -------------------------------------------------
        # Detection information
        # -------------------------------------------------

        object_name = primary.get(
            "object",
            "object"
        )

        direction = primary.get(
            "direction",
            "CENTER"
        )

        proximity = primary.get(
            "proximity",
            "FAR"
        )

        priority = primary.get(
            "priority",
            "LOW"
        )


        print(
            "=========================================="
        )

        print(
            "AUDIO ALERT"
        )

        print(
            f"Object: {object_name}"
        )

        print(
            f"Direction: {direction}"
        )

        print(
            f"Proximity: {proximity}"
        )

        print(
            f"Priority: {priority}"
        )

        print(
            "=========================================="
        )


        # -------------------------------------------------
        # Spatial audio
        # -------------------------------------------------

        if audio_settings["spatialAudio"]:

            try:

                audio_engine.play_directional_tone(
                    direction
                )

            except Exception as error:

                print(
                    f"Spatial audio error: {error}"
                )


        # -------------------------------------------------
        # Voice alert
        # -------------------------------------------------

        if (
            audio_settings["voiceAlerts"]
            and
            (
                audio_settings["criticalAlerts"]
                or
                priority not in (
                    "CRITICAL",
                    "HIGH"
                )
            )
        ):

            try:

                voice_engine.speak_alert(
                    object_name,
                    direction,
                    proximity
                )

            except Exception as error:

                print(
                    f"Voice alert error: {error}"
                )


# =========================================================
# CONTINUOUS PROCESSING LOOP
# =========================================================

def processing_loop():

    global latest_result
    global latest_jpeg
    global latest_alert
    global event_history


    print(
        "ACUVISION continuous processing started."
    )


    while engine.running:

        try:

            # ---------------------------------------------
            # PROCESS ONE FRAME
            # ---------------------------------------------

            result = engine.process_frame()

            frame = result["frame"].copy()


            # ---------------------------------------------
            # DRAW YOLO DETECTIONS
            # ---------------------------------------------

            for detection in result["detections"]:

                bbox = detection.get(
                    "bbox"
                )


                if (
                    not bbox
                    or len(bbox) != 4
                ):

                    continue


                x1, y1, x2, y2 = map(
                    int,
                    bbox
                )


                object_name = detection.get(
                    "object",
                    "object"
                )


                confidence = float(
                    detection.get(
                        "confidence",
                        0
                    )
                )


                direction = detection.get(
                    "direction",
                    "CENTER"
                )


                proximity = detection.get(
                    "proximity",
                    "FAR"
                )


                label = (
                    f"{object_name} "
                    f"{confidence:.1f}% "
                    f"{direction} "
                    f"{proximity}"
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
                        max(
                            y1 - 10,
                            20
                        )
                    ),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.55,
                    (0, 255, 0),
                    2
                )


            # ---------------------------------------------
            # PRIMARY HAZARD
            # ---------------------------------------------

            primary = result.get(
                "primary_hazard"
            )


            if primary:

                primary_text = (
                    "PRIMARY: "
                    f'{primary.get("object", "Unknown")} | '
                    f'{primary.get("direction", "CENTER")} | '
                    f'{primary.get("proximity", "FAR")} | '
                    f'{primary.get("priority", "LOW")}'
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


            # ---------------------------------------------
            # ALERT STATUS
            # ---------------------------------------------

            if result.get(
                "alert_generated",
                False
            ):

                cv2.putText(
                    frame,
                    "ALERT GENERATED",
                    (20, 65),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.65,
                    (0, 0, 255),
                    2
                )


            # ---------------------------------------------
            # SAVE NEW ALERT AS EVENT
            # ---------------------------------------------

            if (
                result.get("alert_generated")
                and
                result.get("primary_hazard")
            ):

                primary = result[
                    "primary_hazard"
                ]


                current_time = time.strftime(
                    "%H:%M:%S"
                )


                timestamp_ms = int(
                    time.time() * 1000
                )


                event_id = (
                    f"EV-{timestamp_ms}"
                )


                alert_id = (
                    f"AL-{timestamp_ms}"
                )


                event = {

                    "event_id":
                        event_id,

                    "alert_id":
                        alert_id,

                    "time":
                        current_time,

                    "object":
                        primary.get(
                            "object",
                            "Unknown"
                        ),

                    "direction":
                        primary.get(
                            "direction",
                            "CENTER"
                        ),

                    "proximity":
                        primary.get(
                            "proximity",
                            "FAR"
                        ),

                    "score":
                        round(
                            float(
                                primary.get(
                                    "threat_score",
                                    0
                                )
                            )
                        ),

                    "priority":
                        primary.get(
                            "priority",
                            "LOW"
                        ),

                    "confidence":
                        round(
                            float(
                                primary.get(
                                    "confidence",
                                    0
                                )
                            ),
                            1
                        )

                }


                # -----------------------------------------
                # STORE ALERT + EVENT
                # -----------------------------------------

                with event_lock:

                    latest_alert = event


                    event_history.insert(
                        0,
                        event
                    )


                    # Keep latest 50 events.

                    del event_history[50:]


                    # Save permanently.

                    save_events(
                        event_history
                    )


                # -----------------------------------------
                # PLAY REAL AUDIO ALERT
                # -----------------------------------------

                threading.Thread(
                    target=play_alert_audio,
                    args=(primary,),
                    daemon=True
                ).start()


                # -----------------------------------------
                # TERMINAL INFORMATION
                # -----------------------------------------

                print(
                    "=========================================="
                )

                print(
                    "ALERT → EVENT SAVED"
                )

                print(
                    f'Event ID: {event["event_id"]}'
                )

                print(
                    f'Object: {event["object"]}'
                )

                print(
                    f'Direction: {event["direction"]}'
                )

                print(
                    f'Proximity: {event["proximity"]}'
                )

                print(
                    f'Score: {event["score"]}'
                )

                print(
                    f'Priority: {event["priority"]}'
                )

                print(
                    "=========================================="
                )


            # ---------------------------------------------
            # ENCODE FRAME
            # ---------------------------------------------

            success, encoded = cv2.imencode(
                ".jpg",
                frame
            )


            if success:

                with data_lock:

                    latest_jpeg = (
                        encoded.tobytes()
                    )


                    latest_result = {

                        "status":
                            "OK",

                        "camera":
                            engine.camera.get_source(),

                        "detections":
                            result["detections"],

                        "primary_hazard":
                            result["primary_hazard"],

                        "alert_generated":
                            result["alert_generated"]

                    }


            time.sleep(
                0.03
            )


        except Exception as error:

            import traceback


            print(
                "\n========== PROCESSING ERROR =========="
            )


            traceback.print_exc()


            print(
                "======================================\n"
            )


            with data_lock:

                latest_result = {

                    "status":
                        "ERROR",

                    "camera":
                        (
                            engine.camera.get_source()
                            if engine.camera.camera_source
                            else "OFFLINE"
                        ),

                    "detections":
                        [],

                    "primary_hazard":
                        None,

                    "alert_generated":
                        False

                }


            time.sleep(
                0.5
            )


    print(
        "ACUVISION continuous processing stopped."
    )


# =========================================================
# HOME
# =========================================================

@app.route("/")
def home():

    return jsonify({

        "project":
            "ACUVISION",

        "message":
            "ACUVISION Backend Running",

        "phase":
            "Continuous AI Processing"

    })


# =========================================================
# STATUS
# =========================================================

@app.route("/status")
def status():

    return jsonify({

        "system":
            "ACUVISION",

        "backend":
            "ONLINE",

        "demo_mode":
            config.DEMO_MODE,

        "engine_running":
            engine.running,

        "camera":
            (
                engine.camera.get_source()
                if engine.camera.camera_source
                else "OFFLINE"
            ),

        "audio":
            {
                "spatial_audio":
                    audio_settings["spatialAudio"],

                "voice_alerts":
                    audio_settings["voiceAlerts"]

            }

    })


# =========================================================
# START
# =========================================================

@app.route(
    "/start",
    methods=["POST"]
)
def start_engine():

    global processing_thread


    if engine.running:

        return jsonify({

            "status":
                "ALREADY_RUNNING",

            "camera":
                engine.camera.get_source()

        })


    try:

        engine.start()


        processing_thread = threading.Thread(
            target=processing_loop,
            daemon=True
        )


        processing_thread.start()


        return jsonify({

            "status":
                "STARTED",

            "camera":
                engine.camera.get_source()

        })


    except Exception as error:

        print(
            f"Start error: {error}"
        )


        return jsonify({

            "status":
                "ERROR",

            "message":
                str(error)

        }), 500


# =========================================================
# STOP
# =========================================================

@app.route(
    "/stop",
    methods=["POST"]
)
def stop_engine():

    if not engine.running:

        return jsonify({

            "status":
                "ALREADY_STOPPED"

        })


    engine.stop()


    return jsonify({

        "status":
            "STOPPED"

    })


# =========================================================
# CAMERA STATUS
# =========================================================

@app.route(
    "/camera/status"
)
def camera_status():

    return jsonify({

        "status":
            (
                "ONLINE"
                if engine.camera.camera_source
                else "OFFLINE"
            ),

        "source":
            (
                engine.camera.get_source()
                if engine.camera.camera_source
                else None
            )

    })


# =========================================================
# TELEMETRY
# =========================================================

@app.route("/telemetry")
def telemetry():

    with data_lock:

        return jsonify(
            latest_result
        )


# =========================================================
# LATEST ALERT
# =========================================================

@app.route("/alert")
def alert():

    with event_lock:

        if latest_alert is None:

            return jsonify({

                "status":
                    "NO_ALERT",

                "alert":
                    None

            })


        return jsonify({

            "status":
                "OK",

            "alert":
                latest_alert

        })


# =========================================================
# BATTERY STATUS
# =========================================================

@app.route(
    "/battery/status",
    methods=["GET"]
)
def battery_status():

    try:

        command = [

            "powershell",

            "-NoProfile",

            "-Command",

            (
                "Get-CimInstance Win32_Battery | "
                "Select-Object "
                "EstimatedChargeRemaining, "
                "BatteryStatus | "
                "ConvertTo-Json"
            )

        ]


        result = subprocess.run(

            command,

            capture_output=True,

            text=True,

            timeout=5

        )


        if result.returncode != 0:

            return jsonify({

                "status":
                    "ERROR",

                "message":
                    "Unable to read Windows battery status."

            }), 500


        output = result.stdout.strip()


        if not output:

            return jsonify({

                "status":
                    "UNAVAILABLE",

                "battery":
                    None

            })


        data = json.loads(
            output
        )


        # PowerShell can return either an object
        # or a list depending on the result.

        if isinstance(
            data,
            list
        ):

            if not data:

                return jsonify({

                    "status":
                        "UNAVAILABLE",

                    "battery":
                        None

                })

            data = data[0]


        percentage = data.get(
            "EstimatedChargeRemaining"
        )


        battery_status_code = data.get(
            "BatteryStatus"
        )


        if percentage is None:

            return jsonify({

                "status":
                    "UNAVAILABLE",

                "battery":
                    None

            })


        charging = (
            battery_status_code
            in (
                2,
                6,
                7,
                8,
                9
            )
        )


        return jsonify({

            "status":
                "OK",

            "battery": {

                "percentage":
                    percentage,

                "charging":
                    charging

            }

        })


    except Exception as error:

        print(
            "Battery status error:",
            error
        )


        return jsonify({

            "status":
                "ERROR",

            "message":
                str(error)

        }), 500


# =========================================================
# EVENT HISTORY
# =========================================================

@app.route("/events")
def events():

    with event_lock:

        return jsonify({

            "status":
                "OK",

            "count":
                len(event_history),

            "events":
                event_history

        })


# =========================================================
# AUDIO SETTINGS - GET
# =========================================================

@app.route(
    "/audio/settings",
    methods=["GET"]
)
def get_audio_settings():

    return jsonify({

        "status":
            "OK",

        "settings":
            audio_settings

    })


# =========================================================
# AUDIO SETTINGS - POST
# =========================================================

@app.route(
    "/audio/settings",
    methods=["POST"]
)
def update_audio_settings():

    global audio_settings


    try:

        data = request.get_json(
            silent=True
        )


        if not isinstance(
            data,
            dict
        ):

            return jsonify({

                "status":
                    "ERROR",

                "message":
                    "JSON object required."

            }), 400


        # ---------------------------------------------
        # Numeric settings
        # ---------------------------------------------

        if "masterVolume" in data:

            audio_settings["masterVolume"] = max(
                0,
                min(
                    100,
                    float(
                        data["masterVolume"]
                    )
                )
            )


        if "spatialIntensity" in data:

            audio_settings["spatialIntensity"] = max(
                0,
                min(
                    100,
                    float(
                        data["spatialIntensity"]
                    )
                )
            )


        if "voiceVolume" in data:

            audio_settings["voiceVolume"] = max(
                0,
                min(
                    100,
                    float(
                        data["voiceVolume"]
                    )
                )
            )


        if "voiceSpeed" in data:

            audio_settings["voiceSpeed"] = max(
                50,
                min(
                    150,
                    float(
                        data["voiceSpeed"]
                    )
                )
            )


        # ---------------------------------------------
        # Boolean settings
        # ---------------------------------------------

        if "spatialAudio" in data:

            audio_settings["spatialAudio"] = bool(
                data["spatialAudio"]
            )


        if "voiceAlerts" in data:

            audio_settings["voiceAlerts"] = bool(
                data["voiceAlerts"]
            )


        if "criticalAlerts" in data:

            audio_settings["criticalAlerts"] = bool(
                data["criticalAlerts"]
            )


        # ---------------------------------------------
        # Sensitivity
        # ---------------------------------------------

        if "sensitivity" in data:

            sensitivity = str(
                data["sensitivity"]
            ).upper()


            if sensitivity not in (
                "LOW",
                "MEDIUM",
                "HIGH"
            ):

                return jsonify({

                    "status":
                        "ERROR",

                    "message":
                        (
                            "Sensitivity must be "
                            "LOW, MEDIUM, or HIGH."
                        )

                }), 400


            audio_settings["sensitivity"] = (
                sensitivity
            )


        # ---------------------------------------------
        # Apply settings to real engines
        # ---------------------------------------------

        apply_audio_settings()


        print(
            "ACUVISION audio settings updated:",
            audio_settings
        )


        return jsonify({

            "status":
                "OK",

            "settings":
                audio_settings

        })


    except (
        TypeError,
        ValueError
    ) as error:

        return jsonify({

            "status":
                "ERROR",

            "message":
                str(error)

        }), 400


    except Exception as error:

        print(
            f"Audio settings error: {error}"
        )


        return jsonify({

            "status":
                "ERROR",

            "message":
                str(error)

        }), 500


# =========================================================
# LIVE VIDEO FEED
# =========================================================

@app.route("/video_feed")
def video_feed():

    def generate():

        while True:

            with data_lock:

                frame = latest_jpeg


            if frame is not None:

                yield (
                    b"--frame\r\n"
                    b"Content-Type: image/jpeg\r\n\r\n"
                    + frame
                    + b"\r\n"
                )


            time.sleep(
                0.05
            )


    return Response(

        generate(),

        mimetype=(
            "multipart/x-mixed-replace;"
            " boundary=frame"
        )

    )


# =========================================================
# AUDIO TEST
# =========================================================

@app.route(
    "/audio/test/<direction>",
    methods=["POST"]
)
def test_audio(direction):

    direction = direction.upper()


    if direction not in (
        "LEFT",
        "CENTER",
        "RIGHT"
    ):

        return jsonify({

            "status":
                "ERROR",

            "message":
                (
                    "Direction must be "
                    "LEFT, CENTER, or RIGHT."
                )

        }), 400


    try:

        if audio_settings["spatialAudio"]:

            audio_engine.play_directional_tone(
                direction
            )


        if audio_settings["voiceAlerts"]:

            voice_engine.speak_alert(

                "Test object",

                direction,

                "CLOSE"

            )


        return jsonify({

            "status":
                "OK",

            "direction":
                direction

        })


    except Exception as error:

        print(
            f"Audio test error: {error}"
        )


        return jsonify({

            "status":
                "ERROR",

            "message":
                str(error)

        }), 500


# =========================================================
# SETTINGS
# =========================================================

@app.route("/settings")
def settings():

    return jsonify({

        "demo_mode":
            config.DEMO_MODE,

        "use_esp32":
            config.USE_ESP32,

        "webcam_fallback":
            config.USE_WEBCAM_FALLBACK

    })


# =========================================================
# SERVER
# =========================================================

if __name__ == "__main__":

    print(
        "=========================================="
    )

    print(
        "        ACUVISION FLASK API"
    )

    print(
        "=========================================="
    )

    print(
        f"Server: "
        f"http://{config.HOST}:{config.PORT}"
    )

    print(
        "=========================================="
    )


    app.run(

        host=config.HOST,

        port=config.PORT,

        debug=config.DEBUG,

        threaded=True

    )