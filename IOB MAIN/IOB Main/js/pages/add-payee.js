
import { renderHeader } from '../components/header.js';
import { renderNavigation } from '../components/navigation.js';
import { renderRemittanceSidebar } from '../components/remittance-sidebar.js';
import { renderOtpVerification } from '../components/otp-verification.js';
import { bankingService } from '../services/banking-service.js';
import { showToast } from '../components/toast.js';

// Render the add payee page
export function renderAddPayeePage(container) {
  const pageHtml = `
    ${renderHeader()}
    ${renderNavigation('add-payee')}
    
    <main>
      <div class="container">
        <div class="page-layout">
          <div>
            ${renderRemittanceSidebar('add-payee')}
          </div>
          
          <div>
            <div class="page-header">
              <h1 class="page-title">Add Payee</h1>
            </div>
            
            <div id="content-container">
              <div class="form-container">
                <form id="add-payee-form">
                  <div class="form-grid">
                    <div class="form-group">
                      <label class="form-label" for="name">Payee Name*</label>
                      <input type="text" id="name" class="form-input" placeholder="Enter beneficiary name" required>
                      <div class="form-error" id="name-error"></div>
                    </div>
                    
                    <div class="form-group">
                      <label class="form-label" for="accountNumber">Account Number*</label>
                      <input type="text" id="accountNumber" class="form-input" placeholder="Enter account number" required>
                      <div class="form-error" id="accountNumber-error"></div>
                    </div>
                    
                    <div class="form-group">
                      <label class="form-label" for="confirmAccountNumber">Confirm Account Number*</label>
                      <input type="text" id="confirmAccountNumber" class="form-input" placeholder="Re-enter account number" required>
                      <div class="form-error" id="confirmAccountNumber-error"></div>
                    </div>
                    
                    <div class="form-group">
                      <label class="form-label" for="ifscCode">IFSC Code*</label>
                      <input type="text" id="ifscCode" class="form-input" placeholder="e.g., IOBA0001234" required>
                      <div class="form-description">11 character code of the bank branch</div>
                      <div class="form-error" id="ifscCode-error"></div>
                    </div>
                    
                    <div class="form-group">
                      <label class="form-label" for="bankName">Bank Name*</label>
                      <input type="text" id="bankName" class="form-input" placeholder="Enter bank name" required>
                      <div class="form-error" id="bankName-error"></div>
                    </div>
                    
                    <div class="form-group">
                      <label class="form-label" for="nickname">Nickname (Optional)</label>
                      <input type="text" id="nickname" class="form-input" placeholder="E.g., Friend, Landlord">
                    </div>
                    
                    <div class="form-group">
                      <label class="form-label" for="email">Email (Optional)</label>
                      <input type="email" id="email" class="form-input" placeholder="Enter email address">
                      <div class="form-error" id="email-error"></div>
                    </div>
                    
                    <div class="form-group">
                      <label class="form-label" for="phone">Mobile Number (Optional)</label>
                      <input type="text" id="phone" class="form-input" placeholder="Enter mobile number">
                      <div class="form-error" id="phone-error"></div>
                    </div>
                  </div>
                  
                  <div class="form-actions">
                    <button type="button" id="cancel-btn" class="outline">Cancel</button>
                    <button type="submit" id="submit-btn" class="primary">Submit</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  `;
  
  container.innerHTML = pageHtml;
  
  // Add event listeners
  const form = document.getElementById('add-payee-form');
  const contentContainer = document.getElementById('content-container');
  
  document.getElementById('cancel-btn').addEventListener('click', () => {
    window.location.hash = 'view-payee';
  });
  
  // Convert IFSC code to uppercase
  document.getElementById('ifscCode').addEventListener('input', (e) => {
    e.target.value = e.target.value.toUpperCase();
  });
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Validate form
    if (validateForm()) {
      // Store form data
      const formData = {
        name: document.getElementById('name').value,
        accountNumber: document.getElementById('accountNumber').value,
        ifscCode: document.getElementById('ifscCode').value,
        bankName: document.getElementById('bankName').value,
        email: document.getElementById('email').value || undefined,
        phone: document.getElementById('phone').value || undefined,
        nickname: document.getElementById('nickname').value || undefined
      };
      
      // Show OTP verification
      contentContainer.innerHTML = '';
      const otpComponent = renderOtpVerification((success) => {
        if (success) {
          // Add payee
          bankingService.addPayee(formData);
          
          // Show success toast
          showToast('Success', 'Payee has been added successfully', 'success');
          
          // Redirect to view payee page
          window.location.hash = 'view-payee';
        }
      });
      
      contentContainer.appendChild(otpComponent);
      
      // Show toast for OTP
      showToast('OTP Sent', 'An OTP has been sent to your IOB mobile app.', 'info');
    }
  });
  
  function validateForm() {
    let isValid = true;
    
    // Reset previous errors
    document.querySelectorAll('.form-error').forEach(el => {
      el.textContent = '';
    });
    
    // Validate name
    const name = document.getElementById('name').value;
    if (name.length < 3) {
      document.getElementById('name-error').textContent = 'Name must be at least 3 characters long';
      isValid = false;
    }
    
    // Validate account number
    const accountNumber = document.getElementById('accountNumber').value;
    if (accountNumber.length < 5) {
      document.getElementById('accountNumber-error').textContent = 'Account number must be at least 5 characters';
      isValid = false;
    }
    
    // Validate confirm account number
    const confirmAccountNumber = document.getElementById('confirmAccountNumber').value;
    if (accountNumber !== confirmAccountNumber) {
      document.getElementById('confirmAccountNumber-error').textContent = "Account numbers don't match";
      isValid = false;
    }
    
    // Validate IFSC code
    const ifscCode = document.getElementById('ifscCode').value;
    if (ifscCode.length !== 11) {
      document.getElementById('ifscCode-error').textContent = 'IFSC code must be 11 characters';
      isValid = false;
    }
    
    // Validate bank name
    const bankName = document.getElementById('bankName').value;
    if (bankName.length < 3) {
      document.getElementById('bankName-error').textContent = 'Bank name is required';
      isValid = false;
    }
    
    // Validate email if provided
    const email = document.getElementById('email').value;
    if (email && !isValidEmail(email)) {
      document.getElementById('email-error').textContent = 'Invalid email address';
      isValid = false;
    }
    
    // Validate phone if provided
    const phone = document.getElementById('phone').value;
    if (phone && phone.length < 10) {
      document.getElementById('phone-error').textContent = 'Phone number must be at least 10 digits';
      isValid = false;
    }
    
    return isValid;
  }
  
  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }
}
