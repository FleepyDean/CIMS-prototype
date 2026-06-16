// CIMS - Clinic Inventory Management System
// Main Application Logic

// App State
const AppState = {
    currentUser: null,
    currentView: 'dashboard',
    isAuthenticated: false
};

// DOM Elements
const els = {
    loginScreen: () => document.getElementById('login-screen'),
    mainDashboard: () => document.getElementById('main-dashboard'),
    mainContent: () => document.getElementById('main-content'),
    pageTitle: () => document.getElementById('page-title'),
    userName: () => document.getElementById('user-name'),
    userRole: () => document.getElementById('user-role-badge'),
    userAvatar: () => document.getElementById('user-avatar'),
    toastContainer: () => document.getElementById('toast-container'),
    forgotPasswordModal: () => document.getElementById('forgot-password-modal')
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    console.log('CIMS v15 initialized');
});

// Setup Event Listeners
function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);

    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

    // Forgot password button
    const forgotBtn = document.getElementById('forgot-password-btn');
    if (forgotBtn) forgotBtn.addEventListener('click', () => showModal('forgot-password-modal'));

    // Forgot password form
    const forgotForm = document.getElementById('forgot-password-form');
    if (forgotForm) forgotForm.addEventListener('submit', handleForgotPassword);

    // Close modal buttons
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.fixed');
            hideModal(modal.id);
        });
    });

    // Close modal on backdrop click
    const forgotModal = document.getElementById('forgot-password-modal');
    if (forgotModal) {
        forgotModal.addEventListener('click', (e) => {
            if (e.target === forgotModal) hideModal('forgot-password-modal');
        });
    }

    // Navigation items
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.getAttribute('data-view');
            console.log('Nav clicked:', view, 'User:', AppState.currentUser?.role);
            if (view && AppState.currentUser) {
                // Check permissions
                if (DB.hasPermission(AppState.currentUser.role, view)) {
                    console.log('Permission granted, navigating to:', view);
                    navigateTo(view);
                    // Update active state
                    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('bg-slate-800'));
                    btn.classList.add('bg-slate-800');
                } else {
                    showToast('Access restricted to managers only', 'warning');
                }
            } else {
                console.log('No view or user not logged in');
            }
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.fixed:not(.hidden)').forEach(modal => {
                if (modal.id !== 'main-dashboard' && modal.id !== 'login-screen') {
                    hideModal(modal.id);
                }
            });
        }
    });
}

// Handle Login
function handleLogin(e) {
    e.preventDefault();
    
    const usernameInput = document.getElementById('login-username');
    const passwordInput = usernameInput.parentElement.nextElementSibling.querySelector('input');
    
    const username = usernameInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    if (!username || !password) {
        showToast('Please enter username and password', 'error');
        return;
    }

    // Determine role and load user data
    let role = 'pharmacist';
    if (username.includes('manager') || username.includes('admin') || username.includes('syaeeda')) {
        role = 'manager';
    }

    AppState.currentUser = { ...DB.getUser(role), role };
    AppState.isAuthenticated = true;

    // Update UI
    updateUserInterface();
    
    // Show dashboard
    els.loginScreen().classList.add('hidden');
    els.mainDashboard().classList.remove('hidden');
    
    // Navigate to dashboard
    navigateTo('dashboard');
    
    showToast(`Welcome, ${AppState.currentUser.name}!`, 'success');
}

// Handle Logout
function handleLogout() {
    AppState.currentUser = null;
    AppState.isAuthenticated = false;
    AppState.currentView = 'dashboard';

    els.mainDashboard().classList.add('hidden');
    els.loginScreen().classList.remove('hidden');

    // Reset form
    document.getElementById('login-form').reset();
    
    // Reset sidebar - show all items again
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.style.display = 'flex';
    });
    const adminSection = document.querySelector('nav .pt-6');
    if (adminSection) adminSection.style.display = 'block';
    
    showToast('Logged out successfully', 'info');
}

// Handle Forgot Password
function handleForgotPassword(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    
    if (!email) {
        showToast('Please enter your email address', 'error');
        return;
    }

    showToast(`Password reset link sent to ${email}`, 'success');
    hideModal('forgot-password-modal');
    e.target.reset();
}

