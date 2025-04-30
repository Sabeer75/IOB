# AI-Powered-Secure-Authentication-System---IOB 5x
A  AI-powered secure authentication system designed for the IOB banking platform to reduce password dependency, eliminate SMS vulnerabilities, enable real-time monitoring, and defend against phishing attacks. Built with advanced behavioral biometrics, QR-based login, smart OTP, and phishing detection mechanisms.

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

## Demo Video: 
https://drive.google.com/file/d/1B5qt2tCqc-1-v3srFK-wi_ClrgvhxC_u/view?usp=sharing

## Presentation PPT:
https://drive.google.com/file/d/16c8fMhFI_N_jeqZ_-lxYEdU7HLhDvZPK/view?usp=sharing

---

## 🛠 Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/YourUsername/IOB.git
cd IOB
```

---

### 2. Install Dependencies

- **Install Node.js packages**
  ```bash
  npm install
  ```

- **Install Python packages**
  ```bash
  pip install -r requirements.txt
  ```

---

## ⚙️ Solution-wise Setup

---

### 🔹 1. AdaptiveX
    
  - Open the QR LOGIN file in vs code
  - Get your system IP and change it in the code 
  - Open Terminal and run:
    ```
     python app.py
    ```
  - Open the link printed in the terminal, usually:
      [http://localhost:3000](http://localhost:3000)

---

### 🔹 2. NeuroBehaviour & 3. FlowAuth

1. **Start the Node.js server**  
   (Serves the website and routes)
   ```bash
   node server.js
   ```

2. **Run the ML model script simultaneously**  
   (Monitors behavioral data in real-time)
   ```bash
   python NeuroBehaviour Model.py
   ```

3. **Visit the local server**  
   Open the link printed in the terminal, usually:  
   [http://localhost:3000](http://localhost:3000)

4. **Behavioral Monitoring**  
   - Live user data is written to `user_activity.csv`
   - The model reads and analyzes this data continuously

---

### 🔹 4. SmartOTP
   - Open Smart OTP file in VS Code 
   - Open Terminal and run:
     ```
     python otp.py
     ```
   - Open the project created in firebase to see the reflection of password generation
   - Connect the MIT app companion to see the OTP Generation
---

### 🔹 5. PhishShield

> **Coming Soon**  
Setup steps and phishing detection logic will be updated here.

---
