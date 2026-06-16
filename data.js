// CIMS Database - JSON Data Store
const CIMS_DB = {
    users: {
        manager: {
            id: 'USR-001',
            name: 'Syaeeda Khanum',
            role: 'Head of Clinic',
            avatar: 'SK',
            email: 'syaeeda@clinic.com',
            department: 'Administration'
        },
        pharmacist: {
            id: 'USR-002',
            name: 'Danish Faris',
            role: 'Pharmacist',
            avatar: 'AL',
            email: 'danish@clinic.com',
            department: 'Pharmacy'
        }
    },

    stats: {
        manager: {
            totalBatches: 1248,
            totalBatchesChange: '+12%',
            availableItems: 912,
            expiringUnits: 42,
            wastage: 5.2,
            wastageChange: '-2%'
        },
        pharmacist: {
            todayDispensing: 47,
            pendingOrders: 12,
            lowStockAlerts: 8
        }
    },

    inventory: [
        {
            batchId: 'BTCH-2248',
            itemName: 'Sputnik V Vaccine',
            supplier: 'Russian Direct Investment Fund',
            category: 'Vaccines',
            expiryDate: '2026-12-12',
            quantity: 1200,
            status: 'Available',
            storage: 'Refrigerated (2-8°C)'
        },
        {
            batchId: 'BTCH-1102',
            itemName: 'Disposable Syringes 5ml',
            supplier: 'MedLogistics Ltd',
            category: 'Consumables',
            expiryDate: '2028-01-05',
            quantity: 10000,
            status: 'Available',
            storage: 'Room Temperature'
        },
        {
            batchId: 'BTCH-551',
            itemName: 'Paracetamol IV 1g',
            supplier: 'PharmaCorp International',
            category: 'Medication',
            expiryDate: '2026-08-15',
            quantity: 500,
            status: 'Available',
            storage: 'Room Temperature'
        },
        {
            batchId: 'BTCH-980',
            itemName: 'Surgical Gloves (Size M)',
            supplier: 'MedSupply Co',
            category: 'Consumables',
            expiryDate: '2027-03-20',
            quantity: 2000,
            status: 'Low Stock',
            storage: 'Room Temperature'
        },
        {
            batchId: 'BTCH-3341',
            itemName: 'Amoxicillin 250mg',
            supplier: 'Global Pharma',
            category: 'Medication',
            expiryDate: '2025-10-20',
            quantity: 120,
            status: 'Expiring Soon',
            storage: 'Room Temperature'
        },
        {
            batchId: 'BTCH-1987',
            itemName: 'Insulin Vial',
            supplier: 'DiabCare Inc',
            category: 'Medication',
            expiryDate: '2025-06-30',
            quantity: 8,
            status: 'Critical',
            storage: 'Refrigerated (2-8°C)'
        },
        {
            batchId: 'BTCH-7721',
            itemName: 'Tetanus Vaccine (TV-901)',
            supplier: 'VaxGlobal Ltd',
            category: 'Vaccines',
            expiryDate: '2026-06-20',
            quantity: 45,
            status: 'Expiring Soon',
            storage: 'Refrigerated (2-8°C)'
        },
        {
            batchId: 'BTCH-8842',
            itemName: 'Surgical Sutures 3-0',
            supplier: 'SurgiTech Co',
            category: 'Consumables',
            expiryDate: '2026-06-18',
            quantity: 150,
            status: 'Expiring Soon',
            storage: 'Room Temperature'
        },
        {
            batchId: 'BTCH-9953',
            itemName: 'Lidocaine 2% Injection',
            supplier: 'Anesthesia Plus',
            category: 'Medication',
            expiryDate: '2026-06-22',
            quantity: 30,
            status: 'Expiring Soon',
            storage: 'Room Temperature'
        }
    ],

    allocations: [
        {
            requestId: 'REQ-01-MED-543',
            department: 'Emergency Ward A',
            item: 'Paracetamol IV 1g',
            batchRef: 'BTCH-551',
            quantity: 50,
            requestedBy: 'Dr. Qistina L.',
            status: 'Allocated',
            timeAgo: '2 hours ago'
        },
        {
            requestId: 'REQ-02-MED-441',
            department: 'Outpatient Surgery',
            item: 'Surgical Gloves (Size M)',
            batchRef: 'BTCH-980',
            quantity: 200,
            requestedBy: 'Dr. James Chen',
            status: 'Pending',
            timeAgo: '4 hours ago'
        },
        {
            requestId: 'REQ-PHARM-123',
            department: 'Pharmacy Department',
            item: 'Paracetamol 500mg',
            batchRef: 'BTCH-2248',
            quantity: 500,
            requestedBy: 'Danish Faris',
            status: 'Active',
            remaining: 342,
            timeAgo: '1 day ago'
        }
    ],

    alerts: [
        {
            id: 'ALT-001',
            type: 'critical',
            title: 'Vax-Batch #862 expired',
            message: 'Requires disposal: Ward 3',
            icon: 'syringe',
            bgColor: 'red',
            action: 'TRANSFER TO DISPOSAL'
        },
        {
            id: 'ALT-002',
            type: 'warning',
            title: 'Temp Spike: Fridge 04',
            message: '+2°C variation detected',
            icon: 'thermometer-half',
            bgColor: 'amber',
            action: 'MARK AS PRIORITY USE'
        },
        {
            id: 'ALT-003',
            type: 'info',
            title: 'New Shipment Arrived',
            message: 'Pending registration: 500 units',
            icon: 'truck',
            bgColor: 'blue',
            action: null
        },
        {
            id: 'ALT-004',
            type: 'warning',
            title: 'Amoxicillin 250mg - BTCH-3341',
            message: 'Expires in 15 days • 120 units remaining',
            icon: 'pills',
            bgColor: 'amber'
        },
        {
            id: 'ALT-005',
            type: 'critical',
            title: 'Insulin Vial - BTCH-1987',
            message: 'Expires in 5 days • 8 units remaining',
            icon: 'capsules',
            bgColor: 'red'
        },
        {
            id: 'ALT-006',
            type: 'critical',
            title: 'AstraZeneca Covid Batch #V-881',
            message: 'Expires in 3 days • Main Pharmacy Cold Storage',
            icon: 'syringe',
            bgColor: 'red',
            action: 'TRANSFER TO DISPOSAL'
        },
        {
            id: 'ALT-007',
            type: 'warning',
            title: 'Saline Solution 500ml (Batch #S-11)',
            message: 'Expires in 22 days • Ward 2 Supply Closet',
            icon: 'flask',
            bgColor: 'amber',
            action: 'MARK AS PRIORITY USE'
        }
    ],

    disposal: {
        summary: {
            period: 'February 2026',
            totalLoss: 'RM 14,250.00'
        },
        logs: [
            {
                disposalId: 'DSP-0001',
                item: 'Sinovac Vaccine (40 vials)',
                reason: 'Expired',
                method: 'Incineration',
                status: 'Completed',
                date: '2026-02-10'
            },
            {
                disposalId: 'DSP-0002',
                item: 'Contaminated Surgical Kits',
                reason: 'Contamination',
                method: 'Hazardous Waste',
                status: 'Pending Approval',
                date: '2026-02-14'
            },
            {
                disposalId: 'DSP-0003',
                item: 'Damaged Insulin Vials',
                reason: 'Cold Chain Breach',
                method: 'Biohazard Disposal',
                status: 'Completed',
                date: '2026-02-08'
            }
        ]
    },

    dispensing: {
        queue: [
            { patient: 'John Doe', initials: 'JD', medication: 'Paracetamol 500mg x30', time: '10:30 AM', color: 'blue' },
            { patient: 'Jane Smith', initials: 'JS', medication: 'Amoxicillin 250mg x14', time: '10:45 AM', color: 'green' },
            { patient: 'Robert Johnson', initials: 'RJ', medication: 'Ibuprofen 400mg x20', time: '11:00 AM', color: 'purple' },
            { patient: 'Nurin Qistina', initials: 'SL', medication: 'Metformin 500mg x60', time: '11:15 AM', color: 'pink' }
        ],
        logs: [
            { item: 'Paracetamol 500mg', type: 'prescription', prescriptionId: 'RX-2024-8892', actor: 'Pharmacist Danish', time: '10:30 AM', qty: '-30' },
            { item: 'Ibuprofen 400mg', type: 'internal', usageId: 'USE-TR-4421', actor: 'Nurse Qistina', time: '09:15 AM', qty: '-20' },
            { item: 'Amoxicillin 250mg', type: 'prescription', prescriptionId: 'RX-2024-8891', actor: 'Pharmacist Danish', time: 'Yesterday', qty: '-14' },
            { item: 'Metformin 500mg', type: 'internal', usageId: 'USE-WR-1155', actor: 'Dr. James', time: 'Yesterday', qty: '-60' }
        ]
    },

    staff: [
        { id: 'STF-001', name: 'Syaeeda Khanum', email: 'syaeeda@clinic.com', role: 'Head of Clinic', department: 'Administration', status: 'Active', initials: 'SK', color: 'blue' },
        { id: 'STF-002', name: 'Danish Faris', email: 'danish@clinic.com', role: 'Pharmacist', department: 'Pharmacy', status: 'Active', initials: 'AL', color: 'purple' },
        { id: 'STF-003', name: 'Nurin Qistina', email: 'qistina@clinic.com', role: 'Nurse', department: 'Ward A', status: 'Active', initials: 'SL', color: 'pink' },
        { id: 'STF-004', name: 'James Chen', email: 'james@clinic.com', role: 'Doctor', department: 'Surgery', status: 'Active', initials: 'JC', color: 'green' }
    ],

    chartData: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        data: [45, 65, 55, 80, 70, 40, 35]
    },

    permissions: {
        manager: ['dashboard', 'procurement', 'allocation', 'expiry', 'disposal', 'staff', 'settings', 'authorization', 'quality'],
        pharmacist: ['dashboard', 'allocation', 'expiry', 'disposal', 'settings', 'quality']
    },

    // High-Value Authorization Requests (UC2.6)
    authorizationRequests: [
        {
            id: 'REQ-992',
            item: 'Morphine Sulfate 10mg/ml',
            itemCode: 'MORPHINE10',
            quantity: 5,
            requestedBy: 'Dr. Amran',
            department: 'Trauma Ward',
            justification: 'Severe trauma patient, requires immediate pain management post-surgery. Patient ID: PT-8821',
            requestedAt: '2024-06-15 14:30',
            status: 'pending'
        }
    ]
};

