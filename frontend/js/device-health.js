
// =========================================================
// ACUVISION — DEVICE HEALTH
// LIVE BACKEND STATUS
// =========================================================

const DEVICE_API_URL =
    "http://127.0.0.1:5000";


document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "ACUVISION device-health.js loaded"
        );


        // =================================================
        // ELEMENTS
        // =================================================

        const deviceStatus =
            document.getElementById(
                "deviceStatus"
            );

        const overallStatus =
            document.getElementById(
                "overallStatus"
            );

        const overallDescription =
            document.getElementById(
                "overallDescription"
            );

        const healthIcon =
            document.getElementById(
                "healthIcon"
            );

        const esp32Badge =
            document.getElementById(
                "esp32Badge"
            );

        const esp32Value =
            document.getElementById(
                "esp32Value"
            );

        const esp32Detail =
            document.getElementById(
                "esp32Detail"
            );

        const cameraBadge =
            document.getElementById(
                "cameraBadge"
            );

        const cameraValue =
            document.getElementById(
                "cameraValue"
            );

        const cameraSource =
            document.getElementById(
                "cameraSource"
            );

        const webcamBadge =
            document.getElementById(
                "webcamBadge"
            );

        const webcamValue =
            document.getElementById(
                "webcamValue"
            );

        const webcamMode =
            document.getElementById(
                "webcamMode"
            );

        const headphoneBadge =
            document.getElementById(
                "headphoneBadge"
            );

        const headphoneValue =
            document.getElementById(
                "headphoneValue"
            );

        const headphoneDetail =
            document.getElementById(
                "headphoneDetail"
            );

        const batteryBadge =
            document.getElementById(
                "batteryBadge"
            );

        const batteryValue =
            document.getElementById(
                "batteryValue"
            );

        const batteryProgress =
            document.getElementById(
                "batteryProgress"
            );

        const bluetoothBadge =
            document.getElementById(
                "bluetoothBadge"
            );

        const bluetoothValue =
            document.getElementById(
                "bluetoothValue"
            );

        const bluetoothDetail =
            document.getElementById(
                "bluetoothDetail"
            );

        const fpsValue =
            document.getElementById(
                "fpsValue"
            );

        const signalValue =
            document.getElementById(
                "signalValue"
            );

        const audioLatencyValue =
            document.getElementById(
                "audioLatencyValue"
            );

        const syncTime =
            document.getElementById(
                "syncTime"
            );


        // =================================================
        // UPDATE BATTERY
        // =================================================

        async function updateBattery() {

            try {

                const response =
                    await fetch(
                        `${DEVICE_API_URL}/battery/status`,
                        {
                            cache:
                                "no-store"
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        `Battery HTTP ${response.status}`
                    );

                }


                const data =
                    await response.json();


                if (
                    data.status !== "OK" ||
                    !data.battery
                ) {

                    throw new Error(
                        "Battery information unavailable"
                    );

                }


                const percentage =
                    Number(
                        data.battery.percentage
                    );


                const charging =
                    data.battery.charging === true;


                // -----------------------------------------
                // BATTERY VALUE
                // -----------------------------------------

                if (batteryValue) {

                    batteryValue.textContent =
                        `${percentage}%`;

                }


                // -----------------------------------------
                // PROGRESS BAR
                // -----------------------------------------

                if (batteryProgress) {

                    batteryProgress.style.width =
                        `${percentage}%`;

                }


                // -----------------------------------------
                // BATTERY BADGE
                // -----------------------------------------

                if (batteryBadge) {

                    if (charging) {

                        batteryBadge.textContent =
                            "CHARGING";

                    }
                    else if (percentage <= 20) {

                        batteryBadge.textContent =
                            "LOW";

                    }
                    else {

                        batteryBadge.textContent =
                            "GOOD";

                    }

                }


                console.log(
                    "ACUVISION battery:",
                    `${percentage}%`,
                    charging
                        ? "charging"
                        : "not charging"
                );

            }
            catch (error) {

                console.warn(
                    "Battery information unavailable:",
                    error
                );


                if (batteryBadge) {

                    batteryBadge.textContent =
                        "UNAVAILABLE";

                }


                if (batteryValue) {

                    batteryValue.textContent =
                        "—";

                }


                if (batteryProgress) {

                    batteryProgress.style.width =
                        "0%";

                }

            }

        }


        // =================================================
        // LOAD DEVICE HEALTH
        // =================================================

        async function loadDeviceHealth() {

            try {

                // -----------------------------------------
                // BACKEND STATUS
                // -----------------------------------------

                const statusResponse =
                    await fetch(
                        `${DEVICE_API_URL}/status`,
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
                        `${DEVICE_API_URL}/camera/status`,
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


                console.log(
                    "ACUVISION device status:",
                    status
                );


                console.log(
                    "ACUVISION camera status:",
                    camera
                );


                // =================================================
                // CAMERA / ENGINE
                // =================================================

                const cameraOnline =
                    camera.status === "ONLINE";


                const source =
                    status.camera ||
                    "OFFLINE";


                // =================================================
                // OVERALL DEVICE STATUS
                // =================================================

                if (cameraOnline) {

                    if (deviceStatus) {

                        deviceStatus.innerHTML =
                            '<span class="status-dot"></span> DEVICE ONLINE';

                    }


                    if (overallStatus) {

                        overallStatus.textContent =
                            "System Ready";

                    }


                    if (overallDescription) {

                        overallDescription.textContent =
                            "The active camera source is responding normally.";

                    }


                    if (healthIcon) {

                        healthIcon.textContent =
                            "✓";

                    }

                }
                else {

                    if (deviceStatus) {

                        deviceStatus.innerHTML =
                            '<span class="status-dot"></span> DEVICE OFFLINE';

                    }


                    if (overallStatus) {

                        overallStatus.textContent =
                            "Camera Unavailable";

                    }


                    if (overallDescription) {

                        overallDescription.textContent =
                            "The configured camera source is unavailable.";

                    }


                    if (healthIcon) {

                        healthIcon.textContent =
                            "!";

                    }

                }


                // =================================================
                // ESP32-CAM
                // =================================================

                if (
                    source ===
                    "ESP32-CAM"
                ) {

                    if (esp32Badge) {

                        esp32Badge.textContent =
                            "ONLINE";

                    }


                    if (esp32Value) {

                        esp32Value.textContent =
                            "Connected";

                    }


                    if (esp32Detail) {

                        esp32Detail.textContent =
                            "Active source";

                    }

                }
                else {

                    if (esp32Badge) {

                        esp32Badge.textContent =
                            "STANDBY";

                    }


                    if (esp32Value) {

                        esp32Value.textContent =
                            "Not Active";

                    }


                    if (esp32Detail) {

                        esp32Detail.textContent =
                            "Not connected";

                    }

                }


                // =================================================
                // CAMERA
                // =================================================

                if (cameraOnline) {

                    if (cameraBadge) {

                        cameraBadge.textContent =
                            "ONLINE";

                    }


                    if (cameraValue) {

                        cameraValue.textContent =
                            "Active";

                    }


                    if (cameraSource) {

                        cameraSource.textContent =
                            source;

                    }


                    if (fpsValue) {

                        fpsValue.textContent =
                            "LIVE";

                    }

                }
                else {

                    if (cameraBadge) {

                        cameraBadge.textContent =
                            "OFFLINE";

                    }


                    if (cameraValue) {

                        cameraValue.textContent =
                            "Unavailable";

                    }


                    if (cameraSource) {

                        cameraSource.textContent =
                            "—";

                    }


                    if (fpsValue) {

                        fpsValue.textContent =
                            "—";

                    }

                }


                // =================================================
                // WEBCAM
                // =================================================

                if (
                    source ===
                    "WEBCAM"
                ) {

                    if (webcamBadge) {

                        webcamBadge.textContent =
                            "ACTIVE";

                    }


                    if (webcamValue) {

                        webcamValue.textContent =
                            "Available";

                    }


                    if (webcamMode) {

                        webcamMode.textContent =
                            "Current source";

                    }

                }
                else {

                    if (webcamBadge) {

                        webcamBadge.textContent =
                            "STANDBY";

                    }


                    if (webcamValue) {

                        webcamValue.textContent =
                            "Not Active";

                    }


                    if (webcamMode) {

                        webcamMode.textContent =
                            "Backup";

                    }

                }


                // =================================================
                // HEADPHONES
                // =================================================

                if (headphoneBadge) {

                    headphoneBadge.textContent =
                        "CONNECTED";

                }


                if (headphoneValue) {

                    headphoneValue.textContent =
                        "Audio Available";

                }


                if (headphoneDetail) {

                    headphoneDetail.textContent =
                        "System audio output active";

                }


                // =================================================
                // BLUETOOTH
                // =================================================

                if (bluetoothBadge) {

                    bluetoothBadge.textContent =
                        "AVAILABLE";

                }


                if (bluetoothValue) {

                    bluetoothValue.textContent =
                        "Bluetooth Audio";

                }


                if (bluetoothDetail) {

                    bluetoothDetail.textContent =
                        "Audio device available to system";

                }


                // =================================================
                // SIGNAL
                // =================================================

                if (signalValue) {

                    if (
                        source ===
                        "ESP32-CAM"
                    ) {

                        signalValue.textContent =
                            "AVAILABLE";

                    }
                    else if (
                        source ===
                        "WEBCAM"
                    ) {

                        signalValue.textContent =
                            "WEBCAM";

                    }
                    else {

                        signalValue.textContent =
                            "N/A";

                    }

                }


                // =================================================
                // AUDIO STATUS
                // =================================================

                if (audioLatencyValue) {

                    const audioEnabled =
                        status.audio &&
                        status.audio.spatial_audio === true;


                    if (audioEnabled) {

                        audioLatencyValue.textContent =
                            "ACTIVE";

                    }
                    else {

                        audioLatencyValue.textContent =
                            "N/A";

                    }

                }


                // =================================================
                // LAST SYNC
                // =================================================

                if (syncTime) {

                    syncTime.textContent =
                        new Date()
                            .toLocaleTimeString();

                }

            }
            catch (error) {

                console.error(
                    "ACUVISION Device Health error:",
                    error
                );


                if (deviceStatus) {

                    deviceStatus.innerHTML =
                        '<span class="status-dot"></span> BACKEND OFFLINE';

                }


                if (overallStatus) {

                    overallStatus.textContent =
                        "Backend Offline";

                }


                if (overallDescription) {

                    overallDescription.textContent =
                        "Unable to retrieve live device health information.";

                }


                if (healthIcon) {

                    healthIcon.textContent =
                        "!";

                }


                if (syncTime) {

                    syncTime.textContent =
                        "Backend offline";

                }

            }

        }


        // =================================================
        // INITIAL LOAD
        // =================================================

        loadDeviceHealth();

        updateBattery();


        // =================================================
        // CONTINUOUS UPDATES
        // =================================================

        setInterval(
            loadDeviceHealth,
            2000
        );


        setInterval(
            updateBattery,
            30000
        );

    }
);