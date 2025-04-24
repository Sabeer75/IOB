// 📦 Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// 🔥 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDxRj7Rd9y3mL88asTetTzKDdpqQMS-3K0",
  authDomain: "phishing-url-reports.firebaseapp.com",
  projectId: "phishing-url-reports",
  storageBucket: "phishing-url-reports.firebasestorage.app",
  messagingSenderId: "1058906482621",
  appId: "1:1058906482621:web:13eb5574c880bd809754d4",
  measurementId: "G-SVPBKCBXFL"
};

// 🔥 Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const VIRUSTOTAL_API_KEY = "16f89deff1aea77e6ca295e32a9156694757a35387a3d746eadc13f555beddaa";
const WHOIS_API_KEY = "at_EfqyUEYGXFftjIh4JaLZQHyJS6IVd";
const GSB_API_KEY = "AIzaSyCmKgl678ubAJmmO5Y8HtRmIHSN9RdMRwY";

// 🛡️ Google Safe Browsing
async function checkWithGoogleSafeBrowsing(url) {
    const endpoint = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${GSB_API_KEY}`;

    const body = {
        client: {
            clientId: "syed-extension",
            clientVersion: "1.0"
        },
        threatInfo: {
            threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE"],
            platformTypes: ["ANY_PLATFORM"],
            threatEntryTypes: ["URL"],
            threatEntries: [{ url }]
        }
    };

    try {
        const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const data = await res.json();
        const isThreat = data.matches && data.matches.length > 0;

        return {
            message: isThreat ? "❌ GSB: Listed as dangerous!" : "✅ GSB: Not listed.",
            score: isThreat ? 100 : 0
        };
    } catch (err) {
        console.error("GSB Error:", err);
        return { message: "⚠️ GSB: Error checking status.", score: 60 };
    }
}

// 🦠 VirusTotal
async function scanUrlWithVirusTotal(url) {
    const VT_ENDPOINT = "https://www.virustotal.com/api/v3/urls";

    try {
        const submit = await fetch(VT_ENDPOINT, {
            method: "POST",
            headers: {
                "x-apikey": VIRUSTOTAL_API_KEY,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `url=${encodeURIComponent(url)}`
        });

        const submitResult = await submit.json();
        if (!submitResult.data || !submitResult.data.id)
            return { message: "❌ VirusTotal: Could not scan URL.", score: 60 };

        const analysisId = submitResult.data.id;
        const analysisUrl = `https://www.virustotal.com/api/v3/analyses/${analysisId}`;

        await new Promise(resolve => setTimeout(resolve, 2000));

        let retries = 3;
        let analysisData;

        while (retries--) {
            const analysis = await fetch(analysisUrl, {
                headers: { "x-apikey": VIRUSTOTAL_API_KEY }
            });
            analysisData = await analysis.json();

            if (analysisData.data?.attributes?.stats) break;
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        const stats = analysisData.data.attributes.stats;

        const score = stats.malicious > 0
            ? 90
            : stats.suspicious > 0
                ? 50
                : 0;

        const message = stats.malicious > 0
            ? "❌ VirusTotal: Malicious site detected."
            : stats.suspicious > 0
                ? "⚠️ VirusTotal: Suspicious, flagged by vendors."
                : "✅ VirusTotal: Safe site.";

        return { message, score };
    } catch (err) {
        console.error("VirusTotal Error:", err);
        return { message: "⚠️ VirusTotal: Error fetching results.", score: 60 };
    }
}

// 🌐 WHOIS check
async function checkWhoisInfo(url) {
    const domain = new URL(url).hostname;
    const endpoint = `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${WHOIS_API_KEY}&domainName=${domain}&outputFormat=json`;

    try {
        const res = await fetch(endpoint);
        const data = await res.json();

        if (!data.WhoisRecord) return {
            message: "❌ WHOIS: No data found.",
            score: 70
        };

        const creationDate = data.WhoisRecord.createdDate;
        const registrar = data.WhoisRecord.registrarName || null;

        let age = creationDate ? new Date().getFullYear() - new Date(creationDate).getFullYear() : null;
        let score = 10;
        let ageMessage = "";
        let registrarMessage = registrar ? `🔹 Registrar: ${registrar}` : "⚠️ Registrar: Not available.";

        if (!creationDate || isNaN(age) || age < 1) {
            score = 70;
            ageMessage = `⚠️ WHOIS: Suspicious domain age (${age ?? "N/A"} years)`;
        } else {
            ageMessage = `✅ WHOIS: Domain age is ${age} years.`;
        }

        if (!registrar) score += 10;

        return {
            message: `${ageMessage}\n${registrarMessage}`,
            score
        };
    } catch (err) {
        console.error("WHOIS Error:", err);
        return { message: "❌ WHOIS: Error fetching domain data.", score: 50 };
    }
}

// 📤 Report to Firebase
async function reportUrlToFirebase(url, reason, userEmail) {
    try {
        await addDoc(collection(db, "reports"), {
            url,
            reason,
            userEmail,
            reportedAt: new Date().toISOString()
        });
        return "✅ Report submitted to Firebase!";
    } catch (err) {
        console.error("Firebase Report Error:", err);
        return "❌ Error submitting to Firebase.";
    }
}

// 🚀 Main Scan Function
async function fullUrlScan(url) {
    const [gsb, vt, whois] = await Promise.all([
        checkWithGoogleSafeBrowsing(url),
        scanUrlWithVirusTotal(url),
        checkWhoisInfo(url)
    ]);

    const weightedScore = Math.round(
        gsb.score * 0.5 +
        vt.score * 0.3 +
        whois.score * 0.2
    );

    let finalVerdict =
        weightedScore >= 80 ? "🛑 FINAL VERDICT: HIGH RISK - Likely phishing or malware!" :
        weightedScore >= 50 ? "⚠️ FINAL VERDICT: MEDIUM RISK - Be cautious!" :
        "✅ FINAL VERDICT: LOW RISK - Looks safe.";

    return `${gsb.message}\n${vt.message}\n${whois.message}\n\n🔐 Final Risk Score: ${weightedScore}/100\n${finalVerdict}`;
}

// 🔁 Chrome Message Listener
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "scan_url") {
        fullUrlScan(message.url).then(result => {
            sendResponse({ verdict: result });
        }).catch(error => {
            sendResponse({ verdict: "❌ Error during scan." });
        });
        return true;
    }

    if (message.action === "report_url") {
        reportUrlToFirebase(message.url, message.reason, message.userEmail)
            .then(responseMessage => {
                sendResponse({ response: responseMessage });
            })
            .catch(error => {
                sendResponse({ response: "❌ Firebase reporting failed." });
            });
        return true;
    }
});
