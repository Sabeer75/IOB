
import { renderApp } from './router.js';
import { showToast } from './components/toast.js';
import { authService } from './services/auth-service.js';

import './services/activityTracker.js'; // Start tracking

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  // Check if user is logged in
  const isLoggedIn = authService.isLoggedIn();
  
  // Render the appropriate view
  renderApp();
  
  // Set up event delegation for the entire app
  document.addEventListener('click', handleGlobalClick);
});

// Global click handler using event delegation
function handleGlobalClick(event) {
  // Handle navigation items
  if (event.target.closest('.nav-item')) {
    const navItem = event.target.closest('.nav-item');
    const route = navItem.getAttribute('data-route');
    if (route) {
      event.preventDefault();
      window.location.hash = route;
    }
  }
  
  // Handle sidebar menu items
  if (event.target.closest('.sidebar-menu-item')) {
    const menuItem = event.target.closest('.sidebar-menu-item');
    const route = menuItem.getAttribute('data-route');
    if (route) {
      event.preventDefault();
      window.location.hash = route;
    }
  }
  
  // Handle logout button
  if (event.target.closest('#logout-btn')) {
    event.preventDefault();
    authService.logout();
    window.location.hash = 'login';
    showToast('Logged out successfully', 'You have been logged out from your account', 'success');
  }
  
  // Close notification banner
  if (event.target.closest('.close-btn')) {
    const banner = event.target.closest('.notification-banner');
    if (banner) {
      banner.classList.add('hidden');
    }
  }
}

// Listen for hash changes to handle routing
window.addEventListener('hashchange', () => {
  renderApp();
});
