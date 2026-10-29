// ACUVISION - Phase 1 placeholder
// =========================================================
// ACUVISION — FRONTEND API CLIENT
// =========================================================

const API_BASE_URL = "http://127.0.0.1:5000";


async function getStatus() {

    const response = await fetch(
        `${API_BASE_URL}/status`
    );

    if (!response.ok) {
        throw new Error(
            `Status request failed: ${response.status}`
        );
    }

    return response.json();
}


async function startEngine() {

    const response = await fetch(
        `${API_BASE_URL}/start`,
        {
            method: "POST"
        }
    );

    if (!response.ok) {
        throw new Error(
            `Engine start failed: ${response.status}`
        );
    }

    return response.json();
}


async function stopEngine() {

    const response = await fetch(
        `${API_BASE_URL}/stop`,
        {
            method: "POST"
        }
    );

    if (!response.ok) {
        throw new Error(
            `Engine stop failed: ${response.status}`
        );
    }

    return response.json();
}


async function getTelemetry() {

    const response = await fetch(
        `${API_BASE_URL}/telemetry`
    );

    if (!response.ok) {
        throw new Error(
            `Telemetry request failed: ${response.status}`
        );
    }

    return response.json();
}