// Navigate to View
function navigateTo(viewName) {
    if (!AppState.currentUser) return;
    
    AppState.currentView = viewName;
    
    // Update page title
    const titles = {
        dashboard: 'System Dashboard',
        procurement: 'Procurement & Batch Intake',
        allocation: 'Supply Allocation & Tracking',
        expiry: 'Expiry Tracking & Health Monitoring',
        disposal: 'Wastage & Disposal Management',
        staff: 'Staff Directory',
        settings: 'Settings',
        authorization: 'High-Value Authorization',
        quality: 'Restock Warning'
    };
    els.pageTitle().textContent = titles[viewName] || viewName;

    // Render view content
    const content = els.mainContent();
    console.log('Rendering view:', viewName, 'View exists:', !!Views[viewName]);
    try {
        content.innerHTML = Views[viewName] 
            ? Views[viewName](AppState.currentUser.role)
            : Views.dashboard(AppState.currentUser.role);
        console.log('View rendered successfully');
    } catch (err) {
        console.error('Error rendering view:', err);
        content.innerHTML = `<div class="p-4 text-red-600">Error loading view: ${err.message}</div>`;
    }

    // Apply fade-in animation
    content.classList.remove('fade-in');
    void content.offsetWidth; // Trigger reflow
    content.classList.add('fade-in');
}

// Update User Interface
function updateUserInterface() {
    if (!AppState.currentUser) return;
    
    els.userName().textContent = AppState.currentUser.name;
    els.userRole().textContent = AppState.currentUser.role === 'manager' ? 'Head of Clinic' : 'Pharmacist';
    els.userAvatar().textContent = AppState.currentUser.avatar;
    
    // Update sidebar navigation visibility
    updateSidebarNavigation();
}

// Update Sidebar Navigation based on role
function updateSidebarNavigation() {
    if (!AppState.currentUser) return;
    
    const role = AppState.currentUser.role;
    const allowedViews = DB.getPermissions ? DB.getPermissions(role) : [];
    
    // Show/hide nav items based on permissions
    document.querySelectorAll('.nav-item').forEach(btn => {
        const view = btn.getAttribute('data-view');
        if (view && !allowedViews.includes(view)) {
            btn.style.display = 'none';
        } else {
            btn.style.display = 'flex';
        }
    });
    
    // Handle Admin section - check if any items inside are visible
    const adminSection = document.querySelector('nav .pt-6');
    if (adminSection) {
        // Admin items are Staff and Settings
        const adminItems = ['staff', 'settings'];
        const hasVisibleAdminItem = adminItems.some(item => allowedViews.includes(item));
        
        if (hasVisibleAdminItem) {
            adminSection.style.display = 'block';
        } else {
            adminSection.style.display = 'none';
        }
    }
}

// Show Toast Notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    const colors = {
        success: 'bg-green-600',
        error: 'bg-red-600',
        warning: 'bg-amber-500',
        info: 'bg-blue-600'
    };
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };

    toast.className = `${colors[type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] transform transition-all duration-300 translate-x-full`;
    toast.innerHTML = `<i class="fas ${icons[type]}"></i><span class="font-medium">${message}</span>`;

    els.toastContainer().appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
        toast.classList.remove('translate-x-full');
    });

    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Show Modal
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

// Hide Modal
function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

// Handle Dispense Form
function handleDispense(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const patientId = formData.get('patientId');
    const medication = formData.get('medication');
    const quantity = formData.get('quantity');
    
    showToast(`Dispensed ${quantity} units to ${patientId}`, 'success');
    e.target.reset();
    
    // Refresh the dashboard to update queue
    if (AppState.currentView === 'dashboard') {
        navigateTo('dashboard');
    }
}

