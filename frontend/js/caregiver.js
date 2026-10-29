// =========================================================
// ACUVISION — CAREGIVER MONITOR
// LIVE BACKEND DATA
// =========================================================

console.log("ACUVISION caregiver.js loaded");


document.addEventListener(
    "DOMContentLoaded",
    () => {

        // =================================================
        // ELEMENTS
        // =================================================

        const caregiverSystemStatus =
            document.getElementById(
                "caregiverSystemStatus"
            );

        const caregiverObject =
            document.getElementById(
                "caregiverObject"
            );

        const caregiverSeverity =
            document.getElementById(
                "caregiverSeverity"
            );

        const caregiverMessage =
            document.getElementById(
                "caregiverMessage"
            );

        const caregiverAlertTime =
            document.getElementById(
                "caregiverAlertTime"
            );

        const caregiverConfidence =
            document.getElementById(
                "caregiverConfidence"
            );

        const caregiverDirection =
            document.getElementById(
                "caregiverDirection"
            );

        const caregiverProximity =
            document.getElementById(
                "caregiverProximity"
            );

        const caregiverThreat =
            document.getElementById(
                "caregiverThreat"
            );

        const caregiverAIStatus =
            document.getElementById(
                "caregiverAIStatus"
            );

        const caregiverAIDescription =
            document.getElementById(
                "caregiverAIDescription"
            );

        const caregiverCameraStatus =
            document.getElementById(
                "caregiverCameraStatus"
            );

        const caregiverCameraDescription =
            document.getElementById(
                "caregiverCameraDescription"
            );

        const caregiverAudioStatus =
            document.getElementById(
                "caregiverAudioStatus"
            );

        const caregiverAudioDescription =
            document.getElementById(
                "caregiverAudioDescription"
            );

        const caregiverVoiceStatus =
            document.getElementById(
                "caregiverVoiceStatus"
            );

        const caregiverVoiceDescription =
            document.getElementById(
                "caregiverVoiceDescription"
            );

        const caregiverAlertList =
            document.getElementById(
                "caregiverAlertList"
            );


        // =================================================
        // API URLs
        // =================================================

        const API_BASE =
            "http://127.0.0.1:5000";


        // =================================================
        // LOAD LIVE CAREGIVER DATA
        // =================================================

        async function loadCaregiverData() {

            try {

                // -----------------------------------------
                // STATUS
                // -----------------------------------------

                const statusResponse =
                    await fetch(
                        `${API_BASE}/status`,
                        {
                            cache: "no-store"
                        }
                    );


                if (!statusResponse.ok) {

                    throw new Error(
                        `Status HTTP ${statusResponse.status}`
                    );

                }


                const status =
                    await statusResponse.json();


                // -----------------------------------------
                // TELEMETRY
                // -----------------------------------------

                const telemetryResponse =
                    await fetch(
                        `${API_BASE}/telemetry`,
                        {
                            cache: "no-store"
                        }
                    );


                if (!telemetryResponse.ok) {

                    throw new Error(
                        `Telemetry HTTP ${telemetryResponse.status}`
                    );

                }


                const telemetry =
                    await telemetryResponse.json();


                // -----------------------------------------
                // EVENTS
                // -----------------------------------------

                const eventsResponse =
                    await fetch(
                        `${API_BASE}/events`,
                        {
                            cache: "no-store"
                        }
                    );


                if (!eventsResponse.ok) {

                    throw new Error(
                        `Events HTTP ${eventsResponse.status}`
                    );

                }


                const eventsData =
                    await eventsResponse.json();


                console.log(
                    "ACUVISION caregiver status:",
                    status
                );

                console.log(
                    "ACUVISION caregiver telemetry:",
                    telemetry
                );

                console.log(
                    "ACUVISION caregiver events:",
                    eventsData
                );


                updateSystemStatus(
                    status,
                    telemetry
                );


                updateCurrentHazard(
                    telemetry
                );


                updateRecentAlerts(
                    eventsData.events || []
                );

            }
            catch (error) {

                console.error(
                    "ACUVISION caregiver error:",
                    error
                );


                showOfflineState();

            }

        }


        // =================================================
        // SYSTEM STATUS
        // =================================================

        function updateSystemStatus(
            status,
            telemetry
        ) {

            const backendOnline =
                status.backend === "ONLINE";


            const engineRunning =
                status.engine_running === true;


            const cameraOnline =
                status.camera &&
                status.camera !== "OFFLINE";


            const aiOnline =
                telemetry.status === "OK"
                &&
                engineRunning;


            // -----------------------------------------
            // HEADER
            // -----------------------------------------

            if (
                backendOnline &&
                engineRunning
            ) {

                if (caregiverSystemStatus) {

                    caregiverSystemStatus.innerHTML =
                        '<span class="status-dot"></span> USER ACTIVE';

                }

            }
            else {

                if (caregiverSystemStatus) {

                    caregiverSystemStatus.innerHTML =
                        '<span class="status-dot"></span> SYSTEM OFFLINE';

                }

            }


            // -----------------------------------------
            // AI
            // -----------------------------------------

            if (caregiverAIStatus) {

                caregiverAIStatus.textContent =
                    aiOnline
                        ? "● ACTIVE"
                        : "● OFFLINE";

            }


            if (caregiverAIDescription) {

                caregiverAIDescription.textContent =
                    aiOnline
                        ? "Object perception is running."
                        : "Object perception is unavailable.";

            }


            // -----------------------------------------
            // CAMERA
            // -----------------------------------------

            if (caregiverCameraStatus) {

                caregiverCameraStatus.textContent =
                    cameraOnline
                        ? "● ONLINE"
                        : "● OFFLINE";

            }


            if (caregiverCameraDescription) {

                caregiverCameraDescription.textContent =
                    cameraOnline
                        ? `Visual input: ${status.camera}.`
                        : "Visual input is unavailable.";

            }


            // -----------------------------------------
            // SPATIAL AUDIO
            // -----------------------------------------

            const spatialAudioEnabled =
                status.audio &&
                status.audio.spatial_audio === true;


            if (caregiverAudioStatus) {

                caregiverAudioStatus.textContent =
                    spatialAudioEnabled
                        ? "● ENABLED"
                        : "● DISABLED";

            }


            if (caregiverAudioDescription) {

                caregiverAudioDescription.textContent =
                    spatialAudioEnabled
                        ? "Directional audio is enabled."
                        : "Directional audio is disabled.";

            }


            // -----------------------------------------
            // VOICE
            // -----------------------------------------

            const voiceEnabled =
                status.audio &&
                status.audio.voice_alerts === true;


            if (caregiverVoiceStatus) {

                caregiverVoiceStatus.textContent =
                    voiceEnabled
                        ? "● ENABLED"
                        : "● DISABLED";

            }


            if (caregiverVoiceDescription) {

                caregiverVoiceDescription.textContent =
                    voiceEnabled
                        ? "Spoken warnings are enabled."
                        : "Spoken warnings are disabled.";

            }

        }


        // =================================================
        // CURRENT HAZARD
        // =================================================

        function updateCurrentHazard(
            telemetry
        ) {

            const hazard =
                telemetry.primary_hazard;


            if (!hazard) {

                if (caregiverObject) {

                    caregiverObject.textContent =
                        "No active hazard";

                }


                if (caregiverSeverity) {

                    caregiverSeverity.textContent =
                        "SAFE";

                }


                if (caregiverMessage) {

                    caregiverMessage.textContent =
                        "No active safety hazard detected.";

                }


                if (caregiverAlertTime) {

                    caregiverAlertTime.textContent =
                        "Monitoring live environment";

                }


                if (caregiverConfidence) {

                    caregiverConfidence.textContent =
                        "—";

                }


                if (caregiverDirection) {

                    caregiverDirection.textContent =
                        "—";

                }


                if (caregiverProximity) {

                    caregiverProximity.textContent =
                        "—";

                }


                if (caregiverThreat) {

                    caregiverThreat.textContent =
                        "—";

                }


                return;

            }


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


            const priority =
                String(
                    hazard.priority ||
                    "LOW"
                ).toUpperCase();


            const confidence =
                Number(
                    hazard.confidence ?? 0
                );


            const threat =
                Number(
                    hazard.threat_score ?? 0
                );


            if (caregiverObject) {

                caregiverObject.textContent =
                    objectName;

            }


            if (caregiverSeverity) {

                caregiverSeverity.textContent =
                    priority;

            }


            if (caregiverMessage) {

                caregiverMessage.textContent =
                    `${objectName} detected ` +
                    `${proximity.toLowerCase()} ` +
                    `on the ${direction.toLowerCase()}.`;

            }


            if (caregiverAlertTime) {

                caregiverAlertTime.textContent =
                    telemetry.alert_generated
                        ? "Safety alert generated"
                        : "Currently monitored";

            }


            if (caregiverConfidence) {

                caregiverConfidence.textContent =
                    `${confidence.toFixed(1)}%`;

            }


            if (caregiverDirection) {

                caregiverDirection.textContent =
                    direction;

            }


            if (caregiverProximity) {

                caregiverProximity.textContent =
                    proximity;

            }


            if (caregiverThreat) {

                caregiverThreat.textContent =
                    `${threat.toFixed(1)} / 100`;

            }

        }


        // =================================================
        // RECENT ALERTS
        // =================================================

        function updateRecentAlerts(
            events
        ) {

            if (!caregiverAlertList) {

                return;

            }


            caregiverAlertList.innerHTML =
                "";


            if (
                !events ||
                events.length === 0
            ) {

                caregiverAlertList.innerHTML = `

                    <div class="caregiver-alert-item">

                        No recorded alerts yet.

                    </div>

                `;

                return;

            }


            const recentEvents =
                events.slice(
                    0,
                    5
                );


            recentEvents.forEach(
                event => {

                    const item =
                        document.createElement(
                            "div"
                        );


                    item.className =
                        "caregiver-alert-item";


                    const score =
                        Number(
                            event.score ?? 0
                        );


                    const objectName =
                        event.object ||
                        "Unknown";


                    const direction =
                        String(
                            event.direction ||
                            "CENTER"
                        ).toUpperCase();


                    const proximity =
                        String(
                            event.proximity ||
                            "FAR"
                        ).toUpperCase();


                    const time =
                        event.time ||
                        "—";


                    item.innerHTML = `

                        <div>

                            <strong>
                                ${objectName}
                                ·
                                ${direction}
                            </strong>

                            <span>
                                ${proximity}
                                ·
                                ${time}
                            </span>

                        </div>


                        <div class="caregiver-score
                            ${
                                score >= 80
                                    ? "score-critical"
                                    : score >= 50
                                        ? "score-warning"
                                        : "score-safe"
                            }">

                            ${score}

                        </div>

                    `;


                    caregiverAlertList.appendChild(
                        item
                    );

                }
            );

        }


        // =================================================
        // OFFLINE STATE
        // =================================================

        function showOfflineState() {

            if (caregiverSystemStatus) {

                caregiverSystemStatus.innerHTML =
                    '<span class="status-dot"></span> SYSTEM OFFLINE';

            }


            if (caregiverObject) {

                caregiverObject.textContent =
                    "Backend unavailable";

            }


            if (caregiverSeverity) {

                caregiverSeverity.textContent =
                    "OFFLINE";

            }


            if (caregiverMessage) {

                caregiverMessage.textContent =
                    "Unable to retrieve live safety information.";

            }


            if (caregiverAlertTime) {

                caregiverAlertTime.textContent =
                    "Backend connection unavailable";

            }


            if (caregiverConfidence) {

                caregiverConfidence.textContent =
                    "—";

            }


            if (caregiverDirection) {

                caregiverDirection.textContent =
                    "—";

            }


            if (caregiverProximity) {

                caregiverProximity.textContent =
                    "—";

            }


            if (caregiverThreat) {

                caregiverThreat.textContent =
                    "—";

            }


            if (caregiverAIStatus) {

                caregiverAIStatus.textContent =
                    "● OFFLINE";

            }


            if (caregiverCameraStatus) {

                caregiverCameraStatus.textContent =
                    "● OFFLINE";

            }


            if (caregiverAudioStatus) {

                caregiverAudioStatus.textContent =
                    "● OFFLINE";

            }


            if (caregiverVoiceStatus) {

                caregiverVoiceStatus.textContent =
                    "● OFFLINE";

            }

        }


        // =================================================
        // INITIALIZE
        // =================================================

        loadCaregiverData();


        // =================================================
        // LIVE UPDATE
        // =================================================

        setInterval(
            loadCaregiverData,
            2000
        );

    }
);