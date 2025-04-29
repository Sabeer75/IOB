
import { authService } from '../services/auth-service.js';

// Render the header component
export function renderHeader() {
  const user = authService.getCurrentUser();
  const lastLogin = user.lastLogin ? new Date(user.lastLogin) : new Date();
  
  const headerHtml = `
    <header>
      <div class="container">
        <div class="header-content">
          <div class="logo-container">
            <img src="./iob-logo.png" alt="IOB Logo">
            <div class="logo-text">
              <span class="bank-name">Indian Overseas Bank</span>
              <span class="tagline">Good people to grow with</span>
            </div>
          </div>
          
          <div class="header-right">
            <div class="login-info">
              <div class="avatar"></div>
              <div class="user-info">
                <p>Last Login: ${lastLogin.toLocaleDateString()} at ${lastLogin.toLocaleTimeString()} (IST)</p>
              </div>
            </div>
            
            <div class="btn-container">
              <button class="danger" onclick="window.location.hash = 'report-fraud'">
                Report Fraudulent Transactions
              </button>
              
              <div class="btn-row">
                <button id="logout-btn" class="danger">Logout</button>
                <button class="outline" onclick="window.location.hash = 'change-password'">
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  `;
  
  return headerHtml;
}