// Handle Shipment Registration (UC1.2)
function commitRegistration() {
    const supplyName = document.getElementById('supply-name')?.value;
    const batchId = document.getElementById('batch-id')?.value;
    const expiryDate = document.getElementById('expiry-date')?.value;
    const quantity = document.getElementById('quantity')?.value;
    const category = document.getElementById('category')?.value;
    const supplier = document.getElementById('supplier')?.value;
    const damaged = document.getElementById('damaged-delivery')?.checked;

    // Validation
    if (!supplyName || !batchId || !quantity || !category) {
        showToast('Please fill in all required fields', 'error');
        return;
    }

    if (damaged) {
        showToast('UC1.3 Triggered: Damaged Delivery workflow initiated', 'warning');
        hideModal('register-shipment-modal');
        // Could redirect to damaged delivery handling flow here
        return;
    }

    // Success - simulate adding to inventory
    showToast(`Shipment registered: ${supplyName} (${batchId})`, 'success');
    hideModal('register-shipment-modal');
    
    // Reset form
    document.getElementById('supply-name').value = '';
    document.getElementById('batch-id').value = '#BTCH-TEMP';
    document.getElementById('expiry-date').value = '';
    document.getElementById('quantity').value = '';
    document.getElementById('category').value = '';
    document.getElementById('supplier').value = '';
    document.getElementById('damaged-delivery').checked = false;

    // Refresh procurement view to show new item
    if (AppState.currentView === 'procurement') {
        navigateTo('procurement');
    }
}

// Handle Purchase Order Transmission (UC1.1)
function transmitPO() {
    const supplier = document.getElementById('po-supplier')?.value;
    const item = document.getElementById('po-item')?.value;
    const quantity = document.getElementById('po-quantity')?.value;
    const priority = document.getElementById('po-priority')?.value;
    const notes = document.getElementById('po-notes')?.value;

    // Validation
    if (!supplier || supplier === 'new') {
        showToast('Please select a supplier', 'error');
        return;
    }
    if (!item) {
        showToast('Please enter item name', 'error');
        return;
    }
    if (!quantity || quantity < 1) {
        showToast('Please enter valid quantity', 'error');
        return;
    }

    // Generate PO ID
    const poId = `PO-${Date.now().toString().slice(-6)}`;
    
    // Show success message based on priority
    let priorityMsg = '';
    if (priority === 'high') priorityMsg = ' [HIGH PRIORITY]';
    if (priority === 'critical') priorityMsg = ' [CRITICAL - URGENT]';

    showToast(`PO ${poId} transmitted${priorityMsg}`, 'success');
    hideModal('generate-po-modal');
    
    // Reset form
    document.getElementById('po-supplier').value = '';
    document.getElementById('po-item').value = '';
    document.getElementById('po-quantity').value = '';
    document.getElementById('po-priority').value = 'normal';
    document.getElementById('po-notes').value = '';

    // Log to console (simulate API call)
    console.log('PO Transmitted:', { poId, supplier, item, quantity, priority, notes });
}

// Handle Verify & Deduct (UC2.1/UC2.2)
function verifyAndDeduct() {
    const context = document.getElementById('usage-context')?.value;
    const item = document.getElementById('usage-item')?.value;
    const qty = document.getElementById('usage-qty')?.value;
    const actor = document.getElementById('usage-actor')?.value;
    const refId = document.getElementById('usage-ref-id')?.value;

    if (!item) {
        showToast('Please select an item', 'error');
        return;
    }
    if (!qty || qty < 1) {
        showToast('Please enter valid quantity', 'error');
        return;
    }

    // Simulate verification
    const itemName = document.getElementById('usage-item').selectedOptions[0]?.text || 'Item';
    
    showToast(`UC2.3 Verification: ${itemName.split('(')[0].trim()} → PASS`, 'success');
    
    setTimeout(() => {
        showToast(`${context === 'UC2.1' ? 'Prescription' : 'Usage'} logged: ${qty} units deducted`, 'success');
        hideModal('log-usage-modal');
        
        // Reset form
        document.getElementById('usage-item').value = '';
        document.getElementById('usage-qty').value = '1';
        document.getElementById('usage-ref-id').value = '';
        
        // Refresh view
        if (AppState.currentView === 'allocation') {
            navigateTo('allocation');
        }
    }, 800);
}

