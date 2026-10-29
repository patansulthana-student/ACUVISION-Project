// ACUVISION - Phase 1 placeholder
// =========================================
// ACUVISION — MOCK DATA ENGINE
// =========================================

const acuVisionMockData = {

    objects: [

        {
            name: "Person",
            confidence: 94,
            direction: "LEFT",
            proximity: "CLOSE",
            threat: "HIGH"
        },

        {
            name: "Chair",
            confidence: 91,
            direction: "CENTER",
            proximity: "FAR",
            threat: "MEDIUM"
        },

        {
            name: "Bottle",
            confidence: 87,
            direction: "RIGHT",
            proximity: "FAR",
            threat: "LOW"
        },

        {
            name: "Table",
            confidence: 89,
            direction: "CENTER",
            proximity: "MEDIUM",
            threat: "MEDIUM"
        },

        {
            name: "Person",
            confidence: 96,
            direction: "RIGHT",
            proximity: "VERY CLOSE",
            threat: "CRITICAL"
        }

    ],

    system: {

        ai: "ACTIVE",
        camera: "ONLINE",
        spatialAudio: "ACTIVE",
        voice: "READY",
        backend: "CONNECTED"

    }

};


// =========================================
// GET RANDOM OBJECT
// =========================================

function getRandomObject() {

    const objects =
        acuVisionMockData.objects;

    const randomIndex =
        Math.floor(
            Math.random() * objects.length
        );

    return objects[randomIndex];

}


// =========================================
// GET ALL OBJECTS
// =========================================

function getAllObjects() {

    return acuVisionMockData.objects;

}


// =========================================
// GET SYSTEM STATUS
// =========================================

function getSystemStatus() {

    return acuVisionMockData.system;

}