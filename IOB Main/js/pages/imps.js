
import { renderHeader } from '../components/header.js';
import { renderNavigation } from '../components/navigation.js';
import { renderRemittanceSidebar } from '../components/remittance-sidebar.js';
import { renderOtpVerification } from '../components/otp-verification.js';
import { bankingService } from '../services/banking-service.js';
import { showToast } from '../components/toast.js';

// Render the IMPS transfer page
export function renderImpsPage(container) {
  const accounts = bankingService.getAccounts();
  
  const pageHtml = `
    ${renderHeader()}
    ${renderNavigation('imps')}
    
    <main>
      <div class="container">
        <div class="page-layout">
          <div>
            ${renderRemittanceSidebar('imps')}
          </div>
          
          <div>
            <div class="page-header">
              <h1 class="page-title">IMPS Transfer</h1>
            </div>
            
            <div id="content-container">
              <div class="form-container">
                <form id="imps-form">
                  <div class="form-group">
                    <label class="form-label" for="fromAccount">From Account*</label>
                    <select id="fromAccount" class="form-select" required>
                      <option value="">Select an account</option>
                      ${accounts.map(account => `
                        <option value="${account.id}">
                          ${account.accountType} - ${account.accountNumber} (₹${account.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })})
                        </option>
                      `).join('')}
                    </select>
                    <div class="form-error" id="fromAccount-error"></div>
                  </div>
                  
                  <div class="form-grid">
                    <div class="form-group">
                      <label class="form-label" for="receiverName">Receiver Name*</label>
                      <input type="text" id="receiverName" class="form-input" placeholder="Enter receiver's name" required>
                      <div class="form-error" id="receiverName-error"></div>
                    </div>
                    
                    <div class="form-group">
                      <label class="form-label" for="ifscCode">IFSC Code*</label>
                      <input type="text" id="ifscCode" class="form-input" placeholder="e.g., IOBA0001234" required>
                      <div class="form-description">11 character code of the receiver's bank branch</div>
                      <div class="form-error" id="ifscCode-error"></div>
                    </div>
                    
                    <div class="form-group">
                      <label class="form-label" for="receiverAccountNumber">Account Number*</label>
                      <input type="text" id="receiverAccountNumber" class="form-input" placeholder="Enter receiver's account number" required>
                      <div class="form-error" id="receiverAccountNumber-error"></div>
                    </div>
                    
                    <div class="form-group">
                      <label class="form-label" for="confirmAccountNumber">Confirm Account Number*</label>
                      <input type="text" id="confirmAccountNumber" class="form-input" placeholder="Re-enter account number" required>
                      <div class="form-error" id="confirmAccountNumber-error"></div>
                    </div>
                    
                    <div class="form-group">
                      <label class="form-label" for="amount">Amount (₹)*</label>
                      <input type="text" id="amount" class="form-input" placeholder="Enter amount" required>
                      <div class="form-error" id="amount-error"></div>
                    </div>
                  </div>
                  
                  <div class="form-group">
                    <label class="form-label" for="description">Description (Optional)</label>
                    <textarea id="description" class="form-textarea" placeholder="Enter transaction description"></textarea>
                    <div class="form-error" id="description-error"></div>
                  </div>
                  
                  <div class="form-checkbox">
                    <input type="checkbox" id="saveAsBeneficiary" class="form-checkbox-input">
                    <div class="form-checkbox-label">
                      <label for="saveAsBeneficiary">Save as Beneficiary</label>
                      <div class="form-checkbox-description">
                        Add this receiver to your beneficiary list for future transfers
                      </div>
                    </div>
                  </div>
                  
                  <div class="form-actions">
                    <button type="button" id="cancel-btn" class="outline">Cancel</button>
                    <button type="submit" id="submit-btn" class="primary">Proceed</button>
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
  const form = document.getElementById('imps-form');
  const contentContainer = document.getElementById('content-container');
  
  // Convert IFSC code to uppercase
  document.getElementById('ifscCode').addEventListener('input', (e) => {
    e.target.value = e.target.value.toUpperCase();
  });
  
  document.getElementById('cancel-btn').addEventListener('click', () => {
    window.location.hash = 'dashboard';
  });
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Validate form
    if (validateForm()) {
      // Store form data
      const formData = {
        fromAccountId: document.getElementById('fromAccount').value,
        receiverName: document.getElementById('receiverName').value,
        receiverAccountNumber: document.getElementById('receiverAccountNumber').value,
        ifscCode: document.getElementById('ifscCode').value,
        amount: parseFloat(document.getElementById('amount').value),
        description: document.getElementById('description').value || undefined,
        saveAsBeneficiary: document.getElementById('saveAsBeneficiary').checked
      };
      
      // Show OTP verification
      contentContainer.innerHTML = '';
      const otpComponent = renderOtpVerification((success) => {
        if (success) {
          // Process the IMPS transfer
          processImpsTransfer(formData);
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
    
    // Validate account selection
    const fromAccountId = document.getElementById('fromAccount').value;
    if (!fromAccountId) {
      document.getElementById('fromAccount-error').textContent = 'Please select an account';
      isValid = false;
    }
    
    // Validate receiver name
    const receiverName = document.getElementById('receiverName').value;
    if (receiverName.length < 3) {
      document.getElementById('receiverName-error').textContent = 'Receiver name must be at least 3 characters';
      isValid = false;
    }
    
    // Validate IFSC code
    const ifscCode = document.getElementById('ifscCode').value;
    if (ifscCode.length !== 11) {
      document.getElementById('ifscCode-error').textContent = 'IFSC code must be 11 characters';
      isValid = false;
    }
    
    // Validate account number
    const receiverAccountNumber = document.getElementById('receiverAccountNumber').value;
    if (receiverAccountNumber.length < 5) {
      document.getElementById('receiverAccountNumber-error').textContent = 'Account number must be at least 5 characters';
      isValid = false;
    }
    
    // Validate confirm account number
    const confirmAccountNumber = document.getElementById('confirmAccountNumber').value;
    if (receiverAccountNumber !== confirmAccountNumber) {
      document.getElementById('confirmAccountNumber-error').textContent = "Account numbers don't match";
      isValid = false;
    }
    
    // Validate amount
    const amount = document.getElementById('amount').value;
    if (!amount) {
      document.getElementById('amount-error').textContent = 'Amount is required';
      isValid = false;
    } else if (isNaN(parseFloat(amount))) {
      document.getElementById('amount-error').textContent = 'Amount must be a number';
      isValid = false;
    } else if (parseFloat(amount) <= 0) {
      document.getElementById('amount-error').textContent = 'Amount must be greater than 0';
      isValid = false;
    }
    
    // Validate if sufficient balance
    if (isValid) {
      if (!bankingService.hasSufficientBalance(fromAccountId, parseFloat(amount))) {
        document.getElementById('amount-error').textContent = 'Insufficient balance in the selected account';
        isValid = false;
      }
    }
    
    return isValid;
  }
  
  function processImpsTransfer(formData) {
    const fromAccount = bankingService.getAccountById(formData.fromAccountId);
    
    if (!fromAccount) {
      showToast('Error', 'Invalid account selection', 'error');
      return;
    }
    
    // Save as beneficiary if checked
    if (formData.saveAsBeneficiary) {
      bankingService.addPayee({
        name: formData.receiverName,
        accountNumber: formData.receiverAccountNumber,
        ifscCode: formData.ifscCode,
        bankName: "Bank Name", // This would be fetched from IFSC code in a real app
      });
    }
    
    // Create the transaction
    const transaction = {
      fromAccount: fromAccount.accountNumber,
      toAccount: formData.receiverAccountNumber,
      amount: formData.amount,
      description: formData.description || `IMPS Transfer to ${formData.receiverName}`,
      type: 'transfer'
    };
    
    // Add the transaction
    bankingService.addTransaction(transaction);
    
    // Show success toast
    showToast(
      'Transfer Successful',
      `₹${formData.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })} has been transferred to ${formData.receiverName}`,
      'success'
    );
    
    // Redirect to transactions page
    window.location.hash = 'view-transactions';
  }
}
