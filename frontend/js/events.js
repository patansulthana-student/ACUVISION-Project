// =========================================================
// ACUVISION — LIVE EVENT HISTORY
// BACKEND → EVENTS PAGE
// =========================================================

const EVENTS_API_URL =
    "http://127.0.0.1:5000/events";


document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "ACUVISION events.js loaded"
        );


        const eventContainer =
            document.getElementById(
                "eventRows"
            );


        const totalEvents =
            document.getElementById(
                "totalEvents"
            );


        const criticalEvents =
            document.getElementById(
                "criticalEvents"
            );


        const lastEvent =
            document.getElementById(
                "lastEvent"
            );


        // =================================================
        // PROXIMITY CLASS
        // =================================================

        function getProximityClass(
            proximity
        ) {

            switch (proximity) {

                case "VERY CLOSE":

                    return "proximity-critical";


                case "CLOSE":

                    return "proximity-warning";


                default:

                    return "proximity-safe";

            }

        }


        // =================================================
        // SCORE CLASS
        // =================================================

        function getScoreClass(
            score
        ) {

            if (score >= 80) {

                return "score-critical";

            }


            if (score >= 50) {

                return "score-warning";

            }


            return "score-safe";

        }


        // =================================================
        // RENDER EVENTS
        // =================================================

        function renderEvents(
            events
        ) {

            if (!eventContainer) {

                return;

            }


            eventContainer.innerHTML = "";


            if (
                !events ||
                events.length === 0
            ) {

                eventContainer.innerHTML = `

                    <div class="threat-row">

                        <span>
                            No recorded events
                        </span>

                        <span>—</span>
                        <span>—</span>
                        <span>—</span>
                        <strong>—</strong>

                    </div>

                `;

                return;

            }


            events.forEach(
                event => {

                    const row =
                        document.createElement(
                            "div"
                        );


                    row.className =
                        "threat-row";


                    const score =
                        Number(
                            event.score ?? 0
                        );


                    const proximity =
                        event.proximity ??
                        "FAR";


                    row.innerHTML = `

                        <span>
                            ${event.time ?? "—"}
                        </span>

                        <span class="event-object">
                            ${event.object ?? "—"}
                        </span>

                        <span>
                            ${event.direction ?? "—"}
                        </span>

                        <span class="${getProximityClass(proximity)}">
                            ${proximity}
                        </span>

                        <strong class="${getScoreClass(score)}">
                            ${score}
                        </strong>

                    `;


                    eventContainer.appendChild(
                        row
                    );

                }
            );

        }


        // =================================================
        // UPDATE SUMMARY
        // =================================================

        function updateSummary(
            events
        ) {

            const list =
                events || [];


            if (totalEvents) {

                totalEvents.textContent =
                    list.length;

            }


            const criticalCount =
                list.filter(
                    event =>
                        String(
                            event.priority ?? ""
                        ).toUpperCase()
                        ===
                        "CRITICAL"
                ).length;


            if (criticalEvents) {

                criticalEvents.textContent =
                    criticalCount;

            }


            if (lastEvent) {

                if (list.length > 0) {

                    lastEvent.textContent =
                        list[0].time ?? "—";

                }
                else {

                    lastEvent.textContent =
                        "—";

                }

            }

        }


        // =================================================
        // LOAD EVENTS FROM BACKEND
        // =================================================

        async function loadEvents() {

            try {

                const response =
                    await fetch(
                        EVENTS_API_URL,
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
                    "ACUVISION backend events:",
                    data
                );


                renderEvents(
                    data.events || []
                );


                updateSummary(
                    data.events || []
                );


            }
            catch (error) {

                console.error(
                    "Could not load ACUVISION events:",
                    error
                );


                if (eventContainer) {

                    eventContainer.innerHTML = `

                        <div class="threat-row">

                            <span>
                                Backend unavailable
                            </span>

                            <span>—</span>
                            <span>—</span>
                            <span>—</span>
                            <strong>—</strong>

                        </div>

                    `;

                }

            }

        }


        // =================================================
        // INITIAL LOAD
        // =================================================

        loadEvents();


        // =================================================
        // LIVE REFRESH
        // =================================================

        setInterval(
            loadEvents,
            2000
        );

    }
);