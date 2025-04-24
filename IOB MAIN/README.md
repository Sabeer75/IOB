# AI-Powered-Secure-Authentication-System---IOB
A  AI-powered secure authentication system designed for the IOB banking platform to reduce password dependency, eliminate SMS vulnerabilities, enable real-time monitoring, and defend against phishing attacks. Built with advanced behavioral biometrics, QR-based login, smart OTP, and phishing detection mechanisms.

# AI-Powered Secure Authentication System for IOB Banking

A complete AI-powered authentication suite designed for the Indian Overseas Bank (IOB) to enhance digital banking security by reducing password dependency, eliminating SMS-based vulnerabilities, enabling real-time behavioral monitoring, and protecting users from phishing threats.

---

## Key Features

### 1. *AdaptiveX*
A passwordless QR-based authentication mechanism that allows users to securely log in by scanning a QR code via the IOB mobile app — improving user experience and reducing password fatigue.

### 2. *NeuroBehaviour*
An AI engine that monitors user behavior such as:
- Keystroke dynamics
- Mouse/cursor movement patterns
- Session duration and interaction flow

This behavioral data is analyzed using deep learning to detect anomalies, helping to prevent unauthorized access in real-time.

### 3. *FlowAuth*
A training module that collects behavioral data from verified sessions. This data trains the NeuroBehaviour model to increase accuracy and user-specific behavior recognition.

### 4. *SmartOTP*
A dynamic OTP system integrated into the IOB mobile app. OTPs regenerate every 30 seconds and are device-local, removing the need for SMS and thus reducing the risk of SIM-swapping and interception attacks.

### 5. *PhishShield*
An intelligent phishing detection component that identifies and blocks access to malicious and spoofed banking websites. It uses a combination of domain analysis, content matching, and AI-driven phishing signatures.

---

## Tech Stack

- *Frontend*: HTML,CSS & JS
- *Backend*: Flask,Node.js
- *AI Models*: Isolation Forest Algorithm
- *Phishing Detection*: Virus total DB, Google safe browsing API
- *Database*: Goolge FireBase 

---

## 🛠 Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/YourUsername/iob-auth-system.git
   cd iob-auth-system
