
import { authService } from '../services/auth-service.js';
import { showToast } from '../components/toast.js';

// Render the login page
export function renderLoginPage(container) {
  const loginHtml = `
    <div class="auth-page">
      <header class="w-full bg-white p-4 border-b shadow-sm">
        <div class="container">
          <div class="flex items-center justify-center">
            <div class="logo-container">
              <img src="./iob-logo.png" alt="IOB Logo" class="h-12">
              <div class="logo-text">
                <span class="bank-name">Indian Overseas Bank</span>
                <span class="tagline">Good people to grow with</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main class="auth-main">
        <div class="auth-card">
          <div class="auth-header">
            <h1 class="auth-title">IOB NetBanking Login</h1>
            <p class="auth-subtitle">Enter your credentials to access your account</p>
          </div>
          
          <div class="auth-form">
            <form id="login-form">
              <div class="form-group">
                <label class="form-label">Username</label>
                <input type="text" id="username" class="form-input" placeholder="Enter your username" required>
              </div>
              
              <div class="form-group">
                <label class="form-label">Password</label>
                <input type="password" id="password" class="form-input" placeholder="Enter your password" required>
              </div>
              
              <button type="submit" id="login-button" class="primary" style="width: 100%; margin-top: 20px;">
                Sign In
              </button>
            </form>
            
            <div class="auth-note">
              <div style="color: #0d6efd;">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <div style="color: #0d6efd; font-size: 0.875rem;">
                <p>You should use the correct username and password.</p>
                <p style="margin-top: 0.25rem;">In a real app, this would connect to the bank's authentication system.</p>
              </div>
            </div>
            
            <div class="auth-links">
              <a href="#">Forgot Username / Password?</a>
              <div style="margin-top: 0.5rem;">
                <a href="#">First Time User? Register Here</a>
              </div>
            </div>
          </div>
        </div>
        
        <div class="auth-footer">
          <p>For technical assistance, call our 24/7 helpline: 1800-425-1250</p>
        </div>
      </main>
      
      <footer>
        <div class="container">
          <p>© ${new Date().getFullYear()} Indian Overseas Bank. All Rights Reserved.</p>
          <p style="margin-top: 0.25rem;">
            <a href="#">Privacy Policy</a> | 
            <a href="#">Terms of Service</a> | 
            <a href="#">Security Information</a>
          </p>
        </div>
      </footer>
    </div>
  `;
  
  container.innerHTML = loginHtml;
  
  // Add event listener to the login form
  const loginForm = document.getElementById('login-form');
  const loginButton = document.getElementById('login-button');
  
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Disable button to prevent multiple submissions
    loginButton.disabled = true;
    loginButton.textContent = 'Signing in...';
    
    // Get form values
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Simulate API call delay
    setTimeout(() => {
      // Log in the user
      authService.login(username, password);
      
      // Show success toast
      showToast('Login Successful', 'Welcome to IOB NetBanking', 'success');
      
      // Redirect to dashboard
      window.location.hash = 'dashboard';
    }, 1500);
  });
}
