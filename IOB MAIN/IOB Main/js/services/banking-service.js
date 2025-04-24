
// Initial data for the banking application
const INITIAL_DATA = {
  accounts: [
    {
      id: 'acct-1',
      accountNumber: '1234567890',
      accountType: 'Savings',
      balance: 25000.75,
      currency: 'INR',
      branch: 'Main Branch'
    },
    {
      id: 'acct-2',
      accountNumber: '0987654321',
      accountType: 'Current',
      balance: 50000.00,
      currency: 'INR',
      branch: 'Corporate Branch'
    }
  ],
  payees: [
    {
      id: 'payee-1',
      name: 'Jane Smith',
      accountNumber: '5432167890',
      ifscCode: 'IOBA0001234',
      bankName: 'Indian Overseas Bank',
      email: 'jane.smith@example.com',
      phone: '9876543211',
      nickname: 'Jane'
    }
  ],
  transactions: [
    {
      id: 'txn-1',
      fromAccount: '1234567890',
      toAccount: '5432167890',
      amount: 5000,
      description: 'Monthly rent',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
      type: 'transfer',
      reference: 'REF12345678'
    }
  ]
};

// Banking Service to handle banking operations
export const bankingService = {
  // Initialize data if not already initialized
  initializeData() {
    if (!localStorage.getItem('iob_accounts')) {
      localStorage.setItem('iob_accounts', JSON.stringify(INITIAL_DATA.accounts));
    }
    
    if (!localStorage.getItem('iob_payees')) {
      localStorage.setItem('iob_payees', JSON.stringify(INITIAL_DATA.payees));
    }
    
    if (!localStorage.getItem('iob_transactions')) {
      localStorage.setItem('iob_transactions', JSON.stringify(INITIAL_DATA.transactions));
    }
  },
  
  // Get all accounts
  getAccounts() {
    this.initializeData();
    return JSON.parse(localStorage.getItem('iob_accounts'));
  },
  
  // Get account by ID
  getAccountById(id) {
    const accounts = this.getAccounts();
    return accounts.find(account => account.id === id);
  },
  
  // Get account by account number
  getAccountByNumber(accountNumber) {
    const accounts = this.getAccounts();
    return accounts.find(account => account.accountNumber === accountNumber);
  },
  
  // Get all payees
  getPayees() {
    this.initializeData();
    return JSON.parse(localStorage.getItem('iob_payees'));
  },
  
  // Get payee by ID
  getPayeeById(id) {
    const payees = this.getPayees();
    return payees.find(payee => payee.id === id);
  },
  
  // Add a new payee
  addPayee(payee) {
    const payees = this.getPayees();
    const newPayee = {
      ...payee,
      id: `payee-${payees.length + 1}`
    };
    
    payees.push(newPayee);
    localStorage.setItem('iob_payees', JSON.stringify(payees));
    
    return newPayee;
  },
  
  // Remove a payee
  removePayee(id) {
    const payees = this.getPayees();
    const filteredPayees = payees.filter(payee => payee.id !== id);
    localStorage.setItem('iob_payees', JSON.stringify(filteredPayees));
  },
  
  // Get all transactions
  getTransactions() {
    this.initializeData();
    return JSON.parse(localStorage.getItem('iob_transactions'));
  },
  
  // Add a new transaction
  addTransaction(transaction) {
    const transactions = this.getTransactions();
    const accounts = this.getAccounts();
    
    // Create new transaction
    const newTransaction = {
      ...transaction,
      id: `txn-${transactions.length + 1}`,
      date: new Date().toISOString(),
      status: 'completed',
      reference: `REF${Date.now().toString().slice(-8)}`
    };
    
    // Update account balances
    const updatedAccounts = accounts.map(account => {
      if (account.accountNumber === transaction.fromAccount) {
        return {
          ...account,
          balance: account.balance - transaction.amount
        };
      }
      return account;
    });
    
    // Save updated data
    transactions.unshift(newTransaction); // Add to beginning of array
    localStorage.setItem('iob_transactions', JSON.stringify(transactions));
    localStorage.setItem('iob_accounts', JSON.stringify(updatedAccounts));
    
    return newTransaction;
  },
  
  // Check if an account has sufficient balance for a transaction
  hasSufficientBalance(accountId, amount) {
    const account = this.getAccountById(accountId);
    return account && account.balance >= amount;
  }
};
