// Import the functions you need from the SDKs you need
// authService.js (or your main JS file)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDfUjkzSOB53I6qH7piMMxiTQdUEOTvW0M",
  authDomain: "otp-system-ce0a2.firebaseapp.com",
  databaseURL: "https://otp-system-ce0a2-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "otp-system-ce0a2",
  storageBucket: "otp-system-ce0a2.firebasestorage.app",
  messagingSenderId: "235658832642",
  appId: "1:235658832642:web:6c3ccdbc3b9b463ae8f01b"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Auth Service to handle login, logout, and session management
export const authService = {
  // Check if user is logged in
  isLoggedIn() {
    return localStorage.getItem('iob_user') !== null;
  },
  
  // Log in the user
  login(username, password) {
    // For demo purposes, accept any username/password
    const user = {
      id: 'user-1',
      username,
      name: 'John Doe',
      email: 'john.doe@example.com',
      lastLogin: new Date().toISOString()
    };
    
    localStorage.setItem('iob_user', JSON.stringify(user));
    return true;
  },
  
  // Log out the user
  logout() {
    localStorage.removeItem('iob_user');
  },
  
  // Get the current user
  getCurrentUser() {
    const userJson = localStorage.getItem('iob_user');
    return userJson ? JSON.parse(userJson) : null;
  },
  
  // Generate OTP (now empty since we're using Firebase-stored OTPs)
  generateOtp() {
    return ''; // No longer needed as OTP comes from Firebase
  },
  
  // Verify OTP against Firebase database
  async verifyOtp(userEnteredOtp) {
    try {
      // Reference to your OTP in Firebase (matches your URL structure)
      const otpRef = ref(db, 'otp/code');
      
      // Fetch the stored OTP from Firebase
      const snapshot = await get(otpRef);
      
      // Compare with user input
      if (snapshot.exists()) {
        const storedOtp = snapshot.val().toString();
        return userEnteredOtp === storedOtp;
      } else {
        console.error("No OTP found in database");
        return false;
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
      return false;
    }
  }
};