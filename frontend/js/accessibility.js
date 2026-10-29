
// =========================================================
// ACUVISION — ACCESSIBILITY CONTROLS
// FRONTEND → FLASK → AUDIO / VOICE
// =========================================================

const AUDIO_API_URL =
    "http://127.0.0.1:5000";


document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "ACUVISION accessibility.js loaded"
        );


        // =================================================
        // ELEMENTS
        // =================================================

        const masterVolume =
            document.getElementById(
                "masterVolume"
            );

        const masterVolumeValue =
            document.getElementById(
                "masterVolumeValue"
            );

        const spatialIntensity =
            document.getElementById(
                "spatialIntensity"
            );

        const spatialIntensityValue =
            document.getElementById(
                "spatialIntensityValue"
            );

        const voiceVolume =
            document.getElementById(
                "voiceVolume"
            );

        const voiceVolumeValue =
            document.getElementById(
                "voiceVolumeValue"
            );

        const voiceSpeed =
            document.getElementById(
                "voiceSpeed"
            );

        const voiceSpeedValue =
            document.getElementById(
                "voiceSpeedValue"
            );

        const spatialAudioToggle =
            document.getElementById(
                "spatialAudioToggle"
            );

        const voiceAlertToggle =
            document.getElementById(
                "voiceAlertToggle"
            );

        const criticalAlertToggle =
            document.getElementById(
                "criticalAlertToggle"
            );

        const alertSensitivity =
            document.getElementById(
                "alertSensitivity"
            );

        const previewVolume =
            document.getElementById(
                "previewVolume"
            );

        const previewSpatial =
            document.getElementById(
                "previewSpatial"
            );

        const previewVoiceVolume =
            document.getElementById(
                "previewVoiceVolume"
            );

        const previewSpeed =
            document.getElementById(
                "previewSpeed"
            );

        const previewSensitivity =
            document.getElementById(
                "previewSensitivity"
            );

        const saveButton =
            document.getElementById(
                "saveAccessibilityButton"
            );


        // =================================================
        // DEFAULT SETTINGS
        // =================================================

        const defaultSettings = {

            masterVolume: 70,

            spatialIntensity: 80,

            voiceVolume: 65,

            voiceSpeed: 100,

            spatialAudio: true,

            voiceAlerts: true,

            criticalAlerts: true,

            sensitivity: "HIGH"

        };


        // =================================================
        // LOAD SETTINGS FROM BACKEND
        // =================================================

        async function loadSettings() {

            try {

                const response =
                    await fetch(
                        `${AUDIO_API_URL}/audio/settings`,
                        {
                            cache: "no-store"
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        `HTTP ${response.status}`
                    );

                }


                const data =
                    await response.json();


                console.log(
                    "ACUVISION backend audio settings:",
                    data
                );


                const settings =
                    {
                        ...defaultSettings,
                        ...(data.settings || {})
                    };


                applySettingsToPage(
                    settings
                );


            }
            catch (error) {

                console.warn(
                    "Could not load backend audio settings:",
                    error
                );


                // Use local saved settings as fallback.

                loadLocalSettings();

            }

        }


        // =================================================
        // LOAD LOCAL FALLBACK
        // =================================================

        function loadLocalSettings() {

            let settings =
                {
                    ...defaultSettings
                };


            try {

                const saved =
                    localStorage.getItem(
                        "acuvisionAccessibilitySettings"
                    );


                if (saved) {

                    settings =
                        {
                            ...defaultSettings,
                            ...JSON.parse(saved)
                        };

                }

            }
            catch (error) {

                console.warn(
                    "Could not load local settings:",
                    error
                );

            }


            applySettingsToPage(
                settings
            );

        }


        // =================================================
        // APPLY SETTINGS TO PAGE
        // =================================================

        function applySettingsToPage(
            settings
        ) {

            if (masterVolume) {

                masterVolume.value =
                    settings.masterVolume;

            }


            if (spatialIntensity) {

                spatialIntensity.value =
                    settings.spatialIntensity;

            }


            if (voiceVolume) {

                voiceVolume.value =
                    settings.voiceVolume;

            }


            if (voiceSpeed) {

                voiceSpeed.value =
                    settings.voiceSpeed;

            }


            if (spatialAudioToggle) {

                spatialAudioToggle.checked =
                    Boolean(
                        settings.spatialAudio
                    );

            }


            if (voiceAlertToggle) {

                voiceAlertToggle.checked =
                    Boolean(
                        settings.voiceAlerts
                    );

            }


            if (criticalAlertToggle) {

                criticalAlertToggle.checked =
                    Boolean(
                        settings.criticalAlerts
                    );

            }


            if (alertSensitivity) {

                alertSensitivity.value =
                    settings.sensitivity;

            }


            updateDisplays();

        }


        // =================================================
        // UPDATE PAGE VALUES
        // =================================================

        function updateDisplays() {

            if (
                masterVolume &&
                masterVolumeValue
            ) {

                masterVolumeValue.textContent =
                    `${masterVolume.value}%`;

            }


            if (
                masterVolume &&
                previewVolume
            ) {

                previewVolume.textContent =
                    `${masterVolume.value}%`;

            }


            if (
                spatialIntensity &&
                spatialIntensityValue
            ) {

                spatialIntensityValue.textContent =
                    `${spatialIntensity.value}%`;

            }


            if (
                spatialIntensity &&
                previewSpatial
            ) {

                previewSpatial.textContent =
                    `${spatialIntensity.value}%`;

            }


            if (
                voiceVolume &&
                voiceVolumeValue
            ) {

                voiceVolumeValue.textContent =
                    `${voiceVolume.value}%`;

            }


            if (
                voiceVolume &&
                previewVoiceVolume
            ) {

                previewVoiceVolume.textContent =
                    `${voiceVolume.value}%`;

            }


            if (
                voiceSpeed &&
                voiceSpeedValue
            ) {

                const speed =
                    (
                        Number(
                            voiceSpeed.value
                        ) / 100
                    ).toFixed(1);


                voiceSpeedValue.textContent =
                    `${speed}x`;


                if (previewSpeed) {

                    previewSpeed.textContent =
                        `${speed}x`;

                }

            }


            if (
                alertSensitivity &&
                previewSensitivity
            ) {

                previewSensitivity.textContent =
                    alertSensitivity.value;

            }

        }


        // =================================================
        // SEND SETTINGS TO FLASK
        // =================================================

        async function saveSettings() {

            const settings = {

                masterVolume:
                    Number(
                        masterVolume?.value ??
                        defaultSettings.masterVolume
                    ),

                spatialIntensity:
                    Number(
                        spatialIntensity?.value ??
                        defaultSettings.spatialIntensity
                    ),

                voiceVolume:
                    Number(
                        voiceVolume?.value ??
                        defaultSettings.voiceVolume
                    ),

                voiceSpeed:
                    Number(
                        voiceSpeed?.value ??
                        defaultSettings.voiceSpeed
                    ),

                spatialAudio:
                    spatialAudioToggle?.checked ??
                    defaultSettings.spatialAudio,

                voiceAlerts:
                    voiceAlertToggle?.checked ??
                    defaultSettings.voiceAlerts,

                criticalAlerts:
                    criticalAlertToggle?.checked ??
                    defaultSettings.criticalAlerts,

                sensitivity:
                    alertSensitivity?.value ??
                    defaultSettings.sensitivity

            };


            console.log(
                "Sending ACUVISION audio settings:",
                settings
            );


            try {

                const response =
                    await fetch(
                        `${AUDIO_API_URL}/audio/settings`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    settings
                                )
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        `HTTP ${response.status}`
                    );

                }


                console.log(
                    "ACUVISION audio settings updated:",
                    data
                );


                // Save a frontend copy too.

                localStorage.setItem(
                    "acuvisionAccessibilitySettings",
                    JSON.stringify(
                        settings
                    )
                );


                if (saveButton) {

                    saveButton.textContent =
                        "✓ SAVED";


                    setTimeout(
                        () => {

                            saveButton.textContent =
                                "✓ SAVE SETTINGS";

                        },
                        1800
                    );

                }

            }
            catch (error) {

                console.error(
                    "ACUVISION audio settings error:",
                    error
                );


                if (saveButton) {

                    saveButton.textContent =
                        "SAVE FAILED";


                    setTimeout(
                        () => {

                            saveButton.textContent =
                                "✓ SAVE SETTINGS";

                        },
                        1800
                    );

                }

            }

        }


        // =================================================
        // SLIDER EVENTS
        // =================================================

        if (masterVolume) {

            masterVolume.addEventListener(
                "input",
                updateDisplays
            );

        }


        if (spatialIntensity) {

            spatialIntensity.addEventListener(
                "input",
                updateDisplays
            );

        }


        if (voiceVolume) {

            voiceVolume.addEventListener(
                "input",
                updateDisplays
            );

        }


        if (voiceSpeed) {

            voiceSpeed.addEventListener(
                "input",
                updateDisplays
            );

        }


        // =================================================
        // SENSITIVITY
        // =================================================

        if (alertSensitivity) {

            alertSensitivity.addEventListener(
                "change",
                updateDisplays
            );

        }


        // =================================================
        // SAVE BUTTON
        // =================================================

        if (saveButton) {

            saveButton.addEventListener(
                "click",
                saveSettings
            );

        }


        // =================================================
        // INITIALIZE
        // =================================================

        updateDisplays();

        loadSettings();

    }
);