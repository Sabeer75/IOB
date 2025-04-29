
import { showToast } from './toast.js';
import { authService } from '../services/auth-service.js';

// Render OTP verification component
export function renderOtpVerification(onVerifyCallback) {
  let countdown = 30;
  let countdownInterval;
  
  const otpHtml = `
    <div class="otp-container">
      <h3 class="otp-title">
        Please enter the OTP generated in your IOB mobile banking app
      </h3>
      
      <div class="form-group">
        <input 
          type="text" 
          id="otp-input" 
          class="form-input" 
          placeholder="Enter OTP"
          maxlength="6"
        >
      </div>
      
      <div class="otp-actions">
        <button id="verify-otp-btn" class="primary">
          Approve Payee
        </button>
        <button id="resend-otp-btn" class="danger" disabled>
          Generate New OTP (${countdown}s)
        </button>
      </div>
      
      <div class="otp-note">
        <div class="otp-note-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <div class="otp-note-content">
          <span>Note: For security purposes, OTPs are only generated through the IOB mobile app.</span>
          <div>
            ENTER THE CORRECT OTP. DON'T SHARE!!. If time is less than 10sec, then wait for the new OTP to be generated.
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Create DOM element
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = otpHtml;
  const otpElement = tempDiv.firstElementChild;
  
  // Start countdown
  startCountdown();
  
// ... (previous imports remain the same)

// In the event listener - MODIFIED SECTION
  otpElement.querySelector('#verify-otp-btn').addEventListener('click', async () => {
    const otpValue = otpElement.querySelector('#otp-input').value.trim();
    
    if (!otpValue) {
      showToast('Error', 'Please enter OTP', 'error');
      return;
    }

    try {
      const isValid = await authService.verifyOtp(otpValue);
      
      if (isValid) {
        // Clear countdown
        clearInterval(countdownInterval);
        
        // Call the callback with success
        if (typeof onVerifyCallback === 'function') {
          onVerifyCallback(true);
        }
      } else {
        showToast('Error', 'Invalid OTP. Please try again.', 'error');
      }
    } catch (error) {
      console.error('OTP verification failed:', error);
      showToast('Error', 'Failed to verify OTP. Please try again.', 'error');
    }
  });

// ... (rest of the file remains the same)  

  otpElement.querySelector('#resend-otp-btn').addEventListener('click', () => {
    // Reset countdown
    countdown = 30;
    otpElement.querySelector('#resend-otp-btn').disabled = true;
    otpElement.querySelector('#resend-otp-btn').textContent = `Generate New OTP (${countdown}s)`;
    
    // Restart countdown
    startCountdown();
    
    // Show toast
    showToast('OTP Resent', 'A new OTP has been sent to your IOB mobile app.', 'info');
  });
  
  function startCountdown() {
    // Clear existing interval if any
    if (countdownInterval) {
      clearInterval(countdownInterval);
    }
    
    // Start new countdown
    countdownInterval = setInterval(() => {
      countdown--;
      const resendBtn = otpElement.querySelector('#resend-otp-btn');
      
      if (countdown <= 0) {
        clearInterval(countdownInterval);
        resendBtn.disabled = false;
        resendBtn.textContent = 'Generate New OTP';
      } else {
        resendBtn.textContent = `Generate New OTP (${countdown}s)`;
      }
    }, 1000);
  }
  
  return otpElement;
}
