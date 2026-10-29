// =========================================================
// ACUVISION — SETTINGS
// FRONTEND SETTINGS ONLY
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "ACUVISION settings.js loaded"
        );


        // =================================================
        // ELEMENTS
        // =================================================

        const demoMode =
            document.getElementById(
                "demoMode"
            );

        const autoStart =
            document.getElementById(
                "autoStart"
            );

        const dataLogging =
            document.getElementById(
                "dataLogging"
            );

        const highContrast =
            document.getElementById(
                "highContrast"
            );

        const largeText =
            document.getElementById(
                "largeText"
            );

        const animations =
            document.getElementById(
                "animations"
            );

        const autoReconnect =
            document.getElementById(
                "autoReconnect"
            );

        const saveSession =
            document.getElementById(
                "saveSession"
            );

        const language =
            document.getElementById(
                "language"
            );

        const distanceUnit =
            document.getElementById(
                "distanceUnit"
            );

        const saveButton =
            document.getElementById(
                "saveSettings"
            );

        const resetButton =
            document.getElementById(
                "resetSettings"
            );


        // =================================================
        // DEFAULT SETTINGS
        // =================================================

        const defaultSettings = {

            demoMode: true,

            autoStart: true,

            dataLogging: true,

            highContrast: false,

            largeText: false,

            animations: true,

            autoReconnect: true,

            saveSession: true,

            language: "English",

            distanceUnit: "Meters"

        };


        // =================================================
        // LOAD SAVED SETTINGS
        // =================================================

        function loadSettings() {

            let settings =
                { ...defaultSettings };


            try {

                const saved =
                    localStorage.getItem(
                        "acuVisionSettings"
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
                    "Unable to load saved settings:",
                    error
                );

            }


            if (demoMode) {
                demoMode.checked =
                    settings.demoMode;
            }

            if (autoStart) {
                autoStart.checked =
                    settings.autoStart;
            }

            if (dataLogging) {
                dataLogging.checked =
                    settings.dataLogging;
            }

            if (highContrast) {
                highContrast.checked =
                    settings.highContrast;
            }

            if (largeText) {
                largeText.checked =
                    settings.largeText;
            }

            if (animations) {
                animations.checked =
                    settings.animations;
            }

            if (autoReconnect) {
                autoReconnect.checked =
                    settings.autoReconnect;
            }

            if (saveSession) {
                saveSession.checked =
                    settings.saveSession;
            }

            if (language) {
                language.value =
                    settings.language;
            }

            if (distanceUnit) {
                distanceUnit.value =
                    settings.distanceUnit;
            }


            applyDisplaySettings(
                settings
            );

        }


        // =================================================
        // GET CURRENT SETTINGS
        // =================================================

        function getCurrentSettings() {

            return {

                demoMode:
                    demoMode?.checked ?? true,

                autoStart:
                    autoStart?.checked ?? true,

                dataLogging:
                    dataLogging?.checked ?? true,

                highContrast:
                    highContrast?.checked ?? false,

                largeText:
                    largeText?.checked ?? false,

                animations:
                    animations?.checked ?? true,

                autoReconnect:
                    autoReconnect?.checked ?? true,

                saveSession:
                    saveSession?.checked ?? true,

                language:
                    language?.value ?? "English",

                distanceUnit:
                    distanceUnit?.value ?? "Meters"

            };

        }


        // =================================================
        // APPLY DISPLAY SETTINGS
        // =================================================

        function applyDisplaySettings(
            settings
        ) {

            document.body.classList.toggle(
                "high-contrast-mode",
                settings.highContrast
            );


            document.body.classList.toggle(
                "large-text-mode",
                settings.largeText
            );


            document.body.classList.toggle(
                "reduced-motion",
                !settings.animations
            );

        }


        // =================================================
        // SAVE
        // =================================================

        function saveSettings() {

            const settings =
                getCurrentSettings();


            try {

                localStorage.setItem(
                    "acuVisionSettings",
                    JSON.stringify(
                        settings
                    )
                );


                applyDisplaySettings(
                    settings
                );


                if (saveButton) {

                    saveButton.textContent =
                        "SAVED ✓";


                    setTimeout(
                        function () {

                            saveButton.textContent =
                                "SAVE SETTINGS";

                        },
                        1800
                    );

                }


                console.log(
                    "ACUVISION settings saved:",
                    settings
                );

            }
            catch (error) {

                console.error(
                    "Unable to save settings:",
                    error
                );

            }

        }


        // =================================================
        // RESET
        // =================================================

        function resetSettings() {

            localStorage.removeItem(
                "acuVisionSettings"
            );


            loadSettings();


            if (resetButton) {

                resetButton.textContent =
                    "RESET ✓";


                setTimeout(
                    function () {

                        resetButton.textContent =
                            "RESET";

                    },
                    1800
                );

            }

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
        // RESET BUTTON
        // =================================================

        if (resetButton) {

            resetButton.addEventListener(
                "click",
                resetSettings
            );

        }


        // =================================================
        // LIVE DISPLAY CHANGES
        // =================================================

        [highContrast, largeText, animations]
            .forEach(
                checkbox => {

                    if (!checkbox) {
                        return;
                    }


                    checkbox.addEventListener(
                        "change",
                        function () {

                            applyDisplaySettings(
                                getCurrentSettings()
                            );

                        }
                    );

                }
            );


        // =================================================
        // INITIALIZE
        // =================================================

        loadSettings();

    }
);