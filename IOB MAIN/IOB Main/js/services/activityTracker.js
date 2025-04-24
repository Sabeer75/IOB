let mouseMoves = 0;
let clicks = 0;
let scrolls = 0;
let keyPresses = 0;
let keyDownTimestamps = {};
let totalKeyHoldTime = 0;
let sessionStart = Date.now();
let lastActivityTime = Date.now();
let copyPasteCount = 0;
let prevMousePos = { x: 0, y: 0 };

let prevMouseMoves = 0;
let prevClicks = 0;
let prevScrolls = 0;
let prevKeyPresses = 0;
let prevCopyPasteCount = 0;
let prevKeyHoldTime = 0;
let prevMouseDistance = 0;
let prevTypingChars = 0;

let totalMouseSpeed = 0;
let totalMouseDistance = 0;
let typingStartTime = 0;
let typingSpeed = 0;  // in characters per second
let lastTypingTime = Date.now();
let geolocation = null;

document.addEventListener('mousemove', (event) => {
    mouseMoves++;
    let currentMousePos = { x: event.clientX, y: event.clientY };
    
    // Calculate distance between the current and previous mouse position
    let distance = Math.sqrt(Math.pow(currentMousePos.x - prevMousePos.x, 2) + Math.pow(currentMousePos.y - prevMousePos.y, 2));
    
    // Speed = distance / time (time between current and last move)
    let timeDifference = Date.now() - lastActivityTime; // in milliseconds
    let speed = distance / (timeDifference / 1000); // speed in pixels per second
    
    totalMouseDistance += distance;
    totalMouseSpeed += speed;
    
    prevMousePos = currentMousePos;
    lastActivityTime = Date.now();
});

document.addEventListener('click', () => {
    clicks++;
    lastActivityTime = Date.now();
});

document.addEventListener('scroll', () => {
    scrolls++;
    lastActivityTime = Date.now();
});

document.addEventListener('keydown', (e) => {
    keyPresses++;
    keyDownTimestamps[e.key] = Date.now();
    lastActivityTime = Date.now();
    // Track typing speed
    if (typingStartTime === 0) {
        typingStartTime = Date.now();
    }
});

document.addEventListener('keyup', (e) => {
    if (keyDownTimestamps[e.key]) {
        totalKeyHoldTime += Date.now() - keyDownTimestamps[e.key];
        delete keyDownTimestamps[e.key];
    }
    // Calculate typing speed
    typingSpeed = keyPresses / ((Date.now() - typingStartTime) / 1000); // characters per second
    lastTypingTime = Date.now();
});

document.addEventListener('copy', () => {
    copyPasteCount++;
});

document.addEventListener('paste', () => {
    copyPasteCount++;
});

function getDeviceInfo() {
    let ua = navigator.userAgent;
    let browser = navigator.userAgentData?.brands?.[0]?.brand || "Unknown";
    let os = navigator.platform;
    let resolution = `${window.screen.width}x${window.screen.height}`;
    return { browser, os, resolution };
}

function getTimezoneMismatch() {
    let systemTimezone = new Date().getTimezoneOffset() / -60; // In hours (negative is behind UTC)
    let browserTimezone = new Date().getTimezoneOffset() / -60;
    return systemTimezone !== browserTimezone;
}

function getIdleTime() {
    return (Date.now() - lastActivityTime) / 1000; // in seconds
}

function getGeolocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            geolocation = `${position.coords.latitude}, ${position.coords.longitude}`;
            document.getElementById('geoLocation').innerText = `Geolocation: ${geolocation}`;
        });
    } else {
        geolocation = "Geolocation not available";
    }
}

window.addEventListener('beforeunload', () => {
    let sessionDuration = (Date.now() - sessionStart) / 1000; // seconds
    let avgKeyHold = keyPresses ? totalKeyHoldTime / keyPresses : 0;
    let avgMouseSpeed = mouseMoves ? totalMouseSpeed / mouseMoves : 0;
    let device = getDeviceInfo();
    let timezoneMismatch = getTimezoneMismatch();
    let idleTime = getIdleTime();

    fetch('/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            mouse_moves: mouseMoves,
            clicks: clicks,
            scrolls: scrolls,
            key_presses: keyPresses,
            avg_key_hold: avgKeyHold.toFixed(2),
            session_duration: sessionDuration.toFixed(2),
            avg_mouse_speed: avgMouseSpeed.toFixed(2),
            total_mouse_distance: totalMouseDistance.toFixed(2),
            browser: device.browser,
            os: device.os,
            screen_resolution: device.resolution,
            idle_time: idleTime.toFixed(2),
            timezone_mismatch: timezoneMismatch,
            copy_paste_count: copyPasteCount,
            typing_speed: typingSpeed.toFixed(2),  // Include typing speed
            geolocation: geolocation || "Unknown"  // Include geolocation
        })
    });
});

// Initialize geolocation fetch on page load
getGeolocation();

// Add at the end of activityTracker.js
// Function to send user activity data every 10 seconds
setInterval(() => {
    const sessionDuration = (Date.now() - sessionStart) / 1000;

    // Calculate deltas
    const deltaMouseMoves = mouseMoves - prevMouseMoves;
    const deltaClicks = clicks - prevClicks;
    const deltaScrolls = scrolls - prevScrolls;
    const deltaKeyPresses = keyPresses - prevKeyPresses;
    const deltaCopyPasteCount = copyPasteCount - prevCopyPasteCount;
    const deltaKeyHoldTime = totalKeyHoldTime - prevKeyHoldTime;
    const deltaMouseDistance = totalMouseDistance - prevMouseDistance;
    const deltaTypingChars = typingSpeed * sessionDuration - prevTypingChars;

    // Calculate per-10s averages
    const avgKeyHold = deltaKeyPresses ? (deltaKeyHoldTime / deltaKeyPresses) : 0;
    const avgMouseSpeed = deltaMouseMoves ? (deltaMouseDistance / deltaMouseMoves) : 0;
    const typingSpeedLast10s = deltaKeyPresses / 10; // keys per second

    // Static once-per-session values
    const device = getDeviceInfo();
    const timezoneMismatch = getTimezoneMismatch();
    const idleTime = getIdleTime();

    // Send data to server
    fetch('/log-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            timestamp: new Date().toISOString(),
            delta_mouse_moves: deltaMouseMoves,
            delta_clicks: deltaClicks,
            delta_scrolls: deltaScrolls,
            delta_key_presses: deltaKeyPresses,
            avg_key_hold_last10s: avgKeyHold.toFixed(2),
            avg_mouse_speed_last10s: avgMouseSpeed.toFixed(2),
            typing_speed_last10s: typingSpeedLast10s.toFixed(2),
            copy_paste_count_last10s: deltaCopyPasteCount,
            idle_time_last10s: idleTime.toFixed(2),
            browser: device.browser,
            os: device.os,
            screen_resolution: device.resolution,
            timezone_mismatch: timezoneMismatch,
            geolocation: geolocation || "Unknown"
        })
    });

    // Update previous snapshot
    prevMouseMoves = mouseMoves;
    prevClicks = clicks;
    prevScrolls = scrolls;
    prevKeyPresses = keyPresses;
    prevCopyPasteCount = copyPasteCount;
    prevKeyHoldTime = totalKeyHoldTime;
    prevMouseDistance = totalMouseDistance;
    prevTypingChars = typingSpeed * sessionDuration;

}, 20000); // Every 20 seconds
