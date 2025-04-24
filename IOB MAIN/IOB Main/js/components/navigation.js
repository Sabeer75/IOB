
// Render the navigation bar
export function renderNavigation(activeRoute) {
  const navItems = [
    { title: "Accounts", route: "dashboard" },
    { title: "Remittances", route: "view-payee" },
    { title: "Edit Profile", route: "edit-profile" },
    { title: "Bill Payments", route: "bill-payments" },
    { title: "Tax Payments", route: "tax-payments" },
    { title: "IOB Cards", route: "iob-cards" },
    { title: "Utility Payment Receipts", route: "utility-receipts" },
    { title: "IPO", route: "ipo" },
    { title: "Offers", route: "offers" },
    { title: "Instant Loans", route: "instant-loans" },
  ];
  
  const navHtml = `
    <nav>
      <div class="container">
        <div style="display: flex; flex-wrap: wrap; width: 100%;">
          ${navItems.map(item => `
            <div 
              class="nav-item ${(activeRoute === item.route || 
                (item.route === 'dashboard' && activeRoute === 'index') ||
                (item.route === 'view-payee' && 
                  ['add-payee', 'view-payee', 'funds-transfer', 'view-transactions', 'imps'].includes(activeRoute))
              ) ? 'active' : ''}"
              data-route="${item.route}"
            >
              ${item.title}
            </div>
          `).join('')}
        </div>
      </div>
    </nav>
  `;
  
  return navHtml;
}