// Handle High-Value Authorization Request (UC2.5)
function submitAuthorization() {
    const item = document.getElementById('high-value-item')?.value;
    const qty = document.getElementById('high-value-qty')?.value;
    const justification = document.getElementById('clinical-justification')?.value;

    if (!item) {
        showToast('Please select a restricted asset', 'error');
        return;
    }
    if (!justification || justification.length < 10) {
        showToast('Please provide detailed clinical justification', 'error');
        return;
    }

    const itemName = document.getElementById('high-value-item').selectedOptions[0]?.text || 'Asset';
    const requestId = `HVA-${Date.now().toString().slice(-6)}`;
    
    showToast(`Request ${requestId} submitted for UC2.6 Authorization`, 'success');
    hideModal('request-high-value-modal');
    
    // Reset form
    document.getElementById('high-value-item').value = '';
    document.getElementById('high-value-qty').value = '1';
    document.getElementById('clinical-justification').value = '';
    
    console.log('High-Value Request:', { requestId, item: itemName, qty, justification });
}

// Handle Authorize Release (UC2.6)
function authorizeRelease(requestId) {
    const request = DB.updateAuthorizationStatus(requestId, 'approved');
    if (request) {
        showToast(`Request ${requestId} authorized - ${request.item} released`, 'success');
        // Refresh the authorization view
        if (AppState.currentView === 'authorization') {
            navigateTo('authorization');
        }
    }
}

// Handle Reject Request (UC2.6)
function rejectRequest(requestId) {
    const request = DB.updateAuthorizationStatus(requestId, 'rejected');
    if (request) {
        showToast(`Request ${requestId} rejected`, 'warning');
        // Refresh the authorization view
        if (AppState.currentView === 'authorization') {
            navigateTo('authorization');
        }
    }
}


// Subsystem 3: Asset Sterilization Handlers

// Move asset to Autoclave
function moveToAutoclave(assetId) {
    const asset = DB.updateSterilizationStatus(assetId, 'autoclave');
    if (asset) {
        showToast(`${asset.name} moved to autoclave`, 'info');
        if (AppState.currentView === 'sterilization') {
            navigateTo('sterilization');
        }
    }
}

// Mark asset as Available (sterilized)
function markAvailable(assetId) {
    const asset = DB.updateSterilizationStatus(assetId, 'available');
    if (asset) {
        showToast(`${asset.name} is now available for use`, 'success');
        if (AppState.currentView === 'sterilization') {
            navigateTo('sterilization');
        }
    }
}

// Log new reusable asset
function logNewAsset() {
    const name = document.getElementById('asset-name').value;
    const location = document.getElementById('asset-location').value;
    const status = document.getElementById('asset-status').value;
    
    if (!name || !location) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    const newAsset = {
        id: `STZ-${Date.now().toString().slice(-3)}`,
        name: name,
        status: status,
        location: location,
        usedAt: status === 'contaminated' ? new Date().toLocaleString('en-GB') : null
    };
    
    // Add to data (in a real app, this would be a DB call)
    if (CIMS_DB && CIMS_DB.sterilizationAssets) {
        CIMS_DB.sterilizationAssets.push(newAsset);
    }
    
    showToast(`Asset ${newAsset.id} logged successfully`, 'success');
    hideModal('log-asset-modal');
    
    // Reset form
    document.getElementById('asset-name').value = '';
    document.getElementById('asset-location').value = '';
    document.getElementById('asset-status').value = 'contaminated';
    
    // Refresh view
    if (AppState.currentView === 'sterilization') {
        navigateTo('sterilization');
    }
}

// Log new waste disposal (Pharmacist)
function logNewWaste() {
    const itemSelect = document.getElementById('waste-item');
    const qty = document.getElementById('waste-qty').value;
    const reason = document.getElementById('waste-reason').value;
    const method = document.getElementById('waste-method').value;
    const notes = document.getElementById('waste-notes').value;
    
    if (!itemSelect.value || !qty || !reason || !method) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    const itemName = itemSelect.options[itemSelect.selectedIndex].dataset.name;
    const itemId = itemSelect.value;
    
    const newLog = {
        disposalId: `DSP-${Date.now().toString().slice(-4)}`,
        item: itemName,
        reason: reason,
        method: method,
        status: 'Pending Approval',
        date: new Date().toISOString().split('T')[0],
        notes: notes,
        itemId: itemId,
        quantity: parseInt(qty)
    };
    
    // Add to data
    if (DB && DB.addDisposalLog) {
        DB.addDisposalLog(newLog);
    } else if (CIMS_DB && CIMS_DB.disposal && CIMS_DB.disposal.logs) {
        CIMS_DB.disposal.logs.unshift(newLog);
    }
    
    showToast(`Waste log ${newLog.disposalId} submitted for approval`, 'success');
    hideModal('log-waste-modal');
    
    // Reset form
    document.getElementById('waste-item').value = '';
    document.getElementById('waste-qty').value = '1';
    document.getElementById('waste-reason').value = '';
    document.getElementById('waste-method').value = '';
    document.getElementById('waste-notes').value = '';
    
    // Refresh view
    if (AppState.currentView === 'disposal') {
        navigateTo('disposal');
    }
}

