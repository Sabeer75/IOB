
import { renderHeader } from '../components/header.js';
import { renderNavigation } from '../components/navigation.js';
import { renderRemittanceSidebar } from '../components/remittance-sidebar.js';
import { bankingService } from '../services/banking-service.js';
import { showToast } from '../components/toast.js';

// Render the view payee page
export function renderViewPayeePage(container) {
  const payees = bankingService.getPayees();
  
  const pageHtml = `
    ${renderHeader()}
    ${renderNavigation('view-payee')}
    
    <main>
      <div class="container">
        <div class="page-layout">
          <div>
            ${renderRemittanceSidebar('view-payee')}
          </div>
          
          <div>
            <div class="page-header">
              <h1 class="page-title">View Payees</h1>
              <button class="primary" id="add-payee-btn">Add New Payee</button>
            </div>
            
            <div class="card">
              ${payees.length > 0 ? `
                <div class="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Account Number</th>
                        <th>Bank</th>
                        <th>IFSC Code</th>
                        <th class="text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${payees.map(payee => `
                        <tr>
                          <td>${payee.nickname ? `${payee.name} (${payee.nickname})` : payee.name}</td>
                          <td>${payee.accountNumber}</td>
                          <td>${payee.bankName}</td>
                          <td>${payee.ifscCode}</td>
                          <td class="text-right">
                            <div class="table-actions">
                              <button class="outline transfer-btn" data-payee-id="${payee.id}">Transfer</button>
                              <button class="danger remove-btn" data-payee-id="${payee.id}">Remove</button>
                            </div>
                          </td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
              ` : `
                <div class="empty-state">
                  <p class="empty-state-text">You don't have any payees yet.</p>
                  <button class="primary" id="add-first-payee-btn">Add Your First Payee</button>
                </div>
              `}
            </div>
            
            <!-- Delete Confirmation Dialog (Hidden by default) -->
            <div class="dialog-overlay hidden" id="delete-dialog">
              <div class="dialog-content">
                <div class="dialog-header">
                  <h2 class="dialog-title">Confirm Deletion</h2>
                  <p class="dialog-description">
                    Are you sure you want to remove this payee? This action cannot be undone.
                  </p>
                </div>
                <div class="dialog-footer">
                  <button class="outline" id="cancel-delete-btn">Cancel</button>
                  <button class="danger" id="confirm-delete-btn">Remove Payee</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  `;
  
  container.innerHTML = pageHtml;
  
  // Add event listeners
  const addPayeeBtn = document.getElementById('add-payee-btn');
  if (addPayeeBtn) {
    addPayeeBtn.addEventListener('click', () => {
      window.location.hash = 'add-payee';
    });
  }
  
  const addFirstPayeeBtn = document.getElementById('add-first-payee-btn');
  if (addFirstPayeeBtn) {
    addFirstPayeeBtn.addEventListener('click', () => {
      window.location.hash = 'add-payee';
    });
  }
  
  // Transfer button event listeners
  const transferBtns = document.querySelectorAll('.transfer-btn');
  transferBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const payeeId = btn.getAttribute('data-payee-id');
      window.location.hash = `funds-transfer?payee=${payeeId}`;
    });
  });
  
  // Remove button event listeners
  const removeBtns = document.querySelectorAll('.remove-btn');
  const deleteDialog = document.getElementById('delete-dialog');
  const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
  const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
  
  let selectedPayeeId = null;
  
  removeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      selectedPayeeId = btn.getAttribute('data-payee-id');
      deleteDialog.classList.remove('hidden');
    });
  });
  
  cancelDeleteBtn.addEventListener('click', () => {
    deleteDialog.classList.add('hidden');
    selectedPayeeId = null;
  });
  
  confirmDeleteBtn.addEventListener('click', () => {
    if (selectedPayeeId) {
      bankingService.removePayee(selectedPayeeId);
      deleteDialog.classList.add('hidden');
      
      // Show success toast
      showToast('Payee Removed', 'The payee has been removed successfully', 'success');
      
      // Refresh the page
      renderViewPayeePage(container);
    }
  });
}
