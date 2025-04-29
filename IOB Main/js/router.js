
import { renderLoginPage } from './pages/login.js';
import { renderDashboardPage } from './pages/dashboard.js';
import { renderAddPayeePage } from './pages/add-payee.js';
import { renderViewPayeePage } from './pages/view-payee.js';
import { renderFundsTransferPage } from './pages/funds-transfer.js';
import { renderViewTransactionsPage } from './pages/view-transactions.js';
import { renderImpsPage } from './pages/imps.js';
import { authService } from './services/auth-service.js';

// Main render function that determines what page to show
export function renderApp() {
  const appContainer = document.getElementById('app');
  const route = window.location.hash.slice(1) || 'index';
  
  // Check if user is logged in
  const isLoggedIn = authService.isLoggedIn();
  
  // If not logged in, redirect to login page unless already there
  if (!isLoggedIn && route !== 'login') {
    window.location.hash = 'login';
    return;
  }
  
  // If logged in and trying to access login page, redirect to dashboard
  if (isLoggedIn && route === 'login') {
    window.location.hash = 'dashboard';
    return;
  }
  
  // Clear the container
  appContainer.innerHTML = '';
  
  // Render the appropriate page
  switch (route) {
    case 'index':
      // Redirect to login or dashboard based on login status
      window.location.hash = isLoggedIn ? 'dashboard' : 'login';
      break;
    case 'login':
      renderLoginPage(appContainer);
      break;
    case 'dashboard':
      renderDashboardPage(appContainer);
      break;
    case 'add-payee':
      renderAddPayeePage(appContainer);
      break;
    case 'view-payee':
      renderViewPayeePage(appContainer);
      break;
    case 'funds-transfer':
      renderFundsTransferPage(appContainer);
      break;
    case 'view-transactions':
      renderViewTransactionsPage(appContainer);
      break;
    case 'imps':
      renderImpsPage(appContainer);
      break;
    default:
      // If route doesn't match, redirect to dashboard or login
      window.location.hash = isLoggedIn ? 'dashboard' : 'login';
  }
}