// Open Edit Disposal Modal (Manager)
function openEditDisposalModal(disposalId) {
    const disposal = CIMS_DB.disposal.logs.find(l => l.disposalId === disposalId);
    if (!disposal) {
        showToast('Disposal log not found', 'error');
        return;
    }
    
    // Populate form fields
    document.getElementById('edit-disposal-id').value = disposal.disposalId;
    document.getElementById('edit-disposal-item').value = disposal.item;
    document.getElementById('edit-disposal-qty').value = disposal.quantity || 1;
    document.getElementById('edit-disposal-reason').value = disposal.reason;
    document.getElementById('edit-disposal-method').value = disposal.method;
    document.getElementById('edit-disposal-status').value = disposal.status;
    document.getElementById('edit-disposal-notes').value = disposal.notes || '';
    
    showModal('edit-disposal-modal');
}

// Save Disposal Edit (Manager)
function saveDisposalEdit() {
    const disposalId = document.getElementById('edit-disposal-id').value;
    const qty = document.getElementById('edit-disposal-qty').value;
    const reason = document.getElementById('edit-disposal-reason').value;
    const method = document.getElementById('edit-disposal-method').value;
    const status = document.getElementById('edit-disposal-status').value;
    const notes = document.getElementById('edit-disposal-notes').value;
    
    if (!qty || !reason || !method || !status) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    const log = CIMS_DB.disposal.logs.find(l => l.disposalId === disposalId);
    if (log) {
        log.quantity = parseInt(qty);
        log.reason = reason;
        log.method = method;
        log.status = status;
        log.notes = notes;
        
        showToast(`Disposal log ${disposalId} updated successfully`, 'success');
        hideModal('edit-disposal-modal');
        
        // Refresh view
        if (AppState.currentView === 'disposal') {
            navigateTo('disposal');
        }
    }
}

// Delete Disposal Log (Manager)
function deleteDisposalLog(disposalId) {
    if (!confirm(`Are you sure you want to delete disposal log ${disposalId}?`)) {
        return;
    }
    
    const index = CIMS_DB.disposal.logs.findIndex(l => l.disposalId === disposalId);
    if (index > -1) {
        CIMS_DB.disposal.logs.splice(index, 1);
        showToast(`Disposal log ${disposalId} deleted successfully`, 'success');
        
        // Refresh view
        if (AppState.currentView === 'disposal') {
            navigateTo('disposal');
        }
    }
}

// Generate Disposal Report (Manager)
function generateDisposalReport() {
    const disposal = CIMS_DB.disposal;
    const logs = disposal.logs;
    
    // Calculate statistics
    const pendingCount = logs.filter(l => l.status === 'Pending Approval').length;
    const completedCount = logs.filter(l => l.status === 'Completed').length;
    
    // Calculate breakdown by reason
    const reasonBreakdown = {};
    logs.forEach(log => {
        reasonBreakdown[log.reason] = (reasonBreakdown[log.reason] || 0) + 1;
    });
    
    // Update modal with data
    document.getElementById('report-period').textContent = disposal.summary.period;
    document.getElementById('report-total-loss').textContent = disposal.summary.totalLoss;
    document.getElementById('report-pending').textContent = pendingCount;
    document.getElementById('report-completed').textContent = completedCount;
    
    // Render reason breakdown
    const breakdownContainer = document.getElementById('report-reason-breakdown');
    breakdownContainer.innerHTML = Object.entries(reasonBreakdown).map(([reason, count]) => {
        const colorClass = reason === 'Expired' ? 'bg-red-100 text-red-700' : 
                          reason === 'Contamination' ? 'bg-orange-100 text-orange-700' : 
                          'bg-blue-100 text-blue-700';
        return `
            <div class="flex items-center justify-between p-3 bg-white border rounded-lg">
                <span class="px-2 py-1 ${colorClass} rounded text-xs font-medium">${reason}</span>
                <span class="font-semibold text-gray-900">${count} item(s)</span>
            </div>
        `;
    }).join('');
    
    // Render logs table
    const logsTable = document.getElementById('report-logs-table');
    logsTable.innerHTML = logs.map(log => `
        <tr class="hover:bg-gray-50">
            <td class="px-3 py-2 font-medium text-gray-900">${log.disposalId}</td>
            <td class="px-3 py-2 text-gray-700">${log.item}</td>
            <td class="px-3 py-2"><span class="px-2 py-1 ${log.reason === 'Expired' ? 'bg-red-100 text-red-700' : log.reason === 'Contamination' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'} rounded text-xs">${log.reason}</span></td>
            <td class="px-3 py-2"><span class="px-2 py-1 ${log.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'} rounded text-xs">${log.status}</span></td>
        </tr>
    `).join('');
    
    showModal('disposal-report-modal');
}

