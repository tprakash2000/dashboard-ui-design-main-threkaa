import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById } from "../../services/orderService";
import OrderForm from "../../components/OrderForm";

const ViewOrder = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const orderData = getOrderById(id);
        if (!orderData) {
            navigate("/order/list");
            return;
        }
        setOrder(orderData);
    }, [id, navigate]);

    const handleBack = () => {
        navigate("/order/list");
    };

    if (!order) return null;

    return (
        <OrderForm
            mode="view"
            initialData={order}
            onCancel={handleBack}
        />
    );
};

export default ViewOrder; 