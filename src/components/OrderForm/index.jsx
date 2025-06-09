import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { ChevronDown, X, Clock, ArrowRight, Package2, CreditCard, CheckCircle2, Truck, Box, AlertCircle, XCircle } from "lucide-react";

const MultiSelect = ({ options, value, onChange, placeholder, disabled }) => {
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
        if (disabled) return;
        const newValue = value.includes(option)
            ? value.filter(item => item !== option)
            : [...value, option];
        onChange(newValue);
    };

    const removeOption = (e, option) => {
        if (disabled) return;
        e.stopPropagation();
        onChange(value.filter(item => item !== option));
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <div
                className={`flex min-h-[40px] items-center justify-between rounded-lg border border-slate-200 bg-white px-3 text-slate-900 transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50 ${
                    disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
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
                                {!disabled && (
                                    <button
                                        type="button"
                                        onClick={(e) => removeOption(e, option)}
                                        className="text-red-700 hover:text-red-900 dark:text-red-300 dark:hover:text-red-100"
                                    >
                                        ×
                                    </button>
                                )}
                            </span>
                        ))
                    )}
                </div>
                {!disabled && <ChevronDown size={20} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />}
            </div>
            {isOpen && !disabled && (
                <div className="absolute left-0 right-0 z-50 mt-1 max-h-[200px] overflow-auto rounded-lg border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                    {options.map((option) => (
                        <div
                            key={option}
                            className={`cursor-pointer rounded-md px-2 py-1.5 text-sm ${
                                value.includes(option)
                                    ? "bg-blue-500 text-white"
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

const Select = ({ options, value, onChange, placeholder, name, required, disabled }) => {
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

    return (
        <div className="relative" ref={dropdownRef}>
            <div
                className={`flex min-h-[40px] items-center justify-between rounded-lg border border-slate-200 bg-white px-3 text-slate-900 transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50 ${
                    disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                <span className={value ? "text-slate-900 dark:text-slate-50" : "text-slate-400 dark:text-slate-500"}>
                    {value || placeholder}
                </span>
                {!disabled && <ChevronDown size={20} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />}
            </div>
            {isOpen && !disabled && (
                <div className="absolute left-0 right-0 z-50 mt-1 max-h-[200px] overflow-auto rounded-lg border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                    {options.map((option) => (
                        <div
                            key={option}
                            className={`cursor-pointer rounded-md px-2 py-1.5 text-sm ${
                                value === option
                                    ? "bg-blue-500 text-white"
                                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                            }`}
                            onClick={() => {
                                onChange({ target: { name, value: option } });
                                setIsOpen(false);
                            }}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const OrderHistory = ({ history, status }) => {
    if (!history?.length) return null;

    const getEventIcon = (event) => {
        switch (event.toLowerCase()) {
            case "order created":
                return <Package2 size={20} className="text-blue-500" />;
            case "payment received":
                return <CreditCard size={20} className="text-green-500" />;
            case "order approved":
                return <CheckCircle2 size={20} className="text-green-500" />;
            case "shipped":
                return <Truck size={20} className="text-blue-500" />;
            case "delivered":
                return <Box size={20} className="text-green-500" />;
            case "order cancelled":
                return <XCircle size={20} className="text-red-500" />;
            // Special check events
            case "stock check pending":
            case "pending approval (policy review)":
            case "safety compliance check":
            case "verification required":
            case "security check":
                return <AlertCircle size={20} className="text-orange-500" />;
            default:
                return <AlertCircle size={20} className="text-orange-500" />;
        }
    };

    const formatEventDate = (dateStr) => {
        try {
            if (!dateStr) return 'N/A';
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return 'Invalid Date';
            return format(date, 'MMM dd, yyyy HH:mm');
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Invalid Date';
        }
    };

    const isCheckEvent = (event) => {
        const checkEvents = [
            "stock check pending",
            "pending approval (policy review)",
            "safety compliance check",
            "verification required",
            "security check"
        ];
        return checkEvents.some(ce => event.toLowerCase() === ce.toLowerCase());
    };

    const getVisibleEvents = () => {
        if (status === "Cancelled") {
            // For cancelled orders, show all events up to cancellation
            return history;
        }

        const standardFlow = {
            "Pending": ["Order Created", "Payment Received"],
            "Approved": ["Order Created", "Payment Received", "Order Approved"],
            "Shipped": ["Order Created", "Payment Received", "Order Approved", "Shipped"],
            "Delivered": ["Order Created", "Payment Received", "Order Approved", "Shipped", "Delivered"]
        };

        const allowedEvents = standardFlow[status] || [];
        
        return history.filter(event => {
            const eventLower = event.event.toLowerCase();
            
            // Always show check events regardless of status
            if (isCheckEvent(event.event)) {
                return true;
            }

            // Show standard flow events based on current status
            return allowedEvents.some(allowed => 
                eventLower === allowed.toLowerCase()
            );
        });
    };

    const visibleEvents = getVisibleEvents();

    return (
        <div className="card">
            <div className="card-header flex items-center gap-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/20 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                    <Clock size={24} />
                </div>
                <h2 className="card-title">Order History</h2>
            </div>
            <div className="card-body relative p-6">
                <div className="absolute bottom-6 left-10 top-0 w-0.5 bg-slate-200 dark:bg-slate-700" />
                <div className="relative space-y-8">
                    {visibleEvents.map((event, index) => (
                        <div key={index} className="flex items-center gap-x-6">
                            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center">
                                <div className="absolute h-8 w-8 rounded-full bg-white ring-4 ring-white dark:bg-slate-900 dark:ring-slate-900" />
                                <div className="relative z-10">
                                    {getEventIcon(event.event)}
                                </div>
                            </div>
                            <div className="flex min-w-0 flex-1 flex-col">
                                <p className="text-base font-medium text-slate-900 dark:text-slate-100">
                                    {event.event}
                                </p>
                                <time className="text-sm text-slate-500 dark:text-slate-400">
                                    {formatEventDate(event.date || event.timestamp)}
                                </time>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const OrderForm = ({ 
    mode = 'create',
    initialData = {
        orderNumber: "",
        customer: "",
        transactionDate: format(new Date(), "yyyy-MM-dd"),
        status: "Pending",
        fromLocation: "",
        toLocation: "",
        pendingApprovalReasonCode: [],
        supportRep: "",
        incoterm: "",
        freightTerms: "",
        totalShipUnitCount: "",
        totalQuantity: "",
        discountRate: "",
        billingAddress: {
            street: "",
            city: "",
            state: "",
            postalCode: "",
            country: ""
        },
        shippingAddress: {
            street: "",
            city: "",
            state: "",
            postalCode: "",
            country: ""
        },
        earlyPickupDate: "",
        latePickupDate: "",
        lines: [
            {
                item: "",
                units: "",
                quantity: "",
                price: "",
                amount: 0
            }
        ],
        history: []
    },
    onSubmit,
    onCancel
}) => {
    const [formData, setFormData] = useState(initialData);
    const isViewMode = mode === 'view';

    const handleInputChange = (e) => {
        if (isViewMode) return;
        
        const { name, value } = e.target;
        if (name.includes(".")) {
            const [parent, child] = name.split(".");
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleMultiSelect = (newValue) => {
        if (isViewMode) return;
        setFormData(prev => ({
            ...prev,
            pendingApprovalReasonCode: newValue
        }));
    };

    const handleIncotermChange = (value) => {
        if (isViewMode) return;
        setFormData(prev => ({
            ...prev,
            incoterm: value,
            freightTerms: value ? "" : prev.freightTerms
        }));
    };

    const handleLineChange = (index, field, value) => {
        if (isViewMode) return;
        setFormData(prev => {
            const newLines = [...prev.lines];
            newLines[index] = {
                ...newLines[index],
                [field]: field === 'quantity' || field === 'price' ? Number(value) : value,
                amount: field === 'quantity' || field === 'price' 
                    ? (Number(value) || 0) * (field === 'quantity' ? Number(newLines[index].price) : Number(newLines[index].quantity))
                    : newLines[index].amount
            };
            return {
                ...prev,
                lines: newLines
            };
        });
    };

    const addLine = () => {
        if (isViewMode) return;
        setFormData(prev => ({
            ...prev,
            lines: [
                ...prev.lines,
                {
                    item: "",
                    units: "",
                    quantity: "",
                    price: "",
                    amount: 0
                }
            ]
        }));
    };

    const removeLine = (index) => {
        if (isViewMode) return;
        setFormData(prev => ({
            ...prev,
            lines: prev.lines.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isViewMode) return;
        onSubmit?.(formData);
    };

    const renderField = (label, name, type = "text", options = null) => {
        const value = name.includes(".")
            ? formData[name.split(".")[0]][name.split(".")[1]]
            : formData[name];

        if (isViewMode) {
            return (
                <div className="form-group">
                    <label>{label}</label>
                    <div className="form-input-readonly">{value || '-'}</div>
                </div>
            );
        }

        if (type === "select") {
            return (
                <div className="form-group">
                    <label className="required">{label}</label>
                    <Select
                        name={name}
                        value={value}
                        onChange={handleInputChange}
                        options={options}
                        placeholder={`Select ${label.toLowerCase()}...`}
                        required
                        disabled={isViewMode}
                    />
                </div>
            );
        }

        const isNumberInput = ["totalShipUnitCount", "totalQuantity", "discountRate"].includes(name);
        const getInputProps = () => {
            if (!isNumberInput) return {};
            
            const props = {
                type: "number",
                min: "0"
            };

            if (name === "discountRate") {
                props.max = "100";
                props.step = "0.1";
                props.placeholder = "Enter discount percentage (0-100)";
            } else {
                props.step = "1";
                props.placeholder = `Enter ${label.toLowerCase()}`;
            }

            return props;
        };

        return (
            <div className="form-group">
                <label className={type !== "date" ? "required" : ""}>{label}</label>
                <input
                    {...getInputProps()}
                    type={isNumberInput ? "number" : type}
                    name={name}
                    value={value}
                    onChange={handleInputChange}
                    className="form-input"
                    required={type !== "date"}
                    disabled={isViewMode}
                />
                {name === "discountRate" && (
                    <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">Enter percentage between 0-100</span>
                )}
            </div>
        );
    };

    const renderPendingApprovalCodes = () => {
        if (isViewMode) {
            return (
                <div className="form-group">
                    <label>Pending Approval Reason Code</label>
                    <div className="form-input-readonly flex flex-wrap gap-2">
                        {formData.pendingApprovalReasonCode.length > 0 ? (
                            formData.pendingApprovalReasonCode.map((code) => (
                                <span
                                    key={code}
                                    className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-sm text-red-700 dark:bg-red-900/50 dark:text-red-300"
                                >
                                    {code}
                                </span>
                            ))
                        ) : (
                            <span>-</span>
                        )}
                    </div>
                </div>
            );
        }

        return (
            <div className="form-group">
                <div className="flex items-center gap-x-2">
                    <label>Pending Approval Reason Code</label>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">multi-select</span>
                </div>
                <MultiSelect
                    options={["PRICE_DISCREPANCY", "CREDIT_HOLD", "STOCK_SHORTAGE", "CUSTOMER_REQUEST"]}
                    value={formData.pendingApprovalReasonCode}
                    onChange={handleMultiSelect}
                    placeholder="Select reasons..."
                    disabled={isViewMode}
                />
            </div>
        );
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
            <div className="flex items-center justify-between">
                <h1 className="title">{isViewMode ? 'View Order' : 'Create Order'}</h1>
                {isViewMode && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                    >
                        Back to List
                    </button>
                )}
            </div>

            <div className={`flex ${isViewMode ? 'gap-x-6' : 'flex-col gap-y-6'}`}>
                <div className={`flex flex-col gap-y-6 ${isViewMode ? 'w-2/3' : 'w-full'}`}>
                    {/* Basic Information Section */}
                    <div className="card">
                        <div className="card-header">
                            <h2 className="card-title">Basic Information</h2>
                        </div>
                        <div className="card-body grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {renderField("Order Number", "orderNumber")}
                            {renderField("Customer", "customer")}
                            {renderField("Transaction Date", "transactionDate", "date")}
                            {renderField("Status", "status", "select", ["Pending", "Approved", "Shipped", "Cancelled"])}
                            {renderField("From Location", "fromLocation", "select", ["Warehouse A", "Warehouse B", "Warehouse C"])}
                            {renderField("To Location", "toLocation", "select", ["Store A", "Store B", "Store C"])}
                            
                            {renderPendingApprovalCodes()}

                            {renderField("Support Rep", "supportRep")}
                            {renderField("Incoterm", "incoterm", "select", ["EXW", "FCA", "CPT", "CIP", "DAP", "DPU", "DDP"])}
                            {renderField("Freight Terms", "freightTerms", "select", ["Prepaid", "Collect", "Third Party"])}
                            {renderField("Total Ship Unit Count", "totalShipUnitCount")}
                            {renderField("Total Quantity", "totalQuantity")}
                            {renderField("Discount Rate", "discountRate")}
                            {renderField("Early Pickup Date", "earlyPickupDate", "date")}
                            {renderField("Late Pickup Date", "latePickupDate", "date")}
                        </div>
                    </div>

                    {/* Address Section */}
                    <div className="card">
                        <div className="card-header">
                            <h2 className="card-title">Address Information</h2>
                        </div>
                        <div className="card-body grid grid-cols-1 gap-x-6 gap-y-4 lg:grid-cols-2">
                            {/* Billing Address */}
                            <div className="flex flex-col gap-y-4">
                                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-50">Billing Address</h3>
                                {renderField("Street", "billingAddress.street")}
                                <div className="grid grid-cols-2 gap-4">
                                    {renderField("City", "billingAddress.city")}
                                    {renderField("State", "billingAddress.state")}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {renderField("Postal Code", "billingAddress.postalCode")}
                                    {renderField("Country", "billingAddress.country")}
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="flex flex-col gap-y-4">
                                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-50">Shipping Address</h3>
                                {renderField("Street", "shippingAddress.street")}
                                <div className="grid grid-cols-2 gap-4">
                                    {renderField("City", "shippingAddress.city")}
                                    {renderField("State", "shippingAddress.state")}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {renderField("Postal Code", "shippingAddress.postalCode")}
                                    {renderField("Country", "shippingAddress.country")}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Lines Section */}
                    <div className="card">
                        <div className="card-header flex items-center justify-between">
                            <h2 className="card-title">Order Lines</h2>
                            {!isViewMode && (
                                <button
                                    type="button"
                                    onClick={addLine}
                                    className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                                >
                                    Add Line
                                </button>
                            )}
                        </div>
                        <div className="card-body p-0">
                            <div className="relative w-full overflow-auto">
                                <table className="table">
                                    <thead className="table-header">
                                        <tr className="table-row">
                                            <th className="table-head">Item</th>
                                            <th className="table-head">Units</th>
                                            <th className="table-head">Quantity</th>
                                            <th className="table-head">Price</th>
                                            <th className="table-head">Amount</th>
                                            {!isViewMode && <th className="table-head w-[100px]">Actions</th>}
                                        </tr>
                                    </thead>
                                    <tbody className="table-body">
                                        {formData.lines.map((line, index) => (
                                            <tr key={index} className="table-row">
                                                <td className="table-cell">
                                                    {isViewMode ? (
                                                        line.item
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            value={line.item}
                                                            onChange={(e) => handleLineChange(index, 'item', e.target.value)}
                                                            className="form-input"
                                                            required
                                                        />
                                                    )}
                                                </td>
                                                <td className="table-cell">
                                                    {isViewMode ? (
                                                        line.units
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            value={line.units}
                                                            onChange={(e) => handleLineChange(index, 'units', e.target.value)}
                                                            className="form-input"
                                                            required
                                                        />
                                                    )}
                                                </td>
                                                <td className="table-cell">
                                                    {isViewMode ? (
                                                        line.quantity
                                                    ) : (
                                                        <input
                                                            type="number"
                                                            value={line.quantity}
                                                            onChange={(e) => handleLineChange(index, 'quantity', e.target.value)}
                                                            className="form-input"
                                                            min="0"
                                                            required
                                                        />
                                                    )}
                                                </td>
                                                <td className="table-cell">
                                                    {isViewMode ? (
                                                        line.price
                                                    ) : (
                                                        <input
                                                            type="number"
                                                            value={line.price}
                                                            onChange={(e) => handleLineChange(index, 'price', e.target.value)}
                                                            className="form-input"
                                                            min="0"
                                                            required
                                                        />
                                                    )}
                                                </td>
                                                <td className="table-cell">
                                                    {isViewMode ? (
                                                        line.amount
                                                    ) : (
                                                        <input
                                                            type="number"
                                                            value={line.amount}
                                                            onChange={(e) => handleLineChange(index, 'amount', e.target.value)}
                                                            className="form-input"
                                                            min="0"
                                                            required
                                                        />
                                                    )}
                                                </td>
                                                {!isViewMode && (
                                                    <td className="table-cell">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeLine(index)}
                                                            className="text-red-500 hover:text-red-600"
                                                        >
                                                            Remove
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order History Section - Only shown in view mode */}
                {isViewMode && formData.history?.length > 0 && (
                    <div className="w-1/3">
                        <div className="sticky top-4">
                            <OrderHistory history={formData.history} status={formData.status} />
                        </div>
                    </div>
                )}
            </div>

            {/* Form Actions */}
            {!isViewMode && (
                <div className="flex items-center justify-end mt-6">
                    <button
                        type="submit"
                        className="rounded-lg bg-blue-500 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                    >
                        Create Order
                    </button>
                </div>
            )}
        </form>
    );
};

export default OrderForm;