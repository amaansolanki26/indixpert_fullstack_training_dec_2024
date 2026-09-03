import api from "./api";

const getOrderId = (orderId) => {
    return orderId?.order_id || orderId?.id || orderId;
};

const buildOrderPayload = (payload) => {
    return {
        customer_id: Number(payload.customer_id),

        order_type: payload.order_type,

        order_status: payload.order_status || "On Process",

        subtotal: Number(payload.subtotal || 0),
        tax_amount: Number(payload.tax_amount || 0),
        discount_amount: Number(payload.discount_amount || 0),
        total_amount: Number(payload.total_amount || 0),

        items: Array.isArray(payload.items)
            ? payload.items.map((item) => ({
                menu_id: Number(item.menu_id),
                quantity: Number(item.quantity || 1),
                price: Number(item.price || 0),
                total_price: Number(item.total_price || 0),
                notes: item.notes || null,
            }))
            : [],

        dine_in_details: payload.dine_in_details || null,

        takeaway_details: payload.takeaway_details || null,

        online_details: payload.online_details || null,

        payment: payload.payment
            ? {
                payment_method: payload.payment.payment_method || "Cash",
                payment_status: payload.payment.payment_status || "Pending",
                transaction_id: payload.payment.transaction_id || null,
            }
            : null,
    };
};

export const orderService = {
    // Get all orders
    getOrders: () => api.get("/orders"),

    // Get single order details
    getOrderDetails: (orderId) => {
        const id = getOrderId(orderId);
        return api.get(`/orders/${id}`);
    },

    // Get order items by order ID
    getOrderItemsByOrderId: (orderId) => {
        return api.get(`/orders/${orderId}/items`);
    },

    // Create order
    createOrder: (payload) => {
        const jsonPayload = buildOrderPayload(payload);

        return api.post("/orders", jsonPayload);
    },

    // Update order
    updateOrder: (orderId, payload) => {
        const id = getOrderId(orderId);
        const jsonPayload = buildOrderPayload(payload);

        return api.put(`/orders/${id}`, jsonPayload);
    },

    // Update only order status
    updateOrderStatus: (orderId, payload) => {
        return api.patch(
            `/orders/${orderId}/status`,
            payload
        );
    },

    // Cancel / delete order using delete route
    cancelOrder: (orderId) => {
        const id = getOrderId(orderId);
        return api.delete(`/orders/${id}`);
    },

    deleteOrder: (orderId) => {
        const id = getOrderId(orderId);
        return api.delete(`/orders/${id}`);
    },

    
    // Get order tracking information
    getOrderTracking: (orderId) => {
        return api.get(`/order-tracking/order/${orderId}`);
    },

    // Add order item
    addOrderItem: (orderId, payload) => {
        return api.post("/order-items", {
            order_id: Number(orderId),
            ...payload,
        });
    },

    // Update order item
    updateOrderItem: (orderItemId, payload) => {
        return api.put(`/order-items/${orderItemId}`, payload);
    },

    // Delete order item
    deleteOrderItem: (orderItemId) => {
        return api.delete(`/order-items/${orderItemId}`);
    },

    getTakeawayOrders: () => api.get("/takeaway-orders"),
};