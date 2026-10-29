// =========================================================
// ACUVISION — LIVE PERCEPTION
// REAL-TIME TELEMETRY + SPATIAL MAP
// =========================================================

console.log("ACUVISION perception.js loaded");


document.addEventListener(
    "DOMContentLoaded",
    async () => {

        // =================================================
        // DOM ELEMENTS
        // =================================================

        const container =
            document.getElementById(
                "perceptionRows"
            );


        const primaryDetection =
            document.getElementById(
                "primaryDetection"
            );


        const primaryDetectionDetails =
            document.getElementById(
                "primaryDetectionDetails"
            );


        const alertCondition =
            document.getElementById(
                "alertCondition"
            );


        const viewAlertButton =
            document.getElementById(
                "viewAlertButton"
            );


        const perceptionStatus =
            document.getElementById(
                "perceptionStatus"
            );


        const environmentStatus =
            document.getElementById(
                "environmentStatus"
            );


        // Spatial map zones

        const mapLeftZone =
            document.getElementById(
                "mapLeftZone"
            );


        const mapCenterZone =
            document.getElementById(
                "mapCenterZone"
            );


        const mapRightZone =
            document.getElementById(
                "mapRightZone"
            );


        // =================================================
        // DIRECTION CLASS
        // =================================================

        function getDirectionClass(direction) {

            const value =
                String(
                    direction || "CENTER"
                ).toUpperCase();


            if (value === "LEFT") {

                return "direction-left";

            }


            if (value === "RIGHT") {

                return "direction-right";

            }


            return "direction-center";

        }


        // =================================================
        // PRIORITY CLASS
        // =================================================

        function getPriorityClass(priority) {

            const value =
                String(
                    priority || "LOW"
                ).toUpperCase();


            if (
                value === "CRITICAL"
                ||
                value === "HIGH"
            ) {

                return "priority-high";

            }


            if (value === "MEDIUM") {

                return "priority-medium";

            }


            return "priority-low";

        }


        // =================================================
        // RENDER DETECTION TABLE
        // =================================================

        function renderDetections(
            detections
        ) {

            if (!container) {

                return;

            }


            container.innerHTML = "";


            if (
                !detections
                ||
                detections.length === 0
            ) {

                container.innerHTML = `

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

                return;

            }


            detections.forEach(
                (detection) => {

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


                    row.innerHTML = `

                        <span class="object-name">

                            ${objectName}

                        </span>


                        <span class="confidence">

                            ${confidence.toFixed(1)}%

                        </span>


                        <span class="${getDirectionClass(direction)}">

                            ${direction}

                        </span>


                        <span>

                            ${proximity}

                        </span>


                        <span class="${getPriorityClass(priority)}">

                            ${priority}

                        </span>

                    `;


                    container.appendChild(
                        row
                    );

                }
            );

        }


        // =================================================
        // RENDER SPATIAL MAP
        // =================================================

        function renderSpatialMap(
            detections
        ) {

            if (
                !mapLeftZone
                ||
                !mapCenterZone
                ||
                !mapRightZone
            ) {

                console.warn(
                    "Spatial map elements not found."
                );

                return;

            }


            mapLeftZone.innerHTML = "";

            mapCenterZone.innerHTML = "";

            mapRightZone.innerHTML = "";


            if (
                !detections
                ||
                detections.length === 0
            ) {

                mapCenterZone.innerHTML = `

                    <div class="map-empty">

                        No objects detected

                    </div>

                `;

                return;

            }


            detections.forEach(
                (detection) => {

                    const objectName =
                        String(
                            detection.object ||
                            "OBJECT"
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


                    const marker =
                        document.createElement(
                            "div"
                        );


                    marker.className =
                        "dynamic-object-marker";


                    marker.innerHTML = `

                        <div class="object-marker">

                            ●

                        </div>


                        <span>

                            ${objectName.toUpperCase()}

                        </span>

                    `;


                    marker.title =
                        `${objectName} | ` +
                        `${direction} | ` +
                        `${proximity} | ` +
                        `${priority}`;


                    // -----------------------------------------
                    // PLACE OBJECT BY DIRECTION
                    // -----------------------------------------

                    if (
                        direction === "LEFT"
                    ) {

                        mapLeftZone.appendChild(
                            marker
                        );

                    }
                    else if (
                        direction === "RIGHT"
                    ) {

                        mapRightZone.appendChild(
                            marker
                        );

                    }
                    else {

                        mapCenterZone.appendChild(
                            marker
                        );

                    }

                }
            );

        }


        // =================================================
        // UPDATE PRIMARY HAZARD
        // =================================================

        function updatePrimaryHazard(
            primaryHazard,
            alertGenerated
        ) {

            if (!primaryHazard) {

                if (primaryDetection) {

                    primaryDetection.textContent =
                        "No active hazard";

                }


                if (primaryDetectionDetails) {

                    primaryDetectionDetails.textContent =
                        "Environment currently safe";

                }


                if (alertCondition) {

                    alertCondition.textContent =
                        "NO ALERT";

                }


                if (viewAlertButton) {

                    viewAlertButton.style.opacity =
                        "0.5";

                }


                return;

            }


            const objectName =
                primaryHazard.object ||
                "Unknown";


            const direction =
                String(
                    primaryHazard.direction ||
                    "CENTER"
                ).toUpperCase();


            const proximity =
                String(
                    primaryHazard.proximity ||
                    "FAR"
                ).toUpperCase();


            const priority =
                String(
                    primaryHazard.priority ||
                    "LOW"
                ).toUpperCase();


            const threatScore =
                Number(
                    primaryHazard.threat_score ?? 0
                );


            if (primaryDetection) {

                primaryDetection.textContent =
                    objectName;

            }


            if (primaryDetectionDetails) {

                primaryDetectionDetails.textContent =
                    `${direction} · ` +
                    `${proximity} · ` +
                    `${priority} · ` +
                    `${threatScore.toFixed(1)} / 100`;

            }


            if (alertCondition) {

                alertCondition.textContent =
                    alertGenerated
                        ? "ALERT GENERATED"
                        : "ALERT READY";

            }


            if (viewAlertButton) {

                viewAlertButton.style.opacity =
                    "1";

            }

        }


        // =================================================
        // LOAD TELEMETRY
        // =================================================

        async function loadTelemetry() {

            try {

                const data =
                    await getTelemetry();


                console.log(
                    "ACUVISION telemetry:",
                    data
                );


                if (
                    data.status !== "OK"
                ) {

                    throw new Error(
                        `Telemetry status: ${data.status}`
                    );

                }


                const detections =
                    data.detections || [];


                // Update table

                renderDetections(
                    detections
                );


                // Update spatial map

                renderSpatialMap(
                    detections
                );


                // Update primary hazard

                updatePrimaryHazard(
                    data.primary_hazard,
                    data.alert_generated
                );


                // -----------------------------------------
                // LIVE STATUS
                // -----------------------------------------

                if (perceptionStatus) {

                    perceptionStatus.innerHTML =
                        '<span class="status-dot"></span> AI ACTIVE';

                }


                if (environmentStatus) {

                    environmentStatus.textContent =
                        "● LIVE";

                }

            }
            catch (error) {

                console.error(
                    "ACUVISION perception error:",
                    error
                );


                // -----------------------------------------
                // TABLE ERROR
                // -----------------------------------------

                if (container) {

                    container.innerHTML = `

                        <div class="object-row">

                            <span class="object-name">
                                Backend unavailable
                            </span>

                            <span>—</span>
                            <span>—</span>
                            <span>—</span>
                            <span>—</span>

                        </div>

                    `;

                }


                // -----------------------------------------
                // PRIMARY ERROR
                // -----------------------------------------

                if (primaryDetection) {

                    primaryDetection.textContent =
                        "Backend unavailable";

                }


                if (primaryDetectionDetails) {

                    primaryDetectionDetails.textContent =
                        "Unable to retrieve live telemetry";

                }


                if (alertCondition) {

                    alertCondition.textContent =
                        "BACKEND OFFLINE";

                }


                // -----------------------------------------
                // STATUS ERROR
                // -----------------------------------------

                if (perceptionStatus) {

                    perceptionStatus.innerHTML =
                        '<span class="status-dot"></span> BACKEND OFFLINE';

                }


                if (environmentStatus) {

                    environmentStatus.textContent =
                        "● OFFLINE";

                }

            }

        }


        // =================================================
        // START BACKEND ENGINE
        // =================================================

        try {

            await startEngine();

        }
        catch (error) {

            console.warn(
                "Engine start request:",
                error
            );

        }


        // =================================================
        // FIRST TELEMETRY LOAD
        // =================================================

        await loadTelemetry();


        // =================================================
        // LIVE REFRESH
        // =================================================

        setInterval(
            loadTelemetry,
            1000
        );

    }
);