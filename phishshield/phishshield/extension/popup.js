document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("scanButton").addEventListener("click", async () => {
        let url = await getCurrentTabUrl();
        document.getElementById("verdict").innerText = "Scanning... ⏳";

        chrome.runtime.sendMessage({ action: "scan_url", url }, (response) => {
            const verdictElem = document.getElementById("verdict");
            const verdict = response?.verdict || "❌ No response received.";
            verdictElem.innerText = verdict;
        
            // Remove old background classes
            document.body.classList.remove("safe-bg", "warning-bg", "danger-bg");
        
            // Check verdict content and apply class accordingly
            if (verdict.toLowerCase().includes("safe")) {
                document.body.classList.add("safe-bg");
            } else if (verdict.toLowerCase().includes("suspicious") || verdict.toLowerCase().includes("warning")) {
                document.body.classList.add("warning-bg");
            } else if (verdict.toLowerCase().includes("phish") || verdict.toLowerCase().includes("malicious") || verdict.toLowerCase().includes("danger")) {
                document.body.classList.add("danger-bg");
            }
        });
            });

    document.getElementById("reportButton").addEventListener("click", async () => {
        let url = await getCurrentTabUrl();
        let reason = document.getElementById("reportReason").value;
        let userEmail = document.getElementById("userEmail").value;

        if (!reason || !userEmail) {
            document.getElementById("reportStatus").innerText = "⚠️ Please enter all details.";
            return;
        }

        document.getElementById("reportStatus").innerText = "Submitting report... ⏳";

        chrome.runtime.sendMessage({ action: "report_url", url, reason, userEmail }, (response) => {
            if (chrome.runtime.lastError) {
                console.error("Runtime Error:", chrome.runtime.lastError);
                document.getElementById("reportStatus").innerText = "❌ Error: Could not send report.";
                return;
            }
            document.getElementById("reportStatus").innerText = response?.response || "❌ No response received.";
        });
    });
});

async function getCurrentTabUrl() {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                resolve(tabs[0].url);
            } else {
                reject("No active tab found");
            }
        });
    });
}
