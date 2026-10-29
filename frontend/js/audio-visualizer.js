
// =========================================================
// ACUVISION — SPATIAL AUDIO VISUALIZER
// LIVE TELEMETRY + REAL BACKEND AUDIO TEST
// =========================================================

console.log(
    "ACUVISION audio-visualizer.js loaded"
);


const AUDIO_API_URL =
    "http://127.0.0.1:5000";


document.addEventListener(
    "DOMContentLoaded",
    () => {


        // =================================================
        // DOM ELEMENTS
        // =================================================

        const directionMarker =
            document.getElementById(
                "directionMarker"
            );


        const audioObject =
            document.getElementById(
                "audioObject"
            );


        const audioDirection =
            document.getElementById(
                "audioDirection"
            );


        const audioProximity =
            document.getElementById(
                "audioProximity"
            );


        const leftEarFill =
            document.getElementById(
                "leftEarFill"
            );


        const leftEarValue =
            document.getElementById(
                "leftEarValue"
            );


        const rightEarFill =
            document.getElementById(
                "rightEarFill"
            );


        const rightEarValue =
            document.getElementById(
                "rightEarValue"
            );


        const guidanceMessage =
            document.getElementById(
                "guidanceMessage"
            );


        const audioStatus =
            document.getElementById(
                "audioStatus"
            );


        // =================================================
        // AUDIO STATES
        // =================================================

        const audioStates = {

            LEFT: {

                position: 20,

                leftEar: 80,

                rightEar: 20,

                message:
                    "Object detected on the left. Stronger audio guidance in the left ear."

            },


            CENTER: {

                position: 50,

                leftEar: 50,

                rightEar: 50,

                message:
                    "Object detected in front. Audio balanced between both ears."

            },


            RIGHT: {

                position: 80,

                leftEar: 20,

                rightEar: 80,

                message:
                    "Object detected on the right. Stronger audio guidance in the right ear."

            }

        };


        // =================================================
        // UPDATE AUDIO VISUALIZATION
        // =================================================

        function setAudioDirection(
            direction,
            message = null
        ) {

            const normalizedDirection =
                String(
                    direction || "CENTER"
                ).toUpperCase();


            const state =
                audioStates[
                    normalizedDirection
                ];


            if (!state) {

                return;

            }


            // ---------------------------------------------
            // Direction marker
            // ---------------------------------------------

            if (directionMarker) {

                directionMarker.style.left =
                    `${state.position}%`;

            }


            // ---------------------------------------------
            // LEFT EAR
            // ---------------------------------------------

            if (leftEarFill) {

                leftEarFill.style.width =
                    `${state.leftEar}%`;

            }


            if (leftEarValue) {

                leftEarValue.textContent =
                    `${state.leftEar}%`;

            }


            // ---------------------------------------------
            // RIGHT EAR
            // ---------------------------------------------

            if (rightEarFill) {

                rightEarFill.style.width =
                    `${state.rightEar}%`;

            }


            if (rightEarValue) {

                rightEarValue.textContent =
                    `${state.rightEar}%`;

            }


            // ---------------------------------------------
            // DIRECTION TEXT
            // ---------------------------------------------

            if (audioDirection) {

                audioDirection.textContent =
                    normalizedDirection;

            }


            // ---------------------------------------------
            // GUIDANCE MESSAGE
            // ---------------------------------------------

            if (guidanceMessage) {

                guidanceMessage.textContent =
                    message ||
                    state.message;

            }

        }


        // =================================================
        // UPDATE LIVE TELEMETRY
        // =================================================

        async function updateLiveAudio() {

            try {

                const response =
                    await fetch(
                        `${AUDIO_API_URL}/telemetry`,
                        {
                            cache: "no-store"
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        `Telemetry HTTP ${response.status}`
                    );

                }


                const data =
                    await response.json();


                if (
                    !data
                    ||
                    data.status !== "OK"
                ) {

                    throw new Error(
                        "Live telemetry unavailable"
                    );

                }


                const hazard =
                    data.primary_hazard;


                // -----------------------------------------
                // No active hazard
                // -----------------------------------------

                if (!hazard) {

                    if (audioObject) {

                        audioObject.textContent =
                            "No active object";

                    }


                    if (audioDirection) {

                        audioDirection.textContent =
                            "—";

                    }


                    if (audioProximity) {

                        audioProximity.textContent =
                            "—";

                    }


                    setAudioDirection(
                        "CENTER",
                        "Waiting for live object detection..."
                    );


                    return;

                }


                // -----------------------------------------
                // Real detection information
                // -----------------------------------------

                const objectName =
                    hazard.object ||
                    "Unknown";


                const direction =
                    String(
                        hazard.direction ||
                        "CENTER"
                    ).toUpperCase();


                const proximity =
                    String(
                        hazard.proximity ||
                        "FAR"
                    ).toUpperCase();


                // -----------------------------------------
                // Object
                // -----------------------------------------

                if (audioObject) {

                    audioObject.textContent =
                        objectName;

                }


                // -----------------------------------------
                // Direction
                // -----------------------------------------

                if (audioDirection) {

                    audioDirection.textContent =
                        direction;

                }


                // -----------------------------------------
                // Proximity
                // -----------------------------------------

                if (audioProximity) {

                    audioProximity.textContent =
                        proximity;

                }


                // -----------------------------------------
                // Direction visualization
                // -----------------------------------------

                const guidance =
                    direction === "LEFT"
                        ? `${objectName} ${proximity.toLowerCase()} on the left.`
                        : direction === "RIGHT"
                            ? `${objectName} ${proximity.toLowerCase()} on the right.`
                            : `${objectName} ${proximity.toLowerCase()} in front.`;


                setAudioDirection(
                    direction,
                    guidance
                );


                // -----------------------------------------
                // Status
                // -----------------------------------------

                if (audioStatus) {

                    audioStatus.innerHTML =
                        '<span class="status-dot"></span> SPATIAL AUDIO ACTIVE';

                }

            }
            catch (error) {

                console.error(
                    "Spatial audio error:",
                    error
                );


                if (audioStatus) {

                    audioStatus.innerHTML =
                        '<span class="status-dot"></span> BACKEND OFFLINE';

                }


                if (guidanceMessage) {

                    guidanceMessage.textContent =
                        "Unable to receive live spatial audio information.";

                }

            }

        }


        // =================================================
        // REAL AUDIO TEST
        // =================================================

        window.testAudioDirection =
            async function (
                direction
            ) {

                const normalizedDirection =
                    String(
                        direction
                    ).toUpperCase();


                if (
                    !audioStates[
                        normalizedDirection
                    ]
                ) {

                    return;

                }


                try {

                    if (guidanceMessage) {

                        guidanceMessage.textContent =
                            `Testing ${normalizedDirection.toLowerCase()} directional audio...`;

                    }


                    const response =
                        await fetch(
                            `${AUDIO_API_URL}/audio/test/${normalizedDirection.toLowerCase()}`,
                            {
                                method: "POST"
                            }
                        );


                    const data =
                        await response.json();


                    if (!response.ok) {

                        throw new Error(
                            data.message ||
                            "Audio test failed"
                        );

                    }


                    setAudioDirection(
                        normalizedDirection
                    );


                    console.log(
                        "Real audio test successful:",
                        data
                    );

                }
                catch (error) {

                    console.error(
                        "Real audio test failed:",
                        error
                    );


                    if (guidanceMessage) {

                        guidanceMessage.textContent =
                            "Audio test failed. Check that Flask is running.";

                    }

                }

            };


        // =================================================
        // INITIAL LOAD
        // =================================================

        updateLiveAudio();


        // =================================================
        // LIVE REFRESH
        // =================================================

        setInterval(
            updateLiveAudio,
            1000
        );

    }
);