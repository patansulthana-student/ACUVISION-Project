// =========================================================
// ACUVISION — LIVE ALERT MONITOR
// BACKEND → ALERT PAGE
// =========================================================

const ALERT_API_URL =
    "http://127.0.0.1:5000/alert";


document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "ACUVISION alerts.js loaded"
        );


        const alertTitle =
            document.getElementById(
                "alertTitle"
            );

        const alertReason =
            document.getElementById(
                "alertReason"
            );

        const alertTime =
            document.getElementById(
                "alertTime"
            );

        const alertDirection =
            document.getElementById(
                "alertDirection"
            );

        const alertProximity =
            document.getElementById(
                "alertProximity"
            );

        const alertScore =
            document.getElementById(
                "alertScore"
            );

        const eventId =
            document.getElementById(
                "eventId"
            );

        const alertState =
            document.querySelector(
                ".alert-state"
            );

        const recordedBadge =
            document.querySelector(
                ".recorded-badge"
            );


        // =================================================
        // SHOW NO ALERT
        // =================================================

        function showNoAlert() {

            if (alertTitle) {
                alertTitle.textContent =
                    "No active alert";
            }

            if (alertReason) {
                alertReason.textContent =
                    "The system is monitoring the environment.";
            }

            if (alertTime) {
                alertTime.textContent =
                    "—";
            }

            if (alertDirection) {
                alertDirection.textContent =
                    "—";
            }

            if (alertProximity) {
                alertProximity.textContent =
                    "—";
            }

            if (alertScore) {
                alertScore.textContent =
                    "— / 100";
            }

            if (eventId) {
                eventId.textContent =
                    "—";
            }

            if (alertState) {
                alertState.textContent =
                    "MONITORING";
            }

            if (recordedBadge) {
                recordedBadge.textContent =
                    "● NO EVENT";
            }
        }


        // =================================================
        // SHOW LIVE ALERT
        // =================================================

        function showAlert(alert) {

            console.log(
                "ACUVISION LIVE ALERT:",
                alert
            );


            if (alertTitle) {

                alertTitle.textContent =
                    `${alert.object} detected`;

            }


            if (alertReason) {

                alertReason.textContent =
                    `${alert.proximity} proximity condition triggered the warning.`;

            }


            if (alertTime) {

                alertTime.textContent =
                    alert.time || "Just now";

            }


            if (alertDirection) {

                alertDirection.textContent =
                    alert.direction || "CENTER";

            }


            if (alertProximity) {

                alertProximity.textContent =
                    alert.proximity || "FAR";

            }


            if (alertScore) {

                alertScore.textContent =
                    `${alert.score ?? 0} / 100`;

            }


            if (eventId) {

                eventId.textContent =
                    alert.event_id || "—";

            }


            if (alertState) {

                alertState.textContent =
                    "TRIGGERED";

            }


            if (recordedBadge) {

                recordedBadge.textContent =
                    "● RECORDED";

            }


            // ---------------------------------------------
            // Keep event available to existing frontend
            // ---------------------------------------------

            localStorage.setItem(
                "acuVisionLatestEvent",
                JSON.stringify({
                    id: alert.event_id,
                    alertId: alert.alert_id,
                    time: alert.time,
                    object: alert.object,
                    direction: alert.direction,
                    proximity: alert.proximity,
                    score: alert.score,
                    priority: alert.priority,
                    confidence: alert.confidence
                })
            );

        }


        // =================================================
        // LOAD ALERT FROM FLASK
        // =================================================

        async function loadAlert() {

            try {

                const response =
                    await fetch(
                        ALERT_API_URL,
                        {
                            cache: "no-store"
                        }
                    );


                console.log(
                    "Alert API status:",
                    response.status
                );


                if (!response.ok) {

                    throw new Error(
                        `HTTP ${response.status}`
                    );

                }


                const data =
                    await response.json();


                console.log(
                    "Alert API response:",
                    data
                );


                if (
                    data.status === "OK"
                    &&
                    data.alert
                ) {

                    showAlert(
                        data.alert
                    );

                }
                else {

                    showNoAlert();

                }

            }
            catch (error) {

                console.error(
                    "ACUVISION alert API error:",
                    error
                );

                if (alertTitle) {

                    alertTitle.textContent =
                        "Backend unavailable";

                }

                if (alertReason) {

                    alertReason.textContent =
                        "Unable to retrieve the latest alert.";

                }

                if (alertState) {

                    alertState.textContent =
                        "OFFLINE";

                }

            }

        }


        // =================================================
        // INITIAL LOAD
        // =================================================

        loadAlert();


        // =================================================
        // LIVE UPDATE
        // =================================================

        setInterval(
            loadAlert,
            1000
        );

    }
);