// Utility functions for data manipulation
const DB = {
    getUser: (role) => CIMS_DB.users[role],
    getStats: (role) => CIMS_DB.stats[role],
    getInventory: () => CIMS_DB.inventory,
    getAllocations: (role) => {
        if (role === 'manager') return CIMS_DB.allocations;
        return CIMS_DB.allocations.filter(a => a.department === 'Pharmacy Department');
    },
    getAlerts: (role) => {
        if (role === 'manager') return CIMS_DB.alerts.slice(0, 3);
        return CIMS_DB.alerts.filter(a => a.id === 'ALT-004' || a.id === 'ALT-005');
    },
    getDisposal: () => CIMS_DB.disposal,
    getDispensingQueue: () => CIMS_DB.dispensing.queue,
    getDispensingLogs: () => CIMS_DB.dispensing.logs,
    getStaff: () => CIMS_DB.staff,
    getChartData: () => CIMS_DB.chartData,
    hasPermission: (role, view) => CIMS_DB.permissions[role].includes(view),
    getPermissions: (role) => CIMS_DB.permissions[role] || [],
    getCategories: () => [...new Set(CIMS_DB.inventory.map(i => i.category))],
    getSuppliers: () => [...new Set(CIMS_DB.inventory.map(i => i.supplier))],
    getAuthorizationRequests: () => CIMS_DB.authorizationRequests,
    updateAuthorizationStatus: (requestId, status) => {
        const request = CIMS_DB.authorizationRequests.find(r => r.id === requestId);
        if (request) request.status = status;
        return request;
    },
    // Disposal/Wastage
    addDisposalLog: (log) => {
        if (CIMS_DB && CIMS_DB.disposal && CIMS_DB.disposal.logs) {
            CIMS_DB.disposal.logs.unshift(log);
            // Update total loss (simplified calculation)
            const item = CIMS_DB.inventory.find(i => i.id === log.itemId);
            if (item && item.unitPrice) {
                const loss = item.unitPrice * log.quantity;
                const currentTotal = parseFloat(CIMS_DB.disposal.summary.totalLoss.replace(/[^0-9.]/g, ''));
                CIMS_DB.disposal.summary.totalLoss = `RM ${(currentTotal + loss).toFixed(2)}`;
            }
        }
        return log;
    }
};
