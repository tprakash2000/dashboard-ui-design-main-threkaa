import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../../services/orderService";
import OrderForm from "../../components/OrderForm";
import { ConfirmationModal } from "../../components/ConfirmationModal";
import Spinner from "../../components/Spinner";

const CreateOrder = () => {
    const navigate = useNavigate();
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState(null);

    const handleSubmit = (data) => {
        setFormData(data);
        setShowConfirmModal(true);
    };

    const handleConfirm = async () => {
        setShowConfirmModal(false);
        setIsLoading(true);

        // Simulate loading for 3 seconds
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        createOrder(formData);
        setIsLoading(false);
        navigate("/order/list");
    };

    const handleCancel = () => {
        navigate("/order/list");
    };

    const handleModalClose = () => {
        setShowConfirmModal(false);
    };

    return (
        <>
            <OrderForm
                mode="create"
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />
            
            <ConfirmationModal
                isOpen={showConfirmModal}
                onClose={handleModalClose}
                onConfirm={handleConfirm}
                title="Create Order"
                message="Are you sure you want to create this order?"
                confirmText="Create"
                cancelText="Cancel"
            />

            {isLoading && <Spinner />}
        </>
    );
};

export default CreateOrder; 