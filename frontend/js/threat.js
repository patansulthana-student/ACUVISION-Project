
const threatStates = {

    "FAR": {
        score: 25,
        level: "LOW",
        position: 20
    },

    "CLOSE": {
        score: 60,
        level: "HIGH",
        position: 55
    },

    "VERY CLOSE": {
        score: 92,
        level: "CRITICAL",
        position: 90
    }

};


function setThreatDemo(level) {

    const state = threatStates[level];

    if (!state) {
        return;
    }


    const score =
        document.getElementById("threatScore");

    const progress =
        document.getElementById("threatProgress");

    const primaryProximity =
        document.getElementById("primaryProximity");

    const primaryLevel =
        document.getElementById("primaryLevel");

    const indicator =
        document.getElementById("proximityIndicator");


    if (score) {

        score.textContent =
            `${state.score} / 100`;

    }


    if (progress) {

        progress.style.width =
            `${state.score}%`;

    }


    if (primaryProximity) {

        primaryProximity.textContent =
            level;

    }


    if (primaryLevel) {

        primaryLevel.textContent =
            state.level;

        primaryLevel.className =
            "threat-level " +
            state.level.toLowerCase().replace(" ", "-");

    }


    if (indicator) {

        indicator.style.left =
            `${state.position}%`;

    }

}