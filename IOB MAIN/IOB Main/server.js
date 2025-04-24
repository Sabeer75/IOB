const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

let mfaRequired = false; // 👈 flag to track MFA status

// Middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname)));

// Route for homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// CSV setup
const csvFilePath = path.join(__dirname, 'user_activity.csv');
const csvHeaders = [
    'timestamp',
    'delta_mouse_moves',
    'delta_clicks',
    'delta_scrolls',
    'delta_key_presses',
    'avg_key_hold_last10s',
    'avg_mouse_speed_last10s',
    'typing_speed_last10s',
    'copy_paste_count_last10s',
    'idle_time_last10s',
    'browser',
    'os',
    'screen_resolution',
    'timezone_mismatch',
    'geolocation'
].join(',') + '\n';

// Initialize CSV if doesn't exist
if (!fs.existsSync(csvFilePath)) {
    fs.writeFileSync(csvFilePath, csvHeaders);
}

// API endpoint to log activity
app.post('/log-activity', (req, res) => {
    const data = req.body;

    const csvRow = [
        data.timestamp || new Date().toISOString(),
        data.delta_mouse_moves || 0,
        data.delta_clicks || 0,
        data.delta_scrolls || 0,
        data.delta_key_presses || 0,
        data.avg_key_hold_last10s || 0,
        data.avg_mouse_speed_last10s || 0,
        data.typing_speed_last10s || 0,
        data.copy_paste_count_last10s || 0,
        data.idle_time_last10s || 0,
        `"${data.browser || ''}"`,
        `"${data.os || ''}"`,
        `"${data.screen_resolution || ''}"`,
        data.timezone_mismatch || false,
        `"${data.geolocation || 'Unknown'}"`
    ].join(',') + '\n';

    fs.appendFileSync(csvFilePath, csvRow, 'utf8');
    console.log(`[LOGGED] ${data.timestamp} | Clicks: ${data.delta_clicks}, Keys: ${data.delta_key_presses}`);

    res.sendStatus(200);
});

// 🔐 Triggered by checker.py when anomaly is detected
app.post('/anomaly-detected', (req, res) => {
    console.log("🚨 Anomaly reported by checker.py");
    mfaRequired = true;
    res.sendStatus(200);
});

// 🕵️ Frontend polls this to know if MFA is needed
app.get('/check-mfa', (req, res) => {
    res.json({ mfaRequired });
});

// 🧠 Verify MFA credentials from popup
app.post('/verify-mfa', (req, res) => {
    const { username, password } = req.body;

    if (username === "123" && password === "123") {
        console.log("✅ MFA passed.");
        mfaRequired = false;
        res.json({ success: true });
    } else {
        console.log("❌ MFA failed. Logging out.");
        res.json({ success: false });
    }
});

// 🔐 Logout route
app.get('/logout', (req, res) => {
    res.send(`<h1>🔒 You have been logged out due to failed MFA.</h1>`);
});

// 🚀 Start server
app.listen(PORT, () => {
    console.log(`✅ Server running at: http://localhost:${PORT}`);
    console.log(`📁 Data being saved to: ${csvFilePath}`);
});