// Download Disposal Report as CSV
function downloadDisposalReportCSV() {
    const disposal = CIMS_DB.disposal;
    const logs = disposal.logs;
    
    // CSV Header
    let csv = 'Disposal ID,Item,Reason,Method,Status,Date,Quantity,Notes\n';
    
    // CSV Rows
    logs.forEach(log => {
        const notes = (log.notes || '').replace(/"/g, '""');
        csv += `"${log.disposalId}","${log.item}","${log.reason}","${log.method}","${log.status}","${log.date}",${log.quantity || 1},"${notes}"\n`;
    });
    
    // Add summary
    csv += `\n"Summary","Period: ${disposal.summary.period}"\n`;
    csv += `"Total Loss","${disposal.summary.totalLoss}"\n`;
    
    // Create download link
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `disposal_report_${disposal.summary.period.replace(/\s+/g, '_')}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('Report downloaded successfully', 'success');
}

// Trigger Emergency Restock Request
function triggerEmergencyRestock() {
    const urgency = document.getElementById('restock-urgency').value;
    const item = document.getElementById('restock-item').value;
    const qty = document.getElementById('restock-qty').value;
    const supplier = document.getElementById('restock-supplier').value;
    const justification = document.getElementById('restock-justification').value;
    
    if (!urgency || !item || !qty || !justification) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    const selectedItem = DB.getInventory ? DB.getInventory().find(i => (i.id || i.batchId) === item) : null;
    const itemName = selectedItem ? selectedItem.itemName : item;
    
    const requestId = `EMR-${Date.now().toString().slice(-4)}`;
    
    showToast(`Emergency restock ${requestId} triggered for ${itemName}`, 'success');
    hideModal('emergency-restock-modal');
    
    // Reset form
    document.getElementById('restock-urgency').value = 'critical';
    document.getElementById('restock-item').value = '';
    document.getElementById('restock-qty').value = '100';
    document.getElementById('restock-supplier').value = '';
    document.getElementById('restock-justification').value = '';
}

// Global exports for inline event handlers
window.showToast = showToast;
window.showModal = showModal;
window.hideModal = hideModal;
window.handleDispense = handleDispense;
window.commitRegistration = commitRegistration;
window.transmitPO = transmitPO;
window.verifyAndDeduct = verifyAndDeduct;
window.submitAuthorization = submitAuthorization;
window.authorizeRelease = authorizeRelease;
window.rejectRequest = rejectRequest;
window.logNewWaste = logNewWaste;
window.openEditDisposalModal = openEditDisposalModal;
window.saveDisposalEdit = saveDisposalEdit;
window.deleteDisposalLog = deleteDisposalLog;
window.generateDisposalReport = generateDisposalReport;
window.downloadDisposalReportCSV = downloadDisposalReportCSV;
window.triggerEmergencyRestock = triggerEmergencyRestock;
window.navigateTo = navigateTo;
window.AppState = AppState;

// Log initialization
console.log('CIMS Application v15 Loaded');
console.log('Data Module:', typeof DB !== 'undefined' ? 'OK' : 'Missing');
console.log('Views Module:', typeof Views !== 'undefined' ? 'OK' : 'Missing');
