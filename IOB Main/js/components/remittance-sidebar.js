
// Render the remittance sidebar
export function renderRemittanceSidebar(activeRoute) {
  const menuItems = [
    { title: "Add Payee", route: "add-payee" },
    { title: "View Payee", route: "view-payee" },
    { title: "Remove Payee", route: "remove-payee" },
    { title: "Funds Transfer", route: "funds-transfer" },
    { title: "View Transactions", route: "view-transactions" },
    { title: "IMPS", route: "imps" },
    { title: "View Scheduled", route: "view-scheduled" },
    { title: "Bulk Remittance", route: "bulk-remittance" },
    { title: "IPO", route: "ipo" }
  ];
  
  const sidebarHtml = `
    <div class="sidebar">
      <div class="sidebar-header">
        Remittances
      </div>
      <div class="sidebar-menu">
        ${menuItems.map(item => `
          <div 
            class="sidebar-menu-item ${activeRoute === item.route ? 'active' : ''}"
            data-route="${item.route}"
          >
            ${item.title}
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  return sidebarHtml;
}
