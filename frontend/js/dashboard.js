// =========================================================
// ACUVISION — DASHBOARD
// LIVE FLASK TELEMETRY + LIVE CAMERA
// =========================================================

console.log(
    "ACUVISION dashboard.js loaded"
);


const API_BASE =
    "http://127.0.0.1:5000";


// =========================================================
// DOM READY
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        // =================================================
        // ELEMENTS
        // =================================================

        const liveCameraFeed =
            document.getElementById(
                "liveCameraFeed"
            );


        const cameraMessage =
            document.getElementById(
                "cameraMessage"
            );


        const cameraLiveStatus =
            document.getElementById(
                "cameraLiveStatus"
            );


        const cameraModeBadge =
            document.getElementById(
                "cameraModeBadge"
            );


        const cameraMode =
            document.getElementById(
                "cameraMode"
            );


        const fpsValue =
            document.getElementById(
                "fps-value"
            );


        const hazardLevel =
            document.getElementById(
                "hazard-level"
            );


        const hazardObject =
            document.getElementById(
                "hazard-object"
            );


        const hazardDescription =
            document.getElementById(
                "hazard-description"
            );


        const hazardConfidence =
            document.getElementById(
                "hazard-confidence"
            );


        const hazardDirection =
            document.getElementById(
                "hazard-direction"
            );


        const hazardProximity =
            document.getElementById(
                "hazard-proximity"
            );


        const threatScore =
            document.getElementById(
                "threat-score"
            );


        const scoreFill =
            document.getElementById(
                "score-fill"
            );


        const audioStatus =
            document.getElementById(
                "audioStatus"
            );


        const audioPosition =
            document.getElementById(
                "audioPosition"
            );


        const leftVolume =
            document.getElementById(
                "leftVolume"
            );


        const rightVolume =
            document.getElementById(
                "rightVolume"
            );


        const leftValue =
            document.getElementById(
                "leftValue"
            );


        const rightValue =
            document.getElementById(
                "rightValue"
            );


        const distanceLevel =
            document.getElementById(
                "distanceLevel"
            );


        const distanceMeter =
            document.getElementById(
                "distanceMeter"
            );


        const priorityScore =
            document.getElementById(
                "priorityScore"
            );


        const priorityBar =
            document.getElementById(
                "priorityBar"
            );


        const priorityText =
            document.getElementById(
                "priorityText"
            );


        const dashboardAIStatus =
            document.getElementById(
                "dashboardAIStatus"
            );


        const dashboardSpatialStatus =
            document.getElementById(
                "dashboardSpatialStatus"
            );


        const dashboardVoiceStatus =
            document.getElementById(
                "dashboardVoiceStatus"
            );


        const dashboardBackendStatus =
            document.getElementById(
                "dashboardBackendStatus"
            );


        const objectRows =
            document.getElementById(
                "dashboardObjectRows"
            );


        const objectCount =
            document.getElementById(
                "objectCount"
            );


        const dashboardMode =
            document.getElementById(
                "dashboardMode"
            );


        const dashboardLiveIndicator =
            document.getElementById(
                "dashboardLiveIndicator"
            );


        const sidebarSystemStatus =
            document.getElementById(
                "sidebarSystemStatus"
            );


        const aiStatusValue =
            document.getElementById(
                "aiStatusValue"
            );


        const cameraStatusValue =
            document.getElementById(
                "cameraStatusValue"
            );


        const spatialStatusValue =
            document.getElementById(
                "spatialStatusValue"
            );


        const systemModeValue =
            document.getElementById(
                "systemModeValue"
            );


        // =================================================
        // DIRECTION → AUDIO BALANCE
        // =================================================

        function getAudioBalance(
            direction
        ) {

            const value =
                String(
                    direction ||
                    "CENTER"
                ).toUpperCase();


            if (value === "LEFT") {

                return {
                    position: 20,
                    left: 80,
                    right: 20
                };

            }


            if (value === "RIGHT") {

                return {
                    position: 80,
                    left: 20,
                    right: 80
                };

            }


            return {
                position: 50,
                left: 50,
                right: 50
            };

        }


        // =================================================
        // UPDATE AUDIO
        // =================================================

        function updateAudio(
            direction
        ) {

            const balance =
                getAudioBalance(
                    direction
                );


            if (audioPosition) {

                audioPosition.style.left =
                    `${balance.position}%`;

            }


            if (leftVolume) {

                leftVolume.style.width =
                    `${balance.left}%`;

            }


            if (rightVolume) {

                rightVolume.style.width =
                    `${balance.right}%`;

            }


            if (leftValue) {

                leftValue.textContent =
                    `${balance.left}%`;

            }


            if (rightValue) {

                rightValue.textContent =
                    `${balance.right}%`;

            }

        }


        // =================================================
        // PROXIMITY → METER
        // =================================================

        function updateProximity(
            proximity
        ) {

            const value =
                String(
                    proximity ||
                    "FAR"
                ).toUpperCase();


            let percentage = 20;


            if (value === "CLOSE") {

                percentage = 60;

            }


            if (
                value === "VERY CLOSE"
            ) {

                percentage = 100;

            }


            if (distanceLevel) {

                distanceLevel.textContent =
                    value;

            }


            if (distanceMeter) {

                distanceMeter.style.width =
                    `${percentage}%`;

            }

        }


        // =================================================
        // PRIORITY
        // =================================================

        function updatePriority(
            hazard
        ) {

            if (!hazard) {

                if (priorityScore) {

                    priorityScore.textContent =
                        "0";

                }


                if (priorityBar) {

                    priorityBar.style.width =
                        "0%";

                }


                if (priorityText) {

                    priorityText.textContent =
                        "Waiting for live environment data.";

                }


                return;

            }


            const score =
                Math.max(
                    0,
                    Math.min(
                        100,
                        Number(
                            hazard.threat_score ?? 0
                        )
                    )
                );


            const priority =
                String(
                    hazard.priority ||
                    "LOW"
                ).toUpperCase();


            if (priorityScore) {

                priorityScore.textContent =
                    Math.round(score);

            }


            if (priorityBar) {

                priorityBar.style.width =
                    `${score}%`;

            }


            if (priorityText) {

                priorityText.textContent =
                    `${priority} priority monitoring active`;

            }

        }


        // =================================================
        // PRIMARY HAZARD
        // =================================================

        function updatePrimaryHazard(
            hazard
        ) {

            if (!hazard) {

                if (hazardObject) {

                    hazardObject.textContent =
                        "No active hazard";

                }


                if (hazardLevel) {

                    hazardLevel.textContent =
                        "SAFE";

                }


                if (hazardDescription) {

                    hazardDescription.textContent =
                        "No active object requires a safety warning.";

                }


                if (hazardConfidence) {

                    hazardConfidence.textContent =
                        "—";

                }


                if (hazardDirection) {

                    hazardDirection.textContent =
                        "—";

                }


                if (hazardProximity) {

                    hazardProximity.textContent =
                        "—";

                }


                if (threatScore) {

                    threatScore.textContent =
                        "— / 100";

                }


                if (scoreFill) {

                    scoreFill.style.width =
                        "0%";

                }


                updateAudio(
                    "CENTER"
                );


                updateProximity(
                    "FAR"
                );


                updatePriority(
                    null
                );


                return;

            }


            const objectName =
                hazard.object ||
                "Unknown";


            const confidence =
                Number(
                    hazard.confidence ?? 0
                );


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


            const score =
                Math.max(
                    0,
                    Math.min(
                        100,
                        Number(
                            hazard.threat_score ?? 0
                        )
                    )
                );


            // ---------------------------------------------
            // MAIN HAZARD
            // ---------------------------------------------

            if (hazardObject) {

                hazardObject.textContent =
                    objectName;

            }


            if (hazardLevel) {

                hazardLevel.textContent =
                    priority;

            }


            if (hazardDescription) {

                hazardDescription.textContent =
                    `${objectName} detected on the ` +
                    `${direction} and classified as ` +
                    `${proximity}.`;

            }


            if (hazardConfidence) {

                hazardConfidence.textContent =
                    `${confidence.toFixed(1)}%`;

            }


            if (hazardDirection) {

                hazardDirection.textContent =
                    direction;

            }


            if (hazardProximity) {

                hazardProximity.textContent =
                    proximity;

            }


            if (threatScore) {

                threatScore.textContent =
                    `${score.toFixed(1)} / 100`;

            }


            if (scoreFill) {

                scoreFill.style.width =
                    `${score}%`;

            }


            updateAudio(
                direction
            );


            updateProximity(
                proximity
            );


            updatePriority(
                hazard
            );

        }


        // =================================================
        // OBJECT TABLE
        // =================================================

        function renderObjects(
            detections
        ) {

            if (!objectRows) {

                return;

            }


            objectRows.innerHTML =
                "";


            if (
                !detections ||
                detections.length === 0
            ) {

                objectRows.innerHTML = `

                    <div class="object-row">

                        <span class="object-name">
                            No objects detected
                        </span>

                        <span>—</span>
                        <span>—</span>
                        <span>—</span>
                        <span>—</span>

                    </div>

                `;


                if (objectCount) {

                    objectCount.textContent =
                        "0 OBJECTS";

                }


                return;

            }


            if (objectCount) {

                objectCount.textContent =
                    `${detections.length} ` +
                    `${detections.length === 1 ? "OBJECT" : "OBJECTS"}`;

            }


            detections.forEach(
                detection => {

                    const row =
                        document.createElement(
                            "div"
                        );


                    row.className =
                        "object-row";


                    const objectName =
                        detection.object ||
                        "Unknown";


                    const confidence =
                        Number(
                            detection.confidence ?? 0
                        );


                    const direction =
                        String(
                            detection.direction ||
                            "CENTER"
                        ).toUpperCase();


                    const proximity =
                        String(
                            detection.proximity ||
                            "FAR"
                        ).toUpperCase();


                    const priority =
                        String(
                            detection.priority ||
                            "LOW"
                        ).toUpperCase();


                    const confidenceText =
                        `${confidence.toFixed(1)}%`;


                    row.innerHTML = `

                        <span class="object-name">

                            ${objectName}

                        </span>


                        <span class="confidence">

                            ${confidenceText}

                        </span>


                        <span class="direction-${direction.toLowerCase()}">

                            ${direction}

                        </span>


                        <span>

                            ${proximity}

                        </span>


                        <span class="priority-${priority.toLowerCase()}">

                            ${priority}

                        </span>

                    `;


                    objectRows.appendChild(
                        row
                    );

                }
            );

        }


        // =================================================
        // STATUS
        // =================================================

        function updateStatus(
            status,
            telemetry
        ) {

            const backendOnline =
                status &&
                status.backend === "ONLINE";


            const engineRunning =
                status &&
                status.engine_running === true;


            const camera =
                status &&
                status.camera
                    ? status.camera
                    : "OFFLINE";


            const cameraOnline =
                camera !== "OFFLINE";


            const aiOnline =
                telemetry &&
                telemetry.status === "OK"
                &&
                engineRunning;


            const spatialAudio =
                status &&
                status.audio &&
                status.audio.spatial_audio === true;


            const voiceAlerts =
                status &&
                status.audio &&
                status.audio.voice_alerts === true;


            // ---------------------------------------------
            // TOP STATUS
            // ---------------------------------------------

            if (aiStatusValue) {

                aiStatusValue.textContent =
                    aiOnline
                        ? "ACTIVE"
                        : "OFFLINE";

            }


            if (cameraStatusValue) {

                cameraStatusValue.textContent =
                    cameraOnline
                        ? camera
                        : "OFFLINE";

            }


            if (spatialStatusValue) {

                spatialStatusValue.textContent =
                    spatialAudio
                        ? "READY"
                        : "DISABLED";

            }


            if (systemModeValue) {

                systemModeValue.textContent =
                    backendOnline
                        ? "LIVE"
                        : "OFFLINE";

            }


            // ---------------------------------------------
            // SIDEBAR
            // ---------------------------------------------

            if (sidebarSystemStatus) {

                sidebarSystemStatus.innerHTML =
                    backendOnline
                        ? '<span class="sidebar-status-dot"></span>SYSTEM ONLINE'
                        : '<span class="sidebar-status-dot"></span>SYSTEM OFFLINE';

            }


            // ---------------------------------------------
            // CAMERA
            // ---------------------------------------------

            if (cameraModeBadge) {

                cameraModeBadge.innerHTML =
                    `<span class="camera-dot"></span>${camera}`;

            }


            if (cameraMode) {

                cameraMode.textContent =
                    camera;

            }


            if (cameraLiveStatus) {

                cameraLiveStatus.innerHTML =
                    cameraOnline
                        ? '<span></span> CAMERA ONLINE'
                        : '<span></span> CAMERA OFFLINE';

            }


            // ---------------------------------------------
            // AUDIO
            // ---------------------------------------------

            if (audioStatus) {

                audioStatus.textContent =
                    spatialAudio
                        ? "ACTIVE"
                        : "DISABLED";

            }


            // ---------------------------------------------
            // SYSTEM CARD
            // ---------------------------------------------

            if (dashboardAIStatus) {

                dashboardAIStatus.textContent =
                    aiOnline
                        ? "● ACTIVE"
                        : "● OFFLINE";

            }


            if (dashboardSpatialStatus) {

                dashboardSpatialStatus.textContent =
                    spatialAudio
                        ? "● ACTIVE"
                        : "● DISABLED";

            }


            if (dashboardVoiceStatus) {

                dashboardVoiceStatus.textContent =
                    voiceAlerts
                        ? "● READY"
                        : "● DISABLED";

            }


            if (dashboardBackendStatus) {

                dashboardBackendStatus.textContent =
                    backendOnline
                        ? "● ONLINE"
                        : "● OFFLINE";

            }


            if (dashboardMode) {

                dashboardMode.textContent =
                    cameraOnline
                        ? `Live ${camera}`
                        : "Backend offline";

            }


            if (dashboardLiveIndicator) {

                dashboardLiveIndicator.innerHTML =
                    backendOnline
                        ? "<span></span> LIVE"
                        : "<span></span> OFFLINE";

            }

        }


        // =================================================
        // LOAD STATUS
        // =================================================

        async function loadStatus() {

            const response =
                await fetch(
                    `${API_BASE}/status`,
                    {
                        cache: "no-store"
                    }
                );


            if (!response.ok) {

                throw new Error(
                    `Status HTTP ${response.status}`
                );

            }


            return response.json();

        }


        // =================================================
        // LOAD TELEMETRY
        // =================================================

        async function loadTelemetry() {

            const response =
                await fetch(
                    `${API_BASE}/telemetry`,
                    {
                        cache: "no-store"
                    }
                );


            if (!response.ok) {

                throw new Error(
                    `Telemetry HTTP ${response.status}`
                );

            }


            return response.json();

        }


        // =================================================
