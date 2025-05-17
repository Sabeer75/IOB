<p align="center">
  <img src="https://github.com/Sabeer75/IOB/blob/main/iob%205x%20logo.png" width="400">
</p>

# 🚀 AI-Powered Secure Authentication System — **IOB 5x**  
### 🔒 Reinventing Digital Banking Security for the Indian Overseas Bank (IOB)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌟 **PSB'S HACKATHON SERIES '25 CHAMPIONS** 🌟

| 🏦 **IOB CYBERNOVA 2025** | 🚀 **TOP 3** | 💰 **₹1,00,000 CASH PRIZE** |
|---------------------------|---------------|-----------------------------|

**🏆 Awarded 3rd Prize among 100+ teams**  
in India's premier banking innovation challenge hosted by **Indian Overseas Bank**  
for revolutionizing public sector banking with AI-driven security solutions!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


## 🔍 Overview

An **AI-powered secure authentication system** tailored for the **IOB banking platform**, engineered to:
- Eliminate password fatigue
- Prevent phishing and SIM-swap attacks
- Enable real-time anomaly detection
- Leverage behavioral biometrics for zero-trust authentication

Built with next-gen tech — **QR login, dynamic OTP, AI behavioral tracking, and phishing detection** — to redefine digital banking security.

---

## 🌟 Key Features

### 🔐 1. AdaptiveX — *Seamless QR-based Login*
> No passwords. Just scan and go.

Secure login via QR scanning using the IOB mobile app. It replaces static credentials with a dynamic, app-based authentication mechanism.

---

### 🧠 2. NeuroBehaviour — *AI Behavioral Biometrics Engine*
Monitors:
- Keystroke dynamics
- Mouse movement patterns
- Interaction flow & session behavior

Detects real-time anomalies using an **Isolation Forest** model to prevent unauthorized access, even if credentials are stolen.

---

### 🧪 3. FlowAuth — *Behavioral Training Module*
Feeds verified behavioral session data to NeuroBehaviour, continuously improving AI accuracy and adapting to each individual user’s behavior.

---

### 🔄 4. SmartOTP — *SMS-Free Dynamic OTP System*
Generates rotating OTPs every 30 seconds inside the IOB app — completely offline and SMS-independent, neutralizing:
- SIM-swapping
- OTP phishing
- Network-based attacks

---

### 🛡️ 5. PhishShield — *AI-Powered Anti-Phishing System*
Detects and blocks fake banking websites using:
- Google Safe Browsing API
- VirusTotal Database
- Domain heuristics + AI pattern matching  
> *(Setup coming soon)*

---

## 🛠 Tech Stack

| Layer       | Technologies                                     |
|-------------|--------------------------------------------------|
| Frontend    | HTML, CSS, JavaScript                            |
| Backend     | Flask (Python), Node.js                          |
| AI Models   | Isolation Forest (Scikit-learn)                  |
| Security APIs | Google Safe Browsing, VirusTotal               |
| Database    | Firebase (Google Cloud)                          |

---

## 📽️ Demo & Presentation

- ▶️ [**Watch Demo Video**](https://drive.google.com/file/d/1B5qt2tCqc-1-v3srFK-wi_ClrgvhxC_u/view?usp=sharing)
- 📊 [**View Presentation Slides**](https://drive.google.com/file/d/16c8fMhFI_N_jeqZ_-lxYEdU7HLhDvZPK/view?usp=sharing)

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/YourUsername/IOB.git
cd IOB

```

---

### 2️⃣ Install Dependencies

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

## 🏅 Achievements

* 🥉 **3rd Prize Winner** at **IOB CYBERNOVE 2025**
* 💰 Received ₹1,00,000 for innovation in secure digital banking
* 🌐 Built to support India’s Zero Trust security mission for PSBs

---

## 👨‍💻 Developed By

**🎯 Team:** Exception Handlers

- **Syed Tufail Ahmed**  
  🔗 [LinkedIn](https://www.linkedin.com/in/syedtufailahmed/) • [GitHub](https://github.com/syedtufailasuspro)

- **Sabeer Sulaiman Khan**  
  🔗 [LinkedIn](https://www.linkedin.com/in/sabeer-sulaiman-khan-g-957232293/) • [GitHub](https://github.com/Sabeer75)

- **Syed Mustafa**  
  🔗 [LinkedIn](https://www.linkedin.com/in/syed-mustafa-dev) • [GitHub](https://github.com/syedmustafa)

- **Syed Shabib Ahmed**  
  🔗 [LinkedIn](https://www.linkedin.com/in/syed-shabib-ahmed) • [GitHub](https://github.com/syedshabib)

**📬 Contact Us:**  
For collaborations or queries, feel free to reach out via [Gmail](mailto:syedtufailmipro@gmail.com)

---

**🧠 Empowering public sector banks with AI-driven security.**
**🔐 Because trust shouldn’t rely on passwords.**

