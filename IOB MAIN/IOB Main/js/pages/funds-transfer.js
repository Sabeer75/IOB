
import { renderHeader } from '../components/header.js';
import { renderNavigation } from '../components/navigation.js';
import { renderRemittanceSidebar } from '../components/remittance-sidebar.js';
import { renderOtpVerification } from '../components/otp-verification.js';
import { bankingService } from '../services/banking-service.js';
import { showToast } from '../components/toast.js';

// Render the funds transfer page
export function renderFundsTransferPage(container) {
  const accounts = bankingService.getAccounts();
  const payees = bankingService.getPayees();
  
  // Check for payee parameter in URL
  const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
  const preSelectedPayeeId = urlParams.get('payee');
  
  const pageHtml = `
    ${renderHeader()}
    ${renderNavigation('funds-transfer')}
    
    <main>
      <div class="container">
        <div class="page-layout">
          <div>
            ${renderRemittanceSidebar('funds-transfer')}
          </div>
          
          <div>
            <div class="page-header">
              <h1 class="page-title">Funds Transfer</h1>
            </div>
            
            <div id="content-container">
              <div class="form-container">
                <form id="funds-transfer-form">
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
                  
                  <div class="form-group">
                    <label class="form-label" for="toPayee">To Payee*</label>
                    <select id="toPayee" class="form-select" required>
                      <option value="">Select a payee</option>
                      ${payees.length > 0 
                        ? payees.map(payee => `
                          <option value="${payee.id}" ${preSelectedPayeeId === payee.id ? 'selected' : ''}>
                            ${payee.nickname || payee.name} - ${payee.accountNumber}
                          </option>
                        `).join('')
                        : '<option value="no-payees" disabled>No payees found. Please add a payee first.</option>'
                      }
                    </select>
                    ${payees.length === 0 
                      ? '<div class="form-description"><a href="#add-payee" style="color: #1a4e8e;">Add a new payee</a></div>'
                      : ''
                    }
                    <div class="form-error" id="toPayee-error"></div>
                  </div>
                  
                  <div class="form-group">
                    <label class="form-label" for="transferType">Transfer Type*</label>
                    <select id="transferType" class="form-select" required>
                      <option value="IMPS">IMPS - Immediate Payment Service</option>
                      <option value="NEFT">NEFT - National Electronic Funds Transfer</option>
                      <option value="RTGS">RTGS - Real Time Gross Settlement</option>
                    </select>
                    <div class="form-description">
                      IMPS: Instant transfers (24x7), NEFT: Batch processing, RTGS: High-value real-time transfers
                    </div>
                    <div class="form-error" id="transferType-error"></div>
                  </div>
                  
                  <div class="form-group">
                    <label class="form-label" for="amount">Amount (₹)*</label>
                    <input type="text" id="amount" class="form-input" placeholder="Enter amount" required>
                    <div class="form-error" id="amount-error"></div>
                  </div>
                  
                  <div class="form-group">
                    <label class="form-label" for="description">Description (Optional)</label>
                    <textarea id="description" class="form-textarea" placeholder="Enter transaction description"></textarea>
                    <div class="form-error" id="description-error"></div>
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
  const form = document.getElementById('funds-transfer-form');
  const contentContainer = document.getElementById('content-container');
  
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
        toPayeeId: document.getElementById('toPayee').value,
        transferType: document.getElementById('transferType').value,
        amount: parseFloat(document.getElementById('amount').value),
        description: document.getElementById('description').value || undefined
      };
      
      // Show OTP verification
      contentContainer.innerHTML = '';
      const otpComponent = renderOtpVerification((success) => {
        if (success) {
          // Process the transfer
          processTransfer(formData);
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
    
    // Validate payee selection
    const toPayeeId = document.getElementById('toPayee').value;
    if (!toPayeeId || toPayeeId === 'no-payees') {
      document.getElementById('toPayee-error').textContent = 'Please select a payee';
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
      const account = bankingService.getAccountById(fromAccountId);
      if (!bankingService.hasSufficientBalance(fromAccountId, parseFloat(amount))) {
        document.getElementById('amount-error').textContent = 'Insufficient balance in the selected account';
        isValid = false;
      }
    }
    
    return isValid;
  }
  
  function processTransfer(formData) {
    const fromAccount = bankingService.getAccountById(formData.fromAccountId);
    const toPayee = bankingService.getPayeeById(formData.toPayeeId);
    
    if (!fromAccount || !toPayee) {
      showToast('Error', 'Invalid account or payee selection', 'error');
      return;
    }
    
    // Create the transaction
    const transaction = {
      fromAccount: fromAccount.accountNumber,
      toAccount: toPayee.accountNumber,
      amount: formData.amount,
      description: formData.description || `${formData.transferType} Transfer to ${toPayee.name}`,
      type: 'transfer'
    };
    
    // Add the transaction
    bankingService.addTransaction(transaction);
    
    // Show success toast
    showToast(
      'Transfer Successful',
      `₹${formData.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })} has been transferred to ${toPayee.name}`,
      'success'
    );
    
    // Redirect to transactions page
    window.location.hash = 'view-transactions';
  }
}
