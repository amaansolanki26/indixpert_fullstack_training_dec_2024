import api from "./api";

const getOrderId = (orderId) => {
    return orderId?.purchase_order_id || orderId?.id || orderId;
};

export const purchaseService = {
    /*
    |--------------------------------------------------------------------------
    | PURCHASE ORDERS CRUD & METRICS
    |--------------------------------------------------------------------------
    */

    // 1. Get all purchase orders with optional query params
    getPurchaseOrders: (params = {}) => api.get("/purchase-orders", { params }),

    // 2. Create new purchase order
    createPurchaseOrder: (payload) => api.post("/purchase-orders", payload),

    // 3. Get single purchase order by ID
    getPurchaseOrderById: (orderId) => {
        const id = getOrderId(orderId);
        return api.get(`/purchase-orders/${id}`);
    },

    // 4. Update purchase order
    updatePurchaseOrder: (orderId, payload) => {
        const id = getOrderId(orderId);
        return api.put(`/purchase-orders/${id}`, payload);
    },

    // 5. Delete purchase order
    deletePurchaseOrder: (orderId) => {
        const id = getOrderId(orderId);
        return api.delete(`/purchase-orders/${id}`);
    },

    // 6. Update Status (PATCH)
    updateOrderStatus: (orderId, status) => {
        const id = getOrderId(orderId);
        return api.patch(`/purchase-orders/${id}/status`, status); 
    },

    // 7. Mark Delivered (PATCH)
    markOrderDelivered: (orderId) => {
        const id = getOrderId(orderId);
        return api.patch(`/purchase-orders/${id}/deliver`);
    },

    // 8. Summary Cards data
    getPurchaseSummary: () => api.get("/purchase-orders/summary"),

    // 9. Chart Metrics data
    getPurchaseChart: () => api.get("/purchase-orders/chart"),

    updatePurchaseOrderStatus: function (orderId, payload) {
        return this.updateOrderStatus(orderId, payload);
    }
};