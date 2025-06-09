import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
    ArrowUpDown, 
    MoreVertical, 
    Eye, 
    Trash2, 
    ChevronDown,
    Package2,
    Clock,
    CheckCircle2,
    Truck,
    XCircle,
    Search,
    Download,
    Save,
    Filter,
    X
} from "lucide-react";
import { format, parseISO, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { getOrders, deleteOrder, updateOrder } from "../../services/orderService";
import { getSavedFilters, saveFilter, deleteFilter } from "../../services/filterService";
import BatchOperations from "@/components/BatchOperations";
import ToastNotification from "@/components/ToastNotification";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import useKeyboardShortcuts from "@/hooks/useKeyboardShortcuts";

const statusOptions = ["All", "Pending", "Approved", "Shipped", "Cancelled"];
const pendingApprovalReasonCodes = ["PRICE_DISCREPANCY", "CREDIT_HOLD", "STOCK_SHORTAGE", "CUSTOMER_REQUEST"];

const MultiSelect = ({ options, value, onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleOption = (option) => {
        const newValue = value.includes(option)
            ? value.filter(item => item !== option)
            : [...value, option];
        onChange(newValue);
    };

    const removeOption = (e, option) => {
        e.stopPropagation();
        onChange(value.filter(item => item !== option));
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <div
                className="flex min-h-[40px] cursor-pointer items-center justify-between rounded-lg border border-slate-200 bg-white px-3 text-slate-900 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-700"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex flex-wrap gap-1">
                    {value.length === 0 ? (
                        <span className="text-slate-400 dark:text-slate-500">{placeholder}</span>
                    ) : (
                        value.map((option) => (
                            <span
                                key={option}
                                className="inline-flex items-center gap-x-1 rounded bg-red-50 px-2 py-1 text-sm text-red-700 dark:bg-red-900/50 dark:text-red-300"
                            >
                                {option}
                                <button
                                    type="button"
                                    onClick={(e) => removeOption(e, option)}
                                    className="text-red-700 hover:text-red-900 dark:text-red-300 dark:hover:text-red-100"
                                >
                                    ×
                                </button>
                            </span>
                        ))
                    )}
                </div>
                <ChevronDown size={20} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </div>
            {isOpen && (
                <div className="absolute left-0 right-0 z-50 mt-1 max-h-[200px] overflow-auto rounded-lg border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                    {options.map((option) => (
                        <div
                            key={option}
                            className={`cursor-pointer rounded-md px-2 py-1.5 text-sm ${
                                value.includes(option)
                                    ? "bg-red-500 text-white"
                                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                            }`}
                            onClick={() => toggleOption(option)}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const OrderList = () => {
    const navigate = useNavigate();
    const searchInputRef = useRef(null);
    const [orders, setOrders] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [actionMenuOrder, setActionMenuOrder] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedReasonCodes, setSelectedReasonCodes] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [amountRange, setAmountRange] = useState({ min: "", max: "" });
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [savedFilters, setSavedFilters] = useState([]);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [filterNameInput, setFilterNameInput] = useState('');
    const [showSaveFilterModal, setShowSaveFilterModal] = useState(false);

    useEffect(() => {
        loadOrders();
        setSavedFilters(getSavedFilters());
    }, []);

    const loadOrders = () => {
        const orderData = getOrders();
        setOrders(orderData);
    };

    // Close action menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (actionMenuOrder && !event.target.closest('.action-menu-container')) {
                setActionMenuOrder(null);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [actionMenuOrder]);

    // Calculate summary statistics
    const summary = useMemo(() => {
        return orders.reduce((acc, order) => {
            acc.total++;
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
        }, { total: 0 });
    }, [orders]);

    const handleSaveFilter = () => {
        setShowSaveFilterModal(true);
    };

    const handleSaveFilterConfirm = () => {
        const newFilter = {
            id: Date.now(),
            name: filterNameInput || `Filter ${savedFilters.length + 1}`,
            criteria: {
                status: selectedStatus,
                startDate,
                endDate,
                reasonCodes: selectedReasonCodes,
                amountRange,
                searchTerm
            }
        };
        
        const savedFilter = saveFilter(newFilter);
        setSavedFilters([...savedFilters, savedFilter]);
        setFilterNameInput('');
        setShowSaveFilterModal(false);
        
        setToast({
            show: true,
            message: 'Filter saved successfully',
            type: 'success'
        });
    };

    const handleDeleteFilter = (filterId) => {
        deleteFilter(filterId);
        setSavedFilters(savedFilters.filter(f => f.id !== filterId));
        
        setToast({
            show: true,
            message: 'Filter deleted successfully',
            type: 'success'
        });
    };

    const applyFilter = (filter) => {
        setSelectedStatus(filter.criteria.status);
        setStartDate(filter.criteria.startDate);
        setEndDate(filter.criteria.endDate);
        setSelectedReasonCodes(filter.criteria.reasonCodes);
        setAmountRange(filter.criteria.amountRange);
        setSearchTerm(filter.criteria.searchTerm);
    };

    const exportToCSV = () => {
        const headers = [
            "Order Number",
            "Customer",
            "Transaction Date",
            "Due Date",
            "Status",
            "From Location",
            "To Location",
            "Support Rep",
            "Amount",
            "Pending Approval Reason"
        ];

        const csvData = sortedOrders.map(order => [
            order.orderNumber,
            order.customer,
            formatDate(order.transactionDate),
            formatDate(order.dueDate),
            order.status,
            order.fromLocation,
            order.toLocation,
            order.supportRep,
            order.lines.reduce((sum, line) => sum + line.amount, 0).toFixed(2),
            (order.pendingApprovalReasonCode || []).join(", ")
        ]);
        
        const csv = [headers, ...csvData].map(row => row.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `orders_export_${format(new Date(), "yyyy-MM-dd_HH-mm")}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setToast({
            show: true,
            message: `Successfully exported ${sortedOrders.length} orders`,
            type: 'success'
        });
    };

    // Enhanced filtering with global search and amount range
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            // Status filter
            if (selectedStatus !== "All" && order.status !== selectedStatus) {
                return false;
            }

            // Date range filter
            if (startDate || endDate) {
                const orderDate = new Date(order.transactionDate);
                if (startDate && orderDate < startOfDay(new Date(startDate))) {
                    return false;
                }
                if (endDate && orderDate > endOfDay(new Date(endDate))) {
                    return false;
                }
            }

            // Amount range filter
            const orderAmount = order.lines.reduce((sum, line) => sum + line.amount, 0);
            if (amountRange.min && orderAmount < Number(amountRange.min)) {
                return false;
            }
            if (amountRange.max && orderAmount > Number(amountRange.max)) {
                return false;
            }

            // Pending Approval Reason Code filter
            if (selectedReasonCodes.length > 0) {
                if (!order.pendingApprovalReasonCode.some(code => 
                    selectedReasonCodes.includes(code)
                )) {
                    return false;
                }
            }

            // Global search across multiple fields
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                return (
                    order.orderNumber.toLowerCase().includes(searchLower) ||
                    order.customer.toLowerCase().includes(searchLower) ||
                    order.status.toLowerCase().includes(searchLower) ||
                    order.fromLocation.toLowerCase().includes(searchLower) ||
                    order.toLocation.toLowerCase().includes(searchLower) ||
                    order.supportRep.toLowerCase().includes(searchLower)
                );
            }

            return true;
        });
    }, [orders, selectedStatus, startDate, endDate, selectedReasonCodes, searchTerm, amountRange]);

    // Sort orders based on current sort configuration
    const sortedOrders = useMemo(() => {
        if (!sortConfig.key) return filteredOrders;

        return [...filteredOrders].sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            // Handle amount sorting
            if (sortConfig.key === 'amount') {
                aValue = a.lines.reduce((sum, line) => sum + line.amount, 0);
                bValue = b.lines.reduce((sum, line) => sum + line.amount, 0);
            }

            // Handle date sorting
            if (sortConfig.key === 'transactionDate' || sortConfig.key === 'dueDate') {
                aValue = new Date(aValue).getTime();
                bValue = new Date(bValue).getTime();
            }

            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }, [filteredOrders, sortConfig]);

    const handleSort = (key) => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handleActionClick = (e, order) => {
        e.stopPropagation();
        setActionMenuOrder(actionMenuOrder === order.orderNumber ? null : order.orderNumber);
    };

    const handleView = (orderId) => {
        navigate(`/order/view/${orderId}`);
        setActionMenuOrder(null);
    };

    const handleDelete = (orderId) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            deleteOrder(orderId);
            loadOrders();
            setActionMenuOrder(null);
        }
    };

    const formatDate = (dateString) => {
        try {
            if (!dateString) return '';
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return '';
            return format(date, 'MMM dd, yyyy');
        } catch (error) {
            console.error('Error formatting date:', dateString, error);
            return '';
        }
    };

    // Add batch operation handlers
    const handleBatchStatusUpdate = (orders, newStatus) => {
        // Update each order's status in localStorage
        orders.forEach(order => {
            updateOrder(order.orderNumber, {
                ...order,
                status: newStatus,
                history: [
                    ...order.history || [],
                    {
                        event: `Order ${newStatus.toLowerCase()}`,
                        date: new Date().toISOString(),
                        user: "System"
                    }
                ]
            });
        });

        // Refresh the orders list
        loadOrders();

        // Show success toast
        setToast({
            show: true,
            message: `Successfully updated ${orders.length} orders to ${newStatus}`,
            type: 'success'
        });
        setSelectedOrders([]);
    };

    const handleBatchDelete = (orders) => {
        // Delete each selected order
        orders.forEach(order => {
            deleteOrder(order.orderNumber);
        });

        // Refresh the orders list
        loadOrders();

        // Show success toast
        setToast({
            show: true,
            message: `Successfully deleted ${orders.length} orders`,
            type: 'success'
        });
        setSelectedOrders([]);
    };

    const handleBatchExport = () => {
        const headers = ["Order Number", "Customer", "Transaction Date", "Status", "Amount"];
        const csvData = selectedOrders.map(order => [
            order.orderNumber,
            order.customer,
            order.transactionDate,
            order.status,
            order.lines.reduce((sum, line) => sum + line.amount, 0)
        ]);
        
        const csv = [headers, ...csvData].map(row => row.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "selected_orders.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="container mx-auto space-y-4">
            <h1 className="title">Order List</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="card bg-white p-6 dark:bg-slate-800">
                    <div className="flex items-center gap-x-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/20 text-blue-500">
                            <Package2 size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Total Orders</p>
                            <p className="text-2xl font-semibold text-slate-900 dark:text-white">{summary.total}</p>
                        </div>
                    </div>
                </div>
                <div className="card bg-white p-6 dark:bg-slate-800">
                    <div className="flex items-center gap-x-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-500/20 text-yellow-500">
                            <Clock size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Pending</p>
                            <p className="text-2xl font-semibold text-slate-900 dark:text-white">{summary.Pending || 0}</p>
                        </div>
                    </div>
                </div>
                <div className="card bg-white p-6 dark:bg-slate-800">
                    <div className="flex items-center gap-x-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/20 text-green-500">
                            <CheckCircle2 size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Approved</p>
                            <p className="text-2xl font-semibold text-slate-900 dark:text-white">{summary.Approved || 0}</p>
                        </div>
                    </div>
                </div>
                <div className="card bg-white p-6 dark:bg-slate-800">
                    <div className="flex items-center gap-x-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/20 text-blue-500">
                            <Truck size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Shipped</p>
                            <p className="text-2xl font-semibold text-slate-900 dark:text-white">{summary.Shipped || 0}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Advanced Search and Filters */}
            <div className="card">
                <div className="card-header flex items-center justify-between">
                    <h2 className="card-title">Search & Filters</h2>
                    <div className="flex items-center gap-x-2">
                        <button
                            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                            className="flex items-center gap-x-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                        >
                            <Filter size={16} />
                            {showAdvancedFilters ? "Hide" : "Show"} Advanced Filters
                        </button>
                        <button
                            onClick={handleSaveFilter}
                            className="flex items-center gap-x-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
                        >
                            <Save size={16} />
                            Save Filter
                        </button>
                        <button
                            onClick={exportToCSV}
                            className="flex items-center gap-x-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
                        >
                            <Download size={16} />
                            Export CSV
                        </button>
                    </div>
                </div>
                <div className="card-body space-y-4">
                    <div className="flex items-center gap-x-4">
                        <div className="relative flex-1">
                            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search orders..."
                                className="form-input pl-10"
                            />
                        </div>
                        {savedFilters.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {savedFilters.map(filter => (
                                    <div
                                        key={filter.id}
                                        className="flex items-center gap-x-2 rounded-lg bg-blue-50 px-3 py-1.5 text-sm text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
                                    >
                                        <button
                                            onClick={() => applyFilter(filter)}
                                            className="font-medium hover:underline"
                                        >
                                            {filter.name}
                                        </button>
                                        <button
                                            onClick={() => handleDeleteFilter(filter.id)}
                                            className="rounded-full p-0.5 hover:bg-blue-100 dark:hover:bg-blue-800"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {showAdvancedFilters && (
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                            <div className="form-group">
                                <label>Amount Range</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="number"
                                        value={amountRange.min}
                                        onChange={(e) => setAmountRange(prev => ({ ...prev, min: e.target.value }))}
                                        className="form-input"
                                        placeholder="Min Amount"
                                    />
                                    <input
                                        type="number"
                                        value={amountRange.max}
                                        onChange={(e) => setAmountRange(prev => ({ ...prev, max: e.target.value }))}
                                        className="form-input"
                                        placeholder="Max Amount"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Transaction Date Range</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="form-input"
                                    />
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="form-input"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Pending Approval Reason Code</label>
                                <MultiSelect
                                    options={pendingApprovalReasonCodes}
                                    value={selectedReasonCodes}
                                    onChange={setSelectedReasonCodes}
                                    placeholder="Select reason codes..."
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex flex-wrap gap-2">
                {statusOptions.map((status) => (
                    <button
                        key={status}
                        onClick={() => setSelectedStatus(status)}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                            selectedStatus === status
                                ? "bg-blue-500 text-white"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                        }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Orders Table */}
            <div className="card">
                <div className="card-body p-0">
                    <div className="relative w-full overflow-auto">
                        <table className="table">
                            <thead className="table-header">
                                <tr className="table-row">
                                    <th className="table-head w-[40px]">
                                        <input
                                            type="checkbox"
                                            checked={selectedOrders.length === sortedOrders.length}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedOrders(sortedOrders);
                                                } else {
                                                    setSelectedOrders([]);
                                                }
                                            }}
                                            className="h-4 w-4 rounded border-slate-300"
                                        />
                                    </th>
                                    <th
                                        className="table-head cursor-pointer"
                                        onClick={() => handleSort('orderNumber')}
                                    >
                                        <div className="flex items-center gap-x-2">
                                            Order Number
                                            <ArrowUpDown size={16} />
                                        </div>
                                    </th>
                                    <th
                                        className="table-head cursor-pointer"
                                        onClick={() => handleSort('customer')}
                                    >
                                        <div className="flex items-center gap-x-2">
                                            Customer
                                            <ArrowUpDown size={16} />
                                        </div>
                                    </th>
                                    <th
                                        className="table-head cursor-pointer"
                                        onClick={() => handleSort('transactionDate')}
                                    >
                                        <div className="flex items-center gap-x-2">
                                            Created Date
                                            <ArrowUpDown size={16} />
                                        </div>
                                    </th>
                                    <th
                                        className="table-head cursor-pointer"
                                        onClick={() => handleSort('dueDate')}
                                    >
                                        <div className="flex items-center gap-x-2">
                                            Due Date
                                            <ArrowUpDown size={16} />
                                        </div>
                                    </th>
                                    <th
                                        className="table-head cursor-pointer text-right"
                                        onClick={() => handleSort('amount')}
                                    >
                                        <div className="flex items-center gap-x-2 justify-end">
                                            Amount
                                            <ArrowUpDown size={16} />
                                        </div>
                                    </th>
                                    <th
                                        className="table-head cursor-pointer"
                                        onClick={() => handleSort('status')}
                                    >
                                        <div className="flex items-center gap-x-2">
                                            Status
                                            <ArrowUpDown size={16} />
                                        </div>
                                    </th>
                                    <th className="table-head w-[50px]"></th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {sortedOrders.map((order) => (
                                    <tr
                                        key={order.orderNumber}
                                        className="table-row"
                                    >
                                        <td className="table-cell">
                                            <input
                                                type="checkbox"
                                                checked={selectedOrders.includes(order)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedOrders([...selectedOrders, order]);
                                                    } else {
                                                        setSelectedOrders(selectedOrders.filter(o => o !== order));
                                                    }
                                                }}
                                                className="h-4 w-4 rounded border-slate-300"
                                            />
                                        </td>
                                        <td className="table-cell font-medium">
                                            {order.orderNumber}
                                        </td>
                                        <td className="table-cell">
                                            {order.customer}
                                        </td>
                                        <td className="table-cell">
                                            {formatDate(order.transactionDate)}
                                        </td>
                                        <td className="table-cell">
                                            {formatDate(order.dueDate)}
                                        </td>
                                        <td className="table-cell text-right">
                                            ${order.lines.reduce((sum, line) => sum + line.amount, 0).toFixed(2)}
                                        </td>
                                        <td className="table-cell">
                                            <span className={`inline-block rounded-full px-2 py-1 text-sm ${
                                                order.status === "Pending" ? "bg-yellow-100 text-yellow-600" :
                                                order.status === "Approved" ? "bg-blue-100 text-blue-600" :
                                                    order.status === "Shipped" ? "bg-green-100 text-green-600" :
                                                        order.status === "Delivered" ? "bg-green-100 text-green-600" :
                                                            "bg-red-100 text-red-600"
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="table-cell">
                                            <div className="action-menu-container relative">
                                                <button
                                                    className="btn-ghost rounded-full p-1"
                                                    onClick={(e) => handleActionClick(e, order)}
                                                >
                                                    <MoreVertical size={18} />
                                                </button>
                                                {actionMenuOrder === order.orderNumber && (
                                                    <div className="absolute right-0 top-0 z-[1000] mt-8 w-48 rounded-lg border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                                                        <button
                                                            className="flex w-full items-center gap-x-2 rounded-md px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                                                            onClick={() => handleView(order.orderNumber)}
                                                        >
                                                            <Eye size={16} />
                                                            View Order
                                                        </button>
                                                        <button
                                                            className="flex w-full items-center gap-x-2 rounded-md px-2 py-1.5 text-sm text-red-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                                                            onClick={() => handleDelete(order.orderNumber)}
                                                        >
                                                            <Trash2 size={16} />
                                                            Delete Order
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Batch Operations */}
            <BatchOperations
                selectedOrders={selectedOrders}
                onBatchStatusUpdate={handleBatchStatusUpdate}
                onBatchDelete={handleBatchDelete}
                onBatchExport={handleBatchExport}
            />

            {/* Save Filter Modal */}
            <ConfirmationModal
                isOpen={showSaveFilterModal}
                onClose={() => {
                    setShowSaveFilterModal(false);
                    setFilterNameInput('');
                }}
                onConfirm={handleSaveFilterConfirm}
                title="Save Filter"
                message={
                    <div className="space-y-4">
                        <p>Enter a name for your filter:</p>
                        <input
                            type="text"
                            value={filterNameInput}
                            onChange={(e) => setFilterNameInput(e.target.value)}
                            placeholder="Filter name"
                            className="form-input w-full"
                            autoFocus
                        />
                    </div>
                }
                confirmText="Save"
                confirmButtonClass="bg-blue-500 hover:bg-blue-600"
            />
        </div>
    );
};

export default OrderList; 