// CIMS Views - View Rendering Functions
const Views = {
    getColorClasses: (color) => {
        const colors = {
            blue: { bg: 'bg-blue-50', text: 'text-blue-600', light: 'bg-blue-100', dark: 'bg-blue-600' },
            green: { bg: 'bg-green-50', text: 'text-green-600', light: 'bg-green-100', dark: 'bg-green-600' },
            orange: { bg: 'bg-orange-50', text: 'text-orange-600', light: 'bg-orange-100', dark: 'bg-orange-600' },
            red: { bg: 'bg-red-50', text: 'text-red-600', light: 'bg-red-100', dark: 'bg-red-600' },
            amber: { bg: 'bg-amber-50', text: 'text-amber-600', light: 'bg-amber-100', dark: 'bg-amber-600' },
            purple: { bg: 'bg-purple-50', text: 'text-purple-600', light: 'bg-purple-100', dark: 'bg-purple-600' },
            pink: { bg: 'bg-pink-50', text: 'text-pink-600', light: 'bg-pink-100', dark: 'bg-pink-600' }
        };
        return colors[color] || colors.blue;
    },

    dashboard: (role) => {
        const stats = DB.getStats(role);
        const alerts = DB.getAlerts(role);
        const chartData = DB.getChartData();

        if (role === 'manager') {
            return `
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div class="bg-white rounded-xl border border-gray-200 p-6">
                        <div class="flex items-start justify-between">
                            <div>
                                <p class="text-sm text-gray-500 mb-1">Total Batches</p>
                                <p class="text-3xl font-bold text-gray-900">${stats.totalBatches.toLocaleString()}</p>
                                <p class="text-xs text-green-600 mt-1"><i class="fas fa-arrow-up mr-1"></i>${stats.totalBatchesChange} from last month</p>
                            </div>
                            <div class="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center"><i class="fas fa-cubes text-blue-600"></i></div>
                        </div>
                    </div>
                    <div class="bg-white rounded-xl border border-gray-200 p-6">
                        <div class="flex items-start justify-between">
                            <div><p class="text-sm text-gray-500 mb-1">Available Items</p><p class="text-3xl font-bold text-gray-900">${stats.availableItems.toLocaleString()}</p><p class="text-xs text-gray-500 mt-1">Ready for allocation</p></div>
                            <div class="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center"><i class="fas fa-check-circle text-green-600"></i></div>
                        </div>
                    </div>
                    <div class="bg-white rounded-xl border border-gray-200 p-6">
                        <div class="flex items-start justify-between">
                            <div><p class="text-sm text-gray-500 mb-1">Expiring Units</p><p class="text-3xl font-bold text-orange-600">${stats.expiringUnits}</p><p class="text-xs text-orange-500 mt-1">Requires immediate action</p></div>
                            <div class="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center"><i class="fas fa-exclamation-triangle text-orange-600"></i></div>
                        </div>
                    </div>
                    <div class="bg-white rounded-xl border border-gray-200 p-6">
                        <div class="flex items-start justify-between">
                            <div><p class="text-sm text-gray-500 mb-1">Wastage (MTD)</p><p class="text-3xl font-bold text-red-600">${stats.wastage}%</p><p class="text-xs text-red-500 mt-1">${stats.wastageChange} from target</p></div>
                            <div class="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center"><i class="fas fa-chart-line text-red-600"></i></div>
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div class="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
                        <div class="flex items-center justify-between mb-6">
                            <h3 class="font-semibold text-gray-900">Inventory Status Flow</h3>
                            <select class="text-sm border border-gray-200 rounded-lg px-3 py-1 bg-white"><option>Last 7 Days</option></select>
                        </div>
                        <div class="h-64 flex items-end gap-3">
                            ${chartData.labels.map((day, i) => `
                                <div class="flex-1 flex flex-col items-center gap-2">
                                    <div class="w-full relative bg-blue-100 rounded-t-lg" style="height: ${chartData.data[i]}%"><div class="absolute bottom-0 w-full bg-blue-600 rounded-t-lg" style="height: 70%"></div></div>
                                    <span class="text-xs text-gray-500">${day}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 class="font-semibold text-gray-900 mb-4">Critical Alerts</h3>
                        <div class="space-y-4">
                            ${alerts.map(alert => `
                                <div class="flex gap-3 p-3 bg-${alert.bgColor}-50 rounded-lg border border-${alert.bgColor}-100">
                                    <div class="w-10 h-10 bg-${alert.bgColor}-100 rounded-lg flex items-center justify-center flex-shrink-0"><i class="fas fa-${alert.icon} text-${alert.bgColor}-600"></i></div>
                                    <div class="flex-1 min-w-0"><p class="text-sm font-medium text-${alert.bgColor}-900">${alert.title}</p><p class="text-xs text-${alert.bgColor}-600">${alert.message}</p></div>
                                </div>
                            `).join('')}
                        </div>
                        <button onclick="showToast('All alerts loaded', 'info')" class="w-full mt-4 text-sm text-blue-600 font-medium hover:text-blue-700">VIEW ALL ALERTS</button>
                    </div>
                </div>`;
        } else {
            return `
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div class="bg-white rounded-xl border border-gray-200 p-6">
                        <div class="flex items-start justify-between">
                            <div><p class="text-sm text-gray-500 mb-1">Today's Dispensing</p><p class="text-3xl font-bold text-gray-900">${stats.todayDispensing}</p><p class="text-xs text-gray-500 mt-1">Prescriptions filled</p></div>
                            <div class="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center"><i class="fas fa-prescription text-blue-600"></i></div>
                        </div>
                    </div>
                    <div class="bg-white rounded-xl border border-gray-200 p-6">
                        <div class="flex items-start justify-between">
                            <div><p class="text-sm text-gray-500 mb-1">Pending Orders</p><p class="text-3xl font-bold text-orange-600">${stats.pendingOrders}</p><p class="text-xs text-gray-500 mt-1">Awaiting pickup</p></div>
                            <div class="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center"><i class="fas fa-clock text-orange-600"></i></div>
                        </div>
                    </div>
                    <div class="bg-white rounded-xl border border-gray-200 p-6">
                        <div class="flex items-start justify-between">
                            <div><p class="text-sm text-gray-500 mb-1">Low Stock Alerts</p><p class="text-3xl font-bold text-red-600">${stats.lowStockAlerts}</p><p class="text-xs text-gray-500 mt-1">Items need restocking</p></div>
                            <div class="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center"><i class="fas fa-bell text-red-600"></i></div>
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 class="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                        <div class="space-y-3">
                            <button onclick="navigateTo('allocation'); document.querySelector('[data-view=\\'allocation\\']').click(); setTimeout(() => showModal('log-usage-modal'), 300);" class="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-medium flex items-center justify-center gap-2">
                                <i class="fas fa-clipboard-list"></i>Log Usage / Dispense
                            </button>
                            <button onclick="navigateTo('allocation')" class="w-full bg-white border-2 border-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-50 font-medium flex items-center justify-center gap-2">
                                <i class="fas fa-boxes"></i>Go to Allocation & Tracking
                            </button>
                            <button onclick="navigateTo('expiry')" class="w-full bg-white border-2 border-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-50 font-medium flex items-center justify-center gap-2">
                                <i class="fas fa-clock"></i>Check Expiry Alerts
                            </button>
                        </div>
                        <p class="text-xs text-gray-500 mt-4 text-center">Use the Allocation tab for full dispensing workflow</p>
                    </div>
                    <div class="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 class="font-semibold text-gray-900 mb-4">Pending Queue</h3>
                        <div class="space-y-3">
                            ${DB.getDispensingQueue().map(p => {
                                const colors = Views.getColorClasses(p.color);
                                return `<div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"><div class="flex items-center gap-3"><div class="w-8 h-8 ${colors.light} rounded-full flex items-center justify-center text-xs font-semibold ${colors.text}">${p.initials}</div><div><p class="text-sm font-medium text-gray-900">${p.patient}</p><p class="text-xs text-gray-500">${p.medication}</p></div></div><span class="text-xs text-gray-400">${p.time}</span></div>`;
                            }).join('')}
                        </div>
                    </div>
                </div>`;
        }
    },

    procurement: (role) => {
        const inventory = DB.getInventory();
        return `
            <div class="bg-white rounded-xl border border-gray-200">
                <div class="p-6 border-b border-gray-200 flex items-center justify-between">
                    <div><h3 class="font-semibold text-gray-900">Batch Intake & Registration</h3><p class="text-sm text-gray-500 mt-1">Register new deliveries and generate purchase orders</p></div>
                    <div class="flex gap-3">
                        <button onclick="showModal('generate-po-modal')" class="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-900"><i class="fas fa-file-invoice mr-2"></i>Generate Purchase Order</button>
                        <button onclick="showModal('register-shipment-modal')" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"><i class="fas fa-plus mr-2"></i>New Delivery</button>
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-50"><tr><th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Batch ID</th><th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Description</th><th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Category</th><th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Expiry</th><th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Qty</th></tr></thead>
                        <tbody class="divide-y divide-gray-200">
                            ${inventory.map(item => `
                                <tr class="hover:bg-gray-50">
                                    <td class="px-6 py-4 text-sm font-medium text-blue-600">#${item.batchId}</td>
                                    <td class="px-6 py-4"><p class="text-sm font-medium text-gray-900">${item.itemName}</p><p class="text-xs text-gray-500">${item.supplier.substring(0, 25)}${item.supplier.length > 25 ? '...' : ''}</p></td>
                                    <td class="px-6 py-4"><span class="px-2 py-1 ${item.category === 'Vaccines' ? 'bg-blue-100 text-blue-700' : item.category === 'Medication' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'} rounded text-xs">${item.category}</span></td>
                                    <td class="px-6 py-4 text-sm text-gray-600">${new Date(item.expiryDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                    <td class="px-6 py-4 text-sm font-medium text-gray-900">${item.quantity.toLocaleString()}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            ${Views.registerShipmentModal()}
            ${Views.generatePOModal()}`;
    },

    allocation: (role) => {
        const dispensingLogs = DB.getDispensingLogs ? DB.getDispensingLogs() : [
            { id: 'DSP-8921', item: 'Paracetamol 500mg', prescriptionId: 'Rx-2024-4501', qty: '-2 Strips', time: '2 mins ago', actor: 'Danish Pharmacist', type: 'prescription' },
            { id: 'DSP-8920', item: 'Disposable Syringe 5ml', usageId: 'IU-2024-2102', qty: '-5 Units', time: '15 mins ago', actor: 'Nurse Nurin Qistina', type: 'internal' }
        ];
        const verificationLogs = DB.getVerificationLogs ? DB.getVerificationLogs() : [
            { time: '14:45:03', action: 'Stock Availability', item: 'Paracetamol (Pkg: 1, Avail: 450)', result: 'PASS', status: 'pass' },
            { time: '14:45:04', action: 'Stock Availability', item: 'Syringe (Pkg: 5, Avail: 120)', result: 'PASS', status: 'pass' },
            { time: '14:38:12', action: 'Stock Availability', item: 'Surgical Mask (Req: 50, Avail: 32)', result: 'FAIL', status: 'fail', note: 'Insufficient' }
        ];
        return `
            <!-- Subsystem Header -->
            <div class="mb-6">
                <div class="flex items-center justify-between mb-2">
                    <h2 class="text-xl font-semibold text-gray-900">Dispensing & Usage</h2>
                    <span class="text-xs text-gray-400">ICS-v15 Enterprise</span>
                </div>
                <p class="text-sm text-gray-500">Log patient prescriptions and treatment room usage</p>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3 mb-6">
                <button onclick="showModal('log-usage-modal')" class="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2">
                    <i class="fas fa-clipboard-list"></i>Log Usage / Dispense
                </button>
                <button onclick="showModal('request-high-value-modal')" class="bg-white border-2 border-purple-600 text-purple-600 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-purple-50 flex items-center gap-2">
                    <i class="fas fa-lock"></i>Request High-Value
                </button>
            </div>

            <!-- Two Column Layout -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Recent Dispensing Logs -->
                <div class="bg-white rounded-xl border border-gray-200">
                    <div class="p-4 border-b border-gray-200">
                        <h3 class="font-semibold text-gray-900">Recent Dispensing Logs</h3>
                    </div>
                    <div class="divide-y divide-gray-100">
                        ${dispensingLogs.map(log => `
                            <div class="p-4 hover:bg-gray-50">
                                <div class="flex items-start justify-between">
                                    <div>
                                        <p class="font-medium text-gray-900">${log.item}</p>
                                        <p class="text-xs text-gray-500 mt-1">
                                            ${log.type === 'prescription' ? `<i class="fas fa-prescription mr-1"></i>Prescription: ${log.prescriptionId}` : `<i class="fas fa-hospital mr-1"></i>Internal Usage: ${log.usageId}`}
                                        </p>
                                        <p class="text-xs text-gray-400 mt-1">by ${log.actor} • ${log.time}</p>
                                    </div>
                                    <span class="text-sm font-semibold ${String(log.qty).startsWith('-') ? 'text-red-600' : 'text-green-600'}">${log.qty}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- UC2.3: Verification Engine Logs -->
                <div class="bg-white rounded-xl border border-gray-200">
                    <div class="p-4 border-b border-gray-200 bg-green-50">
                        <h3 class="font-semibold text-green-900"><i class="fas fa-shield-alt mr-2"></i>Verification Engine Logs</h3>
                    </div>
                    <div class="p-4 space-y-3 max-h-[400px] overflow-y-auto">
                        ${verificationLogs.map(log => `
                            <div class="text-xs font-mono">
                                <span class="text-gray-400">[${log.time}]</span>
                                <span class="text-gray-600">Check Availability:</span>
                                <span class="${log.status === 'pass' ? 'text-green-600' : 'text-red-600'}">${log.item} → ${log.result}</span>
                                ${log.note ? `<span class="text-red-500">(${log.note})</span>` : ''}
                            </div>
                        `).join('')}
                        <div class="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                            <p class="text-xs text-amber-700">
                                <i class="fas fa-exclamation-triangle mr-1"></i>
                                Triggering Emergency Refill Protocol...
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            ${Views.logUsageModal()}
            ${Views.requestHighValueModal()}`;
    },

    expiry: (role) => {
        const alerts = DB.getAlerts(role);
        const criticalCount = alerts.filter(a => a.type === 'critical').length;
        const warningCount = alerts.filter(a => a.type === 'warning').length;
        return `
            <div class="bg-white rounded-xl border border-gray-200">
                <div class="p-6 border-b border-gray-200 flex items-center justify-between">
                    <div><h3 class="font-semibold text-gray-900">Cold Chain & Expiry Watch</h3></div>
                    <div class="flex gap-2"><span class="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs">Critical: ${criticalCount}</span><span class="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs">Warning: ${warningCount}</span></div>
                </div>
                <div class="p-6 space-y-4">
                    ${alerts.map(alert => `
                        <div class="flex gap-4 p-4 bg-${alert.bgColor}-50 rounded-lg border border-${alert.bgColor}-100">
                            <div class="w-12 h-12 bg-${alert.bgColor}-100 rounded-lg flex items-center justify-center flex-shrink-0"><i class="fas fa-${alert.icon} text-${alert.bgColor}-600 text-xl"></i></div>
                            <div class="flex-1">
                                <div class="flex items-center justify-between mb-1"><h4 class="font-semibold text-${alert.bgColor}-900">${alert.title}</h4>${alert.action ? `<button onclick="showToast('${alert.action}', '${alert.type}')" class="bg-${alert.bgColor}-600 text-white px-3 py-1 rounded text-xs hover:bg-${alert.bgColor}-700">${alert.action}</button>` : ''}</div>
                                <span class="text-xs text-${alert.bgColor}-600"><i class="fas fa-${alert.type === 'critical' ? 'calendar-times' : 'calendar-alt'} mr-1"></i>${alert.message}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>`;
    },

    disposal: (role) => {
        const disposal = DB.getDisposal();
        return `
            <div class="bg-white rounded-xl border border-gray-200">
                <div class="p-6 border-b border-gray-200 flex items-center justify-between">
                    <div><h3 class="font-semibold text-gray-900">Disposal & Wastage Logs</h3></div>
                    ${role === 'manager' ? `<button onclick="generateDisposalReport()" class="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-900"><i class="fas fa-file-download mr-2"></i>Generate Report</button>` : `<button onclick="showModal('log-waste-modal')" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"><i class="fas fa-plus mr-2"></i>Log Waste</button>`}
                </div>
                <div class="p-6">
                    <div class="flex items-center justify-between mb-4">
                        <div><p class="text-xs text-gray-500 uppercase">Current Reporting Period</p><h4 class="text-lg font-semibold text-gray-900">${disposal.summary.period}</h4></div>
                        <div class="text-right"><p class="text-xs text-gray-500">Total Loss</p><p class="text-xl font-bold text-red-600">${disposal.summary.totalLoss}</p></div>
                    </div>
                    <table class="w-full">
                        <thead class="bg-gray-50"><tr><th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Disposal ID</th><th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Item</th><th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Reason</th><th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>${role === 'manager' ? '<th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>' : ''}</tr></thead>
                        <tbody class="divide-y divide-gray-200">
                            ${disposal.logs.map(log => `
                                <tr class="hover:bg-gray-50"><td class="px-4 py-3 text-sm font-medium text-gray-900">${log.disposalId}</td><td class="px-4 py-3 text-sm text-gray-700">${log.item}</td><td class="px-4 py-3"><span class="px-2 py-1 ${log.reason === 'Expired' ? 'bg-red-100 text-red-700' : log.reason === 'Contamination' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'} rounded text-xs">${log.reason}</span></td><td class="px-4 py-3"><span class="px-2 py-1 ${log.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'} rounded text-xs">${log.status}</span></td>${role === 'manager' ? `<td class="px-4 py-3"><div class="flex gap-2"><button onclick="openEditDisposalModal('${log.disposalId}')" class="text-blue-600 hover:text-blue-800" title="Edit"><i class="fas fa-edit"></i></button><button onclick="deleteDisposalLog('${log.disposalId}')" class="text-red-600 hover:text-red-800" title="Delete"><i class="fas fa-trash-alt"></i></button></div></td>` : ''}</tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            ${Views.logWasteModal()}
            ${role === 'manager' ? Views.editDisposalModal() : ''}
            ${role === 'manager' ? Views.disposalReportModal() : ''}
        `;
    },

    staff: (role) => {
        const staff = DB.getStaff();
        return `
            <div class="bg-white rounded-xl border border-gray-200">
                <div class="p-6 border-b border-gray-200 flex items-center justify-between">
                    <div><h3 class="font-semibold text-gray-900">Staff Directory</h3><p class="text-sm text-gray-500 mt-1">Manage clinic staff</p></div>
                    <button onclick="showToast('Add staff form', 'info')" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"><i class="fas fa-plus mr-2"></i>Add Staff</button>
                </div>
                <table class="w-full">
                    <thead class="bg-gray-50"><tr><th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th><th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Role</th><th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Department</th><th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th></tr></thead>
                    <tbody class="divide-y divide-gray-200">
                        ${staff.map(member => {
                            const colors = Views.getColorClasses(member.color);
                            return `<tr class="hover:bg-gray-50"><td class="px-6 py-4"><div class="flex items-center gap-3"><div class="w-10 h-10 ${colors.light} rounded-full flex items-center justify-center text-sm font-semibold ${colors.text}">${member.initials}</div><div><p class="text-sm font-medium text-gray-900">${member.name}</p><p class="text-xs text-gray-500">${member.email}</p></div></div></td><td class="px-6 py-4 text-sm text-gray-700">${member.role}</td><td class="px-6 py-4 text-sm text-gray-700">${member.department}</td><td class="px-6 py-4"><span class="px-2 py-1 ${member.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'} rounded text-xs">${member.status}</span></td></tr>`;
                        }).join('')}
                    </tbody>
                </table>
            </div>`;
    },

    settings: (role) => {
        return `
            <div class="bg-white rounded-xl border border-gray-200">
                <div class="p-6 border-b border-gray-200"><h3 class="font-semibold text-gray-900">${role === 'manager' ? 'System Settings' : 'My Settings'}</h3></div>
                <div class="p-6 space-y-6">
                    <div><h4 class="text-sm font-medium text-gray-900 mb-3">Notifications</h4><div class="space-y-3">
                        <label class="flex items-center gap-3"><input type="checkbox" checked class="w-4 h-4 text-blue-600 rounded"><span class="text-sm text-gray-700">${role === 'manager' ? 'Enable low stock alerts' : 'Email alerts for low stock'}</span></label>
                        <label class="flex items-center gap-3"><input type="checkbox" checked class="w-4 h-4 text-blue-600 rounded"><span class="text-sm text-gray-700">${role === 'manager' ? 'Enable expiry notifications' : 'SMS notifications'}</span></label>
                    </div></div>
                    ${role === 'manager' ? `<div class="pt-6 border-t border-gray-200"><h4 class="text-sm font-medium text-gray-900 mb-3">Inventory Thresholds</h4><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm text-gray-700 mb-1">Low Stock Threshold (%)</label><input type="number" value="20" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"></div><div><label class="block text-sm text-gray-700 mb-1">Expiry Warning (days)</label><input type="number" value="30" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"></div></div></div>` : ''}
                    <div class="pt-6 border-t border-gray-200"><button onclick="showToast('Settings saved', 'success')" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Save Changes</button></div>
                </div>
            </div>`;
    },

    restricted: () => {
        return `
            <div class="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <div class="flex items-center gap-3">
                    <i class="fas fa-lock text-amber-600 text-xl"></i>
                    <div>
                        <h3 class="font-semibold text-amber-900">Access Restricted</h3>
                        <p class="text-sm text-amber-700">Only Clinic Managers can access this section.</p>
                    </div>
                </div>
            </div>`;
    },

    // UC2.6: High-Value Authorization (Manager only)
    authorization: (role) => {
        const requests = DB.getAuthorizationRequests ? DB.getAuthorizationRequests() : [];
        const pendingRequests = requests.filter(r => r.status === 'pending');
        
        return `
            <!-- Header -->
            <div class="mb-6">
                <h2 class="text-xl font-semibold text-gray-900">Authorize Request</h2>
                <p class="text-sm text-gray-500 mt-1">Review and digitally sign-off on restricted asset requests</p>
            </div>

            ${pendingRequests.length === 0 ? `
                <div class="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <div class="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-check-circle text-green-600 text-2xl"></i>
                    </div>
                    <h3 class="font-semibold text-gray-900 mb-2">No Pending Requests</h3>
                    <p class="text-sm text-gray-500">All high-value asset requests have been processed</p>
                </div>
            ` : pendingRequests.map(req => `
                <div class="bg-white rounded-xl border border-gray-200 overflow-hidden mb-4" id="request-${req.id}">
                    <!-- Action Required Badge -->
                    <div class="px-6 py-3 bg-red-50 border-b border-red-100 flex items-center justify-between">
                        <span class="text-xs font-semibold text-red-700 uppercase tracking-wide">Action Required</span>
                        <span class="text-xs font-mono text-purple-600 font-semibold">${req.id}</span>
                    </div>
                    
                    <!-- Request Details -->
                    <div class="p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-1">${req.item}</h3>
                        <p class="text-sm text-gray-500 mb-4">Requested by: <span class="font-medium text-gray-700">${req.requestedBy}</span> (${req.department})</p>
                        
                        <!-- Clinical Justification -->
                        <div class="mb-6">
                            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Clinical Justification</label>
                            <div class="bg-slate-50 border border-slate-200 rounded-lg p-4">
                                <p class="text-sm text-gray-700 italic">"${req.justification}"</p>
                            </div>
                        </div>
                        
                        <!-- Action Buttons -->
                        <div class="flex gap-3">
                            <button onclick="authorizeRelease('${req.id}')" class="bg-purple-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-purple-700 flex items-center gap-2">
                                <i class="fas fa-lock-open"></i>Authorize Release
                            </button>
                            <button onclick="rejectRequest('${req.id}')" class="bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-50">
                                Reject
                            </button>
                        </div>
                    </div>
                </div>
            `).join('')}`;
    },

    // Modal: Register Incoming Shipment (UC1.2)
    registerShipmentModal: () => {
        return `
            <div id="register-shipment-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
                <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
                    <!-- Modal Header -->
                    <div class="bg-blue-600 px-6 py-4 flex items-center justify-between">
                        <h3 class="text-white font-semibold text-lg">Register Incoming Shipment</h3>
                        <button onclick="hideModal('register-shipment-modal')" class="text-white hover:text-blue-200 transition">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    
                    <!-- Modal Body -->
                    <div class="p-6 space-y-5">
                        <!-- Supply Name -->
                        <div>
                            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Supply Name</label>
                            <input type="text" id="supply-name" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter supply name...">
                        </div>
                        
                        <!-- Batch ID and Expiry Date Row -->
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Batch ID</label>
                                <input type="text" id="batch-id" value="#BTCH-TEMP" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-gray-900 font-medium focus:ring-2 focus:ring-blue-500">
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Expiry Date</label>
                                <div class="relative">
                                    <input type="text" id="expiry-date" placeholder="dd-----yyyy" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500">
                                    <i class="fas fa-calendar absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Quantity and Category -->
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Quantity</label>
                                <input type="number" id="quantity" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500" placeholder="0">
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Category</label>
                                <select id="category" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500">
                                    <option value="">Select category...</option>
                                    <option value="Medication">Medication</option>
                                    <option value="Vaccines">Vaccines</option>
                                    <option value="Consumables">Consumables</option>
                                    <option value="Equipment">Equipment</option>
                                </select>
                            </div>
                        </div>
                        
                        <!-- Supplier -->
                        <div>
                            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Supplier</label>
                            <input type="text" id="supplier" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500" placeholder="Enter supplier name...">
                        </div>
                        
                        <!-- Damaged Delivery Checkbox -->
                        <div class="bg-red-50 border border-red-100 rounded-xl p-4">
                            <label class="flex items-start gap-3 cursor-pointer">
                                <input type="checkbox" id="damaged-delivery" class="mt-1 w-4 h-4 text-red-600 border-red-300 rounded focus:ring-red-500">
                                <div>
                                    <p class="text-sm font-semibold text-red-700">Trigger Handle Damaged Delivery</p>
                                    <p class="text-xs text-red-500 mt-1">Check this if the shipment arrived compromised.</p>
                                </div>
                            </label>
                        </div>
                    </div>
                    
                    <!-- Modal Footer -->
                    <div class="px-6 pb-6">
                        <button onclick="commitRegistration()" class="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                            COMMIT REGISTRATION
                        </button>
                    </div>
                </div>
            </div>`;
    },

    // Modal: Generate Purchase Order (UC1.1)
    generatePOModal: () => {
        const suppliers = DB.getSuppliers();
        return `
            <div id="generate-po-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
                <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
                    <!-- Modal Header -->
                    <div class="bg-slate-800 px-6 py-4 flex items-center justify-between">
                        <h3 class="text-white font-semibold text-lg"><i class="fas fa-file-invoice mr-2"></i>Generate Purchase Order</h3>
                        <button onclick="hideModal('generate-po-modal')" class="text-white hover:text-gray-300 transition">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    
                    <!-- Modal Body -->
                    <div class="p-6 space-y-5">
                        <!-- API Transmission Notice -->
                        <div class="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-center gap-3">
                            <i class="fas fa-satellite-dish text-blue-600"></i>
                            <p class="text-sm text-blue-700 font-medium">Will be transmitted to Supplier API</p>
                        </div>
                        
                        <!-- Supplier Vendor -->
                        <div>
                            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Supplier Vendor</label>
                            <select id="po-supplier" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500">
                                <option value="">Select supplier...</option>
                                ${suppliers.map(s => `<option value="${s}">${s}</option>`).join('')}
                                <option value="new">+ Add New Supplier</option>
                            </select>
                        </div>
                        
                        <!-- Item Name -->
                        <div>
                            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Item Name</label>
                            <input type="text" id="po-item" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500" placeholder="Enter item name (e.g., Surgical Masks N95)">
                        </div>
                        
                        <!-- Order Quantity and Priority Row -->
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Order Quantity</label>
                                <input type="number" id="po-quantity" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500" placeholder="0" min="1">
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Priority</label>
                                <select id="po-priority" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500">
                                    <option value="normal">Normal</option>
                                    <option value="high">High (Emergency Restock)</option>
                                    <option value="critical">Critical (Urgent)</option>
                                </select>
                            </div>
                        </div>
                        
                        <!-- Notes -->
                        <div>
                            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Notes (Optional)</label>
                            <textarea id="po-notes" rows="2" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500" placeholder="Additional requirements or instructions..."></textarea>
                        </div>
                    </div>
                    
                    <!-- Modal Footer -->
                    <div class="px-6 pb-6">
                        <button onclick="transmitPO()" class="w-full bg-slate-800 text-white py-4 rounded-xl font-semibold text-lg hover:bg-slate-900 transition shadow-lg">
                            TRANSMIT
                        </button>
                    </div>
                </div>
            </div>`;
    },

    // Modal: Log Item Usage (UC2.1/UC2.2)
    logUsageModal: () => {
        const inventory = DB.getInventory ? DB.getInventory() : [];
        return `
            <div id="log-usage-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
                <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
                    <!-- Modal Header -->
                    <div class="bg-indigo-600 px-6 py-4 flex items-center justify-between">
                        <h3 class="text-white font-semibold text-lg">Log Item Usage</h3>
                        <button onclick="hideModal('log-usage-modal')" class="text-white hover:text-indigo-200 transition">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    
                    <!-- Modal Body -->
                    <div class="p-6 space-y-5">
                        <!-- Usage Context -->
                        <div>
                            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Usage Context</label>
                            <select id="usage-context" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-indigo-500">
                                <option value="UC2.1">Dispense Prescription (Pharmacy)</option>
                                <option value="UC2.2">Log Internal Usage (Treatment Room)</option>
                            </select>
                        </div>
                        
                        <!-- Select Item -->
                        <div>
                            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Select Item</label>
                            <select id="usage-item" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-indigo-500">
                                <option value="">Select item...</option>
                                ${inventory.slice(0, 5).map(item => `<option value="${item.id}">${item.itemName} (#${item.batchId})</option>`).join('')}
                                <option value="PAR500">Paracetamol 500mg (#B-1092)</option>
                                <option value="SYR5ML">Disposable Syringe 5ml (#B-2045)</option>
                                <option value="MASKN95">Surgical Mask N95 (#B-3012)</option>
                            </select>
                        </div>
                        
                        <!-- Qty Deducted and Actor Row -->
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Qty Deducted</label>
                                <input type="number" id="usage-qty" value="1" min="1" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-indigo-500">
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Actor</label>
                                <input type="text" id="usage-actor" value="Clinic Staff" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-indigo-500">
                            </div>
                        </div>
                        
                        <!-- Patient/Usage ID (conditional based on context) -->
                        <div>
                            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2" id="usage-id-label">Prescription ID</label>
                            <input type="text" id="usage-ref-id" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-indigo-500" placeholder="e.g., Rx-2024-4501">
                        </div>
                    </div>
                    
                    <!-- Modal Footer -->
                    <div class="px-6 pb-6">
                        <button onclick="verifyAndDeduct()" class="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
                            VERIFY & DEDUCT
                        </button>
                    </div>
                </div>
            </div>`;
    },

    // Modal: Request High-Value Asset (UC2.5)
    requestHighValueModal: () => {
        return `
            <div id="request-high-value-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
                <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
                    <!-- Modal Header -->
                    <div class="bg-purple-600 px-6 py-4 flex items-center justify-between">
                        <h3 class="text-white font-semibold text-lg"><i class="fas fa-lock mr-2"></i>Request High-Value Asset</h3>
                        <button onclick="hideModal('request-high-value-modal')" class="text-white hover:text-purple-200 transition">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    
                    <!-- Modal Body -->
                    <div class="p-6 space-y-5">
                        <!-- Authorization Notice -->
                        <div class="bg-purple-50 border border-purple-100 rounded-lg p-4 flex items-start gap-3">
                            <i class="fas fa-info-circle text-purple-600 mt-0.5"></i>
                            <p class="text-sm text-purple-700">This request will require <strong>Authorization</strong> by the Head Doctor.</p>
                        </div>
                        
                        <!-- Restricted Asset -->
                        <div>
                            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Restricted Asset</label>
                            <select id="high-value-item" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-purple-500">
                                <option value="">Select restricted asset...</option>
                                <option value="MORPHINE10">Morphine Sulfate 10mg/ml</option>
                                <option value="FENTANYL50">Fentanyl 50mcg/ml</option>
                                <option value="OXYCODONE">Oxycodone 5mg</option>
                                <option value="MIDAZOLAM">Midazolam 5mg/ml</option>
                                <option value="KETAMINE">Ketamine 50mg/ml</option>
                                <option value="PROPOFOL">Propofol 10mg/ml</option>
                            </select>
                        </div>
                        
                        <!-- Quantity -->
                        <div>
                            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Quantity Required</label>
                            <input type="number" id="high-value-qty" value="1" min="1" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-purple-500">
                        </div>
                        
                        <!-- Clinical Justification -->
                        <div>
                            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Clinical Justification</label>
                            <textarea id="clinical-justification" rows="4" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-purple-500" placeholder="Required for audit purposes..."></textarea>
                        </div>
                    </div>
                    
                    <!-- Modal Footer -->
                    <div class="px-6 pb-6">
                        <button onclick="submitAuthorization()" class="w-full bg-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-purple-700 transition shadow-lg shadow-purple-200">
                            SUBMIT FOR AUTHORIZATION
                        </button>
                    </div>
                </div>
            </div>`;
    },

    // Subsystem 3: Restock Warning
    quality: (role) => {
        const expiryItems = DB.getInventory ? DB.getInventory().filter(i => {
            const daysToExpiry = Math.ceil((new Date(i.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
            return daysToExpiry <= 10 && daysToExpiry > 0;
        }) : [];
        const lowStockItems = DB.getInventory ? DB.getInventory().filter(i => i.quantity <= 50 || i.status === 'Low Stock') : [];

        return `
            <!-- Header -->
            <div class="mb-6">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-xl font-semibold text-gray-900">Restock Warning</h2>
                        <p class="text-sm text-gray-500 mt-1">Manage expiry flags, low stock alerts, and emergency restocking.</p>
                    </div>
                    
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- UC3.1: Expiry Flags -->
                <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div class="px-6 py-4 border-b border-red-100 bg-red-50 flex items-center gap-2">
                        <i class="fas fa-calendar-times text-red-600"></i>
                        <h3 class="font-semibold text-gray-900">Expiry Flags (Auto Timer)</h3>
                    </div>
                    <div class="p-6 space-y-4">
                        ${expiryItems.length === 0 ? `
                            <p class="text-sm text-gray-500 text-center py-4">No items expiring soon</p>
                        ` : expiryItems.map(item => {
                            const daysLeft = Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
                            return `
                                <div class="flex items-center justify-between p-4 bg-red-50 border border-red-100 rounded-lg">
                                    <div>
                                        <p class="font-medium text-gray-900">${item.itemName}</p>
                                        <p class="text-xs text-red-600 mt-1">Expires in ${daysLeft} Day(s)!</p>
                                    </div>
                                    <button onclick="showToast('Waste logging opened', 'info')" class="px-3 py-1.5 bg-white border border-red-200 text-red-700 text-xs font-medium rounded hover:bg-red-50">
                                        Log Waste
                                    </button>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <!-- Low Stock Alerts -->
                <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div class="px-6 py-4 border-b border-amber-100 bg-amber-50 flex items-center gap-2">
                        <i class="fas fa-box-open text-amber-600"></i>
                        <h3 class="font-semibold text-gray-900">Low Stock Alerts</h3>
                        <span class="ml-auto text-xs bg-amber-200 text-amber-800 px-2 py-1 rounded-full font-semibold">${lowStockItems.length} items</span>
                    </div>
                    <div class="p-6 space-y-4 max-h-[400px] overflow-y-auto">
                        ${lowStockItems.length === 0 ? `
                            <p class="text-sm text-gray-500 text-center py-4">No low stock items</p>
                        ` : lowStockItems.map(item => `
                            <div class="flex items-center justify-between p-4 bg-amber-50 border border-amber-100 rounded-lg">
                                <div>
                                    <p class="font-medium text-gray-900">${item.itemName}</p>
                                    <p class="text-xs text-amber-600 mt-1">Only ${item.quantity} units remaining</p>
                                </div>
                                <span class="text-xs font-medium ${item.quantity < 20 ? 'text-red-600 bg-red-100' : 'text-amber-600 bg-amber-100'} px-2 py-1 rounded">
                                    ${item.quantity < 20 ? 'CRITICAL' : 'LOW'}
                                </span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            ${Views.emergencyRestockModal()}`;
    },

    // Modal: Emergency Restock
    emergencyRestockModal: () => {
        const inventory = DB.getInventory ? DB.getInventory() : [];
        const suppliers = DB.getSuppliers ? DB.getSuppliers() : [];
        return `
            <div id="emergency-restock-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
                <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
                    <!-- Modal Header -->
                    <div class="bg-red-600 px-6 py-4 flex items-center justify-between">
                        <h3 class="text-white font-semibold text-lg"><i class="fas fa-exclamation-circle mr-2"></i>Emergency Restock</h3>
                        <button onclick="hideModal('emergency-restock-modal')" class="text-white hover:text-red-200 transition">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    
                    <!-- Modal Body -->
                    <div class="p-6 space-y-5">
                        <!-- Urgency Level -->
                        <div>
                            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Urgency Level <span class="text-red-500">*</span></label>
                            <select id="restock-urgency" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-red-500">
                                <option value="critical">Critical - Immediate (24h)</option>
                                <option value="high">High - Urgent (48h)</option>
                                <option value="medium">Medium - Priority (72h)</option>
                            </select>
                        </div>
                        
                        <!-- Select Item -->
                        <div>
                            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Item Required <span class="text-red-500">*</span></label>
                            <select id="restock-item" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-red-500">
                                <option value="">Select item...</option>
                                ${inventory.filter(i => i.quantity <= 100).map(item => `<option value="${item.id || item.batchId}">${item.itemName} (${item.quantity} left)</option>`).join('')}
                            </select>
                        </div>
                        
                        <!-- Quantity Needed -->
                        <div>
                            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Quantity Needed <span class="text-red-500">*</span></label>
                            <input type="number" id="restock-qty" min="1" value="100" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-red-500">
                        </div>
                        
                        <!-- Preferred Supplier -->
                        <div>
                            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Preferred Supplier</label>
                            <select id="restock-supplier" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-red-500">
                                <option value="">Any available supplier...</option>
                                ${suppliers.map(s => `<option value="${s}">${s}</option>`).join('')}
                            </select>
                        </div>
                        
                        <!-- Justification -->
                        <div>
                            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Justification / Reason <span class="text-red-500">*</span></label>
                            <textarea id="restock-justification" rows="3" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-red-500" placeholder="Explain why this item needs emergency restocking..."></textarea>
                        </div>
                    </div>
                    
                    <!-- Modal Footer -->
                    <div class="px-6 pb-6">
                        <button onclick="triggerEmergencyRestock()" class="w-full bg-red-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-red-700 transition shadow-lg shadow-red-200">
                            <i class="fas fa-paper-plane mr-2"></i>TRIGGER EMERGENCY REQUEST
                        </button>
                    </div>
                </div>
            </div>`;
    },

    // Modal: Log Waste Form (Pharmacist)
    logWasteModal: () => {
        const inventory = DB.getInventory ? DB.getInventory() : [];
        return `
            <div id="log-waste-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
                <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
                    <!-- Modal Header -->
                    <div class="bg-blue-600 px-6 py-4 flex items-center justify-between">
                        <h3 class="text-white font-semibold text-lg"><i class="fas fa-trash-alt mr-2"></i>Log Waste Form</h3>
                        <button onclick="hideModal('log-waste-modal')" class="text-white hover:text-blue-200 transition">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    
                    <!-- Modal Body -->
                    <div class="p-6 space-y-5">
                        <!-- Select Item -->
                        <div>
                            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Item <span class="text-red-500">*</span></label>
                            <select id="waste-item" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500">
                                <option value="">Select item...</option>
                                ${inventory.map(item => `<option value="${item.id}" data-name="${item.itemName}">${item.itemName} (${item.quantity} in stock)</option>`).join('')}
                            </select>
                        </div>
                        
                        <!-- Quantity -->
                        <div>
                            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Quantity to Dispose <span class="text-red-500">*</span></label>
                            <input type="number" id="waste-qty" min="1" value="1" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500">
                        </div>
                        
                        <!-- Reason -->
                        <div>
                            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Reason <span class="text-red-500">*</span></label>
                            <select id="waste-reason" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500">
                                <option value="">Select reason...</option>
                                <option value="Expired">Expired</option>
                                <option value="Contamination">Contamination</option>
                                <option value="Cold Chain Breach">Cold Chain Breach</option>
                                <option value="Damaged">Damaged</option>
                                <option value="Spillage">Spillage</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        
                        <!-- Disposal Method -->
                        <div>
                            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Disposal Method <span class="text-red-500">*</span></label>
                            <select id="waste-method" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500">
                                <option value="">Select method...</option>
                                <option value="Incineration">Incineration</option>
                                <option value="Hazardous Waste">Hazardous Waste</option>
                                <option value="Biohazard Disposal">Biohazard Disposal</option>
                                <option value="General Waste">General Waste</option>
                                <option value="Recycling">Recycling</option>
                            </select>
                        </div>
                        
                        <!-- Notes -->
                        <div>
                            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Additional Notes</label>
                            <textarea id="waste-notes" rows="3" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500" placeholder="Optional details about the wastage..."></textarea>
                        </div>
                    </div>
                    
                    <!-- Modal Footer -->
                    <div class="px-6 pb-6">
                        <button onclick="logNewWaste()" class="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                            <i class="fas fa-save mr-2"></i>SUBMIT LOG
                        </button>
                    </div>
                </div>
            </div>`;
    },

    // Modal: Edit Disposal Log (Manager Only)
    editDisposalModal: () => {
        return `
            <div id="edit-disposal-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
                <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
                    <!-- Modal Header -->
                    <div class="bg-slate-800 px-6 py-4 flex items-center justify-between">
                        <h3 class="text-white font-semibold text-lg"><i class="fas fa-edit mr-2"></i>Edit Disposal Log</h3>
                        <button onclick="hideModal('edit-disposal-modal')" class="text-white hover:text-slate-300 transition">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    
                    <!-- Modal Body -->
                    <div class="p-6 space-y-5">
                        <input type="hidden" id="edit-disposal-id">
                        
                        <!-- Item (Read-only) -->
                        <div>
                            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Item</label>
                            <input type="text" id="edit-disposal-item" readonly class="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-600">
                        </div>
                        
                        <!-- Quantity -->
                        <div>
                            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Quantity <span class="text-red-500">*</span></label>
                            <input type="number" id="edit-disposal-qty" min="1" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-slate-500">
                        </div>
                        
                        <!-- Reason -->
                        <div>
                            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Reason <span class="text-red-500">*</span></label>
                            <select id="edit-disposal-reason" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-slate-500">
                                <option value="Expired">Expired</option>
                                <option value="Contamination">Contamination</option>
                                <option value="Cold Chain Breach">Cold Chain Breach</option>
                                <option value="Damaged">Damaged</option>
                                <option value="Spillage">Spillage</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        
                        <!-- Disposal Method -->
                        <div>
                            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Disposal Method <span class="text-red-500">*</span></label>
                            <select id="edit-disposal-method" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-slate-500">
                                <option value="Incineration">Incineration</option>
                                <option value="Hazardous Waste">Hazardous Waste</option>
                                <option value="Biohazard Disposal">Biohazard Disposal</option>
                                <option value="General Waste">General Waste</option>
                                <option value="Recycling">Recycling</option>
                            </select>
                        </div>
                        
                        <!-- Status -->
                        <div>
                            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Status <span class="text-red-500">*</span></label>
                            <select id="edit-disposal-status" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-slate-500">
                                <option value="Pending Approval">Pending Approval</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                        
                        <!-- Notes -->
                        <div>
                            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Additional Notes</label>
                            <textarea id="edit-disposal-notes" rows="3" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-slate-500" placeholder="Optional details..."></textarea>
                        </div>
                    </div>
                    
                    <!-- Modal Footer -->
                    <div class="px-6 pb-6">
                        <button onclick="saveDisposalEdit()" class="w-full bg-slate-800 text-white py-4 rounded-xl font-semibold text-lg hover:bg-slate-900 transition shadow-lg shadow-slate-200">
                            <i class="fas fa-save mr-2"></i>SAVE CHANGES
                        </button>
                    </div>
                </div>
            </div>`;
    },

    // Modal: Disposal Report (Manager Only)
    disposalReportModal: () => {
        return `
            <div id="disposal-report-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
                <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">
                    <!-- Modal Header -->
                    <div class="bg-slate-800 px-6 py-4 flex items-center justify-between">
                        <h3 class="text-white font-semibold text-lg"><i class="fas fa-file-alt mr-2"></i>Wastage & Disposal Report</h3>
                        <button onclick="hideModal('disposal-report-modal')" class="text-white hover:text-slate-300 transition">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    
                    <!-- Modal Body -->
                    <div class="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                        <!-- Report Period -->
                        <div class="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                            <div>
                                <p class="text-xs text-gray-500 uppercase">Reporting Period</p>
                                <p class="text-lg font-semibold text-gray-900" id="report-period">February 2026</p>
                            </div>
                            <div class="text-right">
                                <p class="text-xs text-gray-500 uppercase">Generated On</p>
                                <p class="text-sm font-medium text-gray-900" id="report-generated">${new Date().toLocaleDateString('en-GB')}</p>
                            </div>
                        </div>
                        
                        <!-- Summary Cards -->
                        <div class="grid grid-cols-3 gap-4">
                            <div class="p-4 bg-red-50 rounded-xl border border-red-100">
                                <p class="text-xs text-red-600 uppercase font-semibold">Total Loss</p>
                                <p class="text-2xl font-bold text-red-700" id="report-total-loss">RM 14,250.00</p>
                            </div>
                            <div class="p-4 bg-amber-50 rounded-xl border border-amber-100">
                                <p class="text-xs text-amber-600 uppercase font-semibold">Pending</p>
                                <p class="text-2xl font-bold text-amber-700" id="report-pending">0</p>
                            </div>
                            <div class="p-4 bg-green-50 rounded-xl border border-green-100">
                                <p class="text-xs text-green-600 uppercase font-semibold">Completed</p>
                                <p class="text-2xl font-bold text-green-700" id="report-completed">0</p>
                            </div>
                        </div>
                        
                        <!-- Breakdown by Reason -->
                        <div>
                            <h4 class="font-semibold text-gray-900 mb-3">Breakdown by Reason</h4>
                            <div id="report-reason-breakdown" class="space-y-2">
                                <!-- Populated by JS -->
                            </div>
                        </div>
                        
                        <!-- All Logs Table -->
                        <div>
                            <h4 class="font-semibold text-gray-900 mb-3">All Disposal Logs</h4>
                            <div class="border rounded-xl overflow-hidden">
                                <table class="w-full text-sm">
                                    <thead class="bg-slate-50"><tr><th class="px-3 py-2 text-left text-xs font-semibold text-gray-500">ID</th><th class="px-3 py-2 text-left text-xs font-semibold text-gray-500">Item</th><th class="px-3 py-2 text-left text-xs font-semibold text-gray-500">Reason</th><th class="px-3 py-2 text-left text-xs font-semibold text-gray-500">Status</th></tr></thead>
                                    <tbody id="report-logs-table" class="divide-y divide-gray-100">
                                        <!-- Populated by JS -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Modal Footer -->
                    <div class="px-6 py-4 bg-gray-50 flex gap-3">
                        <button onclick="downloadDisposalReportCSV()" class="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition">
                            <i class="fas fa-file-csv mr-2"></i>Download CSV
                        </button>
                        <button onclick="hideModal('disposal-report-modal')" class="flex-1 bg-slate-800 text-white py-3 rounded-xl font-semibold hover:bg-slate-900 transition">
                            <i class="fas fa-times mr-2"></i>Close
                        </button>
                    </div>
                </div>
            </div>`;
    }
};
