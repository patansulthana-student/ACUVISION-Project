
// =========================================================
// ACUVISION — SYSTEM HEALTH
// LIVE BACKEND MONITOR
// =========================================================

const SYSTEM_API_URL =
    "http://127.0.0.1:5000";


document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "ACUVISION system-health.js loaded"
        );


        // =================================================
        // ELEMENTS
        // =================================================

        const systemStatus =
            document.getElementById(
                "systemStatus"
            );

        const healthScore =
            document.getElementById(
                "healthScore"
            );

        const overallSystemStatus =
            document.getElementById(
                "overallSystemStatus"
            );

        const overallSystemDescription =
            document.getElementById(
                "overallSystemDescription"
            );

        const aiBadge =
            document.getElementById(
                "aiBadge"
            );

        const aiFPS =
            document.getElementById(
                "aiFPS"
            );

        const aiProgress =
            document.getElementById(
                "aiProgress"
            );

        const cameraBadge =
            document.getElementById(
                "cameraBadge"
            );

        const cameraValue =
            document.getElementById(
                "cameraValue"
            );

        const cameraProgress =
            document.getElementById(
                "cameraProgress"
            );

        const backendBadge =
            document.getElementById(
                "backendBadge"
            );

        const apiStatus =
            document.getElementById(
                "apiStatus"
            );

        const backendProgress =
            document.getElementById(
                "backendProgress"
            );

        const alertBadge =
            document.getElementById(
                "alertBadge"
            );

        const alertValue =
            document.getElementById(
                "alertValue"
            );

        const alertProgress =
            document.getElementById(
                "alertProgress"
            );

        const audioBadge =
            document.getElementById(
                "audioBadge"
            );

        const audioValue =
            document.getElementById(
                "audioValue"
            );

        const audioProgress =
            document.getElementById(
                "audioProgress"
            );

        const voiceBadge =
            document.getElementById(
                "voiceBadge"
            );

        const voiceValue =
            document.getElementById(
                "voiceValue"
            );

        const voiceProgress =
            document.getElementById(
                "voiceProgress"
            );


        // =================================================
        // LOAD SYSTEM HEALTH
        // =================================================

        async function loadSystemHealth() {

            try {

                // -----------------------------------------
                // BACKEND STATUS
                // -----------------------------------------

                const statusResponse =
                    await fetch(
                        `${SYSTEM_API_URL}/status`,
                        {
                            cache:
                                "no-store"
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
                // CAMERA STATUS
                // -----------------------------------------

                const cameraResponse =
                    await fetch(
                        `${SYSTEM_API_URL}/camera/status`,
                        {
                            cache:
                                "no-store"
                        }
                    );


                if (!cameraResponse.ok) {

                    throw new Error(
                        `Camera HTTP ${cameraResponse.status}`
                    );

                }


                const camera =
                    await cameraResponse.json();


                // -----------------------------------------
                // TELEMETRY
                // -----------------------------------------

                const telemetryResponse =
                    await fetch(
                        `${SYSTEM_API_URL}/telemetry`,
                        {
                            cache:
                                "no-store"
                        }
                    );


                if (!telemetryResponse.ok) {

                    throw new Error(
                        `Telemetry HTTP ${telemetryResponse.status}`
                    );

                }


                const telemetry =
                    await telemetryResponse.json();


                console.log(
                    "ACUVISION system status:",
                    status
                );


                console.log(
                    "ACUVISION camera:",
                    camera
                );


                console.log(
                    "ACUVISION telemetry:",
                    telemetry
                );


                // =================================================
                // SYSTEM STATES
                // =================================================

                const backendOnline =
                    status.backend === "ONLINE";


                const engineRunning =
                    status.engine_running === true;


                const cameraOnline =
                    camera.status === "ONLINE";


                const aiWorking =
                    telemetry.status === "OK"
                    &&
                    engineRunning;


                const spatialAudioEnabled =
                    status.audio
                    &&
                    status.audio.spatial_audio === true;


                const voiceAlertsEnabled =
                    status.audio
                    &&
                    status.audio.voice_alerts === true;


                // =================================================
                // HEALTH SCORE
                // =================================================

                let score = 0;


                if (backendOnline) {

                    score += 25;

                }


                if (cameraOnline) {

                    score += 25;

                }


                if (engineRunning) {

                    score += 25;

                }


                if (aiWorking) {

                    score += 25;

                }


                if (healthScore) {

                    healthScore.textContent =
                        score;

                }


                // =================================================
                // OVERALL STATUS
                // =================================================

                if (
                    backendOnline
                    &&
                    cameraOnline
                    &&
                    engineRunning
                    &&
                    aiWorking
                ) {

                    if (systemStatus) {

                        systemStatus.innerHTML =
                            '<span class="status-dot"></span> ALL SYSTEMS OPERATIONAL';

                    }


                    if (overallSystemStatus) {

                        overallSystemStatus.textContent =
                            "System Ready";

                    }


                    if (overallSystemDescription) {

                        overallSystemDescription.textContent =
                            "Camera, backend, AI processing, audio and voice services are responding normally.";

                    }

                }
                else {

                    if (systemStatus) {

                        systemStatus.innerHTML =
                            '<span class="status-dot"></span> CHECK SYSTEM';

                    }


                    if (overallSystemStatus) {

                        overallSystemStatus.textContent =
                            "System Degraded";

                    }


                    if (overallSystemDescription) {

                        overallSystemDescription.textContent =
                            "One or more ACUVISION processing components are unavailable.";

                    }

                }


                // =================================================
                // BACKEND
                // =================================================

                if (backendOnline) {

                    if (backendBadge) {

                        backendBadge.textContent =
                            "CONNECTED";

                    }


                    if (apiStatus) {

                        apiStatus.textContent =
                            "ONLINE";

                    }


                    if (backendProgress) {

                        backendProgress.style.width =
                            "100%";

                    }

                }
                else {

                    if (backendBadge) {

                        backendBadge.textContent =
                            "OFFLINE";

                    }


                    if (apiStatus) {

                        apiStatus.textContent =
                            "OFFLINE";

                    }


                    if (backendProgress) {

                        backendProgress.style.width =
                            "0%";

                    }

                }


                // =================================================
                // CAMERA
                // =================================================

                if (cameraOnline) {

                    if (cameraBadge) {

                        cameraBadge.textContent =
                            "ACTIVE";

                    }


                    if (cameraValue) {

                        cameraValue.textContent =
                            camera.source ||
                            "ONLINE";

                    }


                    if (cameraProgress) {

                        cameraProgress.style.width =
                            "100%";

                    }

                }
                else {

                    if (cameraBadge) {

                        cameraBadge.textContent =
                            "OFFLINE";

                    }


                    if (cameraValue) {

                        cameraValue.textContent =
                            "OFFLINE";

                    }


                    if (cameraProgress) {

                        cameraProgress.style.width =
                            "0%";

                    }

                }


                // =================================================
                // AI
                // =================================================

                if (aiWorking) {

                    if (aiBadge) {

                        aiBadge.textContent =
                            "ACTIVE";

                    }


                    if (aiFPS) {

                        aiFPS.textContent =
                            "LIVE";

                    }


                    if (aiProgress) {

                        aiProgress.style.width =
                            "100%";

                    }

                }
                else {

                    if (aiBadge) {

                        aiBadge.textContent =
                            "OFFLINE";

                    }


                    if (aiFPS) {

                        aiFPS.textContent =
                            "—";

                    }


                    if (aiProgress) {

                        aiProgress.style.width =
                            "0%";

                    }

                }


                // =================================================
                // ALERT ENGINE
                // =================================================

                if (aiWorking) {

                    if (alertBadge) {

                        alertBadge.textContent =
                            "MONITORING";

                    }


                    if (alertValue) {

                        alertValue.textContent =
                            "READY";

                    }


                    if (alertProgress) {

                        alertProgress.style.width =
                            "100%";

                    }

                }
                else {

                    if (alertBadge) {

                        alertBadge.textContent =
                            "WAITING";

                    }


                    if (alertValue) {

                        alertValue.textContent =
                            "WAITING";

                    }


                    if (alertProgress) {

                        alertProgress.style.width =
                            "0%";

                    }

                }


                // =================================================
                // SPATIAL AUDIO ENGINE
                // =================================================

                if (spatialAudioEnabled) {

                    if (audioBadge) {

                        audioBadge.textContent =
                            "ACTIVE";

                    }


                    if (audioValue) {

                        audioValue.textContent =
                            "ACTIVE";

                    }


                    if (audioProgress) {

                        audioProgress.style.width =
                            "100%";

                    }

                }
                else {

                    if (audioBadge) {

                        audioBadge.textContent =
                            "DISABLED";

                    }


                    if (audioValue) {

                        audioValue.textContent =
                            "OFF";

                    }


                    if (audioProgress) {

                        audioProgress.style.width =
                            "0%";

                    }

                }


                // =================================================
                // VOICE ENGINE
                // =================================================

                if (voiceAlertsEnabled) {

                    if (voiceBadge) {

                        voiceBadge.textContent =
                            "READY";

                    }


                    if (voiceValue) {

                        voiceValue.textContent =
                            "READY";

                    }


                    if (voiceProgress) {

                        voiceProgress.style.width =
                            "100%";

                    }

                }
                else {

                    if (voiceBadge) {

                        voiceBadge.textContent =
                            "DISABLED";

                    }


                    if (voiceValue) {

                        voiceValue.textContent =
                            "OFF";

                    }


                    if (voiceProgress) {

                        voiceProgress.style.width =
                            "0%";

                    }

                }

            }
            catch (error) {

                console.error(
                    "ACUVISION System Health error:",
                    error
                );


                if (systemStatus) {

                    systemStatus.innerHTML =
                        '<span class="status-dot"></span> BACKEND OFFLINE';

                }


                if (healthScore) {

                    healthScore.textContent =
                        "0";

                }


                if (overallSystemStatus) {

                    overallSystemStatus.textContent =
                        "Backend Offline";

                }


                if (overallSystemDescription) {

                    overallSystemDescription.textContent =
                        "Unable to retrieve system health information.";

                }


                if (apiStatus) {

                    apiStatus.textContent =
                        "OFFLINE";

                }


                if (aiBadge) {

                    aiBadge.textContent =
                        "OFFLINE";

                }


                if (cameraBadge) {

                    cameraBadge.textContent =
                        "OFFLINE";

                }


                if (audioBadge) {

                    audioBadge.textContent =
                        "OFFLINE";

                }


                if (audioValue) {

                    audioValue.textContent =
                        "OFFLINE";

                }


                if (voiceBadge) {

                    voiceBadge.textContent =
                        "OFFLINE";

                }


                if (voiceValue) {

                    voiceValue.textContent =
                        "OFFLINE";

                }

            }

        }


        // =================================================
        // INITIAL LOAD
        // =================================================

        loadSystemHealth();


        // =================================================
        // LIVE REFRESH
        // =================================================

        setInterval(
            loadSystemHealth,
            2000
        );

    }
);