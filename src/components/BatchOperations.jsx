import React, { useState } from 'react';
import { Trash2, Download, CheckCircle2, AlertTriangle } from 'lucide-react';
import { ConfirmationModal } from './ConfirmationModal';

const BatchOperations = ({ 
    selectedOrders, 
    onBatchStatusUpdate, 
    onBatchDelete, 
    onBatchExport 
}) => {
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {},
        confirmText: '',
        confirmButtonClass: ''
    });

    const handleStatusUpdate = (newStatus) => {
        setConfirmModal({
            isOpen: true,
            title: `Confirm ${newStatus}`,
            message: `Are you sure you want to update ${selectedOrders.length} orders to ${newStatus}? This action cannot be undone.`,
            onConfirm: () => onBatchStatusUpdate(selectedOrders, newStatus),
            confirmText: newStatus,
            confirmButtonClass: newStatus === 'Approved' 
                ? 'bg-green-500 hover:bg-green-600' 
                : 'bg-orange-500 hover:bg-orange-600'
        });
    };

    const handleDelete = () => {
        setConfirmModal({
            isOpen: true,
            title: 'Confirm Deletion',
            message: `Are you sure you want to delete ${selectedOrders.length} orders? This action cannot be undone.`,
            onConfirm: () => onBatchDelete(selectedOrders),
            confirmText: 'Delete',
            confirmButtonClass: 'bg-red-500 hover:bg-red-600'
        });
    };

    if (selectedOrders.length === 0) {
        return null;
    }

    return (
        <>
            <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transform rounded-lg border border-slate-200 bg-white p-4 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-center gap-x-4">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        {selectedOrders.length} orders selected
                    </span>
                    <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
                    <div className="flex items-center gap-x-2">
                        <button
                            onClick={() => handleStatusUpdate('Approved')}
                            className="flex items-center gap-x-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
                        >
                            <CheckCircle2 size={16} />
                            Approve
                        </button>
                        <button
                            onClick={() => handleStatusUpdate('Cancelled')}
                            className="flex items-center gap-x-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
                        >
                            <AlertTriangle size={16} />
                            Cancel
                        </button>
                        <button
                            onClick={onBatchExport}
                            className="flex items-center gap-x-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
                        >
                            <Download size={16} />
                            Export
                        </button>
                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-x-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
                        >
                            <Trash2 size={16} />
                            Delete
                        </button>
                    </div>
                </div>
            </div>

            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                confirmText={confirmModal.confirmText}
                confirmButtonClass={confirmModal.confirmButtonClass}
            />
        </>
    );
};

export default BatchOperations; 