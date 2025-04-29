
import { renderHeader } from '../components/header.js';
import { renderNavigation } from '../components/navigation.js';
import { bankingService } from '../services/banking-service.js';

// Render the dashboard page
export function renderDashboardPage(container) {
  const accounts = bankingService.getAccounts();
  const transactions = bankingService.getTransactions();
  
  // Create initial active account
  let activeAccountId = accounts.length > 0 ? accounts[0].id : null;
  
  const dashboardHtml = `
    ${renderHeader()}
    ${renderNavigation('dashboard')}
    
    <main>
      <div class="container">
        <div class="notification-banner">
          <div class="new-tag">NEW</div>
          <p>With effect from 01.10.2019 Bank has introduced special offers for customers with good credit history.</p>
          <button class="close-btn">&times;</button>
        </div>
        
        <div class="two-column">
          <div>
            <div class="card">
              <div class="card-header">Accounts Overview</div>
              <div class="card-content">
                <div id="accounts-container">
                  ${accounts.map(account => `
                    <div class="account-item ${account.id === activeAccountId ? 'active' : ''}" data-account-id="${account.id}">
                      <div class="account-details">
                        <h3>${account.accountType} Account</h3>
                        <p>${account.accountNumber}</p>
                        <p>${account.branch}</p>
                      </div>
                      <div class="account-balance">
                        <p class="balance">${account.currency} ${account.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                        <p>Available Balance</p>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
            
            <div class="card" style="margin-top: 20px;">
              <div class="card-header">Recent Transactions</div>
              <div class="card-content">
                <div id="transactions-container">
                  ${renderTransactions(transactions, accounts, activeAccountId)}
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div class="card">
              <div class="card-header">Quick Actions</div>
              <div class="card-content">
                <div class="quick-links">
                  <a href="#funds-transfer" class="quick-link">Fund Transfer</a>
                  <a href="#add-payee" class="quick-link">Add Payee</a>
                  <a href="#view-transactions" class="quick-link">View Transactions</a>
                  <a href="#imps" class="quick-link">IMPS Transfer</a>
                </div>
              </div>
            </div>
            
            <div class="card" style="margin-top: 20px;">
              <div class="card-header">Offers</div>
              <div class="card-content">
                <div style="padding: 10px; border: 1px solid #e0e0e0; border-radius: 4px; margin-bottom: 10px;">
                  <h3 style="font-weight: 500; margin-bottom: 5px;">Zero Processing Fee</h3>
                  <p style="font-size: 14px; color: #666;">Avail zero processing fee on credit card applications till June 30th.</p>
                </div>
                
                <div style="padding: 10px; border: 1px solid #e0e0e0; border-radius: 4px;">
                  <h3 style="font-weight: 500; margin-bottom: 5px;">Premium Banking</h3>
                  <p style="font-size: 14px; color: #666;">Upgrade to premium banking with exclusive benefits and personalized service.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  `;
  
  container.innerHTML = dashboardHtml;
  
  // Add event listeners for account selection
  const accountItems = document.querySelectorAll('.account-item');
  accountItems.forEach(item => {
    item.addEventListener('click', () => {
      // Update active state
      document.querySelectorAll('.account-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      
      // Update active account ID
      activeAccountId = item.getAttribute('data-account-id');
      
      // Update transactions display
      const transactionsContainer = document.getElementById('transactions-container');
      transactionsContainer.innerHTML = renderTransactions(transactions, accounts, activeAccountId);
    });
  });
}

// Helper function to render transactions for the selected account
function renderTransactions(transactions, accounts, activeAccountId) {
  // Find the active account
  const activeAccount = accounts.find(account => account.id === activeAccountId);
  
  if (!activeAccount) {
    return '<p style="text-align: center; padding: 20px; color: #666;">No account selected</p>';
  }
  
  // Filter transactions for the active account
  const accountTransactions = transactions.filter(transaction => 
    transaction.fromAccount === activeAccount.accountNumber || 
    transaction.toAccount === activeAccount.accountNumber
  ).slice(0, 5); // Get only the latest 5
  
  if (accountTransactions.length === 0) {
    return '<p style="text-align: center; padding: 20px; color: #666;">No recent transactions</p>';
  }
  
  return accountTransactions.map(transaction => {
    const isDebit = transaction.fromAccount === activeAccount.accountNumber;
    const formattedDate = new Date(transaction.date).toLocaleDateString();
    
    return `
      <div class="transaction-item">
        <div class="transaction-details">
          <h3>${transaction.description}</h3>
          <p>${formattedDate} • ${transaction.reference}</p>
        </div>
        <div class="transaction-amount">
          <p class="amount ${isDebit ? 'debit' : 'credit'}">
            ${isDebit ? '-' : '+'}₹ ${transaction.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
          <p class="status">${transaction.status}</p>
        </div>
      </div>
    `;
  }).join('');
}
