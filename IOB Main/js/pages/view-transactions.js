
import { renderHeader } from '../components/header.js';
import { renderNavigation } from '../components/navigation.js';
import { renderRemittanceSidebar } from '../components/remittance-sidebar.js';
import { bankingService } from '../services/banking-service.js';

// Render the view transactions page
export function renderViewTransactionsPage(container) {
  const accounts = bankingService.getAccounts();
  const transactions = bankingService.getTransactions();
  
  const pageHtml = `
    ${renderHeader()}
    ${renderNavigation('view-transactions')}
    
    <main>
      <div class="container">
        <div class="page-layout">
          <div>
            ${renderRemittanceSidebar('view-transactions')}
          </div>
          
          <div>
            <div class="page-header">
              <h1 class="page-title">View Transactions</h1>
            </div>
            
            <div class="card">
              <div class="card-content">
                <div class="form-group">
                  <label class="form-label" for="accountFilter">Select Account</label>
                  <select id="accountFilter" class="form-select">
                    <option value="all">All Accounts</option>
                    ${accounts.map(account => `
                      <option value="${account.id}">
                        ${account.accountType} - ${account.accountNumber}
                      </option>
                    `).join('')}
                  </select>
                </div>
              </div>
            </div>
            
            <div class="card" style="margin-top: 20px;">
              <div id="transactions-container">
                ${renderTransactionsTable(transactions, accounts, 'all')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  `;
  
  container.innerHTML = pageHtml;
  
  // Add event listener for account filter
  const accountFilter = document.getElementById('accountFilter');
  accountFilter.addEventListener('change', () => {
    const selectedAccountId = accountFilter.value;
    const transactionsContainer = document.getElementById('transactions-container');
    
    transactionsContainer.innerHTML = renderTransactionsTable(
      transactions, 
      accounts, 
      selectedAccountId
    );
  });
}

// Helper function to render transactions table based on filter
function renderTransactionsTable(transactions, accounts, selectedAccountId) {
  // Filter transactions if an account is selected
  let filteredTransactions = [...transactions];
  
  if (selectedAccountId !== 'all') {
    const selectedAccount = accounts.find(a => a.id === selectedAccountId);
    if (selectedAccount) {
      filteredTransactions = transactions.filter(transaction => 
        transaction.fromAccount === selectedAccount.accountNumber || 
        transaction.toAccount === selectedAccount.accountNumber
      );
    }
  }
  
  if (filteredTransactions.length === 0) {
    return `
      <div class="empty-state">
        <p class="empty-state-text">No transactions found for the selected account.</p>
      </div>
    `;
  }
  
  return `
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Date & Time</th>
            <th>Description</th>
            <th>Reference</th>
            <th>From</th>
            <th>To</th>
            <th class="text-right">Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${filteredTransactions.map(transaction => {
            const fromAccount = accounts.find(a => a.accountNumber === transaction.fromAccount);
            const isDebit = selectedAccountId !== 'all' && 
              fromAccount && 
              fromAccount.id === selectedAccountId;
            
            const formattedDate = new Date(transaction.date).toLocaleString('en-IN', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });
            
            return `
              <tr>
                <td>${formattedDate}</td>
                <td>${transaction.description}</td>
                <td>${transaction.reference}</td>
                <td>
                  ${selectedAccountId !== 'all' && fromAccount && fromAccount.id === selectedAccountId 
                    ? 'Your Account' 
                    : transaction.fromAccount
                  }
                </td>
                <td>
                  ${selectedAccountId !== 'all' && !fromAccount && accounts.find(a => a.id === selectedAccountId)?.accountNumber === transaction.toAccount 
                    ? 'Your Account' 
                    : transaction.toAccount
                  }
                </td>
                <td class="text-right ${isDebit ? 'debit' : 'credit'}">
                  ${isDebit ? '-' : '+'}
                  ₹${transaction.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
                <td>
                  <span class="badge badge-${
                    transaction.status === 'completed' ? 'success' : 
                    transaction.status === 'pending' ? 'warning' : 'danger'
                  }">
                    ${transaction.status}
                  </span>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}
