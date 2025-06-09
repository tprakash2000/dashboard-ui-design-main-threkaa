import ordersJson from "../../orders.json";

const STORAGE_KEY = 'orders';

// Initialize local storage with sample data if empty
const initializeStorage = () => {
    // Clear any existing data to ensure fresh data from orders.json
    localStorage.removeItem(STORAGE_KEY);
    
    // Add dueDate to each order (7 days from transaction date)
    const ordersWithDueDate = ordersJson.map(order => ({
        ...order,
        dueDate: new Date(new Date(order.transactionDate).setDate(new Date(order.transactionDate).getDate() + 7)).toISOString()
    }));
    
    // Set the data with due dates
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ordersWithDueDate));
};

// Get all orders
export const getOrders = () => {
    const storedOrders = localStorage.getItem(STORAGE_KEY);
    if (!storedOrders) {
        initializeStorage();
        return ordersJson;
    }
    return JSON.parse(storedOrders);
};

// Get order by ID
export const getOrderById = (orderId) => {
    const orders = getOrders();
    return orders.find(order => order.id === orderId || order.orderNumber === orderId);
};

// Create new order
export const createOrder = (orderData) => {
    try {
        const orders = getOrders();
        const newOrder = {
            ...orderData,
            id: orderData.orderNumber,
            createdAt: new Date().toISOString(),
            dueDate: new Date(new Date(orderData.transactionDate).setDate(new Date(orderData.transactionDate).getDate() + 7)).toISOString()
        };
        
        // Add to orders array
        orders.push(newOrder);
        
        // Update localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));

        return newOrder;
    } catch (error) {
        console.error('Error creating order:', error);
        throw new Error('Failed to create order');
    }
};

// Update order
export const updateOrder = (orderId, orderData) => {
    const orders = getOrders();
    const index = orders.findIndex(order => order.orderNumber === orderId);
    if (index !== -1) {
        orders[index] = { ...orders[index], ...orderData };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
        return orders[index];
    }
    return null;
};

// Delete order
export const deleteOrder = (orderId) => {
    const orders = getOrders();
    const filteredOrders = orders.filter(order => order.orderNumber !== orderId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredOrders));
}; 