// CAMERA FEED — AUTO RECOVERY
// =================================================

let cameraRetryTimer = null;
let cameraStreamActive = false;
let cameraHasConnected = false;

function hideCameraMessage() {

    if (cameraMessage) {

        cameraMessage.style.display ="none";
            

    }

}


function showCameraMessage() {

    if (cameraMessage && !cameraHasConnected) {

        cameraMessage.style.display ="flex";
            

    }

}


function startCameraFeed() {

    if (!liveCameraFeed) {

        return;

    }


    // Clear an old retry timer.

    if (cameraRetryTimer) {

        clearTimeout(
            cameraRetryTimer
        );

        cameraRetryTimer = null;

    }


    cameraStreamActive = false;


    // Show waiting message while connecting.

    if (!cameraHasConnected) {
    showCameraMessage();
}


    const streamUrl =
        `${API_BASE}/video_feed?dashboard=${Date.now()}`;


    console.log(
        "ACUVISION camera stream connecting:",
        streamUrl
    );


    liveCameraFeed.onload =
        () => {

            cameraStreamActive = true;
            cameraHasConnected = true;
            hideCameraMessage();


            if (cameraLiveStatus) {

                cameraLiveStatus.innerHTML =
                    "<span></span> CAMERA ONLINE";

            }


            console.log(
                "ACUVISION camera stream connected."
            );

        };


    liveCameraFeed.onerror =
        () => {

            
            cameraStreamActive = false;

if (!cameraHasConnected) {
    showCameraMessage();
}


            if (cameraLiveStatus) {

                cameraLiveStatus.innerHTML =
                    "<span></span> RECONNECTING CAMERA";

            }


            console.warn(
                "ACUVISION camera stream unavailable. Retrying..."
            );


            // Automatically retry after 2 seconds.

            cameraRetryTimer =
                setTimeout(
                    startCameraFeed,
                    2000
                );

        };


    liveCameraFeed.src =
        streamUrl;

}


        // =================================================
        // INITIALIZE
        // =================================================

        async function initialize() {

            try {

                // Start engine if necessary.

                try {

                    const startResponse =
                        await fetch(
                            `${API_BASE}/start`,
                            {
                                method: "POST"
                            }
                        );


                    console.log(
                        "ACUVISION start:",
                        await startResponse.json()
                    );

                }
                catch (startError) {

                    console.warn(
                        "Engine start request failed:",
                        startError
                    );

                }


                // Give camera a moment to start.

                await new Promise(
                    resolve =>
                        setTimeout(
                            resolve,
                            1500
                        )
                );


                startCameraFeed();


                await refreshDashboard();

            }
            catch (error) {

                console.error(
                    "ACUVISION dashboard initialization error:",
                    error
                );


                showOfflineState();

            }

        }


        // =================================================
        // REFRESH
        // =================================================

        async function refreshDashboard() {

            try {

                const [
                    status,
                    telemetry
                ] =
                    await Promise.all([
                        loadStatus(),
                        loadTelemetry()
                    ]);


                console.log(
                    "ACUVISION status:",
                    status
                );


                console.log(
                    "ACUVISION telemetry:",
                    telemetry
                );


                updateStatus(
                    status,
                    telemetry
                );


                renderObjects(
                    telemetry.detections || []
                );


                updatePrimaryHazard(
                    telemetry.primary_hazard
                );


                // Use telemetry for FPS where available.
                // The backend does not currently expose actual FPS,
                // so we don't invent one.

                if (fpsValue) {

                    fpsValue.textContent =
                        "LIVE";

                }

            }
            catch (error) {

                console.error(
                    "ACUVISION dashboard refresh error:",
                    error
                );


                showOfflineState();

            }

        }


        // =================================================
        // OFFLINE STATE
        // =================================================

        function showOfflineState() {

            if (aiStatusValue) {

                aiStatusValue.textContent =
                    "OFFLINE";

            }


            if (cameraStatusValue) {

                cameraStatusValue.textContent =
                    "OFFLINE";

            }


            if (spatialStatusValue) {

                spatialStatusValue.textContent =
                    "OFFLINE";

            }


            if (systemModeValue) {

                systemModeValue.textContent =
                    "OFFLINE";

            }


            if (sidebarSystemStatus) {

                sidebarSystemStatus.innerHTML =
                    '<span class="sidebar-status-dot"></span>SYSTEM OFFLINE';

            }


            if (cameraLiveStatus) {

                cameraLiveStatus.innerHTML =
                    '<span></span> CAMERA OFFLINE';

            }


            if (cameraMessage) {

                cameraMessage.style.display =
                    "flex";

            }


            if (hazardObject) {

                hazardObject.textContent =
                    "Backend unavailable";

            }


            if (hazardLevel) {

                hazardLevel.textContent =
                    "OFFLINE";

            }


            if (hazardDescription) {

                hazardDescription.textContent =
                    "Unable to receive live ACUVISION telemetry.";

            }


            if (hazardConfidence) {

                hazardConfidence.textContent =
                    "—";

            }


            if (hazardDirection) {

                hazardDirection.textContent =
                    "—";

            }


            if (hazardProximity) {

                hazardProximity.textContent =
                    "—";

            }


            if (threatScore) {

                threatScore.textContent =
                    "— / 100";

            }


            if (scoreFill) {

                scoreFill.style.width =
                    "0%";

            }


            if (dashboardBackendStatus) {

                dashboardBackendStatus.textContent =
                    "● OFFLINE";

            }

        }


        // =================================================
        // START
        // =================================================

        initialize();


        // Refresh every second.

        setInterval(
            refreshDashboard,
            1000
        );

    }
);